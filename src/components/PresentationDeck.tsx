"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

interface SlideItem {
  number: string;
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  windowTime: string;
}

const SLIDES: SlideItem[] = [
  {
    number: "01",
    tag: "IV SIMPOSIO DE IA — UNIMAX",
    title: "De quem e a resposta?",
    subtitle:
      "VERITAS: transformando a IA de oraculo que pensa pelo aluno em objeto de exame critico em sala de aula.",
    points: [
      "Autor: Matheus Sousa dos Santos (RA 52319400) — Ciencia da Computacao.",
      "Categoria Alunos — O Futuro em Nossas Maos.",
      "Sistema em producao conectado ao banco em nuvem.",
    ],
    windowTime: "00:00 - 01:30",
  },
  {
    number: "02",
    tag: "O PROBLEMA REAL",
    title: "A falsa sensacao de saber",
    subtitle:
      "Resumos prontos e respostas faceis criam estudantes confiantes na teoria, mas perdidos quando algo falha na pratica.",
    points: [
      "Quando 40 alunos usam a mesma IA, todas as respostas ficam quase iguais.",
      "Detectores automaticos de texto falham e acusam bons alunos por engano.",
      "O professor perde visibilidade de quem realmente aprendeu.",
    ],
    windowTime: "01:30 - 03:30",
  },
  {
    number: "03",
    tag: "PILAR 01 — RAIO-X DA IA",
    title: "Colocamos a IA na mesa de exame",
    subtitle:
      "O estudante recebe casos reais onde a IA errou em Computacao, Saude e Negocios.",
    points: [
      "Em Computacao: codigo de pagamento que falha quando varias pessoas clicam juntas.",
      "Em Saude: triagem que ignora queda grave de oxigenio.",
      "Em Negocios: contrato aprovado com multa escondida por pressa do usuario.",
    ],
    windowTime: "03:30 - 05:30",
  },
  {
    number: "04",
    tag: "PILAR 02 — TESTE DE AUTORIA",
    title: "Defesa em 60 segundos",
    subtitle:
      "Em vez de proibir a IA, alteramos 1 linha do trabalho entregue pelo aluno e medimos se ele percebe.",
    points: [
      "O sistema troca uma condicao critica no codigo ou regra do estudante.",
      "Se o aluno realmente construiu o raciocinio, ele encontra o erro na hora.",
      "Ao acertar, recebe um selo digital unico de autoria verificada.",
    ],
    windowTime: "05:30 - 07:30",
  },
  {
    number: "05",
    tag: "PILAR 03 — ARENA AO VIVO",
    title: "Medindo a originalidade da sala",
    subtitle:
      "Todos respondem pelo celular e o mapa mostra em tempo real se a turma caiu no efeito manada.",
    points: [
      "Respostas repetidas formam um bloco fechado no mapa.",
      "Quando isso acontece, o professor muda uma regra da aula na hora.",
      "Os dois pensamentos mais opostos sobem para o debate.",
    ],
    windowTime: "07:30 - 10:00",
  },
  {
    number: "06",
    tag: "RESULTADOS — 16 SEMANAS",
    title: "Evidencia com 48 estudantes",
    subtitle:
      "Comparacao entre turma usando resumos comuns de IA e turma usando VERITAS na UniMAX.",
    points: [
      "Autonomia pratica subiu de 49,8% para 92,8% ao final do semestre.",
      "Originalidade das respostas em sala chegou a 93,0%.",
      "Aplicavel em Computacao, Direito, Administracao e Saude.",
    ],
    windowTime: "10:00 - 12:30",
  },
  {
    number: "07",
    tag: "TESTE AO VIVO AGORA",
    title: "A resposta volta a ser humana",
    subtitle:
      "Escaneie o QR Code para participar da Arena ao Vivo e registrar sua avaliacao direto no banco da apresentacao.",
    points: [
      "A IA nao assina laudo medico, contrato nem sistema critico.",
      "Quem aprende a auditar a maquina assume o controle da propria carreira.",
      "Obrigado — aberto as perguntas da banca.",
    ],
    windowTime: "12:30 - 15:00",
  },
];

export default function PresentationDeck() {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const slide = SLIDES[index];

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      else if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?tab=arena`
        : "https://simposio-max.vercel.app/?tab=arena";
    QRCode.toDataURL(url, {
      margin: 1,
      width: 200,
      color: { dark: "#0A0A0A", light: "#F0EDE6" },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, []);

  const fmt = (sec: number) =>
    `${Math.floor(sec / 60).toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="apple-dock-glass flex items-center justify-between rounded-full px-4 py-2.5">
          <Link
            href="/"
            aria-label="Voltar ao sistema"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6] transition hover:bg-[#C8B560] hover:text-[#0A0A0A]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.7} />
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs text-[#F0EDE6]">
            <span className="text-[#F0EDE6]/55">
              {slide.number} / 0{SLIDES.length}
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-[#2A2A2A] px-3 py-1.5 text-[#C8B560] tabular-nums">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span>{fmt(secondsLeft)}</span>
            </div>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              aria-label={running ? "Pausar" : "Iniciar"}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6] hover:text-[#C8B560]"
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(15 * 60);
              }}
              aria-label="Zerar"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]/70 hover:text-[#F0EDE6]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <main key={slide.number} className="apple-view-enter apple-shell">
          <div className="apple-card flex min-h-[460px] flex-col justify-between p-7 sm:p-12">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-[#C8B560]">
                <span>{slide.tag}</span>
                <span className="text-[#F0EDE6]/45 tabular-nums">{slide.windowTime}</span>
              </div>

              <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-[#F0EDE6] sm:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#F0EDE6]/65 sm:text-lg">
                {slide.subtitle}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className={`space-y-3 ${index === SLIDES.length - 1 ? "lg:col-span-8" : "lg:col-span-12"}`}>
                  {slide.points.map((pt, i) => (
                    <div key={i} className="apple-subcard flex items-start gap-3 p-4 text-sm text-[#F0EDE6]/85">
                      <span className="font-mono text-xs font-semibold text-[#C8B560]">
                        0{i + 1}
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                {index === SLIDES.length - 1 && qrDataUrl && (
                  <div className="apple-subcard flex flex-col items-center justify-center p-5 text-center lg:col-span-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrDataUrl} alt="QR Code Arena ao Vivo" className="h-36 w-36 rounded-2xl" />
                    <span className="mt-3 text-xs text-[#C8B560]">
                      Aponte a camera para participar
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#5C5C5C]/25 pt-5">
              <div className="flex gap-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => setIndex(idx)}
                    aria-label={`Slide ${s.number}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === index ? "w-8 bg-[#C8B560]" : "w-2 bg-[#5C5C5C]/50 hover:bg-[#F0EDE6]/50"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  aria-label="Slide anterior"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6] disabled:opacity-35"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  disabled={index === SLIDES.length - 1}
                  onClick={() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1))}
                  aria-label="Proximo slide"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C8B560] text-[#0A0A0A] disabled:opacity-35"
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
