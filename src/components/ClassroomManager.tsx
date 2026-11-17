"use client";

import React, { useMemo, useState } from "react";
import {
  Archive,
  Calendar,
  Check,
  Edit3,
  KeyRound,
  Megaphone,
  Plus,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  canPerformAction,
  normalizeCode,
  SHIFT_OPTIONS,
} from "@/lib/veritas-engine/identity-rbac";
import {
  ClassStatus,
  EnrollmentStatus,
  ShiftType,
  VeritasClass,
  VeritasEnrollment,
  VeritasUser,
} from "@/lib/veritas-engine/types";

interface ClassroomManagerProps {
  currentUser: VeritasUser | null;
  classes: VeritasClass[];
  enrollments: VeritasEnrollment[];
  onRefreshState: () => Promise<void> | void;
  onRequireAuth: () => void;
}

export default function ClassroomManager({
  currentUser,
  classes,
  enrollments,
  onRefreshState,
  onRequireAuth,
}: ClassroomManagerProps) {
  const [statusFilter, setStatusFilter] = useState<ClassStatus | "todas">("ativa");
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id ?? "");
  const [inviteCode, setInviteCode] = useState("");
  const [joinMessage, setJoinMessage] = useState("");

  // Form Create/Edit Class
  const [editorMode, setEditorMode] = useState<"closed" | "create" | "edit">("closed");
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formInstitution, setFormInstitution] = useState(
    currentUser?.institution || "Centro Universitario Max Planck (UniMAX)"
  );
  const [formDescription, setFormDescription] = useState("");
  const [formPeriod, setFormPeriod] = useState("2026.2");
  const [formStartDate, setFormStartDate] = useState("2026-08-03");
  const [formEndDate, setFormEndDate] = useState("2026-12-12");
  const [formShift, setFormShift] = useState<ShiftType>("Noturno");
  const [formMaxParticipants, setFormMaxParticipants] = useState(45);

  // Announcement composer
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annKind, setAnnKind] = useState<"aviso" | "atividade" | "prova">("atividade");
  const [annDueDate, setAnnDueDate] = useState("2026-11-28");

  // Confirm delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const canCreate = canPerformAction(currentUser, "create_class");

  const filteredClasses = useMemo(() => {
    return classes.filter((c) =>
      statusFilter === "todas" ? true : c.status === statusFilter
    );
  }, [classes, statusFilter]);

  const activeClass = useMemo(() => {
    return (
      filteredClasses.find((c) => c.id === selectedClassId) ??
      filteredClasses[0] ??
      classes[0] ??
      null
    );
  }, [filteredClasses, selectedClassId, classes]);

  const classEnrollments = useMemo(() => {
    if (!activeClass) return [];
    return enrollments.filter((e) => e.class_id === activeClass.id);
  }, [enrollments, activeClass]);

  const approvedMembers = useMemo(
    () => classEnrollments.filter((e) => e.membership_status === "aprovado"),
    [classEnrollments]
  );

  const pendingRequests = useMemo(
    () => classEnrollments.filter((e) => e.membership_status === "pendente"),
    [classEnrollments]
  );

  const canManageSelected = activeClass
    ? canPerformAction(currentUser, "manage_class", activeClass.responsible_teacher_id)
    : false;

  const callClassesApi = async (payload: Record<string, unknown>) => {
    if (!currentUser) {
      onRequireAuth();
      return false;
    }
    setBusy(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setFeedback({ ok: false, text: json.error || "Operacao recusada." });
        return false;
      }
      setFeedback({ ok: true, text: json.message || "Atualizado com sucesso." });
      await onRefreshState();
      return true;
    } finally {
      setBusy(false);
    }
  };

  const openCreateForm = () => {
    setFormName("");
    setFormCode("");
    setFormSubject("");
    setFormInstitution(
      currentUser?.institution || "Centro Universitario Max Planck (UniMAX)"
    );
    setFormDescription("");
    setFormPeriod("2026.2");
    setFormStartDate("2026-08-03");
    setFormEndDate("2026-12-12");
    setFormShift("Noturno");
    setFormMaxParticipants(45);
    setEditorMode("create");
  };

  const openEditForm = (cls: VeritasClass) => {
    setFormName(cls.name);
    setFormCode(cls.code);
    setFormSubject(cls.subject);
    setFormInstitution(cls.institution);
    setFormDescription(cls.description);
    setFormPeriod(cls.academic_period);
    setFormStartDate(cls.start_date);
    setFormEndDate(cls.end_date);
    setFormShift(cls.shift);
    setFormMaxParticipants(cls.max_participants);
    setEditorMode("edit");
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await callClassesApi(
      editorMode === "create"
        ? {
            action: "create_class",
            name: formName,
            code: formCode,
            subject: formSubject,
            institution: formInstitution,
            description: formDescription,
            academic_period: formPeriod,
            start_date: formStartDate,
            end_date: formEndDate,
            shift: formShift,
            max_participants: formMaxParticipants,
          }
        : {
            action: "update_class",
            classId: activeClass?.id,
            name: formName,
            subject: formSubject,
            institution: formInstitution,
            description: formDescription,
            academic_period: formPeriod,
            start_date: formStartDate,
            end_date: formEndDate,
            shift: formShift,
            max_participants: formMaxParticipants,
          }
    );
    if (ok) setEditorMode("closed");
  };

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await callClassesApi({
      action: "request_join",
      inviteCode,
      message: joinMessage || "Solicito entrada via codigo da turma.",
    });
    if (ok) {
      setInviteCode("");
      setJoinMessage("");
    }
  };

  const handleDecision = async (enrollmentId: string, decision: EnrollmentStatus) => {
    await callClassesApi({
      action: "decide_enrollment",
      enrollmentId,
      decision,
    });
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClass) return;
    const ok = await callClassesApi({
      action: "post_announcement",
      classId: activeClass.id,
      title: annTitle,
      content: annContent,
      kind: annKind,
      due_date: annDueDate,
    });
    if (ok) {
      setAnnTitle("");
      setAnnContent("");
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-[#0A0A0A] px-3.5 py-2.5 text-xs text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#F0EDE6]">
            Turmas e Convites
          </h1>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Ingresso por codigo exclusivo, aprovacoes docentes, horarios e atividades por turma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["ativa", "encerrada", "arquivada", "todas"] as const).map((st) => {
            if (st === "arquivada" && currentUser?.role === "aluno") return null;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-2xl px-3.5 py-2 text-xs capitalize transition ${
                  statusFilter === st
                    ? "bg-[#F0EDE6] font-semibold text-[#0A0A0A]"
                    : "bg-[#2A2A2A]/60 text-[#F0EDE6]/70 hover:bg-[#2A2A2A]"
                }`}
              >
                {st}
              </button>
            );
          })}

          {canCreate && (
            <button
              type="button"
              onClick={openCreateForm}
              className="flex items-center gap-1.5 rounded-full bg-[#C8B560] px-4 py-2 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Nova turma</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`rounded-2xl px-4 py-3 text-xs ${
            feedback.ok
              ? "border border-[#C8B560] bg-[#C8B560]/12 text-[#F0EDE6]"
              : "border border-[#5C5C5C] bg-[#2A2A2A] text-[#F0EDE6]"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Caixa de Ingresso por Codigo Exclusivo (Alunos) */}
      {(!currentUser || currentUser.role === "aluno") && (
        <div className="apple-shell">
          <form
            onSubmit={handleJoinByCode}
            className="apple-card flex flex-col gap-3 p-5 md:flex-row md:items-center"
          >
            <div className="flex items-center gap-2.5 md:w-56">
              <KeyRound className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.7} />
              <span className="text-xs font-medium text-[#F0EDE6]">
                Entrar com codigo
              </span>
            </div>
            <input
              type="text"
              required
              value={inviteCode}
              onChange={(e) => setInviteCode(normalizeCode(e.target.value))}
              placeholder="Ex: CC-IA-2026N"
              className={`${inputClass} font-mono uppercase md:w-48`}
            />
            <input
              type="text"
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Mensagem opcional ao professor"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={busy || !inviteCode.trim()}
              className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6] disabled:opacity-40"
            >
              <UserPlus className="h-3.5 w-3.5" strokeWidth={1.8} />
              <span>Solicitar entrada</span>
            </button>
          </form>
        </div>
      )}

      {/* Formulario Criar / Editar Turma */}
      {editorMode !== "closed" && canCreate && (
        <div className="apple-shell">
          <form onSubmit={handleSaveClass} className="apple-card space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-[#5C5C5C]/25 pb-3">
              <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                {editorMode === "create" ? "Criar Nova Turma" : `Editar ${activeClass?.code}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditorMode("closed")}
                className="text-xs text-[#F0EDE6]/60 hover:text-[#F0EDE6]"
              >
                Cancelar
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nome da turma *"
                className={`${inputClass} sm:col-span-2`}
              />
              <input
                type="text"
                required
                disabled={editorMode === "edit"}
                value={formCode}
                onChange={(e) => setFormCode(normalizeCode(e.target.value))}
                placeholder="Codigo unico (ex: CC-IA-2026N)"
                className={`${inputClass} font-mono uppercase`}
              />
              <input
                type="text"
                required
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                placeholder="Disciplina *"
                className={inputClass}
              />
              <input
                type="text"
                required
                value={formInstitution}
                onChange={(e) => setFormInstitution(e.target.value)}
                placeholder="Instituicao *"
                className={inputClass}
              />
              <select
                value={formShift}
                onChange={(e) => setFormShift(e.target.value as ShiftType)}
                className={inputClass}
              >
                {SHIFT_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    Turno: {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={formPeriod}
                onChange={(e) => setFormPeriod(e.target.value)}
                placeholder="Periodo letivo (2026.2)"
                className={inputClass}
              />
              <input
                type="date"
                value={formStartDate}
                onChange={(e) => setFormStartDate(e.target.value)}
                className={inputClass}
              />
              <input
                type="date"
                value={formEndDate}
                onChange={(e) => setFormEndDate(e.target.value)}
                className={inputClass}
              />
              <input
                type="number"
                min={1}
                max={500}
                value={formMaxParticipants}
                onChange={(e) => setFormMaxParticipants(Number(e.target.value))}
                placeholder="Limite de vagas"
                className={inputClass}
              />
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descricao e objetivo da turma..."
                className={`${inputClass} sm:col-span-2`}
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F0EDE6]"
            >
              {busy ? "Salvando..." : "Salvar turma"}
            </button>
          </form>
        </div>
      )}

      {/* Grade Master-Detail de Turmas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {filteredClasses.length === 0 ? (
            <div className="apple-shell">
              <div className="apple-card p-6 text-center text-xs text-[#F0EDE6]/60">
                Nenhuma turma encontrada neste filtro de status.
              </div>
            </div>
          ) : (
            filteredClasses.map((cls) => {
              const isSelected = activeClass?.id === cls.id;
              const approvedCount = enrollments.filter(
                (e) => e.class_id === cls.id && e.membership_status === "aprovado"
              ).length;
              const pendingCount = enrollments.filter(
                (e) => e.class_id === cls.id && e.membership_status === "pendente"
              ).length;
              const myEnrollment = currentUser
                ? enrollments.find(
                    (e) => e.class_id === cls.id && e.student_id === currentUser.id
                  )
                : null;

              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`apple-shell w-full text-left transition ${
                    isSelected ? "ring-1 ring-[#C8B560]" : "opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="apple-card space-y-2.5 p-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#C8B560]">
                        {cls.code}
                      </span>
                      <span className="font-mono text-[11px] text-[#F0EDE6]/55">
                        {cls.shift} · {approvedCount}/{cls.max_participants}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-[#F0EDE6]">
                      {cls.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#F0EDE6]/60">
                      <span>{cls.responsible_teacher_name}</span>
                      <span>
                        {myEnrollment
                          ? myEnrollment.membership_status
                          : pendingCount > 0 && canCreate
                          ? `${pendingCount} pendente(s)`
                          : cls.status}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detalhe da Turma Selecionada */}
        <div className="apple-shell lg:col-span-7">
          <div className="apple-card space-y-6 p-6">
            {!activeClass ? (
              <p className="text-xs text-[#F0EDE6]/60">Selecione uma turma para gerenciar.</p>
            ) : (
              <>
                <div className="flex flex-col justify-between gap-4 border-b border-[#5C5C5C]/25 pb-5 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-3 font-mono text-xs text-[#C8B560]">
                      <span>{activeClass.code}</span>
                      <span>·</span>
                      <span>{activeClass.academic_period}</span>
                      <span>·</span>
                      <span className="uppercase">{activeClass.status}</span>
                    </div>
                    <h2 className="mt-1.5 font-display text-2xl font-semibold text-[#F0EDE6]">
                      {activeClass.name}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-[#F0EDE6]/65">
                      {activeClass.description}
                    </p>
                  </div>

                  {canManageSelected && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(activeClass)}
                        aria-label="Editar turma"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6] hover:text-[#C8B560]"
                      >
                        <Edit3 className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          callClassesApi({
                            action: "update_class",
                            classId: activeClass.id,
                            status:
                              activeClass.status === "arquivada" ? "ativa" : "arquivada",
                          })
                        }
                        aria-label="Arquivar ou reativar turma"
                        title={
                          activeClass.status === "arquivada"
                            ? "Reativar turma"
                            : "Arquivar turma"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6] hover:text-[#C8B560]"
                      >
                        <Archive className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(activeClass.id)}
                        aria-label="Excluir turma"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]/75 hover:text-[#C8B560]"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.6} />
                      </button>
                    </div>
                  )}
                </div>

                {confirmDeleteId === activeClass.id && (
                  <div className="apple-subcard flex items-center justify-between gap-3 p-4 ring-1 ring-[#C8B560]">
                    <span className="text-xs text-[#F0EDE6]">
                      Confirmar exclusao definitiva da turma {activeClass.code}?
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="rounded-full bg-[#2A2A2A] px-3 py-1.5 text-xs text-[#F0EDE6]"
                      >
                        Nao
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const ok = await callClassesApi({
                            action: "delete_class",
                            classId: activeClass.id,
                          });
                          if (ok) setConfirmDeleteId(null);
                        }}
                        className="rounded-full bg-[#C8B560] px-4 py-1.5 text-xs font-semibold text-[#0A0A0A]"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}

                {/* Metadados da Turma */}
                <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div className="apple-subcard p-3">
                    <div className="text-[#F0EDE6]/50">Disciplina</div>
                    <div className="mt-1 font-medium text-[#F0EDE6]">
                      {activeClass.subject}
                    </div>
                  </div>
                  <div className="apple-subcard p-3">
                    <div className="text-[#F0EDE6]/50">Docente</div>
                    <div className="mt-1 font-medium text-[#F0EDE6]">
                      {activeClass.responsible_teacher_name}
                    </div>
                  </div>
                  <div className="apple-subcard p-3">
                    <div className="text-[#F0EDE6]/50">Periodo</div>
                    <div className="mt-1 font-mono text-[#F0EDE6]">
                      {activeClass.start_date} a {activeClass.end_date}
                    </div>
                  </div>
                  <div className="apple-subcard p-3">
                    <div className="text-[#F0EDE6]/50">Participantes</div>
                    <div className="mt-1 font-mono text-[#C8B560]">
                      {approvedMembers.length} / {activeClass.max_participants}
                    </div>
                  </div>
                </div>

                {/* Botao rapido de ingresso para aluno nao matriculado */}
                {currentUser?.role === "aluno" &&
                  !classEnrollments.some((e) => e.student_id === currentUser.id) &&
                  activeClass.status === "ativa" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        callClassesApi({
                          action: "request_join",
                          classId: activeClass.id,
                          inviteCode: activeClass.code,
                        })
                      }
                      className="flex items-center gap-2 rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F0EDE6]"
                    >
                      <UserPlus className="h-4 w-4" strokeWidth={1.8} />
                      <span>Solicitar ingresso nesta turma</span>
                    </button>
                  )}

                {/* Solicitacoes Pendentes (Visivel para docente responsavel ou admin) */}
                {canManageSelected && pendingRequests.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#C8B560]">
                      <Users className="h-4 w-4" strokeWidth={1.7} />
                      <span>Solicitacoes aguardando aprovacao ({pendingRequests.length})</span>
                    </div>
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="apple-subcard flex flex-col justify-between gap-3 p-4 ring-1 ring-[#C8B560]/35 sm:flex-row sm:items-center"
                      >
                        <div>
                          <div className="text-xs font-semibold text-[#F0EDE6]">
                            {req.student_name} · RA {req.student_ra}
                          </div>
                          <p className="mt-0.5 text-[11px] text-[#F0EDE6]/60">
                            {req.message}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDecision(req.id, "aprovado")}
                            className="flex items-center gap-1 rounded-full bg-[#C8B560] px-3.5 py-1.5 text-xs font-semibold text-[#0A0A0A]"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>Aprovar</span>
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDecision(req.id, "recusado")}
                            className="flex items-center gap-1 rounded-full bg-[#2A2A2A] px-3.5 py-1.5 text-xs text-[#F0EDE6]/80"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2} />
                            <span>Recusar</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Alunos Vinculados */}
                <div className="space-y-2.5">
                  <div className="text-xs font-medium text-[#F0EDE6]/60">
                    Alunos vinculados ({approvedMembers.length})
                  </div>
                  {approvedMembers.length === 0 ? (
                    <div className="apple-subcard p-4 text-xs text-[#F0EDE6]/55">
                      Nenhum aluno aprovado nesta turma ainda.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {approvedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="apple-subcard flex items-center justify-between px-4 py-3 text-xs"
                        >
                          <div>
                            <div className="font-medium text-[#F0EDE6]">
                              {member.student_name}
                            </div>
                            <div className="font-mono text-[11px] text-[#F0EDE6]/50">
                              RA {member.student_ra}
                            </div>
                          </div>
                          {canManageSelected && (
                            <button
                              type="button"
                              onClick={() => handleDecision(member.id, "removido")}
                              className="text-[11px] text-[#F0EDE6]/50 hover:text-[#C8B560]"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Comunicados e Atividades da Turma */}
                <div className="space-y-3 border-t border-[#5C5C5C]/25 pt-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#F0EDE6]/70">
                    <Megaphone className="h-4 w-4 text-[#C8B560]" strokeWidth={1.6} />
                    <span>Mural de atividades e avisos</span>
                  </div>

                  {canManageSelected && (
                    <form
                      onSubmit={handlePostAnnouncement}
                      className="apple-subcard space-y-2.5 p-4"
                    >
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <input
                          type="text"
                          required
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          placeholder="Titulo da atividade ou aviso"
                          className={`${inputClass} sm:col-span-2`}
                        />
                        <select
                          value={annKind}
                          onChange={(e) =>
                            setAnnKind(
                              e.target.value as "aviso" | "atividade" | "prova"
                            )
                          }
                          className={inputClass}
                        >
                          <option value="atividade">Atividade</option>
                          <option value="prova">Prova</option>
                          <option value="aviso">Aviso</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        required
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        placeholder="Instrucoes objetivas para os alunos..."
                        className={inputClass}
                      />
                      <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-[11px] text-[#F0EDE6]/55">
                          <Calendar className="h-3.5 w-3.5" strokeWidth={1.6} />
                          <span>Prazo:</span>
                          <input
                            type="date"
                            value={annDueDate}
                            onChange={(e) => setAnnDueDate(e.target.value)}
                            className="rounded-xl bg-[#0A0A0A] px-2.5 py-1 text-xs text-[#F0EDE6] ring-1 ring-[#5C5C5C]/40"
                          />
                        </label>
                        <button
                          type="submit"
                          disabled={busy}
                          className="rounded-full bg-[#C8B560] px-4 py-1.5 text-xs font-semibold text-[#0A0A0A]"
                        >
                          Publicar
                        </button>
                      </div>
                    </form>
                  )}

                  {(activeClass.announcements || []).length === 0 ? (
                    <div className="apple-subcard p-4 text-xs text-[#F0EDE6]/55">
                      Sem comunicados publicados nesta turma.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {(activeClass.announcements || []).map((ann) => (
                        <div key={ann.id} className="apple-subcard space-y-1 p-4 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F0EDE6]">
                              {ann.title}
                            </span>
                            <span className="font-mono text-[11px] uppercase text-[#C8B560]">
                              {ann.kind}
                              {ann.due_date ? ` · ${ann.due_date}` : ""}
                            </span>
                          </div>
                          <p className="leading-relaxed text-[#F0EDE6]/70">
                            {ann.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
