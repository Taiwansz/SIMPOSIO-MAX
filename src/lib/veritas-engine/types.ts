export type VeritasArea = "Computacao" | "Saude" | "Negocios";

export interface FixOption {
  id: string;
  label: string;
}

export interface AutopsyCase {
  id: string;
  area: VeritasArea;
  title: string;
  summary: string;
  ai_output_lines: string[];
  fault_line_index: number;
  trigger_param_name: string;
  trigger_param_unit: string;
  trigger_min: number;
  trigger_max: number;
  trigger_break_threshold: number;
  safe_fix_options: FixOption[];
  correct_fix_id: string;
  explanation_simple: string;
}

export interface AutopsyLog {
  id: string;
  student_name: string;
  ra: string;
  case_id: string;
  selected_line: number;
  selected_fix_id: string;
  solved: boolean;
  created_at: string;
}

export interface MutationChallenge {
  challengeId: string;
  artifactTitle: string;
  area: VeritasArea;
  originalLines: string[];
  mutatedLines: string[];
  mutatedLineIndex: number;
  mutationHint: string;
  fixOptions: FixOption[];
  correctFixId: string;
}

export interface AuthorshipProof {
  id: string;
  student_name: string;
  ra: string;
  artifact_title: string;
  mutated_line: number;
  elapsed_seconds: number;
  passed: boolean;
  proof_hash: string;
  created_at: string;
}

export interface ArenaResponse {
  id: string;
  session_code: string;
  participant_name: string;
  role: string;
  response_text: string;
  coord_x: number;
  coord_y: number;
  uniqueness_score: number;
  created_at: string;
}

export interface ArenaAnalysis {
  originalityIndex: number;
  herdCollapseDetected: boolean;
  repeatedClusterCount: number;
  debatePair: [ArenaResponse, ArenaResponse] | null;
  blackSwanPrompt: string;
}

export interface CohortResultWeek {
  week_number: number;
  week_label: string;
  control_autonomy_pct: number;
  veritas_autonomy_pct: number;
  herd_collapse_pct: number;
  veritas_originality_pct: number;
}

export interface JuryVote {
  id: string;
  evaluator_name: string;
  innovation_score: number;
  pedagogical_score: number;
  impact_score: number;
  note: string;
  created_at: string;
}

export interface StudyNote {
  id: string;
  student_name: string;
  ra: string;
  subject_name: string;
  exam_days_left: number;
  exam_date_label: string;
  note_title: string;
  note_content: string;
  copilot_strength: string;
  copilot_blindspot: string;
  copilot_question: string;
  readiness_pct: number;
  created_at: string;
}

export type UserRole = "aluno" | "professor" | "administrador";

export type AccountStatus =
  | "ativa"
  | "pendente_verificacao"
  | "suspensa"
  | "bloqueada"
  | "excluida";

export type ShiftType = "Matutino" | "Vespertino" | "Noturno" | "Integral";

export type ClassStatus = "ativa" | "encerrada" | "arquivada";

export type EnrollmentStatus =
  | "aprovado"
  | "pendente"
  | "recusado"
  | "removido";

export type ProfileVisibility = "publico" | "turma" | "privado";

export interface StudentProfileData {
  education_level: string;
  grade_year: string;
  cohort_label: string;
  shift: ShiftType;
  course: string;
  subjects_of_interest: string[];
  learning_goals: string;
  academic_interests: string;
  registration_code: string;
  advisor_teacher: string;
}

export interface TeacherProfileData {
  academic_degree: string;
  specialization: string;
  subjects_taught: string[];
  professional_experience: string;
  professional_registry: string;
  linked_classes: string[];
  institutional_validation_code: string;
  availability: string;
}

export interface AdminProfileData {
  institutional_email: string;
  job_title: string;
  department: string;
  access_level: "super_admin" | "gestor_academico" | "auditor";
  admin_permissions: string[];
}

export interface PrivacySettings {
  profile_visibility: ProfileVisibility;
  show_email: boolean;
  show_phone: boolean;
  show_classes: boolean;
  show_stats: boolean;
  show_activity_status: boolean;
  allow_interactions: boolean;
}

export interface NotificationSettings {
  new_activities: boolean;
  messages: boolean;
  class_invites: boolean;
  class_updates: boolean;
  teacher_notices: boolean;
  platform_updates: boolean;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  two_factor_method: "app_ou_email" | "sms" | "chave_seguranca";
  recovery_token?: string;
  recovery_expires_at?: string;
  last_password_change: string;
}

export interface AppearanceSettings {
  theme: "dark" | "light" | "auto";
  language: "pt-BR" | "en-US" | "es-ES";
  high_contrast: boolean;
  compact_mode: boolean;
  reduced_motion: boolean;
}

export interface StudyPreferences {
  favorite_subjects: string[];
  learning_targets: string;
  study_frequency: "diaria" | "alternada" | "semanal" | "intensiva";
  daily_minutes_goal: number;
  copilot_intensity: "rigorosa" | "equilibrada" | "guiada";
}

export interface VeritasUser {
  id: string;
  role: UserRole;
  account_status: AccountStatus;
  email_verified: boolean;
  terms_accepted: boolean;
  privacy_accepted: boolean;
  full_name: string;
  social_name: string;
  avatar_url: string;
  birth_date: string;
  email: string;
  phone: string;
  username: string;
  password_hash?: string;
  country: string;
  state: string;
  city: string;
  address: string;
  institution: string;
  bio: string;
  identification_code: string;
  student_profile: StudentProfileData;
  teacher_profile: TeacherProfileData;
  admin_profile: AdminProfileData;
  privacy_settings: PrivacySettings;
  notification_settings: NotificationSettings;
  security_settings: SecuritySettings;
  appearance_settings: AppearanceSettings;
  study_preferences: StudyPreferences;
  created_at: string;
  updated_at: string;
}

export interface VeritasSession {
  id: string;
  user_id: string;
  session_token: string;
  device_label: string;
  ip_masked: string;
  is_active: boolean;
  created_at: string;
  last_seen_at: string;
}

export interface ClassAnnouncement {
  id: string;
  author_name: string;
  title: string;
  content: string;
  kind: "aviso" | "atividade" | "prova";
  due_date?: string;
  created_at: string;
}

export interface VeritasClass {
  id: string;
  name: string;
  code: string;
  description: string;
  institution: string;
  subject: string;
  responsible_teacher_id: string | null;
  responsible_teacher_name: string;
  max_participants: number;
  academic_period: string;
  start_date: string;
  end_date: string;
  shift: ShiftType;
  status: ClassStatus;
  announcements: ClassAnnouncement[];
  created_at: string;
  updated_at: string;
}

export interface VeritasEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  student_name: string;
  student_ra: string;
  membership_status: EnrollmentStatus;
  invite_code_used: string;
  message: string;
  requested_at: string;
  decided_at: string | null;
}

export interface VeritasActivityLog {
  id: string;
  user_id: string | null;
  user_name: string;
  user_role: string;
  action_type: string;
  description: string;
  created_at: string;
}
