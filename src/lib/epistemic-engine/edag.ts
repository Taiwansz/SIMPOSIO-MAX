import { EDAGCompileReport, EDAGNode } from "./types";

/**
 * Executa ordenacao topologica via Algoritmo de Kahn em complexidade O(V + E).
 * Lanca erro caso exista ciclo no grafo de pre-requisitos.
 */
export function kahnTopologicalSort(nodes: EDAGNode[]): string[] {
  const nodeMap = new Map<string, EDAGNode>(nodes.map((n) => [n.id, n]));
  const inDegree = new Map<string, number>();
  const adjOut = new Map<string, string[]>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adjOut.set(n.id, []);
  }

  for (const n of nodes) {
    for (const prereq of n.prerequisites) {
      if (nodeMap.has(prereq)) {
        adjOut.get(prereq)!.push(n.id);
        inDegree.set(n.id, (inDegree.get(n.id) ?? 0) + 1);
      }
    }
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    order.push(u);
    for (const v of adjOut.get(u) ?? []) {
      const nextDeg = (inDegree.get(v) ?? 0) - 1;
      inDegree.set(v, nextDeg);
      if (nextDeg === 0) {
        queue.push(v);
      }
    }
  }

  if (order.length !== nodes.length) {
    const unresolved = nodes
      .filter((n) => (inDegree.get(n.id) ?? 0) > 0)
      .map((n) => n.id);
    throw new Error(`Ciclo epistemologico detectado nos vertices: ${unresolved.join(", ")}`);
  }

  return order;
}

/**
 * Varredura DFS com pilha de recursao para diagnosticar ciclos exatos no E-DAG.
 */
export function diagnoseCycles(nodes: EDAGNode[]): string[][] {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adjOut = new Map<string, string[]>();
  for (const n of nodes) adjOut.set(n.id, []);
  for (const n of nodes) {
    for (const p of n.prerequisites) {
      if (nodeIds.has(p)) adjOut.get(p)!.push(n.id);
    }
  }

  const color = new Map<string, 0 | 1 | 2>(); // 0=white, 1=gray, 2=black
  const stack: string[] = [];
  const cycles: string[][] = [];
  for (const n of nodes) color.set(n.id, 0);

  function dfs(u: string) {
    color.set(u, 1);
    stack.push(u);
    for (const v of adjOut.get(u) ?? []) {
      const c = color.get(v);
      if (c === 1) {
        const idx = stack.indexOf(v);
        if (idx !== -1) {
          cycles.push([...stack.slice(idx), v]);
        }
      } else if (c === 0) {
        dfs(v);
      }
    }
    stack.pop();
    color.set(u, 2);
  }

  for (const n of nodes) {
    if (color.get(n.id) === 0) dfs(n.id);
  }

  return cycles;
}

/**
 * Calcula a Rota Critica de Aprendizagem (caminho ponderado mais profundo)
 * usando programacao dinamica sobre a ordenacao topologica.
 */
export function computeCriticalPath(
  nodes: EDAGNode[],
  targetNodeId?: string
): { path: string[]; totalWeight: number } {
  const nodeMap = new Map<string, EDAGNode>(nodes.map((n) => [n.id, n]));
  const topo = kahnTopologicalSort(nodes);
  const adjOut = new Map<string, string[]>();
  for (const n of nodes) adjOut.set(n.id, []);
  for (const n of nodes) {
    for (const p of n.prerequisites) {
      if (nodeMap.has(p)) adjOut.get(p)!.push(n.id);
    }
  }

  const dist = new Map<string, number>();
  const parent = new Map<string, string | null>();
  for (const n of nodes) {
    dist.set(n.id, n.complexity);
    parent.set(n.id, null);
  }

  for (const u of topo) {
    const du = dist.get(u) ?? 0;
    for (const v of adjOut.get(u) ?? []) {
      const candidate = du + (nodeMap.get(v)?.complexity ?? 1);
      if (candidate > (dist.get(v) ?? 0)) {
        dist.set(v, candidate);
        parent.set(v, u);
      }
    }
  }

  let endNode: string | null = null;
  if (targetNodeId && nodeMap.has(targetNodeId)) {
    endNode = targetNodeId;
  } else {
    let best = -1;
    for (const [id, d] of dist.entries()) {
      if (d > best) {
        best = d;
        endNode = id;
      }
    }
  }

  const path: string[] = [];
  let curr = endNode;
  while (curr) {
    path.push(curr);
    curr = parent.get(curr) ?? null;
  }
  path.reverse();

  const totalWeight = Number(
    (endNode ? dist.get(endNode) ?? 0 : 0).toFixed(2)
  );
  return { path, totalWeight };
}

/**
 * Identifica nos de estrangulamento epistemico (Keystones) via alcance transitivo a jusante.
 */
