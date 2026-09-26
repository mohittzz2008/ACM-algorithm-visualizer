import type { GraphNode, GraphEdge } from './types';

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 360;
export const NODE_RADIUS = 20;
export const SAFE_PADDING_LEFT = 75; // Space for L0 (Level 0) indicators on left
export const SAFE_PADDING_RIGHT = 35;
export const SAFE_PADDING_TOP = 55; // Space for START badge above node
export const SAFE_PADDING_BOTTOM = 40;

export interface LevelBandInfo {
  level: number;
  label: string; // e.g. "L0"
  sublabel: string; // e.g. "(Level 0)"
  y: number; // center y-coordinate
  top: number;
  bottom: number;
  nodeIds: number[];
}

/**
 * Clamps a coordinate within the safe drawing bounds of the canvas
 */
export function clampCoordinates(
  x: number,
  y: number,
  paddingLeft: number = SAFE_PADDING_LEFT
): { x: number; y: number } {
  const minX = paddingLeft;
  const maxX = CANVAS_WIDTH - SAFE_PADDING_RIGHT;
  const minY = SAFE_PADDING_TOP;
  const maxY = CANVAS_HEIGHT - SAFE_PADDING_BOTTOM;

  return {
    x: Math.round(Math.max(minX, Math.min(maxX, x))),
    y: Math.round(Math.max(minY, Math.min(maxY, y))),
  };
}

/**
 * Computes BFS topological levels from startNode.
 * Uses undirected adjacency for geometric layout so connected components form natural trees.
 */
export function computeGraphLevels(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: number = 0
): { nodeLevels: Record<number, number>; maxLevel: number; levelsMap: Record<number, number[]> } {
  const count = nodes.length;
  if (count === 0) {
    return { nodeLevels: {}, maxLevel: 0, levelsMap: {} };
  }

  const effectiveStart = nodes.some((n) => n.id === startNode) ? startNode : nodes[0].id;
  const nodeIds = new Set(nodes.map((n) => n.id));

  // Build undirected adjacency for layout topology
  const adj: Record<number, number[]> = {};
  for (const n of nodes) {
    adj[n.id] = [];
  }
  for (const e of edges) {
    if (nodeIds.has(e.from) && nodeIds.has(e.to) && e.from !== e.to) {
      if (!adj[e.from].includes(e.to)) adj[e.from].push(e.to);
      if (!adj[e.to].includes(e.from)) adj[e.to].push(e.from);
    }
  }
  for (const id of Object.keys(adj)) {
    adj[Number(id)].sort((a, b) => a - b);
  }

  const nodeLevels: Record<number, number> = {};
  const visited = new Set<number>();

  // Primary component traversal from effectiveStart
  const queue: number[] = [effectiveStart];
  visited.add(effectiveStart);
  nodeLevels[effectiveStart] = 0;

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const lvl = nodeLevels[curr];
    for (const nbr of adj[curr] || []) {
      if (!visited.has(nbr)) {
        visited.add(nbr);
        nodeLevels[nbr] = lvl + 1;
        queue.push(nbr);
      }
    }
  }

  // Handle any disconnected components:
  // Place disconnected components on clean levels rather than 1 node per level
  let currentMaxLevel = Math.max(0, ...Object.values(nodeLevels));

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      // New disconnected component: starts at level 1 or level after maxLevel
      const compStartLvl = Math.min(currentMaxLevel + 1, 3);
      const compQueue: number[] = [node.id];
      visited.add(node.id);
      nodeLevels[node.id] = compStartLvl;

      while (compQueue.length > 0) {
        const curr = compQueue.shift()!;
        const lvl = nodeLevels[curr];
        for (const nbr of adj[curr] || []) {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            nodeLevels[nbr] = lvl + 1;
            compQueue.push(nbr);
          }
        }
      }
      currentMaxLevel = Math.max(currentMaxLevel, ...Object.values(nodeLevels));
    }
  }

  const maxLevel = Math.max(0, ...Object.values(nodeLevels));
  const levelsMap: Record<number, number[]> = {};

  for (const node of nodes) {
    const lvl = nodeLevels[node.id] ?? 0;
    if (!levelsMap[lvl]) levelsMap[lvl] = [];
    levelsMap[lvl].push(node.id);
  }

  return { nodeLevels, maxLevel, levelsMap };
}

/**
 * Computes a robust, bounded layout for any graph.
 * Keeps all nodes strictly within canvas bounds, centers levels,
 * orders children under their parents, and ensures zero overlap.
 */
