"use client";

import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Check,
  Cpu,
  HeartPulse,
  RotateCcw,
} from "lucide-react";
import { simulateCaseFailure } from "@/lib/veritas-engine/autopsy";
import { AutopsyCase, VeritasArea } from "@/lib/veritas-engine/types";

interface AutopsyLabProps {
  cases: AutopsyCase[];
  onSolved: () => Promise<void>;
}

const AREA_ICONS: Record<
  VeritasArea,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  Computacao: Cpu,
  Saude: HeartPulse,
  Negocios: Briefcase,
};

export default function AutopsyLab({ cases, onSolved }: AutopsyLabProps) {
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id ?? "case_comp_pix");
  const currentCase = useMemo(
    () => cases.find((c) => c.id === selectedCaseId) ?? cases[0],
    [cases, selectedCaseId]
  );

  const defaultSlider = (c: AutopsyCase) =>
    c.id === "case_health_triage"
      ? c.trigger_break_threshold - 3
      : Math.min(c.trigger_max, c.trigger_break_threshold + 10);

  const [paramValue, setParamValue] = useState<number>(
    currentCase ? defaultSlider(currentCase) : 18
  );
  const [selectedLine, setSelectedLine] = useState<number>(-1);
  const [selectedFixId, setSelectedFixId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ solved: boolean; text: string } | null>(
    null
  );

  const handleSelectCase = (c: AutopsyCase) => {
    setSelectedCaseId(c.id);
    setParamValue(defaultSlider(c));
    setSelectedLine(-1);
    setSelectedFixId("");
    setFeedback(null);
  };

  if (!currentCase) return null;

  const sim = simulateCaseFailure(currentCase, paramValue);

  const handleVerify = async () => {
    if (selectedLine < 0 || !selectedFixId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/autopsy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: currentCase.id,
          selectedLine,
          selectedFixId,
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        setFeedback({
          solved: data.evaluation.solved,
          text: data.evaluation.feedback,
        });
        if (data.evaluation.solved) await onSolved();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecalho simples + selecao das 3 areas por icones */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] sm:text-3xl">
            Raio-X da IA
          </h2>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Ajuste o cenario, encontre a linha onde a IA errou e aplique a correcao.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[22px] bg-[#2A2A2A]/50 p-1.5">
          {cases.map((c) => {
            const Icon = AREA_ICONS[c.area];
            const active = c.id === currentCase.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCase(c)}
                title={c.area}
                aria-label={c.area}
                className={`flex items-center gap-2 rounded-[16px] px-4 py-2.5 text-xs font-medium transition-all duration-300 apple-ease active:scale-[0.97] ${
                  active
                    ? "bg-[#C8B560] text-[#0A0A0A]"
                    : "text-[#F0EDE6]/65 hover:text-[#F0EDE6]"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.7} />
                <span className="hidden sm:inline">{c.area}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dois cartoes amplos Apple Double-Bezel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Cartao 1: Resposta da IA interativa (clique na linha com erro) */}
        <div className="apple-shell lg:col-span-7">
          <div className="apple-card flex h-full flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  {currentCase.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleSelectCase(currentCase)}
                  aria-label="Reiniciar caso"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6]/60 transition hover:text-[#F0EDE6]"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
              </div>
              <p className="mt-1.5 text-sm text-[#F0EDE6]/60">{currentCase.summary}</p>

              {/* Linhas clicaveis */}
              <div className="mt-5 space-y-1.5 rounded-[20px] bg-[#0A0A0A] p-4 font-mono text-xs">
                {currentCase.ai_output_lines.map((line, idx) => {
                  const isPicked = selectedLine === idx;
                  const isFaultShown = feedback?.solved && idx === currentCase.fault_line_index;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedLine(idx)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                        isPicked
                          ? "bg-[#C8B560]/20 text-[#F0EDE6] ring-1 ring-[#C8B560]"
                          : isFaultShown
                          ? "bg-[#C8B560]/10 text-[#C8B560]"
                          : "text-[#F0EDE6]/75 hover:bg-[#2A2A2A]/50"
                      }`}
                    >
                      <span className="w-5 shrink-0 text-[#5C5C5C] tabular-nums">
                        {idx + 1}
                      </span>
                      <span className="break-all">{line}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="mt-4 text-xs text-[#F0EDE6]/45">
              Passo 1: Clique diretamente na linha acima onde a IA comete o erro.
            </p>
          </div>
        </div>

        {/* Cartao 2: Simulador ao vivo + Correcao */}
        <div className="apple-shell lg:col-span-5">
          <div className="apple-card flex h-full flex-col justify-between space-y-6 p-6 sm:p-7">
            {/* Controle de estresse */}
            <div className="apple-subcard space-y-4 p-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F0EDE6]/70">{currentCase.trigger_param_name}</span>
                <span className="font-mono font-semibold text-[#C8B560] tabular-nums">
                  {paramValue} {currentCase.trigger_param_unit}
                </span>
              </div>
              <input
                type="range"
                min={currentCase.trigger_min}
                max={currentCase.trigger_max}
                value={paramValue}
                onChange={(e) => setParamValue(Number(e.target.value))}
                className="w-full"
              />

              <div className="flex items-center justify-between border-t border-[#5C5C5C]/25 pt-3 text-xs">
                <div>
                  <span className="text-[#F0EDE6]/45">Confianca da IA</span>
                  <div className="font-mono text-base font-semibold text-[#F0EDE6] tabular-nums">
                    {sim.aiConfidencePct}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#F0EDE6]/45">Erro real</span>
                  <div
                    className={`font-mono text-base font-semibold tabular-nums ${
                      sim.broken ? "text-[#C8B560]" : "text-[#F0EDE6]/70"
                    }`}
                  >
                    {sim.failureRatePct}%
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#F0EDE6]/75">
                <AlertCircle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    sim.broken ? "text-[#C8B560]" : "text-[#5C5C5C]"
                  }`}
                  strokeWidth={1.6}
                />
                <span>{sim.statusMessage}</span>
              </div>
            </div>

            {/* Opcoes de correcao humana */}
            <div className="space-y-2.5">
              <p className="text-xs text-[#F0EDE6]/50">
                Passo 2: Escolha a regra para corrigir a falha
              </p>
              {currentCase.safe_fix_options.map((opt) => {
                const active = selectedFixId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFixId(opt.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-xs transition-all duration-200 ${
                      active
                        ? "bg-[#F0EDE6] font-medium text-[#0A0A0A]"
                        : "bg-[#2A2A2A]/55 text-[#F0EDE6]/80 hover:bg-[#2A2A2A]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {active && <Check className="h-4 w-4 shrink-0" strokeWidth={2} />}
                  </button>
                );
              })}
            </div>

            {feedback && (
              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed ${
                  feedback.solved
                    ? "bg-[#C8B560]/15 text-[#F0EDE6] ring-1 ring-[#C8B560]/50"
                    : "bg-[#2A2A2A] text-[#F0EDE6]/80"
                }`}
              >
                {feedback.text}
              </div>
            )}

            <button
              type="button"
              disabled={submitting || selectedLine < 0 || !selectedFixId}
              onClick={handleVerify}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C8B560] py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97] disabled:opacity-40"
            >
              <Check className="h-4 w-4" strokeWidth={2} />
              <span>{submitting ? "Verificando..." : "Confirmar diagnostico"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
