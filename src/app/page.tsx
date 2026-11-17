"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  ExternalLink,
  FileText,
  Lock,
  LogIn,
  Presentation,
  Radio,
  ScanSearch,
  ShieldCheck,
  Terminal,
  UserCheck,
  Users,
} from "lucide-react";

export default function LandingPage() {
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

  return (
    <div className="min-h-[100dvh] bg-[#0A0A0A] text-[#F0EDE6] antialiased selection:bg-[#C8B560]/20 selection:text-[#F0EDE6]">
      {/* ============================================================ */}
      {/* 1. TOPBAR MINIMALISTA                                        */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2A2A2A] font-mono text-xs font-bold text-[#C8B560]">
              T
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-sm font-semibold tracking-tight text-[#F0EDE6]">
                Thinka
              </span>
              <span className="font-mono text-[10px] uppercase text-[#5C5C5C]">
                VERITAS
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 font-mono text-xs text-[#5C5C5C] md:flex">
            <a href="#arquitetura" className="transition hover:text-[#F0EDE6]">
              01_Arquitetura
            </a>
            <a href="#motores" className="transition hover:text-[#F0EDE6]">
              02_Motores
            </a>
            <a href="#telemetria" className="transition hover:text-[#F0EDE6]">
              03_Telemetria
            </a>
            <a href="#edital" className="transition hover:text-[#F0EDE6]">
              04_Edital
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg bg-[#C8B560] px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
              >
                <span>Painel ({currentUser.full_name.split(" ")[0]})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#F0EDE6]/70 transition hover:bg-[#1E1E1E] hover:text-[#F0EDE6]"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="rounded-lg bg-[#F0EDE6] px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#C8B560]"
                >
                  Começar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO SECTION EDITORIAL (SEM SLOP, SEM GRADIENTES VAZIOS)   */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="max-w-3xl">
          {/* Eyebrow estritamente técnico em monospace */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#C8B560]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8B560]" />
            <span>IV Simpósio de IA UniMAX — Eixo: De Quem é a Resposta?</span>
          </div>

          {/* Titulo editorial de alta autoridade */}
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight text-[#F0EDE6] sm:text-6xl sm:leading-[1.08]">
            Auditoria forense de alucinações e prova de autoria em 60 segundos.
          </h1>

          {/* Subtitulo sem adjetivos vazios */}
          <p className="mt-6 text-base leading-relaxed text-[#5C5C5C] sm:text-lg">
            A Thinka substitui a adivinhação estatística de detectores de plágio por verificação
            real de domínio: caderno com radar de provas, simulador de colapso de modelos em
            Computação, Saúde e Negócios, sabotagem adversarial e arena coletiva em sala.
          </p>

          {/* Ações primárias */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-lg bg-[#C8B560] px-5 py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
            >
              <span>Criar Conta no Sistema</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#141414] px-5 py-3 text-xs font-semibold text-[#F0EDE6] transition hover:border-[#5C5C5C]"
            >
              <Terminal className="h-3.5 w-3.5 text-[#C8B560]" />
              <span>Abrir Cockpit do Aluno</span>
            </Link>

            <Link
              href="/apresentacao"
              className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-transparent px-4 py-3 text-xs font-semibold text-[#5C5C5C] transition hover:text-[#F0EDE6]"
            >
              <Presentation className="h-3.5 w-3.5" />
              <span>Apresentação 15 min</span>
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* REPARO VISUAL: O PRODUTO REAL EM TELA (ARTEFATO USINADO)      */}
        {/* ============================================================ */}
        <div className="mt-16 rounded-xl border border-[#2A2A2A] bg-[#141414] p-1">
          {/* Header de janela estilo terminal */}
          <div className="flex items-center justify-between border-b border-[#2A2A2A] px-4 py-3 bg-[#0E0E0E]">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#5C5C5C]">
              <span className="h-2 w-2 rounded-full bg-[#C8B560]" />
              <span>veritas_engine_core.ts — [TELEMETRIA ATIVA: SUPABASE POSTGRESQL]</span>
            </div>
            <span className="font-mono text-[10px] uppercase text-[#C8B560]">
              SHA-256 VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 divide-y divide-[#2A2A2A] lg:grid-cols-3 lg:divide-y-0 lg:divide-x">
            {/* Bloco 1: Raio-X Forense */}
            <div className="p-6">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#5C5C5C]">
                <span>MODULO 01</span>
                <span className="text-[#C8B560]">RAIO-X IA</span>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                Saque Concorrente sem Trava Atômica
              </h3>
              <p className="mt-2 text-xs text-[#5C5C5C] leading-relaxed">
                Código gerado por IA passa em testes com 1 usuário, mas duplica débitos sob
                concorrência simultânea (race condition).
              </p>
              <div className="mt-4 rounded border border-[#2A2A2A] bg-[#0A0A0A] p-3 font-mono text-[11px] text-[#F0EDE6]/80">
                <span className="text-red-400">linha 03: if (saldo &gt;= valor)</span>
                <div className="text-[10px] text-[#5C5C5C] mt-1">
                  Falha: 2 requisições leem saldo simultâneo.
                </div>
              </div>
            </div>

            {/* Bloco 2: Mutação de 60s */}
            <div className="p-6">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#5C5C5C]">
                <span>MODULO 02</span>
                <span className="text-[#C8B560]">MUTACAO 60s</span>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                Sabotagem Adversarial Cirúrgica
              </h3>
              <p className="mt-2 text-xs text-[#5C5C5C] leading-relaxed">
                Inverte 1 linha lógica no artefato entregue pelo aluno. Quem domina o raciocínio
                repara a sabotagem antes do cronômetro zerar.
              </p>
              <div className="mt-4 rounded border border-[#2A2A2A] bg-[#0A0A0A] p-3 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#C8B560]">
                  <span>TEMPO: 00:19s</span>
                  <span>STATUS: APROVADO</span>
                </div>
                <div className="text-[10px] text-[#5C5C5C] truncate mt-1">
                  HASH: veritas-52319400-8a91c4
                </div>
              </div>
            </div>

            {/* Bloco 3: Arena da Sala */}
            <div className="p-6">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#5C5C5C]">
                <span>MODULO 03</span>
                <span className="text-[#C8B560]">ARENA 2D</span>
              </div>
              <h3 className="mt-3 font-display text-sm font-semibold text-[#F0EDE6]">
                Detecção de Efeito Rebanho
              </h3>
              <p className="mt-2 text-xs text-[#5C5C5C] leading-relaxed">
                Mapeia respostas abertas enviadas via celular em tempo real. Identifica aglomerados
                com sintaxe idêntica vindos do mesmo modelo de linguagem.
              </p>
              <div className="mt-4 rounded border border-[#2A2A2A] bg-[#0A0A0A] p-3 font-mono text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#5C5C5C]">ORIGINALIDADE</span>
                  <span className="text-[#C8B560] font-bold">93.0%</span>
                </div>
                <div className="text-[10px] text-[#5C5C5C] mt-1">
                  Conflito: Rafael (18%) vs Matheus (91%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. TELEMETRIA REAL (DADOS EMPIRICOS N = 48)                   */}
      {/* ============================================================ */}
      <section id="telemetria" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="border-l border-[#2A2A2A] pl-5">
              <div className="font-mono text-xs uppercase text-[#5C5C5C]">Amostra</div>
              <div className="mt-1 font-display text-3xl font-bold text-[#F0EDE6]">48</div>
              <div className="mt-1 text-xs text-[#5C5C5C]">Estudantes em 16 semanas</div>
            </div>

            <div className="border-l border-[#2A2A2A] pl-5">
              <div className="font-mono text-xs uppercase text-[#5C5C5C]">Autonomia Prática</div>
              <div className="mt-1 font-display text-3xl font-bold text-[#C8B560]">+43,0 pts</div>
              <div className="mt-1 text-xs text-[#5C5C5C]">De 49,8% para 92,8%</div>
            </div>

            <div className="border-l border-[#2A2A2A] pl-5">
              <div className="font-mono text-xs uppercase text-[#5C5C5C]">Originalidade</div>
              <div className="mt-1 font-display text-3xl font-bold text-[#F0EDE6]">93,0%</div>
              <div className="mt-1 text-xs text-[#5C5C5C]">Dispersão semântica em sala</div>
            </div>

            <div className="border-l border-[#2A2A2A] pl-5">
              <div className="font-mono text-xs uppercase text-[#5C5C5C]">Tempo de Defesa</div>
              <div className="mt-1 font-display text-3xl font-bold text-[#F0EDE6]">19s</div>
              <div className="mt-1 text-xs text-[#5C5C5C]">Média para achar a mutação</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. OS CINCO MOTORES (ESTRUTURA TECNICA)                       */}
      {/* ============================================================ */}
      <section id="motores" className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-col justify-between gap-4 border-b border-[#2A2A2A] pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs uppercase text-[#C8B560]">02. Componentes</span>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#F0EDE6] sm:text-3xl">
              Arquitetura Operacional
            </h2>
          </div>
          <p className="font-mono text-xs text-[#5C5C5C]">
            Zero oráculos passivos. Zero detectores probabilísticos.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-px bg-[#2A2A2A] md:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">01</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Caderno de Estudos & Radar de Provas
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Registro de disciplinas e matérias com contagem regressiva por avaliação.
              Copiloto Crítico diagnostica pontos fortes, aponta pontos cegos e faz perguntas
              sem fornecer cola pronta.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">02</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Raio-X de Falhas de Modelos
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Casos multidisciplinares em Computação (concorrência de saque), Saúde (triagem
              ignorando hipóxia de SpO2 &lt; 92%) e Negócios (multa oculta de 40% aprovada por
              bajulação do prompt).
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">03</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Teste de Autoria em 60s
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Injeta silenciosamente 1 mutação no próprio trabalho ou anotação entregue.
              Quem construiu o raciocínio encontra o reparo em segundos e emite prova com
              hash gravado no Supabase.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">04</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Arena da Sala ao Vivo
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Participação via QR Code no celular sem necessidade de instalar apps.
              Cálculo de distância semântica entre todas as contribuições e alerta imediato
              quando o grupo repete o mesmo prompt.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">05</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Gestão de Turmas & Convites
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Criação de turmas com código único, aprovação docente de solicitações de matrícula,
              mural de comunicados e ferramentas de acompanhamento pedagógico.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-[#0A0A0A] p-8">
            <span className="font-mono text-xs text-[#C8B560]">06</span>
            <h3 className="mt-3 font-display text-base font-semibold text-[#F0EDE6]">
              Governança RBAC & LGPD
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              12 tabelas PostgreSQL com Row Level Security. Perfis estritamente isolados
              (Aluno, Professor, Administrador) e exportação em 1 clique do pacote completo
              de dados pessoais em JSON.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. EDITAL E RESUMO EXPANDIDO                                  */}
      {/* ============================================================ */}
      <section id="edital" className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-8 sm:p-12">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <span className="font-mono text-xs text-[#C8B560]">
                  DOCUMENTO OFICIAL • 6.942 CARACTERES
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-[#F0EDE6] sm:text-2xl">
                  Resumo Ampliado Submetido ao IV Simpósio de IA da UniMAX
                </h3>
                <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#5C5C5C]">
                  Artigo completo diagramado segundo as normas estritas do edital: A4 com margens de 3cm,
                  Times New Roman 12pt, entrelinha 1,5, justificado, sem numeração de página e com
                  fundamentação em Ausubel (1968), Bloom (1984) e Rozenblit &amp; Keil (2002).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/api/simposio/pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-[#C8B560] px-4 py-2.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
                >
                  <FileText className="h-4 w-4" />
                  <span>Baixar Artigo Oficial (.PDF)</span>
                </a>

                <Link
                  href="/apresentacao"
                  className="flex items-center gap-2 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-2.5 text-xs font-medium text-[#F0EDE6] transition hover:border-[#5C5C5C]"
                >
                  <Presentation className="h-4 w-4 text-[#C8B560]" />
                  <span>Abrir Deck da Banca</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. FAQ TECNICO E OBJETIVO (SEM ACCORDIONS PESADOS)            */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-display text-xl font-bold text-[#F0EDE6] sm:text-2xl">
          Perguntas Frequentes
        </h2>

        <div className="mt-8 divide-y divide-[#2A2A2A] border-y border-[#2A2A2A]">
          <div className="py-6">
            <h4 className="font-display text-sm font-semibold text-[#F0EDE6]">
              Por que a Thinka não usa detectores estatísticos de IA?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              Detectores comerciais de perplexidade e entropia são inerentemente falhos, acusando
              estudantes dedicados por engano e sendo facilmente burlados por simples reescritas.
              A Thinka adota o teste de mutação em 60 segundos: quem construiu o raciocínio
              encontra alterações com facilidade, independentemente de ter usado ferramentas de apoio.
            </p>
          </div>

          <div className="py-6">
            <h4 className="font-display text-sm font-semibold text-[#F0EDE6]">
              Como o copiloto ajuda sem fazer o trabalho pelo aluno?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              O motor analisa a anotação escrita pelo próprio estudante e calcula a prontidão para a prova.
              Em vez de reescrever o texto, ele devolve uma análise de pontos fortes, pontos cegos e
              gera uma pergunta desafiadora de caso limite para testar o domínio antes da avaliação.
            </p>
          </div>

          <div className="py-6">
            <h4 className="font-display text-sm font-semibold text-[#F0EDE6]">
              Quais perfis têm acesso e como é feita a separação?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#5C5C5C]">
              O sistema possui 3 perfis nativos: Aluno (estudo, turmas e exames), Professor (criação de
              turmas, aprovação de alunos e painel docente) e Administrador (gestão de contas e auditoria).
              O acesso a rotas sensíveis é bloqueado por RBAC em nível de servidor.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. FOOTER INSTITUCIONAL E CREDENCIAIS                         */}
      {/* ============================================================ */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-12 text-xs text-[#5C5C5C]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#F0EDE6]">
                Thinka VERITAS Epistemic OS
              </span>
              <span className="text-[10px] text-[#5C5C5C]">
                — Versão 2.0 (Hardened)
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-[#5C5C5C]">
              Autor: Matheus Sousa dos Santos (RA: 52319400) • matheus.santos@unimax.edu.br
            </p>
            <p className="font-mono text-[10px] text-[#5C5C5C]/60">
              Centro Universitário Max Planck (UniMAX) • Bacharelado em Ciência da Computação
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <Link href="/dashboard" className="transition hover:text-[#C8B560]">
              Dashboard
            </Link>
            <Link href="/login" className="transition hover:text-[#C8B560]">
              Login
            </Link>
            <Link href="/cadastro" className="transition hover:text-[#C8B560]">
              Cadastro
            </Link>
            <Link href="/apresentacao" className="transition hover:text-[#C8B560]">
              Apresentação Oral
            </Link>
            <a
              href="/api/simposio/pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#C8B560]"
            >
              Artigo Oficial (.PDF)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
