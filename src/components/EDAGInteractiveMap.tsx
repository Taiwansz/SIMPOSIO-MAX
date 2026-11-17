"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, GitBranch, Lock, Route, ShieldCheck } from "lucide-react";
import { extractRemediationSubgraph } from "@/lib/epistemic-engine/edag";
import { EDAGCompileReport, EDAGNode, StudentNodeState } from "@/lib/epistemic-engine/types";

interface EDAGInteractiveMapProps {
  nodes: EDAGNode[];
  states: StudentNodeState[];
  edagReport: EDAGCompileReport;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onLaunchSocratic: (nodeId: string) => void;
}

export default function EDAGInteractiveMap({
  nodes,
  states,
  edagReport,
  selectedNodeId,
  onSelectNode,
  onLaunchSocratic,
}: EDAGInteractiveMapProps) {
  const [highlightCritical, setHighlightCritical] = useState(true);

  const masteryMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const st of states) map[st.node_id] = Number(st.p_mastery);
    return map;
  }, [states]);

  // Agrupa vertices por semestre (colunas topologicas) para posicionamento deterministico
  const positionedNodes = useMemo(() => {
    const bySemester = new Map<number, EDAGNode[]>();
    for (const n of nodes) {
      const list = bySemester.get(n.semester) ?? [];
      list.push(n);
      bySemester.set(n.semester, list);
    }

    const semesters = Array.from(bySemester.keys()).sort((a, b) => a - b);
    const width = 980;
    const height = 430;
    const padX = 82;
    const padY = 58;

    const coords = new Map<string, { x: number; y: number }>();
    semesters.forEach((sem, colIdx) => {
      const colNodes = bySemester.get(sem) ?? [];
      const x =
        semesters.length > 1
          ? padX + (colIdx / (semesters.length - 1)) * (width - padX * 2)
          : width / 2;
      colNodes.forEach((node, rowIdx) => {
        const y =
          colNodes.length === 1
            ? height / 2
            : padY + (rowIdx / (colNodes.length - 1)) * (height - padY * 2);
        coords.set(node.id, { x, y });
      });
    });
    return { coords, width, height };
  }, [nodes]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId]
  );

  const remediation = useMemo(() => {
    if (!selectedNode) return null;
    try {
      return extractRemediationSubgraph(nodes, masteryMap, selectedNode.id, 0.82);
    } catch {
      return null;
    }
  }, [nodes, masteryMap, selectedNode]);

  const criticalSet = useMemo(() => new Set(edagReport.criticalPath), [edagReport]);
  const remediationSet = useMemo(
    () => new Set((remediation?.orderedTrail ?? []).map((n) => n.id)),
    [remediation]
  );

  const getMasteryColor = (p: number) => {
    if (p >= 0.82) return "#10B981";
    if (p >= 0.45) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[#C8B560]">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Compilador E-DAG // Algoritmo de Kahn O(V + E)</span>
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            Cartografia Epistemica e Subgrafo de Remediacao
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Clique em qualquer unidade curricular para executar extracao de pre-requisitos nao consolidados e verificar bloqueios estruturais de avanco.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setHighlightCritical((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition ${
              highlightCritical
                ? "border-[#C8B560]/60 bg-[#C8B560]/15 text-[#FFF2AC]"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25"
            }`}
          >
            <Route className="h-3.5 w-3.5" />
            <span>Rota Critica ({edagReport.criticalPath.length} nos)</span>
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 font-mono text-xs text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{edagReport.isAcyclic ? "DAG Aciclico Validado" : "Ciclo Detectado"}</span>
          </div>
        </div>
      </div>

      {/* Grid Principal: SVG Cartografia + Painel de Inspecao */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="doppelrand-outer xl:col-span-8">
          <div className="doppelrand-inner relative overflow-hidden p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                  Consolidado (&ge; 82%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
                  Incubando (45-81%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444]" />
                  Vulneravel (&lt; 45%)
                </span>
              </div>
              <span>
                V={nodes.length} | E={edagReport.edgeCount} | Profundidade={edagReport.maxDepth}
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${positionedNodes.width} ${positionedNodes.height}`}
                className="h-[340px] w-full min-w-[680px] sm:h-[420px]"
                role="img"
                aria-label="Grafo Direcionado Aciclico Epistemologico da grade curricular"
              >
                <defs>
                  <marker
                    id="arrow-default"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="5"
                    markerHeight="5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(148,163,184,0.45)" />
                  </marker>
                  <marker
                    id="arrow-gold"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#C8B560" />
                  </marker>
                </defs>

                {/* Arestas */}
                {nodes.flatMap((node) =>
                  node.prerequisites.map((preId) => {
                    const from = positionedNodes.coords.get(preId);
                    const to = positionedNodes.coords.get(node.id);
                    if (!from || !to) return null;

                    const onCritical =
                      highlightCritical &&
                      criticalSet.has(preId) &&
                      criticalSet.has(node.id);
                    const onRemediation =
                      remediationSet.has(preId) && remediationSet.has(node.id);

                    const dx = (to.x - from.x) * 0.5;
                    const pathD = `M ${from.x + 20} ${from.y} C ${from.x + dx} ${from.y}, ${
                      to.x - dx
                    } ${to.y}, ${to.x - 22} ${to.y}`;

                    return (
                      <path
                        key={`${preId}->${node.id}`}
                        d={pathD}
                        fill="none"
                        stroke={
                          onRemediation
                            ? "#F59E0B"
                            : onCritical
                            ? "#C8B560"
                            : "rgba(148, 163, 184, 0.22)"
                        }
                        strokeWidth={onRemediation || onCritical ? 2.2 : 1.15}
                        strokeDasharray={onRemediation ? "5 3" : undefined}
                        markerEnd={
                          onCritical || onRemediation ? "url(#arrow-gold)" : "url(#arrow-default)"
                        }
                      />
                    );
                  })
                )}

                {/* Vertices */}
                {nodes.map((node) => {
                  const pos = positionedNodes.coords.get(node.id);
                  if (!pos) return null;
                  const mastery = masteryMap[node.id] ?? 0.2;
                  const color = getMasteryColor(mastery);
                  const isSelected = node.id === selectedNode?.id;
                  const isCritical = highlightCritical && criticalSet.has(node.id);
                  const isInRemediation = remediationSet.has(node.id);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      onClick={() => onSelectNode(node.id)}
                      className="cursor-pointer"
                    >
                      {(isSelected || isCritical) && (
                        <circle
                          r={isSelected ? 27 : 23}
                          fill="none"
                          stroke={isSelected ? "#FFF2AC" : "rgba(200,181,96,0.45)"}
                          strokeWidth={isSelected ? 2 : 1.2}
                          strokeDasharray={isSelected ? undefined : "3 3"}
                        />
                      )}
                      <circle
                        r={19}
                        fill="#0D0E12"
                        stroke={isInRemediation ? "#F59E0B" : color}
                        strokeWidth={2.2}
                      />
                      <text
                        textAnchor="middle"
                        dy="0.32em"
                        fill="#F8FAFC"
                        fontSize="9"
                        fontFamily="var(--font-mono)"
                        fontWeight="600"
                      >
                        {Math.round(mastery * 100)}%
                      </text>
                      <text
                        y="31"
                        textAnchor="middle"
                        fill={isSelected ? "#FFF2AC" : "#CBD5E1"}
                        fontSize="9.5"
                        fontFamily="var(--font-mono)"
                        fontWeight={isSelected ? "700" : "500"}
                      >
                        {node.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Painel Direito: Diagnostico do Vertice + Subgrafo de Remediacao */}
        <div className="space-y-4 xl:col-span-4">
          {selectedNode && remediation && (
            <div className="liquid-glass rounded-[20px] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-xs text-[#C8B560]">
                    {selectedNode.code} // Semestre {selectedNode.semester} // {selectedNode.bloom_level}
                  </span>
                  <h4 className="mt-1 text-lg font-semibold text-white">{selectedNode.title}</h4>
                </div>
                <span
                  className="rounded-full border px-2.5 py-1 font-mono text-xs font-semibold tabular-nums"
                  style={{
                    borderColor: `${getMasteryColor(masteryMap[selectedNode.id] ?? 0.2)}55`,
                    color: getMasteryColor(masteryMap[selectedNode.id] ?? 0.2),
                    backgroundColor: `${getMasteryColor(masteryMap[selectedNode.id] ?? 0.2)}15`,
                  }}
                >
                  P(Lt) {((masteryMap[selectedNode.id] ?? 0.2) * 100).toFixed(1)}%
                </span>
              </div>

              <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                {selectedNode.description}
              </p>

              {/* Status de Bloqueio de Pre-requisito */}
              <div
                className={`mt-4 rounded-xl border p-3.5 ${
                  remediation.blocked
                    ? "border-amber-500/40 bg-amber-500/10"
                    : "border-emerald-500/35 bg-emerald-500/10"
                }`}
              >
                <div className="flex items-center gap-2 font-mono text-xs font-semibold">
                  {remediation.blocked ? (
                    <>
                      <Lock className="h-4 w-4 text-amber-400" />
                      <span className="text-amber-300">
                        AVANCO BLOQUEADO POR PRE-REQUISITO
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        PRE-REQUISITOS CONSOLIDADOS
                      </span>
                    </>
                  )}
                </div>

                {remediation.blocked ? (
                  <div className="mt-2 space-y-1.5 text-xs text-slate-200">
                    <p className="text-slate-300">
                      Trilha minima de remediacao induzida ({remediation.missingPrerequisites.length} gargalo(s)):
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {remediation.orderedTrail.map((step, idx) => {
                        const isTarget = step.id === selectedNode.id;
                        return (
                          <button
                            key={step.id}
                            type="button"
                            onClick={() => onSelectNode(step.id)}
                            className={`rounded-md border px-2 py-1 font-mono text-[11px] transition ${
                              isTarget
                                ? "border-[#C8B560]/60 bg-[#C8B560]/15 text-[#FFF2AC]"
                                : "border-amber-400/40 bg-black/40 text-amber-200 hover:border-amber-300"
                            }`}
                          >
                            {idx + 1}. {step.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-emerald-200/80">
                    Todos os ancestrais topologicos superam o limiar P(Lt) &ge; 0.82. Estudante apto para arguicao em nivel {selectedNode.bloom_level}.
                  </p>
                )}
              </div>

              {/* Falacias Catalogadas */}
              {selectedNode.fallacies.length > 0 && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 p-3.5">
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-rose-400">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Armadilha / Falacia Monitorada</span>
                  </div>
                  <p className="text-xs italic text-slate-300">
                    &ldquo;{selectedNode.fallacies[0]}&rdquo;
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => onLaunchSocratic(selectedNode.id)}
                className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#C8B560]/50 bg-[#C8B560]/15 px-4 py-3 text-xs font-semibold text-[#FFF2AC] transition hover:bg-[#C8B560]/25"
              >
                <span>Abrir Sabatina Socratica neste Conceito</span>
                <span className="rounded-full bg-[#C8B560] px-2 py-0.5 font-mono text-[10px] text-black">
                  PROBAR
                </span>
              </button>
            </div>
          )}

          {/* Top Bottlenecks */}
          <div className="liquid-glass rounded-[20px] p-4">
            <h5 className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
              Nos Keystone (Maior Alavancagem Curricular)
            </h5>
            <div className="mt-3 space-y-2">
              {edagReport.bottlenecks.slice(0, 4).map((b) => (
                <button
                  key={b.nodeId}
                  type="button"
                  onClick={() => onSelectNode(b.nodeId)}
                  className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-left text-xs transition hover:border-[#C8B560]/40"
                >
                  <div>
                    <span className="font-mono text-[#C8B560]">{b.code}</span>{" "}
                    <span className="text-slate-200">{b.title}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                    {b.downstreamCount} dep. // {b.leverageRatio}x
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
