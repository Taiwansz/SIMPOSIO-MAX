"use client";

import React, { useMemo, useState } from "react";
import { Check, Download, FileText } from "lucide-react";
import { CohortResultWeek, JuryVote } from "@/lib/veritas-engine/types";

interface FacultyOverviewProps {
  cohortResults: CohortResultWeek[];
  juryVotes: JuryVote[];
  onVoteSaved: () => Promise<void>;
}

export default function FacultyOverview({
  cohortResults,
  juryVotes,
  onVoteSaved,
}: FacultyOverviewProps) {
  const [evaluatorName, setEvaluatorName] = useState("");
  const [innovationScore, setInnovationScore] = useState(2.0);
  const [pedagogicalScore, setPedagogicalScore] = useState(4.0);
  const [impactScore, setImpactScore] = useState(4.0);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const chart = useMemo(() => {
    const w = 480;
    const h = 175;
    const padX = 28;
    const padY = 18;
    const mapVals = (vals: number[]) =>
      vals
        .map((v, i) => {
          const x =
            vals.length > 1
              ? padX + (i / (vals.length - 1)) * (w - padX * 2)
              : w / 2;
          const y = h - padY - ((v - 35) / 65) * (h - padY * 2);
          return `${x.toFixed(1)},${Math.max(10, Math.min(h - 14, y)).toFixed(1)}`;
        })
        .join(" ");

    return {
      w,
      h,
      veritas: mapVals(cohortResults.map((r) => Number(r.veritas_autonomy_pct))),
      control: mapVals(cohortResults.map((r) => Number(r.control_autonomy_pct))),
    };
  }, [cohortResults]);

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim() || !note.trim()) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/jury", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluatorName,
          innovationScore,
          pedagogicalScore,
          impactScore,
          note,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setEvaluatorName("");
        setNote("");
        await onVoteSaved();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] sm:text-3xl">
            Resultados e Banca
          </h2>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Acompanhamento de 48 estudantes por 16 semanas e documentos oficiais do simposio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/simposio/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#C8B560] px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>Artigo PDF</span>
          </a>
          <a
            href="/edital-iv-simposio-ia-unimax.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#2A2A2A]/80 px-4 py-2.5 text-xs font-medium text-[#F0EDE6] transition hover:bg-[#2A2A2A]"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span>Edital</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Grafico das 16 semanas */}
        <div className="apple-shell lg:col-span-7">
          <div className="apple-card flex h-full flex-col justify-between p-6">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  Autonomia real da turma (N = 48)
                </h3>
                <span className="font-mono text-sm font-semibold text-[#C8B560] tabular-nums">
                  92,8% vs 49,8%
                </span>
              </div>

              <div className="mt-5 rounded-[20px] bg-[#0A0A0A] p-3">
                <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="h-44 w-full">
                  <polyline
                    fill="none"
                    stroke="#5C5C5C"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points={chart.control}
                  />
                  <polyline
                    fill="none"
                    stroke="#C8B560"
                    strokeWidth="2.8"
                    points={chart.veritas}
                  />
                  <text x="32" y="22" fill="#C8B560" fontSize="10" fontFamily="var(--font-mono)">
                    Turma usando VERITAS (92,8%)
                  </text>
                  <text x="32" y="160" fill="#5C5C5C" fontSize="10" fontFamily="var(--font-mono)">
                    Turma com resumos prontos (49,8%)
                  </text>
                </svg>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {juryVotes.slice(0, 2).map((v) => {
                const total = (
                  Number(v.innovation_score) +
                  Number(v.pedagogical_score) +
                  Number(v.impact_score)
                ).toFixed(1);
                return (
                  <div key={v.id} className="apple-subcard flex items-center justify-between gap-4 p-3.5 text-xs">
                    <div className="min-w-0">
                      <div className="font-medium text-[#F0EDE6]">{v.evaluator_name}</div>
                      <p className="truncate text-[#F0EDE6]/60">{v.note}</p>
                    </div>
                    <span className="shrink-0 font-mono font-semibold text-[#C8B560] tabular-nums">
                      {total}/10
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Avaliacao da Banca */}
        <div className="apple-shell lg:col-span-5">
          <form onSubmit={handleVote} className="apple-card flex h-full flex-col justify-between space-y-4 p-6">
            <div className="space-y-3">
              <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                Avaliar projeto
              </h3>

              <input
                type="text"
                required
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
                placeholder="Nome do avaliador"
                className="w-full rounded-2xl bg-[#0A0A0A] px-4 py-3 text-sm text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <label className="apple-subcard p-3">
                  <span className="block text-[10px] text-[#F0EDE6]/50">IA /2.0</span>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={innovationScore}
                    onChange={(e) => setInnovationScore(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-base font-semibold text-[#C8B560] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </label>
                <label className="apple-subcard p-3">
                  <span className="block text-[10px] text-[#F0EDE6]/50">Ensino /4.0</span>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    step={0.1}
                    value={pedagogicalScore}
                    onChange={(e) => setPedagogicalScore(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-base font-semibold text-[#C8B560] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </label>
                <label className="apple-subcard p-3">
                  <span className="block text-[10px] text-[#F0EDE6]/50">Impacto /4.0</span>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    step={0.1}
                    value={impactScore}
                    onChange={(e) => setImpactScore(Number(e.target.value))}
                    className="mt-1 w-full bg-transparent text-base font-semibold text-[#C8B560] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </label>
              </div>

              <textarea
                rows={3}
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Comentario da banca..."
                className="w-full rounded-2xl bg-[#0A0A0A] p-3.5 text-sm text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-xs text-[#C8B560]">
                <Check className="h-4 w-4" strokeWidth={2} />
                <span>Avaliacao gravada com sucesso.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-full bg-[#C8B560] py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97]"
            >
              {saving ? "Salvando..." : "Salvar nota"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
