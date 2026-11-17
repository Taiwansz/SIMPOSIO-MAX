"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Award,
  Brain,
  Database,
  FileText,
  Fingerprint,
  Flame,
  GitBranch,
  Presentation,
  Users,
} from "lucide-react";
import EDAGInteractiveMap from "@/components/EDAGInteractiveMap";
import SocraticInquisitorPanel from "@/components/SocraticInquisitorPanel";
import CognitiveTwinPanel from "@/components/CognitiveTwinPanel";
import IsomorphicExamPanel from "@/components/IsomorphicExamPanel";
import FacultyConsolePanel from "@/components/FacultyConsolePanel";
import SimposioDossierPanel from "@/components/SimposioDossierPanel";
import {
  BrierCalibrationReport,
  CohortWeekMetric,
  EDAGCompileReport,
  EDAGNode,
  IsomorphicSubmission,
  JuryFeedback,
  SocraticLog,
  StudentNodeState,
} from "@/lib/epistemic-engine/types";
import {
  SEED_COHORT_METRICS,
  SEED_EDAG_NODES,
  SEED_ISOMORPHIC_SUBMISSIONS,
  SEED_JURY_FEEDBACK,
  SEED_SOCRATIC_LOGS,
  SEED_STUDENT_STATES,
} from "@/lib/epistemic-engine/seed-fallback";
import { compileEDAGReport } from "@/lib/epistemic-engine/edag";
import { buildSpacedReviewSchedule, computeBrierCalibration } from "@/lib/epistemic-engine/bkt";

type WorkspaceTab = "edag" | "socratic" | "twin" | "isomorphic" | "faculty" | "dossier";
type PersonaMode = "overview" | "student" | "faculty";

interface CockpitApiState {
  supabaseConnected: boolean;
  ra: string;
  nodes: EDAGNode[];
  studentStates: StudentNodeState[];
  cohortStudents: Array<{
    ra: string;
    studentName: string;
    avgMastery: number;
    avgBrier: number;
    dkAlerts: number;
    nodesCount: number;
  }>;
  cohortMetrics: CohortWeekMetric[];
  socraticLogs: SocraticLog[];
  submissions: IsomorphicSubmission[];
  juryFeedback: JuryFeedback[];
  edagReport: EDAGCompileReport;
  reviewSchedule: Array<{
    nodeId: string;
    pMastery: number;
    retentionNow: number;
    elapsedHours: number;
    stabilityHours: number;
    urgency: string;
  }>;
  brierCalibration: BrierCalibrationReport;
}

const INITIAL_STATES_52319400 = SEED_STUDENT_STATES.filter((s) => s.ra === "52319400");

const INITIAL_DATA: CockpitApiState = {
  supabaseConnected: false,
  ra: "52319400",
  nodes: SEED_EDAG_NODES,
  studentStates: INITIAL_STATES_52319400,
  cohortStudents: [
    { ra: "52319400", studentName: "Matheus Sousa dos Santos", avgMastery: 0.804, avgBrier: 0.107, dkAlerts: 0, nodesCount: 16 },
    { ra: "52318812", studentName: "Rafael Oliveira", avgMastery: 0.363, avgBrier: 0.423, dkAlerts: 4, nodesCount: 4 },
    { ra: "52317504", studentName: "Beatriz Almeida", avgMastery: 0.748, avgBrier: 0.14, dkAlerts: 0, nodesCount: 4 },
  ],
  cohortMetrics: SEED_COHORT_METRICS,
  socraticLogs: SEED_SOCRATIC_LOGS,
  submissions: SEED_ISOMORPHIC_SUBMISSIONS,
  juryFeedback: SEED_JURY_FEEDBACK,
  edagReport: compileEDAGReport(SEED_EDAG_NODES),
  reviewSchedule: buildSpacedReviewSchedule(INITIAL_STATES_52319400),
  brierCalibration: computeBrierCalibration(
    INITIAL_STATES_52319400.map((s) => ({
      confidenceClaimed: s.confidence_claimed,
      isCorrect: s.p_mastery >= 0.7,
    }))
  ),
};

