import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  generateIsomorphicChallenge,
  gradeIsomorphicSubmission,
} from "@/lib/epistemic-engine/isomorphic";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action ?? "generate");
    const ra = String(body.ra ?? "52319400").trim() || "52319400";
    const topicId = String(body.topicId ?? "concurrency_saturation");

    const challenge = generateIsomorphicChallenge(ra, topicId);

    if (action === "generate") {
      return NextResponse.json({ challenge });
    }

    const submittedNumeric = Number(body.submittedNumeric);
    const submittedCode = String(body.submittedCode ?? "");
    const grade = gradeIsomorphicSubmission(challenge, submittedNumeric, submittedCode);

    const supabase = getSupabaseAdmin();
    let savedRecord = null;
    if (supabase) {
      const { data } = await supabase
        .from("simposio_isomorphic_submissions")
        .insert({
          ra,
          exam_hash: challenge.examHash,
          topic_id: challenge.topicId,
          parameters_json: challenge.parameters,
          submitted_code: submittedCode,
          submitted_numeric: Number.isFinite(submittedNumeric) ? submittedNumeric : 0,
          ast_invariants_passed: grade.astInvariantsPassed,
          analytical_score: grade.analyticalScore,
          verdict: grade.verdict,
          diagnostics: grade.diagnostics,
        })
        .select()
        .single();
      savedRecord = data;
    }

    return NextResponse.json({
      challenge,
      grade,
      persistedToSupabase: Boolean(supabase && savedRecord),
      submission: savedRecord,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao processar prova isomorfica." },
      { status: 500 }
    );
  }
}
