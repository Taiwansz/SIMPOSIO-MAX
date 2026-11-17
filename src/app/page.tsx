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
  Copy,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageSquare,
  School,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
} from "lucide-react";

/* ==================================================================== */
/* COMPONENTES DE RABISCOS E DETALHES MANUSCRITOS (ESTÉTICA THINKA)     */
/* ==================================================================== */

function ScribbleUnderline({ className = "w-full h-3" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 9.5C45 2.5 90 10.5 130 5.5C158 2 182 8 198 4.5"
        stroke="#C8B560"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScribbleArrow({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 54 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 38C18 39 34 35 43 23C47 18 49 11 48 5"
        stroke="#C8B560"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M38 11C41 7 47 4 48 5C48 8 46 16 44 20"
        stroke="#C8B560"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ScribbleCircle({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30 6C16 6 8 18 8 32C8 46 20 54 34 54C48 54 54 42 54 28C54 14 42 6 26 8"
        stroke="#C8B560"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="160"
        opacity="0.8"
      />
    </svg>
  );
}

export default function LandingPage() {
  const [currentUser, setCurrentUser] = useState<{
    full_name: string;
    role: string;
  } | null>(null);

  const [activeMockupTab, setActiveMockupTab] = useState<
    "caderno" | "turmas" | "copiloto" | "progresso"
  >("caderno");

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("THK-COMP-4B");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] antialiased selection:bg-[#C8B560]/20 selection:text-[#F0EDE6]">
      {/* ============================================================ */}
      {/* 1. TOPBAR INSTITUCIONAL                                      */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo Thinka Manuscrito */}
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
              Demonstração
            </a>
            <a href="#alunos" className="transition hover:text-[#C8B560]">
              Para Alunos
            </a>
            <a href="#professores" className="transition hover:text-[#C8B560]">
              Para Professores
            </a>
            <a href="#como-funciona" className="transition hover:text-[#C8B560]">
              Como Funciona
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
                Para Estudantes
              </a>
              <a
                href="#professores"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Para Docentes
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-[#F0EDE6]/80 hover:text-[#C8B560]"
              >
                Como Funciona
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
      {/* 2. PRIMEIRA DOBRA (HERO SECTION) REFINADA & IMPACTANTE        */}
      {/* ============================================================ */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow com detalhe manuscrito */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#141414] px-4 py-1.5 text-xs text-[#C8B560] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#C8B560]" />
            <span className="font-medium">Plataforma Educacional Inteligente</span>
            <span className="text-[#5C5C5C]">•</span>
            <span className="font-logo text-sm font-bold text-[#F0EDE6]">
              para quem estuda e ensina
            </span>
          </div>

          {/* Título Principal com Rabisco Manuscrito */}
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-[#F0EDE6] sm:text-6xl sm:leading-[1.12]">
            Onde o estudo ganha{" "}
            <span className="relative inline-block">
              <span className="text-[#C8B560]">clareza</span>
              <ScribbleUnderline className="absolute -bottom-2 left-0 w-full text-[#C8B560]" />
            </span>{" "}
            e ensinar volta a ser inspirador.
          </h1>

          {/* Subtítulo Equilibrado */}
          <p className="mt-7 text-base leading-relaxed text-[#F0EDE6]/70 sm:text-lg sm:leading-relaxed">
            A Thinka reúne a rotina acadêmica em um espaço leve e organizado: cadernos por
            disciplina, radar de provas com contagem regressiva, gestão de turmas com código de
            convite e orientação de estudos que estimula o raciocínio com autonomia.
          </p>

          {/* Ações Primárias e Anotação Manuscrita */}
          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
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

            {/* Setinha manuscrita de incentivo */}
            <div className="hidden lg:flex absolute -right-28 top-1 items-center gap-2 text-left">
              <ScribbleArrow className="h-8 w-8 text-[#C8B560] rotate-12" />
              <span className="font-logo text-sm font-bold text-[#C8B560] leading-tight">
                crie em 1 min<br />sem taxas
              </span>
            </div>
          </div>

          {/* Selos de Benefício Rápido */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5C5C5C]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Ambiente para alunos e turmas</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Radar de provas integrado</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Funciona no celular e computador</span>
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. MOCKUP DO PRODUTO REFINADO (COMPONENTES MAIORES E LIMPOS)  */}
        {/* ============================================================ */}
        <div
          id="demonstracao"
          className="mt-14 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-1.5 shadow-2xl"
        >
          {/* Header de Aplicativo macOS com Abas Grandes e Limpas */}
          <div className="flex flex-col justify-between gap-3 border-b border-[#2A2A2A] bg-[#0E0E0E] px-5 py-4 sm:flex-row sm:items-center rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
                <span className="h-3 w-3 rounded-full bg-[#2A2A2A]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-logo text-base font-bold text-[#F0EDE6]">thinka</span>
                <span className="rounded bg-[#2A2A2A] px-2 py-0.5 text-[10px] font-mono uppercase text-[#C8B560]">
                  app web
                </span>
              </div>
            </div>

            {/* 4 Abas Principais em Tamanho Confortável */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveMockupTab("caderno")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                  activeMockupTab === "caderno"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A] shadow-sm"
                    : "bg-[#1A1A1A] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Caderno &amp; Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMockupTab("turmas")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                  activeMockupTab === "turmas"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A] shadow-sm"
                    : "bg-[#1A1A1A] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>Gestão de Turmas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMockupTab("copiloto")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                  activeMockupTab === "copiloto"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A] shadow-sm"
                    : "bg-[#1A1A1A] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Copiloto de Dúvidas</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMockupTab("progresso")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition ${
                  activeMockupTab === "progresso"
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A] shadow-sm"
                    : "bg-[#1A1A1A] text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Meu Progresso</span>
              </button>
            </div>
          </div>

          {/* Palco do Mockup com Componentes Maiores e Alta Legibilidade */}
          <div className="p-6 sm:p-10 bg-[#0A0A0A] rounded-b-xl min-h-[440px] flex flex-col justify-center">
            {/* ABA 1: CADERNO & RADAR */}
            {activeMockupTab === "caderno" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Disciplina Selecionada
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F0EDE6]">
                      Cálculo Diferencial e Integral I
                    </h3>
                  </div>

                  {/* Badge Grande de Contagem Regressiva */}
                  <div className="flex items-center gap-3 rounded-2xl border border-[#C8B560]/30 bg-[#C8B560]/10 px-5 py-2.5">
                    <Clock className="h-5 w-5 text-[#C8B560]" />
                    <div>
                      <span className="font-mono text-xs font-bold text-[#C8B560]">
                        PROVA P1 EM 4 DIAS
                      </span>
                      <p className="text-[11px] text-[#F0EDE6]/60">85% do conteúdo revisado</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  {/* Bloco Central: Anotação Ampla */}
                  <div className="lg:col-span-2 rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
                    <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                      <span className="font-display text-base font-semibold text-[#F0EDE6]">
                        Regra da Cadeia &amp; Derivadas Compostas
                      </span>
                      <span className="rounded-full bg-[#2A2A2A] px-3 py-1 font-mono text-[11px] text-[#C8B560]">
                        Aula 14
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-[#F0EDE6]/80">
                      A derivada da função composta f(g(x)) é calculada multiplicando a derivada da
                      função externa pela derivada da função interna: f&apos;(g(x)) · g&apos;(x).
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-1.5 text-xs text-[#F0EDE6]">
                        Exemplo Prático: y = sin(x² + 4) → y&apos; = 2x · cos(x² + 4)
                      </span>
                      <span className="font-logo text-base text-[#C8B560]">
                        revisado no caderno!
                      </span>
                    </div>
                  </div>

                  {/* Bloco Lateral: Ação do Copiloto */}
                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 flex flex-col justify-between">
                    <div>
                      <span className="font-mono text-xs uppercase text-[#C8B560]">
                        Radar de Preparação
                      </span>
                      <h4 className="mt-1 font-display text-base font-semibold text-[#F0EDE6]">
                        Prontidão para o Exame
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
                        O copiloto identificou que sua base de limites está sólida, restando apenas
                        reforçar derivadas exponenciais.
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                      <button
                        type="button"
                        onClick={() => setActiveMockupTab("copiloto")}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#C8B560] py-2.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
                      >
                        <Compass className="h-4 w-4" />
                        <span>Abrir Simulado do Copiloto</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 2: TURMAS & DOCENTES */}
            {activeMockupTab === "turmas" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Espaço da Disciplina
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F0EDE6]">
                      Ciência da Computação 2026 • Noturno
                    </h3>
                  </div>

                  {/* Código da Turma em Destaque */}
                  <div className="flex items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#141414] px-4 py-2">
                    <div className="text-right">
                      <span className="text-[10px] text-[#5C5C5C] uppercase block">
                        Código de Convite
                      </span>
                      <span className="font-mono text-sm font-bold text-[#C8B560]">
                        THK-COMP-4B
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="rounded-lg bg-[#2A2A2A] p-2 text-[#F0EDE6] hover:text-[#C8B560] transition"
                      title="Copiar código da turma"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copiedCode && (
                      <span className="font-logo text-xs text-[#10B981]">Copiado!</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Alunos Matriculados
                    </span>
                    <div className="mt-2 font-display text-3xl font-bold text-[#F0EDE6]">
                      38 Alunos
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-[#10B981]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Todas as solicitações aprovadas</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Mural Oficial
                    </span>
                    <div className="mt-2 font-display text-base font-semibold text-[#F0EDE6]">
                      Trabalho de Estruturas
                    </div>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      Prazo final: 24 de Novembro às 23h59
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Horário &amp; Sala
                    </span>
                    <div className="mt-2 font-display text-base font-semibold text-[#F0EDE6]">
                      Terças &amp; Quintas
                    </div>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      19h10 às 22h40 • Laboratório 04
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 3: COPILOTO DE DÚVIDAS */}
            {activeMockupTab === "copiloto" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Orientação Pedagógica Ativa
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F0EDE6]">
                      Desafio Socrático Pré-Prova
                    </h3>
                  </div>
                  <span className="rounded-full bg-[#10B981]/15 px-3 py-1 font-mono text-xs font-semibold text-[#10B981]">
                    Sem respostas automáticas
                  </span>
                </div>

                <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6 sm:p-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8B560] text-[#0A0A0A] font-bold">
                      <Compass className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-[#C8B560] uppercase">
                        Pergunta Desafiadora do Copiloto
                      </span>
                      <p className="text-base font-medium leading-relaxed text-[#F0EDE6]">
                        &quot;Se você precisa derivar h(x) = ln(x³ + 2), qual é a derivada da função
                        externa e como a regra da cadeia conecta o termo 3x² no numerador?&quot;
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#2A2A2A] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C5C5C]">
                    <span>Objetivo: Provar que você domina o raciocínio antes do exame.</span>
                    <span className="font-logo text-base text-[#C8B560]">
                      estimula o raciocínio real
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ABA 4: MEU PROGRESSO */}
            {activeMockupTab === "progresso" && (
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-5 sm:flex-row sm:items-center">
                  <div>
                    <span className="font-mono text-xs uppercase text-[#C8B560]">
                      Indicadores Acadêmicos
                    </span>
                    <h3 className="mt-1 font-display text-2xl font-bold text-[#F0EDE6]">
                      Ritmo de Aprendizagem do Semestre
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-[#C8B560]">
                    Semana 12 de 16 Concluída
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Horas Dedicadas
                    </span>
                    <div className="mt-2 font-display text-3xl font-bold text-[#F0EDE6]">
                      14.5 Horas
                    </div>
                    <p className="mt-1 text-xs text-[#10B981]">
                      +22% de foco em relação à semana passada
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Metas Cumpridas
                    </span>
                    <div className="mt-2 font-display text-3xl font-bold text-[#C8B560]">
                      8 de 10
                    </div>
                    <p className="mt-1 text-xs text-[#5C5C5C]">
                      2 revisões pendentes para sábado
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-5">
                    <span className="text-xs font-mono text-[#5C5C5C] uppercase">
                      Frequência em Aulas
                    </span>
                    <div className="mt-2 font-display text-3xl font-bold text-[#F0EDE6]">
                      100%
                    </div>
                    <p className="mt-1 text-xs text-[#10B981]">
                      Todas as presenças registradas
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. RECURSOS COM BENTO GRID ASSIMÉTRICO (SEM REPETIÇÃO)        */}
      {/* ============================================================ */}
      <section id="recursos" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Recursos Construídos para Aprender
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Tudo o que você precisa para dominar suas disciplinas.
            </h2>
            <p className="mt-4 text-base text-[#5C5C5C]">
              Adeus anotações dispersas em folhas perdidas e avisos esquecidos em grupos. A
              Thinka organiza o seu universo acadêmico com clareza.
            </p>
          </div>

          {/* Bento Grid Assimétrico */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Bento 1: Card Grande Horizontal (2 Colunas) */}
            <div className="md:col-span-2 rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 transition hover:border-[#5C5C5C] flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1E1E] text-[#C8B560]">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-[#F0EDE6]">
                  Caderno Inteligente por Matéria
                </h3>
                <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-[#5C5C5C]">
                  Centralize anotações, fórmulas e resumos organizados por semestre. Cada disciplina
                  possui seu espaço dedicado, livre de distrações e disponível no celular e no computador.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3 pt-6 border-t border-[#2A2A2A]">
                <span className="rounded-lg bg-[#0A0A0A] px-3 py-1 text-xs text-[#F0EDE6]/80">
                  Anotações Sincronizadas
                </span>
                <span className="rounded-lg bg-[#0A0A0A] px-3 py-1 text-xs text-[#F0EDE6]/80">
                  Etiquetas por Tópico
                </span>
                <span className="font-logo text-sm text-[#C8B560]">
                  seu caderno sempre organizado
                </span>
              </div>
            </div>

            {/* Bento 2: Card Vertical de Destaque (1 Coluna) */}
            <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 transition hover:border-[#5C5C5C] flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1E1E] text-[#C8B560]">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-[#F0EDE6]">
                  Radar de Avaliações
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                  Contagem regressiva automática para datas de provas e entregas de trabalhos.
                  Chega de surpresas no calendário.
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-4 text-center">
                <span className="font-mono text-xs text-[#C8B560] block font-semibold">
                  PROXIMA PROVA
                </span>
                <span className="font-display text-2xl font-bold text-[#F0EDE6]">
                  Em 4 Dias
                </span>
                <span className="text-[11px] text-[#5C5C5C] block mt-0.5">
                  Cálculo Diferencial I
                </span>
              </div>
            </div>

            {/* Bento 3: Gestão de Turmas (1 Coluna) */}
            <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 transition hover:border-[#5C5C5C] flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1E1E] text-[#C8B560]">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-[#F0EDE6]">
                  Turmas com Código
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-[#5C5C5C]">
                  Docentes criam turmas em segundos, distribuem o código para a sala e moderam as
                  entradas com facilidade.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
                <span className="font-mono text-xs text-[#C8B560]">
                  Código Exclusivo • THK-COMP-4B
                </span>
              </div>
            </div>

            {/* Bento 4: Copiloto Socrático (2 Colunas) */}
            <div className="md:col-span-2 rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 transition hover:border-[#5C5C5C] flex flex-col justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1E1E] text-[#C8B560]">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-[#F0EDE6]">
                  Copiloto Pedagógico Socrático
                </h3>
                <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-[#5C5C5C]">
                  Diferente de IAs genéricas que fornecem respostas mastigadas e anulam o aprendizado,
                  o copiloto da Thinka desafia você com perguntas de fixação para que você domine o
                  conteúdo por conta própria.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-[#2A2A2A]">
                <span className="text-xs text-[#10B981]">
                  Foco na autonomia real do estudante
                </span>
                <span className="font-logo text-sm text-[#C8B560]">
                  perguntas que fazem pensar!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. EXPERIÊNCIA DO ALUNO (ESTUDO COM FOCO)                     */}
      {/* ============================================================ */}
      <section id="alunos" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Para Estudantes
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Estude com autonomia, sem o desespero da véspera da prova.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5C5C5C]">
              A Thinka foi desenhada para colocar você no controle da sua rotina: todas as suas
              disciplinas organizadas, prazos visíveis e preparação contínua sem sobrecarga.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Caderno sincronizado no celular e computador
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    Acesse suas anotações durante a aula ou no trajeto para a faculdade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Radar de avaliações que evita surpresas
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    Contagem regressiva de dias para cada prova para você planejar suas revisões.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#F0EDE6]">
                    Descubra suas dúvidas antes do exame
                  </h4>
                  <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                    O copiloto faz perguntas de caso para testar se o conceito foi realmente entendido.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C8B560] px-5 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <span>Criar minha conta de aluno</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="font-logo text-base text-[#C8B560]">
                sem mensalidade!
              </span>
            </div>
          </div>

          {/* Card Ilustrativo do Aluno */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2A2A2A] font-bold text-[#C8B560]">
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
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <span className="text-xs text-[#5C5C5C] uppercase font-mono">
                  Meta semanal de estudo
                </span>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F0EDE6]">12 de 15 horas completadas</span>
                  <span className="font-bold text-[#C8B560]">80%</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-[#2A2A2A]">
                  <div className="h-2 rounded-full bg-[#C8B560]" style={{ width: "80%" }} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <span className="text-xs text-[#5C5C5C] uppercase font-mono">
                  Próxima entrega relevante
                </span>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#F0EDE6]">
                    Redes de Computadores • Prática 03
                  </span>
                  <span className="font-mono text-xs text-[#C8B560]">Amanhã</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXPERIÊNCIA DO PROFESSOR (CONEXÃO DOCENTE)                 */}
      {/* ============================================================ */}
      <section id="professores" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Card Ilustrativo do Professor */}
            <div className="order-2 lg:order-1 rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2A2A2A] font-bold text-[#C8B560]">
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
                <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F0EDE6]">Estruturas de Dados B</span>
                    <span className="text-[#C8B560] font-mono">42 alunos</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5C5C5C]">
                    Mural atualizado com materiais da última aula prática.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#F0EDE6]">Engenharia de Software</span>
                    <span className="text-[#C8B560] font-mono">36 alunos</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5C5C5C]">
                    Cronograma de entregas de sprints alinhado com a turma.
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="font-mono text-xs uppercase text-[#C8B560]">
                Para Docentes &amp; Educadores
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
                Mais conexão pedagógica, menos tempo gasto com burocracia.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#5C5C5C]">
                A Thinka ajuda você a coordenar turmas sem ruído: envie o código de convite para a
                sala, aprove os alunos com um clique e mantenha um mural institucional com avisos e
                cronogramas que seus estudantes realmente acompanham.
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Crie turmas em menos de um minuto
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Defina a disciplina, gere o código exclusivo e compartilhe com a sala.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Mural acadêmico sem conversas paralelas
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Avisos oficiais de datas, provas e materiais fixados em um só canal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2A2A2A] text-[#C8B560]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">
                      Acompanhamento contínuo da sala
                    </h4>
                    <p className="mt-1 text-xs text-[#5C5C5C] leading-relaxed">
                      Identifique matérias que merecem uma aula de revisão antes da prova oficial.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <Link
                  href="/cadastro"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#F0EDE6] px-5 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#C8B560]"
                >
                  <span>Cadastrar como professor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="font-logo text-base text-[#C8B560]">
                  gestão ágil de turmas
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. COMO FUNCIONA (TIMELINE CONECTADA EM 3 PASSOS)             */}
      {/* ============================================================ */}
      <section id="como-funciona" className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <span className="font-mono text-xs uppercase text-[#C8B560]">
            Três Passos Simples
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
            Como a Thinka funciona no seu dia a dia.
          </h2>
          <p className="mt-3 text-sm text-[#5C5C5C]">
            Em menos de dois minutos você já está com o seu espaço acadêmico montado.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Passo 1 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left relative flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 01</span>
              <h3 className="mt-3 font-display text-xl font-bold text-[#F0EDE6]">
                Crie sua conta em 1 minuto
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Escolha seu perfil (Aluno ou Professor), indique suas disciplinas e personalize
                suas metas acadêmicas de estudo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <span className="font-logo text-sm text-[#F0EDE6]/60">
                cadastro simples e rápido
              </span>
            </div>
          </div>

          {/* Passo 2 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left relative flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 02</span>
              <h3 className="mt-3 font-display text-xl font-bold text-[#F0EDE6]">
                Conecte-se à sua turma
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Estudantes digitam o código compartilhado pelo docente; professores criam o
                espaço da disciplina com vagas definidas.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <span className="font-logo text-sm text-[#F0EDE6]/60">
                código único por disciplina
              </span>
            </div>
          </div>

          {/* Passo 3 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8 text-center sm:text-left relative flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#C8B560]">PASSO 03</span>
              <h3 className="mt-3 font-display text-xl font-bold text-[#F0EDE6]">
                Aprenda, ensine e evolua
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Organize anotações de aula, acompanhe o radar de datas de provas, receba desafios do
                copiloto e estude com foco constante.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
              <span className="font-logo text-sm text-[#C8B560]">
                estudo com autonomia!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. DIFERENCIAIS DA THINKA (CONTRASTE DIRETO)                  */}
      {/* ============================================================ */}
      <section id="diferenciais" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Nossa Filosofia
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-4xl">
              Feito para o estudo de verdade, não para atalhos artificiais.
            </h2>
            <p className="mt-4 text-base text-[#5C5C5C]">
              A tecnologia deve amplificar a sua capacidade de pensar, não substituir o seu esforço.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8">
              <span className="font-mono text-xs uppercase text-[#5C5C5C]">
                Plataformas Legadas &amp; Chats Passivos
              </span>
              <h4 className="mt-2 font-display text-lg font-bold text-[#F0EDE6]">
                Sistemas lentos e respostas prontas
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-[#5C5C5C]">
                Sistemas tradicionais são burocráticos e cheios de menus complicados. Ao mesmo
                tempo, chats genéricos entregam respostas mastigadas que criam uma falsa sensação
                de domínio, deixando o aluno sem chão na hora da prova oficial.
              </p>
            </div>

            <div className="rounded-3xl border border-[#C8B560]/40 bg-[#141414] p-8">
              <span className="font-mono text-xs uppercase text-[#C8B560]">
                A Experiência Thinka
              </span>
              <h4 className="mt-2 font-display text-lg font-bold text-[#F0EDE6]">
                Interface limpa e estímulo ao raciocínio
              </h4>
              <p className="mt-3 text-xs leading-relaxed text-[#F0EDE6]/80">
                Uma interface leve, rápida e moderna. Cadernos organizados por matéria, radar de
                avaliações com contagem regressiva e um copiloto que faz perguntas socráticas para
                que você aprenda de verdade e retenha o conhecimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. FAQ EDUCACIONAL EM ACCORDION                              */}
      {/* ============================================================ */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24 sm:py-28">
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
                A Thinka é uma plataforma educacional desenvolvida para estudantes e professores.
                Ela oferece organização de cadernos por matéria, radar de datas de provas,
                acompanhamento pedagógico, gestão de turmas com código exclusivo e um copiloto de
                estudos que estimula o raciocínio crítico.
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
                lacunas conceituais, gerando perguntas desafiadoras para que ele fixe o conteúdo com autonomia.
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
      <section className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-10 sm:p-16 shadow-2xl relative overflow-hidden">
            <span className="font-mono text-xs uppercase text-[#C8B560]">
              Comece Hoje Mesmo
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-5xl">
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
      {/* 11. RODAPÉ INSTITUCIONAL                                      */}
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
                Demonstração
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
