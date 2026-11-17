"use client";

import React from "react";
import { ArrowUpRight, BookOpen, Radio, ScanSearch, ShieldCheck } from "lucide-react";

export type VeritasTab =
  | "home"
  | "notebook"
  | "autopsy"
  | "mutation"
  | "arena"
  | "faculty";

interface OverviewHubProps {
  notesCount: number;
  solvedAutopsiesCount: number;
  verifiedProofsCount: number;
  arenaOriginality: number;
  onNavigate: (tab: VeritasTab) => void;
}

export default function OverviewHub({
  notesCount,
  solvedAutopsiesCount,
  verifiedProofsCount,
  arenaOriginality,
  onNavigate,
}: OverviewHubProps) {
  const pillars: Array<{
    id: VeritasTab;
    title: string;
    subtitle: string;
    stat: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  }> = [
    {
      id: "notebook",
      title: "Caderno e Provas",
      subtitle: "Anote suas aulas, acompanhe datas de prova e veja o que faltou estudar.",
      stat: `${notesCount} materias`,
      icon: BookOpen,
    },
    {
      id: "autopsy",
      title: "Raio-X da IA",
      subtitle: "Veja a IA errar ao vivo em codigo, saude e contratos e corrija a falha.",
      stat: `${solvedAutopsiesCount} analises`,
      icon: ScanSearch,
    },
    {
      id: "mutation",
      title: "Teste de Autoria",
      subtitle: "Alteramos 1 linha do seu trabalho e voce tem 60s para achar e defender.",
      stat: `${verifiedProofsCount} selos`,
      icon: ShieldCheck,
    },
    {
      id: "arena",
      title: "Arena ao Vivo",
      subtitle: "A turma responde pelo celular e o mapa mostra respostas repetidas de IA.",
      stat: `${arenaOriginality}% original`,
      icon: Radio,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero limpo, direto e sem pilulas */}
      <section className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs tracking-[0.22em] text-[#C8B560] uppercase">
            VERITAS // UNIMAX
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#F0EDE6] sm:text-6xl leading-[1.05]">
            De quem e a resposta quando a IA decide por voce?
          </h1>
          <p className="text-base leading-relaxed text-[#F0EDE6]/65 sm:text-lg">
            Em vez de entregar respostas prontas, colocamos a IA na mesa de exame. O estudante aprende encontrando onde a maquina falha e provando que domina o que entrega.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate("autopsy")}
          className="group inline-flex w-fit items-center gap-4 rounded-full bg-[#C8B560] py-2 pl-6 pr-2 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97]"
        >
          <span>Comecar exame</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A]/15 transition-transform duration-300 apple-ease group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </button>
      </section>

      {/* 4 Modulos Principais acessados direto por icones */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="apple-shell group text-left transition-transform duration-500 apple-ease hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className="apple-card flex h-full flex-col justify-between p-7">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2A2A2A]/70 text-[#C8B560] transition-colors duration-300 group-hover:bg-[#C8B560] group-hover:text-[#0A0A0A]">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </div>
                  <span className="font-mono text-xs text-[#F0EDE6]/50 tabular-nums">
                    {item.stat}
                  </span>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-[#F0EDE6]">
                      {item.title}
                    </h2>
                    <ArrowUpRight
                      className="h-4 w-4 text-[#5C5C5C] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C8B560]"
                      strokeWidth={1.6}
                    />
                  </div>
                  <p className="text-sm leading-relaxed text-[#F0EDE6]/60">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Resumo numerico minimalista (3 numeros limpos, sem excesso de texto) */}
      <section className="apple-shell">
        <div className="apple-card grid grid-cols-1 divide-y divide-[#5C5C5C]/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold text-[#C8B560] tabular-nums">
              +43%
            </div>
            <div className="mt-1.5 text-sm text-[#F0EDE6]/70">
              Mais autonomia real apos 16 semanas
            </div>
          </div>
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold text-[#F0EDE6] tabular-nums">
              93%
            </div>
            <div className="mt-1.5 text-sm text-[#F0EDE6]/70">
              Originalidade nas respostas em sala
            </div>
          </div>
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold text-[#F0EDE6] tabular-nums">
              60s
            </div>
            <div className="mt-1.5 text-sm text-[#F0EDE6]/70">
              Para provar dominio sobre a entrega
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
