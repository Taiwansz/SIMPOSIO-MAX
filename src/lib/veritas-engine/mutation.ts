import crypto from "crypto";
import { MutationChallenge, VeritasArea } from "./types";

const BASE_CHALLENGES: MutationChallenge[] = [
  {
    challengeId: "mut_pix_limit",
    artifactTitle: "Controle de Saque Seguro",
    area: "Computacao",
    originalLines: [
      "function aprovarSaque(saldo, valor, limite) {",
      "  if (valor <= 0) return false;",
      "  if (valor <= saldo && valor <= limite) {",
      "    registrarDebito(valor);",
      "    return true;",
      "  }",
      "  return false;",
      "}",
    ],
    mutatedLines: [
      "function aprovarSaque(saldo, valor, limite) {",
      "  if (valor <= 0) return false;",
      "  if (valor <= saldo || valor <= limite) {",
      "    registrarDebito(valor);",
      "    return true;",
      "  }",
      "  return false;",
      "}",
    ],
    mutatedLineIndex: 2,
    mutationHint: "Uma regra critica de seguranca foi enfraquecida permitindo saque acima do saldo.",
    fixOptions: [
      { id: "rep_and", label: "Trocar '||' por '&&' para exigir saldo E limite suficientes" },
      { id: "rep_zero", label: "Mudar 'valor <= 0' para 'valor == 0'" },
      { id: "rep_ret", label: "Retornar true no final da funcao" },
    ],
    correctFixId: "rep_and",
  },
  {
    challengeId: "mut_triage_age",
    artifactTitle: "Regra de Alerta em Triagem",
    area: "Saude",
    originalLines: [
      "Regra de atendimento prioritario:",
      "1. Medir pressao arterial e oxigenacao na chegada.",
      "2. Se SpO2 < 92%, encaminhar para sala vermelha.",
      "3. Se febre >= 39C, iniciar protocolo termico.",
      "4. Registrar horario exato da avaliacao.",
    ],
    mutatedLines: [
      "Regra de atendimento prioritario:",
      "1. Medir pressao arterial e oxigenacao na chegada.",
      "2. Se SpO2 > 92%, encaminhar para sala vermelha.",
      "3. Se febre >= 39C, iniciar protocolo termico.",
      "4. Registrar horario exato da avaliacao.",
    ],
    mutatedLineIndex: 2,
    mutationHint: "Um sinal de comparacao foi invertido, mandando pacientes saudaveis para emergencia e liberando os graves.",
    fixOptions: [
      { id: "rep_lt", label: "Corrigir para 'SpO2 < 92%' antes de liberar ou triar" },
      { id: "rep_fever", label: "Alterar a febre minima para 37C" },
      { id: "rep_time", label: "Remover o registro de horario" },
    ],
    correctFixId: "rep_lt",
  },
  {
    challengeId: "mut_margin_calc",
    artifactTitle: "Trava de Margem em Orcamento",
    area: "Negocios",
    originalLines: [
      "Politica de desconto comercial:",
      "1. Desconto padrao maximo permitido: 12%.",
      "2. Acima de 12%, bloquear venda sem aprovacao.",
      "3. Calcular margem liquida apos impostos.",
      "4. Emitir pedido apenas com margem positiva.",
    ],
    mutatedLines: [
      "Politica de desconto comercial:",
      "1. Desconto padrao maximo permitido: 12%.",
      "2. Acima de 12%, liberar venda sem aprovacao.",
      "3. Calcular margem liquida apos impostos.",
      "4. Emitir pedido apenas com margem positiva.",
    ],
    mutatedLineIndex: 2,
    mutationHint: "Uma palavra-chave de bloqueio foi trocada, permitindo vendas com prejuizo.",
    fixOptions: [
      { id: "rep_block", label: "Restaurar 'bloquear venda sem aprovacao' acima de 12%" },
      { id: "rep_tax", label: "Ignorar impostos no calculo da margem" },
      { id: "rep_max", label: "Aumentar o desconto padrao para 40%" },
    ],
    correctFixId: "rep_block",
  },
];

/**
 * Seleciona ou gera um desafio de mutacao em cima do trabalho submetido pelo estudante.
 */
