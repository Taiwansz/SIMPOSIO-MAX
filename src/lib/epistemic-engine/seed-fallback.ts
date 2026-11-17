import {
  CohortWeekMetric,
  EDAGNode,
  IsomorphicSubmission,
  JuryFeedback,
  SocraticLog,
  StudentNodeState,
} from "./types";

export const SEED_EDAG_NODES: EDAGNode[] = [
  {
    id: "n_algo_base",
    code: "CC-101",
    title: "Logica e Complexidade Assintotica",
    discipline: "Algoritmos e Programacao",
    semester: 1,
    bloom_level: "UNDERSTAND",
    complexity: 1.2,
    prerequisites: [],
    description:
      "Analise assintotica (Big-O, Omega, Theta), invariantes de laco e custo computacional de algoritmos fundamentais.",
    fallacies: [
      "Um algoritmo O(n^2) e sempre mais lento que um O(n) para qualquer entrada pequena.",
      "Memoria extra nunca reduz complexidade temporal.",
    ],
    keystone_score: 9.8,
  },
  {
    id: "n_calc_lin",
    code: "CC-104",
    title: "Algebra Linear e Espacos Vetoriais",
    discipline: "Matematica Computacional",
    semester: 1,
    bloom_level: "UNDERSTAND",
    complexity: 1.4,
    prerequisites: [],
    description:
      "Transformacoes lineares, multiplicacao matricial, autovalores, gradientes e representacao vetorial de dados.",
    fallacies: [
      "Normalizar vetores muda a direcao do gradiente descendente.",
      "Matrizes nao quadradas sempre possuem inversa.",
    ],
    keystone_score: 8.9,
  },
  {
    id: "n_struct_data",
    code: "CC-201",
    title: "Estruturas de Dados e Arvores Balanceadas",
    discipline: "Estruturas de Dados",
    semester: 2,
    bloom_level: "APPLY",
    complexity: 1.6,
    prerequisites: ["n_algo_base"],
    description:
      "Listas encadeadas, tabelas hash com resolucao de colisoes, heaps binarios e arvores AVL/Red-Black.",
    fallacies: [
      "Tabelas hash garantem busca O(1) no pior caso absoluto sem rehash.",
      "Uma arvore binaria de busca degenerada mantem altura O(log n).",
    ],
    keystone_score: 9.6,
  },
  {
    id: "n_arch_cpu",
    code: "CC-203",
    title: "Arquitetura de Computadores e Hierarquia de Cache",
    discipline: "Arquitetura de Hardware",
    semester: 2,
    bloom_level: "UNDERSTAND",
    complexity: 1.5,
    prerequisites: ["n_algo_base"],
    description:
      "Ciclo de instrucao (Fetch-Decode-Execute), atomicidade em nivel de barramento, cache L1/L2/L3 e coerencia MESI.",
    fallacies: [
      "A operacao i++ em linguagens de alto nivel executa em um unico ciclo atomico de CPU.",
      "Memoria cache L1 nao sofre invalidez entre nucleos.",
    ],
    keystone_score: 9.1,
  },
  {
    id: "n_graph_theory",
    code: "CC-301",
    title: "Teoria dos Grafos e Ordenacao Topologica",
    discipline: "Grafos e Otimizacao",
    semester: 3,
    bloom_level: "ANALYZE",
    complexity: 1.85,
    prerequisites: ["n_struct_data"],
    description:
      "Representacao por listas de adjacencia, busca BFS/DFS, algoritmo de Kahn O(V+E), caminho critico e deteccao de ciclos.",
    fallacies: [
      "Busca em largura (BFS) encontra o caminho minimo em grafos com pesos negativos.",
      "Todo grafo direcionado aceita ordenacao topologica.",
    ],
    keystone_score: 9.75,
  },
  {
    id: "n_os_proc",
    code: "CC-302",
    title: "Escalonamento Preemptivo e Processos",
    discipline: "Sistemas Operacionais",
    semester: 3,
    bloom_level: "ANALYZE",
    complexity: 1.75,
    prerequisites: ["n_arch_cpu", "n_struct_data"],
    description:
      "Troca de contexto, estados de processo, algoritmos Round-Robin, CFS e mitigacao de starvation via aging.",
    fallacies: [
      "Troca de contexto entre processos nao invalida TLB nem gera overhead.",
      "Prioridade estatica absoluta nunca causa starvation.",
    ],
    keystone_score: 8.8,
  },
  {
    id: "n_net_osi",
    code: "CC-304",
    title: "Arquitetura de Redes TCP/IP e Camadas OSI",
    discipline: "Redes de Computadores",
    semester: 3,
    bloom_level: "UNDERSTAND",
    complexity: 1.55,
    prerequisites: ["n_arch_cpu"],
    description:
      "Encapsulamento, controle de congestionamento TCP (AIMD), latencia de propagacao vs transmissao e enderecamento CIDR.",
    fallacies: [
      "TCP garante entrega imediata em tempo real sem jitter.",
      "Aumentar o tamanho da janela TCP sempre aumenta a vazao em links com perda.",
    ],
    keystone_score: 8.7,
  },
  {
    id: "n_mutex_lock",
    code: "CC-401",
    title: "Exclusao Mutua, Semaforos e Condicoes de Corrida",
    discipline: "Programacao Concorrente",
    semester: 4,
    bloom_level: "ANALYZE",
    complexity: 2.1,
    prerequisites: ["n_os_proc"],
    description:
      "Secoes criticas, operacoes atomicas Compare-And-Swap (CAS), Lost Update, spinlocks e travas reentrantes.",
    fallacies: [
      "Declarar uma variavel como volatile garante atomicidade composta.",
      "Usar locks de aplicacao resolve concorrencia entre multiplos processos sem IPC.",
    ],
    keystone_score: 9.4,
  },
  {
    id: "n_db_acid",
    code: "CC-402",
    title: "Engenharia de SGBDs, B+Trees e Durabilidade ACID",
    discipline: "Banco de Dados Avancado",
    semester: 4,
    bloom_level: "APPLY",
    complexity: 1.9,
    prerequisites: ["n_struct_data", "n_arch_cpu"],
    description:
      "Write-Ahead Logging (WAL), paginacao em disco, indices B+Tree e garantias de atomicidade e durabilidade.",
    fallacies: [
      "Escrever no buffer do sistema operacional garante durabilidade imediata apos queda de energia.",
      "Indices B+Tree aceleram igualmente operacoes de escrita pesada sem custo.",
    ],
    keystone_score: 8.6,
  },
  {
    id: "n_routing_ospf",
    code: "CC-404",
    title: "Protocolos de Roteamento Dinamico (OSPF / BGP)",
    discipline: "Redes Corporativas",
    semester: 4,
    bloom_level: "ANALYZE",
    complexity: 2.0,
    prerequisites: ["n_graph_theory", "n_net_osi"],
    description:
      "Algoritmo de Dijkstra em estado de enlace (OSPF), vetor de distancia (RIP), problema de Count-to-Infinity e politicas BGP.",
    fallacies: [
      "Vetor de distancia converge instantaneamente sem risco de loops de roteamento.",
      "OSPF escolhe rotas exclusivamente pela menor contagem de saltos.",
    ],
    keystone_score: 7.9,
  },
  {
    id: "n_deadlock_banker",
    code: "CC-501",
    title: "Prevencao de Deadlocks e Livelocks",
    discipline: "Sistemas Operacionais II",
    semester: 5,
    bloom_level: "EVALUATE",
    complexity: 2.25,
    prerequisites: ["n_mutex_lock"],
    description:
      "Condicoes de Coffman, ordenacao global de aquisicao de recursos, algoritmo do Banqueiro e deteccao por grafo de espera.",
    fallacies: [
      "Aumentar o timeout de espera elimina a causa raiz de deadlocks estruturais.",
      "Deadlock ocorre apenas quando ha mais de duas threads ativas.",
    ],
    keystone_score: 8.4,
  },
  {
    id: "n_mvcc_iso",
    code: "CC-502",
    title: "Controle de Concorrencia Multiversao (MVCC)",
    discipline: "Banco de Dados Distribuidos",
    semester: 5,
    bloom_level: "EVALUATE",
    complexity: 2.3,
    prerequisites: ["n_db_acid", "n_mutex_lock"],
    description:
      "Niveis de isolamento SQL, leitura suja, leitura fantasma, Write Skew em Snapshot Isolation e Serializable Snapshot Isolation.",
    fallacies: [
      "Snapshot Isolation previne integralmente anomalias de Write Skew.",
      "Leituras em MVCC sempre bloqueiam escritas concorrentes na mesma linha.",
    ],
    keystone_score: 8.2,
  },
  {
    id: "n_ml_grad",
    code: "CC-504",
    title: "Otimizacao Estocastica e Redes Neurais",
    discipline: "Inteligencia Artificial",
    semester: 5,
    bloom_level: "APPLY",
    complexity: 2.15,
    prerequisites: ["n_calc_lin", "n_algo_base"],
    description:
      "Backpropagation, regra da cadeia, gradiente descendente estocastico (SGD/Adam), regularizacao L2 e vanishing gradient.",
    fallacies: [
      "Aumentar o numero de camadas sempre reduz o erro de generalizacao.",
      "Taxa de aprendizado alta sempre acelera a convergencia para o minimo global.",
    ],
    keystone_score: 8.5,
  },
  {
    id: "n_dist_raft",
    code: "CC-601",
    title: "Consenso Distribuido (Raft / Paxos) e Teorema CAP",
    discipline: "Sistemas Distribuidos",
    semester: 6,
    bloom_level: "CREATE",
    complexity: 2.6,
    prerequisites: ["n_deadlock_banker", "n_routing_ospf", "n_mvcc_iso"],
    description:
      "Replicacao de maquina de estados, eleicao de lider por quorum, split-brain, linearizabilidade e relogios logicos de Lamport.",
    fallacies: [
      "Um mutex local protege recursos compartilhados entre nos separados por rede.",
      "E possivel garantir consistencia forte e disponibilidade total durante uma particao de rede.",
    ],
    keystone_score: 9.3,
  },
  {
    id: "n_bkt_trace",
    code: "CC-604",
    title: "Modelagem Bayesiana do Conhecimento (BKT)",
    discipline: "IA Aplicada a Educacao",
    semester: 6,
    bloom_level: "EVALUATE",
    complexity: 2.4,
    prerequisites: ["n_ml_grad", "n_graph_theory"],
    description:
      "Modelos ocultos de Markov (HMM), estimacao de P(Lt) com Slip/Guess, curva de esquecimento de Ebbinghaus e calibracao Brier.",
    fallacies: [
      "Acertar uma questao dificil uma vez implica P(Lt) igual a 1.0.",
      "Confianca subjetiva elevada do aluno equivale a dominio real do conceito.",
    ],
    keystone_score: 8.95,
  },
  {
    id: "n_compilers_ast",
    code: "CC-701",
    title: "Analise Sintatica AST e Verificacao de Invariantes",
    discipline: "Compiladores e Seguranca",
    semester: 7,
    bloom_level: "CREATE",
    complexity: 2.55,
    prerequisites: ["n_graph_theory", "n_mutex_lock"],
    description:
      "Parsing de Arvores Sintaticas Abstratas (AST), grafos de fluxo de controle (CFG), analise estatica anti-escape e geracao de provas isomorficas.",
    fallacies: [
      "Executar codigo arbitrario de aluno via eval() com try/except e seguro.",
      "Regex substitui analise sintatica na verificacao de escopo aninhado.",
    ],
    keystone_score: 8.75,
  },
];

