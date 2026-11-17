-- Seed inicial VERITAS (Computacao, Saude, Negocios, Autoria, Arena e Estudo N=48)

INSERT INTO public.veritas_autopsy_cases (
    id, area, title, summary, ai_output_lines, fault_line_index,
    trigger_param_name, trigger_param_unit, trigger_min, trigger_max, trigger_break_threshold,
    safe_fix_options, correct_fix_id, explanation_simple
) VALUES
(
    'case_comp_pix',
    'Computacao',
    'Saque Duplicado Gerado por IA',
    'A IA gerou uma funcao de transferencia que passa em testes simples, mas quebra quando varios usuarios clicam juntos.',
    '[
        "function transferir(conta, valor) {",
        "  const saldo = lerSaldoNoBanco(conta);",
        "  if (saldo >= valor) {",
        "    gravarNovoSaldo(conta, saldo - valor);",
        "    return \"Transferencia concluida\";",
        "  }",
        "  return \"Saldo insuficiente\";",
        "}"
    ]'::jsonb,
    3,
    'Acessos no mesmo segundo',
    'req/s',
    1,
    50,
    8,
    '[
        {"id": "fix_sleep", "label": "Adicionar pausa de 100ms antes de gravar"},
        {"id": "fix_lock", "label": "Usar trava no banco ou atualizacao atomica (saldo >= valor)"},
        {"id": "fix_log", "label": "Imprimir o saldo no console antes do retorno"}
    ]'::jsonb,
    'fix_lock',
    'Sem trava atomica, duas requisicoes leem o mesmo saldo ao mesmo tempo e ambas aprovam o saque antes da gravacao.'
),
(
    'case_health_triage',
    'Saude',
    'Triagem Medica Ignorando Hipoxia',
    'Um resumo clinico automatico classificou o paciente como risco baixo porque olhou apenas para a temperatura.',
    '[
        "Resumo automatico de triagem:",
        "Paciente sem febre (36.8 C) e com pressao estavel.",
        "Frequencia cardiaca em 114 bpm compensada.",
        "Saturacao de oxigenio caiu de 98% para 88%.",
        "Classificacao da IA: Alta hospitalar com orientacao leve.",
        "Nenhuma urgencia respiratoria identificada."
    ]'::jsonb,
    4,
    'Queda de oxigenio no sangue',
    '% SpO2',
    82,
    99,
    92,
    '[
        {"id": "fix_temp", "label": "Repetir apenas o exame de temperatura em 2 horas"},
        {"id": "fix_spo2", "label": "Bloquear alta quando SpO2 estiver abaixo de 92% e acionar equipe"},
        {"id": "fix_water", "label": "Recomendar hidratacao oral e retorno em 7 dias"}
    ]'::jsonb,
    'fix_spo2',
    'A IA se deixou levar pelo texto normal de temperatura e ignorou um sinal vital critico de queda de oxigenio.'
),
(
    'case_biz_contract',
    'Negocios',
    'Contrato Aprovado por Bajulacao',
    'Ao receber um pedido apressado do usuario, a IA concordou com o prazo e deixou passar uma multa oculta no contrato.',
    '[
        "Parecer rapido de revisao contratual:",
        "O cliente pediu aprovacao ainda hoje para fechar a venda.",
        "Valor mensal alinhado com o orcamento da empresa.",
        "Clausula 9.2: multa de 40% mesmo se houver atraso do fornecedor.",
        "Recomendacao da IA: Assinar imediatamente sem alteracoes.",
        "Risco financeiro classificado como minimo."
    ]'::jsonb,
    4,
    'Pressao do usuario no prompt',
    '% urgencia',
    10,
    100,
    60,
    '[
        {"id": "fix_fast", "label": "Reduzir o texto do contrato para ficar mais curto"},
        {"id": "fix_clause", "label": "Exigir revisao da Clausula 9.2 e retirar o vies de urgencia"},
        {"id": "fix_sign", "label": "Aceitar a multa porque o valor mensal esta dentro do esperado"}
    ]'::jsonb,
    'fix_clause',
    'Modelos tendem a concordar com a pressa do usuario e mascaram riscos graves escondidos nas clausulas.'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    ai_output_lines = EXCLUDED.ai_output_lines,
    fault_line_index = EXCLUDED.fault_line_index,
    safe_fix_options = EXCLUDED.safe_fix_options,
    correct_fix_id = EXCLUDED.correct_fix_id,
    explanation_simple = EXCLUDED.explanation_simple;

