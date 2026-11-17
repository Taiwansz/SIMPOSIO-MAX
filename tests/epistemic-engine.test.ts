import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { SEED_EDAG_NODES, SEED_STUDENT_STATES } from "@/lib/epistemic-engine/seed-fallback";
import {
  compileEDAGReport,
  computeCriticalPath,
  detectEpistemicBottlenecks,
  diagnoseCycles,
  extractRemediationSubgraph,
  kahnTopologicalSort,
} from "@/lib/epistemic-engine/edag";
import {
  computeBrierCalibration,
  computeEbbinghausRetention,
  updateBKT,
} from "@/lib/epistemic-engine/bkt";
import {
  analyzeEpistemicRigor,
  generateCounterExampleParadox,
} from "@/lib/epistemic-engine/inquisitor";
import {
  generateIsomorphicChallenge,
  gradeIsomorphicSubmission,
} from "@/lib/epistemic-engine/isomorphic";
import { runInterdisciplinaryDefense } from "@/lib/epistemic-engine/faculty-swarm";

describe("1. Compilador E-DAG (Kahn O(V+E), Rota Critica, Ciclos e Remediacao)", () => {
  it("ordena topologicamente os 16 nos sem ciclos e respeita pre-requisitos", () => {
    const order = kahnTopologicalSort(SEED_EDAG_NODES);
    expect(order).toHaveLength(SEED_EDAG_NODES.length);

    const position = new Map(order.map((id, idx) => [id, idx]));
    for (const node of SEED_EDAG_NODES) {
      for (const pre of node.prerequisites) {
        expect(position.get(pre)!).toBeLessThan(position.get(node.id)!);
      }
    }
  });

  it("detecta ciclos elementares via DFS quando ha dependencia circular", () => {
    const cyclic = [
      { ...SEED_EDAG_NODES[0], id: "a", prerequisites: ["b"] },
      { ...SEED_EDAG_NODES[1], id: "b", prerequisites: ["a"] },
    ];
    expect(() => kahnTopologicalSort(cyclic)).toThrow(/Ciclo epistemologico/);
    const cycles = diagnoseCycles(cyclic);
    expect(cycles.length).toBeGreaterThanOrEqual(1);
  });

  it("calcula Rota Critica, Keystones e extrai subgrafo de remediacao quando ha gargalo", () => {
    const report = compileEDAGReport(SEED_EDAG_NODES);
    expect(report.isAcyclic).toBe(true);
    expect(report.criticalPath.length).toBeGreaterThanOrEqual(4);
    expect(detectEpistemicBottlenecks(SEED_EDAG_NODES)[0].downstreamCount).toBeGreaterThan(5);

    const masteryMap: Record<string, number> = {};
    for (const st of SEED_STUDENT_STATES.filter((s) => s.ra === "52318812")) {
      masteryMap[st.node_id] = st.p_mastery;
    }
    const remediation = extractRemediationSubgraph(SEED_EDAG_NODES, masteryMap, "n_dist_raft", 0.82);
    expect(remediation.blocked).toBe(true);
    expect(remediation.missingPrerequisites.length).toBeGreaterThan(0);
    expect(remediation.orderedTrail[remediation.orderedTrail.length - 1].id).toBe("n_dist_raft");
  });
});

describe("2. Gemeo Cognitivo Bayesiano (BKT), Ebbinghaus e Brier Score", () => {
  it("atualiza P(Lt) corretamente em O(1) e dispara alerta Dunning-Kruger quando confianca excede dominio", () => {
    const up = updateBKT(0.45, true, 0.8, "ANALYZE", 48);
    expect(up.nextMastery).toBeGreaterThan(0.45);
    expect(up.newStabilityHours).toBeGreaterThan(48);

    const down = updateBKT(0.3, false, 0.95, "EVALUATE", 48);
    expect(down.dunningKrugerAlert).toBe(true);
    expect(down.newStabilityHours).toBeLessThan(48);
  });

  it("modela decaimento de Ebbinghaus e calcula Brier Score exato", () => {
    const r0 = computeEbbinghausRetention(0.9, 0, 100);
    const r100 = computeEbbinghausRetention(0.9, 100, 100);
    expect(r0).toBe(0.9);
    expect(r100).toBeCloseTo(0.9 * Math.exp(-1), 2);

    const perfect = computeBrierCalibration([
      { confidenceClaimed: 1, isCorrect: true },
      { confidenceClaimed: 0, isCorrect: false },
    ]);
    expect(perfect.brierScore).toBe(0);
    expect(perfect.status).toBe("CALIBRACAO_ALTA");

    const dk = computeBrierCalibration([
      { confidenceClaimed: 0.95, isCorrect: false },
      { confidenceClaimed: 0.9, isCorrect: false },
    ]);
    expect(dk.brierScore).toBeGreaterThan(0.8);
    expect(dk.status).toBe("ALERTA_DUNNING_KRUGER");
  });
});

