import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase/server";
import { analyzeArenaState } from "@/lib/veritas-engine/arena";
import {
  SEED_ARENA_RESPONSES,
  SEED_AUTHORSHIP_PROOFS,
  SEED_AUTOPSY_CASES,
  SEED_AUTOPSY_LOGS,
  SEED_COHORT_RESULTS,
  SEED_JURY_VOTES,
} from "@/lib/veritas-engine/seed-data";
import {
  ArenaResponse,
  AuthorshipProof,
  AutopsyCase,
  AutopsyLog,
  CohortResultWeek,
  JuryVote,
} from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseAdmin() || getSupabasePublic();

  let cases: AutopsyCase[] = SEED_AUTOPSY_CASES;
  let autopsyLogs: AutopsyLog[] = SEED_AUTOPSY_LOGS;
  let proofs: AuthorshipProof[] = SEED_AUTHORSHIP_PROOFS;
  let arenaResponses: ArenaResponse[] = SEED_ARENA_RESPONSES;
  let cohortResults: CohortResultWeek[] = SEED_COHORT_RESULTS;
  let juryVotes: JuryVote[] = SEED_JURY_VOTES;
  let supabaseConnected = false;

  if (supabase) {
    try {
      const [casesRes, logsRes, proofsRes, arenaRes, cohortRes, juryRes] =
        await Promise.all([
          supabase.from("veritas_autopsy_cases").select("*"),
          supabase
            .from("veritas_autopsy_logs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(12),
          supabase
            .from("veritas_authorship_proofs")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(12),
          supabase
            .from("veritas_arena_responses")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(30),
          supabase
            .from("veritas_cohort_results")
            .select("*")
            .order("week_number", { ascending: true }),
          supabase
            .from("veritas_jury_votes")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20),
        ]);

      if (!casesRes.error && casesRes.data && casesRes.data.length > 0) {
        cases = casesRes.data as AutopsyCase[];
        supabaseConnected = true;
      }
      if (!logsRes.error && logsRes.data) autopsyLogs = logsRes.data as AutopsyLog[];
      if (!proofsRes.error && proofsRes.data) proofs = proofsRes.data as AuthorshipProof[];
      if (!arenaRes.error && arenaRes.data && arenaRes.data.length > 0) {
        arenaResponses = arenaRes.data as ArenaResponse[];
      }
      if (!cohortRes.error && cohortRes.data && cohortRes.data.length > 0) {
        cohortResults = cohortRes.data as CohortResultWeek[];
      }
      if (!juryRes.error && juryRes.data) juryVotes = juryRes.data as JuryVote[];
    } catch {
      supabaseConnected = false;
    }
  }

  const arenaAnalysis = analyzeArenaState(arenaResponses);

  return NextResponse.json({
    supabaseConnected,
    cases,
    autopsyLogs,
    proofs,
    arenaResponses,
    arenaAnalysis,
    cohortResults,
    juryVotes,
  });
}