INSERT INTO public.veritas_autopsy_logs (id, student_name, ra, case_id, selected_line, selected_fix_id, solved)
VALUES
('44444444-4444-4444-8444-444444444401', 'Matheus Sousa dos Santos', '52319400', 'case_comp_pix', 3, 'fix_lock', TRUE),
('44444444-4444-4444-8444-444444444402', 'Beatriz Almeida', '52317504', 'case_health_triage', 4, 'fix_spo2', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.veritas_authorship_proofs (id, student_name, ra, artifact_title, mutated_line, elapsed_seconds, passed, proof_hash)
VALUES
('55555555-5555-4555-8555-555555555501', 'Matheus Sousa dos Santos', '52319400', 'Controle de Saque Seguro', 2, 19, TRUE, 'veritas-52319400-8a91c4')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.veritas_arena_responses (id, session_code, participant_name, role, response_text, coord_x, coord_y, uniqueness_score)
VALUES
('66666666-6666-4666-8666-666666666601', 'UNIMAX-2026', 'Rafael Oliveira', 'Estudante', 'A inteligencia artificial ajuda muito na produtividade dos estudos e otimiza os resultados de maneira geral na faculdade.', 24.00, 32.00, 18.00),
('66666666-6666-4666-8666-666666666602', 'UNIMAX-2026', 'Camila Ferreira', 'Estudante', 'A inteligencia artificial otimiza os resultados nos estudos e ajuda bastante a melhorar a produtividade geral dos alunos.', 26.50, 34.00, 16.00),
('66666666-6666-4666-8666-666666666603', 'UNIMAX-2026', 'Matheus Sousa dos Santos', 'Estudante', 'A IA nao assina responsabilidade tecnica: quando o banco trava em concorrencia ou um laudo erra, a resposta so e valida se o humano souber auditar a falha.', 78.00, 74.00, 91.00),
('66666666-6666-4666-8666-666666666604', 'UNIMAX-2026', 'Profa. Helena Martins', 'Docente', 'Avaliar hoje exige medir a capacidade de o estudante explicar o proprio trabalho sob mudanca de regras, e nao apenas corrigir textos prontos.', 71.00, 26.00, 86.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.veritas_cohort_results (week_number, week_label, control_autonomy_pct, veritas_autonomy_pct, herd_collapse_pct, veritas_originality_pct)
VALUES
(1,  'S01', 64.0, 65.0, 42.0, 58.0),
(2,  'S02', 61.5, 68.4, 45.0, 63.0),
(3,  'S03', 59.0, 71.8, 48.0, 67.5),
(4,  'S04', 57.2, 74.9, 51.0, 71.2),
(5,  'S05', 55.8, 77.6, 53.5, 74.8),
(6,  'S06', 54.5, 80.1, 55.0, 77.9),
(7,  'S07', 53.6, 82.5, 56.8, 80.4),
(8,  'S08', 52.8, 84.7, 58.2, 82.9),
(9,  'S09', 52.1, 86.4, 59.4, 84.8),
(10, 'S10', 51.6, 88.0, 60.5, 86.3),
(11, 'S11', 51.2, 89.2, 61.2, 87.9),
(12, 'S12', 50.8, 90.3, 62.0, 89.1),
(13, 'S13', 50.5, 91.1, 62.5, 90.4),
(14, 'S14', 50.2, 91.8, 63.1, 91.5),
(15, 'S15', 50.0, 92.3, 63.6, 92.2),
(16, 'S16', 49.8, 92.8, 64.0, 93.0)
ON CONFLICT (week_number) DO UPDATE SET
    control_autonomy_pct = EXCLUDED.control_autonomy_pct,
    veritas_autonomy_pct = EXCLUDED.veritas_autonomy_pct,
    herd_collapse_pct = EXCLUDED.herd_collapse_pct,
    veritas_originality_pct = EXCLUDED.veritas_originality_pct;

INSERT INTO public.veritas_jury_votes (id, evaluator_name, innovation_score, pedagogical_score, impact_score, note)
VALUES
('77777777-7777-4777-8777-777777777701', 'Auditoria Inicial UniMAX', 2.0, 4.0, 4.0, 'Abordagem inedita que coloca a IA sob exame forense humano e mede a originalidade da sala em tempo real.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.veritas_study_notes (
    id, student_name, ra, subject_name, exam_days_left, exam_date_label,
    note_title, note_content, copilot_strength, copilot_blindspot, copilot_question, readiness_pct
) VALUES
(
    '88888888-8888-4888-8888-888888888801',
    'Matheus Sousa dos Santos',
    '52319400',
    'Sistemas Operacionais',
    3,
    'Prova em 3 dias',
    'Travas e Saques Concorrentes',
    E'Quando dois processos acessam o mesmo saldo ao mesmo tempo, o valor pode ser sobrescrito.\nPor isso nao podemos ler e gravar sem protecao no banco.\nSe o codigo usar trava exclusiva e verificar saldo >= valor, o saque duplicado nao acontece.',
    'Voce explicou o porquê da falha de concorrencia e incluiu a regra pratica de protecao.',
    'Faltou anotar o risco de travamento mutuo (deadlock) se duas contas bloquearem na ordem inversa.',
    'O que acontece se a conta A esperar a conta B enquanto B espera A?',
    84
),
(
    '88888888-8888-4888-8888-888888888802',
    'Matheus Sousa dos Santos',
    '52319400',
    'Redes de Computadores',
    8,
    'Prova em 8 dias',
    'Controle de Fluxo TCP',
    E'O protocolo TCP garante entrega ordenada usando confirmacoes ACK.\nEle divide os dados em pacotes menores para atravessar a rede.',
    'A definicao basica da entrega ordenada e dos pacotes esta correta.',
    'Sua nota nao explicou o que acontece com a velocidade quando ocorre perda de pacotes na rede.',
    'Como o TCP reduz a janela de envio quando um pacote se perde no caminho?',
    56
),
(
    '88888888-8888-4888-8888-888888888803',
    'Matheus Sousa dos Santos',
    '52319400',
    'Inteligencia Artificial',
    14,
    'Prova em 14 dias',
    'Por que Modelos Alucinam',
    E'Modelos de linguagem preveem a proxima palavra mais provavel.\nQuando falta dado real ou o usuario pressiona no pedido, o modelo inventa detalhes com confianca.',
    'Excelente conexao entre previsao estatistica, pressao no pedido e falsa confianca.',
    'Vale registrar um exemplo pratico de como auditar a saida antes de confiar nela.',
    'Como voce detecta na pratica quando uma resposta fluente esta escondendo um dado falso?',
    88
)
ON CONFLICT (id) DO UPDATE SET note_content = EXCLUDED.note_content;

-- 8. Usuarios Iniciais (Aluno, Aluna, Professor, Administrador)
INSERT INTO public.veritas_users (
    id, role, account_status, email_verified, terms_accepted, privacy_accepted,
    full_name, social_name, avatar_url, birth_date, email, phone, username, password_hash,
    country, state, city, address, institution, bio, identification_code,
    student_profile, teacher_profile, admin_profile,
    privacy_settings, notification_settings, security_settings, appearance_settings, study_preferences
) VALUES
(
    '11111111-1111-4111-8111-111111111101',
    'aluno',
    'ativa',
    TRUE,
    TRUE,
    TRUE,
    'Matheus Sousa dos Santos',
    '',
    '',
    '2002-05-14',
    'matheus.santos@unimax.edu.br',
    '(19) 99142-8801',
    'matheus.santos',
    'seed_v1:c6631b929a842074f87d4df484feb97eae90b88b1a228912de46e1fafd4719d8',
    'Brasil',
    'SP',
    'Indaiatuba',
    'Av. 9 de Dezembro, 460 - Jd. Pedroso',
    'Centro Universitario Max Planck (UniMAX)',
    'Graduando em Ciencia da Computacao focado em auditoria de modelos de IA, concorrencia em sistemas criticos e engenharia de software.',
    '52319400',
    '{
        "education_level": "Ensino Superior",
        "grade_year": "8o Semestre",
        "cohort_label": "CC-2026N",
        "shift": "Noturno",
        "course": "Ciencia da Computacao",
        "subjects_of_interest": ["Sistemas Operacionais", "Inteligencia Artificial", "Redes de Computadores", "Arquitetura de Software"],
        "learning_goals": "Dominar auditoria tecnica de falhas de IA e fechar o TCC com validacao pratica.",
        "academic_interests": "Engenharia de sistemas resilientes, seguranca transacional e verificacao de autoria.",
        "registration_code": "52319400",
        "advisor_teacher": "Profa. Helena Martins"
    }'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '{"profile_visibility":"publico","show_email":true,"show_phone":false,"show_classes":true,"show_stats":true,"show_activity_status":true,"allow_interactions":true}'::jsonb,
    '{"new_activities":true,"messages":true,"class_invites":true,"class_updates":true,"teacher_notices":true,"platform_updates":true}'::jsonb,
    '{"two_factor_enabled":true,"two_factor_method":"app_ou_email","recovery_token":"","recovery_expires_at":"","last_password_change":"2026-10-15T18:00:00Z"}'::jsonb,
    '{"theme":"dark","language":"pt-BR","high_contrast":false,"compact_mode":false,"reduced_motion":false}'::jsonb,
    '{"favorite_subjects":["Sistemas Operacionais","Inteligencia Artificial","Redes de Computadores"],"learning_targets":"Revisar concorrencia, deadlocks e testes de mutacao antes da banca final.","study_frequency":"diaria","daily_minutes_goal":60,"copilot_intensity":"rigorosa"}'::jsonb
),
(
    '11111111-1111-4111-8111-111111111102',
    'aluno',
    'ativa',
    TRUE,
    TRUE,
    TRUE,
    'Beatriz Almeida',
    '',
    '',
    '2003-09-21',
    'beatriz.almeida@unimax.edu.br',
    '(19) 99210-3348',
    'beatriz.almeida',
    'seed_v1:c6631b929a842074f87d4df484feb97eae90b88b1a228912de46e1fafd4719d8',
    'Brasil',
    'SP',
    'Indaiatuba',
    '',
    'Centro Universitario Max Planck (UniMAX)',
    'Estudante da area da saude investigando limites de triagem clinica assistida por IA e seguranca do paciente.',
    '52317504',
    '{
        "education_level": "Ensino Superior",
        "grade_year": "6o Semestre",
        "cohort_label": "SD-2026M",
        "shift": "Matutino",
        "course": "Enfermagem e Saude Digital",
        "subjects_of_interest": ["Triagem Clinica", "Bioetica em IA", "Urgencia e Emergencia"],
        "learning_goals": "Identificar falsos negativos em protocolos clinicos sugeridos por modelos automaticos.",
        "academic_interests": "Seguranca assistencial e auditoria de sinais vitais.",
        "registration_code": "52317504",
        "advisor_teacher": "Profa. Helena Martins"
    }'::jsonb,
    '{}'::jsonb,
    '{}'::jsonb,
    '{"profile_visibility":"turma","show_email":false,"show_phone":false,"show_classes":true,"show_stats":true,"show_activity_status":true,"allow_interactions":true}'::jsonb,
    '{"new_activities":true,"messages":true,"class_invites":true,"class_updates":true,"teacher_notices":true,"platform_updates":false}'::jsonb,
    '{"two_factor_enabled":false,"two_factor_method":"app_ou_email","recovery_token":"","recovery_expires_at":"","last_password_change":"2026-09-02T10:00:00Z"}'::jsonb,
    '{"theme":"dark","language":"pt-BR","high_contrast":false,"compact_mode":false,"reduced_motion":false}'::jsonb,
    '{"favorite_subjects":["Triagem Clinica","Bioetica em IA"],"learning_targets":"Consolidar leitura critica de sinais de hipoxia e protocolos hospitalares.","study_frequency":"alternada","daily_minutes_goal":45,"copilot_intensity":"equilibrada"}'::jsonb
),
(
    '11111111-1111-4111-8111-111111111103',
    'professor',
    'ativa',
    TRUE,
    TRUE,
    TRUE,
    'Profa. Helena Martins',
    '',
    '',
    '1984-03-11',
    'helena.martins@unimax.edu.br',
    '(19) 99812-4410',
    'helena.martins',
    'seed_v1:c6631b929a842074f87d4df484feb97eae90b88b1a228912de46e1fafd4719d8',
    'Brasil',
    'SP',
    'Campinas',
    'Rua Boaventura do Amaral, 900',
    'Centro Universitario Max Planck (UniMAX)',
    'Doutora em Ciencia da Computacao com 14 anos de docencia em Sistemas Distribuidos, IA Responsavel e metodologias de avaliacao ativa.',
    'DOC-UNIMAX-402',
    '{}'::jsonb,
    '{
        "academic_degree": "Doutorado em Ciencia da Computacao (UNICAMP)",
        "specialization": "Sistemas Distribuidos, IA Forense e Avaliacao Pedagogica",
        "subjects_taught": ["Sistemas Operacionais", "Inteligencia Artificial", "Triagem Clinica e IA"],
        "professional_experience": "14 anos no ensino superior e consultoria em governanca algoritmica para hospitais e fintechs.",
        "professional_registry": "DOC-UNIMAX-402",
        "linked_classes": ["CC-SO-2026N", "CC-IA-2026N", "SD-TR-2026M"],
        "institutional_validation_code": "UNIMAX-DOC-2026",
        "availability": "Seg a Qui - 19h00 as 22h30 | Plantao Ter 17h30"
    }'::jsonb,
    '{}'::jsonb,
    '{"profile_visibility":"publico","show_email":true,"show_phone":false,"show_classes":true,"show_stats":true,"show_activity_status":true,"allow_interactions":true}'::jsonb,
    '{"new_activities":true,"messages":true,"class_invites":true,"class_updates":true,"teacher_notices":true,"platform_updates":true}'::jsonb,
    '{"two_factor_enabled":true,"two_factor_method":"app_ou_email","recovery_token":"","recovery_expires_at":"","last_password_change":"2026-08-20T14:30:00Z"}'::jsonb,
    '{"theme":"dark","language":"pt-BR","high_contrast":false,"compact_mode":false,"reduced_motion":false}'::jsonb,
    '{"favorite_subjects":["Sistemas Operacionais","Inteligencia Artificial"],"learning_targets":"Conduzir defesas de autoria em 60s e debates em sala sem copias identicas.","study_frequency":"diaria","daily_minutes_goal":50,"copilot_intensity":"rigorosa"}'::jsonb
),
(
    '11111111-1111-4111-8111-111111111104',
    'administrador',
    'ativa',
    TRUE,
    TRUE,
    TRUE,
    'Dr. Carlos Eduardo Mendes',
    '',
    '',
    '1979-11-08',
    'reitoria.ia@unimax.edu.br',
    '(19) 3885-9000',
    'carlos.mendes',
    'seed_v1:c6631b929a842074f87d4df484feb97eae90b88b1a228912de46e1fafd4719d8',
    'Brasil',
    'SP',
    'Indaiatuba',
    'Rod. Joao Ceccon, Km 4 - Campus I UniMAX',
    'Centro Universitario Max Planck (UniMAX)',
    'Coordenador Institucional de Inovacao Academica e Governanca de Dados LGPD na UniMAX.',
    'ADM-UNIMAX-001',
    '{}'::jsonb,
    '{}'::jsonb,
    '{
        "institutional_email": "reitoria.ia@unimax.edu.br",
        "job_title": "Coordenador Institucional de IA e Ensino",
        "department": "Reitoria Academica e Comite de Etica em IA",
        "access_level": "super_admin",
        "admin_permissions": ["gerenciar_usuarios", "gerenciar_turmas", "auditar_rbac", "exportar_relatorios", "governanca_lgpd", "moderar_contas"]
    }'::jsonb,
    '{"profile_visibility":"turma","show_email":true,"show_phone":false,"show_classes":true,"show_stats":true,"show_activity_status":false,"allow_interactions":true}'::jsonb,
    '{"new_activities":true,"messages":true,"class_invites":false,"class_updates":true,"teacher_notices":true,"platform_updates":true}'::jsonb,
    '{"two_factor_enabled":true,"two_factor_method":"chave_seguranca","recovery_token":"","recovery_expires_at":"","last_password_change":"2026-11-01T09:00:00Z"}'::jsonb,
    '{"theme":"dark","language":"pt-BR","high_contrast":false,"compact_mode":false,"reduced_motion":false}'::jsonb,
    '{"favorite_subjects":["Governanca de IA","LGPD Educacional"],"learning_targets":"Monitorar indicadores institucionais de autonomia e conformidade.","study_frequency":"semanal","daily_minutes_goal":30,"copilot_intensity":"equilibrada"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 9. Turmas Academicas Iniciais
