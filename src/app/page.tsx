"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Eye,
  FileText,
  GraduationCap,
  Layers,
  Lock,
  LogIn,
  Presentation,
  Radio,
  ScanSearch,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export default function LandingPage() {
  const [activePreviewTab, setActivePreviewTab] = useState<
    "caderno" | "raiox" | "teste60s" | "arena" | "turmas"
  >("caderno");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    full_name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/state", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.currentUser && window.sessionStorage.getItem("veritas_logged_out") !== "1") {
          setCurrentUser({
            full_name: data.currentUser.full_name,
            role: data.currentUser.role,
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleFaq = (idx: number) => {
    setFaqOpen((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] antialiased selection:bg-[#C8B560]/25 selection:text-[#F0EDE6]">
      {/* Brilhos sutis de ambientacao */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-48 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[#C8B560]/[0.07] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[45%] -left-32 h-[350px] w-[500px] rounded-full bg-[#2A2A2A]/40 blur-[120px]"
      />

      {/* ============================================================ */}
      {/* 1. HEADER INSTITUCIONAL (NAVBAR PUBLICA)                     */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#2A2A2A]/60 bg-[#0A0A0A]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          {/* Logo Thinka com charme de tipografia conectada */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-sm font-bold text-[#C8B560] shadow-sm transition group-hover:scale-105">
              T
            </span>
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold tracking-wide text-[#F0EDE6]">
                Thinka
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#C8B560]">
                Epistemic OS
              </span>
            </div>
          </Link>

          {/* Navegacao Central Objetiva */}
          <nav className="hidden items-center gap-7 text-xs font-medium text-[#F0EDE6]/70 md:flex">
            <a href="#hero" className="transition hover:text-[#C8B560]">
              Início
            </a>
            <a href="#recursos" className="transition hover:text-[#C8B560]">
              Recursos
            </a>
            <a href="#como-funciona" className="transition hover:text-[#C8B560]">
              Como Funciona
            </a>
            <a href="#diferenciais" className="transition hover:text-[#C8B560]">
              Diferenciais
            </a>
            <a href="#faq" className="transition hover:text-[#C8B560]">
              Perguntas Frequentes
            </a>
          </nav>

          {/* Acoes da Direita */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A] shadow-md transition hover:bg-[#F0EDE6] active:scale-95"
              >
                <span>Acessar Painel ({currentUser.full_name.split(" ")[0]})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-3.5 py-2 text-xs font-medium text-[#F0EDE6]/80 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="flex items-center gap-1.5 rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A] shadow-md transition hover:bg-[#F0EDE6] active:scale-95"
                >
                  <span>Começar agora</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION IMPACTANTE                                    */}
      {/* ============================================================ */}
      <section id="hero" className="relative mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
        <div className="text-center">
          {/* Badge institucional do Simposio */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8B560]/30 bg-[#C8B560]/10 px-3.5 py-1 text-[11px] font-medium text-[#C8B560]">
            <Sparkles className="h-3 w-3" />
            <span>Submissão Oficial // IV Simpósio de Inteligência Artificial UniMAX</span>
          </div>

          {/* Titulo Principal */}
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-3xl font-bold tracking-tight text-[#F0EDE6] sm:text-5xl sm:leading-[1.15]">
            O fim da ilusão do <span className="text-[#C8B560]">Ctrl+C</span>:{" "}
            De quem é a resposta quando a IA erra?
          </h1>

          {/* Subtitulo Persuasivo */}
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#F0EDE6]/65 sm:text-base">
            A Thinka transforma o estudo passivo em domínio intelectual autêntico.
            Caderno pessoal com radar de provas, copiloto crítico que aponta lacunas sem
            gerar respostas prontas, laboratório de falhas de IA e prova de autoria em
            60 segundos.
          </p>

          {/* Botoes de Acao */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="flex h-12 items-center gap-2 rounded-full bg-[#C8B560] px-6 text-xs font-semibold text-[#0A0A0A] shadow-lg shadow-[#C8B560]/20 transition hover:bg-[#F0EDE6] active:scale-95"
            >
              <span>Começar gratuitamente</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/apresentacao"
              className="flex h-12 items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#141414] px-6 text-xs font-semibold text-[#F0EDE6] transition hover:border-[#5C5C5C] hover:bg-[#1E1E1E]"
            >
              <Presentation className="h-4 w-4 text-[#C8B560]" />
              <span>Ver Deck de Apresentação (15 min)</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex h-12 items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#141414] px-5 text-xs font-semibold text-[#F0EDE6]/80 transition hover:border-[#C8B560] hover:text-[#C8B560]"
            >
              <LogIn className="h-4 w-4" />
              <span>Acessar o Painel</span>
            </Link>
          </div>

          {/* Badges de Credibilidade */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#F0EDE6]/50">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              Conformidade Estrita com a LGPD
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              Banco Supabase PostgreSQL Conectado
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#C8B560]" />
              Sem Detectores Estatísticos de Plágio Falhos
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PREVIEW INTERATIVO DA PLATAFORMA (MOCKUP EM ALTA FIDELIDADE) */}
        {/* ============================================================ */}
        <div className="mt-14 rounded-3xl border border-[#2A2A2A] bg-[#141414]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
          {/* Seletor de Abas Demonstrativas */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#2A2A2A] pb-4">
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-wider text-[#C8B560]">
              Prévia do Sistema:
            </span>

            {[
              { id: "caderno" as const, label: "Caderno & Provas", icon: BookOpen },
              { id: "raiox" as const, label: "Raio-X de Falhas", icon: ScanSearch },
              { id: "teste60s" as const, label: "Teste de 60s", icon: ShieldCheck },
              { id: "arena" as const, label: "Arena ao Vivo", icon: Radio },
              { id: "turmas" as const, label: "Gestão de Turmas", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activePreviewTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePreviewTab(tab.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? "bg-[#C8B560] text-[#0A0A0A] font-semibold"
                      : "bg-[#1E1E1E] text-[#F0EDE6]/65 hover:text-[#F0EDE6]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Conteudo Dinamico da Previa */}
          <div className="pt-6">
            {activePreviewTab === "caderno" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-[#F0EDE6]">
                      Banco de Dados Distribuídos
                    </span>
                    <span className="rounded-full bg-[#C8B560]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#C8B560]">
                      Prova em 3 dias
                    </span>
                  </div>
                  <h4 className="mt-3 text-xs font-semibold text-[#F0EDE6]">
                    Anotação: Travas e Saques Concorrentes (Two-Phase Locking)
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#F0EDE6]/60 font-mono text-[11px]">
                    &quot;Quando dois usuários sacam ao mesmo tempo sem isolamento Serializable,
                    ocorre anomalia de leitura suja e ambos aprovam o débito.&quot;
                  </p>
                </div>
                <div className="rounded-2xl border border-[#C8B560]/30 bg-[#C8B560]/[0.04] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8B560]">
                    <Sparkles className="h-4 w-4" />
                    <span>Copiloto Crítico Thinka (Sem dar cola)</span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="font-medium text-[#F0EDE6]">Ponto Forte:</span>{" "}
                      <span className="text-[#F0EDE6]/60">
                        Compreensão clara do risco de concorrência financeira.
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-[#F0EDE6]">Ponto Cego Identificado:</span>{" "}
                      <span className="text-[#F0EDE6]/60">
                        Não especificou se a trava ocorre em nível de registro ou de tabela.
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-2.5 text-[11px] text-[#C8B560]">
                      Pergunta de Teste: O que acontece se o banco abortar uma transação por Deadlock?
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === "raiox" && (
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-[#C8B560]">CASO FORENSE: COMPUTACAO</span>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">Saque Duplicado Gerado por IA</h4>
                  </div>
                  <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">
                    Colapso sob estresse: 12 req/s
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#F0EDE6]/70">
                  A IA gerou uma rotina que passa em testes unitários simples, mas colapsa em concorrência real.
                  O aluno identifica a linha exata da falha e aplica a trava atômica.
                </p>
              </div>
            )}

            {activePreviewTab === "teste60s" && (
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-[#C8B560]" />
                    <span className="text-sm font-semibold text-[#F0EDE6]">
                      Mutação Adversarial em 60 Segundos
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#C8B560]">00:19s</span>
                </div>
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-[#F0EDE6]">
                  Linha Sabotada: <code className="font-mono text-red-400">if (saldo &gt; valor)</code> alterado
                  para <code className="font-mono text-red-400">if (saldo &lt; valor)</code>.
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#F0EDE6]/50">
                  <span>Selo SHA-256 Gravado: veritas-52319400-8a91c4</span>
                  <span className="text-[#C8B560]">Autoria Confirmada</span>
                </div>
              </div>
            )}

            {activePreviewTab === "arena" && (
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">Arena da Sala ao Vivo</h4>
                    <p className="text-xs text-[#F0EDE6]/50">Mapeamento semântico 2D via celular</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#F0EDE6]/50">Originalidade Coletiva</span>
                    <div className="text-base font-bold text-[#C8B560]">93.0%</div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-[#F0EDE6]/70">
                  O algoritmo detectou que 4 respostas tinham a mesma estrutura sintática do ChatGPT e
                  disparou uma mudança de cenário na tela para invalidar respostas automáticas.
                </p>
              </div>
            )}

            {activePreviewTab === "turmas" && (
              <div className="rounded-2xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#F0EDE6]">Turma: Inteligência Artificial 2026</h4>
                    <p className="text-xs text-[#F0EDE6]/50">Código: CC-IA-2026 • Docente: Profa. Helena</p>
                  </div>
                  <span className="rounded-full bg-[#C8B560]/10 px-2.5 py-0.5 text-xs text-[#C8B560]">
                    28 Alunos Ativos
                  </span>
                </div>
                <p className="mt-3 text-xs text-[#F0EDE6]/70">
                  Ingresso seguro por código de convite com aprovação docente em 1 clique e mural de comunicados.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. METRICAS EMPIRICAS (ESTUDO DE 16 SEMANAS COM 48 ALUNOS)   */}
      {/* ============================================================ */}
      <section className="border-y border-[#2A2A2A] bg-[#111111]/70 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
            <div>
              <div className="font-display text-3xl font-bold text-[#C8B560]">48</div>
              <div className="mt-1 text-xs text-[#F0EDE6]/50">Estudantes no Estudo Piloto</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-[#C8B560]">+43,0 pts</div>
              <div className="mt-1 text-xs text-[#F0EDE6]/50">Salto em Autonomia Prática</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-[#C8B560]">93,0%</div>
              <div className="mt-1 text-xs text-[#F0EDE6]/50">Índice de Originalidade da Sala</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-[#C8B560]">19s</div>
              <div className="mt-1 text-xs text-[#F0EDE6]/50">Média de Resolução do Teste 60s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. MODULOS E RECURSOS PRINCIPAIS                             */}
      {/* ============================================================ */}
      <section id="recursos" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8B560]">
            Arquitetura Integrada
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-[#F0EDE6] sm:text-4xl">
            Tudo o que o aluno e o professor precisam para liderar com IA
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-[#F0EDE6]/60 sm:text-sm">
            Cinco motores interligados que substituem a adivinhação estatística por evidências
            claras de domínio técnico.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recurso 1 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Caderno de Estudos & Radar de Provas
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Anotações pessoais com contagem regressiva por matéria (&quot;Prova em 3 dias&quot;)
              e Copiloto Crítico que aponta lacunas e faz perguntas desafiadoras sem gerar respostas prontas.
            </p>
          </div>

          {/* Recurso 2 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <ScanSearch className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Raio-X de Falhas da IA (Computação, Saúde, Negócios)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Coloque a própria IA sob exame forense. O estudante analisa casos reais onde a máquina falha
              gravemente sob pressão, identifica a linha do erro e aplica a regra de segurança humana.
            </p>
          </div>

          {/* Recurso 3 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Teste de Autoria em 60s por Mutação
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Injetamos silenciosamente 1 sabotagem cirúrgica no trabalho ou código entregue.
              Quem realmente domina o que fez encontra a alteração em segundos e recebe um selo criptográfico SHA-256.
            </p>
          </div>

          {/* Recurso 4 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <Radio className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Arena da Sala ao Vivo & Deteccao de Rebanho
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Durante as aulas, alunos enviam respostas pelo celular. O sistema calcula a originalidade coletiva,
              alerta sobre respostas clonadas pela mesma IA e coloca visões opostas para debate mediado pelo professor.
            </p>
          </div>

          {/* Recurso 5 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Gestão de Turmas com Código Exclusivo
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Professores criam turmas, geram códigos de convite, aprovam inscrições e publicam comunicados
              e avisos com autonomia pedagógica total.
            </p>
          </div>

          {/* Recurso 6 */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6 transition hover:border-[#C8B560]/40">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#C8B560]/10 text-[#C8B560]">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
              Governança RBAC, Sessões & LGPD
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#F0EDE6]/60">
              Perfis isolados para Aluno, Professor e Administrador. Sessões com encerramento remoto,
              controle de privacidade e exportação completa em JSON dos dados pessoais.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. COMO FUNCIONA (ETAPAS SIMPLES)                            */}
      {/* ============================================================ */}
      <section id="como-funciona" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C8B560]">
              Fluxo Transparente
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F0EDE6] sm:text-4xl">
              Como a Thinka funciona na prática
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6">
              <span className="font-mono text-3xl font-bold text-[#C8B560]/40">01</span>
              <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
                Cadastre-se e entre na sua Turma
              </h3>
              <p className="mt-2 text-xs text-[#F0EDE6]/60">
                Alunos ingressam com o código exclusivo do docente e organizam suas disciplinas e datas de provas.
              </p>
            </div>

            <div className="relative rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6">
              <span className="font-mono text-3xl font-bold text-[#C8B560]/40">02</span>
              <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
                Estude com o Copiloto Crítico
              </h3>
              <p className="mt-2 text-xs text-[#F0EDE6]/60">
                Escreva suas anotações e audite a IA no laboratório forense. O copiloto aponta lacunas sem fazer o trabalho por você.
              </p>
            </div>

            <div className="relative rounded-3xl border border-[#2A2A2A] bg-[#141414] p-6">
              <span className="font-mono text-3xl font-bold text-[#C8B560]/40">03</span>
              <h3 className="mt-4 text-sm font-semibold text-[#F0EDE6]">
                Prove Autoria em 60s
              </h3>
              <p className="mt-2 text-xs text-[#F0EDE6]/60">
                Encontre a sabotagem no seu próprio material, emita o selo SHA-256 e participe dos debates da Arena da sala.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ALUNOS VS PROFESSORES (BENEFICIOS)                        */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Para Alunos */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-[#C8B560]" />
              <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                Para Estudantes
              </h3>
            </div>
            <ul className="mt-6 space-y-3.5 text-xs text-[#F0EDE6]/70">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Chega de falsos positivos: prove que domina seu trabalho com selo criptográfico inquestionável.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Radar de datas de avaliação com contagem regressiva para nunca ser pego de surpresa.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Aprenda a encontrar alucinações de modelos e torne-se um profissional que audita sistemas inteligentes.</span>
              </li>
            </ul>
          </div>

          {/* Para Professores */}
          <div className="rounded-3xl border border-[#2A2A2A] bg-[#141414] p-8">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-[#C8B560]" />
              <h3 className="font-display text-lg font-semibold text-[#F0EDE6]">
                Para Docentes e Coordenadores
              </h3>
            </div>
            <ul className="mt-6 space-y-3.5 text-xs text-[#F0EDE6]/70">
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Substitua a caça às bruxas inútil por avaliações autênticas de mutação em 60 segundos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Arena da sala ao vivo com detecção imediata de respostas clonadas e índice de originalidade da turma.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-[#C8B560]" />
                <span>Gestão completa de turmas, aprovação de matrículas e conformidade absoluta com a LGPD.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. DIFERENCIAIS COMPETITIVOS                                 */}
      {/* ============================================================ */}
      <section id="diferenciais" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C8B560]">
              Por que a Thinka é Diferente
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-[#F0EDE6] sm:text-3xl">
              Comparativo de Abordagens Educacionais
            </h2>
          </div>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left text-xs text-[#F0EDE6]/80">
              <thead>
                <tr className="border-b border-[#2A2A2A] text-[#C8B560]">
                  <th className="py-3 px-4 font-semibold">Critério</th>
                  <th className="py-3 px-4 font-semibold">Chats Tradicionais</th>
                  <th className="py-3 px-4 font-semibold">Detectores de Plágio</th>
                  <th className="py-3 px-4 font-semibold bg-[#C8B560]/10 rounded-t-xl text-[#F0EDE6]">
                    Thinka // VERITAS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                <tr>
                  <td className="py-3.5 px-4 font-medium text-[#F0EDE6]">Papel do Estudante</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Consumidor passivo de texto</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Suspeito sob acusação</td>
                  <td className="py-3.5 px-4 bg-[#C8B560]/5 font-medium text-[#C8B560]">
                    Auditor crítico da tecnologia
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-[#F0EDE6]">Precisão da Avaliação</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Zero validação</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Muitos falsos positivos</td>
                  <td className="py-3.5 px-4 bg-[#C8B560]/5 font-medium text-[#C8B560]">
                    Prova real em 60s por mutação
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-[#F0EDE6]">Integração em Sala</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Gera cola isolada</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Apenas pós-entrega</td>
                  <td className="py-3.5 px-4 bg-[#C8B560]/5 font-medium text-[#C8B560]">
                    Arena coletiva ao vivo via QR Code
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-medium text-[#F0EDE6]">Certificação</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Nenhuma</td>
                  <td className="py-3.5 px-4 text-[#F0EDE6]/50">Score arbitrário (%)</td>
                  <td className="py-3.5 px-4 bg-[#C8B560]/5 font-medium text-[#C8B560]">
                    Selo SHA-256 no Supabase
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FAQ (PERGUNTAS FREQUENTES) COM ACORDEOM                   */}
      {/* ============================================================ */}
      <section id="faq" className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8B560]">
            Dúvidas Frequentes
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-[#F0EDE6] sm:text-3xl">
            Perguntas & Respostas sobre a Thinka
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {[
            {
              q: "A Thinka proíbe o uso de ferramentas de IA durante os estudos?",
              a: "Não. Acreditamos que proibições são inúteis. A Thinka ensina o estudante a usar modelos generativos com responsabilidade, colocando a própria IA à prova no laboratório forense e verificando o domínio real através de mutações de 60 segundos.",
            },
            {
              q: "Como o professor sabe se o trabalho foi feito pelo próprio aluno?",
              a: "Em vez de usar detectores probabilísticos falhos, a Thinka altera cirurgicamente uma linha do trabalho entregue. Quem construiu o raciocínio localiza a sabotagem em até 60 segundos e emite um selo criptográfico único de autoria.",
            },
            {
              q: "Como funciona a Arena ao Vivo durante a aula?",
              a: "O professor projeta o QR Code na sala. Pelo celular, os alunos enviam suas ideias em tempo real. O algoritmo agrupa conceitos num mapa 2D, mede a originalidade da turma e detecta se muitos alunos usaram o mesmo prompt pronto.",
            },
            {
              q: "A plataforma está em conformidade com a LGPD?",
              a: "Totalmente. O sistema conta com controle de privacidade de perfil, exclusão de conta e um módulo nativo de exportação de dados pessoais em JSON (schema VERITAS-LGPD-EXPORT-V1), com senhas criptografadas via scrypt.",
            },
            {
              q: "Qual é a relação da Thinka com o IV Simpósio de IA da UniMAX?",
              a: "A plataforma foi concebida e submetida como projeto de autoria do aluno Matheus Sousa dos Santos (RA: 52319400) pelo curso de Ciência da Computação para responder ao tema oficial: 'De Quem é a Resposta?'.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#2A2A2A] bg-[#141414] transition hover:border-[#5C5C5C]"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="flex w-full items-center justify-between p-5 text-left text-xs font-semibold text-[#F0EDE6]"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#C8B560] transition-transform duration-200 ${
                    faqOpen === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {faqOpen === idx && (
                <div className="border-t border-[#2A2A2A] px-5 pb-5 pt-3 text-xs leading-relaxed text-[#F0EDE6]/65">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 9. CTA FINAL CONVERSIVO                                      */}
      {/* ============================================================ */}
      <section className="border-t border-[#2A2A2A] bg-gradient-to-b from-[#141414] to-[#0A0A0A] py-20 text-center">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="font-display text-2xl font-bold text-[#F0EDE6] sm:text-4xl">
            Pronto para transformar a experiência de estudo e ensino?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs text-[#F0EDE6]/60 sm:text-sm">
            Crie sua conta em poucos cliques, junte-se à sua turma e experimente a nova era
            da autoria intelectual com inteligência artificial.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cadastro"
              className="flex h-12 items-center gap-2 rounded-full bg-[#C8B560] px-7 text-xs font-semibold text-[#0A0A0A] shadow-lg shadow-[#C8B560]/20 transition hover:bg-[#F0EDE6] active:scale-95"
            >
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="flex h-12 items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-6 text-xs font-semibold text-[#F0EDE6] transition hover:border-[#5C5C5C]"
            >
              <LogIn className="h-4 w-4" />
              <span>Já Tenho Cadastro</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 10. RODAPE INSTITUCIONAL COMPLETO                            */}
      {/* ============================================================ */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-12 text-xs text-[#F0EDE6]/50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2A2A2A] font-display text-xs font-bold text-[#C8B560]">
                T
              </span>
              <div>
                <span className="font-display text-sm font-semibold text-[#F0EDE6]">
                  Thinka // VERITAS
                </span>
                <p className="text-[11px] text-[#F0EDE6]/40">
                  IV Simpósio de IA UniMAX • Ciência da Computação
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[11px]">
              <Link href="/apresentacao" className="transition hover:text-[#C8B560]">
                Apresentação 15 min
              </Link>
              <a
                href="/api/simposio/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#C8B560]"
              >
                Artigo Oficial (.PDF)
              </a>
              <Link href="/login" className="transition hover:text-[#C8B560]">
                Acesso ao Sistema
              </Link>
              <Link href="/cadastro" className="transition hover:text-[#C8B560]">
                Cadastro
              </Link>
            </div>
          </div>

          <div className="mt-8 border-t border-[#2A2A2A]/50 pt-6 text-center text-[11px] text-[#F0EDE6]/35 sm:text-left sm:flex sm:justify-between">
            <span>
              Autor: Matheus Sousa dos Santos (RA: 52319400) — matheus.santos@unimax.edu.br
            </span>
            <span className="mt-2 block sm:mt-0">
              Centro Universitário Max Planck (UniMAX) • Indaiatuba / SP
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
