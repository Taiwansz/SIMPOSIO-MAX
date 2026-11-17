import crypto from "crypto";
import { IsomorphicChallenge } from "./types";

export const ISOMORPHIC_TOPICS: Record<
  string,
  {
    title: string;
    formulaDescription: string;
    starterCode: string;
  }
> = {
  concurrency_saturation: {
    title: "Saturacao Concorrente & Exclusao Mutua",
    formulaDescription:
      "Capacidade Teorica = 1000 / (latencia_ms * fator_atrito); Utilizacao rho = taxa * (latencia_ms * fator_atrito) / 1000",
    starterCode: `import threading

balance = 100
lock = threading.Lock()

def withdraw(amount):
    global balance
    # Proteja a secao critica contra condicoes de corrida (Lost Update)
    with lock:
        balance -= amount
`,
  },
  graph_critical_pipeline: {
    title: "Vazao em Pipeline Topologico (DAG) & Escalonamento",
    formulaDescription:
      "Capacidade efetiva do estagio gargalo = 1000 / (latencia_ms * fator_atrito) req/s",
    starterCode: `import threading

queue_lock = threading.Lock()
processed_nodes = 0

def commit_stage(batch_size):
    global processed_nodes
    with queue_lock:
        processed_nodes += batch_size
`,
  },
};

/**
 * Gera avaliacao isomorfica deterministica e exclusiva a partir do hash SHA-256 do RA + topico.
 * Neutraliza copia direta entre estudantes mantendo invariancia de dificuldade.
 */
export function generateIsomorphicChallenge(
  ra: string,
  topicId = "concurrency_saturation"
): IsomorphicChallenge {
  const cleanRa = ra.trim() || "52319400";
  const topic = ISOMORPHIC_TOPICS[topicId] ?? ISOMORPHIC_TOPICS.concurrency_saturation;
  const normalizedTopicId = ISOMORPHIC_TOPICS[topicId] ? topicId : "concurrency_saturation";

  const digest = crypto
    .createHash("sha256")
    .update(`${cleanRa}:${normalizedTopicId}:UNIMAX-2026`)
    .digest("hex");

  const seedNumeric = parseInt(digest.slice(0, 8), 16);
  const rate = (seedNumeric % 35) + 18; // 18..52 req/s
  const latencyMs = ((seedNumeric >> 4) % 16) + 8; // 8..23 ms
  const frictionFactor = Number((((seedNumeric % 80) / 100) + 1.05).toFixed(2)); // 1.05..1.84
  const criticalNodesCount = (seedNumeric % 5) + 4; // 4..8 nos

  const serviceTimeSec = (latencyMs / 1000) * frictionFactor;
  const theoreticalCapacity = Number((1 / serviceTimeSec).toFixed(2));
  const utilization = Number((rate * serviceTimeSec).toFixed(3));

  const examHash = `sha256:${digest.slice(0, 12)}`;

  const prompt = `[Semente Isomorfica ${examHash}] Para o RA ${cleanRa}, um microservico de ${criticalNodesCount} nos opera sob taxa de chegada lambda = ${rate} req/s, latencia base L = ${latencyMs} ms e fator de atrito de sincronizacao f = ${frictionFactor}. Calcule a Capacidade Teorica Maxima de vazao (em req/s) antes da saturacao da fila.`;

  const codePrompt = `Auditoria Estatica de Invariantes: Implemente ou valide o manipulador critico garantindo exclusao mutua explicita (with lock: ou acquire()/release()), sem chamadas inseguras (eval, exec, __import__).`;

  const rubricRules = [
    `Taxa de chegada exclusiva do RA ${cleanRa}: ${rate} req/s`,
    `Latencia efetiva = ${latencyMs}ms * ${frictionFactor} = ${(latencyMs * frictionFactor).toFixed(2)}ms`,
    `Gabarito analitico: Capacidade = ${theoreticalCapacity} req/s (ou Utilizacao rho = ${utilization})`,
    "Invariante obrigatoria no codigo: secao critica protegida com lock atomico sem escape de sandbox",
  ];

  return {
    ra: cleanRa,
    topicId: normalizedTopicId,
    topicTitle: topic.title,
    examHash,
    seedNumeric,
    prompt,
    codePrompt,
    starterCode: topic.starterCode,
    parameters: {
      rate,
      latencyMs,
      frictionFactor,
      theoreticalCapacity,
      utilization,
      criticalNodesCount,
    },
    rubricRules,
  };
}

