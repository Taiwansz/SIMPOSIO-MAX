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
