import { ArenaAnalysis, ArenaResponse } from "./types";

const STOPWORDS = new Set([
  "para", "como", "mais", "muito", "sobre", "entre", "isso", "essa", "este",
  "pela", "pelo", "com", "uma", "uns", "das", "dos", "que", "nao", "sim",
  "porque", "quando", "onde", "pois", "aluno", "alunos", "resposta", "respostas",
]);

function tokenize(text: string): string[] {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

export function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(tokenize(a));
  const setB = new Set(tokenize(b));
  if (setA.size === 0 || setB.size === 0) return 0;
  let inter = 0;
  for (const w of setA) {
    if (setB.has(w)) inter++;
  }
  const union = setA.size + setB.size - inter;
  return union > 0 ? inter / union : 0;
}

/**
 * Calcula coordenadas 2D deterministicas (baseadas em vocabulario tecnico vs retorica generica)
 * e o Indice de Originalidade Individual (0..100) comparando contra a sala existente.
 */
export function projectResponseToArena(
  responseText: string,
  existingResponses: ArenaResponse[]
): {
  coordX: number;
  coordY: number;
  uniquenessScore: number;
} {
  const norm = responseText
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const concreteTerms = [
    "trava", "banco", "saldo", "paciente", "oxigenio", "contrato", "clausula",
    "falha", "erro", "responsabilidade", "auditar", "prova", "mutacao",
    "codigo", "tempo", "regra", "risco", "concorrencia", "limite", "autor",
  ];
  const genericTerms = [
    "produtividade", "otimiza", "maneira geral", "ajuda muito", "eficiencia",
    "importante", "melhorar", "beneficios", "ferramenta", "facilita",
  ];

  const concreteHits = concreteTerms.filter((t) => norm.includes(t)).length;
  const genericHits = genericTerms.filter((t) => norm.includes(t)).length;

  // Eixo X: Resposta generica (esquerda 15..38) vs Resposta especifica/causal (direita 62..88)
  let baseX = 50 + concreteHits * 11 - genericHits * 12;
  baseX = Math.max(12, Math.min(88, baseX));

  // Eixo Y: Variacao deterministica pelo comprimento e tokens unicos
  const tokens = tokenize(responseText);
  const hashSum = tokens.reduce((acc, t) => acc + t.charCodeAt(0) * 7 + t.length * 13, 0);
  const baseY = 18 + (hashSum % 64);

  // Calcula similaridade maxima com as respostas existentes na sala
  let maxSim = 0;
  for (const r of existingResponses) {
    const sim = jaccardSimilarity(responseText, r.response_text);
    if (sim > maxSim) maxSim = sim;
  }

  const uniquenessScore = Math.max(
    8,
    Math.min(98, Math.round((1 - maxSim) * 85 + Math.min(13, concreteHits * 4) - genericHits * 6))
  );

  return {
    coordX: Number(baseX.toFixed(2)),
    coordY: Number(baseY.toFixed(2)),
    uniquenessScore,
  };
}

/**
 * Analisa toda a sala ao vivo:
 * - Calcula o Indice de Originalidade Coletiva (0..100%)
 * - Detecta se ha agrupamento de respostas repetidas (padrao copiado de IA)
 * - Seleciona as 2 respostas mais distantes no mapa para confronto ao vivo
 */
export function analyzeArenaState(responses: ArenaResponse[]): ArenaAnalysis {
  if (responses.length === 0) {
    return {
      originalityIndex: 100,
      herdCollapseDetected: false,
      repeatedClusterCount: 0,
      debatePair: null,
      blackSwanPrompt: "E se a internet cair e o sistema precisar decidir sozinho em 2 segundos?",
    };
  }

  let pairSims = 0;
  let pairCount = 0;
  let highSimPairs = 0;

  let maxDist = -1;
  let debatePair: [ArenaResponse, ArenaResponse] | null = null;

  for (let i = 0; i < responses.length; i++) {
    for (let j = i + 1; j < responses.length; j++) {
      const sim = jaccardSimilarity(responses[i].response_text, responses[j].response_text);
      pairSims += sim;
      pairCount++;
      if (sim >= 0.35) highSimPairs++;

      const dx = Number(responses[i].coord_x) - Number(responses[j].coord_x);
      const dy = Number(responses[i].coord_y) - Number(responses[j].coord_y);
      const dist = Math.hypot(dx, dy);
      if (dist > maxDist) {
        maxDist = dist;
        debatePair = [responses[i], responses[j]];
      }
    }
  }

  const avgSim = pairCount > 0 ? pairSims / pairCount : 0;
  const avgUnique =
    responses.reduce((acc, r) => acc + Number(r.uniqueness_score), 0) / responses.length;

  const originalityIndex = Math.max(
    10,
    Math.min(99, Math.round(avgUnique * 0.65 + (1 - avgSim) * 35))
  );
  const herdCollapseDetected = highSimPairs >= 1 && originalityIndex < 72;

  return {
    originalityIndex,
    herdCollapseDetected,
    repeatedClusterCount: highSimPairs > 0 ? highSimPairs + 1 : 0,
    debatePair,
    blackSwanPrompt:
      "Mudanca de cenario: agora metade dos dados de entrada veio corrompida. O que muda na sua resposta anterior?",
  };
}
