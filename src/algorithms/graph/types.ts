export interface GraphNode {
  id: number;
  label: string;
  x: number; // 0..500 SVG coordinates
  y: number; // 0..360 SVG coordinates
}

export interface GraphEdge {
  from: number;
  to: number;
  id?: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
}

export interface GraphPreset {
  id: string;
  name: string;
  description: string;
  graph: GraphData;
  defaultStartNode: number;
  defaultTargetNode?: number;
}

export type AdjacencyList = Record<number, number[]>;
export type AdjacencyMatrix = number[][];

/**
 * Builds a deterministic adjacency list from graph data.
 * Neighbors for each node are sorted in ascending order.
 */
export function buildAdjacencyList(graph: GraphData): AdjacencyList {
  const adj: AdjacencyList = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }

  for (const edge of graph.edges) {
    if (adj[edge.from]) {
      if (!adj[edge.from].includes(edge.to)) {
        adj[edge.from].push(edge.to);
      }
    }
    if (!graph.isDirected) {
      if (adj[edge.to]) {
        if (!adj[edge.to].includes(edge.from)) {
          adj[edge.to].push(edge.from);
        }
      }
    }
  }

  // Ensure deterministic traversal: sort neighbor arrays
  for (const nodeId of Object.keys(adj)) {
    adj[Number(nodeId)].sort((a, b) => a - b);
  }

  return adj;
}

/**
 * Builds an adjacency matrix from graph data.
 */
export function buildAdjacencyMatrix(graph: GraphData): AdjacencyMatrix {
  const n = graph.nodes.length;
  // Node IDs might not be 0..n-1 consecutively, map IDs to indices
  const idToIndex = new Map<number, number>();
  graph.nodes.forEach((node, idx) => idToIndex.set(node.id, idx));

  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (const edge of graph.edges) {
    const u = idToIndex.get(edge.from);
    const v = idToIndex.get(edge.to);
    if (u !== undefined && v !== undefined) {
      matrix[u][v] = 1;
      if (!graph.isDirected) {
        matrix[v][u] = 1;
      }
    }
  }

  return matrix;
}
