import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { analyzeArenaState, projectResponseToArena } from "@/lib/veritas-engine/arena";
import { SEED_ARENA_RESPONSES } from "@/lib/veritas-engine/seed-data";
import { ArenaResponse } from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const participantName = String(body.participantName ?? "").trim() || "Participante";
    const role = String(body.role ?? "Estudante").trim();
    const responseText = String(body.responseText ?? "").trim();

    if (responseText.length < 8) {
      return NextResponse.json(
        { error: "Escreva uma resposta curta com pelo menos 8 caracteres." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    let existing: ArenaResponse[] = SEED_ARENA_RESPONSES;

    if (supabase) {
      const { data } = await supabase
        .from("veritas_arena_responses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(30);
      if (data && data.length > 0) existing = data as ArenaResponse[];
    }

    const projected = projectResponseToArena(responseText, existing);

    let inserted: ArenaResponse = {
      id: `local-${Date.now()}`,
      session_code: "UNIMAX-2026",
      participant_name: participantName,
      role,
      response_text: responseText,
      coord_x: projected.coordX,
      coord_y: projected.coordY,
      uniqueness_score: projected.uniquenessScore,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data } = await supabase
        .from("veritas_arena_responses")
        .insert({
          session_code: "UNIMAX-2026",
          participant_name: participantName,
          role,
          response_text: responseText,
          coord_x: projected.coordX,
          coord_y: projected.coordY,
          uniqueness_score: projected.uniquenessScore,
        })
        .select()
        .single();
      if (data) inserted = data as ArenaResponse;
    }

    const allResponses = [inserted, ...existing];
    const arenaAnalysis = analyzeArenaState(allResponses);

    return NextResponse.json({
      entry: inserted,
      arenaResponses: allResponses,
      arenaAnalysis,
      persisted: Boolean(supabase),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao enviar para arena." },
      { status: 500 }
    );
  }
}
