"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Radio, Send, Sparkles, X } from "lucide-react";
import { ArenaAnalysis, ArenaResponse } from "@/lib/veritas-engine/types";

interface LiveArenaProps {
  responses: ArenaResponse[];
  analysis: ArenaAnalysis;
  onSubmitted: (responses: ArenaResponse[], analysis: ArenaAnalysis) => void;
}

export default function LiveArena({
  responses,
  analysis,
  onSubmitted,
}: LiveArenaProps) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [showBlackSwan, setShowBlackSwan] = useState(false);

  useEffect(() => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/?tab=arena`
        : "https://simposio-max.vercel.app/?tab=arena";
    QRCode.toDataURL(url, {
      margin: 1,
      width: 220,
      color: { dark: "#0A0A0A", light: "#F0EDE6" },
    })
      .then(setQrUrl)
      .catch(() => {});
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 8) return;
    setSending(true);
    try {
      const res = await fetch("/api/arena", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantName: name.trim() || "Participante",
          role: "Plateia / Banca",
          responseText: text.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.arenaResponses && data.arenaAnalysis) {
        onSubmitted(data.arenaResponses, data.arenaAnalysis);
        setText("");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecalho simples + botoes de acao por icones */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-semibold text-[#F0EDE6] sm:text-3xl">
            Arena da Sala
          </h2>
          <p className="mt-1 text-sm text-[#F0EDE6]/60">
            Respostas parecidas demais indicam copia da mesma IA. Quanto mais longe, mais original.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowBlackSwan((v) => !v)}
            title="Mudar regra da aula"
            aria-label="Mudar regra da aula"
            className={`flex h-11 items-center gap-2 rounded-full px-4 text-xs font-medium transition-all duration-300 ${
              showBlackSwan
                ? "bg-[#C8B560] text-[#0A0A0A]"
                : "bg-[#2A2A2A]/70 text-[#F0EDE6] hover:bg-[#2A2A2A]"
            }`}
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.6} />
            <span>Mudar regra</span>
          </button>

          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            title="Abrir QR Code para celular"
            aria-label="Abrir QR Code para celular"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2A2A2A]/70 text-[#F0EDE6] transition hover:bg-[#C8B560] hover:text-[#0A0A0A]"
          >
            <QrCode className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Modal QR Code Liquid Glass */}
      {showQr && qrUrl && (
        <div className="apple-dock-glass fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="apple-shell w-full max-w-xs">
            <div className="apple-card flex flex-col items-center p-6 text-center">
              <div className="flex w-full justify-end">
                <button
                  type="button"
                  onClick={() => setShowQr(false)}
                  aria-label="Fechar QR Code"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2A2A2A] text-[#F0EDE6]"
                >
                  <X className="h-4 w-4" strokeWidth={1.7} />
                </button>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="QR Code Arena ao Vivo" className="mt-2 h-44 w-44 rounded-2xl" />
              <p className="mt-4 font-display text-base font-semibold text-[#F0EDE6]">
                Participe pelo celular
              </p>
              <p className="mt-1 text-xs text-[#F0EDE6]/60">
                Sua resposta aparece no mapa da turma na hora.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pergunta viva */}
      <div className="rounded-[24px] bg-[#2A2A2A]/35 px-6 py-4 ring-1 ring-[#F0EDE6]/8">
        <p className="text-xs text-[#C8B560]">Pergunta ativa na sala</p>
        <p className="mt-1 text-sm font-medium text-[#F0EDE6] sm:text-base">
          {showBlackSwan
            ? analysis.blackSwanPrompt
            : "Quando um sistema de IA acerta 95% das vezes, de quem e a culpa pelos 5% de erro grave?"}
        </p>
      </div>

      {/* Grid Principal: Mapa 2D + Enviar resposta */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Mapa 2D de ideias */}
        <div className="apple-shell lg:col-span-7">
          <div className="apple-card p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-[#F0EDE6]/55">Indice de originalidade da sala</p>
                <div className="mt-1 font-mono text-4xl font-semibold text-[#F0EDE6] tabular-nums">
                  {analysis.originalityIndex}%
                </div>
              </div>
              <div className="text-right text-xs">
                <span className="text-[#C8B560]">
                  {analysis.herdCollapseDetected
                    ? `${analysis.repeatedClusterCount} respostas parecidas`
                    : "Ideias bem distribuidas"}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-[22px] bg-[#0A0A0A] p-3">
              <svg viewBox="0 0 460 220" className="h-52 w-full">
                {/* Eixos sutis */}
                <line x1="230" y1="12" x2="230" y2="208" stroke="rgba(92,92,92,0.3)" strokeDasharray="3 3" />
                <line x1="16" y1="110" x2="444" y2="110" stroke="rgba(92,92,92,0.3)" strokeDasharray="3 3" />

                {/* Linha de debate entre os 2 mais distantes */}
                {analysis.debatePair && (
                  <line
                    x1={20 + (Number(analysis.debatePair[0].coord_x) / 100) * 420}
                    y1={200 - (Number(analysis.debatePair[0].coord_y) / 100) * 180}
                    x2={20 + (Number(analysis.debatePair[1].coord_x) / 100) * 420}
                    y2={200 - (Number(analysis.debatePair[1].coord_y) / 100) * 180}
                    stroke="#C8B560"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {responses.slice(0, 18).map((r, idx) => {
                  const cx = 20 + (Number(r.coord_x) / 100) * 420;
                  const cy = 200 - (Number(r.coord_y) / 100) * 180;
                  const highUnique = Number(r.uniqueness_score) >= 65;
                  const labelY = idx % 2 === 0 ? cy - 11 : cy + 16;
                  return (
                    <g key={r.id}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={highUnique ? 7 : 5}
                        fill={highUnique ? "#C8B560" : "#5C5C5C"}
                        fillOpacity={highUnique ? 0.92 : 0.75}
                      />
                      <text
                        x={cx}
                        y={labelY}
                        textAnchor="middle"
                        fill="#F0EDE6"
                        fillOpacity={highUnique ? 0.9 : 0.6}
                        fontSize="9.5"
                        fontFamily="var(--font-sans)"
                      >
                        {r.participant_name.split(" ")[0]}
                      </text>
                    </g>
                  );
                })}

                <text x="18" y="212" fill="#5C5C5C" fontSize="9" fontFamily="var(--font-mono)">
                  Respostas comuns
                </text>
                <text x="342" y="212" fill="#C8B560" fontSize="9" fontFamily="var(--font-mono)">
                  Ideias proprias
                </text>
              </svg>
            </div>

            {analysis.debatePair && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {analysis.debatePair.map((side, idx) => (
                  <div key={side.id} className="apple-subcard p-3.5 text-xs">
                    <div className="font-medium text-[#C8B560]">
                      Visao {idx + 1}: {side.participant_name}
                    </div>
                    <p className="mt-1 line-clamp-2 text-[#F0EDE6]/70">
                      {side.response_text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Envio ao vivo */}
        <div className="apple-shell lg:col-span-5">
          <form onSubmit={handleSend} className="apple-card flex h-full flex-col justify-between space-y-4 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-[#F0EDE6]">
                <Radio className="h-4 w-4 text-[#C8B560]" strokeWidth={1.6} />
                <span>Enviar resposta ao vivo</span>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-2xl bg-[#0A0A0A] px-4 py-3 text-sm text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />

              <textarea
                rows={4}
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva sua opiniao em 1 ou 2 frases..."
                className="w-full rounded-2xl bg-[#0A0A0A] p-4 text-sm text-[#F0EDE6] outline-none ring-1 ring-[#5C5C5C]/40 focus:ring-[#C8B560]"
              />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={sending || text.trim().length < 8}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#C8B560] py-3.5 text-sm font-semibold text-[#0A0A0A] transition-all duration-300 apple-ease hover:bg-[#F0EDE6] active:scale-[0.97] disabled:opacity-40"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
                <span>{sending ? "Enviando..." : "Publicar no mapa"}</span>
              </button>

              <p className="text-center text-xs text-[#F0EDE6]/45">
                {responses.length} participacoes registradas no banco em nuvem
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
