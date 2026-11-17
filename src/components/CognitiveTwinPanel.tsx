"use client";

import React, { useMemo } from "react";
import { Activity, Brain, Clock, Gauge } from "lucide-react";
import { computeEbbinghausRetention } from "@/lib/epistemic-engine/bkt";
import {
  BrierCalibrationReport,
  EDAGNode,
  StudentNodeState,
} from "@/lib/epistemic-engine/types";

interface CognitiveTwinPanelProps {
  ra: string;
  nodes: EDAGNode[];
  states: StudentNodeState[];
  brierCalibration: BrierCalibrationReport;
  reviewSchedule: Array<{
    nodeId: string;
    pMastery: number;
    retentionNow: number;
    elapsedHours: number;
    stabilityHours: number;
    urgency: string;
  }>;
}

export default function CognitiveTwinPanel({
  ra,
  nodes,
  states,
  brierCalibration,
  reviewSchedule,
}: CognitiveTwinPanelProps) {
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Pontos da curva de esquecimento de Ebbinghaus (0 a 168 horas)
  const decayPoints = useMemo(() => {
    const hours = [0, 12, 24, 48, 72, 96, 120, 144, 168];
    const avgStability =
      states.reduce((acc, s) => acc + Number(s.stability_hours), 0) / Math.max(1, states.length);
    return hours.map((h) => ({
      hour: h,
      athena: computeEbbinghausRetention(0.92, h, Math.max(120, avgStability)),
      passive: computeEbbinghausRetention(0.75, h, 34),
    }));
  }, [states]);

  const toPolyline = (vals: number[], w = 360, h = 140) => {
    return vals
      .map((v, idx) => {
        const x = 20 + (idx / (vals.length - 1)) * (w - 40);
        const y = h - 18 - v * (h - 36);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
            <Brain className="h-3.5 w-3.5" />
            <span>Gemeo Cognitivo Digital // BKT O(1) & Ebbinghaus</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Calibracao Metacognitiva e Curva de Retencao Sinaptica (RA {ra})
          </h3>
        </div>
      </div>

      {/* 3 Paineis Analiticos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Brier Score & Dunning-Kruger */}
        <div className="doppelrand-outer">
          <div className="doppelrand-inner flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-slate-400">
                  Calibracao Metacognitiva
                </span>
                <Gauge className="h-4 w-4 text-[#C8B560]" />
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-mono text-4xl font-bold text-white tabular-nums">
                  {brierCalibration.brierScore.toFixed(3)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                    brierCalibration.brierScore <= 0.14
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {brierCalibration.status}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] text-slate-400">
                BS = (1/N) &Sigma; (f_t - o_t)&sup2; | 0.000 = calibracao perfeita
              </p>
            </div>

            {/* Grafico de Dispersao Confianca vs Mastery */}
            <div className="mt-4 rounded-xl border border-white/5 bg-black/50 p-3">
              <svg viewBox="0 0 240 130" className="h-32 w-full">
                {/* Linha de calibracao perfeita */}
                <line
                  x1="24"
                  y1="110"
                  x2="220"
                  y2="14"
                  stroke="rgba(16,185,129,0.45)"
                  strokeDasharray="4 3"
                  strokeWidth="1.3"
                />
                {/* Zona de risco Dunning-Kruger */}
                <polygon
                  points="24,110 120,110 220,40 220,14"
                  fill="rgba(239,68,68,0.06)"
                />
                {states.slice(0, 14).map((st) => {
                  const mastery = Number(st.p_mastery);
                  const conf = Number(st.confidence_claimed);
                  const cx = 24 + mastery * 196;
                  const cy = 110 - conf * 96;
                  const alert = conf - mastery >= 0.25;
                  return (
                    <circle
                      key={st.node_id}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={alert ? "#EF4444" : "#C8B560"}
                      opacity={0.9}
                    />
                  );
                })}
                <text x="26" y="124" fill="#94A3B8" fontSize="8" fontFamily="var(--font-mono)">
                  Dominio Real P(Lt) &rarr;
                </text>
                <text x="8" y="18" fill="#94A3B8" fontSize="8" fontFamily="var(--font-mono)">
                  Confianca
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Curva de Ebbinghaus */}
        <div className="doppelrand-outer">
          <div className="doppelrand-inner flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase text-slate-400">
                  Decaimento de Ebbinghaus (7 dias)
                </span>
                <Activity className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-emerald-400 tabular-nums">
                  R(t) = P(Lt) &middot; e^(-&Delta;t / S)
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Comparacao entre retencao apos sabatina ativa vs leitura passiva de resumos.
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-black/50 p-3">
              <svg viewBox="0 0 360 140" className="h-36 w-full">
                <polyline
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  points={toPolyline(decayPoints.map((d) => d.passive))}
                />
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                  points={toPolyline(decayPoints.map((d) => d.athena))}
                />
                <text x="24" y="20" fill="#10B981" fontSize="9.5" fontFamily="var(--font-mono)">
                  ThAthena MAX (Ativo): {(decayPoints[decayPoints.length - 1].athena * 100).toFixed(0)}% em 168h
                </text>
                <text x="24" y="128" fill="#EF4444" fontSize="9.5" fontFamily="var(--font-mono)">
                  Resumo Passivo IA: {(decayPoints[decayPoints.length - 1].passive * 100).toFixed(0)}% em 168h
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Fila Priorizada de Revisao Espacada */}
        <div className="doppelrand-outer">
          <div className="doppelrand-inner flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase text-slate-400">
                Fila de Revisao Espacada
              </span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Vertices ordenados pela menor retencao projetada R(t) agora.
            </p>

            <div className="mt-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
              {reviewSchedule.slice(0, 5).map((item) => {
                const node = nodeMap.get(item.nodeId);
                const badgeColor =
                  item.urgency === "URGENTE"
                    ? "text-rose-400 border-rose-500/35 bg-rose-500/10"
                    : item.urgency === "ALERTA"
                    ? "text-amber-300 border-amber-500/35 bg-amber-500/10"
                    : "text-emerald-300 border-emerald-500/35 bg-emerald-500/10";
                return (
                  <div
                    key={item.nodeId}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-white truncate">
                        {node ? `${node.code} ${node.title}` : item.nodeId}
                      </span>
                      <span className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[10px] ${badgeColor}`}>
                        {item.urgency}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#C8B560] to-emerald-400"
                        style={{ width: `${Math.round(item.retentionNow * 100)}%` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between font-mono text-[10px] text-slate-400 tabular-nums">
                      <span>Retencao R(t): {(item.retentionNow * 100).toFixed(1)}%</span>
                      <span>Meia-vida S: {item.stabilityHours.toFixed(0)}h</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
