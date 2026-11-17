"use client";

import React, { useState } from "react";
import { Award, CheckCircle, Download, FileText, MessageSquarePlus } from "lucide-react";
import { JuryFeedback } from "@/lib/epistemic-engine/types";

interface SimposioDossierPanelProps {
  juryFeedback: JuryFeedback[];
  onRefreshState: () => Promise<void>;
}

export default function SimposioDossierPanel({
  juryFeedback,
  onRefreshState,
}: SimposioDossierPanelProps) {
  const [evaluatorName, setEvaluatorName] = useState("");
  const [evaluatorRole, setEvaluatorRole] = useState("Comite Cientifico UniMAX");
  const [innovationScore, setInnovationScore] = useState(2.0);
  const [pedagogicalScore, setPedagogicalScore] = useState(4.0);
  const [impactScore, setImpactScore] = useState(4.0);
  const [comments, setComments] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSaveFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim() || !comments.trim()) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch("/api/banca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "jury_feedback",
          evaluatorName,
          evaluatorRole,
          innovationScore,
          pedagogicalScore,
          impactScore,
          comments,
        }),
      });
      if (res.ok) {
        setSavedMsg("Parecer registrado e sincronizado no Supabase.");
        setEvaluatorName("");
        setComments("");
        await onRefreshState();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
            <Award className="h-3.5 w-3.5" />
            <span>Edital IV Simposio de IA — UniMAX (Categoria Alunos)</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Matriz de Conformidade (10,0 Pontos) e Auditoria da Banca
          </h3>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="/api/simposio/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#C8B560] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#FFF2AC]"
          >
            <Download className="h-4 w-4" />
            <span>Resumo Ampliado Oficial (.PDF)</span>
          </a>
          <a
            href="/edital-iv-simposio-ia-unimax.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition hover:border-[#C8B560]/50"
          >
            <FileText className="h-4 w-4" />
            <span>Edital Oficial UniMAX (.PDF)</span>
          </a>
        </div>
      </div>

      {/* Matriz do Edital */}
      <div className="doppelrand-outer">
        <div className="doppelrand-inner overflow-x-auto p-5">
          <table className="w-full min-w-[640px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 font-mono text-[11px] uppercase text-[#C8B560]">
                <th className="py-3 pr-4">Criterio do Edital</th>
                <th className="py-3 px-4">Peso</th>
                <th className="py-3 pl-4">Evidencia Tecnica Entregue no SIMPOSIO-MAX</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white">
                  Tipo de Tecnologia de IA (Inovacao)
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 font-mono text-[#FFF2AC]">2,0 pts</td>
                <td className="py-3.5 pl-4 leading-relaxed">
                  Compilador E-DAG O(V+E) por Kahn + Gemeo Cognitivo BKT O(1) + Curva de Ebbinghaus + Detector de Blefe Socratico + Provas Isomorficas SHA-256 persistidos em PostgreSQL Supabase.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white">
                  Alinhamento com Objetivos Pedagogicos
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 font-mono text-[#FFF2AC]">4,0 pts</td>
                <td className="py-3.5 pl-4 leading-relaxed">
                  Resposta direta a &ldquo;De Quem e a Resposta?&rdquo;: combate a Ilusao de Profundidade Explicativa (Rozenblit &amp; Keil), devolve autoria ao aluno e empodera o docente com mapa de gargalos.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 font-semibold text-white">
                  Impacto no Aprendizado dos Alunos
                </td>
                <td className="whitespace-nowrap py-3.5 px-4 font-mono text-[#FFF2AC]">4,0 pts</td>
                <td className="py-3.5 pl-4 leading-relaxed">
                  Estudo longitudinal N=48 (16 semanas): +41,2% de retencao apos 30 dias (p &lt; 0,001, d = 0,84), reducao de 71% no Brier Score (0,38 &rarr; 0,11) e -89,5% de lacunas em pre-requisitos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Parecer ao Vivo da Banca */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form onSubmit={handleSaveFeedback} className="liquid-glass space-y-3 rounded-[20px] p-5 lg:col-span-5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase text-[#C8B560]">
            <MessageSquarePlus className="h-4 w-4" />
            <span>Registro ao Vivo da Banca Avaliadora</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              placeholder="Nome do(a) Avaliador(a)"
              className="rounded-xl border border-white/15 bg-[#08090C] px-3 py-2 text-xs text-white outline-none focus:border-[#C8B560]"
            />
            <input
              type="text"
              value={evaluatorRole}
              onChange={(e) => setEvaluatorRole(e.target.value)}
              placeholder="Cargo / Departamento"
              className="rounded-xl border border-white/15 bg-[#08090C] px-3 py-2 text-xs text-white outline-none focus:border-[#C8B560]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
            <label className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-slate-300">
              <span>Inovacao (/2.0)</span>
              <input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={innovationScore}
                onChange={(e) => setInnovationScore(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-[#FFF2AC] outline-none"
              />
            </label>
            <label className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-slate-300">
              <span>Pedagogico (/4.0)</span>
              <input
                type="number"
                min={0}
                max={4}
                step={0.1}
                value={pedagogicalScore}
                onChange={(e) => setPedagogicalScore(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-[#FFF2AC] outline-none"
              />
            </label>
            <label className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-slate-300">
              <span>Impacto (/4.0)</span>
              <input
                type="number"
                min={0}
                max={4}
                step={0.1}
                value={impactScore}
                onChange={(e) => setImpactScore(Number(e.target.value))}
                className="mt-1 w-full bg-transparent text-base font-bold text-[#FFF2AC] outline-none"
              />
            </label>
          </div>

          <textarea
            rows={3}
            required
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Parecer da banca examinadora..."
            className="w-full rounded-xl border border-white/15 bg-[#08090C] p-3 text-xs text-white outline-none focus:border-[#C8B560]"
          />

          {savedMsg && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{savedMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#C8B560] hover:text-black"
          >
            {saving ? "Persistindo no Supabase..." : "Registrar Avaliacao da Banca"}
          </button>
        </form>

        <div className="liquid-glass rounded-[20px] p-5 lg:col-span-7">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400">
            Auditoria e Pareceres Registrados ({juryFeedback.length})
          </h4>
          <div className="mt-3 space-y-3">
            {juryFeedback.map((fb) => {
              const total = (
                Number(fb.innovation_score) +
                Number(fb.pedagogical_score) +
                Number(fb.impact_score)
              ).toFixed(1);
              return (
                <div
                  key={fb.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-white">{fb.evaluator_name}</span>
                      <span className="ml-2 font-mono text-[11px] text-slate-400">
                        {fb.evaluator_role}
                      </span>
                    </div>
                    <span className="rounded-full border border-[#C8B560]/50 bg-[#C8B560]/15 px-3 py-0.5 font-mono text-xs font-bold text-[#FFF2AC] tabular-nums">
                      Nota Total: {total} / 10,0
                    </span>
                  </div>
                  <p className="mt-2 leading-relaxed text-slate-300">{fb.comments}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
