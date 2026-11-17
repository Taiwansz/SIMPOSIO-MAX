"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  KeyRound,
  LogIn,
  MailCheck,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import { formatPhoneBR, SHIFT_OPTIONS } from "@/lib/veritas-engine/identity-rbac";
import { ShiftType, UserRole } from "@/lib/veritas-engine/types";

export interface DemoAccountSummary {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  identification_code: string;
}

interface AuthGatewayModalProps {
  open: boolean;
  initialMode?: "login" | "register" | "recover" | "verify";
  demoAccounts: DemoAccountSummary[];
  onClose: () => void;
  onAuthenticated: () => Promise<void> | void;
}

export default function AuthGatewayModal({
  open,
  initialMode = "login",
  demoAccounts,
  onClose,
  onAuthenticated,
}: AuthGatewayModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "recover" | "verify">(
    initialMode
  );
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Login
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Verify Email
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("VER-2026");

  // Recover Password
  const [recoverId, setRecoverId] = useState("");
  const [recoverStep, setRecoverStep] = useState<"request" | "confirm">("request");
  const [recoverCode, setRecoverCode] = useState("");
  const [recoverNewPassword, setRecoverNewPassword] = useState("");
  const [recoverConfirmPassword, setRecoverConfirmPassword] = useState("");

  // Registration
  const [role, setRole] = useState<UserRole>("aluno");
  const [fullName, setFullName] = useState("");
  const [socialName, setSocialName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [birthDate, setBirthDate] = useState("2004-02-15");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [stateUf, setStateUf] = useState("SP");
  const [city, setCity] = useState("Indaiatuba");
  const [address, setAddress] = useState("");
  const [institution, setInstitution] = useState(
    "Centro Universitario Max Planck (UniMAX)"
  );
  const [bio, setBio] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [privacyAccepted, setPrivacyAccepted] = useState(true);

  // Aluno fields
  const [educationLevel, setEducationLevel] = useState("Ensino Superior");
  const [gradeYear, setGradeYear] = useState("4o Semestre");
  const [cohortLabel, setCohortLabel] = useState("CC-2026N");
  const [shift, setShift] = useState<ShiftType>("Noturno");
  const [course, setCourse] = useState("Ciencia da Computacao");
  const [subjectsInterest, setSubjectsInterest] = useState(
    "Sistemas Operacionais, Inteligencia Artificial"
  );
  const [learningGoals, setLearningGoals] = useState("");
  const [academicInterests, setAcademicInterests] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [advisorTeacher, setAdvisorTeacher] = useState("Profa. Helena Martins");
  const [inviteClassCode, setInviteClassCode] = useState("CC-SO-2026N");

  // Professor fields
  const [academicDegree, setAcademicDegree] = useState("Mestrado em Computacao");
  const [specialization, setSpecialization] = useState("Sistemas e IA");
  const [subjectsTaught, setSubjectsTaught] = useState(
    "Inteligencia Artificial, Arquitetura de Software"
  );
  const [profExperience, setProfExperience] = useState("");
  const [profRegistry, setProfRegistry] = useState("");
  const [linkedClasses, setLinkedClasses] = useState("");
  const [validationCode, setValidationCode] = useState("UNIMAX-DOC-2026");
  const [availability, setAvailability] = useState("Seg a Qui - 19h00 as 22h30");

  // Admin fields
  const [adminEmail, setAdminEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("Coordenador Academico");
  const [department, setDepartment] = useState("Diretoria de Ensino");
  const [accessLevel, setAccessLevel] = useState<
    "super_admin" | "gestor_academico" | "auditor"
  >("gestor_academico");

  if (!open) return null;

  const resetMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          identifier: loginId,
          password: loginPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Nao foi possivel autenticar.");
        if (json.requiresVerification && json.email) {
          setVerifyEmail(json.email);
          setMode("verify");
        }
        return;
      }
      await onAuthenticated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSwitch = async (userId: string) => {
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          quickSwitchUserId: userId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Erro ao trocar perfil.");
        return;
      }
      await onAuthenticated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          role,
          full_name: fullName,
          social_name: socialName,
          avatar_url: avatarUrl,
          birth_date: birthDate,
          email,
          phone,
          username,
          password,
          confirm_password: confirmPassword,
          country,
          state: stateUf,
          city,
          address,
          institution,
          bio,
          terms_accepted: termsAccepted,
          privacy_accepted: privacyAccepted,
          invite_class_code: role === "aluno" ? inviteClassCode : "",
          student_profile:
            role === "aluno"
              ? {
                  education_level: educationLevel,
                  grade_year: gradeYear,
                  cohort_label: cohortLabel,
                  shift,
                  course,
                  subjects_of_interest: subjectsInterest
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  learning_goals: learningGoals,
                  academic_interests: academicInterests,
                  registration_code: registrationCode,
                  advisor_teacher: advisorTeacher,
                }
              : undefined,
          teacher_profile:
            role === "professor"
              ? {
                  academic_degree: academicDegree,
                  specialization,
                  subjects_taught: subjectsTaught
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  professional_experience: profExperience,
                  professional_registry: profRegistry,
                  linked_classes: linkedClasses
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  institutional_validation_code: validationCode,
                  availability,
                }
              : undefined,
          admin_profile:
            role === "administrador"
              ? {
                  institutional_email: adminEmail || email,
                  job_title: jobTitle,
                  department,
                  access_level: accessLevel,
                  admin_permissions: [
                    "gerenciar_usuarios",
                    "gerenciar_turmas",
                    "exportar_relatorios",
                    ...(accessLevel === "super_admin"
                      ? ["auditar_rbac", "governanca_lgpd", "moderar_contas"]
                      : []),
                  ],
                }
              : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Revise os dados informados.");
        if (json.errors) setFieldErrors(json.errors);
        return;
      }
      setVerifyEmail(email.trim().toLowerCase());
      setVerifyCode(json.verificationCodeHint || "VER-2026");
      setSuccessMsg(json.message);
      setMode("verify");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_email",
          email: verifyEmail,
          code: verifyCode,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Falha na verificacao.");
        return;
      }
      await onAuthenticated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "recover_password",
          step: recoverStep,
          identifier: recoverId,
          code: recoverCode,
          newPassword: recoverNewPassword,
          confirmPassword: recoverConfirmPassword,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || "Erro ao recuperar senha.");
        return;
      }
      if (recoverStep === "request") {
        setRecoverCode(json.recoveryCodeHint || "REC-2026");
        setRecoverStep("confirm");
        setSuccessMsg(json.message);
      } else {
        setSuccessMsg(json.message);
        setRecoverStep("request");
        setMode("login");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-[#0A0A0A] px-3.5 py-2.5 text-xs text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Autenticacao e Cadastro VERITAS"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/80 p-4 backdrop-blur-md"
    >
      <div className="apple-shell w-full max-w-2xl max-h-[90dvh] overflow-y-auto">
        <div className="apple-card space-y-5 p-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#5C5C5C]/25 pb-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#C8B560]">
                Acesso & Identidade // LGPD
              </span>
              <h2 className="mt-1 font-display text-xl font-semibold text-[#F0EDE6]">
                Conta VERITAS
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela de autenticacao"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]/75 hover:text-[#F0EDE6]"
            >
              <X className="h-4 w-4" strokeWidth={1.7} />
            </button>
          </div>

          {/* Abas de Autenticacao */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "login", label: "Entrar", icon: LogIn },
              { id: "register", label: "Criar Conta", icon: UserPlus },
              { id: "verify", label: "Verificar E-mail", icon: MailCheck },
              { id: "recover", label: "Recuperar Senha", icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode(tab.id as typeof mode);
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs transition ${
                    active
                      ? "bg-[#F0EDE6] font-semibold text-[#0A0A0A]"
                      : "bg-[#2A2A2A]/60 text-[#F0EDE6]/75 hover:bg-[#2A2A2A]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {errorMsg && (
            <div className="rounded-2xl border border-[#C8B560]/60 bg-[#2A2A2A]/80 px-4 py-3 text-xs text-[#F0EDE6]">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-2xl border border-[#C8B560] bg-[#C8B560]/12 px-4 py-3 text-xs text-[#F0EDE6]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.8} />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === "login" && (
            <div className="space-y-5">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#F0EDE6]/65">
                    E-mail ou nome de usuario
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="matheus.santos@unimax.edu.br ou matheus.santos"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs text-[#F0EDE6]/65">Senha</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Senha (contas iniciais: Veritas@2026)"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#C8B560] py-3 text-xs font-semibold text-[#0A0A0A] transition hover:bg-[#F0EDE6] disabled:opacity-50"
                >
                  {loading ? "Validando..." : "Entrar na plataforma"}
                </button>
              </form>

              <div className="border-t border-[#5C5C5C]/25 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#F0EDE6]/55">
                  <Shield className="h-3.5 w-3.5 text-[#C8B560]" strokeWidth={1.6} />
                  <span>Troca rapida de perfil (demonstracao UniMAX):</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handleQuickSwitch(acc.id)}
                      className="apple-subcard flex items-center justify-between p-3 text-left transition hover:ring-1 hover:ring-[#C8B560]"
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#F0EDE6]">
                          {acc.full_name}
                        </div>
                        <div className="text-[11px] text-[#F0EDE6]/55">
                          {acc.role.toUpperCase()} · {acc.identification_code}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#C8B560]">
                        Entrar
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Barra de Etapa Limpa */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: 1 as const, label: "1. Acesso & Gerais" },
                  { n: 2 as const, label: "2. Local & Instituicao" },
                  { n: 3 as const, label: "3. Perfil & LGPD" },
                ].map((s) => (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => setRegStep(s.n)}
                    className={`rounded-2xl py-2 text-[11px] font-medium transition ${
                      regStep === s.n
                        ? "bg-[#C8B560] text-[#0A0A0A]"
                        : "bg-[#2A2A2A]/60 text-[#F0EDE6]/65"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {regStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs text-[#F0EDE6]/65">
                      Tipo de usuario
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["aluno", "professor", "administrador"] as UserRole[]).map(
                        (r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`rounded-2xl py-2.5 text-xs capitalize transition ${
                              role === r
                                ? "bg-[#F0EDE6] font-semibold text-[#0A0A0A]"
                                : "bg-[#2A2A2A]/65 text-[#F0EDE6]/75"
                            }`}
                          >
                            {r}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nome completo *"
                        className={inputClass}
                      />
                      {fieldErrors.full_name && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.full_name}
                        </p>
                      )}
                    </div>
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
                      placeholder="URL da foto / avatar (opcional)"
                      className={inputClass}
                    />
                    <div>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className={inputClass}
                      />
                      {fieldErrors.birth_date && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.birth_date}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-mail *"
                        className={inputClass}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                        placeholder="(19) 99999-9999 *"
                        className={inputClass}
                      />
                      {fieldErrors.phone && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nome de usuario *"
                        className={inputClass}
                      />
                      {fieldErrors.username && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.username}
                        </p>
                      )}
                    </div>
                    <div />
                    <div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha (minimo 6) *"
                        className={inputClass}
                      />
                      {fieldErrors.password && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar senha *"
                        className={inputClass}
                      />
                      {fieldErrors.confirm_password && (
                        <p className="mt-1 text-[11px] text-[#C8B560]">
                          {fieldErrors.confirm_password}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRegStep(2)}
                    className="w-full rounded-full bg-[#2A2A2A] py-2.5 text-xs font-medium text-[#F0EDE6] hover:bg-[#C8B560] hover:text-[#0A0A0A]"
                  >
                    Avancar para Localizacao e Instituicao
                  </button>
                </div>
              )}

              {regStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="Pais *"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      required
                      value={stateUf}
                      onChange={(e) => setStateUf(e.target.value)}
                      placeholder="Estado *"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade *"
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Endereco completo (opcional)"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Instituicao de ensino *"
                    className={inputClass}
                  />
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Biografia ou apresentacao breve"
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-1/3 rounded-full bg-[#2A2A2A] py-2.5 text-xs text-[#F0EDE6]/75"
                    >
                      Voltar
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegStep(3)}
                      className="w-2/3 rounded-full bg-[#C8B560] py-2.5 text-xs font-semibold text-[#0A0A0A]"
                    >
                      Avancar para Dados de {role}
                    </button>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div className="space-y-3">
                  {role === "aluno" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        placeholder="Nivel de escolaridade *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={gradeYear}
                        onChange={(e) => setGradeYear(e.target.value)}
                        placeholder="Serie / Semestre *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={cohortLabel}
                        onChange={(e) => setCohortLabel(e.target.value)}
                        placeholder="Turma de origem"
                        className={inputClass}
                      />
                      <select
                        value={shift}
                        onChange={(e) => setShift(e.target.value as ShiftType)}
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
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="Curso *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={registrationCode}
                        onChange={(e) => setRegistrationCode(e.target.value)}
                        placeholder="Codigo de matricula (RA) *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={advisorTeacher}
                        onChange={(e) => setAdvisorTeacher(e.target.value)}
                        placeholder="Professor responsavel"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={inviteClassCode}
                        onChange={(e) => setInviteClassCode(e.target.value)}
                        placeholder="Codigo de convite da turma (opcional)"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={subjectsInterest}
                        onChange={(e) => setSubjectsInterest(e.target.value)}
                        placeholder="Materias de interesse (virgula)"
                        className={`${inputClass} sm:col-span-2`}
                      />
                      <input
                        type="text"
                        value={learningGoals}
                        onChange={(e) => setLearningGoals(e.target.value)}
                        placeholder="Objetivos de aprendizagem"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={academicInterests}
                        onChange={(e) => setAcademicInterests(e.target.value)}
                        placeholder="Interesses academicos"
                        className={inputClass}
                      />
                    </div>
                  )}

                  {role === "professor" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={academicDegree}
                        onChange={(e) => setAcademicDegree(e.target.value)}
                        placeholder="Formacao academica *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Especializacao *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={subjectsTaught}
                        onChange={(e) => setSubjectsTaught(e.target.value)}
                        placeholder="Disciplinas que leciona (virgula) *"
                        className={`${inputClass} sm:col-span-2`}
                      />
                      <input
                        type="text"
                        value={profRegistry}
                        onChange={(e) => setProfRegistry(e.target.value)}
                        placeholder="Registro profissional"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={validationCode}
                        onChange={(e) => setValidationCode(e.target.value)}
                        placeholder="Codigo de validacao institucional *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={linkedClasses}
                        onChange={(e) => setLinkedClasses(e.target.value)}
                        placeholder="Turmas vinculadas (codigos)"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder="Disponibilidade de atendimento"
                        className={inputClass}
                      />
                      <textarea
                        rows={2}
                        value={profExperience}
                        onChange={(e) => setProfExperience(e.target.value)}
                        placeholder="Experiencia profissional"
                        className={`${inputClass} sm:col-span-2`}
                      />
                    </div>
                  )}

                  {role === "administrador" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="E-mail institucional *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Cargo *"
                        className={inputClass}
                      />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Departamento *"
                        className={inputClass}
                      />
                      <select
                        value={accessLevel}
                        onChange={(e) =>
                          setAccessLevel(
                            e.target.value as
                              | "super_admin"
                              | "gestor_academico"
                              | "auditor"
                          )
                        }
                        className={inputClass}
                      >
                        <option value="super_admin">Nivel: Super Admin</option>
                        <option value="gestor_academico">
                          Nivel: Gestor Academico
                        </option>
                        <option value="auditor">Nivel: Auditor LGPD/RBAC</option>
                      </select>
                    </div>
                  )}

                  <div className="apple-subcard space-y-2 p-3.5 text-xs">
                    <label className="flex items-center gap-2 text-[#F0EDE6]/80">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="accent-[#C8B560]"
                      />
                      <span>Li e aceito os Termos de Uso academicos do VERITAS.</span>
                    </label>
                    <label className="flex items-center gap-2 text-[#F0EDE6]/80">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        className="accent-[#C8B560]"
                      />
                      <span>
                        Concordo com a Politica de Privacidade e tratamento de dados (LGPD).
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(2)}
                      className="w-1/3 rounded-full bg-[#2A2A2A] py-3 text-xs text-[#F0EDE6]/75"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 rounded-full bg-[#C8B560] py-3 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F0EDE6] disabled:opacity-50"
                    >
                      {loading ? "Cadastrando..." : "Concluir Cadastro"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {mode === "verify" && (
            <form onSubmit={handleVerifyEmail} className="space-y-3">
              <p className="text-xs leading-relaxed text-[#F0EDE6]/70">
                Contas novas iniciam com status pendente de verificacao. Confirme seu e-mail institucional para ativar o acesso completo.
              </p>
              <input
                type="email"
                required
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                placeholder="E-mail cadastrado"
                className={inputClass}
              />
              <input
                type="text"
                required
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Codigo de verificacao (padrao teste: VER-2026)"
                className={inputClass}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#C8B560] py-3 text-xs font-semibold text-[#0A0A0A]"
              >
                {loading ? "Confirmando..." : "Verificar E-mail e Entrar"}
              </button>
            </form>
          )}

          {mode === "recover" && (
            <form onSubmit={handleRecover} className="space-y-3">
              <input
                type="text"
                required
                value={recoverId}
                onChange={(e) => setRecoverId(e.target.value)}
                placeholder="E-mail ou nome de usuario"
                className={inputClass}
              />
              {recoverStep === "confirm" && (
                <>
                  <input
                    type="text"
                    required
                    value={recoverCode}
                    onChange={(e) => setRecoverCode(e.target.value)}
                    placeholder="Codigo (REC-2026)"
                    className={inputClass}
                  />
                  <input
                    type="password"
                    required
                    value={recoverNewPassword}
                    onChange={(e) => setRecoverNewPassword(e.target.value)}
                    placeholder="Nova senha (minimo 6 caracteres)"
                    className={inputClass}
                  />
                  <input
                    type="password"
                    required
                    value={recoverConfirmPassword}
                    onChange={(e) => setRecoverConfirmPassword(e.target.value)}
                    placeholder="Confirmar nova senha"
                    className={inputClass}
                  />
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#C8B560] py-3 text-xs font-semibold text-[#0A0A0A]"
              >
                {loading
                  ? "Processando..."
                  : recoverStep === "request"
                  ? "Enviar codigo de recuperacao"
                  : "Redefinir senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
