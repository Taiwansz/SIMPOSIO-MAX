import {
  AccountStatus,
  AdminProfileData,
  ArenaResponse,
  AuthorshipProof,
  AutopsyLog,
  PrivacySettings,
  ShiftType,
  StudentProfileData,
  StudyNote,
  TeacherProfileData,
  UserRole,
  VeritasActivityLog,
  VeritasClass,
  VeritasEnrollment,
  VeritasSession,
  VeritasUser,
} from "./types";

export type RbacAction =
  | "manage_users"
  | "view_admin_dashboard"
  | "create_class"
  | "manage_class"
  | "approve_enrollment"
  | "request_class_join"
  | "post_announcement"
  | "view_private_profile"
  | "export_lgpd";

export interface RegistrationInput {
  role: UserRole;
  full_name: string;
  social_name?: string;
  avatar_url?: string;
  birth_date: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirm_password: string;
  country: string;
  state: string;
  city: string;
  address?: string;
  institution: string;
  bio?: string;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  student_profile?: Partial<StudentProfileData>;
  teacher_profile?: Partial<TeacherProfileData>;
  admin_profile?: Partial<AdminProfileData>;
  invite_class_code?: string;
}

export function formatPhoneBR(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function normalizeCode(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

export function sanitizeUserForClient(user: VeritasUser): VeritasUser {
  const { recovery_token, ...safeSecurity } = user.security_settings;
  void recovery_token;
  const clone: VeritasUser = {
    ...user,
    security_settings: safeSecurity,
  };
  delete clone.password_hash;
  return clone;
}

export function validateRegistrationPayload(
  input: RegistrationInput,
  existingUsers: VeritasUser[]
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().toLowerCase();
  const phoneDigits = input.phone.replace(/\D/g, "");

  if (input.full_name.trim().length < 4) {
    errors.full_name = "Informe seu nome completo (minimo 4 caracteres).";
  }
  if (!input.birth_date || !/^\d{4}-\d{2}-\d{2}$/.test(input.birth_date)) {
    errors.birth_date = "Informe uma data de nascimento valida.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Informe um e-mail valido.";
  } else if (
    existingUsers.some(
      (u) => u.email.toLowerCase() === email && u.account_status !== "excluida"
    )
  ) {
    errors.email = "Ja existe uma conta cadastrada com este e-mail.";
  }

  if (phoneDigits.length < 10) {
    errors.phone = "Informe um telefone valido com DDD.";
  }

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    errors.username =
      "Nome de usuario deve ter de 3 a 32 caracteres (letras, numeros, ponto ou traco).";
  } else if (
    existingUsers.some(
      (u) => u.username.toLowerCase() === username && u.account_status !== "excluida"
    )
  ) {
    errors.username = "Este nome de usuario ja esta em uso.";
  }

  if (!input.password || input.password.length < 6) {
    errors.password = "A senha deve conter no minimo 6 caracteres.";
  }
  if (input.password !== input.confirm_password) {
    errors.confirm_password = "A confirmacao de senha nao confere.";
  }

  if (!input.country.trim()) errors.country = "Informe o pais.";
  if (!input.state.trim()) errors.state = "Informe o estado.";
  if (!input.city.trim()) errors.city = "Informe a cidade.";
  if (!input.institution.trim()) {
    errors.institution = "Informe a instituicao de ensino.";
  }

  if (!input.terms_accepted) {
    errors.terms_accepted = "E obrigatorio aceitar os Termos de Uso.";
  }
  if (!input.privacy_accepted) {
    errors.privacy_accepted = "E obrigatorio aceitar a Politica de Privacidade (LGPD).";
  }

  if (input.role === "aluno") {
    const sp = input.student_profile || {};
    if (!sp.education_level?.trim()) errors.education_level = "Informe o nivel de escolaridade.";
    if (!sp.course?.trim()) errors.course = "Informe o curso.";
    if (!sp.registration_code?.trim()) errors.registration_code = "Informe o codigo de matricula (RA).";
  }

  if (input.role === "professor") {
    const tp = input.teacher_profile || {};
    if (!tp.academic_degree?.trim()) errors.academic_degree = "Informe a formacao academica.";
    if (!tp.specialization?.trim()) errors.specialization = "Informe a especializacao.";
    if (!tp.subjects_taught || tp.subjects_taught.length === 0) {
      errors.subjects_taught = "Informe pelo menos uma disciplina lecionada.";
    }
    if (!tp.institutional_validation_code?.trim()) {
      errors.institutional_validation_code =
        "Informe o codigo de convite ou validacao institucional.";
    }
  }

  if (input.role === "administrador") {
    const ap = input.admin_profile || {};
    if (!ap.institutional_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ap.institutional_email)) {
      errors.institutional_email = "Informe um e-mail institucional valido.";
    }
    if (!ap.job_title?.trim()) errors.job_title = "Informe o cargo administrativo.";
    if (!ap.department?.trim()) errors.department = "Informe o departamento.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function assertAccountCanAuthenticate(user: VeritasUser): {
  allowed: boolean;
  requiresVerification?: boolean;
  reason?: string;
} {
  if (user.account_status === "excluida") {
    return {
      allowed: false,
      reason: "Esta conta foi excluida conforme solicitacao de privacidade (LGPD).",
    };
  }
  if (user.account_status === "bloqueada") {
    return {
      allowed: false,
      reason: "Acesso bloqueado pela administracao da instituicao.",
    };
  }
  if (user.account_status === "suspensa") {
    return {
      allowed: false,
      reason: "Conta temporariamente suspensa. Procure a coordenacao academica.",
    };
  }
  if (user.account_status === "pendente_verificacao") {
    return {
      allowed: false,
      requiresVerification: true,
      reason: "Conta pendente de verificacao de e-mail. Confirme o codigo antes de entrar.",
    };
  }
  return { allowed: true };
}

export function canPerformAction(
  user: VeritasUser | null,
  action: RbacAction,
  resourceOwnerId?: string | null
): boolean {
  if (!user || user.account_status !== "ativa") return false;

  if (user.role === "administrador") {
    return true;
  }

  switch (action) {
    case "manage_users":
    case "view_admin_dashboard":
      return false;
    case "create_class":
      return user.role === "professor";
    case "manage_class":
    case "approve_enrollment":
    case "post_announcement":
      return user.role === "professor" && Boolean(resourceOwnerId) && resourceOwnerId === user.id;
    case "request_class_join":
      return user.role === "aluno";
    case "view_private_profile":
    case "export_lgpd":
      return Boolean(resourceOwnerId) && resourceOwnerId === user.id;
    default:
      return false;
  }
}

export interface ProjectedUserProfile {
  id: string;
  role: UserRole;
  account_status: AccountStatus;
  full_name: string;
  social_name: string;
  avatar_url: string;
  username: string;
  institution: string;
  identification_code: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  address: string | null;
  show_classes: boolean;
  show_stats: boolean;
  show_activity_status: boolean;
  allow_interactions: boolean;
  student_profile: StudentProfileData | null;
  teacher_profile: TeacherProfileData | null;
  admin_profile: AdminProfileData | null;
  privacy_settings: PrivacySettings;
  email_verified: boolean;
  created_at: string;
  isRedacted: boolean;
  redactionReason: string | null;
}

export function projectUserProfileForViewer(
  target: VeritasUser,
  viewer: VeritasUser | null,
  sharesClassWithTarget: boolean
): ProjectedUserProfile {
  const isSelf = viewer?.id === target.id;
  const isAdmin = viewer?.role === "administrador";
  const visibility = target.privacy_settings.profile_visibility;

  const canViewScope =
    isSelf ||
    isAdmin ||
    visibility === "publico" ||
    (visibility === "turma" && sharesClassWithTarget);

  if (!canViewScope) {
    return {
      id: target.id,
      role: target.role,
      account_status: target.account_status,
      full_name: target.social_name || target.full_name,
      social_name: target.social_name,
      avatar_url: target.avatar_url,
      username: target.username,
      institution: target.institution,
      identification_code: target.identification_code,
      bio: "Perfil configurado com visibilidade restrita pelo usuario.",
      city: target.city,
      state: target.state,
      country: target.country,
      email: null,
      phone: null,
      birth_date: null,
      address: null,
      show_classes: false,
      show_stats: false,
      show_activity_status: false,
      allow_interactions: target.privacy_settings.allow_interactions,
      student_profile: null,
      teacher_profile: null,
      admin_profile: null,
      privacy_settings: target.privacy_settings,
      email_verified: target.email_verified,
      created_at: target.created_at,
      isRedacted: true,
      redactionReason:
        visibility === "privado"
          ? "Perfil privado (visivel apenas para o titular e administracao)."
          : "Perfil visivel apenas para colegas e docentes da mesma turma.",
    };
  }

  return {
    id: target.id,
    role: target.role,
    account_status: target.account_status,
    full_name: target.full_name,
    social_name: target.social_name,
    avatar_url: target.avatar_url,
    username: target.username,
    institution: target.institution,
    identification_code: target.identification_code,
    bio: target.bio,
    city: target.city,
    state: target.state,
    country: target.country,
    email: isSelf || isAdmin || target.privacy_settings.show_email ? target.email : null,
    phone: isSelf || isAdmin || target.privacy_settings.show_phone ? target.phone : null,
    birth_date: isSelf || isAdmin ? target.birth_date : null,
    address: isSelf || isAdmin ? target.address : null,
    show_classes: isSelf || isAdmin || target.privacy_settings.show_classes,
    show_stats: isSelf || isAdmin || target.privacy_settings.show_stats,
    show_activity_status:
      isSelf || isAdmin || target.privacy_settings.show_activity_status,
    allow_interactions: target.privacy_settings.allow_interactions,
    student_profile: target.role === "aluno" ? target.student_profile : null,
    teacher_profile: target.role === "professor" ? target.teacher_profile : null,
    admin_profile: target.role === "administrador" ? target.admin_profile : null,
    privacy_settings: target.privacy_settings,
    email_verified: target.email_verified,
    created_at: target.created_at,
    isRedacted: false,
    redactionReason: null,
  };
}

export function computeUserPlatformStats(params: {
  user: VeritasUser;
  notes: StudyNote[];
  autopsyLogs: AutopsyLog[];
  proofs: AuthorshipProof[];
  arenaResponses: ArenaResponse[];
  enrollments: VeritasEnrollment[];
  classes: VeritasClass[];
}) {
  const { user, notes, autopsyLogs, proofs, arenaResponses, enrollments, classes } =
    params;

  const userNotes = notes.filter(
    (n) =>
      n.ra === user.identification_code ||
      n.student_name.toLowerCase() === user.full_name.toLowerCase()
  );
  const userAutopsies = autopsyLogs.filter(
    (l) =>
      l.ra === user.identification_code ||
      l.student_name.toLowerCase() === user.full_name.toLowerCase()
  );
  const userProofs = proofs.filter(
    (p) =>
      p.ra === user.identification_code ||
      p.student_name.toLowerCase() === user.full_name.toLowerCase()
  );
  const userArena = arenaResponses.filter(
    (r) => r.participant_name.toLowerCase() === user.full_name.toLowerCase()
  );

  const userApprovedClasses =
    user.role === "aluno"
      ? enrollments.filter(
          (e) => e.student_id === user.id && e.membership_status === "aprovado"
        ).length
      : classes.filter(
          (c) => c.responsible_teacher_id === user.id && c.status !== "arquivada"
        ).length;

  const avgReadiness =
    userNotes.length > 0
      ? Math.round(
          userNotes.reduce((acc, n) => acc + n.readiness_pct, 0) / userNotes.length
        )
      : 0;

  return {
    notesCount: userNotes.length,
    autopsiesSolvedCount: userAutopsies.filter((a) => a.solved).length,
    proofsPassedCount: userProofs.filter((p) => p.passed).length,
    arenaCount: userArena.length,
    classesCount: userApprovedClasses,
    avgReadinessPct: avgReadiness,
  };
}

export function buildLgpdExportPackage(params: {
  user: VeritasUser;
  enrollments: VeritasEnrollment[];
  classes: VeritasClass[];
  notes: StudyNote[];
  proofs: AuthorshipProof[];
  sessions: VeritasSession[];
  activityLogs: VeritasActivityLog[];
}) {
  const { user, enrollments, classes, notes, proofs, sessions, activityLogs } =
    params;
  const safeUser = sanitizeUserForClient(user);
  const userEnrollments = enrollments.filter((e) => e.student_id === user.id);
  const userClasses = classes.filter(
    (c) =>
      c.responsible_teacher_id === user.id ||
      userEnrollments.some((e) => e.class_id === c.id)
  );

  return {
    schema: "VERITAS-LGPD-EXPORT-V1",
    exportedAt: new Date().toISOString(),
    legalBasis:
      "Portabilidade e acesso integral do titular conforme Art. 18 da LGPD (Lei 13.709/2018).",
    consentRecords: {
      termsAccepted: safeUser.terms_accepted,
      privacyAccepted: safeUser.privacy_accepted,
      accountCreatedAt: safeUser.created_at,
      lastUpdatedAt: safeUser.updated_at,
    },
    account: safeUser,
    enrollments: userEnrollments,
    linkedClasses: userClasses.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      subject: c.subject,
      shift: c.shift,
      status: c.status,
    })),
    studyNotes: notes.filter(
      (n) =>
        n.ra === user.identification_code ||
        n.student_name.toLowerCase() === user.full_name.toLowerCase()
    ),
    authorshipProofs: proofs.filter(
      (p) =>
        p.ra === user.identification_code ||
        p.student_name.toLowerCase() === user.full_name.toLowerCase()
    ),
    sessions: sessions
      .filter((s) => s.user_id === user.id)
      .map((s) => ({
        id: s.id,
        device_label: s.device_label,
        ip_masked: s.ip_masked,
        is_active: s.is_active,
        created_at: s.created_at,
        last_seen_at: s.last_seen_at,
      })),
    activityLogs: activityLogs.filter((l) => l.user_id === user.id),
  };
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  profile_visibility: "turma",
  show_email: false,
  show_phone: false,
  show_classes: true,
  show_stats: true,
  show_activity_status: true,
  allow_interactions: true,
};

export const SHIFT_OPTIONS: ShiftType[] = [
  "Matutino",
  "Vespertino",
  "Noturno",
  "Integral",
];
