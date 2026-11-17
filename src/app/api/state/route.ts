import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase/server";
import { analyzeArenaState } from "@/lib/veritas-engine/arena";
import {
  projectUserProfileForViewer,
  sanitizeUserForClient,
} from "@/lib/veritas-engine/identity-rbac";
import { resolveAuthenticatedUser } from "@/lib/veritas-engine/server-auth";
import {
  SEED_ACTIVITY_LOGS,
  SEED_ARENA_RESPONSES,
  SEED_AUTHORSHIP_PROOFS,
  SEED_AUTOPSY_CASES,
  SEED_AUTOPSY_LOGS,
  SEED_CLASSES,
  SEED_COHORT_RESULTS,
  SEED_ENROLLMENTS,
  SEED_JURY_VOTES,
  SEED_SESSIONS,
  SEED_STUDY_NOTES,
  SEED_USERS,
} from "@/lib/veritas-engine/seed-data";
import {
  ArenaResponse,
  AuthorshipProof,
  AutopsyCase,
  AutopsyLog,
  CohortResultWeek,
  JuryVote,
  StudyNote,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasSession,
  VeritasUser,
} from "@/lib/veritas-engine/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adminClient = getSupabaseAdmin();
  const supabase = adminClient || getSupabasePublic();

  let cases: AutopsyCase[] = SEED_AUTOPSY_CASES;
  let autopsyLogs: AutopsyLog[] = SEED_AUTOPSY_LOGS;
  let proofs: AuthorshipProof[] = SEED_AUTHORSHIP_PROOFS;
  let arenaResponses: ArenaResponse[] = SEED_ARENA_RESPONSES;
  let cohortResults: CohortResultWeek[] = SEED_COHORT_RESULTS;
  let juryVotes: JuryVote[] = SEED_JURY_VOTES;
  let studyNotes: StudyNote[] = SEED_STUDY_NOTES;

  let rawUsers: VeritasUser[] = SEED_USERS;
  let rawClasses: VeritasClass[] = SEED_CLASSES;
  let rawEnrollments: VeritasEnrollment[] = SEED_ENROLLMENTS;
  let rawSessions: VeritasSession[] = SEED_SESSIONS;
  let rawActivityLogs: VeritasActivityLog[] = SEED_ACTIVITY_LOGS;
  let supabaseConnected = false;

  if (supabase) {
    try {
      const [
        casesRes,
        logsRes,
        proofsRes,
        arenaRes,
        cohortRes,
        juryRes,
        notesRes,
        usersRes,
        classesRes,
        enrollRes,
        sessionsRes,
        activityRes,
      ] = await Promise.all([
        supabase.from("veritas_autopsy_cases").select("*"),
        supabase
          .from("veritas_autopsy_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("veritas_authorship_proofs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
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
        supabase
          .from("veritas_study_notes")
          .select("*")
          .order("exam_days_left", { ascending: true })
          .limit(30),
        adminClient
          ? adminClient
              .from("veritas_users")
              .select("*")
              .order("created_at", { ascending: true })
          : Promise.resolve({ data: null, error: null }),
        supabase
          .from("veritas_classes")
          .select("*")
          .order("created_at", { ascending: true }),
        adminClient
          ? adminClient
              .from("veritas_class_enrollments")
              .select("*")
              .order("requested_at", { ascending: false })
          : Promise.resolve({ data: null, error: null }),
        adminClient
          ? adminClient
              .from("veritas_sessions")
              .select("*")
              .order("last_seen_at", { ascending: false })
          : Promise.resolve({ data: null, error: null }),
        adminClient
          ? adminClient
              .from("veritas_activity_logs")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(40)
          : Promise.resolve({ data: null, error: null }),
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
      if (!notesRes.error && notesRes.data && notesRes.data.length > 0) {
        studyNotes = notesRes.data as StudyNote[];
      }
      if (!usersRes.error && usersRes.data && usersRes.data.length > 0) {
        rawUsers = usersRes.data as VeritasUser[];
      }
      if (!classesRes.error && classesRes.data && classesRes.data.length > 0) {
        rawClasses = classesRes.data as VeritasClass[];
      }
      if (!enrollRes.error && enrollRes.data) {
        rawEnrollments = enrollRes.data as VeritasEnrollment[];
      }
      if (!sessionsRes.error && sessionsRes.data) {
        rawSessions = sessionsRes.data as VeritasSession[];
      }
      if (!activityRes.error && activityRes.data) {
        rawActivityLogs = activityRes.data as VeritasActivityLog[];
      }
    } catch {
      supabaseConnected = false;
    }
  }

  const authCtx = await resolveAuthenticatedUser(request, adminClient);
  const currentUser = authCtx.user ? sanitizeUserForClient(authCtx.user) : null;
  const currentSession = authCtx.session;
  const isAdmin = currentUser?.role === "administrador";

  // Mapa de turmas em que o visualizador participa ou leciona para regra de privacidade "turma"
  const viewerClassIds = new Set<string>();
  if (currentUser) {
    for (const c of rawClasses) {
      if (c.responsible_teacher_id === currentUser.id) viewerClassIds.add(c.id);
    }
    for (const e of rawEnrollments) {
      if (e.student_id === currentUser.id && e.membership_status === "aprovado") {
        viewerClassIds.add(e.class_id);
      }
    }
  }

  const visibleClasses = rawClasses.filter(
    (c) =>
      c.status !== "arquivada" ||
      isAdmin ||
      (currentUser && c.responsible_teacher_id === currentUser.id)
  );

  const visibleEnrollments = rawEnrollments.filter((e) => {
    if (isAdmin) return true;
    const cls = rawClasses.find((c) => c.id === e.class_id);
    if (currentUser && cls?.responsible_teacher_id === currentUser.id) return true;
    if (currentUser && e.student_id === currentUser.id) return true;
    return e.membership_status === "aprovado";
  });

  const directoryProfiles = rawUsers
    .filter((u) => isAdmin || u.account_status !== "excluida")
    .map((u) => {
      const sharesClass =
        viewerClassIds.size > 0 &&
        (rawEnrollments.some(
          (e) =>
            e.student_id === u.id &&
            e.membership_status === "aprovado" &&
            viewerClassIds.has(e.class_id)
        ) ||
          rawClasses.some(
            (c) =>
              c.responsible_teacher_id === u.id && viewerClassIds.has(c.id)
          ));
      return projectUserProfileForViewer(u, currentUser, sharesClass);
    });

  const adminUsers = isAdmin ? rawUsers.map(sanitizeUserForClient) : [];

  const visibleSessions = isAdmin
    ? rawSessions.map((s) => ({ ...s, session_token: "protegido" }))
    : currentUser
    ? rawSessions
        .filter((s) => s.user_id === currentUser.id)
        .map((s) => ({
          ...s,
          session_token:
            currentSession?.id === s.id ? "sessao-atual" : "dispositivo-vinculado",
        }))
    : [];

  const visibleActivityLogs = isAdmin
    ? rawActivityLogs
    : currentUser
    ? rawActivityLogs.filter(
        (l) =>
          l.user_id === currentUser.id ||
          l.action_type === "turma_comunicado" ||
          l.action_type === "autoria_selo"
      )
    : rawActivityLogs.filter((l) => l.action_type === "autoria_selo");

  const demoAccounts = SEED_USERS.filter((u) => u.account_status === "ativa").map(
    (u) => ({
      id: u.id,
      full_name: u.full_name,
      role: u.role,
      email: u.email,
      identification_code: u.identification_code,
    })
  );

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
    studyNotes,
    currentUser,
    currentSessionId: currentSession?.id ?? null,
    demoAccounts,
    users: directoryProfiles,
    adminUsers,
    classes: visibleClasses,
    enrollments: visibleEnrollments,
    sessions: visibleSessions,
    activityLogs: visibleActivityLogs,
  });
}
