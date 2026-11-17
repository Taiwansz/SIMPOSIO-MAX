import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { runInterdisciplinaryDefense } from "@/lib/epistemic-engine/faculty-swarm";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode = String(body.mode ?? "defense");
    const supabase = getSupabaseAdmin();

    if (mode === "jury_feedback") {
      const evaluatorName = String(body.evaluatorName ?? "").trim();
      const evaluatorRole = String(body.evaluatorRole ?? "Comite Cientifico UniMAX").trim();
      const innovationScore = Math.max(0, Math.min(2, Number(body.innovationScore ?? 2)));
      const pedagogicalScore = Math.max(0, Math.min(4, Number(body.pedagogicalScore ?? 4)));
      const impactScore = Math.max(0, Math.min(4, Number(body.impactScore ?? 4)));
      const comments = String(body.comments ?? "").trim();

      if (!evaluatorName || !comments) {
        return NextResponse.json(
          { error: "Informe o nome do avaliador e o parecer tecnico." },
          { status: 400 }
        );
      }

      let record = null;
      if (supabase) {
        const { data, error } = await supabase
          .from("simposio_jury_feedback")
          .insert({
            evaluator_name: evaluatorName,
            evaluator_role: evaluatorRole,
            innovation_score: innovationScore,
            pedagogical_score: pedagogicalScore,
            impact_score: impactScore,
            comments,
          })
          .select()
          .single();
        if (!error) record = data;
      }

      return NextResponse.json({
        saved: Boolean(record),
        feedback: record ?? {
          id: `local-${Date.now()}`,
          evaluator_name: evaluatorName,
          evaluator_role: evaluatorRole,
          innovation_score: innovationScore,
          pedagogical_score: pedagogicalScore,
          impact_score: impactScore,
          comments,
          created_at: new Date().toISOString(),
        },
      });
    }

    const projectTitle = String(body.projectTitle ?? "Arquitetura Epistemica Concorrente");
    const studentProposal = String(body.studentProposal ?? "").trim();
    const baselineApprovalCount = Number(body.baselineApprovalCount ?? 1);

    if (!studentProposal) {
      return NextResponse.json(
        { error: "Descreva a arquitetura ou tese para submissao a banca multidisciplinar." },
        { status: 400 }
      );
    }

    const result = runInterdisciplinaryDefense(
      projectTitle,
      studentProposal,
      baselineApprovalCount
    );
    return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro na camara de banca." },
      { status: 500 }
    );
  }
}
