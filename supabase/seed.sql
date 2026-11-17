-- Seed idempotente para SIMPOSIO-MAX (ThAthena MAX // Sovereign Epistemic OS)
-- Curso: Bacharelado em Ciencia da Computacao (UniMAX) | Estudo N = 48 (16 Semanas)

INSERT INTO public.simposio_edag_nodes (id, code, title, discipline, semester, bloom_level, complexity, prerequisites, description, fallacies, keystone_score)
VALUES
('n_algo_base', 'CC-101', 'Logica e Complexidade Assintotica', 'Algoritmos e Programacao', 1, 'UNDERSTAND', 1.20, '{}', 'Analise assintotica (Big-O, Omega, Theta), invariantes de laco e custo computacional de algoritmos fundamentais.', '["Um algoritmo O(n^2) e sempre mais lento que um O(n) para qualquer entrada pequena.", "Memoria extra nunca reduz complexidade temporal."]'::jsonb, 9.80),
('n_calc_lin', 'CC-104', 'Algebra Linear e Espacos Vetoriais', 'Matematica Computacional', 1, 'UNDERSTAND', 1.40, '{}', 'Transformacoes lineares, multiplicacao matricial, autovalores, gradientes e representacao vetorial de dados.', '["Normalizar vetores muda a direcao do gradiente descendente.", "Matrizes nao quadradas sempre possuem inversa."]'::jsonb, 8.90),
('n_struct_data', 'CC-201', 'Estruturas de Dados e Arvores Balanceadas', 'Estruturas de Dados', 2, 'APPLY', 1.60, '{"n_algo_base"}', 'Listas encadeadas, tabelas hash com resolucao de colisoes, heaps binarios e arvores AVL/Red-Black.', '["Tabelas hash garantem busca O(1) no pior caso absoluto sem rehash.", "Uma arvore binaria de busca degenerada mantem altura O(log n)."]'::jsonb, 9.60),
('n_arch_cpu', 'CC-203', 'Arquitetura de Computadores e Hierarquia de Cache', 'Arquitetura de Hardware', 2, 'UNDERSTAND', 1.50, '{"n_algo_base"}', 'Ciclo de instrucao (Fetch-Decode-Execute), atomicidade em nivel de barramento, cache L1/L2/L3 e coerencia MESI.', '["A operacao i++ em linguagens de alto nivel executa em um unico ciclo atomico de CPU.", "Memoria cache L1 nao sofre invalidez entre nucleos."]'::jsonb, 9.10),
('n_graph_theory', 'CC-301', 'Teoria dos Grafos e Ordenacao Topologica', 'Grafos e Otimizacao', 3, 'ANALYZE', 1.85, '{"n_struct_data"}', 'Representacao por listas de adjacencia, busca BFS/DFS, algoritmo de Kahn O(V+E), caminho critico e deteccao de ciclos.', '["Busca em largura (BFS) encontra o caminho minimo em grafos com pesos negativos.", "Todo grafo direcionado aceita ordenacao topologica."]'::jsonb, 9.75),
('n_os_proc', 'CC-302', 'Escalonamento Preemptivo e Processos', 'Sistemas Operacionais', 3, 'ANALYZE', 1.75, '{"n_arch_cpu","n_struct_data"}', 'Troca de contexto, estados de processo, algoritmos Round-Robin, CFS e mitigacao de starvation via aging.', '["Troca de contexto entre processos nao invalida TLB nem gera overhead.", "Prioridade estatica absoluta nunca causa starvation."]'::jsonb, 8.80),
('n_net_osi', 'CC-304', 'Arquitetura de Redes TCP/IP e Camadas OSI', 'Redes de Computadores', 3, 'UNDERSTAND', 1.55, '{"n_arch_cpu"}', 'Encapsulamento, controle de congestionamento TCP (AIMD), latencia de propagacao vs transmissao e enderecamento CIDR.', '["TCP garante entrega imediata em tempo real sem jitter.", "Aumentar o tamanho da janela TCP sempre aumenta a vazao em links com perda."]'::jsonb, 8.70),
('n_mutex_lock', 'CC-401', 'Exclusao Mutua, Semaforos e Condicoes de Corrida', 'Programacao Concorrente', 4, 'ANALYZE', 2.10, '{"n_os_proc"}', 'Secoes criticas, operacoes atomicas Compare-And-Swap (CAS), Lost Update, spinlocks e travas reentrantes.', '["Declarar uma variavel como volatile garante atomicidade composta.", "Usar locks de aplicacao resolve concorrencia entre multiplos processos sem IPC."]'::jsonb, 9.40),
('n_db_acid', 'CC-402', 'Engenharia de SGBDs, B+Trees e Durabilidade ACID', 'Banco de Dados Avancado', 4, 'APPLY', 1.90, '{"n_struct_data","n_arch_cpu"}', 'Write-Ahead Logging (WAL), paginacao em disco, indices B+Tree e garantias de atomicidade e durabilidade.', '["Escrever no buffer do sistema operacional garante durabilidade imediata apos queda de energia.", "Indices B+Tree aceleram igualmente operacoes de escrita pesada sem custo."]'::jsonb, 8.60),
('n_routing_ospf', 'CC-404', 'Protocolos de Roteamento Dinamico (OSPF / BGP)', 'Redes Corporativas', 4, 'ANALYZE', 2.00, '{"n_graph_theory","n_net_osi"}', 'Algoritmo de Dijkstra em estado de enlace (OSPF), vetor de distancia (RIP), problema de Count-to-Infinity e politicas BGP.', '["Vetor de distancia converge instantaneamente sem risco de loops de roteamento.", "OSPF escolhe rotas exclusivamente pela menor contagem de saltos."]'::jsonb, 7.90),
('n_deadlock_banker', 'CC-501', 'Prevencao de Deadlocks e Livelocks', 'Sistemas Operacionais II', 5, 'EVALUATE', 2.25, '{"n_mutex_lock"}', 'Condicoes de Coffman, ordenacao global de aquisicao de recursos, algoritmo do Banqueiro e deteccao por grafo de espera.', '["Aumentar o timeout de espera elimina a causa raiz de deadlocks estruturais.", "Deadlock ocorre apenas quando ha mais de duas threads ativas."]'::jsonb, 8.40),
('n_mvcc_iso', 'CC-502', 'Controle de Concorrencia Multiversao (MVCC)', 'Banco de Dados Distribuidos', 5, 'EVALUATE', 2.30, '{"n_db_acid","n_mutex_lock"}', 'Niveis de isolamento SQL, leitura suja, leitura fantasma, Write Skew em Snapshot Isolation e Serializable Snapshot Isolation.', '["Snapshot Isolation previne integralmente anomalias de Write Skew.", "Leituras em MVCC sempre bloqueiam escritas concorrentes na mesma linha."]'::jsonb, 8.20),
('n_ml_grad', 'CC-504', 'Otimizacao Estocastica e Redes Neurais', 'Inteligencia Artificial', 5, 'APPLY', 2.15, '{"n_calc_lin","n_algo_base"}', 'Backpropagation, regra da cadeia, gradiente descendente estocastico (SGD/Adam), regularizacao L2 e vanishing gradient.', '["Aumentar o numero de camadas sempre reduz o erro de generalizacao.", "Taxa de aprendizado alta sempre acelera a convergencia para o minimo global."]'::jsonb, 8.50),
('n_dist_raft', 'CC-601', 'Consenso Distribuido (Raft / Paxos) e Teorema CAP', 'Sistemas Distribuidos', 6, 'CREATE', 2.60, '{"n_deadlock_banker","n_routing_ospf","n_mvcc_iso"}', 'Replicacao de maquina de estados, eleicao de lider por quorum, split-brain, linearizabilidade e relogios logicos de Lamport.', '["Um mutex local protege recursos compartilhados entre nos separados por rede.", "E possivel garantir consistencia forte e disponibilidade total durante uma particao de rede."]'::jsonb, 9.30),
('n_bkt_trace', 'CC-604', 'Modelagem Bayesiana do Conhecimento (BKT)', 'IA Aplicada a Educacao', 6, 'EVALUATE', 2.40, '{"n_ml_grad","n_graph_theory"}', 'Modelos ocultos de Markov (HMM), estimacao de P(Lt) com Slip/Guess, curva de esquecimento de Ebbinghaus e calibracao Brier.', '["Acertar uma questao dificil uma vez implica P(Lt) igual a 1.0.", "Confianca subjetiva elevada do aluno equivale a dominio real do conceito."]'::jsonb, 8.95),
('n_compilers_ast', 'CC-701', 'Analise Sintatica AST e Verificacao de Invariantes', 'Compiladores e Seguranca', 7, 'CREATE', 2.55, '{"n_graph_theory","n_mutex_lock"}', 'Parsing de Arvores Sintaticas Abstratas (AST), grafos de fluxo de controle (CFG), analise estatica anti-escape e geracao de provas isomorficas.', '["Executar codigo arbitrario de aluno via eval() com try/except e seguro.", "Regex substitui analise sintatica na verificacao de escopo aninhado."]'::jsonb, 8.75)
ON CONFLICT (id) DO UPDATE SET
    code = EXCLUDED.code,
    title = EXCLUDED.title,
    discipline = EXCLUDED.discipline,
    semester = EXCLUDED.semester,
    bloom_level = EXCLUDED.bloom_level,
    complexity = EXCLUDED.complexity,
    prerequisites = EXCLUDED.prerequisites,
    description = EXCLUDED.description,
    fallacies = EXCLUDED.fallacies,
    keystone_score = EXCLUDED.keystone_score;

-- Estado inicial do estudante protagonista (RA 52319400 - Matheus Sousa dos Santos) e pares de comparacao
INSERT INTO public.simposio_student_states (ra, student_name, node_id, p_mastery, p_transit, p_guess, p_slip, stability_hours, last_practiced_at, brier_score, confidence_claimed, attempts_count)
VALUES
('52319400', 'Matheus Sousa dos Santos', 'n_algo_base', 0.9600, 0.2500, 0.1500, 0.0800, 420.00, NOW() - INTERVAL '18 hours', 0.0600, 0.9500, 6),
('52319400', 'Matheus Sousa dos Santos', 'n_calc_lin', 0.9100, 0.2200, 0.1400, 0.1000, 310.00, NOW() - INTERVAL '32 hours', 0.0900, 0.8800, 5),
('52319400', 'Matheus Sousa dos Santos', 'n_struct_data', 0.9400, 0.2400, 0.1400, 0.1000, 360.00, NOW() - INTERVAL '12 hours', 0.0800, 0.9200, 7),
('52319400', 'Matheus Sousa dos Santos', 'n_arch_cpu', 0.8900, 0.2000, 0.1500, 0.1000, 220.00, NOW() - INTERVAL '48 hours', 0.1000, 0.8500, 4),
('52319400', 'Matheus Sousa dos Santos', 'n_graph_theory', 0.9500, 0.2200, 0.0800, 0.1400, 390.00, NOW() - INTERVAL '6 hours', 0.0700, 0.9400, 8),
('52319400', 'Matheus Sousa dos Santos', 'n_os_proc', 0.8700, 0.2000, 0.1000, 0.1400, 180.00, NOW() - INTERVAL '38 hours', 0.1100, 0.8400, 5),
('52319400', 'Matheus Sousa dos Santos', 'n_net_osi', 0.8800, 0.2000, 0.1500, 0.1000, 210.00, NOW() - INTERVAL '60 hours', 0.1200, 0.8500, 4),
('52319400', 'Matheus Sousa dos Santos', 'n_mutex_lock', 0.8600, 0.2000, 0.0800, 0.1500, 140.00, NOW() - INTERVAL '22 hours', 0.1100, 0.8200, 6),
('52319400', 'Matheus Sousa dos Santos', 'n_db_acid', 0.8400, 0.2000, 0.1200, 0.1200, 150.00, NOW() - INTERVAL '52 hours', 0.1200, 0.8000, 4),
('52319400', 'Matheus Sousa dos Santos', 'n_routing_ospf', 0.7200, 0.2000, 0.0800, 0.1600, 64.00, NOW() - INTERVAL '46 hours', 0.1400, 0.7500, 3),
('52319400', 'Matheus Sousa dos Santos', 'n_deadlock_banker', 0.6800, 0.2000, 0.0800, 0.1600, 52.00, NOW() - INTERVAL '40 hours', 0.1300, 0.7000, 3),
('52319400', 'Matheus Sousa dos Santos', 'n_mvcc_iso', 0.5400, 0.2000, 0.0800, 0.1600, 36.00, NOW() - INTERVAL '72 hours', 0.1500, 0.6200, 2),
('52319400', 'Matheus Sousa dos Santos', 'n_ml_grad', 0.7900, 0.2200, 0.1200, 0.1200, 110.00, NOW() - INTERVAL '28 hours', 0.1000, 0.7800, 4),
('52319400', 'Matheus Sousa dos Santos', 'n_dist_raft', 0.4200, 0.1800, 0.0300, 0.2000, 24.00, NOW() - INTERVAL '30 hours', 0.1400, 0.4500, 2),
('52319400', 'Matheus Sousa dos Santos', 'n_bkt_trace', 0.9300, 0.2200, 0.0800, 0.1400, 350.00, NOW() - INTERVAL '4 hours', 0.0800, 0.9000, 7),
('52319400', 'Matheus Sousa dos Santos', 'n_compilers_ast', 0.9000, 0.2200, 0.0300, 0.2000, 280.00, NOW() - INTERVAL '10 hours', 0.0900, 0.8800, 5),

('52318812', 'Rafael Oliveira', 'n_algo_base', 0.6200, 0.2000, 0.2000, 0.1000, 48.00, NOW() - INTERVAL '96 hours', 0.3400, 0.9200, 3),
('52318812', 'Rafael Oliveira', 'n_struct_data', 0.4100, 0.2000, 0.1400, 0.1200, 20.00, NOW() - INTERVAL '120 hours', 0.4100, 0.8900, 4),
('52318812', 'Rafael Oliveira', 'n_mutex_lock', 0.2800, 0.2000, 0.0800, 0.1600, 14.00, NOW() - INTERVAL '84 hours', 0.4600, 0.9500, 4),
('52318812', 'Rafael Oliveira', 'n_dist_raft', 0.1400, 0.1800, 0.0300, 0.2000, 12.00, NOW() - INTERVAL '100 hours', 0.4800, 0.8500, 2),

('52317504', 'Beatriz Almeida', 'n_algo_base', 0.8900, 0.2200, 0.1800, 0.1000, 220.00, NOW() - INTERVAL '20 hours', 0.1200, 0.8200, 5),
('52317504', 'Beatriz Almeida', 'n_struct_data', 0.8500, 0.2000, 0.1400, 0.1200, 180.00, NOW() - INTERVAL '24 hours', 0.1300, 0.7800, 4),
('52317504', 'Beatriz Almeida', 'n_os_proc', 0.6600, 0.2000, 0.0800, 0.1600, 50.00, NOW() - INTERVAL '36 hours', 0.1600, 0.6500, 3),
('52317504', 'Beatriz Almeida', 'n_mutex_lock', 0.5900, 0.2000, 0.0800, 0.1600, 42.00, NOW() - INTERVAL '18 hours', 0.1500, 0.5500, 3)
ON CONFLICT (ra, node_id) DO UPDATE SET
    p_mastery = EXCLUDED.p_mastery,
    stability_hours = EXCLUDED.stability_hours,
    brier_score = EXCLUDED.brier_score,
    confidence_claimed = EXCLUDED.confidence_claimed,
    attempts_count = EXCLUDED.attempts_count;

-- Metricas Empiricas das 16 Semanas (Grupo Controle N=24 vs Grupo ThAthena MAX N=24)
INSERT INTO public.simposio_cohort_metrics (
    week_number, week_label,
    control_retention_pct, experimental_retention_pct,
    control_brier_score, experimental_brier_score,
    control_prereq_gap_pct, experimental_prereq_gap_pct,
    plagiarism_incidents_control, isomorphic_authenticity_pct
) VALUES
(1,  'Sem 01', 78.20, 79.10, 0.3400, 0.3300, 38.00, 36.50, 1, 100.00),
(2,  'Sem 02', 74.50, 81.40, 0.3500, 0.2950, 37.50, 30.20, 2, 100.00),
(3,  'Sem 03', 70.10, 83.00, 0.3550, 0.2680, 37.00, 24.80, 1, 100.00),
(4,  'Sem 04', 66.80, 84.60, 0.3600, 0.2410, 36.80, 20.10, 2, 100.00),
(5,  'Sem 05', 64.20, 85.90, 0.3620, 0.2150, 36.20, 16.40, 3, 100.00),
(6,  'Sem 06', 61.90, 87.20, 0.3650, 0.1940, 35.90, 13.50, 2, 100.00),
(7,  'Sem 07', 59.40, 88.10, 0.3680, 0.1780, 35.50, 11.20, 3, 100.00),
(8,  'Sem 08', 57.60, 89.00, 0.3710, 0.1620, 35.10, 9.40,  4, 100.00),
(9,  'Sem 09', 56.10, 89.80, 0.3740, 0.1490, 34.90, 8.10,  2, 100.00),
(10, 'Sem 10', 54.80, 90.40, 0.3750, 0.1380, 34.70, 7.00,  3, 100.00),
(11, 'Sem 11', 53.90, 90.90, 0.3760, 0.1290, 34.60, 6.10,  3, 100.00),
(12, 'Sem 12', 53.10, 91.30, 0.3780, 0.1220, 34.50, 5.20,  4, 100.00),
(13, 'Sem 13', 52.60, 91.70, 0.3790, 0.1180, 34.40, 4.60,  3, 100.00),
(14, 'Sem 14', 52.10, 92.10, 0.3790, 0.1140, 34.30, 4.10,  2, 100.00),
(15, 'Sem 15', 51.70, 92.40, 0.3800, 0.1120, 34.20, 3.80,  3, 100.00),
(16, 'Sem 16', 51.40, 92.60, 0.3800, 0.1100, 34.20, 3.60,  3, 100.00)
ON CONFLICT (week_number) DO UPDATE SET
    control_retention_pct = EXCLUDED.control_retention_pct,
    experimental_retention_pct = EXCLUDED.experimental_retention_pct,
    control_brier_score = EXCLUDED.control_brier_score,
    experimental_brier_score = EXCLUDED.experimental_brier_score,
    control_prereq_gap_pct = EXCLUDED.control_prereq_gap_pct,
    experimental_prereq_gap_pct = EXCLUDED.experimental_prereq_gap_pct;

-- Logs iniciais de sabatina socratica demonstrando deteccao de blefe vs rigor causal
INSERT INTO public.simposio_socratic_logs (id, ra, node_id, student_argument, confidence_declared, causal_rigor_score, bluff_detected, bloom_reached, inquisitor_response, counter_example, provider_used)
VALUES
('11111111-1111-4111-8111-111111111101', '52319400', 'n_mutex_lock', 'A instrucao i++ nao e atomica porque na CPU e decomposta em LOAD, ADD e STORE; logo, se o escalonador preemptivo interromper entre o LOAD e o STORE, duas threads sobescrevem o mesmo registrador gerando Lost Update, exigindo mutex ou instrucao atomica CAS.', 0.9000, 94.50, FALSE, 'ANALYZE', 'Deducao causal aprovada. Voce isolou a decomposicao em ciclos de barramento e o vetor de interferencia temporal. Elevando para nivel EVALUATE: como voce garante ausencia de deadlock caso duas threads precisem adquirir simultaneamente dois locks em contas bancarias distintas?', 'Se Thread A adquire Lock(origem) -> aguarda Lock(destino) e Thread B executa a transferencia reversa adquirindo Lock(destino) -> aguardando Lock(origem), estabelece-se ciclo no grafo de espera.', 'deterministic-hybrid'),
('11111111-1111-4111-8111-111111111102', '52318812', 'n_mutex_lock', 'Em resumo, usar locks ajuda a otimizar e melhorar o desempenho do sistema e e uma boa pratica para threads.', 0.9500, 12.00, TRUE, 'REMEMBER', 'ALERTA DE BLEFE E DISTORCAO DUNNING-KRUGER: Confianca declarada em 95%, mas sua resposta emprega apenas conectores genericos de IA sem especificar o mecanismo de interrupcao preemptiva nem a protecao da secao critica. Bloqueio de avanco mantido em n_mutex_lock.', 'Sem exclusao mutua sobre a instrucao de leitura-modificacao-escrita, 1000 incrementos paralelos convergem para valores aleatorios abaixo de 600 em testes empiricos.', 'deterministic-hybrid')
ON CONFLICT (id) DO NOTHING;

-- Submissoes isomorficas iniciais para demonstracao
INSERT INTO public.simposio_isomorphic_submissions (id, ra, exam_hash, topic_id, parameters_json, submitted_code, submitted_numeric, ast_invariants_passed, analytical_score, verdict, diagnostics)
VALUES
('22222222-2222-4222-8222-222222222201', '52319400', 'sha256:9f4b21c8e3d0', 'concurrency_saturation', '{"rate": 42, "latencyMs": 14, "frictionFactor": 1.35, "theoreticalCapacity": 52.91, "utilization": 0.794}'::jsonb, 'import threading\nlock = threading.Lock()\nbalance = 100\n\ndef withdraw(amount):\n    global balance\n    with lock:\n        balance -= amount', 52.9100, TRUE, 100.00, 'APROVADO COM RIGOR FORMAL', '["Capacidade teorica exata (52.91 req/s) demonstrada para a seed do RA 52319400.", "Invariante de exclusao mutua confirmada via gerenciador de contexto with lock."]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Feedback inicial da banca (exemplo de auditoria do comite)
INSERT INTO public.simposio_jury_feedback (id, evaluator_name, evaluator_role, innovation_score, pedagogical_score, impact_score, comments)
VALUES
('33333333-3333-4333-8333-333333333301', 'Comite de Pre-Auditoria CC UniMAX', 'Avaliacao Tecnica Interna', 2.0, 4.0, 4.0, 'Integracao exemplar entre E-DAG O(V+E), Gemeo Bayesiano O(1), Inquisidor Socratico anti-blefe e Provas Isomorficas com persistencia PostgreSQL em tempo real.')
ON CONFLICT (id) DO NOTHING;
