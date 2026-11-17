"use client";

import React, { useEffect, useState } from "react";
import { Check, Clock, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { PRESET_MUTATION_CHALLENGES } from "@/lib/veritas-engine/mutation";
import { MutationChallenge } from "@/lib/veritas-engine/types";

interface MutationTestProps {
  initialChallenge?: MutationChallenge | null;
  onProofSaved: () => Promise<void>;
}

export default function MutationTest({
  initialChallenge,
  onProofSaved,
}: MutationTestProps) {
  const [challenge, setChallenge] = useState<MutationChallenge>(
    initialChallenge ?? PRESET_MUTATION_CHALLENGES[0]
  );
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [started, setStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [selectedLine, setSelectedLine] = useState(-1);
  const [selectedFixId, setSelectedFixId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    passed: boolean;
    proofHash: string;
    feedback: string;
  } | null>(null);

  useEffect(() => {
    if (initialChallenge) {
      setChallenge(initialChallenge);
      setShowCustom(false);
      setStarted(true);
      setSecondsLeft(60);
      setSelectedLine(-1);
      setSelectedFixId("");
      setResult(null);
    }
  }, [initialChallenge]);

  useEffect(() => {
    if (!started || result) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [started, result]);

  const startPreset = (preset: MutationChallenge) => {
    setChallenge(preset);
    setShowCustom(false);
    setStarted(true);
    setSecondsLeft(60);
    setSelectedLine(-1);
    setSelectedFixId("");
    setResult(null);
  };

  const handleSabotageCustom = async () => {
    if (customInput.trim().split("\n").length < 3) return;
    setLoading(true);
    try {
      const res = await fetch("/api/mutation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", customText: customInput }),
      });
      const data = await res.json();
      if (data.challenge) {
        setChallenge(data.challenge);
        setShowCustom(false);
        setStarted(true);
        setSecondsLeft(60);
        setSelectedLine(-1);
        setSelectedFixId("");
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (selectedLine < 0 || !selectedFixId) return;
    setLoading(true);
    const elapsed = Math.max(1, 60 - secondsLeft);
    try {
      const res = await fetch("/api/mutation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          challengeId: challenge.challengeId,
          customText: challenge.challengeId === "mut_custom" ? challenge.originalLines.join("\n") : undefined,
          selectedLine,
          selectedFixId,
          elapsedSeconds: elapsed,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        setStarted(false);
        if (data.result.passed) await onProofSaved();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header minimalista */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] sm:text-3xl">
            Teste de Autoria em 60s
          </h2>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Alteramos 1 detalhe oculto na entrega. Quem realmente fez encontra e corrige rapido.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-[#2A2A2A]/70 px-4 py-2 font-mono text-sm text-[#C8B560] tabular-nums">
            <Clock className="h-4 w-4" strokeWidth={1.6} />
            <span>00:{secondsLeft.toString().padStart(2, "0")}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="rounded-full bg-[#2A2A2A]/70 px-4 py-2 text-xs font-medium text-[#F0EDE6] transition hover:bg-[#2A2A2A]"
          >
            {showCustom ? "Usar exemplos" : "Colar meu texto"}
          </button>
        </div>
      </div>

      {/* Seletor discreto dos 3 exemplos */}
      {!showCustom ? (
        <div className="flex flex-wrap gap-2">
          {PRESET_MUTATION_CHALLENGES.map((preset) => {
            const active = preset.challengeId === challenge.challengeId && !showCustom;
            return (
              <button
                key={preset.challengeId}
                type="button"
                onClick={() => startPreset(preset)}
                className={`rounded-2xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#F0EDE6] text-[#0A0A0A]"
                    : "bg-[#2A2A2A]/50 text-[#F0EDE6]/70 hover:text-[#F0EDE6]"
                }`}
              >
                {preset.artifactTitle}
              </button>
            );
          })}
        </div>
      ) : null}

      {showCustom ? (
        <div className="apple-shell">
          <div className="apple-card space-y-4 p-6">
            <textarea
              rows={6}
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder={"Cole pelo menos 3 linhas de codigo ou regras do seu trabalho...\nExemplo:\nfunction pagar(saldo, valor) {\n  if (valor > 0 && valor <= saldo) {\n    confirmar();\n  }\n}"}
              className="w-full rounded-2xl bg-[#0A0A0A] p-4 font-mono text-xs text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
            />
            <button
              type="button"
              disabled={loading}
              onClick={handleSabotageCustom}
              className="inline-flex items-center gap-2 rounded-full bg-[#C8B560] px-6 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
            >
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Sabotar meu texto e iniciar 60s</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Codigo / Texto Sabotado */}
          <div className="apple-shell lg:col-span-7">
            <div className="apple-card flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                    {challenge.artifactTitle}
                  </h3>
                  {!started ? (
                    <button
                      type="button"
                      onClick={() => startPreset(challenge)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#C8B560] px-4 py-1.5 text-xs font-semibold text-[#0A0A0A]"
                    >
                      <Play className="h-3.5 w-3.5" strokeWidth={2} />
                      <span>Iniciar 60s</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startPreset(challenge)}
                      aria-label="Reiniciar cronometro"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]/70"
                    >
                      <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-1.5 rounded-[20px] bg-[#0A0A0A] p-4 font-mono text-xs">
                  {challenge.mutatedLines.map((line, idx) => {
                    const picked = selectedLine === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!started && !result) setStarted(true);
                          setSelectedLine(idx);
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                          picked
                            ? "bg-[#C8B560]/20 text-[#F0EDE6] ring-1 ring-[#C8B560]"
                            : "text-[#F0EDE6]/80 hover:bg-[#2A2A2A]/50"
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

              <p className="mt-4 text-xs text-[#F0EDE6]/50">
                Dica: {challenge.mutationHint}
              </p>
            </div>
          </div>

          {/* Reparar + Selo de Autoria */}
          <div className="apple-shell lg:col-span-5">
            <div className="apple-card flex h-full flex-col justify-between space-y-5 p-6">
              <div className="space-y-3">
                <p className="text-xs text-[#F0EDE6]/55">
                  Marque a linha sabotada e escolha o ajuste certo:
                </p>
                {challenge.fixOptions.map((opt) => {
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

              {result && (
                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    result.passed
                      ? "bg-[#C8B560]/15 text-[#F0EDE6] ring-1 ring-[#C8B560]/50"
                      : "bg-[#2A2A2A] text-[#F0EDE6]/80"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2 font-mono font-semibold text-[#C8B560]">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.8} />
                    <span>{result.passed ? `Selo: ${result.proofHash}` : "Tente novamente"}</span>
                  </div>
                  <p>{result.feedback}</p>
                </div>
              )}

              <button
                type="button"
                disabled={loading || selectedLine < 0 || !selectedFixId}
                onClick={handleVerify}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C8B560] py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97] disabled:opacity-40"
              >
                <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                <span>{loading ? "Validando..." : "Emitir selo de autoria"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
