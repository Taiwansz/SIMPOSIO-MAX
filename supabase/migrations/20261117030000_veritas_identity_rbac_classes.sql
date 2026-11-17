-- VERITAS // Modulo Completo de Usuarios, Autenticacao, RBAC, Turmas, Configuracoes e LGPD
-- Migracao idempotente para Supabase PostgreSQL (SIMPOSIO-MAX)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Usuarios da Plataforma (Aluno, Professor, Administrador) + Perfis + Configuracoes (7 Secoes)
CREATE TABLE IF NOT EXISTS public.veritas_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL CHECK (role IN ('aluno', 'professor', 'administrador')),
    account_status TEXT NOT NULL DEFAULT 'ativa' CHECK (account_status IN ('ativa', 'pendente_verificacao', 'suspensa', 'bloqueada', 'excluida')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    privacy_accepted BOOLEAN NOT NULL DEFAULT TRUE,

    -- Dados gerais de cadastro e perfil
    full_name TEXT NOT NULL,
    social_name TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    birth_date TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL DEFAULT '',
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Brasil',
    state TEXT NOT NULL DEFAULT 'SP',
    city TEXT NOT NULL DEFAULT 'Indaiatuba',
    address TEXT NOT NULL DEFAULT '',
    institution TEXT NOT NULL DEFAULT 'Centro Universitario Max Planck (UniMAX)',
    bio TEXT NOT NULL DEFAULT '',
    identification_code TEXT NOT NULL DEFAULT '',

    -- Dados especificos por perfil (JSONB estruturado)
    student_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    teacher_profile JSONB NOT NULL DEFAULT '{}'::jsonb,
    admin_profile JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Configuracoes granulares e LGPD
    privacy_settings JSONB NOT NULL DEFAULT '{"profile_visibility":"turma","show_email":false,"show_phone":false,"show_classes":true,"show_stats":true,"show_activity_status":true,"allow_interactions":true}'::jsonb,
    notification_settings JSONB NOT NULL DEFAULT '{"new_activities":true,"messages":true,"class_invites":true,"class_updates":true,"teacher_notices":true,"platform_updates":true}'::jsonb,
    security_settings JSONB NOT NULL DEFAULT '{"two_factor_enabled":false,"two_factor_method":"app_ou_email","recovery_token":"","recovery_expires_at":"","last_password_change":""}'::jsonb,
    appearance_settings JSONB NOT NULL DEFAULT '{"theme":"dark","language":"pt-BR","high_contrast":false,"compact_mode":false,"reduced_motion":false}'::jsonb,
    study_preferences JSONB NOT NULL DEFAULT '{"favorite_subjects":[],"learning_targets":"","study_frequency":"diaria","daily_minutes_goal":45,"copilot_intensity":"rigorosa"}'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_users_role ON public.veritas_users(role);
CREATE INDEX IF NOT EXISTS idx_veritas_users_status ON public.veritas_users(account_status);
CREATE INDEX IF NOT EXISTS idx_veritas_users_email ON public.veritas_users(lower(email));
CREATE INDEX IF NOT EXISTS idx_veritas_users_username ON public.veritas_users(lower(username));

-- 2. Sessoes Ativas, Dispositivos Conectados e Encerramento de Sessao
CREATE TABLE IF NOT EXISTS public.veritas_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.veritas_users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_label TEXT NOT NULL DEFAULT 'Navegador Web Desktop',
    ip_masked TEXT NOT NULL DEFAULT '189.12.***.40',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_sessions_user ON public.veritas_sessions(user_id, is_active);

-- 3. Turmas Academicas com Codigos Exclusivos, Limite e Comunicados
CREATE TABLE IF NOT EXISTS public.veritas_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    institution TEXT NOT NULL DEFAULT 'Centro Universitario Max Planck (UniMAX)',
    subject TEXT NOT NULL,
    responsible_teacher_id UUID REFERENCES public.veritas_users(id) ON DELETE SET NULL,
    responsible_teacher_name TEXT NOT NULL,
    max_participants INTEGER NOT NULL DEFAULT 45 CHECK (max_participants >= 1 AND max_participants <= 500),
    academic_period TEXT NOT NULL DEFAULT '2026.2',
    start_date TEXT NOT NULL DEFAULT '2026-08-03',
    end_date TEXT NOT NULL DEFAULT '2026-12-12',
    shift TEXT NOT NULL DEFAULT 'Noturno' CHECK (shift IN ('Matutino', 'Vespertino', 'Noturno', 'Integral')),
    status TEXT NOT NULL DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada', 'arquivada')),
    announcements JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_classes_status ON public.veritas_classes(status);
CREATE INDEX IF NOT EXISTS idx_veritas_classes_teacher ON public.veritas_classes(responsible_teacher_id);

-- 4. Vinculos e Solicitacoes de Entrada em Turmas (Convite / Aprovacao Docente)
CREATE TABLE IF NOT EXISTS public.veritas_class_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.veritas_classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.veritas_users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_ra TEXT NOT NULL DEFAULT '',
    membership_status TEXT NOT NULL DEFAULT 'pendente' CHECK (membership_status IN ('aprovado', 'pendente', 'recusado', 'removido')),
    invite_code_used TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decided_at TIMESTAMPTZ,
    CONSTRAINT uq_veritas_class_student UNIQUE (class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_veritas_enrollments_class ON public.veritas_class_enrollments(class_id, membership_status);
CREATE INDEX IF NOT EXISTS idx_veritas_enrollments_student ON public.veritas_class_enrollments(student_id, membership_status);

-- 5. Registro de Atividades, Auditoria RBAC e Historico de Acessos
CREATE TABLE IF NOT EXISTS public.veritas_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.veritas_users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_role TEXT NOT NULL,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_activity_logs_user ON public.veritas_activity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_veritas_activity_logs_created ON public.veritas_activity_logs(created_at DESC);

-- Seguranca RLS em 100% das tabelas
ALTER TABLE public.veritas_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_activity_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_classes' AND policyname = 'Public read active veritas classes') THEN
        CREATE POLICY "Public read active veritas classes"
        ON public.veritas_classes
        FOR SELECT
        TO anon, authenticated
        USING (status <> 'arquivada');
    END IF;
END $$;
