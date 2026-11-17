import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import {
  SEED_ARENA_RESPONSES,
  SEED_AUTOPSY_CASES,
} from "@/lib/veritas-engine/seed-data";
import {
  evaluateAutopsyFix,
  simulateCaseFailure,
} from "@/lib/veritas-engine/autopsy";
import {
  buildMutationChallenge,
  verifyMutationDefense,
} from "@/lib/veritas-engine/mutation";
import {
  analyzeArenaState,
  jaccardSimilarity,
  projectResponseToArena,
} from "@/lib/veritas-engine/arena";

describe("1. Motor Raio-X da IA (Computacao, Saude, Negocios)", () => {
  it("simula colapso quando limite e ultrapassado e aprova apenas linha e correcao certas", () => {
    const pixCase = SEED_AUTOPSY_CASES.find((c) => c.id === "case_comp_pix")!;
    const safeSim = simulateCaseFailure(pixCase, 2);
    expect(safeSim.broken).toBe(false);

    const brokenSim = simulateCaseFailure(pixCase, 20);
    expect(brokenSim.broken).toBe(true);
    expect(brokenSim.aiConfidencePct).toBeGreaterThanOrEqual(84);

    const wrong = evaluateAutopsyFix(pixCase, 1, "fix_sleep");
    expect(wrong.solved).toBe(false);

    const ok = evaluateAutopsyFix(pixCase, pixCase.fault_line_index, pixCase.correct_fix_id);
    expect(ok.solved).toBe(true);
  });

  it("simula erro clinico em Saude quando SpO2 cai abaixo de 92%", () => {
    const healthCase = SEED_AUTOPSY_CASES.find((c) => c.id === "case_health_triage")!;
    expect(simulateCaseFailure(healthCase, 97).broken).toBe(false);
    expect(simulateCaseFailure(healthCase, 88).broken).toBe(true);
  });
});

describe("2. Motor Teste de Autoria por Mutacao em 60s", () => {
  it("injeta sabotagem cirurgica no codigo proprio do aluno e gera selo dentro de 60s", () => {
    const customCode = [
      "function aprovar(saldo, valor) {",
      "  if (valor <= saldo && valor > 0) {",
      "    return true;",
      "  }",
      "}",
    ].join("\n");

    const challenge = buildMutationChallenge(undefined, customCode);
    expect(challenge.mutatedLineIndex).toBe(1);
    expect(challenge.mutatedLines[1]).toContain("||");

    const pass = verifyMutationDefense({
      ra: "52319400",
      challenge,
      selectedLine: 1,
      selectedFixId: challenge.correctFixId,
      elapsedSeconds: 18,
    });
    expect(pass.passed).toBe(true);
    expect(pass.proofHash).toMatch(/^veritas-52319400-[a-f0-9]{6}$/);

    const expired = verifyMutationDefense({
      ra: "52319400",
      challenge,
      selectedLine: 1,
      selectedFixId: challenge.correctFixId,
      elapsedSeconds: 65,
    });
    expect(expired.passed).toBe(false);
  });
});

describe("3. Motor Arena ao Vivo (Deteccao de Padrao Repetido e Debate)", () => {
  it("detecta alta similaridade entre respostas genericas e projeta ideias originais a direita", () => {
    const sim = jaccardSimilarity(
      SEED_ARENA_RESPONSES[0].response_text,
      SEED_ARENA_RESPONSES[1].response_text
    );
    expect(sim).toBeGreaterThan(0.35);

    const genericProj = projectResponseToArena(
      "A inteligencia artificial ajuda muito na produtividade e melhora a eficiencia de maneira geral.",
      SEED_ARENA_RESPONSES
    );
    const originalProj = projectResponseToArena(
      "Sem trava no banco, a concorrencia quebra o saldo e o autor precisa auditar a falha com mutacao.",
      SEED_ARENA_RESPONSES
    );
    expect(originalProj.coordX).toBeGreaterThan(genericProj.coordX);
    expect(originalProj.uniquenessScore).toBeGreaterThan(genericProj.uniquenessScore);

    const analysis = analyzeArenaState(SEED_ARENA_RESPONSES);
    expect(analysis.herdCollapseDetected).toBe(true);
    expect(analysis.debatePair).not.toBeNull();
  });
});

describe("4. Conformidade Edital UniMAX & Zero Emojis", () => {
  it("mantem resumo ampliado entre 3.000 e 8.000 caracteres e zero emojis", () => {
    const articlePath = path.resolve(__dirname, "../ARTIGO_SIMPOSIO_UNIMAX.md");
    const text = fs.readFileSync(articlePath, "utf-8");
    expect(text.length).toBeGreaterThanOrEqual(3000);
    expect(text.length).toBeLessThanOrEqual(8000);
    expect(text).toContain("INTRODUCAO");
    expect(text).toContain("DESENVOLVIMENTO");
    expect(text).toContain("CONCLUSOES");
    expect(text).toContain("REFERENCIAS");

    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    expect(emojiRegex.test(text)).toBe(false);
  });
});
