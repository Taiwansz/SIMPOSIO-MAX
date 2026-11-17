import { EDAGNode, EpistemicRigorAnalysis } from "./types";

interface LLMEnrichResult {
  responseText: string;
  providerUsed: string;
}

/**
 * Conector hibrido opcional para enriquecimento dialetico via LLM em nuvem
 * (Google Gemini, NVIDIA NIM ou OpenAI-compatible). Caso nenhuma chave valida
 * esteja ativa ou o provedor recuse a chamada, retorna fallback deterministico imediato.
 */
export async function enrichSocraticProbeWithLLM(params: {
  node: EDAGNode;
  studentArgument: string;
  confidenceDeclared: number;
  rigorAnalysis: EpistemicRigorAnalysis;
  customApiKey?: string;
}): Promise<LLMEnrichResult> {
  const { node, studentArgument, confidenceDeclared, rigorAnalysis, customApiKey } = params;

  const fallbackText = [
    rigorAnalysis.reasoningCritique,
    `Contra-exemplo de contorno: ${rigorAnalysis.counterExample}`,
    `Sondagem Socratica (${rigorAnalysis.bloomReached}): ${rigorAnalysis.inquisitorProbe}`,
  ].join("\n\n");

  const key =
    customApiKey?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.NVIDIA_API_KEY?.trim() ||
    "";

  if (!key || key.length < 12) {
    return {
      responseText: fallbackText,
      providerUsed: "deterministic-hybrid",
    };
  }

  const systemPrompt =
    "Voce e o Inquisidor Socratico do ThAthena Epistemic OS na UniMAX. Jamais entregue respostas prontas ou elogios superficiais. Sem emojis. Avalie o rigor causal da resposta discente em portugues tecnico conciso (maximo 120 palavras), exponha contradicoes se houver e formule uma pergunta de escalada na Taxonomia de Bloom.";
  const userPrompt = `Disciplina/Conceito: ${node.code} - ${node.title}.
Confianca declarada pelo aluno: ${Math.round(confidenceDeclared * 100)}%.
Score deterministico de rigor causal: ${rigorAnalysis.causalRigorScore}/100 (Blefe detectado: ${
    rigorAnalysis.bluffDetected ? "SIM" : "NAO"
  }).
Resposta do aluno: "${studentArgument}"
Contra-exemplo base: "${rigorAnalysis.counterExample}"`;

  try {
    if (key.startsWith("AIza")) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
          key
        )}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { temperature: 0.25, maxOutputTokens: 320 },
          }),
          signal: AbortSignal.timeout(8000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return { responseText: text, providerUsed: "gemini-2.5-flash+deterministic" };
        }
      }
    } else if (key.startsWith("nvapi-")) {
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "google/gemma-3-12b-it",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.2,
          max_tokens: 320,
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { responseText: text, providerUsed: "nvidia-nim+deterministic" };
        }
      }
    }
  } catch {
    // Fallback silencioso deterministico garantido
  }

  return {
    responseText: fallbackText,
    providerUsed: "deterministic-hybrid",
  };
}
