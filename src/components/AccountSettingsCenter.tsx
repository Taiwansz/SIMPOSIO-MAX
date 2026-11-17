"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  BookMarked,
  Download,
  Eye,
  KeyRound,
  Monitor,
  Palette,
  Shield,
  ShieldAlert,
  Trash2,
  UserCog,
  Users,
} from "lucide-react";
import { formatPhoneBR, SHIFT_OPTIONS } from "@/lib/veritas-engine/identity-rbac";
import {
  AccountStatus,
  ShiftType,
  UserRole,
  VeritasActivityLog,
  VeritasSession,
  VeritasUser,
} from "@/lib/veritas-engine/types";

interface AccountSettingsCenterProps {
  currentUser: VeritasUser | null;
  adminUsers: VeritasUser[];
  sessions: VeritasSession[];
  activityLogs: VeritasActivityLog[];
  onRefreshState: () => Promise<void> | void;
  onRequireAuth: () => void;
}

type SettingsSection =
  | "conta"
  | "perfil"
  | "privacidade"
  | "notificacoes"
  | "seguranca"
  | "aparencia"
  | "preferencias_estudo"
  | "lgpd"
  | "admin_rbac";

export default function AccountSettingsCenter({
  currentUser,
  adminUsers,
  sessions,
  activityLogs,
  onRefreshState,
  onRequireAuth,
}: AccountSettingsCenterProps) {
  const [section, setSection] = useState<SettingsSection>("conta");
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(
    null
  );

  // Conta
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Perfil
  const [socialName, setSocialName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [stateUf, setStateUf] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [course, setCourse] = useState("");
  const [gradeYear, setGradeYear] = useState("");
  const [shift, setShift] = useState<ShiftType>("Noturno");
  const [learningGoals, setLearningGoals] = useState("");
  const [academicDegree, setAcademicDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");

  // Privacidade
  const [privacy, setPrivacy] = useState(
    currentUser?.privacy_settings || {
      profile_visibility: "turma" as const,
      show_email: false,
      show_phone: false,
      show_classes: true,
      show_stats: true,
      show_activity_status: true,
      allow_interactions: true,
    }
  );

  // Notificacoes
  const [notifications, setNotifications] = useState(
    currentUser?.notification_settings || {
      new_activities: true,
      messages: true,
      class_invites: true,
      class_updates: true,
      teacher_notices: true,
      platform_updates: true,
    }
  );

  // Seguranca
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<
    "app_ou_email" | "sms" | "chave_seguranca"
  >("app_ou_email");

  // Aparencia
  const [appearance, setAppearance] = useState(
    currentUser?.appearance_settings || {
      theme: "dark" as const,
      language: "pt-BR" as const,
      high_contrast: false,
      compact_mode: false,
      reduced_motion: false,
    }
  );

  // Preferencias de estudo
  const [favoriteSubjectsText, setFavoriteSubjectsText] = useState("");
  const [learningTargets, setLearningTargets] = useState("");
  const [studyFrequency, setStudyFrequency] = useState<
    "diaria" | "alternada" | "semanal" | "intensiva"
  >("diaria");
  const [dailyMinutesGoal, setDailyMinutesGoal] = useState(45);
  const [copilotIntensity, setCopilotIntensity] = useState<
    "rigorosa" | "equilibrada" | "guiada"
  >("rigorosa");

  // LGPD delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    setFullName(currentUser.full_name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setUsername(currentUser.username);
    setSocialName(currentUser.social_name);
    setAvatarUrl(currentUser.avatar_url);
    setBio(currentUser.bio);
    setBirthDate(currentUser.birth_date);
    setInstitution(currentUser.institution);
    setCountry(currentUser.country);
    setStateUf(currentUser.state);
    setCity(currentUser.city);
    setAddress(currentUser.address);
    setCourse(currentUser.student_profile?.course || "");
    setGradeYear(currentUser.student_profile?.grade_year || "");
    setShift(currentUser.student_profile?.shift || "Noturno");
    setLearningGoals(currentUser.student_profile?.learning_goals || "");
    setAcademicDegree(currentUser.teacher_profile?.academic_degree || "");
    setSpecialization(currentUser.teacher_profile?.specialization || "");
    setAvailability(currentUser.teacher_profile?.availability || "");
    setPrivacy(currentUser.privacy_settings);
    setNotifications(currentUser.notification_settings);
    setTwoFactorEnabled(currentUser.security_settings?.two_factor_enabled ?? false);
    setTwoFactorMethod(
      currentUser.security_settings?.two_factor_method ?? "app_ou_email"
    );
    setAppearance(currentUser.appearance_settings);
    setFavoriteSubjectsText(
      (currentUser.study_preferences?.favorite_subjects || []).join(", ")
    );
    setLearningTargets(currentUser.study_preferences?.learning_targets || "");
    setStudyFrequency(currentUser.study_preferences?.study_frequency || "diaria");
    setDailyMinutesGoal(currentUser.study_preferences?.daily_minutes_goal || 45);
    setCopilotIntensity(currentUser.study_preferences?.copilot_intensity || "rigorosa");
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="apple-shell">
        <div className="apple-card flex flex-col items-start gap-4 p-8">
          <h1 className="font-display text-2xl font-semibold text-[#F0EDE6]">
            Configuracoes e Privacidade
          </h1>
          <p className="text-sm text-[#F0EDE6]/65">
            Entre com uma conta para gerenciar credenciais, privacidade, sessoes ativas e LGPD.
          </p>
          <button
            type="button"
            onClick={onRequireAuth}
            className="rounded-full bg-[#C8B560] px-6 py-3 text-xs font-semibold text-[#0A0A0A]"
          >
            Entrar ou Criar Conta
          </button>
        </div>
      </div>
    );
  }

  const callUsersApi = async (payload: Record<string, unknown>) => {
    setBusy(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatusMsg({ ok: false, text: json.error || "Falha ao atualizar." });
        return null;
      }
      setStatusMsg({ ok: true, text: json.message || "Alteracoes salvas." });
      await onRefreshState();
      return json;
    } finally {
      setBusy(false);
    }
  };

  const handleExportLgpd = async () => {
    const json = await callUsersApi({
      action: "export_lgpd",
      targetUserId: currentUser.id,
    });
    if (json?.lgpdPackage) {
      const blob = new Blob([JSON.stringify(json.lgpdPackage, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `veritas-dados-lgpd-${currentUser.username}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg({
        ok: true,
        text: "Arquivo JSON de portabilidade LGPD gerado e baixado.",
      });
    }
  };

  const navItems: Array<{
    id: SettingsSection;
    label: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    adminOnly?: boolean;
  }> = [
    { id: "conta", label: "Conta", icon: UserCog },
    { id: "perfil", label: "Perfil", icon: Users },
    { id: "privacidade", label: "Privacidade", icon: Eye },
    { id: "notificacoes", label: "Notificacoes", icon: Bell },
    { id: "seguranca", label: "Seguranca", icon: Shield },
    { id: "aparencia", label: "Aparencia", icon: Palette },
    { id: "preferencias_estudo", label: "Estudo", icon: BookMarked },
    { id: "lgpd", label: "LGPD e Dados", icon: ShieldAlert },
    { id: "admin_rbac", label: "Admin RBAC", icon: KeyRound, adminOnly: true },
  ];

  const inputClass =
    "w-full rounded-2xl bg-[#0A0A0A] px-3.5 py-2.5 text-xs text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]";

  const renderToggle = (
    checked: boolean,
    onChange: (next: boolean) => void,
    label: string,
    hint: string
  ) => (
    <label className="apple-subcard flex cursor-pointer items-center justify-between gap-4 p-4">
      <div>
        <div className="text-xs font-medium text-[#F0EDE6]">{label}</div>
        <div className="mt-0.5 text-[11px] text-[#F0EDE6]/55">{hint}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#C8B560]"
      />
    </label>
  );

  const userSessions = sessions.filter((s) => s.user_id === currentUser.id);
  const accessLogs = activityLogs
    .filter((l) => l.user_id === currentUser.id)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#F0EDE6]">
          Configuracoes da Conta
        </h1>
        <p className="mt-1 text-sm text-[#F0EDE6]/60">
          Privacidade, seguranca, sessoes conectadas, tema Apple ThLoop e governanca LGPD.
        </p>
      </div>

      {statusMsg && (
        <div
          className={`rounded-2xl px-4 py-3 text-xs ${
            statusMsg.ok
              ? "border border-[#C8B560] bg-[#C8B560]/12 text-[#F0EDE6]"
              : "border border-[#5C5C5C] bg-[#2A2A2A] text-[#F0EDE6]"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Menu lateral das 7 secoes + LGPD + Admin */}
        <div className="space-y-1.5 lg:col-span-3">
          {navItems.map((item) => {
            if (item.adminOnly && currentUser.role !== "administrador") return null;
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setStatusMsg(null);
                  setSection(item.id);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs transition ${
                  active
                    ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                    : "bg-[#2A2A2A]/50 text-[#F0EDE6]/75 hover:bg-[#2A2A2A] hover:text-[#F0EDE6]"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Painel da Secao Ativa */}
        <div className="apple-shell lg:col-span-9">
          <div className="apple-card space-y-5 p-6">
            {section === "conta" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await callUsersApi({
                    action: "update_settings",
                    section: "conta",
                    payload: {
                      full_name: fullName,
                      email,
                      phone,
                      username,
                      ...(newPassword
                        ? {
                            current_password: currentPassword,
                            new_password: newPassword,
                            confirm_password: confirmPassword,
                          }
                        : {}),
                    },
                  });
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="space-y-4"
              >
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  1. Conta e Credenciais
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nome completo"
                    className={inputClass}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                    placeholder="Telefone"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nome de usuario"
                    className={inputClass}
                  />
                </div>

                <div className="border-t border-[#5C5C5C]/25 pt-4 space-y-3">
                  <div className="text-xs text-[#F0EDE6]/65">
                    Alterar senha (deixe em branco para manter a atual):
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Senha atual"
                      className={inputClass}
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Nova senha"
                      className={inputClass}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmar nova senha"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  {busy ? "Salvando..." : "Salvar dados da conta"}
                </button>
              </form>
            )}

            {section === "perfil" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  callUsersApi({
                    action: "update_settings",
                    section: "perfil",
                    payload: {
                      social_name: socialName,
                      avatar_url: avatarUrl,
                      bio,
                      birth_date: birthDate,
                      institution,
                      country,
                      state: stateUf,
                      city,
                      address,
                      student_profile:
                        currentUser.role === "aluno"
                          ? { course, grade_year: gradeYear, shift, learning_goals: learningGoals }
                          : undefined,
                      teacher_profile:
                        currentUser.role === "professor"
                          ? { academic_degree: academicDegree, specialization, availability }
                          : undefined,
                    },
                  });
                }}
                className="space-y-4"
              >
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  2. Perfil Pessoal e Academico
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    placeholder="Nome social (opcional)"
                    className={inputClass}
                  />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="URL da foto / avatar"
                    className={inputClass}
                  />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Instituicao"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={stateUf}
                    onChange={(e) => setStateUf(e.target.value)}
                    placeholder="Estado"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Pais"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Endereco"
                    className={inputClass}
                  />
                </div>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Biografia / apresentacao"
                  className={inputClass}
                />

                {currentUser.role === "aluno" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="Curso"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={gradeYear}
                      onChange={(e) => setGradeYear(e.target.value)}
                      placeholder="Serie / Semestre"
                      className={inputClass}
                    />
                    <select
                      value={shift}
                      onChange={(e) => setShift(e.target.value as ShiftType)}
                      className={inputClass}
                    >
                      {SHIFT_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={learningGoals}
                      onChange={(e) => setLearningGoals(e.target.value)}
                      placeholder="Objetivos de aprendizagem"
                      className={`${inputClass} sm:col-span-3`}
                    />
                  </div>
                )}

                {currentUser.role === "professor" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      value={academicDegree}
                      onChange={(e) => setAcademicDegree(e.target.value)}
                      placeholder="Formacao"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="Especializacao"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Disponibilidade"
                      className={inputClass}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  {busy ? "Salvando..." : "Salvar perfil"}
                </button>
              </form>
            )}

            {section === "privacidade" && (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  3. Privacidade e Visibilidade
                </h2>
                <div className="space-y-2">
                  <span className="text-xs text-[#F0EDE6]/65">Quem pode ver seu perfil</span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["publico", "turma", "privado"] as const).map((vis) => (
                      <button
                        key={vis}
                        type="button"
                        onClick={() =>
                          setPrivacy((p) => ({ ...p, profile_visibility: vis }))
                        }
                        className={`rounded-2xl py-2.5 text-xs capitalize transition ${
                          privacy.profile_visibility === vis
                            ? "bg-[#F0EDE6] font-semibold text-[#0A0A0A]"
                            : "bg-[#2A2A2A]/60 text-[#F0EDE6]/75"
                        }`}
                      >
                        {vis}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {renderToggle(
                    privacy.show_email,
                    (v) => setPrivacy((p) => ({ ...p, show_email: v })),
                    "Exibir e-mail no perfil",
                    "Permite que usuarios autorizados visualizem seu e-mail."
                  )}
                  {renderToggle(
                    privacy.show_phone,
                    (v) => setPrivacy((p) => ({ ...p, show_phone: v })),
                    "Exibir telefone no perfil",
                    "Mantenha oculto para visibilidade somente administrativa."
                  )}
                  {renderToggle(
                    privacy.show_classes,
                    (v) => setPrivacy((p) => ({ ...p, show_classes: v })),
                    "Exibir turmas vinculadas",
                    "Mostra suas disciplinas e turmas no perfil."
                  )}
                  {renderToggle(
                    privacy.show_stats,
                    (v) => setPrivacy((p) => ({ ...p, show_stats: v })),
                    "Exibir estatisticas de uso",
                    "Mostra contagem de anotacoes, analises e selos SHA-256."
                  )}
                  {renderToggle(
                    privacy.show_activity_status,
                    (v) => setPrivacy((p) => ({ ...p, show_activity_status: v })),
                    "Exibir status e atividades recentes",
                    "Compartilha linha do tempo recente na comunidade."
                  )}
                  {renderToggle(
                    privacy.allow_interactions,
                    (v) => setPrivacy((p) => ({ ...p, allow_interactions: v })),
                    "Permitir interacoes e convites",
                    "Habilita convites diretos de turma e debates na Arena."
                  )}
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    callUsersApi({
                      action: "update_settings",
                      section: "privacidade",
                      payload: privacy,
                    })
                  }
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  Salvar privacidade
                </button>
              </div>
            )}

            {section === "notificacoes" && (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  4. Preferencias de Notificacoes
                </h2>
                <div className="space-y-2">
                  {renderToggle(
                    notifications.new_activities,
                    (v) => setNotifications((n) => ({ ...n, new_activities: v })),
                    "Novas atividades e provas",
                    "Alertas sobre prazos e novos desafios do Raio-X ou Teste 60s."
                  )}
                  {renderToggle(
                    notifications.messages,
                    (v) => setNotifications((n) => ({ ...n, messages: v })),
                    "Mensagens e devolutivas",
                    "Feedbacks do copiloto e observacoes de avaliacao."
                  )}
                  {renderToggle(
                    notifications.class_invites,
                    (v) => setNotifications((n) => ({ ...n, class_invites: v })),
                    "Convites e aprovacoes de turma",
                    "Confirmacoes de entrada ou pedidos de matricula."
                  )}
                  {renderToggle(
                    notifications.class_updates,
                    (v) => setNotifications((n) => ({ ...n, class_updates: v })),
                    "Alteracoes em turmas",
                    "Mudancas de horario, turno ou encerramento de periodo."
                  )}
                  {renderToggle(
                    notifications.teacher_notices,
                    (v) => setNotifications((n) => ({ ...n, teacher_notices: v })),
                    "Avisos de professores",
                    "Comunicados diretos publicados no mural das disciplinas."
                  )}
                  {renderToggle(
                    notifications.platform_updates,
                    (v) => setNotifications((n) => ({ ...n, platform_updates: v })),
                    "Atualizacoes e comunicados da plataforma",
                    "Novidades do VERITAS e cronograma do Simposio UniMAX."
                  )}
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    callUsersApi({
                      action: "update_settings",
                      section: "notificacoes",
                      payload: notifications,
                    })
                  }
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  Salvar notificacoes
                </button>
              </div>
            )}

            {section === "seguranca" && (
              <div className="space-y-5">
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  5. Seguranca, 2FA e Sessoes Conectadas
                </h2>

                {renderToggle(
                  twoFactorEnabled,
                  (v) => setTwoFactorEnabled(v),
                  "Autenticacao em dois fatores (2FA)",
                  "Exige segundo fator de confirmacao ao iniciar nova sessao."
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={twoFactorMethod}
                    onChange={(e) =>
                      setTwoFactorMethod(
                        e.target.value as "app_ou_email" | "sms" | "chave_seguranca"
                      )
                    }
                    className={`${inputClass} sm:w-64`}
                  >
                    <option value="app_ou_email">Metodo: App ou E-mail</option>
                    <option value="sms">Metodo: SMS no telefone</option>
                    <option value="chave_seguranca">Metodo: Chave de Seguranca</option>
                  </select>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      callUsersApi({
                        action: "update_settings",
                        section: "seguranca",
                        payload: {
                          two_factor_enabled: twoFactorEnabled,
                          two_factor_method: twoFactorMethod,
                        },
                      })
                    }
                    className="rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                  >
                    Salvar 2FA
                  </button>
                </div>

                {/* Sessoes Ativas */}
                <div className="border-t border-[#5C5C5C]/25 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#C8B560]">
                      <Monitor className="h-4 w-4" strokeWidth={1.7} />
                      <span>Dispositivos e sessoes ({userSessions.length})</span>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        callUsersApi({
                          action: "terminate_session",
                          revokeAllOthers: true,
                        })
                      }
                      className="rounded-full bg-[#2A2A2A] px-3.5 py-1.5 text-[11px] text-[#F0EDE6] hover:text-[#C8B560]"
                    >
                      Encerrar outras sessoes
                    </button>
                  </div>

                  {userSessions.length === 0 ? (
                    <div className="apple-subcard p-4 text-xs text-[#F0EDE6]/55">
                      Apenas a sessao corrente esta registrada.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userSessions.map((s) => (
                        <div
                          key={s.id}
                          className="apple-subcard flex items-center justify-between gap-3 p-3.5 text-xs"
                        >
                          <div>
                            <div className="font-medium text-[#F0EDE6]">
                              {s.device_label}
                            </div>
                            <div className="font-mono text-[11px] text-[#F0EDE6]/50">
                              IP {s.ip_masked} · {s.is_active ? "Ativa" : "Encerrada"}
                            </div>
                          </div>
                          {s.is_active && s.session_token !== "sessao-atual" && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                callUsersApi({
                                  action: "terminate_session",
                                  sessionId: s.id,
                                })
                              }
                              className="rounded-full bg-[#2A2A2A] px-3 py-1 text-[11px] text-[#C8B560]"
                            >
                              Encerrar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Historico de Acessos */}
                <div className="border-t border-[#5C5C5C]/25 pt-4 space-y-2">
                  <div className="text-xs font-medium text-[#F0EDE6]/70">
                    Historico recente de acessos e auditoria
                  </div>
                  {accessLogs.map((log) => (
                    <div
                      key={log.id}
                      className="apple-subcard flex items-center justify-between px-4 py-2.5 text-xs"
                    >
                      <span className="text-[#F0EDE6]/80">{log.description}</span>
                      <span className="font-mono text-[11px] text-[#F0EDE6]/45">
                        {new Date(log.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "aparencia" && (
              <div className="space-y-4">
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  6. Aparencia, Tema e Acessibilidade
                </h2>
                <div className="space-y-2">
                  <span className="text-xs text-[#F0EDE6]/65">
                    Tema (identidade ThLoop 5 cores)
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "dark" as const, label: "Escuro" },
                      { id: "light" as const, label: "Claro" },
                      { id: "auto" as const, label: "Automatico" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAppearance((a) => ({ ...a, theme: t.id }))}
                        className={`rounded-2xl py-2.5 text-xs transition ${
                          appearance.theme === t.id
                            ? "bg-[#C8B560] font-semibold text-[#0A0A0A]"
                            : "bg-[#2A2A2A]/60 text-[#F0EDE6]/75"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs text-[#F0EDE6]/65">Idioma da interface</span>
                  <select
                    value={appearance.language}
                    onChange={(e) =>
                      setAppearance((a) => ({
                        ...a,
                        language: e.target.value as "pt-BR" | "en-US" | "es-ES",
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="pt-BR">Portugues (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Espanol</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {renderToggle(
                    appearance.high_contrast,
                    (v) => setAppearance((a) => ({ ...a, high_contrast: v })),
                    "Alto contraste nas bordas",
                    "Realca contornos em ThLoop Gold para leitura nitida."
                  )}
                  {renderToggle(
                    appearance.compact_mode,
                    (v) => setAppearance((a) => ({ ...a, compact_mode: v })),
                    "Modo compacto",
                    "Reduz preenchimento dos cartoes para visualizar mais itens."
                  )}
                  {renderToggle(
                    appearance.reduced_motion,
                    (v) => setAppearance((a) => ({ ...a, reduced_motion: v })),
                    "Reduzir animacoes",
                    "Desativa transicoes de entrada entre visoes."
                  )}
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    callUsersApi({
                      action: "update_settings",
                      section: "aparencia",
                      payload: appearance,
                    })
                  }
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  Aplicar e salvar aparencia
                </button>
              </div>
            )}

            {section === "preferencias_estudo" && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  callUsersApi({
                    action: "update_settings",
                    section: "preferencias_estudo",
                    payload: {
                      favorite_subjects: favoriteSubjectsText
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                      learning_targets: learningTargets,
                      study_frequency: studyFrequency,
                      daily_minutes_goal: dailyMinutesGoal,
                      copilot_intensity: copilotIntensity,
                    },
                  });
                }}
                className="space-y-4"
              >
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  7. Preferencias de Estudo e Copiloto
                </h2>
                <input
                  type="text"
                  value={favoriteSubjectsText}
                  onChange={(e) => setFavoriteSubjectsText(e.target.value)}
                  placeholder="Disciplinas favoritas (separadas por virgula)"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={learningTargets}
                  onChange={(e) => setLearningTargets(e.target.value)}
                  placeholder="Metas pessoais de aprendizagem"
                  className={inputClass}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <select
                    value={studyFrequency}
                    onChange={(e) =>
                      setStudyFrequency(
                        e.target.value as
                          | "diaria"
                          | "alternada"
                          | "semanal"
                          | "intensiva"
                      )
                    }
                    className={inputClass}
                  >
                    <option value="diaria">Frequencia: Diaria</option>
                    <option value="alternada">Frequencia: Dias alternados</option>
                    <option value="semanal">Frequencia: Semanal</option>
                    <option value="intensiva">Frequencia: Pre-prova intensiva</option>
                  </select>
                  <input
                    type="number"
                    min={10}
                    max={480}
                    value={dailyMinutesGoal}
                    onChange={(e) => setDailyMinutesGoal(Number(e.target.value))}
                    placeholder="Meta diaria (min)"
                    className={inputClass}
                  />
                  <select
                    value={copilotIntensity}
                    onChange={(e) =>
                      setCopilotIntensity(
                        e.target.value as "rigorosa" | "equilibrada" | "guiada"
                      )
                    }
                    className={inputClass}
                  >
                    <option value="rigorosa">Copiloto: Rigoroso</option>
                    <option value="equilibrada">Copiloto: Equilibrado</option>
                    <option value="guiada">Copiloto: Guiado</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-[#C8B560] px-6 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                >
                  Salvar preferencias de estudo
                </button>
              </form>
            )}

            {section === "lgpd" && (
              <div className="space-y-5">
                <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                  Governanca, LGPD e Exclusao de Conta
                </h2>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                  <div className="apple-subcard p-4">
                    <div className="text-[#F0EDE6]/50">Data de cadastro</div>
                    <div className="mt-1 font-mono text-[#F0EDE6]">
                      {new Date(currentUser.created_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="apple-subcard p-4">
                    <div className="text-[#F0EDE6]/50">Ultima atualizacao</div>
                    <div className="mt-1 font-mono text-[#F0EDE6]">
                      {new Date(currentUser.updated_at).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="apple-subcard p-4">
                    <div className="text-[#F0EDE6]/50">Termos & Privacidade</div>
                    <div className="mt-1 font-mono text-[#C8B560]">
                      {currentUser.terms_accepted && currentUser.privacy_accepted
                        ? "Aceitos (Art. 7 LGPD)"
                        : "Pendente"}
                    </div>
                  </div>
                </div>

                <div className="apple-subcard flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-sm font-medium text-[#F0EDE6]">
                      Exportar todos os meus dados pessoais (JSON)
                    </div>
                    <p className="mt-1 text-xs text-[#F0EDE6]/60">
                      Inclui cadastro, turmas, anotacoes do caderno, selos de autoria e historico de logs.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleExportLgpd}
                    className="flex shrink-0 items-center gap-2 rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A]"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.8} />
                    <span>Exportar dados</span>
                  </button>
                </div>

                <div className="apple-subcard space-y-3 p-5 ring-1 ring-[#5C5C5C]/50">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8B560]">
                    <Trash2 className="h-4 w-4" strokeWidth={1.7} />
                    <span>Excluir conta permanentemente</span>
                  </div>
                  <p className="text-xs text-[#F0EDE6]/65">
                    A conta passa para estado excluido e anonimizado em conformidade com a LGPD. Digite <strong>EXCLUIR</strong> para confirmar.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="Digite EXCLUIR"
                      className={`${inputClass} sm:w-56`}
                    />
                    <button
                      type="button"
                      disabled={busy || deleteConfirm.trim().toUpperCase() !== "EXCLUIR"}
                      onClick={() =>
                        callUsersApi({
                          action: "delete_account",
                          targetUserId: currentUser.id,
                          confirmation: deleteConfirm,
                        })
                      }
                      className="rounded-full bg-[#2A2A2A] px-5 py-2.5 text-xs font-semibold text-[#F0EDE6] hover:bg-[#C8B560] hover:text-[#0A0A0A] disabled:opacity-40"
                    >
                      Confirmar exclusao de conta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {section === "admin_rbac" && currentUser.role === "administrador" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-[#F0EDE6]">
                    Controle Administrativo de Contas e RBAC
                  </h2>
                  <span className="font-mono text-xs text-[#C8B560]">
                    {adminUsers.length} contas registradas
                  </span>
                </div>

                <div className="space-y-2.5">
                  {adminUsers.map((u) => (
                    <div
                      key={u.id}
                      className="apple-subcard flex flex-col justify-between gap-3 p-4 text-xs md:flex-row md:items-center"
                    >
                      <div>
                        <div className="font-semibold text-[#F0EDE6]">
                          {u.full_name}{" "}
                          <span className="font-mono text-[11px] text-[#C8B560]">
                            ({u.identification_code})
                          </span>
                        </div>
                        <div className="text-[11px] text-[#F0EDE6]/55">
                          {u.email} · @{u.username}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          aria-label={`Papel de ${u.full_name}`}
                          value={u.role}
                          onChange={(e) =>
                            callUsersApi({
                              action: "admin_update_account",
                              targetUserId: u.id,
                              role: e.target.value as UserRole,
                            })
                          }
                          className="rounded-xl bg-[#0A0A0A] px-3 py-1.5 text-xs text-[#F0EDE6] ring-1 ring-[#5C5C5C]/40"
                        >
                          <option value="aluno">Aluno</option>
                          <option value="professor">Professor</option>
                          <option value="administrador">Administrador</option>
                        </select>

                        <select
                          aria-label={`Status de ${u.full_name}`}
                          value={u.account_status}
                          onChange={(e) =>
                            callUsersApi({
                              action: "admin_update_account",
                              targetUserId: u.id,
                              account_status: e.target.value as AccountStatus,
                            })
                          }
                          className="rounded-xl bg-[#0A0A0A] px-3 py-1.5 text-xs text-[#C8B560] ring-1 ring-[#5C5C5C]/40"
                        >
                          <option value="ativa">Ativa</option>
                          <option value="pendente_verificacao">Pendente verificacao</option>
                          <option value="suspensa">Suspensa</option>
                          <option value="bloqueada">Bloqueada</option>
                          <option value="excluida">Excluida</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