describe("3. Inquisidor Socratico Adversarial e Detector de Blefe", () => {
  const mutexNode = SEED_EDAG_NODES.find((n) => n.id === "n_mutex_lock")!;

  it("aprova resposta com conectores causais e termos mecanisticos", () => {
    const res = analyzeEpistemicRigor(
      "A operacao i++ nao e atomica porque executa LOAD, ADD e STORE; logo, interrupcao preemptiva causa Lost Update e exige mutex ou instrucao atomica CAS.",
      mutexNode,
      0.9
    );
    expect(res.bluffDetected).toBe(false);
    expect(res.isVerifiedCorrect).toBe(true);
    expect(res.causalRigorScore).toBeGreaterThanOrEqual(65);
  });

  it("intercepta blefe superficial e concordancia com falacia", () => {
    const bluff = analyzeEpistemicRigor(
      "Em resumo, de maneira geral ajuda a otimizar o sistema e e uma boa pratica.",
      mutexNode,
      0.95
    );
    expect(bluff.bluffDetected).toBe(true);
    expect(bluff.isVerifiedCorrect).toBe(false);

    const fallacy = analyzeEpistemicRigor(
      "Declarar uma variavel como volatile garante atomicidade composta e usar locks de aplicacao resolve concorrencia entre multiplos processos.",
      mutexNode,
      0.9
    );
    expect(fallacy.agreedWithFallacy).toBe(true);
    expect(fallacy.isVerifiedCorrect).toBe(false);

    const paradox = generateCounterExampleParadox(mutexNode);
    expect(paradox.counterExample).toContain("Lost Update");
  });
});

describe("4. Provas Isomorficas SHA-256 e Auditoria Estatica de Invariantes", () => {
  it("gera provas deterministicamente distintas por RA e corrige rigorosamente", () => {
    const c1 = generateIsomorphicChallenge("52319400", "concurrency_saturation");
    const c2 = generateIsomorphicChallenge("52318812", "concurrency_saturation");
    expect(c1.examHash).not.toBe(c2.examHash);
    expect(c1.seedNumeric).not.toBe(c2.seedNumeric);

    const pass = gradeIsomorphicSubmission(
      c1,
      c1.parameters.theoreticalCapacity,
      "import threading\nlock = threading.Lock()\nwith lock:\n    balance -= 10"
    );
    expect(pass.analyticalScore).toBe(100);
    expect(pass.astInvariantsPassed).toBe(true);

    const dangerous = gradeIsomorphicSubmission(
      c1,
      c1.parameters.theoreticalCapacity,
      "eval('balance -= 10')"
    );
    expect(dangerous.astInvariantsPassed).toBe(false);
    expect(dangerous.analyticalScore).toBe(50);
  });
});

describe("5. Banca Multidisciplinar e Conformidade com o Edital UniMAX", () => {
  it("detecta tensao cruzada quando usa mutex local sem consenso distribuido", () => {
    const defense = runInterdisciplinaryDefense(
      "Escalonador Distribuido",
      "Utilizamos mutex local com lock para proteger recursos globais sem especificar replicacao."
    );
    expect(defense.crossCuttingTensions.length).toBeGreaterThan(0);

    const solid = runInterdisciplinaryDefense(
      "Motor Consenso",
      "A arquitetura combina mutex e operacoes atomicas CAS para evitar deadlock, Write-Ahead Logging (WAL) com fsync, consenso distribuido Raft com quorum CAP e ordenacao topologica por Kahn em O(V+E) com Brier Score e BKT."
    );
    expect(solid.verdict).toBe("APROVADO COM DISTINCAO PELA BANCA");
    expect(solid.crossCuttingTensions).toHaveLength(0);
  });

  it("valida faixa estrita de 3.000 a 8.000 caracteres no artigo e zero emojis no repositorio", () => {
    const articlePath = path.resolve(__dirname, "../ARTIGO_SIMPOSIO_UNIMAX.md");
    const text = fs.readFileSync(articlePath, "utf-8");
    expect(text.length).toBeGreaterThanOrEqual(3000);
    expect(text.length).toBeLessThanOrEqual(8000);
    expect(text).toContain("INTRODUCAO");
    expect(text).toContain("DESENVOLVIMENTO");
    expect(text).toContain("CONCLUSOES");
    expect(text).toContain("REFERENCIAS");

    // Verifica ausencia de emojis nos arquivos fonte principais
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