export function detectEpistemicBottlenecks(nodes: EDAGNode[]) {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const adjOut = new Map<string, string[]>();
  for (const n of nodes) adjOut.set(n.id, []);
  for (const n of nodes) {
    for (const p of n.prerequisites) {
      if (nodeIds.has(p)) adjOut.get(p)!.push(n.id);
    }
  }

  const results = nodes.map((n) => {
    const visited = new Set<string>();
    const queue = [...(adjOut.get(n.id) ?? [])];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr)) continue;
      visited.add(curr);
      for (const nxt of adjOut.get(curr) ?? []) {
        if (!visited.has(nxt)) queue.push(nxt);
      }
    }
    const downstreamCount = visited.size;
    const leverageRatio = Number((downstreamCount / Math.max(0.5, n.complexity)).toFixed(2));
    return {
      nodeId: n.id,
      code: n.code,
      title: n.title,
      downstreamCount,
      leverageRatio,
    };
  });

  return results.sort((a, b) => b.downstreamCount - a.downstreamCount || b.leverageRatio - a.leverageRatio);
}

/**
 * Extrai o subgrafo induzido minimo de remediacao para desbloquear um conceito alvo,
 * isolando apenas pre-requisitos ancestrais abaixo do limiar de consolidacao (0.82).
 */
export function extractRemediationSubgraph(
  nodes: EDAGNode[],
  masteryMap: Record<string, number>,
  targetNodeId: string,
  masteryThreshold = 0.82
): {
  targetNodeId: string;
  blocked: boolean;
  missingPrerequisites: EDAGNode[];
  orderedTrail: EDAGNode[];
  totalComplexity: number;
} {
  const nodeMap = new Map<string, EDAGNode>(nodes.map((n) => [n.id, n]));
  const target = nodeMap.get(targetNodeId);
  if (!target) {
    throw new Error(`No alvo '${targetNodeId}' nao encontrado no E-DAG.`);
  }

  const ancestors = new Set<string>();
  const bfsQueue = [...target.prerequisites];
  while (bfsQueue.length > 0) {
    const id = bfsQueue.shift()!;
    if (ancestors.has(id) || !nodeMap.has(id)) continue;
    ancestors.add(id);
    for (const p of nodeMap.get(id)!.prerequisites) {
      if (!ancestors.has(p)) bfsQueue.push(p);
    }
  }

  const missingIds = new Set<string>();
  for (const ancId of ancestors) {
    const mastery = masteryMap[ancId] ?? 0.1;
    if (mastery < masteryThreshold) {
      missingIds.add(ancId);
    }
  }

  const trailIds = new Set<string>([...missingIds, targetNodeId]);
  const topo = kahnTopologicalSort(nodes).filter((id) => trailIds.has(id));
  const orderedTrail = topo.map((id) => nodeMap.get(id)!);
  const missingPrerequisites = topo
    .filter((id) => missingIds.has(id))
    .map((id) => nodeMap.get(id)!);

  const totalComplexity = Number(
    orderedTrail.reduce((acc, n) => acc + n.complexity, 0).toFixed(2)
  );

  return {
    targetNodeId,
    blocked: missingPrerequisites.length > 0,
    missingPrerequisites,
    orderedTrail,
    totalComplexity,
  };
}

/**
 * Compila relatorio completo de integridade e metricas estruturais do E-DAG.
 */
export function compileEDAGReport(nodes: EDAGNode[]): EDAGCompileReport {
  const cycles = diagnoseCycles(nodes);
  if (cycles.length > 0) {
    return {
      isAcyclic: false,
      topologicalOrder: [],
      cycleChains: cycles,
      criticalPath: [],
      criticalPathWeight: 0,
      bottlenecks: [],
      maxDepth: 0,
      edgeCount: nodes.reduce((acc, n) => acc + n.prerequisites.length, 0),
    };
  }

  const topologicalOrder = kahnTopologicalSort(nodes);
  const critical = computeCriticalPath(nodes);
  const bottlenecks = detectEpistemicBottlenecks(nodes);
  const edgeCount = nodes.reduce((acc, n) => acc + n.prerequisites.length, 0);

  // Profundidade maxima em arestas
  const depthMap = new Map<string, number>();
  for (const id of topologicalOrder) {
    const node = nodes.find((n) => n.id === id)!;
    const parentDepths = node.prerequisites.map((p) => depthMap.get(p) ?? 0);
    depthMap.set(id, parentDepths.length > 0 ? Math.max(...parentDepths) + 1 : 0);
  }
  const maxDepth = Math.max(0, ...depthMap.values());

  return {
    isAcyclic: true,
    topologicalOrder,
    cycleChains: [],
    criticalPath: critical.path,
    criticalPathWeight: critical.totalWeight,
    bottlenecks: bottlenecks.slice(0, 6),
    maxDepth,
    edgeCount,
  };
}
