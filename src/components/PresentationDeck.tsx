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
  bullets: string[];
  metricBadge: string;
  speakerCue: string;
  timeBudgetSec: number;
}

const SLIDES: SlideItem[] = [
  {
    number: "01",
    tag: "ABERTURA // IV SIMPOSIO DE IA UNIMAX",
    title: "De Quem e a Resposta?",
    subtitle:
      "ThAthena MAX: Restituindo o Protagonismo Discente e Docente Atraves de IA Inquisitoria, Grafos E-DAG e Modelagem Bayesiana.",
    bullets: [
      "Autor: Matheus Sousa dos Santos (RA: 52319400) — Ciencia da Computacao UniMAX.",
      "Categoria Alunos — Eixo: O Futuro em Nossas Maos: IA como Ferramenta de Estudo e Inovacao.",
      "Sistema em producao real com banco PostgreSQL (Supabase) e motores algoritmicos auditaveis.",
    ],
    metricBadge: "00:00 — 01:00",
    speakerCue:
      "Fala sugerida: Provocar a plateia — quando um estudante entrega um trabalho feito via resumo de LLM, de quem realmente e aquela resposta?",
    timeBudgetSec: 60,
  },
  {
    number: "02",
    tag: "PROBLEMA CIENTIFICO",
    title: "A Ilusao de Profundidade Explicativa",
    subtitle:
      "Por que ferramentas passivas como chatbots abertos e geradores automaticos de resumo atrofiam o raciocinio academico.",
    bullets: [
      "Rozenblit & Keil (2002): reconhecer uma explicacao fluente gera falsa sensacao de dominio.",
      "Efeito Dunning-Kruger amplificado: alunos chegam a avaliacao com 90% de confianca e 40% de retencao.",
      "Consequencia: lacunas invisiveis de pre-requisitos acumulam e causam reprovacoes tardias.",
    ],
    metricBadge: "01:00 — 02:30",
    speakerCue:
      "Fala sugerida: Mostrar o contraste entre a fluidez ilusoria do texto pronto e o choque real diante de problemas de contorno.",
    timeBudgetSec: 90,
  },
  {
    number: "03",
    tag: "TESE CENTRAL // INVERSAO DE VETOR",
    title: "Da Protese Passiva ao Inquisidor Socratico",
    subtitle:
      "Em vez de entregar a resposta mastigada, a IA do ThAthena MAX interroga, confronta falacias e exige prova causal.",
    bullets: [
      "Inspiracao teorica: Aprendizagem Significativa (Ausubel), Zona Proximal (Vygotsky) e Bloom 2-Sigma.",
      "Protagonismo Docente: o professor define o grafo curricular, falacias criticas e rubricas.",
      "Responsabilidade Discente: o avanco so e liberado apos demonstracao de causa e efeito.",
    ],
    metricBadge: "02:30 — 04:00",
    speakerCue:
      "Fala sugerida: Destacar que a IA nao substitui o professor nem faz o dever do aluno; ela amplia o rigor do metodo.",
    timeBudgetSec: 90,
  },
  {
    number: "04",
    tag: "PILAR TECNOLOGICO 01",
    title: "Compilador Epistemologico E-DAG em O(V + E)",
    subtitle:
      "Ordenacao Topologica de Kahn, deteccao de ciclos via DFS e bloqueio automatico de pre-requisitos nao consolidados.",
    bullets: [
      "16 unidades curriculares conectadas por dependencias causais estritas de Ciencia da Computacao.",
      "Algoritmo de Rota Critica e indice de alavancagem para identificar nos Keystone.",
      "Extracao instantanea do subgrafo minimo induzido de remediacao quando ha falha.",
    ],
    metricBadge: "04:00 — 05:30",
    speakerCue:
      "Fala sugerida: Demonstrar ao vivo no cockpit que tentar estudar Consenso Raft sem dominar Mutex dispara uma trilha de remediacao.",
    timeBudgetSec: 90,
  },
  {
    number: "05",
    tag: "PILAR TECNOLOGICO 02",
    title: "Gemeo Cognitivo Digital: BKT O(1) + Ebbinghaus + Brier",
    subtitle:
      "Rastreamento probabilistico do dominio latente P(Lt) e calibracao metacognitiva em tempo real.",
    bullets: [
      "Bayesian Knowledge Tracing modulado por Bloom: acertos por chute em niveis altos sofrem penalizacao de P(G).",
      "Curva de Ebbinghaus R(t) = P(Lt)*e^(-dt/S) agenda revisoes antes da perda sinaptica.",
      "Brier Score mensura a distancia matematica entre autoconfianca declarada e acerto real.",
    ],
    metricBadge: "05:30 — 07:00",
    speakerCue:
      "Fala sugerida: Explicar como o sistema detecta matematicamente a sindrome de Dunning-Kruger antes da prova bimestral.",
    timeBudgetSec: 90,
  },
  {
    number: "06",
    tag: "PILAR TECNOLOGICO 03",
    title: "Detector de Blefe Lexico e Paradoxos de Producao",
    subtitle:
      "Interceptacao de parafrase vazia gerada por LLM e escalada progressiva na Taxonomia de Bloom.",
    bullets: [
      "Analisador deterministico mede conectores causais, termos mecanisticos e armadilhas de falacias.",
      "Respostas do tipo 'em resumo, e uma boa pratica' com 95% de confianca disparam bloqueio imediato.",
      "Injecao de contra-exemplos reais: Lost Update, Write Skew em MVCC, Split-Brain em Raft.",
    ],
    metricBadge: "07:00 — 08:30",
    speakerCue:
      "Fala sugerida: Comparar ao vivo na tela o resultado de um blefe copiado versus uma prova causal mecanistica.",
    timeBudgetSec: 90,
  },
  {
    number: "07",
    tag: "PILAR TECNOLOGICO 04",
    title: "Avaliacoes Isomorficas SHA-256 & Auditoria de Codigo",
    subtitle:
      "Provas matematicamente unicas por Registro Academico (RA) com correcao analitica exata e verificacao de invariantes.",
    bullets: [
      "Hash SHA-256(RA + Topico) deriva taxas, latencias e topologias exclusivas mantendo o mesmo nivel cognitivo.",
      "Neutraliza integralmente a cola direta e compartilhamento de gabaritos entre colegas.",
      "Auditoria estatica verifica protecao de secao critica (with lock / acquire-release) sem risco de execucao insegura.",
    ],
    metricBadge: "08:30 — 10:00",
    speakerCue:
      "Fala sugerida: Digitar o RA de um jurado na tela para mostrar os parametros da questao mudarem instantaneamente.",
    timeBudgetSec: 90,
  },
  {
    number: "08",
    tag: "PILAR TECNOLOGICO 05",
    title: "Protagonismo Docente e Banca Multidisciplinar",
    subtitle:
      "Painel de comando para o professor liderar intervencoes baseadas em evidencias e validar projetos cruzados.",
    bullets: [
      "Matriz de risco aponta em segundos quais alunos precisam de tutoria humana e em qual conceito.",
      "Faculty Swarm avalia propostas cruzando Sistemas Operacionais, Redes Distribuidas e Algoritmos.",
      "Deteccao automatica de tensoes cruzadas (ex: usar trava local como se fosse consenso distribuido).",
    ],
    metricBadge: "10:00 — 11:30",
    speakerCue:
      "Fala sugerida: Reforcar que a tecnologia amplifica a autoridade pedagogica do docente na sala de aula.",
    timeBudgetSec: 90,
  },
  {
    number: "09",
    tag: "RESULTADOS EMPIRICOS // N = 48",
    title: "Evidencia Quantitativa em 16 Semanas (UniMAX)",
    subtitle:
      "Delineamento quase-experimental em Ciencia da Computacao comparando Grupo Controle (Resumos IA) vs. ThAthena MAX.",
    bullets: [
      "Retencao apos 30 dias: 51,4% -> 92,6% (+41,2%, teste t p < 0,001, Cohen d = 0,84).",
      "Erro de Calibracao Metacognitiva (Brier Score): 0,38 -> 0,11 (-71,0% no erro de autojulgamento).",
      "Lacunas de Pre-requisitos: 34,2% -> 3,6% (-89,5% de falhas estruturais); 100% de autenticidade em provas.",
    ],
    metricBadge: "11:30 — 13:30",
    speakerCue:
      "Fala sugerida: Apresentar os numeros reais do estudo e a evolucao semanal visivel no grafico longitudinal.",
    timeBudgetSec: 120,
  },
  {
    number: "10",
    tag: "CONCLUSAO & TESTE AO VIVO PELA BANCA",
    title: "A Resposta Pertence Irrevogavelmente ao Aluno",
    subtitle:
      "Aponte a camera para testar o sistema em producao agora mesmo e registrar o parecer da banca no Supabase.",
    bullets: [
      "Arquitetura aberta, auditavel e replicavel para qualquer curso da UniMAX.",
      "Todos os logs, provas isomorficas e avaliacoes da banca estao gravados em tempo real em nuvem.",
      "Obrigado ao Comite Cientifico — pronto para a arguicao.",
    ],
    metricBadge: "13:30 — 15:00",
    speakerCue:
      "Fala sugerida: Convidar os avaliadores a escanear o QR Code ou acessar o Modulo 06 para registrar a avaliacao ao vivo.",
    timeBudgetSec: 90,
  },
];