const nowIso = new Date().toISOString();

export const SEED_STUDENT_STATES: StudentNodeState[] = [
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_algo_base", p_mastery: 0.96, p_transit: 0.25, p_guess: 0.15, p_slip: 0.08, stability_hours: 420, last_practiced_at: nowIso, brier_score: 0.06, confidence_claimed: 0.95, attempts_count: 6 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_calc_lin", p_mastery: 0.91, p_transit: 0.22, p_guess: 0.14, p_slip: 0.1, stability_hours: 310, last_practiced_at: nowIso, brier_score: 0.09, confidence_claimed: 0.88, attempts_count: 5 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_struct_data", p_mastery: 0.94, p_transit: 0.24, p_guess: 0.14, p_slip: 0.1, stability_hours: 360, last_practiced_at: nowIso, brier_score: 0.08, confidence_claimed: 0.92, attempts_count: 7 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_arch_cpu", p_mastery: 0.89, p_transit: 0.2, p_guess: 0.15, p_slip: 0.1, stability_hours: 220, last_practiced_at: nowIso, brier_score: 0.1, confidence_claimed: 0.85, attempts_count: 4 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_graph_theory", p_mastery: 0.95, p_transit: 0.22, p_guess: 0.08, p_slip: 0.14, stability_hours: 390, last_practiced_at: nowIso, brier_score: 0.07, confidence_claimed: 0.94, attempts_count: 8 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_os_proc", p_mastery: 0.87, p_transit: 0.2, p_guess: 0.1, p_slip: 0.14, stability_hours: 180, last_practiced_at: nowIso, brier_score: 0.11, confidence_claimed: 0.84, attempts_count: 5 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_net_osi", p_mastery: 0.88, p_transit: 0.2, p_guess: 0.15, p_slip: 0.1, stability_hours: 210, last_practiced_at: nowIso, brier_score: 0.12, confidence_claimed: 0.85, attempts_count: 4 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_mutex_lock", p_mastery: 0.86, p_transit: 0.2, p_guess: 0.08, p_slip: 0.15, stability_hours: 140, last_practiced_at: nowIso, brier_score: 0.11, confidence_claimed: 0.82, attempts_count: 6 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_db_acid", p_mastery: 0.84, p_transit: 0.2, p_guess: 0.12, p_slip: 0.12, stability_hours: 150, last_practiced_at: nowIso, brier_score: 0.12, confidence_claimed: 0.8, attempts_count: 4 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_routing_ospf", p_mastery: 0.72, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 64, last_practiced_at: nowIso, brier_score: 0.14, confidence_claimed: 0.75, attempts_count: 3 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_deadlock_banker", p_mastery: 0.68, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 52, last_practiced_at: nowIso, brier_score: 0.13, confidence_claimed: 0.7, attempts_count: 3 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_mvcc_iso", p_mastery: 0.54, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 36, last_practiced_at: nowIso, brier_score: 0.15, confidence_claimed: 0.62, attempts_count: 2 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_ml_grad", p_mastery: 0.79, p_transit: 0.22, p_guess: 0.12, p_slip: 0.12, stability_hours: 110, last_practiced_at: nowIso, brier_score: 0.1, confidence_claimed: 0.78, attempts_count: 4 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_dist_raft", p_mastery: 0.42, p_transit: 0.18, p_guess: 0.03, p_slip: 0.2, stability_hours: 24, last_practiced_at: nowIso, brier_score: 0.14, confidence_claimed: 0.45, attempts_count: 2 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_bkt_trace", p_mastery: 0.93, p_transit: 0.22, p_guess: 0.08, p_slip: 0.14, stability_hours: 350, last_practiced_at: nowIso, brier_score: 0.08, confidence_claimed: 0.9, attempts_count: 7 },
  { ra: "52319400", student_name: "Matheus Sousa dos Santos", node_id: "n_compilers_ast", p_mastery: 0.9, p_transit: 0.22, p_guess: 0.03, p_slip: 0.2, stability_hours: 280, last_practiced_at: nowIso, brier_score: 0.09, confidence_claimed: 0.88, attempts_count: 5 },
  { ra: "52318812", student_name: "Rafael Oliveira", node_id: "n_algo_base", p_mastery: 0.62, p_transit: 0.2, p_guess: 0.2, p_slip: 0.1, stability_hours: 48, last_practiced_at: nowIso, brier_score: 0.34, confidence_claimed: 0.92, attempts_count: 3 },
  { ra: "52318812", student_name: "Rafael Oliveira", node_id: "n_struct_data", p_mastery: 0.41, p_transit: 0.2, p_guess: 0.14, p_slip: 0.12, stability_hours: 20, last_practiced_at: nowIso, brier_score: 0.41, confidence_claimed: 0.89, attempts_count: 4 },
  { ra: "52318812", student_name: "Rafael Oliveira", node_id: "n_mutex_lock", p_mastery: 0.28, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 14, last_practiced_at: nowIso, brier_score: 0.46, confidence_claimed: 0.95, attempts_count: 4 },
  { ra: "52318812", student_name: "Rafael Oliveira", node_id: "n_dist_raft", p_mastery: 0.14, p_transit: 0.18, p_guess: 0.03, p_slip: 0.2, stability_hours: 12, last_practiced_at: nowIso, brier_score: 0.48, confidence_claimed: 0.85, attempts_count: 2 },
  { ra: "52317504", student_name: "Beatriz Almeida", node_id: "n_algo_base", p_mastery: 0.89, p_transit: 0.22, p_guess: 0.18, p_slip: 0.1, stability_hours: 220, last_practiced_at: nowIso, brier_score: 0.12, confidence_claimed: 0.82, attempts_count: 5 },
  { ra: "52317504", student_name: "Beatriz Almeida", node_id: "n_struct_data", p_mastery: 0.85, p_transit: 0.2, p_guess: 0.14, p_slip: 0.12, stability_hours: 180, last_practiced_at: nowIso, brier_score: 0.13, confidence_claimed: 0.78, attempts_count: 4 },
  { ra: "52317504", student_name: "Beatriz Almeida", node_id: "n_os_proc", p_mastery: 0.66, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 50, last_practiced_at: nowIso, brier_score: 0.16, confidence_claimed: 0.65, attempts_count: 3 },
  { ra: "52317504", student_name: "Beatriz Almeida", node_id: "n_mutex_lock", p_mastery: 0.59, p_transit: 0.2, p_guess: 0.08, p_slip: 0.16, stability_hours: 42, last_practiced_at: nowIso, brier_score: 0.15, confidence_claimed: 0.55, attempts_count: 3 },
];

