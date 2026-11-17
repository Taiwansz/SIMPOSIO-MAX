"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  LogIn,
  LogOut,
  Presentation,
  Radio,
  ScanSearch,
  ShieldCheck,
  SlidersHorizontal,
  UserCheck,
  Users,
} from "lucide-react";
import AccountSettingsCenter from "@/components/AccountSettingsCenter";
import AuthGatewayModal, { DemoAccountSummary } from "@/components/AuthGatewayModal";
import AutopsyLab from "@/components/AutopsyLab";
import ClassroomManager from "@/components/ClassroomManager";
import FacultyOverview from "@/components/FacultyOverview";
import LiveArena from "@/components/LiveArena";
import MutationTest from "@/components/MutationTest";
import OverviewHub, { VeritasTab } from "@/components/OverviewHub";
import StudyNotebook from "@/components/StudyNotebook";
import UserProfileView from "@/components/UserProfileView";
import { analyzeArenaState } from "@/lib/veritas-engine/arena";
import {
  ProjectedUserProfile,
  projectUserProfileForViewer,
  sanitizeUserForClient,
} from "@/lib/veritas-engine/identity-rbac";
import { buildMutationChallenge } from "@/lib/veritas-engine/mutation";
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
  ArenaAnalysis,
  ArenaResponse,
  AuthorshipProof,
  AutopsyCase,
  AutopsyLog,
  CohortResultWeek,
  JuryVote,
  MutationChallenge,
  StudyNote,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasSession,
  VeritasUser,
} from "@/lib/veritas-engine/types";

interface VeritasState {
  supabaseConnected: boolean;
  cases: AutopsyCase[];
  autopsyLogs: AutopsyLog[];
  proofs: AuthorshipProof[];
  arenaResponses: ArenaResponse[];
  arenaAnalysis: ArenaAnalysis;
  cohortResults: CohortResultWeek[];
  juryVotes: JuryVote[];
  studyNotes: StudyNote[];
  currentUser: VeritasUser | null;
  currentSessionId: string | null;
  demoAccounts: DemoAccountSummary[];
  users: ProjectedUserProfile[];
  adminUsers: VeritasUser[];
  classes: VeritasClass[];
  enrollments: VeritasEnrollment[];
  sessions: VeritasSession[];
  activityLogs: VeritasActivityLog[];
}

const INITIAL_USER = sanitizeUserForClient(SEED_USERS[0]);

const INITIAL_STATE: VeritasState = {
  supabaseConnected: false,
  cases: SEED_AUTOPSY_CASES,
  autopsyLogs: SEED_AUTOPSY_LOGS,
  proofs: SEED_AUTHORSHIP_PROOFS,
  arenaResponses: SEED_ARENA_RESPONSES,
  arenaAnalysis: analyzeArenaState(SEED_ARENA_RESPONSES),
  cohortResults: SEED_COHORT_RESULTS,
  juryVotes: SEED_JURY_VOTES,
  studyNotes: SEED_STUDY_NOTES,
  currentUser: INITIAL_USER,
  currentSessionId: SEED_SESSIONS[0].id,
  demoAccounts: SEED_USERS.map((u) => ({
    id: u.id,
    full_name: u.full_name,
    role: u.role,
    email: u.email,
    identification_code: u.identification_code,
  })),
  users: SEED_USERS.map((u) => projectUserProfileForViewer(u, INITIAL_USER, true)),
  adminUsers: [],
  classes: SEED_CLASSES,
  enrollments: SEED_ENROLLMENTS,
  sessions: SEED_SESSIONS.filter((s) => s.user_id === INITIAL_USER.id),
  activityLogs: SEED_ACTIVITY_LOGS,
};

