import {
  ArenaResponse,
  AuthorshipProof,
  AutopsyCase,
  AutopsyLog,
  CohortResultWeek,
  JuryVote,
} from "./types";

const nowIso = new Date().toISOString();

export const SEED_AUTOPSY_CASES: AutopsyCase[] = [
  {
    id: "case_comp_pix",
    area: "Computacao",
    title: "Saque Duplicado Gerado por IA",
    summary:
      "A IA gerou uma funcao de transferencia que passa em testes simples, mas quebra quando varios usuarios clicam juntos.",
    ai_output_lines: [
      "function transferir(conta, valor) {",
      "  const saldo = lerSaldoNoBanco(conta);",
      "  if (saldo >= valor) {",
      "    gravarNovoSaldo(conta, saldo - valor);",
      '    return "Transferencia concluida";',
      "  }",
      '  return "Saldo insuficiente";',
      "}",
    ],
    fault_line_index: 3,
    trigger_param_name: "Acessos no mesmo segundo",
    trigger_param_unit: "req/s",
    trigger_min: 1,
    trigger_max: 50,
    trigger_break_threshold: 8,
    safe_fix_options: [
      { id: "fix_sleep", label: "Adicionar pausa de 100ms antes de gravar" },
      { id: "fix_lock", label: "Usar trava no banco ou atualizacao atomica (saldo >= valor)" },
      { id: "fix_log", label: "Imprimir o saldo no console antes do retorno" },
    ],
    correct_fix_id: "fix_lock",
    explanation_simple:
      "Sem trava atomica, duas requisicoes leem o mesmo saldo ao mesmo tempo e ambas aprovam o saque antes da gravacao.",
  },
  {
    id: "case_health_triage",
    area: "Saude",
    title: "Triagem Medica Ignorando Hipoxia",
    summary:
      "Um resumo clinico automatico classificou o paciente como risco baixo porque olhou apenas para a temperatura.",
    ai_output_lines: [
      "Resumo automatico de triagem:",
      "Paciente sem febre (36.8 C) e com pressao estavel.",
      "Frequencia cardiaca em 114 bpm compensada.",
      "Saturacao de oxigenio caiu de 98% para 88%.",
      "Classificacao da IA: Alta hospitalar com orientacao leve.",
      "Nenhuma urgencia respiratoria identificada.",
    ],
    fault_line_index: 4,
    trigger_param_name: "Queda de oxigenio no sangue",
    trigger_param_unit: "% SpO2",
    trigger_min: 82,
    trigger_max: 99,
    trigger_break_threshold: 92,
    safe_fix_options: [
      { id: "fix_temp", label: "Repetir apenas o exame de temperatura em 2 horas" },
      { id: "fix_spo2", label: "Bloquear alta quando SpO2 estiver abaixo de 92% e acionar equipe" },
      { id: "fix_water", label: "Recomendar hidratacao oral e retorno em 7 dias" },
    ],
    correct_fix_id: "fix_spo2",
    explanation_simple:
      "A IA se deixou levar pelo texto normal de temperatura e ignorou um sinal vital critico de queda de oxigenio.",
  },
  {
    id: "case_biz_contract",
    area: "Negocios",
    title: "Contrato Aprovado por Bajulacao",
    summary:
      "Ao receber um pedido apressado do usuario, a IA concordou com o prazo e deixou passar uma multa oculta no contrato.",
    ai_output_lines: [
      "Parecer rapido de revisao contratual:",
      "O cliente pediu aprovacao ainda hoje para fechar a venda.",
      "Valor mensal alinhado com o orcamento da empresa.",
      "Clausula 9.2: multa de 40% mesmo se houver atraso do fornecedor.",
      "Recomendacao da IA: Assinar imediatamente sem alteracoes.",
      "Risco financeiro classificado como minimo.",
    ],
    fault_line_index: 4,
    trigger_param_name: "Pressao do usuario no prompt",
    trigger_param_unit: "% urgencia",
    trigger_min: 10,
    trigger_max: 100,
    trigger_break_threshold: 60,
    safe_fix_options: [
      { id: "fix_fast", label: "Reduzir o texto do contrato para ficar mais curto" },
      { id: "fix_clause", label: "Exigir revisao da Clausula 9.2 e retirar o vies de urgencia" },
      { id: "fix_sign", label: "Aceitar a multa porque o valor mensal esta dentro do esperado" },
    ],
    correct_fix_id: "fix_clause",
    explanation_simple:
      "Modelos tendem a concordar com a pressa do usuario e mascaram riscos graves escondidos nas clausulas.",
  },
];

export const SEED_AUTOPSY_LOGS: AutopsyLog[] = [
  {
    id: "44444444-4444-4444-8444-444444444401",
    student_name: "Matheus Sousa dos Santos",
    ra: "52319400",
    case_id: "case_comp_pix",
    selected_line: 3,
    selected_fix_id: "fix_lock",
    solved: true,
    created_at: nowIso,
  },
  {
    id: "44444444-4444-4444-8444-444444444402",
    student_name: "Beatriz Almeida",
    ra: "52317504",
    case_id: "case_health_triage",
    selected_line: 4,
    selected_fix_id: "fix_spo2",
    solved: true,
    created_at: nowIso,
  },
];

export const SEED_AUTHORSHIP_PROOFS: AuthorshipProof[] = [
  {
    id: "55555555-5555-4555-8555-555555555501",
    student_name: "Matheus Sousa dos Santos",
    ra: "52319400",
    artifact_title: "Controle de Saque Seguro",
    mutated_line: 2,
    elapsed_seconds: 19,
    passed: true,
    proof_hash: "veritas-52319400-8a91c4",
    created_at: nowIso,
  },
];