export const SEED_COHORT_METRICS: CohortWeekMetric[] = [
  { week_number: 1, week_label: "Sem 01", control_retention_pct: 78.2, experimental_retention_pct: 79.1, control_brier_score: 0.34, experimental_brier_score: 0.33, control_prereq_gap_pct: 38.0, experimental_prereq_gap_pct: 36.5, plagiarism_incidents_control: 1, isomorphic_authenticity_pct: 100 },
  { week_number: 2, week_label: "Sem 02", control_retention_pct: 74.5, experimental_retention_pct: 81.4, control_brier_score: 0.35, experimental_brier_score: 0.295, control_prereq_gap_pct: 37.5, experimental_prereq_gap_pct: 30.2, plagiarism_incidents_control: 2, isomorphic_authenticity_pct: 100 },
  { week_number: 3, week_label: "Sem 03", control_retention_pct: 70.1, experimental_retention_pct: 83.0, control_brier_score: 0.355, experimental_brier_score: 0.268, control_prereq_gap_pct: 37.0, experimental_prereq_gap_pct: 24.8, plagiarism_incidents_control: 1, isomorphic_authenticity_pct: 100 },
  { week_number: 4, week_label: "Sem 04", control_retention_pct: 66.8, experimental_retention_pct: 84.6, control_brier_score: 0.36, experimental_brier_score: 0.241, control_prereq_gap_pct: 36.8, experimental_prereq_gap_pct: 20.1, plagiarism_incidents_control: 2, isomorphic_authenticity_pct: 100 },
  { week_number: 5, week_label: "Sem 05", control_retention_pct: 64.2, experimental_retention_pct: 85.9, control_brier_score: 0.362, experimental_brier_score: 0.215, control_prereq_gap_pct: 36.2, experimental_prereq_gap_pct: 16.4, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 6, week_label: "Sem 06", control_retention_pct: 61.9, experimental_retention_pct: 87.2, control_brier_score: 0.365, experimental_brier_score: 0.194, control_prereq_gap_pct: 35.9, experimental_prereq_gap_pct: 13.5, plagiarism_incidents_control: 2, isomorphic_authenticity_pct: 100 },
  { week_number: 7, week_label: "Sem 07", control_retention_pct: 59.4, experimental_retention_pct: 88.1, control_brier_score: 0.368, experimental_brier_score: 0.178, control_prereq_gap_pct: 35.5, experimental_prereq_gap_pct: 11.2, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 8, week_label: "Sem 08", control_retention_pct: 57.6, experimental_retention_pct: 89.0, control_brier_score: 0.371, experimental_brier_score: 0.162, control_prereq_gap_pct: 35.1, experimental_prereq_gap_pct: 9.4, plagiarism_incidents_control: 4, isomorphic_authenticity_pct: 100 },
  { week_number: 9, week_label: "Sem 09", control_retention_pct: 56.1, experimental_retention_pct: 89.8, control_brier_score: 0.374, experimental_brier_score: 0.149, control_prereq_gap_pct: 34.9, experimental_prereq_gap_pct: 8.1, plagiarism_incidents_control: 2, isomorphic_authenticity_pct: 100 },
  { week_number: 10, week_label: "Sem 10", control_retention_pct: 54.8, experimental_retention_pct: 90.4, control_brier_score: 0.375, experimental_brier_score: 0.138, control_prereq_gap_pct: 34.7, experimental_prereq_gap_pct: 7.0, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 11, week_label: "Sem 11", control_retention_pct: 53.9, experimental_retention_pct: 90.9, control_brier_score: 0.376, experimental_brier_score: 0.129, control_prereq_gap_pct: 34.6, experimental_prereq_gap_pct: 6.1, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 12, week_label: "Sem 12", control_retention_pct: 53.1, experimental_retention_pct: 91.3, control_brier_score: 0.378, experimental_brier_score: 0.122, control_prereq_gap_pct: 34.5, experimental_prereq_gap_pct: 5.2, plagiarism_incidents_control: 4, isomorphic_authenticity_pct: 100 },
  { week_number: 13, week_label: "Sem 13", control_retention_pct: 52.6, experimental_retention_pct: 91.7, control_brier_score: 0.379, experimental_brier_score: 0.118, control_prereq_gap_pct: 34.4, experimental_prereq_gap_pct: 4.6, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 14, week_label: "Sem 14", control_retention_pct: 52.1, experimental_retention_pct: 92.1, control_brier_score: 0.379, experimental_brier_score: 0.114, control_prereq_gap_pct: 34.3, experimental_prereq_gap_pct: 4.1, plagiarism_incidents_control: 2, isomorphic_authenticity_pct: 100 },
  { week_number: 15, week_label: "Sem 15", control_retention_pct: 51.7, experimental_retention_pct: 92.4, control_brier_score: 0.38, experimental_brier_score: 0.112, control_prereq_gap_pct: 34.2, experimental_prereq_gap_pct: 3.8, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
  { week_number: 16, week_label: "Sem 16", control_retention_pct: 51.4, experimental_retention_pct: 92.6, control_brier_score: 0.38, experimental_brier_score: 0.11, control_prereq_gap_pct: 34.2, experimental_prereq_gap_pct: 3.6, plagiarism_incidents_control: 3, isomorphic_authenticity_pct: 100 },
];

export const SEED_SOCRATIC_LOGS: SocraticLog[] = [
  {
    id: "11111111-1111-4111-8111-111111111101",
    ra: "52319400",
    node_id: "n_mutex_lock",
    student_argument:
      "A instrucao i++ nao e atomica porque na CPU e decomposta em LOAD, ADD e STORE; logo, se o escalonador preemptivo interromper entre o LOAD e o STORE, duas threads sobescrevem o mesmo registrador gerando Lost Update, exigindo mutex ou instrucao atomica CAS.",
    confidence_declared: 0.9,
    causal_rigor_score: 94.5,
    bluff_detected: false,
    bloom_reached: "ANALYZE",
    inquisitor_response:
      "Deducao causal aprovada. Voce isolou a decomposicao em ciclos de barramento e o vetor de interferencia temporal. Elevando para nivel EVALUATE: como voce garante ausencia de deadlock caso duas threads precisem adquirir simultaneamente dois locks em contas bancarias distintas?",
    counter_example:
      "Se Thread A adquire Lock(origem) e aguarda Lock(destino) enquanto Thread B adquire Lock(destino) e aguarda Lock(origem), estabelece-se ciclo no grafo de espera.",
    provider_used: "deterministic-hybrid",
    created_at: nowIso,
  },
  {
    id: "11111111-1111-4111-8111-111111111102",
    ra: "52318812",
    node_id: "n_mutex_lock",
    student_argument:
      "Em resumo, usar locks ajuda a otimizar e melhorar o desempenho do sistema e e uma boa pratica para threads.",
    confidence_declared: 0.95,
    causal_rigor_score: 12.0,
    bluff_detected: true,
    bloom_reached: "REMEMBER",
    inquisitor_response:
      "ALERTA DE BLEFE E DISTORCAO DUNNING-KRUGER: Confianca declarada em 95%, mas sua resposta emprega apenas conectores genericos de IA sem especificar o mecanismo de interrupcao preemptiva nem a protecao da secao critica. Bloqueio de avanco mantido em n_mutex_lock.",
    counter_example:
      "Sem exclusao mutua sobre a instrucao de leitura-modificacao-escrita, 1000 incrementos paralelos convergem para valores aleatorios abaixo de 600 em testes empiricos.",
    provider_used: "deterministic-hybrid",
    created_at: nowIso,
  },
];

export const SEED_ISOMORPHIC_SUBMISSIONS: IsomorphicSubmission[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    ra: "52319400",
    exam_hash: "sha256:9f4b21c8e3d0",
    topic_id: "concurrency_saturation",
    parameters_json: {
      rate: 42,
      latencyMs: 14,
      frictionFactor: 1.35,
      theoreticalCapacity: 52.91,
      utilization: 0.794,
      criticalNodesCount: 6,
    },
    submitted_code:
      "import threading\nlock = threading.Lock()\nbalance = 100\n\ndef withdraw(amount):\n    global balance\n    with lock:\n        balance -= amount",
    submitted_numeric: 52.91,
    ast_invariants_passed: true,
    analytical_score: 100,
    verdict: "APROVADO COM RIGOR FORMAL",
    diagnostics: [
      "Capacidade teorica exata (52.91 req/s) demonstrada para a seed do RA 52319400.",
      "Invariante de exclusao mutua confirmada via gerenciador de contexto with lock.",
    ],
    created_at: nowIso,
  },
];

export const SEED_JURY_FEEDBACK: JuryFeedback[] = [
  {
    id: "33333333-3333-4333-8333-333333333301",
    evaluator_name: "Comite de Pre-Auditoria CC UniMAX",
    evaluator_role: "Avaliacao Tecnica Interna",
    innovation_score: 2.0,
    pedagogical_score: 4.0,
    impact_score: 4.0,
    comments:
      "Integracao exemplar entre E-DAG O(V+E), Gemeo Bayesiano O(1), Inquisidor Socratico anti-blefe e Provas Isomorficas com persistencia PostgreSQL em tempo real.",
    created_at: nowIso,
  },
];
