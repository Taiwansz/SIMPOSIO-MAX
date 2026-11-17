import { BloomLevel, EDAGNode, EpistemicRigorAnalysis } from "./types";

const FLUFF_PATTERNS: Array<{ regex: RegExp; label: string }> = [
  { regex: /em\s+resumo/i, label: "em resumo" },
  { regex: /como\s+podemos\s+ver/i, label: "como podemos ver" },
  { regex: /de\s+maneira\s+geral/i, label: "de maneira geral" },
  { regex: /e\s+muito\s+importante/i, label: "e muito importante" },
  { regex: /ajuda\s+a\s+otimizar/i, label: "ajuda a otimizar" },
  { regex: /para\s+melhorar\s+o\s+desempenho/i, label: "para melhorar o desempenho" },
  { regex: /e\s+uma\s+boa\s+pratica/i, label: "e uma boa pratica" },
  { regex: /fundamental\s+para\s+o\s+sucesso/i, label: "fundamental para o sucesso" },
  { regex: /proporciona\s+maior\s+eficiencia/i, label: "proporciona maior eficiencia" },
];

const CAUSAL_CONNECTORS = [
  "porque",
  "pois",
  "visto que",
  "ja que",
  "resulta em",
  "implica",
  "portanto",
  "logo",
  "causa",
  "consequentemente",
  "dado que",
  "se ",
  "quando ",
  "entao",
];

const MECHANISTIC_VOCABULARY = [
  "invariante",
  "complexidade",
  "assintotico",
  "atomica",
  "atomico",
  "registrador",
  "barramento",
  "preemptivo",
  "lost update",
  "deadlock",
  "mutex",
  "cas",
  "compare-and-swap",
  "grafo",
  "ciclo",
  "kahn",
  "topologica",
  "brier",
  "ebbinghaus",
  "bayesian",
  "gradiente",
  "backpropagation",
  "dijkstra",
  "quorum",
  "raft",
  "paxos",
  "mvcc",
  "snapshot",
  "write skew",
  "wal",
  "fsync",
  "tlb",
  "cache",
  "mesi",
  "ast",
  "o(v + e)",
  "o(v+e)",
  "o(1)",
  "o(log n)",
  "o(n log n)",
  "starvation",
  "aging",
  "fifo",
  "cap",
  "particao",
];

const NEGATION_TOKENS = [
  "nao",
  "falso",
  "falsa",
  "incorreto",
  "incorreta",
  "falacia",
  "equivoco",
  "refuta",
  "invalido",
  "invalida",
  "errado",
  "errada",
  "jamais",
  "impossivel",
];