/**
 * Inspeciona estaticamente o codigo submetido e corrige deterministicamente a resposta numerica.
 */
export function gradeIsomorphicSubmission(
  challenge: IsomorphicChallenge,
  submittedNumeric: number,
  submittedCode: string
): {
  astInvariantsPassed: boolean;
  numericalPassed: boolean;
  analyticalScore: number;
  verdict: string;
  diagnostics: string[];
} {
  const diagnostics: string[] = [];
  const code = submittedCode.trim();
  const codeLower = code.toLowerCase();

  // 1. Auditoria estatica de seguranca e invariantes de sincronizacao
  const dangerousCalls = ["eval(", "exec(", "__import__(", "os.system(", "subprocess."];
  const hitDangerous = dangerousCalls.find((d) => codeLower.includes(d));

  let astInvariantsPassed = false;
  if (!code) {
    diagnostics.push("Codigo submetido esta vazio.");
  } else if (hitDangerous) {
    diagnostics.push(`Infracao de isolamento de sandbox detectada: chamada proibida '${hitDangerous}'.`);
  } else {
    const hasWithLock = /with\s+\w*lock\w*\s*:/.test(codeLower);
    const hasMutationInBlock =
      hasWithLock && /with\s+\w*lock\w*\s*:[\s\S]*?(=|\+=|-=)/.test(codeLower);
    const hasAcquireRelease =
      codeLower.includes("acquire()") && codeLower.includes("release()");
    const hasAtomicRustOrJs =
      codeLower.includes("mutex") || codeLower.includes("atomic") || codeLower.includes("compareandswap");

    if (hasMutationInBlock) {
      astInvariantsPassed = true;
      diagnostics.push(
        "Invariante de exclusao mutua verificada: mutacao de estado encapsulada em 'with lock:'."
      );
    } else if (hasAcquireRelease) {
      astInvariantsPassed = true;
      diagnostics.push("Invariante verificada: pareamento explicito acquire()/release() presente.");
    } else if (hasAtomicRustOrJs && !codeLower.includes("todo")) {
      astInvariantsPassed = true;
      diagnostics.push("Invariante atomica verificada via primitiva explicita de sincronizacao.");
    } else {
      diagnostics.push(
        "Falha de invariante: protecao da secao critica ausente (esperado 'with lock:' protegendo a mutacao ou acquire()/release())."
      );
    }
  }

  // 2. Corretor analitico exato com tolerancia de 5% para arredondamento
  const cap = challenge.parameters.theoreticalCapacity;
  const util = challenge.parameters.utilization;
  const isCapMatch =
    Number.isFinite(submittedNumeric) && Math.abs(submittedNumeric - cap) <= cap * 0.05;
  const isUtilMatch =
    Number.isFinite(submittedNumeric) && Math.abs(submittedNumeric - util) <= Math.max(0.04, util * 0.05);
  const numericalPassed = isCapMatch || isUtilMatch;

  if (numericalPassed) {
    diagnostics.push(
      `Calculo analitico exato validado para o hash ${challenge.examHash} (Capacidade teorica: ${cap} req/s).`
    );
  } else {
    diagnostics.push(
      `Divergencia numerica: valor informado (${submittedNumeric}) difere do gabarito analitico (${cap} req/s ou rho=${util}) derivado da semente do RA ${challenge.ra}.`
    );
  }

  let analyticalScore = 0;
  if (numericalPassed) analyticalScore += 50;
  if (astInvariantsPassed) analyticalScore += 50;

  let verdict = "REPROVADO POR FALHA ANALITICA E DE INVARIANTES";
  if (numericalPassed && astInvariantsPassed) {
    verdict = "APROVADO COM RIGOR FORMAL";
  } else if (numericalPassed || astInvariantsPassed) {
    verdict = "APROVADO PARCIALMENTE — RETIFICACAO NECESSARIA";
  }

  return {
    astInvariantsPassed,
    numericalPassed,
    analyticalScore,
    verdict,
    diagnostics,
  };
}
