"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Home,
  LogIn,
  LogOut,
  MoreHorizontal,
  Palette,
  Presentation,
  Radio,
  ScanSearch,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserCheck,
  Users,
  X,
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

export default function DashboardPage() {
  const router = useRouter();
  const [state, setState] = useState<VeritasState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<VeritasTab>("home");
  const [noteMutationChallenge, setNoteMutationChallenge] =
    useState<MutationChallenge | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  // Menus consolidados
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

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
      // Estado de fallback resiliente
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

  // Teclas de atalho
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setMoreMenuOpen(false);
        setNotificationsOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    setUserMenuOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("veritas_logged_out", "1");
    }
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    await loadState();
    router.push("/login");
  };

  const handleAuthSuccess = async () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("veritas_logged_out");
    }
    await loadState();
  };

  const handleTestNoteInMutation = (noteContent: string, noteTitle: string) => {
    const ch = buildMutationChallenge(undefined, noteContent);
    setNoteMutationChallenge({ ...ch, artifactTitle: noteTitle || "Minha Anotacao" });
    setActiveTab("mutation");
  };

  const solvedCount = state.autopsyLogs.filter((l) => l.solved).length;
  const verifiedCount = state.proofs.filter((p) => p.passed).length;

  const primaryDockItems: Array<{
    id: VeritasTab;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }> = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "notebook", label: "Estudos", icon: BookOpen },
    { id: "classes", label: "Turmas", icon: Users },
  ];

  const isSecondaryActive = useMemo(() => {
    return ["autopsy", "mutation", "arena", "faculty"].includes(activeTab);
  }, [activeTab]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: Array<{
      id: string;
      category: string;
      title: string;
      subtitle: string;
      onClick: () => void;
    }> = [];

    state.studyNotes.forEach((n) => {
      if (
        n.note_title.toLowerCase().includes(q) ||
        n.subject_name.toLowerCase().includes(q) ||
        n.note_content.toLowerCase().includes(q)
      ) {
        results.push({
          id: `note-${n.id}`,
          category: "Caderno de Estudos",
          title: n.note_title,
          subtitle: `${n.subject_name} • Prova em ${n.exam_days_left} dias`,
          onClick: () => {
            setActiveTab("notebook");
            setSearchOpen(false);
          },
        });
      }
    });

    state.classes.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
      ) {
        results.push({
          id: `class-${c.id}`,
          category: "Turmas",
          title: c.name,
          subtitle: `Codigo: ${c.code} • Prof. ${c.responsible_teacher_name}`,
          onClick: () => {
            setActiveTab("classes");
            setSearchOpen(false);
          },
        });
      }
    });

    state.cases.forEach((cs) => {
      if (
        cs.title.toLowerCase().includes(q) ||
        cs.area.toLowerCase().includes(q) ||
        cs.summary.toLowerCase().includes(q)
      ) {
        results.push({
          id: `case-${cs.id}`,
          category: "Raio-X de IA",
          title: cs.title,
          subtitle: `${cs.area} • Gatilho: ${cs.trigger_param_name}`,
          onClick: () => {
            setActiveTab("autopsy");
            setSearchOpen(false);
          },
        });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, state.studyNotes, state.classes, state.cases]);

  return (
    <div
      data-theme={resolvedTheme}
      data-contrast={appearance?.high_contrast ? "high" : "normal"}
      data-compact={appearance?.compact_mode ? "true" : "false"}
      data-reduced-motion={appearance?.reduced_motion ? "true" : "false"}
      className="relative min-h-[100dvh] bg-[#0A0A0A] pb-24 text-[#F0EDE6] md:pb-14 md:pl-24"
    >
      {/* Brilho superior ThLoop Gold */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-48 left-1/2 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.07] blur-[120px]"
      />

      {/* 1. NAVBAR LATERAL DESKTOP (4 BOTOES VISIVEIS) */}
      <nav
        aria-label="Navegacao principal"
        className="apple-dock-glass fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full p-2.5 md:flex"
      >
        {primaryDockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMoreMenuOpen(false);
              }}
              aria-label={item.label}
              title={item.label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.93] ${
                isActive
                  ? "bg-[#C8B560] text-[#0A0A0A] shadow-md shadow-[#C8B560]/20"
                  : "text-[#F0EDE6]/65 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.7} />
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          );
        })}

        <div className="my-0.5 h-px w-6 bg-[#5C5C5C]/40" />

        {/* 4o Botao: Menu 'Mais' */}
        <button
          type="button"
          onClick={() => setMoreMenuOpen((prev) => !prev)}
          aria-label="Mais ferramentas"
          title="Mais opcoes"
          className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.93] ${
            moreMenuOpen || isSecondaryActive
              ? "bg-[#2A2A2A] text-[#C8B560] ring-1 ring-[#C8B560]/40"
              : "text-[#F0EDE6]/65 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
          {isSecondaryActive && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#C8B560]" />
          )}
          <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Mais
          </span>
        </button>
      </nav>

      {/* 2. DOCK INFERIOR MOBILE (4 BOTOES VISIVEIS) */}
      <nav
        aria-label="Navegacao mobile"
        className="apple-dock-glass fixed bottom-3 left-4 right-4 z-40 flex items-center justify-around rounded-full px-3 py-2.5 md:hidden"
      >
        {primaryDockItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMoreMenuOpen(false);
              }}
              aria-label={item.label}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.90] ${
                isActive
                  ? "bg-[#C8B560] text-[#0A0A0A] shadow-md shadow-[#C8B560]/20"
                  : "text-[#F0EDE6]/65"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2.2 : 1.7} />
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMoreMenuOpen((prev) => !prev)}
          aria-label="Mais opcoes"
          className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.90] ${
            moreMenuOpen || isSecondaryActive
              ? "bg-[#2A2A2A] text-[#C8B560] ring-1 ring-[#C8B560]/50"
              : "text-[#F0EDE6]/65"
          }`}
        >
          <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={1.8} />
          {isSecondaryActive && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C8B560]" />
          )}
        </button>
      </nav>

      {/* MENU 'MAIS' (DRAWER DESKTOP E SHEET MOBILE) */}
      {moreMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de ferramentas secundarias"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center md:pl-28"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl border border-[#2A2A2A] bg-[#141414] p-6 shadow-2xl transition-all duration-300 md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div>
                <h3 className="font-display text-sm font-semibold text-[#F0EDE6]">
                  Ferramentas & Recursos
                </h3>
                <p className="text-xs text-[#F0EDE6]/50">
                  Exames forenses, avaliacao e submissao oficial
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]/70 transition hover:text-[#F0EDE6]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C8B560]">
                  Exames de IA & Autoria
                </span>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("autopsy");
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      activeTab === "autopsy"
                        ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                        : "border-[#2A2A2A] bg-[#1E1E1E]/60 text-[#F0EDE6] hover:border-[#5C5C5C]"
                    }`}
                  >
                    <ScanSearch className="h-5 w-5 shrink-0 text-[#C8B560]" />
                    <div>
                      <div className="text-xs font-semibold">Raio-X da IA</div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Colapso de modelos reais
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("mutation");
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      activeTab === "mutation"
                        ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                        : "border-[#2A2A2A] bg-[#1E1E1E]/60 text-[#F0EDE6] hover:border-[#5C5C5C]"
                    }`}
                  >
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#C8B560]" />
                    <div>
                      <div className="text-xs font-semibold">Teste de 60s</div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Selo SHA-256 de autoria
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("arena");
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      activeTab === "arena"
                        ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                        : "border-[#2A2A2A] bg-[#1E1E1E]/60 text-[#F0EDE6] hover:border-[#5C5C5C]"
                    }`}
                  >
                    <Radio className="h-5 w-5 shrink-0 text-[#C8B560]" />
                    <div>
                      <div className="text-xs font-semibold">Arena da Sala</div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Mapa 2D e efeito manada
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("faculty");
                      setMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      activeTab === "faculty"
                        ? "border-[#C8B560] bg-[#C8B560]/10 text-[#C8B560]"
                        : "border-[#2A2A2A] bg-[#1E1E1E]/60 text-[#F0EDE6] hover:border-[#5C5C5C]"
                    }`}
                  >
                    <BarChart3 className="h-5 w-5 shrink-0 text-[#C8B560]" />
                    <div>
                      <div className="text-xs font-semibold">Resultados & Banca</div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Auditoria de 16 semanas
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t border-[#2A2A2A] pt-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F0EDE6]/50">
                  Simposio UniMAX & Apresentacao
                </span>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Link
                    href="/apresentacao"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E]/60 p-3 text-left text-xs font-medium text-[#F0EDE6] transition hover:border-[#C8B560]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Presentation className="h-4 w-4 text-[#C8B560]" />
                      <span>Deck de 15 Minutos</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-[#5C5C5C]" />
                  </Link>

                  <a
                    href="/api/simposio/pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-[#2A2A2A] bg-[#1E1E1E]/60 p-3 text-left text-xs font-medium text-[#F0EDE6] transition hover:border-[#C8B560]"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-[#C8B560]" />
                      <span>Artigo Oficial (.PDF)</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-[#5C5C5C]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE BUSCA GLOBAL */}
      {searchOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Busca global na plataforma"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/65 p-4 pt-20 backdrop-blur-sm sm:pt-28"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-[#2A2A2A] bg-[#141414] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3">
              <Search className="h-4 w-4 text-[#C8B560]" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar anotações, turmas, casos da IA..."
                className="w-full bg-transparent text-sm text-[#F0EDE6] placeholder-[#F0EDE6]/35 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-[#5C5C5C] hover:text-[#F0EDE6]"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="mt-4 max-h-72 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1.5">
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={r.onClick}
                      className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-[#1E1E1E]"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#F0EDE6]">
                          {r.title}
                        </div>
                        <div className="text-[11px] text-[#F0EDE6]/45">
                          {r.subtitle}
                        </div>
                      </div>
                      <span className="rounded-md bg-[#2A2A2A] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#C8B560]">
                        {r.category}
                      </span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.trim() ? (
                <div className="py-8 text-center text-xs text-[#F0EDE6]/40">
                  Nenhum resultado encontrado para &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#F0EDE6]/35">
                  Digite para buscar anotações do caderno, turmas ativas ou simulações
                  de IA.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Area Principal Limpa */}
      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-8 sm:pt-10">
        {/* 4. BARRA SUPERIOR (TOPBAR: 4 ELEMENTOS) */}
        <header className="mb-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              title="Voltar para a página inicial pública"
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-sm font-bold text-[#C8B560] shadow-sm transition hover:scale-105"
            >
              T
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("home");
                    setMoreMenuOpen(false);
                  }}
                  className="font-display text-sm font-semibold tracking-wide text-[#F0EDE6] hover:text-[#C8B560]"
                >
                  Thinka <span className="text-xs font-normal text-[#C8B560]">// VERITAS</span>
                </button>
                <Link
                  href="/"
                  className="hidden items-center gap-1 text-[11px] text-[#F0EDE6]/45 hover:text-[#C8B560] sm:inline-flex"
                  title="Ver landing page institucional"
                >
                  <span>(Site público)</span>
                </Link>
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
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Abrir pesquisa"
              title="Pesquisar (Ctrl+K)"
              className="flex h-10 items-center gap-2 rounded-full bg-[#2A2A2A]/70 px-3.5 text-xs text-[#F0EDE6]/60 transition hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
            >
              <Search className="h-3.5 w-3.5 text-[#C8B560]" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden rounded bg-[#1A1A1A] px-1.5 py-0.5 text-[10px] font-mono text-[#5C5C5C] sm:inline">
                ⌘K
              </kbd>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setUserMenuOpen(false);
                }}
                aria-label="Notificacoes"
                title="Notificacoes"
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/70 transition hover:bg-[#2A2A2A] hover:text-[#C8B560]"
              >
                <Bell className="h-4 w-4" strokeWidth={1.7} />
                {unreadNotifications > 0 && (
                  <span className="absolute right-2 top-2 flex h-2 w-2 items-center justify-center rounded-full bg-[#C8B560]" />
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-4 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="mb-3 flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                    <span className="text-xs font-semibold text-[#F0EDE6]">
                      Notificações
                    </span>
                    {unreadNotifications > 0 && (
                      <button
                        type="button"
                        onClick={() => setUnreadNotifications(0)}
                        className="text-[11px] text-[#C8B560] hover:underline"
                      >
                        Marcar lidas
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="rounded-xl bg-[#1E1E1E] p-2.5">
                      <div className="font-medium text-[#F0EDE6]">
                        Prova em 3 dias: Banco de Dados
                      </div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Copiloto crítico detectou lacunas em saques concorrentes.
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#1E1E1E] p-2.5">
                      <div className="font-medium text-[#F0EDE6]">
                        Turma CC-BD2: Atualização do Mural
                      </div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Profa. Helena Martins publicou nova atividade prática.
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#1E1E1E] p-2.5">
                      <div className="font-medium text-[#F0EDE6]">
                        Selo de Autoria Emitido
                      </div>
                      <div className="text-[11px] text-[#F0EDE6]/50">
                        Prova SHA-256 gravada com sucesso em 19s.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {state.currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setUserMenuOpen((prev) => !prev);
                    setNotificationsOpen(false);
                  }}
                  aria-label="Abrir menu da conta"
                  className="flex h-10 items-center gap-2 rounded-full bg-[#2A2A2A]/75 px-3.5 text-xs text-[#F0EDE6] transition hover:ring-1 hover:ring-[#C8B560]"
                >
                  <span className="h-2 w-2 rounded-full bg-[#C8B560]" />
                  <span className="hidden max-w-[130px] truncate font-medium sm:inline">
                    {state.currentUser.social_name ||
                      state.currentUser.full_name.split(" ")[0]}
                  </span>
                  <span className="font-mono text-[10px] uppercase text-[#C8B560]">
                    {state.currentUser.role}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-3 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="border-b border-[#2A2A2A] px-2 pb-3 pt-1">
                      <div className="truncate text-xs font-semibold text-[#F0EDE6]">
                        {state.currentUser.full_name}
                      </div>
                      <div className="truncate text-[11px] text-[#F0EDE6]/45">
                        {state.currentUser.email}
                      </div>
                      <span className="mt-1.5 inline-block rounded-full bg-[#C8B560]/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#C8B560]">
                        Perfil: {state.currentUser.role}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("profile");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                      >
                        <UserCheck className="h-4 w-4 text-[#C8B560]" />
                        <span>Meu Perfil</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("settings");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                      >
                        <SlidersHorizontal className="h-4 w-4 text-[#C8B560]" />
                        <span>Configurações</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("settings");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#C8B560]" />
                        <span>Segurança & 2FA</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab("settings");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                      >
                        <Palette className="h-4 w-4 text-[#C8B560]" />
                        <span>Aparência & Estudo</span>
                      </button>

                      <div className="my-1.5 border-t border-[#2A2A2A]" />

                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAuthModalMode("login");
                          setAuthModalOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#C8B560]"
                      >
                        <Users className="h-4 w-4 text-[#C8B560]" />
                        <span>Alternar Conta / Demonstração</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4 text-red-400/80" />
                        <span>Encerrar Sessão</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex h-10 items-center gap-2 rounded-full bg-[#C8B560] px-4 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <LogIn className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </header>

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
              onNavigate={(tab) => {
                setActiveTab(tab);
                setMoreMenuOpen(false);
              }}
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
              onRequireAuth={() => router.push("/login")}
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
              onRequireAuth={() => router.push("/login")}
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