function normalizeText(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Gera um contra-exemplo concreto e cenario de falha em producao
 * especifico para o conceito do E-DAG selecionado.
 */
export function generateCounterExampleParadox(node: EDAGNode): {
  paradoxTitle: string;
  counterExample: string;
  probeQuestion: string;
} {
  const id = node.id;
  if (id.includes("mutex") || id.includes("deadlock") || id.includes("os_proc")) {
    return {
      paradoxTitle: "Paradoxo de Intercalacao Preemptiva & Espera Circular",
      counterExample:
        "T1 executa LOAD R0,[saldo]=100 -> interrupcao de clock -> T2 executa LOAD R0,[saldo]=100, ADD R0,-30, STORE 70 -> T1 retoma ADD R0,-20, STORE 80. O saque de R$30 foi silenciosamente apagado (Lost Update).",
      probeQuestion:
        "Como voce garante atomicidade entre leitura e escrita sem introduzir inversao de locks entre duas contas simultaneas?",
    };
  }
  if (id.includes("mvcc") || id.includes("db_acid")) {
    return {
      paradoxTitle: "Anomalia Write Skew sob Snapshot Isolation",
      counterExample:
        "Tx1 e Tx2 leem no mesmo snapshot que existem 2 medicos de plantao (invariante >= 1). Tx1 remove o medico A; Tx2 remove o medico B. Os write-sets sao disjuntos, o commit passa e o hospital fica com 0 medicos.",
      probeQuestion:
        "Por que Snapshot Isolation nao bloqueia Write Skew e qual mecanismo do Serializable Snapshot Isolation (SSI) detecta essa dependencia rw-antidependency?",
    };
  }
  if (id.includes("dist_raft") || id.includes("routing")) {
    return {
      paradoxTitle: "Split-Brain e Violacao de Quorum em Particao de Rede",
      counterExample:
        "Em um cluster de 5 nos particionado em [2] e [3], um cliente escreve no subgrupo minoritario de 2 nos sem quorum ou usa mutex local, divergindo o log replicado quando o link retorna.",
      probeQuestion:
        "Demonstre por que Raft exige maioria estrita (floor(N/2)+1) tanto na eleicao de lider quanto no commit de entradas de log.",
    };
  }
  if (id.includes("graph") || id.includes("algo") || id.includes("struct")) {
    return {
      paradoxTitle: "Estrangulamento de Ordem Topologica e Degeneracao Assintotica",
      counterExample:
        "Inserir chaves ja ordenadas em uma BST sem balanceamento AVL/Red-Black degrada busca de O(log n) para O(n); analogamente, uma aresta ciclica zera vertices com grau de entrada 0 e trava o algoritmo de Kahn.",
      probeQuestion:
        "Qual invariante estrutural de rotacao ou de grau de entrada restabelece a complexidade teorica garantida?",
    };
  }
  if (id.includes("bkt") || id.includes("ml_grad")) {
    return {
      paradoxTitle: "Ilusao Metacognitiva de Dunning-Kruger vs. Gradiente Desvanecente",
      counterExample:
        "Um aluno obtem 92% em resumo gerado por IA e declara confianca 0.95, mas erra a derivada parcial ou questao isomorfica (o=0), elevando o Brier Score para 0.9025 e denunciando aprendizagem ilusoria.",
      probeQuestion:
        "Como o parametro P(G) (adivinhacao) impede que um unico acerto por chute promova P(Lt) acima do limiar de consolidacao?",
    };
  }
  return {
    paradoxTitle: `Teste de Condicao de Contorno em ${node.code}`,
    counterExample:
      node.fallacies[0] ??
      `Aplicacao mecanica de ${node.title} sem validacao das pre-condicoes formais dos pre-requisitos.`,
    probeQuestion: `Quais pre-requisitos do E-DAG invalidam a abordagem ingênua em '${node.title}' sob carga assimetrica?`,
  };
}

/**
 * Avalia rigor causal, detecta blefe linguistico tipico de copia de LLM
 * e determina o nivel da Taxonomia de Bloom alcancado.
 */
export function analyzeEpistemicRigor(
  studentArgument: string,
  node: EDAGNode,
  confidenceDeclared: number
): EpistemicRigorAnalysis {
  const norm = normalizeText(studentArgument);
  const words = norm.split(/\s+/).filter(Boolean);
  const paradox = generateCounterExampleParadox(node);

  if (words.length < 6) {
    return {
      causalRigorScore: 8,
      bluffDetected: true,
      isVerifiedCorrect: false,
      bloomReached: "REMEMBER",
      matchedMechanisms: [],
      detectedFluffPatterns: ["argumento_laconico"],
      agreedWithFallacy: false,
      reasoningCritique:
        "Argumentacao excessivamente laconica. Nao ha demonstracao causal nem identificacao de variaveis de estado.",
      inquisitorProbe: paradox.probeQuestion,
      counterExample: paradox.counterExample,
    };
  }

  const detectedFluffPatterns = FLUFF_PATTERNS.filter((p) => p.regex.test(norm)).map(
    (p) => p.label
  );
  const causalHits = CAUSAL_CONNECTORS.filter((c) => norm.includes(c));
  const matchedMechanisms = MECHANISTIC_VOCABULARY.filter((m) => norm.includes(m));
  const domainTokens = normalizeText(`${node.title} ${node.description}`)
    .split(/\W+/)
    .filter((t) => t.length >= 4);
  const domainHits = domainTokens.filter((t) => norm.includes(t));

  // Verifica se concordou com alguma falacia cadastrada sem negacao explicita
  let agreedWithFallacy = false;
  const hasNegation = NEGATION_TOKENS.some((neg) => norm.includes(neg));
  for (const fallacy of node.fallacies) {
    const fWords = normalizeText(fallacy)
      .split(/\W+/)
      .filter((w) => w.length >= 5);
    const overlap = fWords.filter((w) => norm.includes(w)).length;
    if (overlap >= 3 && !hasNegation) {
      agreedWithFallacy = true;
      break;
    }
  }

  // Pontuacao composita (0 a 100)
  let score = 20;
  score += Math.min(25, causalHits.length * 9);
  score += Math.min(35, matchedMechanisms.length * 10);
  score += Math.min(20, domainHits.length * 5);
  score += words.length >= 18 ? 10 : 0;
  score -= detectedFluffPatterns.length * 18;
  if (agreedWithFallacy) score -= 40;
  score = Math.max(4, Math.min(99, Number(score.toFixed(1))));

  const bluffDetected =
    agreedWithFallacy ||
    (detectedFluffPatterns.length >= 1 && matchedMechanisms.length === 0) ||
    (confidenceDeclared >= 0.75 && score < 48);

  const isVerifiedCorrect = !bluffDetected && !agreedWithFallacy && score >= 58;

  let bloomReached: BloomLevel = "REMEMBER";
  if (isVerifiedCorrect) {
    if (score >= 88 && matchedMechanisms.length >= 3) bloomReached = "CREATE";
    else if (score >= 76) bloomReached = "EVALUATE";
    else if (score >= 64) bloomReached = "ANALYZE";
    else bloomReached = "APPLY";
  } else if (score >= 40) {
    bloomReached = "UNDERSTAND";
  }

  let reasoningCritique = "";
  if (agreedWithFallacy) {
    reasoningCritique =
      "FALACIA DETECTADA: Sua formulacao reproduz uma premissa falsa conhecida da disciplina sem refutacao formal.";
  } else if (bluffDetected) {
    reasoningCritique = `ALERTA DE BLEFE / ILUSAO DE PROFUNDIDADE: Confianca declarada em ${Math.round(
      confidenceDeclared * 100
    )}%, porem o texto usa retorica superficial (${
      detectedFluffPatterns.join(", ") || "ausencia de mecanismos causais"
    }) sem provar invariantes.`;
  } else if (isVerifiedCorrect) {
    reasoningCritique = `RIGOR CAUSAL VALIDADO (${score}/100): Demonstracao ancorada em mecanismos tecnicos (${matchedMechanisms
      .slice(0, 4)
      .join(", ")}) com encadeamento logico consistente.`;
  } else {
    reasoningCritique =
      "RIGOR PARCIAL INSUFICIENTE: Faltam conectores causais explicitos ('porque', 'implica') e termos mecanisticos da condicao de contorno.";
  }

  return {
    causalRigorScore: score,
    bluffDetected,
    isVerifiedCorrect,
    bloomReached,
    matchedMechanisms: matchedMechanisms.slice(0, 6),
    detectedFluffPatterns,
    agreedWithFallacy,
    reasoningCritique,
    inquisitorProbe: paradox.probeQuestion,
    counterExample: paradox.counterExample,
  };
}