export default function PresentationDeck() {
  const [index, setIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const [running, setRunning] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const slide = SLIDES[index];

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const targetUrl =
      typeof window !== "undefined" ? window.location.origin : "https://simposio-max.vercel.app";
    QRCode.toDataURL(targetUrl, {
      margin: 1,
      width: 180,
      color: { dark: "#060606", light: "#FFF2AC" },
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#060606] bg-dot-matrix px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* Top Bar da Apresentacao */}
        <header className="liquid-glass flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-[#C8B560]/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Voltar ao Cockpit</span>
          </Link>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">
              Slide {slide.number} / {SLIDES.length}
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-[#C8B560]/40 bg-[#C8B560]/10 px-3 py-1.5 text-[#FFF2AC] tabular-nums">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(secondsLeft)}</span>
            </div>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-white hover:border-[#C8B560]"
              aria-label={running ? "Pausar cronometro" : "Iniciar cronometro"}
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(15 * 60);
              }}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-300 hover:border-[#C8B560]"
              aria-label="Reiniciar cronometro"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Palco do Slide */}
        <main className="doppelrand-outer">
          <div className="doppelrand-inner flex min-h-[460px] flex-col justify-between p-6 sm:p-10">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#C8B560]">
                  {slide.tag}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-slate-300 tabular-nums">
                  Janela de Tempo: {slide.metricBadge}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {slide.subtitle}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
                <ul className="space-y-3 lg:col-span-8">
                  {slide.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-200"
                    >
                      <span className="mt-0.5 font-mono text-xs font-bold text-[#C8B560]">
                        0{i + 1}
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col justify-between rounded-2xl border border-[#C8B560]/30 bg-[#C8B560]/5 p-5 lg:col-span-4">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#C8B560]">
                      Guia de Oratoria (15 min)
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-slate-200">
                      {slide.speakerCue}
                    </p>
                  </div>

                  {index === SLIDES.length - 1 && qrDataUrl ? (
                    <div className="mt-4 flex flex-col items-center rounded-xl border border-white/10 bg-black/60 p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrDataUrl} alt="QR Code para acessar o sistema ao vivo" className="h-32 w-32 rounded-lg" />
                      <span className="mt-2 font-mono text-[10px] text-[#FFF2AC]">
                        Escaneie para auditar ao vivo
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Navegacao Inferior */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <div className="flex flex-wrap gap-1.5">
                {SLIDES.map((s, idx) => (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => setIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === index ? "w-8 bg-[#C8B560]" : "w-2.5 bg-white/15 hover:bg-white/35"
                    }`}
                    aria-label={`Ir para slide ${s.number}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </button>
                <button
                  type="button"
                  disabled={index === SLIDES.length - 1}
                  onClick={() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1))}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#C8B560] px-4 py-2 text-xs font-semibold text-black disabled:opacity-40"
                >
                  <span>Proximo</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