export function buildMutationChallenge(
  challengeId?: string,
  customText?: string
): MutationChallenge {
  if (customText && customText.trim().split("\n").length >= 3) {
    const rawLines = customText
      .trim()
      .split("\n")
      .slice(0, 8);
    // Procura linha com operador ou condicao para sabotar de forma cirurgica
    let targetIdx = rawLines.findIndex(
      (l) => l.includes("&&") || l.includes("<") || l.includes(">") || l.includes("nao") || l.includes("bloquear")
    );
    if (targetIdx === -1) targetIdx = Math.min(1, rawLines.length - 1);

    const mutatedLines = [...rawLines];
    const line = mutatedLines[targetIdx];
    let hint = "Uma condicao essencial do seu texto foi invertida.";
    if (line.includes("&&")) {
      mutatedLines[targetIdx] = line.replace("&&", "||");
      hint = "O operador logico '&&' foi trocado por '||' nesta linha.";
    } else if (line.includes("<=")) {
      mutatedLines[targetIdx] = line.replace("<=", ">");
      hint = "A comparacao '<=' foi invertida para '>' nesta linha.";
    } else if (line.includes("<")) {
      mutatedLines[targetIdx] = line.replace("<", ">");
      hint = "O sinal '<' foi invertido para '>' nesta linha.";
    } else if (line.toLowerCase().includes("nao ")) {
      mutatedLines[targetIdx] = line.replace(/nao /i, "");
      hint = "A negacao 'nao' foi removida, invertendo o sentido da frase.";
    } else {
      mutatedLines[targetIdx] = `${line} [CONDICAO REMOVIDA]`;
      hint = "Uma restricao critica foi removida nesta linha.";
    }

    return {
      challengeId: "mut_custom",
      artifactTitle: "Seu Trabalho Submetido",
      area: "Computacao",
      originalLines: rawLines,
      mutatedLines,
      mutatedLineIndex: targetIdx,
      mutationHint: hint,
      fixOptions: [
        { id: "fix_custom_ok", label: "Restaurar a condicao original exata nesta linha" },
        { id: "fix_custom_skip", label: "Manter a alteracao pois nao muda o resultado" },
        { id: "fix_custom_del", label: "Apagar esta linha do trabalho" },
      ],
      correctFixId: "fix_custom_ok",
    };
  }

  return (
    BASE_CHALLENGES.find((c) => c.challengeId === challengeId) ??
    BASE_CHALLENGES[0]
  );
}

/**
 * Avalia se o aluno localizou a sabotagem e aplicou a correcao dentro do tempo limite (60s).
 */
export function verifyMutationDefense(params: {
  ra: string;
  challenge: MutationChallenge;
  selectedLine: number;
  selectedFixId: string;
  elapsedSeconds: number;
}): {
  passed: boolean;
  proofHash: string;
  feedback: string;
} {
  const { ra, challenge, selectedLine, selectedFixId, elapsedSeconds } = params;
  const withinTime = elapsedSeconds <= 60;
  const lineOk = selectedLine === challenge.mutatedLineIndex;
  const fixOk = selectedFixId === challenge.correctFixId;
  const passed = withinTime && lineOk && fixOk;

  const rawDigest = crypto
    .createHash("sha256")
    .update(`${ra}:${challenge.challengeId}:${elapsedSeconds}:${passed}`)
    .digest("hex")
    .slice(0, 6);
  const proofHash = `veritas-${ra || "anon"}-${rawDigest}`;

  if (passed) {
    return {
      passed: true,
      proofHash,
      feedback: `Autoria comprovada em ${elapsedSeconds}s. Voce identificou a mutacao e restaurou a regra correta.`,
    };
  }
  if (!withinTime) {
    return {
      passed: false,
      proofHash,
      feedback: `Tempo esgotado (${elapsedSeconds}s). O desafio exige resposta em ate 60 segundos.`,
    };
  }
  if (!lineOk) {
    return {
      passed: false,
      proofHash,
      feedback: `A sabotagem foi aplicada na linha ${challenge.mutatedLineIndex + 1}, nao na linha ${selectedLine + 1}.`,
    };
  }
  return {
    passed: false,
    proofHash,
    feedback: "Linha certa, mas a correcao escolhida mantem a falha.",
  };
}

export const PRESET_MUTATION_CHALLENGES = BASE_CHALLENGES;
