import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { evaluateAutopsyFix } from "@/lib/veritas-engine/autopsy";
import { SEED_AUTOPSY_CASES } from "@/lib/veritas-engine/seed-data";
import { AutopsyCase } from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const caseId = String(body.caseId ?? "case_comp_pix");
    const selectedLine = Number(body.selectedLine ?? -1);
    const selectedFixId = String(body.selectedFixId ?? "");
    const studentName = String(body.studentName ?? "Matheus Sousa dos Santos").trim();
    const ra = String(body.ra ?? "52319400").trim();

    const supabase = getSupabaseAdmin();
    let targetCase: AutopsyCase | undefined = SEED_AUTOPSY_CASES.find(
      (c) => c.id === caseId
    );

    if (supabase) {
      const { data } = await supabase
        .from("veritas_autopsy_cases")
        .select("*")
        .eq("id", caseId)
        .maybeSingle();
      if (data) targetCase = data as AutopsyCase;
    }

    if (!targetCase) {
      return NextResponse.json({ error: "Caso nao encontrado." }, { status: 404 });
    }

    const evaluation = evaluateAutopsyFix(targetCase, selectedLine, selectedFixId);

    if (supabase) {
      await supabase.from("veritas_autopsy_logs").insert({
        student_name: studentName,
        ra,
        case_id: caseId,
        selected_line: selectedLine,
        selected_fix_id: selectedFixId,
        solved: evaluation.solved,
      });
    }

    return NextResponse.json({
      evaluation,
      persisted: Boolean(supabase),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao verificar diagnostico." },
      { status: 500 }
    );
  }
}
