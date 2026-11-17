import { AutopsyCase } from "./types";

export interface AutopsySimulation {
  broken: boolean;
  failureRatePct: number;
  aiConfidencePct: number;
  statusMessage: string;
}

/**
 * Simula em tempo real o colapso da resposta gerada por IA quando a condicao
 * do cenario ultrapassa o limite critico (concorrencia, SpO2 ou pressao de prompt).
 */
export function simulateCaseFailure(
  autopsyCase: AutopsyCase,
  paramValue: number
): AutopsySimulation {
  const isReverseThreshold = autopsyCase.id === "case_health_triage";
  const broken = isReverseThreshold
    ? paramValue <= autopsyCase.trigger_break_threshold
    : paramValue >= autopsyCase.trigger_break_threshold;

  const span = Math.max(1, autopsyCase.trigger_max - autopsyCase.trigger_min);
  const ratio = isReverseThreshold
    ? (autopsyCase.trigger_max - paramValue) / span
    : (paramValue - autopsyCase.trigger_min) / span;

  const failureRatePct = broken ? Math.min(99, Math.round(45 + ratio * 54)) : Math.max(0, Math.round(ratio * 12));
  // Modelos costumam manter confianca alta mesmo quando erram
  const aiConfidencePct = Math.max(84, Math.min(97, Math.round(95 - ratio * 8)));

  let statusMessage = "Comportamento normal dentro do limite seguro.";
  if (broken) {
    if (autopsyCase.area === "Computacao") {
      statusMessage = "Colisao detectada: duas operacoes leram o mesmo saldo e aprovaram saque duplo.";
    } else if (autopsyCase.area === "Saude") {
      statusMessage = "Erro grave: oxigenacao critica ignorada enquanto a IA liberou o paciente.";
    } else {
      statusMessage = "Risco oculto aprovado: a IA cedeu a pressao e validou multa abusiva.";
    }
  }

  return {
    broken,
    failureRatePct,
    aiConfidencePct,
    statusMessage,
  };
}

/**
 * Avalia se o estudante apontou corretamente a linha onde a IA errou e a regra de correcao.
 */
export function evaluateAutopsyFix(
  autopsyCase: AutopsyCase,
  selectedLine: number,
  selectedFixId: string
): {
  solved: boolean;
  lineCorrect: boolean;
  fixCorrect: boolean;
  feedback: string;
} {
  const lineCorrect = selectedLine === autopsyCase.fault_line_index;
  const fixCorrect = selectedFixId === autopsyCase.correct_fix_id;
  const solved = lineCorrect && fixCorrect;

  if (solved) {
    return {
      solved: true,
      lineCorrect: true,
      fixCorrect: true,
      feedback: `Falha isolada e corrigida com sucesso. ${autopsyCase.explanation_simple}`,
    };
  }

  if (!lineCorrect && fixCorrect) {
    return {
      solved: false,
      lineCorrect: false,
      fixCorrect: true,
      feedback: `A regra de correcao esta certa, mas a linha exata da falha da IA e a linha ${
        autopsyCase.fault_line_index + 1
      }.`,
    };
  }

  if (lineCorrect && !fixCorrect) {
    return {
      solved: false,
      lineCorrect: true,
      fixCorrect: false,
      feedback: "Voce encontrou a linha exata do erro, mas a correcao escolhida nao resolve a causa.",
    };
  }

  return {
    solved: false,
    lineCorrect: false,
    fixCorrect: false,
    feedback: `Revise o resultado da IA clicando diretamente na linha ${
      autopsyCase.fault_line_index + 1
    } e escolhendo a trava segura.`,
  };
}
