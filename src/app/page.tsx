"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  GraduationCap,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageSquare,
  School,
  ShieldCheck,
  Sparkle,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [currentUser, setCurrentUser] = useState<{
    full_name: string;
    role: string;
  } | null>(null);

  const [activeMockupTab, setActiveMockupTab] = useState<
    "caderno" | "turmas" | "progresso" | "copiloto"
  >("caderno");

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/state", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (
          data.currentUser &&
          typeof window !== "undefined" &&
          window.sessionStorage.getItem("veritas_logged_out") !== "1"
        ) {
          setCurrentUser({
            full_name: data.currentUser.full_name,
            role: data.currentUser.role,
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] antialiased selection:bg-[#C8B560]/20 selection:text-[#F0EDE6]">
      {/* ============================================================ */}
      {/* 1. TOPBAR INSTITUCIONAL COM LOGO MANUSCRITO DA THINKA         */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logotipo Thinka com tipografia manuscrita e monograma */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2A2A2A] font-display text-sm font-bold text-[#C8B560] shadow-sm ring-1 ring-[#F0EDE6]/10 transition group-hover:bg-[#C8B560] group-hover:text-[#0A0A0A]">
              T
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-logo text-2xl font-bold tracking-wide text-[#F0EDE6] transition group-hover:text-[#C8B560]">
                thinka
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#C8B560]" />
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-[#5C5C5C] sm:inline">
                educação
              </span>
            </div>
          </Link>

          {/* Navegação Principal Desktop */}
          <nav className="hidden items-center gap-7 text-xs font-medium text-[#F0EDE6]/70 md:flex">
            <a href="#recursos" className="transition hover:text-[#C8B560]">
              Recursos
            </a>
            <a href="#demonstracao" className="transition hover:text-[#C8B560]">
              Como Funciona
            </a>
            <a href="#alunos" className="transition hover:text-[#C8B560]">
              Para Alunos
            </a>
            <a href="#professores" className="transition hover:text-[#C8B560]">
              Para Professores
            </a>
            <a href="#diferenciais" className="transition hover:text-[#C8B560]">
              Diferenciais
            </a>
            <a href="#faq" className="transition hover:text-[#C8B560]">
              FAQ
            </a>
          </nav>

          {/* Ações e Sessão */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Painel ({currentUser.full_name.split(" ")[0]})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3.5 py-2 text-xs font-medium text-[#F0EDE6]/75 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="flex items-center gap-1.5 rounded-xl bg-[#F0EDE6] px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#C8B560]"
                >
                  <span>Começar agora</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </>
            )}

            {/* Botão Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2A2A2A] text-[#F0EDE6] md:hidden"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Expansível */}
        {mobileMenuOpen && (
          <div className="border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3 text-sm">
              <a
                href="#recursos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Recursos da Plataforma
              </a>
              <a
                href="#demonstracao"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Demonstração em Ação
              </a>
              <a
                href="#alunos"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Experiência do Aluno
              </a>
              <a
                href="#professores"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Experiência do Professor
              </a>
              <a
                href="#diferenciais"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Diferenciais
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Perguntas Frequentes
              </a>
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-[#2A2A2A] pt-4">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-lg border border-[#2A2A2A] py-2 text-xs font-semibold text-[#F0EDE6]"
              >
                Entrar na minha conta
              </Link>
              <Link
                href="/cadastro"
                className="flex items-center justify-center rounded-lg bg-[#C8B560] py-2 text-xs font-semibold text-[#0A0A0A]"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* 2. PRIMEIRA DOBRA (HERO SECTION) EDUCACIONAL & MEMORÁVEL      */}
      {/* ============================================================ */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow de Boas-Vindas */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#141414] px-4 py-1.5 text-xs text-[#C8B560]">
            <span className="h-2 w-2 rounded-full bg-[#C8B560]" />
            <span className="font-medium">
              Plataforma Educacional para Alunos e Professores
            </span>
          </div>

          {/* Título Principal Convidativo e Marcante */}
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-[#F0EDE6] sm:text-6xl sm:leading-[1.1]">
            Onde o estudo ganha clareza e ensinar volta a ser inspirador.
          </h1>

          {/* Subtítulo Persuasivo */}
          <p className="mt-6 text-base leading-relaxed text-[#F0EDE6]/70 sm:text-lg">
            A Thinka reúne a rotina acadêmica em um espaço leve e organizado: cadernos por
            disciplina, radar de provas com contagem regressiva, gestão de turmas com código de
            convite e orientação de estudos que desafia você a pensar de verdade.
          </p>

          {/* Ações Primárias */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-xl bg-[#C8B560] px-6 py-3.5 text-sm font-semibold text-[#0A0A0A] shadow-md transition hover:bg-[#F0EDE6]"
            >
              <span>Começar gratuitamente</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#141414] px-6 py-3.5 text-sm font-semibold text-[#F0EDE6] transition hover:border-[#5C5C5C] hover:bg-[#1E1E1E]"
            >
              <LogIn className="h-4 w-4 text-[#C8B560]" />
              <span>Acessar plataforma</span>
            </Link>
          </div>

          {/* Três micro-vantagens com check discreto */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5C5C5C]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Sem cartões ou taxas ocultas</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Ambiente individual e de turma</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Acesso rápido via celular e desktop</span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. DEMONSTRAÇÃO VISUAL EM FUNCIONAMENTO (MOCKUP INTERATIVO)   */}
        {/* ============================================================ */}
        <div id="demonstracao" className="mt-16 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-1.5 shadow-2xl">
          {/* Barra superior de janela de aplicativo */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#2A2A2A] bg-[#0E0E0E] px-5 py-3.5 sm:flex-row sm:items-center rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
              </div>
              <span className="text-xs font-medium text-[#5C5C5C]">
                Plataforma Thinka • Demonstração em Tempo Real
              </span>
            </div>

            {/* Abas do Mockup para o visitante explorar */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveMockupTab("caderno")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeMockupTab === "caderno"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                    : "bg-[#1E1E1E] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                Caderno de Estudos
              </button>
              <button
                type="button"
                onClick={() => setActiveMockupTab("turmas")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeMockupTab === "turmas"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                    : "bg-[#1E1E1E] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                Turmas & Docentes
              </button>
              <button
                type="button"
                onClick={() => setActiveMockupTab("progresso")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeMockupTab === "progresso"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                    : "bg-[#1E1E1E] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                Radar de Avaliações
              </button>
              <button
                type="button"
                onClick={() => setActiveMockupTab("copiloto")}
                className={`rounded-lg px-3 py-1.5 transition ${
                  activeMockupTab === "copiloto"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                    : "bg-[#1E1E1E] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                Copiloto de Dúvidas
              </button>
            </div>
          </div>

          {/* Conteúdo Dinâmico do Mockup */}
          <div className="p-6 sm:p-8 bg-[#0A0A0A] rounded-b-xl min-h-[380px] flex flex-col justify-center">
            {activeMockupTab === "caderno" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Disciplina Ativa • Cálculo Diferencial e Integral
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#F0EDE6]">
                      Anotações de Aula: Regra da Cadeia e Limites Fundamentais
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#2A2A2A] px-3.5 py-1.5 text-xs text-[#C8B560]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Prova 01 em 4 dias</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-semibold text-[#5C5C5C] uppercase tracking-wider">
                      Resumo Estruturado do Estudante
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-[#F0EDE6]/80">
                      Na aula de hoje o professor demonstrou que a derivada da função composta
                      f(g(x)) é igual a f&apos;(g(x)) vezes g&apos;(x). Aplicamos o método para funções
                      trigonométricas e calculamos limites indeterminados do tipo 0/0.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-[#2A2A2A] px-2.5 py-1 text-[#F0EDE6]">
                        #calculo1
                      </span>
                      <span className="rounded-md bg-[#2A2A2A] px-2.5 py-1 text-[#F0EDE6]">
                        #derivadas
                      </span>
                      <span className="rounded-md bg-[#2A2A2A] px-2.5 py-1 text-[#C8B560]">
                        #revisar-para-prova
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-semibold text-[#C8B560] uppercase tracking-wider">
                      Diagnóstico do Copiloto
                    </span>
                    <div className="mt-3 space-y-3 text-xs text-[#F0EDE6]/75">
                      <div className="border-l-2 border-[#10B981] pl-3">
                        <span className="font-semibold text-[#10B981]">Ponto Forte:</span>
                        <p className="mt-0.5 text-[11px] text-[#5C5C5C]">
                          Compreensão da fórmula geral da regra da cadeia bem consolidada.
                        </p>
                      </div>
                      <div className="border-l-2 border-[#C8B560] pl-3">
                        <span className="font-semibold text-[#C8B560]">Atenção:</span>
                        <p className="mt-0.5 text-[11px] text-[#5C5C5C]">
                          Falta praticar a composição quando há funções exponenciais mistas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMockupTab === "turmas" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Visão do Docente • Gestão Acadêmica
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#F0EDE6]">
                      Turma CC-2026 • Ciência da Computação
                    </h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-[#1E1E1E] px-3.5 py-1.5 font-mono text-xs text-[#F0EDE6]">
                    <span>Código de Acesso:</span>
                    <span className="font-bold text-[#C8B560]">THK-COMP-4B</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C]">
                      <span>Alunos Vinculados</span>
                      <Users className="h-4 w-4 text-[#C8B560]" />
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold text-[#F0EDE6]">
                      38 matriculados
                    </div>
                    <div className="mt-1 text-xs text-[#10B981]">
                      3 solicitações aprovadas hoje
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C]">
                      <span>Mural de Avisos</span>
                      <MessageSquare className="h-4 w-4 text-[#C8B560]" />
                    </div>
                    <div className="mt-2 font-display text-base font-semibold text-[#F0EDE6]">
                      Entrega do Projeto Prático
                    </div>
                    <div className="mt-1 text-xs text-[#5C5C5C]">
                      Prazo final: 24 de Novembro às 23h59
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between text-xs text-[#5C5C5C]">
                      <span>Turno e Sala</span>
                      <School className="h-4 w-4 text-[#C8B560]" />
                    </div>
                    <div className="mt-2 font-display text-base font-semibold text-[#F0EDE6]">
                      Noturno • Lab 04
                    </div>
                    <div className="mt-1 text-xs text-[#5C5C5C]">
                      Aulas às terças e quintas-feiras
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeMockupTab === "progresso" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Cronograma Acadêmico Inteligente
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#F0EDE6]">
                      Radar de Avaliações e Entregas do Semestre
                    </h3>
                  </div>
                  <span className="text-xs text-[#5C5C5C]">
                    3 avaliações nos próximos 15 dias
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#C8B560]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#C8B560]">
                        EM 4 DIAS
                      </span>
                      <Calendar className="h-3.5 w-3.5 text-[#5C5C5C]" />
                    </div>
                    <h4 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                      Prova de Cálculo I
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      Conteúdo: Limites, derivadas e aplicações.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#1E1E1E] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#F0EDE6]/80">
                        EM 9 DIAS
                      </span>
                      <Calendar className="h-3.5 w-3.5 text-[#5C5C5C]" />
                    </div>
                    <h4 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                      Algoritmos e Estruturas
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      Entrega do trabalho de árvores binárias.
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-[#1E1E1E] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#F0EDE6]/80">
                        EM 14 DIAS
                      </span>
                      <Calendar className="h-3.5 w-3.5 text-[#5C5C5C]" />
                    </div>
                    <h4 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                      Banco de Dados Relacional
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      Avaliação prática de SQL e normalização.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeMockupTab === "copiloto" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Orientação Pedagógica Ativa
                    </span>
                    <h3 className="mt-1 font-display text-xl font-bold text-[#F0EDE6]">
                      Copiloto Socrático: Teste seu Domínio
                    </h3>
                  </div>
                  <span className="text-xs text-[#10B981]">
                    Sem respostas automáticas • Foco no raciocínio
                  </span>
                </div>

                <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8B560]">
                    <Target className="h-4 w-4" />
                    <span>Desafio de Fixação Proposto para sua Anotação:</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#F0EDE6]/90">
                    &quot;Se tivermos uma função h(x) = sin(x² + 3), qual é a derivada mais externa
                    e qual é a derivada mais interna? Explique por que a resposta não é apenas
                    cos(x² + 3).&quot;
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#2A2A2A] pt-3 text-xs text-[#5C5C5C]">
                    <span>Objetivo: Garantir que você domine o conceito antes da aula prática.</span>
                    <span className="font-mono text-[#C8B560]">92% dos alunos aprovam o método</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. SEÇÃO DE RECURSOS (GRID ASSIMÉTRICO E CRIATIVO)            */}
      {/* ============================================================ */}
      <section id="recursos" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Recursos Construídos para Aprender
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Tudo o que você precisa para dominar suas disciplinas.
            </h2>
            <p className="mt-4 text-base text-[#5C5C5C]">
              Adeus anotações dispersas em cadernos de papel e avisos perdidos em grupos de
              mensagens. A Thinka centraliza o seu universo de estudos com leveza e clareza.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Caderno de Estudos */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <BookOpen className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Caderno Inteligente por Matéria
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Crie anotações ricas para cada disciplina do seu semestre. Organize fórmulas,
                conceitos e resumos em um espaço focado e livre de distrações.
              </p>
            </div>

            {/* Card 2: Radar de Avaliações */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Radar de Provas e Trabalhos
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Contagem regressiva automática para suas avaliações. Saiba exatamente quantos dias
                faltam para cada prova e planeje suas semanas sem ansiedade.
              </p>
            </div>

            {/* Card 3: Gestão de Turmas */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Turmas Conectadas com Código
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Professores criam turmas com código único e aprovam estudantes em um clique.
                Mural de comunicados oficial sem ruído ou conversas paralelas.
              </p>
            </div>

            {/* Card 4: Copiloto Socrático */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Copiloto Pedagógico
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Em vez de dar respostas prontas que anulam o raciocínio, o copiloto faz perguntas
                chave para você consolidar o aprendizado e testar seu domínio real.
              </p>
            </div>

            {/* Card 5: Metas de Aprendizagem */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Progresso e Metas Semanais
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Defina sua frequência de estudos, acompanhe disciplinas concluídas e veja sua
                confiança acadêmica crescer dia após dia com métricas visuais.
              </p>
            </div>

            {/* Card 6: Privacidade e Segurança */}
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7 transition hover:border-[#5C5C5C]">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1E1E1E] text-[#C8B560]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[#F0EDE6]">
                Privacidade & Segurança
              </h3>
              <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                Controle rigoroso sobre a visibilidade do seu perfil. Autenticação segura,
                sessões criptografadas e conformidade integral com proteção de dados (LGPD).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. EXPERIÊNCIA DO ALUNO (FOCO NO ESTUDANTE)                   */}
      {/* ============================================================ */}
      <section id="alunos" className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Para Estudantes
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Estude com autonomia, sem o estresse da véspera da prova.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5C5C5C]">
              A Thinka foi projetada para colocar você no controle da sua jornada. Sem pilhas de
              cadernos bagunçados e sem aquela sensação de não saber por onde começar a estudar.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Caderno sempre à mão no celular e no computador
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    Acesse suas anotações durante a aula no laboratório ou no ônibus. Tudo fica
                    salvo e sincronizado na sua conta.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Diga adeus a surpresas em datas de avaliações
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    O radar de provas calcula os dias restantes para cada exame, permitindo que
                    você distribua o conteúdo com calma ao longo das semanas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Descubra suas dúvidas antes da prova acontecer
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    O copiloto analisa suas anotações e faz perguntas provocativas para identificar
                    se há lacunas conceituais antes do exame chegar.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8B560] px-5 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <span>Criar minha conta de aluno</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Ilustrativo do Aluno */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] font-bold text-[#C8B560]">
                  M
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#F0EDE6]">Matheus Santos</span>
                  <p className="text-xs text-[#5C5C5C]">Ciência da Computação • 3º Ano</p>
                </div>
              </div>
              <span className="rounded-full bg-[#10B981]/15 px-3 py-1 font-mono text-[11px] font-semibold text-[#10B981]">
                Em Dia
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                <span className="text-xs text-[#5C5C5C]">Meta semanal de estudo</span>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F0EDE6]">12 de 15 horas completadas</span>
                  <span className="font-bold text-[#C8B560]">80%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[#2A2A2A]">
                  <div className="h-2 rounded-full bg-[#C8B560]" style={{ width: "80%" }} />
                </div>
              </div>

              <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                <span className="text-xs text-[#5C5C5C]">Próximo compromisso importante</span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F0EDE6]">
                    Entrega de Redes de Computadores
                  </span>
                  <span className="font-mono text-xs text-[#C8B560]">Amanhã</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXPERIÊNCIA DO PROFESSOR (FOCO NO DOCENTE)                 */}
      {/* ============================================================ */}
      <section id="professores" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Card Ilustrativo do Professor */}
            <div className="order-2 lg:order-1 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A2A2A] font-bold text-[#C8B560]">
                    P
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-[#F0EDE6]">
                      Prof. Carlos Alberto
                    </span>
                    <p className="text-xs text-[#5C5C5C]">
                      Departamento de Computação • UniMAX
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[#C8B560]/15 px-3 py-1 font-mono text-[11px] font-semibold text-[#C8B560]">
                  3 Turmas Ativas
                </span>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F0EDE6]">Estruturas de Dados B</span>
                    <span className="text-[#C8B560]">42 alunos</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5C5C5C]">
                    Mural atualizado com materiais da última aula prática.
                  </p>
                </div>

                <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F0EDE6]">Engenharia de Software</span>
                    <span className="text-[#C8B560]">36 alunos</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5C5C5C]">
                    Cronograma de entregas de sprints alinhado com a turma.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="font-mono text-xs uppercase text-[#C8B560]">
                Para Docentes & Educadores
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
                Mais conexão pedagógica, menos tempo gasto com burocracia.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5C5C5C]">
                A Thinka ajuda você a gerenciar turmas sem fricção: envie um código de acesso para a
                sala, aprove alunos em segundos e mantenha um canal oficial de comunicação que
                seus estudantes realmente leem.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Criação instantânea de turmas
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Crie um espaço para a sua disciplina em segundos. O sistema gera um código de
                      convite limpo que você compartilha no início do período letivo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Mural acadêmico sem ruído
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Publique orientações de provas, materiais e datas importantes em um mural
                      oficial que fica fixado e visível para toda a classe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Visão do ritmo de estudo dos alunos
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Acompanhe quem está ativo nas disciplinas e identifique matérias que merecem
                      uma aula de reforço antes da avaliação oficial.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F0EDE6] px-5 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#C8B560]"
                >
                  <span>Cadastrar como professor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. COMO A PLATAFORMA FUNCIONA (PASSO A PASSO SIMPLES)          */}
      {/* ============================================================ */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase text-[#C8B560]">
            Três Passos Simples
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
            Como a Thinka funciona no dia a dia.
          </h2>
          <p className="mt-3 text-sm text-[#5C5C5C]">
            Em menos de dois minutos você já está com o seu espaço acadêmico montado.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Passo 1 */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left">
            <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 01</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#F0EDE6]">
              Crie sua conta em 1 minuto
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Escolha seu perfil (Aluno ou Professor), informe sua instituição e configure suas
              disciplinas e preferências de estudo.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left">
            <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 02</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#F0EDE6]">
              Conecte-se à sua turma
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Estudantes entram digitando o código fornecido pelo professor; docentes criam suas
              turmas e compartilham com a sala com total controle de acesso.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left">
            <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 03</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-[#F0EDE6]">
              Aprenda, ensine e evolua
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Mantenha anotações organizadas, acompanhe o radar de datas de provas, receba
              desafios socráticos e estude com foco semana a semana.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. DIFERENCIAIS DA THINKA (POR QUE NÓS?)                     */}
      {/* ============================================================ */}
      <section id="diferenciais" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Nossa Filosofia
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Feito para o estudo de verdade, não para atalhos superficiais.
            </h2>
            <p className="mt-4 text-base text-[#5C5C5C]">
              A tecnologia deve amplificar a sua capacidade de pensar, não substituir o seu esforço.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7">
              <h4 className="font-display text-base font-semibold text-[#F0EDE6]">
                Plataformas Tradicionais vs Thinka
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
                Enquanto sistemas convencionais são lentos, cheios de menus complexos e parecem
                feitas para auditorias contábeis dos anos 90, a Thinka oferece uma interface
                descontraída, veloz e agradável de usar todos os dias.
              </p>
            </div>

            <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-7">
              <h4 className="font-display text-base font-semibold text-[#F0EDE6]">
                Chats de IA Genéricos vs Copiloto Pedagógico Thinka
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
                Chats convencionais dão a resposta mastigada, criando a ilusão de aprendizado que
                desaparece na hora da prova. O copiloto da Thinka diagnostica seus pontos cegos e
                provoca você a construir a solução com autonomia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. PERGUNTAS FREQUENTES (FAQ EDUCACIONAL EM ACCORDION)         */}
      {/* ============================================================ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center max-w-xl mx-auto">
          <span className="font-mono text-xs uppercase text-[#C8B560]">
            Tire Suas Dúvidas
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6]">
            Perguntas Frequentes
          </h2>
          <p className="mt-2 text-xs text-[#5C5C5C]">
            Tudo o que você precisa saber para começar a usar a Thinka.
          </p>
        </div>

        <div className="mt-12 divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
          {/* FAQ 1 */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => toggleFaq(0)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#F0EDE6] transition hover:text-[#C8B560]"
            >
              <span>O que é a Thinka e para quem ela foi criada?</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  faqOpen === 0 ? "rotate-180 text-[#C8B560]" : "text-[#5C5C5C]"
                }`}
              />
            </button>
            {faqOpen === 0 && (
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                A Thinka é uma plataforma educacional moderna que conecta estudantes e professores.
                Ela oferece organização de cadernos por matéria, radar de datas de provas,
                acompanhamento pedagógico, gestão de turmas com código e um copiloto de estudos que
                estimula o raciocínio crítico.
              </p>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => toggleFaq(1)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#F0EDE6] transition hover:text-[#C8B560]"
            >
              <span>Como os professores utilizam a plataforma com suas turmas?</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  faqOpen === 1 ? "rotate-180 text-[#C8B560]" : "text-[#5C5C5C]"
                }`}
              />
            </button>
            {faqOpen === 1 && (
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                O docente cria uma turma com nome, limite de vagas e horário. O sistema gera um
                código exclusivo que os alunos usam para solicitar entrada. O professor aprova os
                alunos em um clique e tem um mural oficial para avisos e cronogramas.
              </p>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => toggleFaq(2)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#F0EDE6] transition hover:text-[#C8B560]"
            >
              <span>Como funciona o Copiloto Pedagógico de estudos?</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  faqOpen === 2 ? "rotate-180 text-[#C8B560]" : "text-[#5C5C5C]"
                }`}
              />
            </button>
            {faqOpen === 2 && (
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Diferente de assistentes genéricos que entregam respostas prontas, o copiloto da
                Thinka analisa as anotações do próprio estudante, identifica pontos fortes e
                lacunas de compreensão, gerando perguntas desafiadoras para que ele fixe o
                conteúdo com autonomia.
              </p>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => toggleFaq(3)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#F0EDE6] transition hover:text-[#C8B560]"
            >
              <span>É gratuito para começar?</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  faqOpen === 3 ? "rotate-180 text-[#C8B560]" : "text-[#5C5C5C]"
                }`}
              />
            </button>
            {faqOpen === 3 && (
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Sim! Qualquer estudante ou professor pode se cadastrar gratuitamente, criar seu
                perfil, organizar suas anotações e participar de turmas sem custos.
              </p>
            )}
          </div>

          {/* FAQ 5 */}
          <div className="py-6">
            <button
              type="button"
              onClick={() => toggleFaq(4)}
              className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#F0EDE6] transition hover:text-[#C8B560]"
            >
              <span>Como funciona a segurança e a privacidade dos meus dados?</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  faqOpen === 4 ? "rotate-180 text-[#C8B560]" : "text-[#5C5C5C]"
                }`}
              />
            </button>
            {faqOpen === 4 && (
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Seus dados são protegidos por criptografia de ponta e políticas estritas de Row
                Level Security (RLS) no PostgreSQL. Você controla exatamente quem pode ver suas
                anotações e tem acesso a ferramentas de exportação e exclusão total de dados
                conforme a LGPD.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. CHAMADA FINAL PARA CADASTRO (CTA DE ALTA CONVERSÃO)       */}
      {/* ============================================================ */}
      <section className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-10 sm:p-14">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Comece Hoje Mesmo
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Pronto para transformar sua rotina de estudos?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5C5C5C]">
              Junte-se a estudantes e professores que escolheram uma forma mais organizada,
              inteligente e humana de aprender e ensinar.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/cadastro"
                className="flex items-center gap-2 rounded-xl bg-[#C8B560] px-6 py-3.5 text-xs font-semibold text-[#0A0A0A] shadow-lg transition hover:bg-[#F0EDE6]"
              >
                <span>Criar minha conta gratuita</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-6 py-3.5 text-xs font-semibold text-[#F0EDE6] transition hover:border-[#5C5C5C]"
              >
                <LogIn className="h-3.5 w-3.5 text-[#C8B560]" />
                <span>Já tenho uma conta</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 11. RODAPÉ INSTITUCIONAL COMPLETO                             */}
      {/* ============================================================ */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-14 text-xs text-[#5C5C5C]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            {/* Logo e créditos */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2A2A2A] font-display text-xs font-bold text-[#C8B560]">
                  T
                </span>
                <span className="font-logo text-xl font-bold text-[#F0EDE6]">thinka</span>
                <span className="text-[10px] text-[#5C5C5C]">• Plataforma Educacional</span>
              </div>
              <p className="mt-2 text-[11px] text-[#5C5C5C]">
                Conectando estudantes e professores em um ambiente focado no aprendizado real.
              </p>
              <p className="mt-1 font-mono text-[10px] text-[#5C5C5C]/60">
                Centro Universitário Max Planck (UniMAX) • Bacharelado em Ciência da Computação
              </p>
            </div>

            {/* Links rápidos */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
              <a href="#recursos" className="transition hover:text-[#C8B560]">
                Recursos
              </a>
              <a href="#demonstracao" className="transition hover:text-[#C8B560]">
                Como Funciona
              </a>
              <Link href="/dashboard" className="transition hover:text-[#C8B560]">
                Meu Painel
              </Link>
              <Link href="/login" className="transition hover:text-[#C8B560]">
                Entrar
              </Link>
              <Link href="/cadastro" className="transition hover:text-[#C8B560]">
                Cadastre-se
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-[#2A2A2A]/50 pt-6 text-center text-[11px] text-[#5C5C5C] sm:flex sm:justify-between sm:text-left">
            <span>© 2026 Thinka. Todos os direitos reservados.</span>
            <span className="mt-2 block sm:mt-0">
              Privacidade garantida conforme a Lei Geral de Proteção de Dados (LGPD).
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