export default function HomePage() {
  const [state, setState] = useState<VeritasState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<VeritasTab>("home");
  const [noteMutationChallenge, setNoteMutationChallenge] =
    useState<MutationChallenge | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const bootstrappedRef = useRef(false);

  const loadState = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as VeritasState;
        if (
          !json.currentUser &&
          !bootstrappedRef.current &&
          typeof window !== "undefined" &&
          window.sessionStorage.getItem("veritas_logged_out") !== "1"
        ) {
          bootstrappedRef.current = true;
          const bootRes = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "login",
              quickSwitchUserId: SEED_USERS[0].id,
            }),
          });
          if (bootRes.ok) {
            const refreshed = await fetch("/api/state", { cache: "no-store" });
            if (refreshed.ok) {
              setState((await refreshed.json()) as VeritasState);
              return;
            }
          }
        }
        setState(json);
      }
    } catch {
      // Mantem estado de fallback resiliente
    }
  }, []);

  useEffect(() => {
    loadState();
    if (typeof window !== "undefined") {
      const tabParam = new URLSearchParams(window.location.search).get("tab");
      if (
        tabParam === "notebook" ||
        tabParam === "autopsy" ||
        tabParam === "mutation" ||
        tabParam === "arena" ||
        tabParam === "faculty" ||
        tabParam === "classes" ||
        tabParam === "profile" ||
        tabParam === "settings"
      ) {
        setActiveTab(tabParam);
      }
    }
  }, [loadState]);

  const appearance = state.currentUser?.appearance_settings;
  const resolvedTheme = useMemo(() => {
    const pref = appearance?.theme ?? "dark";
    if (pref === "light") return "light";
    if (pref === "dark") return "dark";
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    }
    return "dark";
  }, [appearance?.theme]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = resolvedTheme;
    }
  }, [resolvedTheme]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("veritas_logged_out", "1");
    }
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    await loadState();
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("veritas_logged_out");
    }
    await loadState();
  };

  const dockItems: Array<{
    id: VeritasTab;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }> = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "notebook", label: "Caderno", icon: BookOpen },
    { id: "autopsy", label: "Raio-X da IA", icon: ScanSearch },
    { id: "mutation", label: "Teste de Autoria", icon: ShieldCheck },
    { id: "arena", label: "Arena ao Vivo", icon: Radio },
    { id: "classes", label: "Turmas", icon: Users },
    { id: "profile", label: "Perfil", icon: UserCheck },
    { id: "faculty", label: "Resultados", icon: BarChart3 },
    { id: "settings", label: "Ajustes", icon: SlidersHorizontal },
  ];

  const solvedCount = state.autopsyLogs.filter((l) => l.solved).length;
  const verifiedCount = state.proofs.filter((p) => p.passed).length;

  const handleTestNoteInMutation = (noteContent: string, noteTitle: string) => {
    const ch = buildMutationChallenge(undefined, noteContent);
    setNoteMutationChallenge({ ...ch, artifactTitle: noteTitle || "Minha Anotacao" });
    setActiveTab("mutation");
  };

  return (
    <div
      data-theme={resolvedTheme}
      data-contrast={appearance?.high_contrast ? "high" : "normal"}
      data-compact={appearance?.compact_mode ? "true" : "false"}
      data-reduced-motion={appearance?.reduced_motion ? "true" : "false"}
      className="relative min-h-[100dvh] bg-[#0A0A0A] pb-28 text-[#F0EDE6] md:pb-14 md:pl-24"
    >
      {/* Brilho sutil superior exclusivo em ThLoop Gold */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-48 left-1/2 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.07] blur-[120px]"
      />

      {/* Dock Vertical Flutuante Desktop (Apple + Instagram Icon-First) */}
      <nav
        aria-label="Navegacao principal"
        className="apple-dock-glass fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1.5 rounded-full p-2 md:flex"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              title={item.label}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.94] ${
                isActive
                  ? "bg-[#C8B560] text-[#0A0A0A]"
                  : "text-[#F0EDE6]/65 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2 : 1.6} />
              <span className="pointer-events-none absolute left-13 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="my-1 h-px w-6 bg-[#5C5C5C]/40" />

        <Link
          href="/apresentacao"
          aria-label="Apresentar"
          title="Apresentar"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[#F0EDE6]/65 transition-all duration-300 apple-ease hover:bg-[#2A2A2A] hover:text-[#C8B560] active:scale-[0.94]"
        >
          <Presentation className="h-4.5 w-4.5" strokeWidth={1.6} />
          <span className="pointer-events-none absolute left-13 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Apresentar
          </span>
        </Link>
      </nav>

      {/* Dock Inferior Mobile estilo Instagram (Apple Liquid Glass) */}
      <nav
        aria-label="Navegacao mobile"
        className="apple-dock-glass fixed bottom-3 left-3 right-3 z-40 flex items-center justify-between rounded-full px-2 py-2 md:hidden"
      >
        {dockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              aria-label={item.label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.92] ${
                isActive ? "bg-[#C8B560] text-[#0A0A0A]" : "text-[#F0EDE6]/65"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={isActive ? 2 : 1.6} />
            </button>
          );
        })}
      </nav>

      {/* Area Principal Limpa */}
      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-8 sm:pt-10">
        {/* Topbar Minimalista com Sessao e Perfil Ativo */}
        <header className="mb-10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-sm font-bold text-[#C8B560]">
              V
            </span>
            <div>
              <div className="font-display text-sm font-semibold tracking-wide text-[#F0EDE6]">
                VERITAS
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-[#F0EDE6]/45">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    state.supabaseConnected ? "bg-[#C8B560]" : "bg-[#5C5C5C]"
                  }`}
                />
                <span>{state.supabaseConnected ? "Nuvem ativa" : "Modo local"}</span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            {state.currentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode("login");
                    setAuthModalOpen(true);
                  }}
                  aria-label="Trocar conta ou autenticar"
                  className="flex h-10 items-center gap-2 rounded-full bg-[#2A2A2A]/75 px-3.5 text-xs text-[#F0EDE6] transition hover:ring-1 hover:ring-[#C8B560]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#C8B560]" />
                  <span className="hidden max-w-[140px] truncate font-medium sm:inline">
                    {state.currentUser.social_name ||
                      state.currentUser.full_name.split(" ")[0]}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#C8B560]">
                    {state.currentUser.role}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Sair da conta"
                  title="Sair da conta"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/70 transition hover:text-[#C8B560]"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.6} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode("login");
                  setAuthModalOpen(true);
                }}
                className="flex h-10 items-center gap-2 rounded-full bg-[#C8B560] px-4 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Entrar</span>
              </button>
            )}

            <a
              href="/api/simposio/pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir Artigo PDF"
              title="Abrir Artigo PDF"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/80 transition hover:bg-[#2A2A2A] hover:text-[#C8B560]"
            >
              <FileText className="h-4 w-4" strokeWidth={1.6} />
            </a>
            <Link
              href="/apresentacao"
              aria-label="Modo Apresentacao"
              title="Modo Apresentacao"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/80 transition hover:bg-[#C8B560] hover:text-[#0A0A0A]"
            >
              <Presentation className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </header>

        {/* Visao Ativa com Transicao Apple */}
        <main key={activeTab} className="apple-view-enter">
          {activeTab === "home" && (
            <OverviewHub
              currentUser={state.currentUser}
              notesCount={state.studyNotes.length}
              solvedAutopsiesCount={solvedCount}
              verifiedProofsCount={verifiedCount}
              arenaOriginality={state.arenaAnalysis.originalityIndex}
              studyNotes={state.studyNotes}
              classes={state.classes}
              enrollments={state.enrollments}
              adminUsers={state.adminUsers}
              activityLogs={state.activityLogs}
              onNavigate={(tab) => setActiveTab(tab)}
              onRefreshState={loadState}
              onOpenAuth={() => {
                setAuthModalMode("login");
                setAuthModalOpen(true);
              }}
            />
          )}

          {activeTab === "notebook" && (
            <StudyNotebook
              notes={state.studyNotes}
              onNoteSaved={loadState}
              onTestNoteInMutation={handleTestNoteInMutation}
            />
          )}

          {activeTab === "autopsy" && (
            <AutopsyLab cases={state.cases} onSolved={loadState} />
          )}

          {activeTab === "mutation" && (
            <MutationTest
              initialChallenge={noteMutationChallenge}
              onProofSaved={loadState}
            />
          )}

          {activeTab === "arena" && (
            <LiveArena
              responses={state.arenaResponses}
              analysis={state.arenaAnalysis}
              onSubmitted={(arenaResponses, arenaAnalysis) =>
                setState((prev) => ({ ...prev, arenaResponses, arenaAnalysis }))
              }
            />
          )}

          {activeTab === "classes" && (
            <ClassroomManager
              currentUser={state.currentUser}
              classes={state.classes}
              enrollments={state.enrollments}
              onRefreshState={loadState}
              onRequireAuth={() => {
                setAuthModalMode("login");
                setAuthModalOpen(true);
              }}
            />
          )}

          {activeTab === "profile" && (
            <UserProfileView
              currentUser={state.currentUser}
              directoryProfiles={state.users}
              classes={state.classes}
              enrollments={state.enrollments}
              notes={state.studyNotes}
              autopsyLogs={state.autopsyLogs}
              proofs={state.proofs}
              arenaResponses={state.arenaResponses}
              activityLogs={state.activityLogs}
              onGoToSettings={() => setActiveTab("settings")}
            />
          )}

          {activeTab === "faculty" && (
            <FacultyOverview
              cohortResults={state.cohortResults}
              juryVotes={state.juryVotes}
              onVoteSaved={loadState}
            />
          )}

          {activeTab === "settings" && (
            <AccountSettingsCenter
              currentUser={state.currentUser}
              adminUsers={state.adminUsers}
              sessions={state.sessions}
              activityLogs={state.activityLogs}
              onRefreshState={loadState}
              onRequireAuth={() => {
                setAuthModalMode("login");
                setAuthModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      <AuthGatewayModal
        open={authModalOpen}
        initialMode={authModalMode}
        demoAccounts={state.demoAccounts}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthSuccess}
      />
    </div>
  );
}
