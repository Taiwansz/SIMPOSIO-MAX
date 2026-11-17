import {
  BKTUpdateResult,
  BloomLevel,
  BrierCalibrationReport,
  MasteryStatus,
  StudentNodeState,
} from "./types";

/**
 * Modula parametros P(G) (adivinhacao) e P(S) (deslize) pela Taxonomia de Bloom.
 * Niveis mais elevados reduzem a chance de acerto aleatorio.
 */
export function getBloomParameters(bloomLevel: BloomLevel): { pGuess: number; pSlip: number } {
  switch (bloomLevel) {
    case "REMEMBER":
    case "UNDERSTAND":
      return { pGuess: 0.2, pSlip: 0.1 };
    case "APPLY":
      return { pGuess: 0.14, pSlip: 0.12 };
    case "ANALYZE":
    case "EVALUATE":
      return { pGuess: 0.08, pSlip: 0.16 };
    case "CREATE":
      return { pGuess: 0.03, pSlip: 0.2 };
  }
}

/**
 * Atualiza o estado latente de conhecimento P(Lt) via Bayesian Knowledge Tracing em O(1).
 */
export function updateBKT(
  priorMastery: number,
  isCorrect: boolean,
  confidenceClaimed: number,
  bloomLevel: BloomLevel,
  stabilityHours = 48,
  pTransit = 0.22
): BKTUpdateResult {
  const pL = Math.max(0.01, Math.min(0.99, priorMastery));
  const conf = Math.max(0, Math.min(1, confidenceClaimed));
  const { pGuess, pSlip } = getBloomParameters(bloomLevel);

  const numerator = isCorrect ? pL * (1 - pSlip) : pL * pSlip;
  const denominator = isCorrect
    ? pL * (1 - pSlip) + (1 - pL) * pGuess
    : pL * pSlip + (1 - pL) * (1 - pGuess);

  const posteriorMastery = denominator > 0 ? numerator / denominator : pL;
  const nextRaw = posteriorMastery + (1 - posteriorMastery) * pTransit;
  const nextMastery = Number(Math.max(0.01, Math.min(0.99, nextRaw)).toFixed(4));

  const newStabilityHours = isCorrect
    ? Number(Math.max(24, stabilityHours * 2.1).toFixed(2))
    : Number(Math.max(12, stabilityHours * 0.45).toFixed(2));

  let status: MasteryStatus = "VULNERABLE";
  if (nextMastery >= 0.82) status = "CONSOLIDATED";
  else if (nextMastery >= 0.45) status = "INCUBATING";

  const calibrationDelta = Number((conf - nextMastery).toFixed(4));
  const dunningKrugerAlert = calibrationDelta >= 0.3;

  return {
    priorMastery: Number(pL.toFixed(4)),
    posteriorMastery: Number(posteriorMastery.toFixed(4)),
    nextMastery,
    pGuess,
    pSlip,
    pTransit,
    newStabilityHours,
    status,
    dunningKrugerAlert,
    calibrationDelta,
  };
}

/**
 * Calcula retencao esperada pela curva exponencial de esquecimento de Ebbinghaus:
 * R(t) = P(Lt) * exp(-dt / S)
 */
export function computeEbbinghausRetention(
  pMastery: number,
  elapsedHours: number,
  stabilityHours: number
): number {
  const safeHours = Math.max(0, elapsedHours);
  const safeStability = Math.max(6, stabilityHours);
  const decay = Math.exp(-safeHours / safeStability);
  return Number(Math.max(0.01, Math.min(1, pMastery * decay)).toFixed(4));
}

/**
 * Calcula o Brier Score empirico BS = (1/N) * sum((f_i - o_i)^2)
 * e classifica a calibracao metacognitiva do estudante.
 */
export function computeBrierCalibration(
  records: Array<{ confidenceClaimed: number; isCorrect: boolean }>
): BrierCalibrationReport {
  if (records.length === 0) {
    return {
      brierScore: 0,
      sampleSize: 0,
      status: "SEM_DADOS",
      meanOverconfidenceDelta: 0,
      overconfidentCount: 0,
      calibratedCount: 0,
    };
  }

  let sse = 0;
  let sumDelta = 0;
  let overconfidentCount = 0;
  let calibratedCount = 0;

  for (const r of records) {
    const f = Math.max(0, Math.min(1, r.confidenceClaimed));
    const o = r.isCorrect ? 1 : 0;
    const diff = f - o;
    sse += diff * diff;
    sumDelta += diff;
    if (f >= 0.65 && !r.isCorrect) overconfidentCount++;
    if (Math.abs(diff) <= 0.25) calibratedCount++;
  }

  const brierScore = Number((sse / records.length).toFixed(4));
  const meanOverconfidenceDelta = Number((sumDelta / records.length).toFixed(4));

  let status: BrierCalibrationReport["status"] = "CALIBRACAO_ALTA";
  if (brierScore > 0.22) status = "ALERTA_DUNNING_KRUGER";
  else if (brierScore > 0.12) status = "CALIBRACAO_MODERADA";

  return {
    brierScore,
    sampleSize: records.length,
    status,
    meanOverconfidenceDelta,
    overconfidentCount,
    calibratedCount,
  };
}

/**
 * Calcula fila priorizada de revisao por urgencia de decaimento sinaptico.
 */
export function buildSpacedReviewSchedule(
  states: StudentNodeState[],
  nowMs = Date.now()
) {
  return states
    .map((st) => {
      const practicedMs = new Date(st.last_practiced_at).getTime();
      const elapsedHours = Math.max(0, (nowMs - practicedMs) / 3_600_000);
      const retention = computeEbbinghausRetention(
        Number(st.p_mastery),
        elapsedHours,
        Number(st.stability_hours)
      );
      const urgency = retention < 0.45 ? "URGENTE" : retention < 0.72 ? "ALERTA" : "ESTAVEL";
      return {
        nodeId: st.node_id,
        pMastery: Number(st.p_mastery),
        retentionNow: retention,
        elapsedHours: Number(elapsedHours.toFixed(1)),
        stabilityHours: Number(st.stability_hours),
        urgency,
      };
    })
    .sort((a, b) => a.retentionNow - b.retentionNow);
}
