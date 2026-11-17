import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  buildMutationChallenge,
  verifyMutationDefense,
} from "@/lib/veritas-engine/mutation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body.action ?? "verify");
    const challengeId = typeof body.challengeId === "string" ? body.challengeId : undefined;
    const customText = typeof body.customText === "string" ? body.customText : undefined;

    const challenge = buildMutationChallenge(challengeId, customText);

    if (action === "generate") {
      return NextResponse.json({ challenge });
    }

    const studentName = String(body.studentName ?? "Matheus Sousa dos Santos").trim();
    const ra = String(body.ra ?? "52319400").trim();
    const selectedLine = Number(body.selectedLine ?? -1);
    const selectedFixId = String(body.selectedFixId ?? "");
    const elapsedSeconds = Math.max(1, Number(body.elapsedSeconds ?? 15));

    const result = verifyMutationDefense({
      ra,
      challenge,
      selectedLine,
      selectedFixId,
      elapsedSeconds,
    });

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from("veritas_authorship_proofs").insert({
        student_name: studentName,
        ra,
        artifact_title: challenge.artifactTitle,
        mutated_line: challenge.mutatedLineIndex,
        elapsed_seconds: elapsedSeconds,
        passed: result.passed,
        proof_hash: result.proofHash,
      });
    }

    return NextResponse.json({
      result,
      persisted: Boolean(supabase),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao verificar autoria." },
      { status: 500 }
    );
  }
}