INSERT INTO public.veritas_classes (
    id, name, code, description, institution, subject,
    responsible_teacher_id, responsible_teacher_name, max_participants,
    academic_period, start_date, end_date, shift, status, announcements
) VALUES
(
    '22222222-2222-4222-8222-222222222201',
    'Sistemas Operacionais e Concorrencia',
    'CC-SO-2026N',
    'Estudo pratico de concorrencia, exclusao mutua, deadlocks e auditoria de codigo transacional.',
    'Centro Universitario Max Planck (UniMAX)',
    'Sistemas Operacionais',
    '11111111-1111-4111-8111-111111111103',
    'Profa. Helena Martins',
    45,
    '2026.2',
    '2026-08-03',
    '2026-12-12',
    'Noturno',
    'ativa',
    '[
        {
            "id": "ann-so-1",
            "author_name": "Profa. Helena Martins",
            "title": "Prova P2 - Travas e Concorrencia em Bancos",
            "content": "Trazer anotacao propria no Caderno VERITAS e concluir o Raio-X do Saque Duplicado antes da aula.",
            "kind": "prova",
            "due_date": "2026-11-20",
            "created_at": "2026-11-14T20:00:00Z"
        },
        {
            "id": "ann-so-2",
            "author_name": "Profa. Helena Martins",
            "title": "Desafio de Autoria em 60s liberado",
            "content": "Valide sua explicacao sobre deadlock e gere seu selo SHA-256 no modulo Teste de Autoria.",
            "kind": "atividade",
            "due_date": "2026-11-18",
            "created_at": "2026-11-15T19:30:00Z"
        }
    ]'::jsonb
),
(
    '22222222-2222-4222-8222-222222222202',
    'Inteligencia Artificial Aplicada e Auditoria',
    'CC-IA-2026N',
    'Exame forense de alucinacoes, vies de concordancia, Arena ao Vivo e responsabilidade discente no uso de IA.',
    'Centro Universitario Max Planck (UniMAX)',
    'Inteligencia Artificial',
    '11111111-1111-4111-8111-111111111103',
    'Profa. Helena Martins',
    50,
    '2026.2',
    '2026-08-03',
    '2026-12-12',
    'Noturno',
    'ativa',
    '[
        {
            "id": "ann-ia-1",
            "author_name": "Profa. Helena Martins",
            "title": "IV Simposio de IA UniMAX - Arena Coletiva",
            "content": "Submeter tese original na Arena usando o codigo UNIMAX-2026 durante a apresentacao oficial.",
            "kind": "aviso",
            "due_date": "2026-12-07",
            "created_at": "2026-11-16T18:15:00Z"
        }
    ]'::jsonb
),
(
    '22222222-2222-4222-8222-222222222203',
    'Triagem Clinica e Decisao Assistida',
    'SD-TR-2026M',
    'Avaliacao critica de protocolos de enfermagem e limites de modelos automaticos em sinais vitais.',
    'Centro Universitario Max Planck (UniMAX)',
    'Triagem Clinica',
    '11111111-1111-4111-8111-111111111103',
    'Profa. Helena Martins',
    40,
    '2026.2',
    '2026-08-03',
    '2026-12-12',
    'Matutino',
    'ativa',
    '[
        {
            "id": "ann-sd-1",
            "author_name": "Profa. Helena Martins",
            "title": "Estudo de Caso: Hipoxia Oculta (SpO2 < 92%)",
            "content": "Analisar no Raio-X da IA por que o modelo classificou paciente critico como baixo risco.",
            "kind": "atividade",
            "due_date": "2026-11-22",
            "created_at": "2026-11-15T10:00:00Z"
        }
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 10. Matriculas e Solicitacoes de Entrada em Turmas (incluindo 1 pendencia para demonstrar aprovacao docente)
INSERT INTO public.veritas_class_enrollments (
    id, class_id, student_id, student_name, student_ra,
    membership_status, invite_code_used, message, requested_at, decided_at
) VALUES
(
    '33333333-3333-4333-8333-333333333301',
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    'Matheus Sousa dos Santos',
    '52319400',
    'aprovado',
    'CC-SO-2026N',
    'Inscricao regular do 8o semestre Noturno.',
    NOW() - INTERVAL '14 days',
    NOW() - INTERVAL '13 days'
),
(
    '33333333-3333-4333-8333-333333333302',
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111101',
    'Matheus Sousa dos Santos',
    '52319400',
    'aprovado',
    'CC-IA-2026N',
    'Participante da trilha de auditoria forense para o Simposio.',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '9 days'
),
(
    '33333333-3333-4333-8333-333333333303',
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111102',
    'Beatriz Almeida',
    '52317504',
    'aprovado',
    'SD-TR-2026M',
    'Aluna da turma matutina de Saude Digital.',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '11 days'
),
(
    '33333333-3333-4333-8333-333333333304',
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111102',
    'Beatriz Almeida',
    '52317504',
    'pendente',
    'CC-IA-2026N',
    'Solicito ingresso como ouvinte interdisciplinar de Saude para a Arena de IA.',
    NOW() - INTERVAL '2 hours',
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- 11. Sessoes Ativas e Logs de Atividade
INSERT INTO public.veritas_sessions (id, user_id, session_token, device_label, ip_masked, is_active, created_at, last_seen_at)
VALUES
('99999999-9999-4999-8999-999999999901', '11111111-1111-4111-8111-111111111101', 'sess-matheus-desktop-01', 'Desktop Linux / Navegador Principal', '189.12.***.40', TRUE, NOW() - INTERVAL '1 day', NOW()),
('99999999-9999-4999-8999-999999999902', '11111111-1111-4111-8111-111111111101', 'sess-matheus-mobile-02', 'Smartphone Safari / QR Arena', '189.12.***.87', TRUE, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 hours'),
('99999999-9999-4999-8999-999999999903', '11111111-1111-4111-8111-111111111103', 'sess-helena-desktop-01', 'Notebook Docente Sala 204', '187.44.***.12', TRUE, NOW() - INTERVAL '6 hours', NOW()),
('99999999-9999-4999-8999-999999999904', '11111111-1111-4111-8111-111111111104', 'sess-carlos-admin-01', 'Estacao Reitoria UniMAX', '200.18.***.05', TRUE, NOW() - INTERVAL '12 hours', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.veritas_activity_logs (id, user_id, user_name, user_role, action_type, description, created_at)
VALUES
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa01', '11111111-1111-4111-8111-111111111101', 'Matheus Sousa dos Santos', 'aluno', 'autoria_selo', 'Gerou selo SHA-256 em 19s para Controle de Saque Seguro.', NOW() - INTERVAL '3 hours'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa02', '11111111-1111-4111-8111-111111111103', 'Profa. Helena Martins', 'professor', 'turma_comunicado', 'Publicou atividade de Prova P2 na turma CC-SO-2026N.', NOW() - INTERVAL '5 hours'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa03', '11111111-1111-4111-8111-111111111102', 'Beatriz Almeida', 'aluno', 'solicitacao_turma', 'Solicitou ingresso na turma CC-IA-2026N com codigo de convite.', NOW() - INTERVAL '2 hours'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaa04', '11111111-1111-4111-8111-111111111104', 'Dr. Carlos Eduardo Mendes', 'administrador', 'auditoria_lgpd', 'Revisou politicas de RLS e matriz RBAC da plataforma.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;
