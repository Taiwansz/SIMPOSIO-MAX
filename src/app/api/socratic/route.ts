import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { SEED_EDAG_NODES } from "@/lib/epistemic-engine/seed-fallback";
import { analyzeEpistemicRigor } from "@/lib/epistemic-engine/inquisitor";
import { updateBKT } from "@/lib/epistemic-engine/bkt";
import { enrichSocraticProbeWithLLM } from "@/lib/epistemic-engine/llm-bridge";
import { EDAGNode } from "@/lib/epistemic-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ra = String(body.ra ?? "52319400").trim() || "52319400";
    const studentName = String(body.studentName ?? (ra === "52319400" ? "Matheus Sousa dos Santos" : `Discente RA ${ra}`));
    const nodeId = String(body.nodeId ?? "n_mutex_lock");
    const studentArgument = String(body.studentArgument ?? "").trim();
    const confidenceDeclared = Math.max(0, Math.min(1, Number(body.confidenceDeclared ?? 0.75)));
    const customApiKey = typeof body.customApiKey === "string" ? body.customApiKey : undefined;

    if (!studentArgument) {
      return NextResponse.json(
        { error: "O argumento discente nao pode estar vazio." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    let targetNode: EDAGNode | undefined = SEED_EDAG_NODES.find((n) => n.id === nodeId);

    if (supabase) {
      const { data } = await supabase
        .from("simposio_edag_nodes")
        .select("*")
        .eq("id", nodeId)
        .maybeSingle();
      if (data) targetNode = data as EDAGNode;
    }

    if (!targetNode) {
      return NextResponse.json(
        { error: `Conceito '${nodeId}' nao localizado no grafo E-DAG.` },
        { status: 404 }
      );
    }

    // 1. Analise rigorosa deterministica (deteccao de blefe + rigor causal + paradoxo)
    const rigorAnalysis = analyzeEpistemicRigor(studentArgument, targetNode, confidenceDeclared);

    // 2. Recuperar estado previo BKT do estudante no Supabase (ou fallback)
    let priorMastery = 0.5;
    let stabilityHours = 48;
    let attemptsCount = 0;

    if (supabase) {
      const { data: stateRow } = await supabase
        .from("simposio_student_states")
        .select("*")
        .eq("ra", ra)
        .eq("node_id", nodeId)
        .maybeSingle();
      if (stateRow) {
        priorMastery = Number(stateRow.p_mastery);
        stabilityHours = Number(stateRow.stability_hours);
        attemptsCount = Number(stateRow.attempts_count);
      }
    }

    // 3. Atualizacao Bayesiana O(1) e curva de Ebbinghaus
    const bktUpdate = updateBKT(
      priorMastery,
      rigorAnalysis.isVerifiedCorrect,
      confidenceDeclared,
      targetNode.bloom_level,
      stabilityHours
    );

    // Calculo do erro Brier pontual desta interacao
    const outcome = rigorAnalysis.isVerifiedCorrect ? 1 : 0;
    const turnBrier = Number(Math.pow(confidenceDeclared - outcome, 2).toFixed(4));

    // 4. Enriquecimento hibrido (LLM se chave valida disponivel, fallback deterministico instantaneo)
    const llmResult = await enrichSocraticProbeWithLLM({
      node: targetNode,
      studentArgument,
      confidenceDeclared,
      rigorAnalysis,
      customApiKey,
    });

    // 5. Persistencia no Supabase PostgreSQL
    let persistedLog = null;
    if (supabase) {
      const { data: insertedLog } = await supabase
        .from("simposio_socratic_logs")
        .insert({
          ra,
          node_id: nodeId,
          student_argument: studentArgument,
          confidence_declared: confidenceDeclared,
          causal_rigor_score: rigorAnalysis.causalRigorScore,
          bluff_detected: rigorAnalysis.bluffDetected,
          bloom_reached: rigorAnalysis.bloomReached,
          inquisitor_response: llmResult.responseText,
          counter_example: rigorAnalysis.counterExample,
          provider_used: llmResult.providerUsed,
        })
        .select()
        .single();

      persistedLog = insertedLog;

      await supabase.from("simposio_student_states").upsert(
        {
          ra,
          student_name: studentName,
          node_id: nodeId,
          p_mastery: bktUpdate.nextMastery,
          p_transit: bktUpdate.pTransit,
          p_guess: bktUpdate.pGuess,
          p_slip: bktUpdate.pSlip,
          stability_hours: bktUpdate.newStabilityHours,
          last_practiced_at: new Date().toISOString(),
          brier_score: turnBrier,
          confidence_claimed: confidenceDeclared,
          attempts_count: attemptsCount + 1,
        },
        { onConflict: "ra,node_id" }
      );
    }

    return NextResponse.json({
      rigorAnalysis,
      bktUpdate,
      turnBrier,
      inquisitorResponse: llmResult.responseText,
      providerUsed: llmResult.providerUsed,
      persistedToSupabase: Boolean(supabase),
      log: persistedLog,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar sabatina socratica." },
      { status: 500 }
    );
  }
}
