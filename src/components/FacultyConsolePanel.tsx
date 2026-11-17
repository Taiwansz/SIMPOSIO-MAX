"use client";

import React, { useMemo, useState } from "react";
import { BarChart3, Scale, ShieldCheck, Users } from "lucide-react";
import {
  CohortWeekMetric,
  EDAGCompileReport,
  MultiRoundDefenseResult,
} from "@/lib/epistemic-engine/types";

interface FacultyConsolePanelProps {
  cohortMetrics: CohortWeekMetric[];
  cohortStudents: Array<{
    ra: string;
    studentName: string;
    avgMastery: number;
    avgBrier: number;
    dkAlerts: number;
    nodesCount: number;
  }>;
  edagReport: EDAGCompileReport;
  onSelectStudentRa: (ra: string) => void;
}

export default function FacultyConsolePanel({
  cohortMetrics,
  cohortStudents,
  edagReport,
  onSelectStudentRa,
}: FacultyConsolePanelProps) {
  const [projectTitle, setProjectTitle] = useState("Barramento Distribuido com Consenso Quorum");
  const [proposal, setProposal] = useState(
    "A arquitetura emprega Write-Ahead Logging (WAL) com fsync para durabilidade ACID, exclusao mutua atomica via CAS e consenso distribuido Raft por maioria de quorum para prevenir split-brain sob particao CAP, ordenando pre-requisitos por Kahn em O(V+E)."
  );
  const [defenseResult, setDefenseResult] = useState<MultiRoundDefenseResult | null>(null);
  const [loadingDefense, setLoadingDefense] = useState(false);

  const latestWeek = cohortMetrics[cohortMetrics.length - 1];

  const chartPoints = useMemo(() => {
    const w = 520;
    const h = 190;
    const padX = 34;
    const padY = 20;
    const mapPoints = (vals: number[]) =>
      vals
        .map((v, idx) => {
          const x =
            vals.length > 1
              ? padX + (idx / (vals.length - 1)) * (w - padX * 2)
              : w / 2;
          const y = h - padY - ((v - 30) / 70) * (h - padY * 2);
          return `${x.toFixed(1)},${Math.max(10, Math.min(h - 14, y)).toFixed(1)}`;
        })
        .join(" ");

    return {
      w,
      h,
      expLine: mapPoints(cohortMetrics.map((m) => Number(m.experimental_retention_pct))),
      ctrlLine: mapPoints(cohortMetrics.map((m) => Number(m.control_retention_pct))),
    };
  }, [cohortMetrics]);

  const handleDefenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingDefense(true);
    try {
      const res = await fetch("/api/banca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "defense",
          projectTitle,
          studentProposal: proposal,
          baselineApprovalCount: 1,
        }),
      });
      const data = await res.json();
      if (data.result) setDefenseResult(data.result);
    } finally {
      setLoadingDefense(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
          <Users className="h-3.5 w-3.5" />
          <span>Protagonismo Docente & Estudo Longitudinal (N = 48, 16 Semanas)</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          Telemetria de Turma e Camara de Defesa Multidisciplinar
        </h3>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          O docente assume lideranca estrategica: visualiza gargalos estruturais da turma, isola discentes sob risco Dunning-Kruger e submete projetos a banca simultanea interdisciplinar.
        </p>
      </div>

      {/* Linha 1: Grafico Longitudinal (16 Semanas) + Matriz de Alunos */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="doppelrand-outer xl:col-span-7">
          <div className="doppelrand-inner p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="flex items-center gap-2 text-base font-semibold text-white">
                  <BarChart3 className="h-4 w-4 text-[#C8B560]" />
                  <span>Retencao Conceitual: Controle (Resumos IA) vs. ThAthena MAX</span>
                </h4>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                  p &lt; 0,001 (teste t de Student) | d de Cohen = 0,84 | Amostra N = 48 (Ciencia da Computacao UniMAX)
                </p>
              </div>
              {latestWeek && (
                <div className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-300 tabular-nums">
                  Delta Sem 16: +
                  {(
                    Number(latestWeek.experimental_retention_pct) -
                    Number(latestWeek.control_retention_pct)
                  ).toFixed(1)}
                  %
                </div>
              )}
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-black/50 p-3">
              <svg viewBox={`0 0 ${chartPoints.w} ${chartPoints.h}`} className="h-48 w-full">
                {[40, 60, 80, 95].map((pct) => {
                  const y =
                    chartPoints.h - 20 - ((pct - 30) / 70) * (chartPoints.h - 40);
                  return (
                    <g key={pct}>
                      <line
                        x1="34"
                        y1={y}
                        x2={chartPoints.w - 20}
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                      />
                      <text
                        x="6"
                        y={y + 3}
                        fill="#64748B"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                      >
                        {pct}%
                      </text>
                    </g>
                  );
                })}
                <polyline
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.2"
                  strokeDasharray="5 4"
                  points={chartPoints.ctrlLine}
                />
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.8"
                  points={chartPoints.expLine}
                />
                <text x="44" y="24" fill="#10B981" fontSize="10" fontFamily="var(--font-mono)">
                  Grupo ThAthena MAX (92.6% na Sem 16)
                </text>
                <text x="44" y="166" fill="#EF4444" fontSize="10" fontFamily="var(--font-mono)">
                  Grupo Controle / Resumos Passivos IA (51.4% na Sem 16)
                </text>
              </svg>
            </div>

            {latestWeek && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-[10px] text-slate-400">Retencao 30d</div>
                  <div className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                    {latestWeek.experimental_retention_pct}%
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-[10px] text-slate-400">Brier Score</div>
                  <div className="mt-1 font-mono text-lg font-bold text-[#C8B560] tabular-nums">
                    {latestWeek.experimental_brier_score}
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-[10px] text-slate-400">Lacuna Pre-req</div>
                  <div className="mt-1 font-mono text-lg font-bold text-white tabular-nums">
                    {latestWeek.experimental_prereq_gap_pct}%
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-mono text-[10px] text-slate-400">Autenticidade</div>
                  <div className="mt-1 font-mono text-lg font-bold text-emerald-400 tabular-nums">
                    {latestWeek.isomorphic_authenticity_pct}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Matriz de Risco Discente */}
        <div className="liquid-glass flex flex-col justify-between rounded-[20px] p-5 xl:col-span-5">
          <div>
            <h4 className="text-base font-semibold text-white">
              Diagnostico de Coorte por Estudante (Supabase)
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              Clique em um perfil para carregar seu Gemeo Cognitivo em todos os modulos.
            </p>

            <div className="mt-4 space-y-2.5">
              {cohortStudents.map((st) => (
                <button
                  key={st.ra}
                  type="button"
                  onClick={() => onSelectStudentRa(st.ra)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 p-3.5 text-left transition hover:border-[#C8B560]/50"
                >
                  <div>
                    <div className="text-sm font-medium text-white">{st.studentName}</div>
                    <div className="font-mono text-[11px] text-slate-400">
                      RA {st.ra} // {st.nodesCount} nos rastreados
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs tabular-nums">
                    <div
                      className={
                        st.avgMastery >= 0.75
                          ? "text-emerald-400"
                          : st.avgMastery >= 0.5
                          ? "text-amber-300"
                          : "text-rose-400"
                      }
                    >
                      P(Lt): {(st.avgMastery * 100).toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Brier: {st.avgBrier.toFixed(2)}{" "}
                      {st.dkAlerts > 0 ? `(${st.dkAlerts} alertas DK)` : ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#C8B560]/25 bg-[#C8B560]/10 p-3.5 text-xs text-slate-200">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#FFF2AC]">
              Recomendacao Automatica para Plano de Aula
            </span>
            <p className="mt-1 leading-relaxed">
              Priorize revisao em{" "}
              <strong>{edagReport.bottlenecks[0]?.code ?? "CC-101"}</strong> e{" "}
              <strong>{edagReport.bottlenecks[1]?.code ?? "CC-301"}</strong>: concentram maior alavancagem estrutural sobre os semestres seguintes.
            </p>
          </div>
        </div>
      </div>

      {/* Linha 2: Camara de Defesa Multidisciplinar */}
      <div className="liquid-glass rounded-[20px] p-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <form onSubmit={handleDefenseSubmit} className="space-y-3 lg:col-span-5">
            <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#C8B560]">
              <Scale className="h-4 w-4" />
              <span>Banca Examinadora Concorrente (Faculty Swarm)</span>
            </div>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#08090C] px-3 py-2 text-sm text-white outline-none focus:border-[#C8B560]"
            />
            <textarea
              rows={4}
              value={proposal}
              onChange={(e) => setProposal(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#08090C] p-3 text-xs leading-relaxed text-slate-200 outline-none focus:border-[#C8B560]"
            />
            <button
              type="submit"
              disabled={loadingDefense}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C8B560] hover:text-black"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loadingDefense ? "Executando Arguicao..." : "Submeter Proposta a Banca Multidisciplinar"}</span>
            </button>
          </form>

          <div className="lg:col-span-7">
            {defenseResult ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#C8B560]/40 bg-[#C8B560]/10 p-3">
                  <div>
                    <div className="font-mono text-[10px] uppercase text-[#C8B560]">
                      Veredito da Banca ({defenseResult.approvalRatio})
                    </div>
                    <div className="text-sm font-semibold text-white">{defenseResult.verdict}</div>
                  </div>
                  <div className="font-mono text-xs text-emerald-300 tabular-nums">
                    Delta Epistemico: {defenseResult.epistemicDelta >= 0 ? "+" : ""}
                    {defenseResult.epistemicDelta}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {defenseResult.evaluations.map((ev, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs"
                    >
                      <div className="font-semibold text-white">{ev.subject}</div>
                      <div
                        className={`mt-1 font-mono text-[11px] ${
                          ev.approved ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {ev.approved ? `APROVADO (${ev.score}/100)` : `RETIFICAR (${ev.score}/100)`}
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-slate-300">
                        {ev.critique}
                      </p>
                    </div>
                  ))}
                </div>

                {defenseResult.crossCuttingTensions.length > 0 && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                    <strong>Tensao Interdisciplinar Detectada:</strong>{" "}
                    {defenseResult.crossCuttingTensions[0].critique}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col justify-center rounded-xl border border-dashed border-white/15 bg-black/30 p-6 text-center text-xs text-slate-400">
                <p>
                  Submeta uma tese arquitetural para auditar simultaneamente sob Sistemas Operacionais, Sistemas Distribuidos e Topologia de Grafos, identificando tensoes cruzadas como uso ingenuo de mutex local em ambientes distribuidos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