export const SEED_ARENA_RESPONSES: ArenaResponse[] = [
  {
    id: "66666666-6666-4666-8666-666666666601",
    session_code: "UNIMAX-2026",
    participant_name: "Rafael Oliveira",
    role: "Estudante",
    response_text:
      "A inteligencia artificial ajuda muito na produtividade dos estudos e otimiza os resultados de maneira geral na faculdade.",
    coord_x: 24,
    coord_y: 32,
    uniqueness_score: 18,
    created_at: nowIso,
  },
  {
    id: "66666666-6666-4666-8666-666666666602",
    session_code: "UNIMAX-2026",
    participant_name: "Camila Ferreira",
    role: "Estudante",
    response_text:
      "A inteligencia artificial otimiza os resultados nos estudos e ajuda bastante a melhorar a produtividade geral dos alunos.",
    coord_x: 26.5,
    coord_y: 34,
    uniqueness_score: 16,
    created_at: nowIso,
  },
  {
    id: "66666666-6666-4666-8666-666666666603",
    session_code: "UNIMAX-2026",
    participant_name: "Matheus Sousa dos Santos",
    role: "Estudante",
    response_text:
      "A IA nao assina responsabilidade tecnica: quando o banco trava em concorrencia ou um laudo erra, a resposta so e valida se o humano souber auditar a falha.",
    coord_x: 78,
    coord_y: 74,
    uniqueness_score: 91,
    created_at: nowIso,
  },
  {
    id: "66666666-6666-4666-8666-666666666604",
    session_code: "UNIMAX-2026",
    participant_name: "Profa. Helena Martins",
    role: "Docente",
    response_text:
      "Avaliar hoje exige medir a capacidade de o estudante explicar o proprio trabalho sob mudanca de regras, e nao apenas corrigir textos prontos.",
    coord_x: 71,
    coord_y: 26,
    uniqueness_score: 86,
    created_at: nowIso,
  },
];

export const SEED_COHORT_RESULTS: CohortResultWeek[] = [
  { week_number: 1, week_label: "S01", control_autonomy_pct: 64.0, veritas_autonomy_pct: 65.0, herd_collapse_pct: 42.0, veritas_originality_pct: 58.0 },
  { week_number: 2, week_label: "S02", control_autonomy_pct: 61.5, veritas_autonomy_pct: 68.4, herd_collapse_pct: 45.0, veritas_originality_pct: 63.0 },
  { week_number: 3, week_label: "S03", control_autonomy_pct: 59.0, veritas_autonomy_pct: 71.8, herd_collapse_pct: 48.0, veritas_originality_pct: 67.5 },
  { week_number: 4, week_label: "S04", control_autonomy_pct: 57.2, veritas_autonomy_pct: 74.9, herd_collapse_pct: 51.0, veritas_originality_pct: 71.2 },
  { week_number: 5, week_label: "S05", control_autonomy_pct: 55.8, veritas_autonomy_pct: 77.6, herd_collapse_pct: 53.5, veritas_originality_pct: 74.8 },
  { week_number: 6, week_label: "S06", control_autonomy_pct: 54.5, veritas_autonomy_pct: 80.1, herd_collapse_pct: 55.0, veritas_originality_pct: 77.9 },
  { week_number: 7, week_label: "S07", control_autonomy_pct: 53.6, veritas_autonomy_pct: 82.5, herd_collapse_pct: 56.8, veritas_originality_pct: 80.4 },
  { week_number: 8, week_label: "S08", control_autonomy_pct: 52.8, veritas_autonomy_pct: 84.7, herd_collapse_pct: 58.2, veritas_originality_pct: 82.9 },
  { week_number: 9, week_label: "S09", control_autonomy_pct: 52.1, veritas_autonomy_pct: 86.4, herd_collapse_pct: 59.4, veritas_originality_pct: 84.8 },
  { week_number: 10, week_label: "S10", control_autonomy_pct: 51.6, veritas_autonomy_pct: 88.0, herd_collapse_pct: 60.5, veritas_originality_pct: 86.3 },
  { week_number: 11, week_label: "S11", control_autonomy_pct: 51.2, veritas_autonomy_pct: 89.2, herd_collapse_pct: 61.2, veritas_originality_pct: 87.9 },
  { week_number: 12, week_label: "S12", control_autonomy_pct: 50.8, veritas_autonomy_pct: 90.3, herd_collapse_pct: 62.0, veritas_originality_pct: 89.1 },
  { week_number: 13, week_label: "S13", control_autonomy_pct: 50.5, veritas_autonomy_pct: 91.1, herd_collapse_pct: 62.5, veritas_originality_pct: 90.4 },
  { week_number: 14, week_label: "S14", control_autonomy_pct: 50.2, veritas_autonomy_pct: 91.8, herd_collapse_pct: 63.1, veritas_originality_pct: 91.5 },
  { week_number: 15, week_label: "S15", control_autonomy_pct: 50.0, veritas_autonomy_pct: 92.3, herd_collapse_pct: 63.6, veritas_originality_pct: 92.2 },
  { week_number: 16, week_label: "S16", control_autonomy_pct: 49.8, veritas_autonomy_pct: 92.8, herd_collapse_pct: 64.0, veritas_originality_pct: 93.0 },
];

export const SEED_JURY_VOTES: JuryVote[] = [
  {
    id: "77777777-7777-4777-8777-777777777701",
    evaluator_name: "Auditoria Inicial UniMAX",
    innovation_score: 2.0,
    pedagogical_score: 4.0,
    impact_score: 4.0,
    note: "Abordagem inedita que coloca a IA sob exame forense humano e mede a originalidade da sala em tempo real.",
    created_at: nowIso,
  },
];
