"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  Award,
  BookOpen,
  Building2,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  computeUserPlatformStats,
  ProjectedUserProfile,
} from "@/lib/veritas-engine/identity-rbac";
import {
  ArenaResponse,
  AuthorshipProof,
  AutopsyLog,
  StudyNote,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasUser,
} from "@/lib/veritas-engine/types";

interface UserProfileViewProps {
  currentUser: VeritasUser | null;
  directoryProfiles: ProjectedUserProfile[];
  classes: VeritasClass[];
  enrollments: VeritasEnrollment[];
  notes: StudyNote[];
  autopsyLogs: AutopsyLog[];
  proofs: AuthorshipProof[];
  arenaResponses: ArenaResponse[];
  activityLogs: VeritasActivityLog[];
  onGoToSettings: () => void;
}

export default function UserProfileView({
  currentUser,
  directoryProfiles,
  classes,
  enrollments,
  notes,
  autopsyLogs,
  proofs,
  arenaResponses,
  activityLogs,
  onGoToSettings,
}: UserProfileViewProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUser?.id ?? directoryProfiles[0]?.id ?? ""
  );

  const profile = useMemo(() => {
    return (
      directoryProfiles.find((u) => u.id === selectedUserId) ??
      directoryProfiles.find((u) => u.id === currentUser?.id) ??
      directoryProfiles[0] ??
      null
    );
  }, [directoryProfiles, selectedUserId, currentUser]);

  const userClasses = useMemo(() => {
    if (!profile) return [];
    if (profile.role === "professor") {
      return classes.filter((c) => c.responsible_teacher_id === profile.id);
    }
    const enrolledIds = new Set(
      enrollments
        .filter((e) => e.student_id === profile.id && e.membership_status === "aprovado")
        .map((e) => e.class_id)
    );
    return classes.filter((c) => enrolledIds.has(c.id));
  }, [profile, classes, enrollments]);

  const stats = useMemo(() => {
    if (!profile) return null;
    const pseudoUser: VeritasUser = {
      ...(currentUser && currentUser.id === profile.id
        ? currentUser
        : {
            id: profile.id,
            role: profile.role,
            account_status: profile.account_status,
            email_verified: profile.email_verified,
            terms_accepted: true,
            privacy_accepted: true,
            full_name: profile.full_name,
            social_name: profile.social_name,
            avatar_url: profile.avatar_url,
            birth_date: profile.birth_date || "",
            email: profile.email || "",
            phone: profile.phone || "",
            username: profile.username,
            country: profile.country,
            state: profile.state,
            city: profile.city,
            address: profile.address || "",
            institution: profile.institution,
            bio: profile.bio,
            identification_code: profile.identification_code,
            student_profile: profile.student_profile || {
              education_level: "",
              grade_year: "",
              cohort_label: "",
              shift: "Noturno",
              course: "",
              subjects_of_interest: [],
              learning_goals: "",
              academic_interests: "",
              registration_code: "",
              advisor_teacher: "",
            },
            teacher_profile: profile.teacher_profile || {
              academic_degree: "",
              specialization: "",
              subjects_taught: [],
              professional_experience: "",
              professional_registry: "",
              linked_classes: [],
              institutional_validation_code: "",
              availability: "",
            },
            admin_profile: profile.admin_profile || {
              institutional_email: "",
              job_title: "",
              department: "",
              access_level: "auditor",
              admin_permissions: [],
            },
            privacy_settings: profile.privacy_settings,
            notification_settings: {
              new_activities: true,
              messages: true,
              class_invites: true,
              class_updates: true,
              teacher_notices: true,
              platform_updates: true,
            },
            security_settings: {
              two_factor_enabled: false,
              two_factor_method: "app_ou_email",
              last_password_change: "",
            },
            appearance_settings: {
              theme: "dark",
              language: "pt-BR",
              high_contrast: false,
              compact_mode: false,
              reduced_motion: false,
            },
            study_preferences: {
              favorite_subjects: [],
              learning_targets: "",
              study_frequency: "diaria",
              daily_minutes_goal: 45,
              copilot_intensity: "equilibrada",
            },
            created_at: profile.created_at,
            updated_at: profile.created_at,
          }),
    };
    return computeUserPlatformStats({
      user: pseudoUser,
      notes,
      autopsyLogs,
      proofs,
      arenaResponses,
      enrollments,
      classes,
    });
  }, [
    profile,
    currentUser,
    notes,
    autopsyLogs,
    proofs,
    arenaResponses,
    enrollments,
    classes,
  ]);

  const userLogs = useMemo(() => {
    if (!profile) return [];
    return activityLogs.filter((l) => l.user_id === profile.id).slice(0, 6);
  }, [profile, activityLogs]);

  if (!profile) {
    return (
      <div className="apple-shell">
        <div className="apple-card p-6 text-xs text-[#F0EDE6]/60">
          Nenhum perfil disponivel para exibicao.
        </div>
      </div>
    );
  }

  const isSelf = currentUser?.id === profile.id;
  const initials = (profile.social_name || profile.full_name)
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[#F0EDE6]">
            Perfil Academico
          </h1>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Dados pessoais, turmas, estatisticas reais e controle de privacidade por papel.
          </p>
        </div>

        {/* Seletor para visualizar o proprio perfil ou testar privacidade entre contas */}
        <div className="flex flex-wrap gap-2">
          {directoryProfiles.map((u) => {
            const active = u.id === profile.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => setSelectedUserId(u.id)}
                className={`rounded-2xl px-3.5 py-2 text-xs transition ${
                  active
                    ? "bg-[#F0EDE6] font-semibold text-[#0A0A0A]"
                    : "bg-[#2A2A2A]/60 text-[#F0EDE6]/70 hover:bg-[#2A2A2A]"
                }`}
              >
                {u.social_name || u.full_name.split(" ")[0]} ({u.role})
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabecalho do Perfil */}
      <div className="apple-shell">
        <div className="apple-card space-y-6 p-6">
          <div className="flex flex-col justify-between gap-5 border-b border-[#5C5C5C]/25 pb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="h-16 w-16 rounded-2xl object-cover ring-1 ring-[#C8B560]/50"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2A2A2A] font-display text-xl font-bold text-[#C8B560] ring-1 ring-[#C8B560]/35">
                  {initials}
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[#C8B560]">
                  <span className="uppercase">{profile.role}</span>
                  <span>·</span>
                  <span>{profile.identification_code}</span>
                  <span>·</span>
                  <span className="uppercase">{profile.account_status}</span>
                </div>
                <h2 className="mt-1 font-display text-2xl font-semibold text-[#F0EDE6]">
                  {profile.social_name || profile.full_name}
                </h2>
                <div className="text-xs text-[#F0EDE6]/55">
                  @{profile.username}
                  {profile.social_name ? ` · Civil: ${profile.full_name}` : ""}
                </div>
              </div>
            </div>

            {isSelf && (
              <button
                type="button"
                onClick={onGoToSettings}
                className="flex w-fit items-center gap-2 rounded-full bg-[#C8B560] px-5 py-2.5 text-xs font-semibold text-[#0A0A0A] hover:bg-[#F0EDE6]"
              >
                <Settings className="h-3.5 w-3.5" strokeWidth={1.8} />
                <span>Editar perfil e privacidade</span>
              </button>
            )}
          </div>

          {profile.isRedacted && (
            <div className="apple-subcard flex items-center gap-3 p-4 ring-1 ring-[#C8B560]/35">
              <Lock className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.7} />
              <span className="text-xs text-[#F0EDE6]/80">{profile.redactionReason}</span>
            </div>
          )}

          <p className="text-sm leading-relaxed text-[#F0EDE6]/80">{profile.bio}</p>

          {/* Informacoes Publicas vs Privadas conforme permissoes */}
          <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
            <div className="apple-subcard flex items-center gap-2.5 p-3.5">
              <Building2 className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.6} />
              <span className="text-[#F0EDE6]/85">{profile.institution}</span>
            </div>
            <div className="apple-subcard flex items-center gap-2.5 p-3.5">
              <MapPin className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.6} />
              <span className="text-[#F0EDE6]/85">
                {profile.city}, {profile.state} · {profile.country}
              </span>
            </div>
            <div className="apple-subcard flex items-center gap-2.5 p-3.5">
              {profile.email ? (
                <>
                  <Mail className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.6} />
                  <span className="truncate text-[#F0EDE6]/85">{profile.email}</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 shrink-0 text-[#5C5C5C]" strokeWidth={1.6} />
                  <span className="text-[#F0EDE6]/50">E-mail oculto por privacidade</span>
                </>
              )}
            </div>
            <div className="apple-subcard flex items-center gap-2.5 p-3.5">
              {profile.phone ? (
                <>
                  <Phone className="h-4 w-4 shrink-0 text-[#C8B560]" strokeWidth={1.6} />
                  <span className="text-[#F0EDE6]/85">{profile.phone}</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 shrink-0 text-[#5C5C5C]" strokeWidth={1.6} />
                  <span className="text-[#F0EDE6]/50">Telefone privado</span>
                </>
              )}
            </div>
          </div>

          {/* Dados Especificos por Perfil */}
          {!profile.isRedacted && profile.student_profile && (
            <div className="apple-subcard space-y-2 p-4 text-xs">
              <div className="font-mono text-[11px] uppercase text-[#C8B560]">
                Trilha Discente
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <div>
                  <span className="text-[#F0EDE6]/50">Curso: </span>
                  <span className="text-[#F0EDE6]">{profile.student_profile.course}</span>
                </div>
                <div>
                  <span className="text-[#F0EDE6]/50">Nivel: </span>
                  <span className="text-[#F0EDE6]">
                    {profile.student_profile.education_level} ·{" "}
                    {profile.student_profile.grade_year}
                  </span>
                </div>
                <div>
                  <span className="text-[#F0EDE6]/50">Orientacao: </span>
                  <span className="text-[#F0EDE6]">
                    {profile.student_profile.advisor_teacher}
                  </span>
                </div>
              </div>
              {profile.student_profile.learning_goals && (
                <p className="text-[#F0EDE6]/70">
                  Objetivo: {profile.student_profile.learning_goals}
                </p>
              )}
            </div>
          )}

          {!profile.isRedacted && profile.teacher_profile && (
            <div className="apple-subcard space-y-2 p-4 text-xs">
              <div className="font-mono text-[11px] uppercase text-[#C8B560]">
                Credencial Docente
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-[#F0EDE6]/50">Formacao: </span>
                  <span className="text-[#F0EDE6]">
                    {profile.teacher_profile.academic_degree}
                  </span>
                </div>
                <div>
                  <span className="text-[#F0EDE6]/50">Disponibilidade: </span>
                  <span className="text-[#F0EDE6]">
                    {profile.teacher_profile.availability}
                  </span>
                </div>
              </div>
              <p className="text-[#F0EDE6]/70">
                Disciplinas:{" "}
                {profile.teacher_profile.subjects_taught.join(", ") || "Nenhuma listada"}
              </p>
            </div>
          )}

          {!profile.isRedacted && profile.admin_profile && (
            <div className="apple-subcard space-y-2 p-4 text-xs">
              <div className="font-mono text-[11px] uppercase text-[#C8B560]">
                Governanca Institucional
              </div>
              <div>
                <span className="text-[#F0EDE6]/50">Cargo e Departamento: </span>
                <span className="text-[#F0EDE6]">
                  {profile.admin_profile.job_title} · {profile.admin_profile.department}
                </span>
              </div>
              <div className="text-[#F0EDE6]/70">
                Nivel: {profile.admin_profile.access_level}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estatisticas de Utilizacao & Turmas + Atividades */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="apple-shell lg:col-span-5">
          <div className="apple-card space-y-4 p-6">
            <div className="flex items-center gap-2 text-xs font-medium text-[#C8B560]">
              <Award className="h-4 w-4" strokeWidth={1.7} />
              <span>Estatisticas na plataforma</span>
            </div>

            {!profile.show_stats || !stats ? (
              <p className="text-xs text-[#F0EDE6]/55">
                Estatisticas ocultas pelas preferencias de privacidade.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="apple-subcard p-3.5">
                  <div className="font-mono text-2xl font-semibold text-[#C8B560] tabular-nums">
                    {stats.notesCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Anotacoes no caderno</div>
                </div>
                <div className="apple-subcard p-3.5">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6] tabular-nums">
                    {stats.proofsPassedCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Selos de autoria 60s</div>
                </div>
                <div className="apple-subcard p-3.5">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6] tabular-nums">
                    {stats.autopsiesSolvedCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Analises Raio-X</div>
                </div>
                <div className="apple-subcard p-3.5">
                  <div className="font-mono text-2xl font-semibold text-[#F0EDE6] tabular-nums">
                    {stats.classesCount}
                  </div>
                  <div className="mt-1 text-[#F0EDE6]/60">Turmas vinculadas</div>
                </div>
              </div>
            )}

            <div className="border-t border-[#5C5C5C]/25 pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-[#F0EDE6]/70">
                <Users className="h-3.5 w-3.5 text-[#C8B560]" strokeWidth={1.6} />
                <span>Turmas e disciplinas</span>
              </div>
              {!profile.show_classes ? (
                <p className="text-xs text-[#F0EDE6]/50">Turmas ocultas pelo usuario.</p>
              ) : userClasses.length === 0 ? (
                <p className="text-xs text-[#F0EDE6]/50">Sem turmas aprovadas ainda.</p>
              ) : (
                <div className="space-y-2">
                  {userClasses.map((c) => (
                    <div
                      key={c.id}
                      className="apple-subcard flex items-center justify-between px-3.5 py-2.5 text-xs"
                    >
                      <div>
                        <div className="font-medium text-[#F0EDE6]">{c.name}</div>
                        <div className="text-[11px] text-[#F0EDE6]/55">{c.subject}</div>
                      </div>
                      <span className="font-mono text-[11px] text-[#C8B560]">{c.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="apple-shell lg:col-span-7">
          <div className="apple-card space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-[#C8B560]">
                <Activity className="h-4 w-4" strokeWidth={1.7} />
                <span>Atividades recentes</span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] text-[#F0EDE6]/55">
                {profile.show_activity_status ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C8B560]" strokeWidth={1.7} />
                    <span>Status de atividade visivel</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" strokeWidth={1.7} />
                    <span>Status discreto</span>
                  </>
                )}
              </span>
            </div>

            {!profile.show_activity_status && !isSelf && currentUser?.role !== "administrador" ? (
              <div className="apple-subcard p-5 text-xs text-[#F0EDE6]/55">
                O usuario desativou a exibicao publica de atividades recentes.
              </div>
            ) : userLogs.length === 0 ? (
              <div className="apple-subcard flex items-center gap-2 p-5 text-xs text-[#F0EDE6]/55">
                <BookOpen className="h-4 w-4" strokeWidth={1.6} />
                <span>Nenhuma atividade registrada recentemente.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {userLogs.map((log) => (
                  <div
                    key={log.id}
                    className="apple-subcard flex items-start justify-between gap-3 p-4 text-xs"
                  >
                    <div>
                      <div className="font-mono text-[11px] uppercase text-[#C8B560]">
                        {log.action_type}
                      </div>
                      <p className="mt-1 text-[#F0EDE6]/85">{log.description}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] text-[#F0EDE6]/45">
                      {new Date(log.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