export function computeAutoLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: number = 0,
  _isDirected: boolean = false
): GraphNode[] {
  const count = nodes.length;
  if (count === 0) return [];
  if (count === 1) {
    return [{ id: nodes[0].id, label: nodes[0].label, x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }];
  }

  // If node count is 2 and no edges, place them horizontally centered
  if (count === 2 && edges.length === 0) {
    return [
      { id: nodes[0].id, label: nodes[0].label, x: 200, y: CANVAS_HEIGHT / 2 },
      { id: nodes[1].id, label: nodes[1].label, x: 320, y: CANVAS_HEIGHT / 2 },
    ];
  }

  // If graph has zero edges (e.g. after Clear Graph), arrange in a balanced 2D grid
  if (edges.length === 0) {
    const cols = count <= 4 ? count : count <= 8 ? 4 : 5;
    const rows = Math.ceil(count / cols);
    const colSpacing = (CANVAS_WIDTH - SAFE_PADDING_LEFT - SAFE_PADDING_RIGHT) / (cols + 1);
    const rowSpacing = (CANVAS_HEIGHT - SAFE_PADDING_TOP - SAFE_PADDING_BOTTOM) / (rows + 1);

    return nodes.map((node, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const x = Math.round(SAFE_PADDING_LEFT + (c + 1) * colSpacing);
      const y = Math.round(SAFE_PADDING_TOP + (r + 1) * rowSpacing);
      return { id: node.id, label: node.label, x, y };
    });
  }

  const { maxLevel, levelsMap } = computeGraphLevels(nodes, edges, startNode);
  const totalLevels = Math.max(1, maxLevel + 1);

  // Compute vertical spacing between levels
  const availableHeight = CANVAS_HEIGHT - SAFE_PADDING_TOP - SAFE_PADDING_BOTTOM;
  const verticalSpacing = totalLevels > 1 ? availableHeight / (totalLevels - 1) : 0;

  // Track parent relationships to order children beneath parents
  const parentMap: Record<number, number> = {};
  for (const e of edges) {
    // If e.from has smaller level than e.to, from is parent
    if (parentMap[e.to] === undefined) {
      parentMap[e.to] = e.from;
    }
  }

  const assignedPositions: Record<number, { x: number; y: number }> = {};

  for (let l = 0; l < totalLevels; l++) {
    let levelNodes = levelsMap[l] || [];
    const k = levelNodes.length;
    if (k === 0) continue;

    const yBase = totalLevels === 1
      ? CANVAS_HEIGHT / 2
      : SAFE_PADDING_TOP + l * verticalSpacing;

    // Sort levelNodes so children of the same parent are grouped and ordered by parent's x
    if (l > 0) {
      levelNodes = [...levelNodes].sort((a, b) => {
        const parentA = parentMap[a];
        const parentB = parentMap[b];
        const parentAX = parentA !== undefined && assignedPositions[parentA] ? assignedPositions[parentA].x : 250;
        const parentBX = parentB !== undefined && assignedPositions[parentB] ? assignedPositions[parentB].x : 250;
        if (parentAX !== parentBX) return parentAX - parentBX;
        return a - b;
      });
    } else {
      levelNodes = [...levelNodes].sort((a, b) => a - b);
    }

    const horizontalSpan = CANVAS_WIDTH - SAFE_PADDING_LEFT - SAFE_PADDING_RIGHT;

    for (let i = 0; i < k; i++) {
      const id = levelNodes[i];
      let x: number;

      if (k === 1) {
        x = (SAFE_PADDING_LEFT + (CANVAS_WIDTH - SAFE_PADDING_RIGHT)) / 2;
      } else {
        // Evenly space nodes across the horizontal span
        x = SAFE_PADDING_LEFT + ((i + 1) * horizontalSpan) / (k + 1);
      }

      // If a level is dense (k > 5), stagger vertical height slightly to avoid label crowding
      let y = yBase;
      if (k > 5) {
        y += i % 2 === 0 ? -10 : 10;
      }

      const clamped = clampCoordinates(x, y, SAFE_PADDING_LEFT);
      assignedPositions[id] = clamped;
    }
  }

  return nodes.map((node) => {
    const pos = assignedPositions[node.id];
    if (pos) {
      return { ...node, x: pos.x, y: pos.y };
    }
    const clamped = clampCoordinates(node.x, node.y, SAFE_PADDING_LEFT);
    return { ...node, x: clamped.x, y: clamped.y };
  });
}

/**
 * Computes level bounding bands for BFS visualization.
 * Returns rectangular regions for each level (L0, L1, L2, L3...)
 * to render dashed horizontal containers matching the reference design.
 */
export function computeLevelBands(
  nodes: GraphNode[],
  edges: GraphEdge[],
  startNode: number = 0,
  _activeNodeLevels?: Record<number, number>
): LevelBandInfo[] {
  if (nodes.length === 0) return [];

  const { levelsMap, maxLevel } = computeGraphLevels(nodes, edges, startNode);
  const bands: LevelBandInfo[] = [];

  const totalLevels = Math.max(1, maxLevel + 1);
  const availableHeight = CANVAS_HEIGHT - SAFE_PADDING_TOP - SAFE_PADDING_BOTTOM;
  const verticalSpacing = totalLevels > 1 ? availableHeight / (totalLevels - 1) : 0;

  for (let l = 0; l <= maxLevel; l++) {
    const nodeIds = levelsMap[l] || [];
    if (nodeIds.length === 0) continue;

    // Find y of nodes in this level or use computed yBase
    const levelNodes = nodes.filter((n) => nodeIds.includes(n.id));
    const avgY = levelNodes.length > 0
      ? levelNodes.reduce((sum, n) => sum + n.y, 0) / levelNodes.length
      : SAFE_PADDING_TOP + l * verticalSpacing;

    const halfHeight = totalLevels <= 3 ? 32 : Math.min(28, verticalSpacing / 2 - 2);
    const top = Math.max(12, Math.round(avgY - halfHeight));
    const bottom = Math.min(CANVAS_HEIGHT - 12, Math.round(avgY + halfHeight));

    bands.push({
      level: l,
      label: `L${l}`,
      sublabel: `(Level ${l})`,
      y: Math.round(avgY),
      top,
      bottom,
      nodeIds,
    });
  }

  return bands;
}

/**
 * Validates that all node coordinates in a graph reside safely within the canvas bounds.
 */
export function ensureSafeBoundaries(nodes: GraphNode[]): GraphNode[] {
  return nodes.map((node) => {
    const clamped = clampCoordinates(node.x, node.y, SAFE_PADDING_LEFT);
    return {
      ...node,
      x: clamped.x,
      y: clamped.y,
    };
  });
}
