"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, FileCode2, Fingerprint, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { IsomorphicChallenge, IsomorphicSubmission } from "@/lib/epistemic-engine/types";

interface IsomorphicExamPanelProps {
  initialRa: string;
  submissions: IsomorphicSubmission[];
  onRefreshState: () => Promise<void>;
}

export default function IsomorphicExamPanel({
  initialRa,
  submissions,
  onRefreshState,
}: IsomorphicExamPanelProps) {
  const [raInput, setRaInput] = useState(initialRa);
  const [topicId, setTopicId] = useState("concurrency_saturation");
  const [challenge, setChallenge] = useState<IsomorphicChallenge | null>(null);
  const [numericAnswer, setNumericAnswer] = useState("");
  const [codeSubmission, setCodeSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [gradingResult, setGradingResult] = useState<{
    astInvariantsPassed: boolean;
    numericalPassed: boolean;
    analyticalScore: number;
    verdict: string;
    diagnostics: string[];
    persistedToSupabase: boolean;
  } | null>(null);

  const generateForRa = async (raVal: string, topicVal: string) => {
    setLoading(true);
    setGradingResult(null);
    try {
      const res = await fetch("/api/isomorphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", ra: raVal, topicId: topicVal }),
      });
      const data = await res.json();
      if (data.challenge) {
        setChallenge(data.challenge);
        setCodeSubmission(data.challenge.starterCode);
        setNumericAnswer(String(data.challenge.parameters.theoreticalCapacity));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateForRa(raInput, topicId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge) return;
    setLoading(true);
    try {
      const res = await fetch("/api/isomorphic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade",
          ra: raInput,
          topicId,
          submittedNumeric: Number(numericAnswer),
          submittedCode: codeSubmission,
        }),
      });
      const data = await res.json();
      if (data.grade) {
        setGradingResult({
          ...data.grade,
          persistedToSupabase: Boolean(data.persistedToSupabase),
        });
        await onRefreshState();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
            <Fingerprint className="h-3.5 w-3.5" />
            <span>Avaliacoes Isomorficas Anti-Fraude // SHA-256 por RA</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Gerador Parametrizado e Auditoria Estatica de Invariantes
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Altere o Registro Academico (RA) abaixo para observar a mutacao deterministica imediata dos parametros da prova, neutralizando o plagio cooperativo e respostas prontas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={raInput}
            onChange={(e) => setRaInput(e.target.value)}
            placeholder="Digite qualquer RA..."
            aria-label="Registro Academico para geracao isomorfica"
            className="w-36 rounded-xl border border-white/15 bg-[#08090C] px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#C8B560]"
          />
          <select
            value={topicId}
            onChange={(e) => {
              setTopicId(e.target.value);
              generateForRa(raInput, e.target.value);
            }}
            className="rounded-xl border border-white/15 bg-[#08090C] px-3 py-2 text-xs text-white outline-none focus:border-[#C8B560]"
          >
            <option value="concurrency_saturation">Saturacao Concorrente & Mutex</option>
            <option value="graph_critical_pipeline">Vazao em Pipeline DAG</option>
          </select>
          <button
            type="button"
            onClick={() => generateForRa(raInput, topicId)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#C8B560]/50 bg-[#C8B560]/15 px-3.5 py-2 font-mono text-xs text-[#FFF2AC] transition hover:bg-[#C8B560]/25"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Derivar Prova</span>
          </button>
        </div>
      </div>

      {challenge && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Enunciado Isomorfico & Parametros */}
          <form onSubmit={handleGrade} className="liquid-glass space-y-4 rounded-[20px] p-5 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="font-mono text-xs font-semibold text-[#C8B560]">
                {challenge.examHash} // RA {challenge.ra}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-slate-300">
                Seed #{challenge.seedNumeric}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <div className="font-mono text-[10px] uppercase text-slate-400">Taxa lambda</div>
                <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                  {challenge.parameters.rate} req/s
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <div className="font-mono text-[10px] uppercase text-slate-400">Latencia Base</div>
                <div className="mt-1 font-mono text-base font-semibold text-white tabular-nums">
                  {challenge.parameters.latencyMs} ms
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <div className="font-mono text-[10px] uppercase text-slate-400">Atrito f</div>
                <div className="mt-1 font-mono text-base font-semibold text-[#C8B560] tabular-nums">
                  {challenge.parameters.frictionFactor}x
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/40 p-3">
                <div className="font-mono text-[10px] uppercase text-slate-400">Vertices DAG</div>
                <div className="mt-1 font-mono text-base font-semibold text-emerald-400 tabular-nums">
                  {challenge.parameters.criticalNodesCount} nos
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#08090C] p-4 text-xs leading-relaxed text-slate-200">
              {challenge.prompt}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block font-mono text-[11px] uppercase text-slate-400">
                  Capacidade (req/s)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={numericAnswer}
                  onChange={(e) => setNumericAnswer(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#08090C] px-3 py-2.5 font-mono text-sm text-white outline-none focus:border-[#C8B560]"
                />
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  Formula: 1000 / ({challenge.parameters.latencyMs} * {challenge.parameters.frictionFactor})
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase text-slate-400">
                  <FileCode2 className="h-3.5 w-3.5" />
                  <span>Implementacao da Secao Critica (Auditoria Estatica)</span>
                </label>
                <textarea
                  rows={6}
                  value={codeSubmission}
                  onChange={(e) => setCodeSubmission(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#050608] p-3 font-mono text-xs leading-relaxed text-emerald-300 outline-none focus:border-[#C8B560]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8B560] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#FFF2AC]"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? "Auditando Invariantes e Gravando..." : "Auditar Solucao Isomorfica"}</span>
            </button>
          </form>

          {/* Painel Direito: Diagnostico da Submissao + Feed Supabase */}
          <div className="space-y-4 lg:col-span-5">
            {gradingResult ? (
              <div className="doppelrand-outer">
                <div className="doppelrand-inner space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase text-slate-400">
                      Laudo do Corretor Analitico
                    </span>
                    <span className="font-mono text-xl font-bold text-[#FFF2AC] tabular-nums">
                      {gradingResult.analyticalScore}/100
                    </span>
                  </div>

                  <div
                    className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
                      gradingResult.analyticalScore === 100
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/40 bg-amber-500/10 text-amber-200"
                    }`}
                  >
                    {gradingResult.analyticalScore === 100 ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0" />
                    )}
                    <span>{gradingResult.verdict}</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300">
                    {gradingResult.diagnostics.map((d, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-white/5 bg-black/40 p-2.5 leading-relaxed"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>

                  {gradingResult.persistedToSupabase && (
                    <div className="font-mono text-[11px] text-emerald-400">
                      Submissao isomorfica auditada e persistida no Supabase.
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="liquid-glass rounded-[20px] p-5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
                Submissoes Isomorficas Verificadas (Supabase)
              </h4>
              <div className="mt-3 space-y-2.5">
                {submissions.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#C8B560]">
                        RA {sub.ra} // {sub.exam_hash}
                      </span>
                      <span
                        className={
                          sub.analytical_score >= 90 ? "text-emerald-400" : "text-amber-300"
                        }
                      >
                        {sub.analytical_score}/100
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-white">{sub.verdict}</p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400">
                      AST Invariantes: {sub.ast_invariants_passed ? "VALIDADO" : "FALHA"} | Capacidade sub.: {sub.submitted_numeric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
