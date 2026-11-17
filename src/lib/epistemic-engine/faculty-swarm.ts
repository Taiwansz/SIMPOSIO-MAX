import { FacultyDefenseEvaluation, MultiRoundDefenseResult } from "./types";

interface FacultyAgentSpec {
  domainId: string;
  agentTitle: string;
  subject: string;
  requiredSignals: string[];
  toolsUsed: string[];
}

const FACULTY_PANEL: FacultyAgentSpec[] = [
  {
    domainId: "so",
    agentTitle: "Prof. Catedratico de Sistemas Operacionais & Kernel",
    subject: "Concorrencia & Exclusao Mutua",
    requiredSignals: ["mutex", "lock", "cas", "atomico", "atomica", "preemptivo", "deadlock", "fsync"],
    toolsUsed: ["ast_invariant_auditor", "lock_order_tracer"],
  },
  {
    domainId: "distribuidos",
    agentTitle: "Prof. Catedratico de Sistemas Distribuidos & Consenso",
    subject: "Sistemas Distribuidos & Redes",
    requiredSignals: ["raft", "paxos", "quorum", "consenso", "wal", "particao", "cap", "linearizabilidade"],
    toolsUsed: ["raft_quorum_verifier", "partition_fault_injector"],
  },
  {
    domainId: "algoritmos",
    agentTitle: "Prof. Catedratico de Grafos, Algoritmos & Pedagogia Formal",
    subject: "Topologia Epistemica & Complexidade",
    requiredSignals: ["o(v+e)", "o(v + e)", "kahn", "dag", "bkt", "brier", "ebbinghaus", "complexidade", "invariante"],
    toolsUsed: ["edag_kahn_compiler", "brier_calibration_auditor"],
  },
];

/**
 * Executa banca examinadora multidisciplinar concorrente sobre a proposta tecnica do estudante,
 * detectando tensoes arquiteturais cruzadas entre disciplinas.
 */
export function runInterdisciplinaryDefense(
  projectTitle: string,
  studentProposal: string,
  baselineApprovalCount = 1
): MultiRoundDefenseResult {
  const norm = studentProposal
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const wordCount = norm.split(/\s+/).filter(Boolean).length;

  const evaluations: FacultyDefenseEvaluation[] = FACULTY_PANEL.map((agent) => {
    const hits = agent.requiredSignals.filter((sig) => norm.includes(sig));
    const score = Math.min(100, Math.round(25 + hits.length * 22 + (wordCount >= 22 ? 15 : 0)));
    const approved = hits.length >= 2 && wordCount >= 14;

    const critique = approved
      ? `Validado sob a otica de ${agent.subject}. Evidencia de rigor tecnico localizada (${hits.join(", ")}).`
      : `Insuficiencia formal em ${agent.subject}: faltam garantias explicitas (${agent.requiredSignals
          .slice(0, 4)
          .join(", ")}). Propostas baseadas em jargoes nao passam pela arguicao.`;

    return {
      agentTitle: agent.agentTitle,
      subject: agent.subject,
      approved,
      score,
      critique,
      toolsUsed: agent.toolsUsed,
    };
  });

  const crossCuttingTensions: MultiRoundDefenseResult["crossCuttingTensions"] = [];

  if (
    (norm.includes("lock") || norm.includes("mutex")) &&
    !norm.includes("raft") &&
    !norm.includes("paxos") &&
    !norm.includes("consenso") &&
    !norm.includes("quorum")
  ) {
    crossCuttingTensions.push({
      domains: ["Sistemas Operacionais", "Sistemas Distribuidos"],
      tension: "Tensao de Escopo Concorrente Local vs. Distribuido",
      critique:
        "A proposta aplica travas locais (mutex/lock) sem especificar protocolo de consenso ou quorum distribuido entre nos distintos.",
    });
  }

  if (
    (norm.includes("cache") || norm.includes("buffer") || norm.includes("memoria")) &&
    !norm.includes("wal") &&
    !norm.includes("fsync") &&
    !norm.includes("durabilidade")
  ) {
    crossCuttingTensions.push({
      domains: ["Sistemas Operacionais", "Engenharia de Dados"],
      tension: "Tensao de Durabilidade ACID vs. Page Cache",
      critique:
        "Escritas em buffer volatil de sistema operacional nao asseguram durabilidade sem Write-Ahead Logging (WAL) e persistencia explicita via fsync.",
    });
  }

  const approvedCount = evaluations.filter((e) => e.approved).length;
  const total = evaluations.length;
  const epistemicDelta = Number(
    (approvedCount / total - baselineApprovalCount / total).toFixed(3)
  );

  let verdict = "REPROVADO POR INSUFICIENCIA TEORICA MULTIDISCIPLINAR";
  if (approvedCount === total && crossCuttingTensions.length === 0) {
    verdict = "APROVADO COM DISTINCAO PELA BANCA";
  } else if (approvedCount >= 2) {
    verdict = "APROVADO COM RESSALVAS E RETIFICACOES OBRIGATORIAS";
  }

  return {
    projectTitle: projectTitle.trim() || "Arquitetura Epistemica Proposta",
    verdict,
    approvalRatio: `${approvedCount}/${total}`,
    epistemicDelta,
    evaluations,
    crossCuttingTensions,
  };
}