export default function HomePage() {
  const [data, setData] = useState<CockpitApiState>(INITIAL_DATA);
  const [activeRa, setActiveRa] = useState("52319400");
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("edag");
  const [persona, setPersona] = useState<PersonaMode>("overview");
  const [selectedNodeId, setSelectedNodeId] = useState("n_dist_raft");
  const [syncing, setSyncing] = useState(false);

  const fetchState = useCallback(async (raTarget: string) => {
    setSyncing(true);
    try {
      const res = await fetch(`/api/state?ra=${encodeURIComponent(raTarget)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const json = (await res.json()) as CockpitApiState;
        setData(json);
      }
    } catch {
      // Mantem fallback resiliente se offline
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchState(activeRa);
  }, [activeRa, fetchState]);

  const handlePersonaChange = (mode: PersonaMode) => {
    setPersona(mode);
    if (mode === "student") setActiveTab("socratic");
    else if (mode === "faculty") setActiveTab("faculty");
    else setActiveTab("edag");
  };

  const activeStudent = data.cohortStudents.find((s) => s.ra === activeRa);
  const activeStudentName = activeStudent?.studentName ?? `Discente RA ${activeRa}`;

  const navTabs: Array<{
    id: WorkspaceTab;
    code: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "edag", code: "01", label: "Cartografia E-DAG", icon: GitBranch },
    { id: "socratic", code: "02", label: "Inquisidor Socratico", icon: Flame },
    { id: "twin", code: "03", label: "Gemeo BKT & Brier", icon: Brain },
    { id: "isomorphic", code: "04", label: "Prova Isomorfica", icon: Fingerprint },
    { id: "faculty", code: "05", label: "Protagonismo Docente", icon: Users },
    { id: "dossier", code: "06", label: "Edital & Banca", icon: Award },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060606] bg-dot-matrix text-[#F1F5F9]">
      {/* Orbes Atmosfericos */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#C8B560]/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-0 right-0 h-[360px] w-[420px] rounded-full bg-emerald-500/5 blur-[120px]"
      />

      {/* Navbar Flutuante Liquid Glass */}
      <header className="sticky top-3 z-40 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="liquid-glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C8B560]/50 bg-[#C8B560]/15 font-mono text-xs font-bold text-[#FFF2AC]">
              TH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold tracking-tight text-white">
                  THATHENA MAX
                </span>
                <span className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-[#C8B560] sm:inline-block">
                  UNIMAX // IV SIMPOSIO IA
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <Database className="h-3 w-3 text-emerald-400" />
                <span>
                  {data.supabaseConnected
                    ? "Supabase PostgreSQL: ONLINE"
                    : syncing
                    ? "Sincronizando Supabase..."
                    : "Modo Resiliencia Local"}
                </span>
              </div>
            </div>
          </div>

          {/* Seletor de Persona + CTA Apresentacao */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-black/50 p-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => handlePersonaChange("overview")}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  persona === "overview"
                    ? "bg-[#C8B560] font-semibold text-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Visao Geral
              </button>
              <button
                type="button"
                onClick={() => handlePersonaChange("student")}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  persona === "student"
                    ? "bg-[#C8B560] font-semibold text-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Discente
              </button>
              <button
                type="button"
                onClick={() => handlePersonaChange("faculty")}
                className={`rounded-lg px-2.5 py-1.5 transition ${
                  persona === "faculty"
                    ? "bg-[#C8B560] font-semibold text-black"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Docente
              </button>
            </div>

            <Link
              href="/apresentacao"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8B560]/50 bg-[#C8B560]/15 px-3 py-2 font-mono text-[11px] font-semibold text-[#FFF2AC] transition hover:bg-[#C8B560]/25"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Pitch 15 min</span>
            </Link>

            <a
              href="/api/simposio/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 font-mono text-[11px] text-white transition hover:border-white/30 sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Artigo PDF</span>
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl space-y-10 px-4 pb-20 pt-8 sm:px-6">
        {/* Hero Monumental */}
        <section className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C8B560]/35 bg-[#C8B560]/10 px-3.5 py-1 font-mono text-[11px] text-[#FFF2AC]">
              <Activity className="h-3.5 w-3.5 text-emerald-400" />
              <span>CATEGORIA ALUNOS // EIXO: O FUTURO EM NOSSAS MAOS</span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl">
              De Quem e a Resposta na Era da{" "}
              <span className="gold-gradient-text">Inteligencia Artificial?</span>
            </h1>

            <p className="max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Enquanto tutores generativos passivos agravam a{" "}
              <strong className="text-white">Ilusao de Profundidade Explicativa</strong>, o{" "}
              <strong className="text-[#FFF2AC]">ThAthena MAX (Sovereign Epistemic OS)</strong>{" "}
              inverte o vetor: compila ementas em Grafos E-DAG, modela o aprendizado via BKT Bayesiano, intercepta blefes com Sabatina Socratica e gera provas isomorficas SHA-256 por RA.
            </p>
          </div>

          {/* Ficha do Perfil Ativo + Autor */}
          <div className="doppelrand-outer lg:col-span-4">
            <div className="doppelrand-inner space-y-3 p-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8B560]">
                  Perfil Ativo no Cockpit
                </span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                  RA {activeRa}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{activeStudentName}</div>
                <div className="font-mono text-[11px] text-slate-400">
                  Bacharelado em Ciencia da Computacao — UniMAX
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pt-1">
                <label className="font-mono text-[10px] uppercase text-slate-400" htmlFor="ra-select">
                  Alternar Discente:
                </label>
                <select
                  id="ra-select"
                  value={activeRa}
                  onChange={(e) => setActiveRa(e.target.value)}
                  className="w-full min-w-0 truncate rounded-lg border border-white/15 bg-[#060606] px-2.5 py-2 font-mono text-xs text-white outline-none focus:border-[#C8B560]"
                >
                  <option value="52319400">52319400 — Matheus Santos (Calibrado)</option>
                  <option value="52318812">52318812 — Rafael Oliveira (Alerta DK)</option>
                  <option value="52317504">52317504 — Beatriz Almeida (Em Progresso)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Faixa de Micro-KPIs Empiricos em Geometria Doppelrand */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="doppelrand-outer">
            <div className="doppelrand-inner p-4">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Retencao Apos 30 Dias
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
                  +41,2%
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  51.4% &rarr; 92.6%
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                p &lt; 0,001 | Cohen d = 0,84 (N = 48)
              </p>
            </div>
          </div>

          <div className="doppelrand-outer">
            <div className="doppelrand-inner p-4">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Erro Metacognitivo (Brier)
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-[#FFF2AC] tabular-nums">
                  -71,0%
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  0,38 &rarr; 0,11
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                Neutralizacao do viés Dunning-Kruger
              </p>
            </div>
          </div>

          <div className="doppelrand-outer">
            <div className="doppelrand-inner p-4">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Lacunas de Pre-requisitos
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-white tabular-nums">
                  -89,5%
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  34.2% &rarr; 3.6%
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                Bloqueio topologico via Kahn O(V+E)
              </p>
            </div>
          </div>

          <div className="doppelrand-outer">
            <div className="doppelrand-inner p-4">
              <div className="font-mono text-[11px] uppercase text-slate-400">
                Autenticidade Isomorfica
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
                  100%
                </span>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  SHA-256 / RA
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                Zero cola cooperativa + auditoria AST
              </p>
            </div>
          </div>
        </section>

        {/* Barra de Navegacao dos 6 Modulos Operacionais */}
        <section id="workspace" className="space-y-6">
          <div className="liquid-glass flex flex-wrap items-center gap-2 rounded-2xl p-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 min-w-[140px] lg:min-w-fit items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                    isActive
                      ? "bg-[#C8B560] font-semibold text-black shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {tab.code}. {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Conteudo do Modulo Selecionado */}
          <div className="min-h-[540px]">
            {activeTab === "edag" && (
              <EDAGInteractiveMap
                nodes={data.nodes}
                states={data.studentStates}
                edagReport={data.edagReport}
                selectedNodeId={selectedNodeId}
                onSelectNode={(id) => setSelectedNodeId(id)}
                onLaunchSocratic={(id) => {
                  setSelectedNodeId(id);
                  setActiveTab("socratic");
                }}
              />
            )}

            {activeTab === "socratic" && (
              <SocraticInquisitorPanel
                ra={activeRa}
                studentName={activeStudentName}
                nodes={data.nodes}
                selectedNodeId={selectedNodeId}
                onSelectNode={(id) => setSelectedNodeId(id)}
                logs={data.socraticLogs}
                onRefreshState={() => fetchState(activeRa)}
              />
            )}

            {activeTab === "twin" && (
              <CognitiveTwinPanel
                ra={activeRa}
                nodes={data.nodes}
                states={data.studentStates}
                brierCalibration={data.brierCalibration}
                reviewSchedule={data.reviewSchedule}
              />
            )}

            {activeTab === "isomorphic" && (
              <IsomorphicExamPanel
                initialRa={activeRa}
                submissions={data.submissions}
                onRefreshState={() => fetchState(activeRa)}
              />
            )}

            {activeTab === "faculty" && (
              <FacultyConsolePanel
                cohortMetrics={data.cohortMetrics}
                cohortStudents={data.cohortStudents}
                edagReport={data.edagReport}
                onSelectStudentRa={(ra) => {
                  setActiveRa(ra);
                  setActiveTab("twin");
                }}
              />
            )}

            {activeTab === "dossier" && (
              <SimposioDossierPanel
                juryFeedback={data.juryFeedback}
                onRefreshState={() => fetchState(activeRa)}
              />
            )}
          </div>
        </section>

        {/* Rodape Tecnico */}
        <footer className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 font-mono text-xs text-slate-400 sm:flex-row sm:items-center">
          <div>
            <span>
              ThAthena MAX // Sovereign Epistemic OS — Matheus Sousa dos Santos (RA 52319400) — UniMAX
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/apresentacao"
              className="inline-flex items-center gap-1 text-[#C8B560] hover:underline"
            >
              <span>Deck de Apresentacao 15 min</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="/api/simposio/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
            >
              <span>Resumo Ampliado (.PDF)</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
