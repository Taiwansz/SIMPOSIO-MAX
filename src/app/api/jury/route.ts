import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const evaluatorName = String(body.evaluatorName ?? "").trim();
    const innovationScore = Math.max(0, Math.min(2, Number(body.innovationScore ?? 2)));
    const pedagogicalScore = Math.max(0, Math.min(4, Number(body.pedagogicalScore ?? 4)));
    const impactScore = Math.max(0, Math.min(4, Number(body.impactScore ?? 4)));
    const note = String(body.note ?? "").trim();

    if (!evaluatorName || !note) {
      return NextResponse.json(
        { error: "Informe nome e comentario para registrar a nota." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    let vote = {
      id: `local-${Date.now()}`,
      evaluator_name: evaluatorName,
      innovation_score: innovationScore,
      pedagogical_score: pedagogicalScore,
      impact_score: impactScore,
      note,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data } = await supabase
        .from("veritas_jury_votes")
        .insert({
          evaluator_name: evaluatorName,
          innovation_score: innovationScore,
          pedagogical_score: pedagogicalScore,
          impact_score: impactScore,
          note,
        })
        .select()
        .single();
      if (data) vote = data;
    }

    return NextResponse.json({ vote, persisted: Boolean(supabase) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao registrar avaliacao." },
      { status: 500 }
    );
  }
}
