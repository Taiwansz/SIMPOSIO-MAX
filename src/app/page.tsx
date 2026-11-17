"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  FileText,
  Home,
  Presentation,
  Radio,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import OverviewHub, { VeritasTab } from "@/components/OverviewHub";
import StudyNotebook from "@/components/StudyNotebook";
import AutopsyLab from "@/components/AutopsyLab";
import MutationTest from "@/components/MutationTest";
import LiveArena from "@/components/LiveArena";
import FacultyOverview from "@/components/FacultyOverview";
import { analyzeArenaState } from "@/lib/veritas-engine/arena";
import { buildMutationChallenge } from "@/lib/veritas-engine/mutation";
import {
  SEED_ARENA_RESPONSES,
  SEED_AUTHORSHIP_PROOFS,
  SEED_AUTOPSY_CASES,
  SEED_AUTOPSY_LOGS,
  SEED_COHORT_RESULTS,
  SEED_JURY_VOTES,
  SEED_STUDY_NOTES,
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
}

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
};

export default function HomePage() {
  const [state, setState] = useState<VeritasState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<VeritasTab>("home");
  const [noteMutationChallenge, setNoteMutationChallenge] =
    useState<MutationChallenge | null>(null);

  const loadState = useCallback(async () => {
    try {
      const res = await fetch("/api/state", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as VeritasState;
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
        tabParam === "faculty"
      ) {
        setActiveTab(tabParam);
      }
    }
  }, [loadState]);

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
    { id: "faculty", label: "Resultados", icon: BarChart3 },
  ];

  const solvedCount = state.autopsyLogs.filter((l) => l.solved).length;
  const verifiedCount = state.proofs.filter((p) => p.passed).length;

  const handleTestNoteInMutation = (noteContent: string, noteTitle: string) => {
    const ch = buildMutationChallenge(undefined, noteContent);
    setNoteMutationChallenge({ ...ch, artifactTitle: noteTitle || "Minha Anotacao" });
    setActiveTab("mutation");
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] pb-28 md:pb-14 md:pl-24">
      {/* Brilho sutil superior exclusivo em ThLoop Gold */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-48 left-1/2 h-[380px] w-[620px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.07] blur-[120px]"
      />

      {/* Dock Vertical Flutuante Desktop (Apple + Instagram Icon-First) */}
      <nav
        aria-label="Navegacao principal"
        className="apple-dock-glass fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full p-2.5 md:flex"
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
              className={`group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.94] ${
                isActive
                  ? "bg-[#C8B560] text-[#0A0A0A]"
                  : "text-[#F0EDE6]/65 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2 : 1.6} />
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
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
          className="group relative flex h-11 w-11 items-center justify-center rounded-full text-[#F0EDE6]/65 transition-all duration-300 apple-ease hover:bg-[#2A2A2A] hover:text-[#C8B560] active:scale-[0.94]"
        >
          <Presentation className="h-5 w-5" strokeWidth={1.6} />
          <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-2.5 py-1 text-xs font-medium text-[#F0EDE6] opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Apresentar
          </span>
        </Link>
      </nav>

      {/* Dock Inferior Mobile estilo Instagram (Apple Liquid Glass) */}
      <nav
        aria-label="Navegacao mobile"
        className="apple-dock-glass fixed bottom-4 left-4 right-4 z-40 flex items-center justify-around rounded-full px-2 py-2 md:hidden"
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
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 apple-ease active:scale-[0.92] ${
                isActive ? "bg-[#C8B560] text-[#0A0A0A]" : "text-[#F0EDE6]/65"
              }`}
            >
              <Icon className="h-4.5 w-4.5" strokeWidth={isActive ? 2 : 1.6} />
            </button>
          );
        })}

        <Link
          href="/apresentacao"
          aria-label="Apresentar"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#F0EDE6]/65"
        >
          <Presentation className="h-4.5 w-4.5" strokeWidth={1.6} />
        </Link>
      </nav>

      {/* Area Principal Limpa */}
      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-8 sm:pt-10">
        {/* Topbar Minimalista sem poluicao nem pilulas */}
        <header className="mb-10 flex items-center justify-between">
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
              <div className="flex items-center gap-1.5 text-[11px] text-[#F0EDE6]/45">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    state.supabaseConnected ? "bg-[#C8B560]" : "bg-[#5C5C5C]"
                  }`}
                />
                <span>{state.supabaseConnected ? "Nuvem ativa" : "Modo local"}</span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
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
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/80 transition hover:bg-[#C8B560] hover:text-[#0A0A0A] sm:flex"
            >
              <Presentation className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </header>

        {/* Visao Ativa com Transicao Apple */}
        <main key={activeTab} className="apple-view-enter">
          {activeTab === "home" && (
            <OverviewHub
              notesCount={state.studyNotes.length}
              solvedAutopsiesCount={solvedCount}
              verifiedProofsCount={verifiedCount}
              arenaOriginality={state.arenaAnalysis.originalityIndex}
              onNavigate={(tab) => setActiveTab(tab)}
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

          {activeTab === "faculty" && (
            <FacultyOverview
              cohortResults={state.cohortResults}
              juryVotes={state.juryVotes}
              onVoteSaved={loadState}
            />
          )}
        </main>
      </div>
    </div>
  );
}
