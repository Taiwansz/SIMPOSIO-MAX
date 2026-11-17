import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase/server";
import { compileEDAGReport } from "@/lib/epistemic-engine/edag";
import { buildSpacedReviewSchedule, computeBrierCalibration } from "@/lib/epistemic-engine/bkt";
import {
  SEED_COHORT_METRICS,
  SEED_EDAG_NODES,
  SEED_ISOMORPHIC_SUBMISSIONS,
  SEED_JURY_FEEDBACK,
  SEED_SOCRATIC_LOGS,
  SEED_STUDENT_STATES,
} from "@/lib/epistemic-engine/seed-fallback";
import {
  CohortWeekMetric,
  EDAGNode,
  IsomorphicSubmission,
  JuryFeedback,
  SocraticLog,
  StudentNodeState,
} from "@/lib/epistemic-engine/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ra = request.nextUrl.searchParams.get("ra")?.trim() || "52319400";
  const supabase = getSupabaseAdmin() || getSupabasePublic();

  let nodes: EDAGNode[] = SEED_EDAG_NODES;
  let allStudentStates: StudentNodeState[] = SEED_STUDENT_STATES;
  let cohortMetrics: CohortWeekMetric[] = SEED_COHORT_METRICS;
  let socraticLogs: SocraticLog[] = SEED_SOCRATIC_LOGS;
  let submissions: IsomorphicSubmission[] = SEED_ISOMORPHIC_SUBMISSIONS;
  let juryFeedback: JuryFeedback[] = SEED_JURY_FEEDBACK;
  let supabaseConnected = false;

  if (supabase) {
    try {
      const [
        nodesRes,
        statesRes,
        cohortRes,
        logsRes,
        subsRes,
        juryRes,
      ] = await Promise.all([
        supabase.from("simposio_edag_nodes").select("*").order("semester", { ascending: true }),
        supabase.from("simposio_student_states").select("*"),
        supabase.from("simposio_cohort_metrics").select("*").order("week_number", { ascending: true }),
        supabase.from("simposio_socratic_logs").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("simposio_isomorphic_submissions").select("*").order("created_at", { ascending: false }).limit(15),
        supabase.from("simposio_jury_feedback").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      if (!nodesRes.error && nodesRes.data && nodesRes.data.length > 0) {
        nodes = nodesRes.data as EDAGNode[];
        supabaseConnected = true;
      }
      if (!statesRes.error && statesRes.data && statesRes.data.length > 0) {
        allStudentStates = statesRes.data as StudentNodeState[];
      }
      if (!cohortRes.error && cohortRes.data && cohortRes.data.length > 0) {
        cohortMetrics = cohortRes.data as CohortWeekMetric[];
      }
      if (!logsRes.error && logsRes.data) {
        socraticLogs = logsRes.data as SocraticLog[];
      }
      if (!subsRes.error && subsRes.data) {
        submissions = subsRes.data as IsomorphicSubmission[];
      }
      if (!juryRes.error && juryRes.data) {
        juryFeedback = juryRes.data as JuryFeedback[];
      }
    } catch {
      supabaseConnected = false;
    }
  }

  const studentStates = allStudentStates.filter((s) => s.ra === ra);
  const effectiveStates =
    studentStates.length > 0
      ? studentStates
      : nodes.map((n) => ({
          ra,
          student_name: ra === "52319400" ? "Matheus Sousa dos Santos" : `Discente RA ${ra}`,
          node_id: n.id,
          p_mastery: 0.25,
          p_transit: 0.2,
          p_guess: 0.14,
          p_slip: 0.12,
          stability_hours: 48,
          last_practiced_at: new Date().toISOString(),
          brier_score: 0.18,
          confidence_claimed: 0.5,
          attempts_count: 1,
        }));

  const edagReport = compileEDAGReport(nodes);
  const reviewSchedule = buildSpacedReviewSchedule(effectiveStates);

  const brierRecords = socraticLogs
    .filter((l) => l.ra === ra)
    .map((l) => ({
      confidenceClaimed: Number(l.confidence_declared),
      isCorrect: !l.bluff_detected && Number(l.causal_rigor_score) >= 58,
    }));

  const brierFromStates = effectiveStates.map((st) => ({
    confidenceClaimed: Number(st.confidence_claimed),
    isCorrect: Number(st.p_mastery) >= 0.7,
  }));

  const brierCalibration = computeBrierCalibration(
    brierRecords.length >= 2 ? brierRecords : brierFromStates
  );

  // Agrupamento de alunos para Console de Protagonismo Docente
  const studentsSummaryMap = new Map<
    string,
    {
      ra: string;
      studentName: string;
      avgMastery: number;
      avgBrier: number;
      dkAlerts: number;
      nodesCount: number;
    }
  >();

  for (const st of allStudentStates) {
    const existing = studentsSummaryMap.get(st.ra) ?? {
      ra: st.ra,
      studentName: st.student_name,
      avgMastery: 0,
      avgBrier: 0,
      dkAlerts: 0,
      nodesCount: 0,
    };
    existing.avgMastery += Number(st.p_mastery);
    existing.avgBrier += Number(st.brier_score);
    if (Number(st.confidence_claimed) - Number(st.p_mastery) >= 0.3) {
      existing.dkAlerts += 1;
    }
    existing.nodesCount += 1;
    studentsSummaryMap.set(st.ra, existing);
  }

  const cohortStudents = Array.from(studentsSummaryMap.values()).map((s) => ({
    ra: s.ra,
    studentName: s.studentName,
    avgMastery: Number((s.avgMastery / Math.max(1, s.nodesCount)).toFixed(3)),
    avgBrier: Number((s.avgBrier / Math.max(1, s.nodesCount)).toFixed(3)),
    dkAlerts: s.dkAlerts,
    nodesCount: s.nodesCount,
  }));

  return NextResponse.json({
    supabaseConnected,
    ra,
    nodes,
    studentStates: effectiveStates,
    cohortStudents,
    cohortMetrics,
    socraticLogs,
    submissions,
    juryFeedback,
    edagReport,
    reviewSchedule,
    brierCalibration,
  });
}
