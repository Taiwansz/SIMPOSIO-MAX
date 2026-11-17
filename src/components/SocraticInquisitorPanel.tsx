"use client";

import React, { useMemo, useState } from "react";
import { AlertOctagon, Cpu, Flame, Send, ShieldAlert, Sparkles } from "lucide-react";
import { EDAGNode, SocraticLog } from "@/lib/epistemic-engine/types";

interface SocraticInquisitorPanelProps {
  ra: string;
  studentName: string;
  nodes: EDAGNode[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  logs: SocraticLog[];
  onRefreshState: () => Promise<void>;
}

interface TurnResult {
  rigorAnalysis: {
    causalRigorScore: number;
    bluffDetected: boolean;
    isVerifiedCorrect: boolean;
    bloomReached: string;
    matchedMechanisms: string[];
    detectedFluffPatterns: string[];
    agreedWithFallacy: boolean;
    reasoningCritique: string;
    inquisitorProbe: string;
    counterExample: string;
  };
  bktUpdate: {
    priorMastery: number;
    nextMastery: number;
    status: string;
    dunningKrugerAlert: boolean;
    calibrationDelta: number;
  };
  turnBrier: number;
  inquisitorResponse: string;
  providerUsed: string;
  persistedToSupabase: boolean;
}

export default function SocraticInquisitorPanel({
  ra,
  studentName,
  nodes,
  selectedNodeId,
  onSelectNode,
  logs,
  onRefreshState,
}: SocraticInquisitorPanelProps) {
  const [argument, setArgument] = useState(
    "A operacao i++ nao e atomica porque a CPU executa LOAD, ADD e STORE em ciclos separados; logo, uma interrupcao preemptiva entre o LOAD e o STORE gera Lost Update, exigindo exclusao mutua via mutex ou instrucao atomica CAS."
  );
  const [confidence, setConfidence] = useState(85);
  const [customApiKey, setCustomApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<TurnResult | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const loadPreset = (mode: "rigor" | "bluff" | "fallacy") => {
    if (mode === "rigor") {
      onSelectNode("n_mutex_lock");
      setConfidence(88);
      setArgument(
        "A instrucao i++ nao e atomica porque se decompoe em LOAD, ADD e STORE nos registradores da CPU; portanto, uma troca de contexto preemptiva no meio da sequencia causa Lost Update. E necessario proteger a secao critica com mutex ou Compare-And-Swap (CAS) e ordenar aquisicoes para evitar deadlock."
      );
    } else if (mode === "bluff") {
      onSelectNode("n_mutex_lock");
      setConfidence(95);
      setArgument(
        "Em resumo, como podemos ver de maneira geral, usar threads e locks ajuda a otimizar e melhorar o desempenho do sistema e e uma boa pratica fundamental para o sucesso da aplicacao."
      );
    } else {
      onSelectNode("n_mutex_lock");
      setConfidence(90);
      setArgument(
        "Declarar a variavel como volatile garante atomicidade composta e usar locks de aplicacao resolve concorrencia entre multiplos processos."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode || !argument.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/socratic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ra,
          studentName,
          nodeId: selectedNode.id,
          studentArgument: argument,
          confidenceDeclared: confidence / 100,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha na sabatina");
      setLastResult(data as TurnResult);
      await onRefreshState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
            <Flame className="h-3.5 w-3.5" />
            <span>Inquisidor Socratico Adversarial // Anti-Bluff Engine</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Sabatina Dialetica e Auditoria de Profundidade Causal
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Diferente de chatbots passiveis de bajulacao, o Inquisidor confronta parafrase rasa de IA, testa falacias conhecidas e exige prova de causa e efeito antes de elevar P(Lt).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset("rigor")}
            className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Simular Resposta com Rigor
          </button>
          <button
            type="button"
            onClick={() => loadPreset("bluff")}
            className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 font-mono text-xs text-amber-300 transition hover:bg-amber-500/20"
          >
            Simular Blefe de IA
          </button>
          <button
            type="button"
            onClick={() => loadPreset("fallacy")}
            className="rounded-lg border border-rose-500/35 bg-rose-500/10 px-3 py-1.5 font-mono text-xs text-rose-300 transition hover:bg-rose-500/20"
          >
            Simular Falacia Tecnica
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Formulario de Arguicao */}
        <form onSubmit={handleSubmit} className="liquid-glass space-y-4 rounded-[20px] p-5 lg:col-span-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Conceito Alvo do E-DAG
              </label>
              <select
                value={selectedNode?.id ?? ""}
                onChange={(e) => onSelectNode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#08090C] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C8B560]"
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.code} — {n.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <span>Confianca Declarada</span>
                <span className="text-[#FFF2AC] tabular-nums">{confidence}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="mt-2 w-full accent-[#C8B560]"
              />
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                Usada no Brier Score para detectar ilusao de Dunning-Kruger.
              </p>
            </div>
          </div>

          {selectedNode && (
            <div className="rounded-xl border border-[#C8B560]/25 bg-[#C8B560]/5 p-3.5 text-xs text-slate-200">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8B560]">
                Desafio Inquisitorio ({selectedNode.bloom_level})
              </span>
              <p className="mt-1 leading-relaxed">
                {selectedNode.fallacies[0]
                  ? `Um colega afirma: "${selectedNode.fallacies[0]}". Refute ou explique o mecanismo causal completo de ${selectedNode.title}.`
                  : `Demonstre as invariantes formais e condicoes de falha de ${selectedNode.title}.`}
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Sua Demonstracao Causal (Substitua ou edite livremente)
            </label>
            <textarea
              rows={5}
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder="Explique passo a passo usando conectores causais (porque, implica, resulta em) e invariantes..."
              className="w-full rounded-xl border border-white/10 bg-[#08090C] p-3.5 text-sm leading-relaxed text-white outline-none focus:border-[#C8B560]"
            />
          </div>

          <details className="rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5 text-xs text-slate-400">
            <summary className="cursor-pointer font-mono text-[11px] text-slate-300">
              Opcional: Chave Gemini ou NVIDIA NIM propria para enriquecimento neural
            </summary>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIza... ou nvapi-... (vazio usa o Motor Hibrido Deterministico)"
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#060606] px-3 py-2 font-mono text-xs text-white outline-none focus:border-[#C8B560]"
            />
          </details>

          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C8B560] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#FFF2AC] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>{loading ? "Auditando Rigor Causal & Persistindo..." : "Submeter ao Inquisidor Socratico"}</span>
          </button>
        </form>

        {/* Resultado da Sabatina + Historico Supabase */}
        <div className="space-y-4 lg:col-span-6">
          {lastResult ? (
            <div className="doppelrand-outer">
              <div className="doppelrand-inner space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    {lastResult.rigorAnalysis.bluffDetected ? (
                      <AlertOctagon className="h-5 w-5 text-rose-400" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-emerald-400" />
                    )}
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
                      {lastResult.rigorAnalysis.bluffDetected
                        ? "Blefe / Superficialidade Interceptada"
                        : `Rigor Causal Validado — Nivel ${lastResult.rigorAnalysis.bloomReached}`}
                    </span>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-slate-300">
                    {lastResult.providerUsed}
                  </span>
                </div>

                {/* KPIs do Turno */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-400">Rigor Causal</div>
                    <div className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
                      {lastResult.rigorAnalysis.causalRigorScore}/100
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-400">Delta BKT P(Lt)</div>
                    <div className="mt-1 font-mono text-xl font-bold text-[#C8B560] tabular-nums">
                      {(lastResult.bktUpdate.priorMastery * 100).toFixed(0)}% &rarr;{" "}
                      {(lastResult.bktUpdate.nextMastery * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="font-mono text-[10px] uppercase text-slate-400">Brier do Turno</div>
                    <div
                      className={`mt-1 font-mono text-xl font-bold tabular-nums ${
                        lastResult.turnBrier <= 0.12 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {lastResult.turnBrier.toFixed(3)}
                    </div>
                  </div>
                </div>

                {lastResult.bktUpdate.dunningKrugerAlert && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                    <div>
                      <strong>Alerta Metacognitivo Dunning-Kruger:</strong> Confianca declarada superou o dominio real em{" "}
                      {(lastResult.bktUpdate.calibrationDelta * 100).toFixed(1)} pontos percentuais.
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-white/10 bg-[#060606] p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                  {lastResult.inquisitorResponse}
                </div>

                {lastResult.persistedToSupabase && (
                  <div className="font-mono text-[11px] text-emerald-400">
                    Interacao gravada em tempo real no Supabase PostgreSQL (simposio_socratic_logs e simposio_student_states).
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="liquid-glass rounded-[20px] p-5">
              <div className="flex items-center gap-2 font-mono text-xs text-[#C8B560]">
                <Cpu className="h-4 w-4" />
                <span>Log Recente de Auditorias Dialeticas (Supabase)</span>
              </div>
              <div className="mt-4 space-y-3">
                {logs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                      <span className="text-slate-300">
                        RA {log.ra} // {log.node_id}
                      </span>
                      <span
                        className={
                          log.bluff_detected ? "text-rose-400" : "text-emerald-400"
                        }
                      >
                        {log.bluff_detected
                          ? `BLEFE (${log.causal_rigor_score}/100)`
                          : `VALIDADO (${log.causal_rigor_score}/100)`}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-slate-400 italic">
                      &ldquo;{log.student_argument}&rdquo;
                    </p>
                    <p className="mt-2 text-slate-200">{log.inquisitor_response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
