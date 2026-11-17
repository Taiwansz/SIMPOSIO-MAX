-- SIMPOSIO-MAX (ThAthena MAX // Sovereign Epistemic OS)
-- Migracao idempotente para Supabase PostgreSQL

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Nos do Grafo Epistemologico Direcionado Aciclico (E-DAG)
CREATE TABLE IF NOT EXISTS public.simposio_edag_nodes (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    discipline TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 10),
    bloom_level TEXT NOT NULL CHECK (bloom_level IN ('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE')),
    complexity NUMERIC(4,2) NOT NULL DEFAULT 1.0,
    prerequisites TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL,
    fallacies JSONB NOT NULL DEFAULT '[]'::jsonb,
    keystone_score NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Estado Latente do Gemeo Cognitivo Bayesiano (BKT + Ebbinghaus + Brier)
CREATE TABLE IF NOT EXISTS public.simposio_student_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ra TEXT NOT NULL,
    student_name TEXT NOT NULL,
    node_id TEXT NOT NULL REFERENCES public.simposio_edag_nodes(id) ON DELETE CASCADE,
    p_mastery NUMERIC(5,4) NOT NULL DEFAULT 0.1500 CHECK (p_mastery >= 0.0 AND p_mastery <= 1.0),
    p_transit NUMERIC(5,4) NOT NULL DEFAULT 0.2200,
    p_guess NUMERIC(5,4) NOT NULL DEFAULT 0.1400,
    p_slip NUMERIC(5,4) NOT NULL DEFAULT 0.1000,
    stability_hours NUMERIC(8,2) NOT NULL DEFAULT 48.00,
    last_practiced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    brier_score NUMERIC(5,4) NOT NULL DEFAULT 0.1100,
    confidence_claimed NUMERIC(5,4) NOT NULL DEFAULT 0.7000,
    attempts_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE (ra, node_id)
);

CREATE INDEX IF NOT EXISTS idx_simposio_student_states_ra ON public.simposio_student_states(ra);

-- 3. Logs de Sabatina Socratica Adversarial e Auditoria de Blefe
CREATE TABLE IF NOT EXISTS public.simposio_socratic_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ra TEXT NOT NULL,
    node_id TEXT NOT NULL REFERENCES public.simposio_edag_nodes(id) ON DELETE CASCADE,
    student_argument TEXT NOT NULL,
    confidence_declared NUMERIC(5,4) NOT NULL,
    causal_rigor_score NUMERIC(5,2) NOT NULL,
    bluff_detected BOOLEAN NOT NULL DEFAULT FALSE,
    bloom_reached TEXT NOT NULL,
    inquisitor_response TEXT NOT NULL,
    counter_example TEXT NOT NULL,
    provider_used TEXT NOT NULL DEFAULT 'deterministic-hybrid',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simposio_socratic_logs_ra_created ON public.simposio_socratic_logs(ra, created_at DESC);

-- 4. Submissoes de Avaliacoes Isomorficas Anti-Fraude (SHA-256)
CREATE TABLE IF NOT EXISTS public.simposio_isomorphic_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ra TEXT NOT NULL,
    exam_hash TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    parameters_json JSONB NOT NULL,
    submitted_code TEXT NOT NULL,
    submitted_numeric NUMERIC(12,4),
    ast_invariants_passed BOOLEAN NOT NULL DEFAULT FALSE,
    analytical_score NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    verdict TEXT NOT NULL,
    diagnostics JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simposio_iso_submissions_ra ON public.simposio_isomorphic_submissions(ra, created_at DESC);

-- 5. Metricas Empiricas da Coorte (N = 48, 16 Semanas, UniMAX)
CREATE TABLE IF NOT EXISTS public.simposio_cohort_metrics (
    week_number INTEGER PRIMARY KEY CHECK (week_number >= 1 AND week_number <= 16),
    week_label TEXT NOT NULL,
    control_retention_pct NUMERIC(5,2) NOT NULL,
    experimental_retention_pct NUMERIC(5,2) NOT NULL,
    control_brier_score NUMERIC(5,4) NOT NULL,
    experimental_brier_score NUMERIC(5,4) NOT NULL,
    control_prereq_gap_pct NUMERIC(5,2) NOT NULL,
    experimental_prereq_gap_pct NUMERIC(5,2) NOT NULL,
    plagiarism_incidents_control INTEGER NOT NULL DEFAULT 0,
    isomorphic_authenticity_pct NUMERIC(5,2) NOT NULL DEFAULT 100.00
);

-- 6. Registro ao Vivo de Avaliacoes da Banca do IV Simposio UniMAX
CREATE TABLE IF NOT EXISTS public.simposio_jury_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluator_name TEXT NOT NULL,
    evaluator_role TEXT NOT NULL,
    innovation_score NUMERIC(3,1) NOT NULL CHECK (innovation_score >= 0 AND innovation_score <= 2.0),
    pedagogical_score NUMERIC(3,1) NOT NULL CHECK (pedagogical_score >= 0 AND pedagogical_score <= 4.0),
    impact_score NUMERIC(3,1) NOT NULL CHECK (impact_score >= 0 AND impact_score <= 4.0),
    comments TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.simposio_edag_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simposio_student_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simposio_socratic_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simposio_isomorphic_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simposio_cohort_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simposio_jury_feedback ENABLE ROW LEVEL SECURITY;

-- Politicas de Leitura Publica (escritas autenticadas via Service Role nas API Routes Next.js)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_edag_nodes' AND policyname = 'Public read edag nodes') THEN
        CREATE POLICY "Public read edag nodes" ON public.simposio_edag_nodes FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_student_states' AND policyname = 'Public read student states') THEN
        CREATE POLICY "Public read student states" ON public.simposio_student_states FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_socratic_logs' AND policyname = 'Public read socratic logs') THEN
        CREATE POLICY "Public read socratic logs" ON public.simposio_socratic_logs FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_isomorphic_submissions' AND policyname = 'Public read isomorphic submissions') THEN
        CREATE POLICY "Public read isomorphic submissions" ON public.simposio_isomorphic_submissions FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_cohort_metrics' AND policyname = 'Public read cohort metrics') THEN
        CREATE POLICY "Public read cohort metrics" ON public.simposio_cohort_metrics FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'simposio_jury_feedback' AND policyname = 'Public read jury feedback') THEN
        CREATE POLICY "Public read jury feedback" ON public.simposio_jury_feedback FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
