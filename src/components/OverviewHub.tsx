"use client";

import React, { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  Check,
  Download,
  Radio,
  ScanSearch,
  Shield,
  ShieldCheck,
  Target,
  Users,
  X,
} from "lucide-react";
import {
  EnrollmentStatus,
  StudyNote,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasUser,
} from "@/lib/veritas-engine/types";

export type VeritasTab =
  | "home"
  | "notebook"
  | "autopsy"
  | "mutation"
  | "arena"
  | "faculty"
  | "classes"
  | "profile"
  | "settings";

interface OverviewHubProps {
  currentUser: VeritasUser | null;
  notesCount: number;
  solvedAutopsiesCount: number;
  verifiedProofsCount: number;
  arenaOriginality: number;
  studyNotes: StudyNote[];
  classes: VeritasClass[];
  enrollments: VeritasEnrollment[];
  adminUsers: VeritasUser[];
  activityLogs: VeritasActivityLog[];
  onNavigate: (tab: VeritasTab) => void;
  onRefreshState: () => Promise<void> | void;
  onOpenAuth: () => void;
}

export default function OverviewHub({
  currentUser,
  notesCount,
  solvedAutopsiesCount,
  verifiedProofsCount,
  arenaOriginality,
  studyNotes,
  classes,
  enrollments,
  adminUsers,
  activityLogs,
  onNavigate,
  onRefreshState,
  onOpenAuth,
}: OverviewHubProps) {
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

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

  const handleEnrollmentDecision = async (
    enrollmentId: string,
    decision: EnrollmentStatus
  ) => {
    setBusyActionId(enrollmentId);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "decide_enrollment",
          enrollmentId,
          decision,
        }),
      });
      if (res.ok) await onRefreshState();
    } finally {
      setBusyActionId(null);
    }
  };

  const handleExportAdminReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      platform: "VERITAS UniMAX",
      totals: {
        users: adminUsers.length,
        students: adminUsers.filter((u) => u.role === "aluno").length,
        teachers: adminUsers.filter((u) => u.role === "professor").length,
        admins: adminUsers.filter((u) => u.role === "administrador").length,
        activeClasses: classes.filter((c) => c.status === "ativa").length,
        approvedEnrollments: enrollments.filter((e) => e.membership_status === "aprovado")
          .length,
        pendingEnrollments: enrollments.filter((e) => e.membership_status === "pendente")
          .length,
      },
      recentActivity: activityLogs.slice(0, 15),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "veritas-relatorio-institucional.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Dados calculados por papel
  const myApprovedClassIds = new Set(
    enrollments
      .filter(
        (e) =>
          currentUser &&
          e.student_id === currentUser.id &&
          e.membership_status === "aprovado"
      )
      .map((e) => e.class_id)
  );
  const myStudentClasses = classes.filter((c) => myApprovedClassIds.has(c.id));
  const pendingClassActivities = myStudentClasses.flatMap((c) =>
    (c.announcements || []).map((a) => ({ ...a, className: c.name, classCode: c.code }))
  );
  const weakestNote =
    [...studyNotes].sort((a, b) => a.readiness_pct - b.readiness_pct)[0] || null;
  const avgNoteReadiness =
    studyNotes.length > 0
      ? Math.round(
          studyNotes.reduce((acc, n) => acc + n.readiness_pct, 0) / studyNotes.length
        )
      : 0;

  const teacherClasses = currentUser
    ? classes.filter((c) => c.responsible_teacher_id === currentUser.id)
    : [];
  const teacherClassIds = new Set(teacherClasses.map((c) => c.id));
  const teacherPendingEnrollments = enrollments.filter(
    (e) => teacherClassIds.has(e.class_id) && e.membership_status === "pendente"
  );
  const teacherApprovedStudentsCount = enrollments.filter(
    (e) => teacherClassIds.has(e.class_id) && e.membership_status === "aprovado"
  ).length;
  const teacherAnnouncementsCount = teacherClasses.reduce(
    (acc, c) => acc + (c.announcements?.length || 0),
    0
  );

  return (
    <div className="space-y-10">
      {/* Hero limpo, direto e sem pilulas */}
      <section className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-[#C8B560]">
            VERITAS — UNIMAX
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-[#F0EDE6] sm:text-6xl">
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0A0A0A]/15 transition-transform duration-300 apple-ease group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
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
                  <span className="font-mono text-xs tabular-nums text-[#F0EDE6]/50">
                    {item.stat}
                  </span>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-[#F0EDE6]">
                      {item.title}
                    </h2>
                    <ArrowUpRight
                      className="h-4 w-4 text-[#5C5C5C] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#C8B560]"
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

      {/* Painel Inicial Personalizado por Perfil (Aluno / Professor / Administrador) */}
      <section className="apple-shell">
        <div className="apple-card space-y-6 p-6 sm:p-7">
          {!currentUser ? (
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="font-mono text-xs uppercase text-[#C8B560]">
                  Sessao Visitante
                </div>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#F0EDE6]">
                  Entre ou crie uma conta para desbloquear sua area personalizada
                </h2>
                <p className="mt-1 text-xs text-[#F0EDE6]/60">
                  Suas turmas, calendario de provas, aprovacoes e metas se adaptam ao perfil Aluno, Professor ou Administrador.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAuth}
                className="shrink-0 rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F0EDE6]"
              >
                Entrar / Cadastrar
              </button>
            </div>
          ) : currentUser.role === "aluno" ? (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 border-b border-[#5C5C5C]/25 pb-4 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C8B560]">
                    Painel do Aluno · {currentUser.student_profile.course}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#F0EDE6]">
                    Ola, {currentUser.social_name || currentUser.full_name.split(" ")[0]}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("classes")}
                    className="rounded-full bg-[#2A2A2A] px-4 py-2 text-xs text-[#F0EDE6] hover:text-[#C8B560]"
                  >
                    Ver Turmas
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("notebook")}
                    className="rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A]"
                  >
                    Abrir Caderno
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Turmas & Professores */}
                <div className="apple-subcard space-y-3 p-4 text-xs">
                  <div className="flex items-center gap-2 font-medium text-[#C8B560]">
                    <Users className="h-4 w-4" strokeWidth={1.7} />
                    <span>Minhas turmas ({myStudentClasses.length})</span>
                  </div>
                  {myStudentClasses.length === 0 ? (
                    <p className="text-[#F0EDE6]/55">
                      Use um codigo em Turmas para ingressar com seu professor.
                    </p>
                  ) : (
                    myStudentClasses.map((c) => (
                      <div key={c.id} className="border-t border-[#5C5C5C]/20 pt-2">
                        <div className="font-semibold text-[#F0EDE6]">{c.name}</div>
                        <div className="text-[11px] text-[#F0EDE6]/55">
                          {c.responsible_teacher_name} · {c.code}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Atividades Pendentes & Calendario */}
                <div className="apple-subcard space-y-3 p-4 text-xs">
                  <div className="flex items-center gap-2 font-medium text-[#C8B560]">
                    <Calendar className="h-4 w-4" strokeWidth={1.7} />
                    <span>Atividades & Provas ({pendingClassActivities.length})</span>
                  </div>
                  {pendingClassActivities.slice(0, 3).map((act) => (
                    <div key={act.id} className="border-t border-[#5C5C5C]/20 pt-2">
                      <div className="font-semibold text-[#F0EDE6]">{act.title}</div>
                      <div className="text-[11px] text-[#F0EDE6]/55">
                        {act.classCode}
                        {act.due_date ? ` · Prazo ${act.due_date}` : ""}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progresso, Metas e Recomendacao */}
                <div className="apple-subcard space-y-3 p-4 text-xs">
                  <div className="flex items-center gap-2 font-medium text-[#C8B560]">
                    <Target className="h-4 w-4" strokeWidth={1.7} />
                    <span>Progresso & Recomendacao</span>
                  </div>
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6] tabular-nums">
                    {avgNoteReadiness}% preparo medio
                  </div>
                  <p className="text-[#F0EDE6]/65">
                    Meta diaria: {currentUser.study_preferences.daily_minutes_goal} min (
                    {currentUser.study_preferences.study_frequency}).
                  </p>
                  {weakestNote && (
                    <div className="border-t border-[#5C5C5C]/20 pt-2 text-[#F0EDE6]/85">
                      Priorizar revisao: <strong>{weakestNote.subject_name}</strong> (
                      {weakestNote.exam_date_label}, {weakestNote.readiness_pct}%).
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : currentUser.role === "professor" ? (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 border-b border-[#5C5C5C]/25 pb-4 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C8B560]">
                    Painel Docente · {currentUser.teacher_profile.professional_registry}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#F0EDE6]">
                    {currentUser.full_name}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("classes")}
                    className="rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A]"
                  >
                    Gerenciar Turmas
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("faculty")}
                    className="rounded-full bg-[#2A2A2A] px-4 py-2 text-xs text-[#F0EDE6] hover:text-[#C8B560]"
                  >
                    Resultados da Turma
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-xs">
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#C8B560]">
                    {teacherClasses.length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Turmas sob responsabilidade</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6]">
                    {teacherApprovedStudentsCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Alunos vinculados</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6]">
                    {teacherAnnouncementsCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Atividades publicadas</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#C8B560]">
                    {teacherPendingEnrollments.length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Solicitacoes pendentes</div>
                </div>
              </div>

              {teacherPendingEnrollments.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-[#C8B560]">
                    Aprovacao rapida de alunos em turma:
                  </div>
                  {teacherPendingEnrollments.map((req) => {
                    const cls = classes.find((c) => c.id === req.class_id);
                    return (
                      <div
                        key={req.id}
                        className="apple-subcard flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                      >
                        <div className="text-xs">
                          <div className="font-semibold text-[#F0EDE6]">
                            {req.student_name} (RA {req.student_ra}) · {cls?.code}
                          </div>
                          <div className="text-[11px] text-[#F0EDE6]/55">{req.message}</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busyActionId === req.id}
                            onClick={() => handleEnrollmentDecision(req.id, "aprovado")}
                            className="flex items-center gap-1 rounded-full bg-[#C8B560] px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A]"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>Aprovar</span>
                          </button>
                          <button
                            type="button"
                            disabled={busyActionId === req.id}
                            onClick={() => handleEnrollmentDecision(req.id, "recusado")}
                            className="flex items-center gap-1 rounded-full bg-[#2A2A2A] px-3.5 py-1.5 text-xs text-[#F0EDE6]"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>Recusar</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 border-b border-[#5C5C5C]/25 pb-4 sm:flex-row sm:items-center">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#C8B560]">
                    Painel Administrativo — {currentUser.admin_profile.department}
                  </span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-[#F0EDE6]">
                    {currentUser.full_name}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleExportAdminReport}
                    className="flex items-center gap-1.5 rounded-full bg-[#2A2A2A] px-4 py-2 text-xs text-[#F0EDE6] hover:text-[#C8B560]"
                  >
                    <Download className="h-3.5 w-3.5" strokeWidth={1.7} />
                    <span>Relatorio JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("settings")}
                    className="flex items-center gap-1.5 rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A]"
                  >
                    <Shield className="h-3.5 w-3.5" strokeWidth={1.7} />
                    <span>Gerenciar Contas RBAC</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#C8B560]">
                    {adminUsers.length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Usuarios cadastrados</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6]">
                    {adminUsers.filter((u) => u.role === "aluno").length} /{" "}
                    {adminUsers.filter((u) => u.role === "professor").length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Alunos / Professores</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6]">
                    {classes.filter((c) => c.status === "ativa").length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Turmas ativas</div>
                </div>
                <div className="apple-subcard p-4">
                  <div className="font-mono text-2xl font-semibold text-[#C8B560]">
                    {activityLogs.length}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Eventos auditados</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Resumo numerico minimalista (3 numeros limpos, sem excesso de texto) */}
      <section className="apple-shell">
        <div className="apple-card grid grid-cols-1 divide-y divide-[#5C5C5C]/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#C8B560]">
              +43%
            </div>
            <div className="mt-1.5 text-sm text-[#F0EDE6]/70">
              Mais autonomia real apos 16 semanas
            </div>
          </div>
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#F0EDE6]">
              93%
            </div>
            <div className="mt-1.5 text-sm text-[#F0EDE6]/70">
              Originalidade nas respostas em sala
            </div>
          </div>
          <div className="p-7">
            <div className="font-mono text-3xl font-semibold tabular-nums text-[#F0EDE6]">
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
