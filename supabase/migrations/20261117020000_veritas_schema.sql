-- VERITAS // Forensic AI Pathology & Live Classroom Dialectics
-- Migracao idempotente para Supabase PostgreSQL (SIMPOSIO-MAX)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Casos Multidisciplinares do Raio-X da IA (Computacao, Saude, Negocios)
CREATE TABLE IF NOT EXISTS public.veritas_autopsy_cases (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL CHECK (area IN ('Computacao', 'Saude', 'Negocios')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    ai_output_lines JSONB NOT NULL,
    fault_line_index INTEGER NOT NULL,
    trigger_param_name TEXT NOT NULL,
    trigger_param_unit TEXT NOT NULL,
    trigger_min INTEGER NOT NULL,
    trigger_max INTEGER NOT NULL,
    trigger_break_threshold INTEGER NOT NULL,
    safe_fix_options JSONB NOT NULL,
    correct_fix_id TEXT NOT NULL,
    explanation_simple TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Diagnosticos Executados pelos Alunos
CREATE TABLE IF NOT EXISTS public.veritas_autopsy_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    ra TEXT NOT NULL,
    case_id TEXT NOT NULL REFERENCES public.veritas_autopsy_cases(id) ON DELETE CASCADE,
    selected_line INTEGER NOT NULL,
    selected_fix_id TEXT NOT NULL,
    solved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_autopsy_logs_created ON public.veritas_autopsy_logs(created_at DESC);

-- 3. Provas de Autoria por Mutacao (60s)
CREATE TABLE IF NOT EXISTS public.veritas_authorship_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    ra TEXT NOT NULL,
    artifact_title TEXT NOT NULL,
    mutated_line INTEGER NOT NULL,
    elapsed_seconds INTEGER NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    proof_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_proofs_created ON public.veritas_authorship_proofs(created_at DESC);

-- 4. Respostas da Arena ao Vivo (Calculo de Originalidade e Colisao)
CREATE TABLE IF NOT EXISTS public.veritas_arena_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_code TEXT NOT NULL DEFAULT 'UNIMAX-2026',
    participant_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Estudante',
    response_text TEXT NOT NULL,
    coord_x NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    coord_y NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    uniqueness_score NUMERIC(5,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_arena_created ON public.veritas_arena_responses(created_at DESC);

-- 5. Resultados Longitudinais da Turma (N = 48, 16 Semanas)
CREATE TABLE IF NOT EXISTS public.veritas_cohort_results (
    week_number INTEGER PRIMARY KEY CHECK (week_number >= 1 AND week_number <= 16),
    week_label TEXT NOT NULL,
    control_autonomy_pct NUMERIC(5,2) NOT NULL,
    veritas_autonomy_pct NUMERIC(5,2) NOT NULL,
    herd_collapse_pct NUMERIC(5,2) NOT NULL,
    veritas_originality_pct NUMERIC(5,2) NOT NULL
);

-- 6. Avaliacao da Banca do Simposio
CREATE TABLE IF NOT EXISTS public.veritas_jury_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluator_name TEXT NOT NULL,
    innovation_score NUMERIC(3,1) NOT NULL CHECK (innovation_score >= 0 AND innovation_score <= 2.0),
    pedagogical_score NUMERIC(3,1) NOT NULL CHECK (pedagogical_score >= 0 AND pedagogical_score <= 4.0),
    impact_score NUMERIC(3,1) NOT NULL CHECK (impact_score >= 0 AND impact_score <= 4.0),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Caderno do Aluno, Materias e Radar de Provas (Copiloto Critico estilo ThSyr)
CREATE TABLE IF NOT EXISTS public.veritas_study_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    ra TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    exam_days_left INTEGER NOT NULL DEFAULT 7 CHECK (exam_days_left >= 0 AND exam_days_left <= 180),
    exam_date_label TEXT NOT NULL,
    note_title TEXT NOT NULL,
    note_content TEXT NOT NULL,
    copilot_strength TEXT NOT NULL,
    copilot_blindspot TEXT NOT NULL,
    copilot_question TEXT NOT NULL,
    readiness_pct INTEGER NOT NULL DEFAULT 70 CHECK (readiness_pct >= 0 AND readiness_pct <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veritas_study_notes_created ON public.veritas_study_notes(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE public.veritas_autopsy_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_autopsy_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_authorship_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_arena_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_cohort_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_jury_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.veritas_study_notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_autopsy_cases' AND policyname = 'Public read veritas cases') THEN
        CREATE POLICY "Public read veritas cases" ON public.veritas_autopsy_cases FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_autopsy_logs' AND policyname = 'Public read veritas logs') THEN
        CREATE POLICY "Public read veritas logs" ON public.veritas_autopsy_logs FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_authorship_proofs' AND policyname = 'Public read veritas proofs') THEN
        CREATE POLICY "Public read veritas proofs" ON public.veritas_authorship_proofs FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_arena_responses' AND policyname = 'Public read veritas arena') THEN
        CREATE POLICY "Public read veritas arena" ON public.veritas_arena_responses FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_cohort_results' AND policyname = 'Public read veritas cohort') THEN
        CREATE POLICY "Public read veritas cohort" ON public.veritas_cohort_results FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_jury_votes' AND policyname = 'Public read veritas jury') THEN
        CREATE POLICY "Public read veritas jury" ON public.veritas_jury_votes FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'veritas_study_notes' AND policyname = 'Public read veritas study notes') THEN
        CREATE POLICY "Public read veritas study notes" ON public.veritas_study_notes FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
