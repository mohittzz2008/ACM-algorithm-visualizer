import type { GraphPreset, GraphData } from './types';
import { ensureSafeBoundaries } from './layout';

export const GRAPH_PRESET_SIMPLE: GraphPreset = {
  id: 'simple-graph',
  name: 'Simple Graph',
  description: 'Classic 7-node graph with multiple branching paths and interconnected levels.',
  defaultStartNode: 0,
  defaultTargetNode: 5,
  graph: {
    isDirected: false,
    nodes: ensureSafeBoundaries([
      { id: 0, label: '0', x: 250, y: 60 },
      { id: 1, label: '1', x: 150, y: 165 },
      { id: 2, label: '2', x: 250, y: 165 },
      { id: 3, label: '3', x: 360, y: 165 },
      { id: 6, label: '6', x: 100, y: 285 },
      { id: 4, label: '4', x: 200, y: 285 },
      { id: 5, label: '5', x: 295, y: 285 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 6 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
    ],
  },
};

export const GRAPH_PRESET_BINARY_TREE: GraphPreset = {
  id: 'binary-tree',
  name: 'Binary Tree',
  description: 'Hierarchical 7-node balanced tree highlighting level-order BFS queue expansion.',
  defaultStartNode: 0,
  defaultTargetNode: 6,
  graph: {
    isDirected: false,
    nodes: ensureSafeBoundaries([
      { id: 0, label: '0', x: 250, y: 60 },
      { id: 1, label: '1', x: 150, y: 165 },
      { id: 2, label: '2', x: 350, y: 165 },
      { id: 3, label: '3', x: 100, y: 280 },
      { id: 4, label: '4', x: 200, y: 280 },
      { id: 5, label: '5', x: 300, y: 280 },
      { id: 6, label: '6', x: 400, y: 280 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ],
  },
};

export const GRAPH_PRESET_CYCLE: GraphPreset = {
  id: 'cycle-graph',
  name: 'Cycle Graph',
  description: 'Symmetrical 6-node cycle demonstrating visited duplicate avoidance.',
  defaultStartNode: 0,
  defaultTargetNode: 3,
  graph: {
    isDirected: false,
    nodes: ensureSafeBoundaries([
      { id: 0, label: '0', x: 250, y: 65 },
      { id: 1, label: '1', x: 360, y: 125 },
      { id: 2, label: '2', x: 360, y: 245 },
      { id: 3, label: '3', x: 250, y: 305 },
      { id: 4, label: '4', x: 140, y: 245 },
      { id: 5, label: '5', x: 140, y: 125 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 5, to: 0 },
    ],
  },
};

export const GRAPH_PRESET_DISCONNECTED: GraphPreset = {
  id: 'disconnected',
  name: 'Disconnected',
  description: 'Two separate components (0-1-2 and 3-4-5) to demonstrate reachable vs unreachable components.',
  defaultStartNode: 0,
  defaultTargetNode: 5,
  graph: {
    isDirected: false,
    nodes: ensureSafeBoundaries([
      // Component A
      { id: 0, label: '0', x: 120, y: 130 },
      { id: 1, label: '1', x: 210, y: 130 },
      { id: 2, label: '2', x: 120, y: 240 },
      // Component B
      { id: 3, label: '3', x: 360, y: 130 },
      { id: 4, label: '4', x: 300, y: 240 },
      { id: 5, label: '5', x: 420, y: 240 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 3, to: 4 },
      { from: 3, to: 5 },
    ],
  },
};

export const GRAPH_PRESET_GRID: GraphPreset = {
  id: 'grid-graph',
  name: 'Grid Graph',
  description: '3x3 planar grid with multiple alternate paths illustrating breadth-first wave expansion.',
  defaultStartNode: 0,
  defaultTargetNode: 8,
  graph: {
    isDirected: false,
    nodes: ensureSafeBoundaries([
      { id: 0, label: '0', x: 140, y: 80 },
      { id: 1, label: '1', x: 250, y: 80 },
      { id: 2, label: '2', x: 360, y: 80 },
      { id: 3, label: '3', x: 140, y: 180 },
      { id: 4, label: '4', x: 250, y: 180 },
      { id: 5, label: '5', x: 360, y: 180 },
      { id: 6, label: '6', x: 140, y: 280 },
      { id: 7, label: '7', x: 250, y: 280 },
      { id: 8, label: '8', x: 360, y: 280 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 6 },
      { from: 4, to: 7 },
      { from: 5, to: 8 },
    ],
  },
};

export const GRAPH_PRESET_DIRECTED: GraphPreset = {
  id: 'directed-graph',
  name: 'Directed Graph',
  description: 'Directed graph where edges only permit traversal in the forward arrow direction.',
  defaultStartNode: 0,
  defaultTargetNode: 5,
  graph: {
    isDirected: true,
    nodes: ensureSafeBoundaries([
      { id: 0, label: '0', x: 250, y: 60 },
      { id: 1, label: '1', x: 150, y: 165 },
      { id: 2, label: '2', x: 250, y: 165 },
      { id: 3, label: '3', x: 350, y: 165 },
      { id: 4, label: '4', x: 150, y: 280 },
      { id: 5, label: '5', x: 280, y: 280 },
    ]),
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
    ],
  },
};

export const GRAPH_PRESETS: GraphPreset[] = [
  GRAPH_PRESET_SIMPLE,
  GRAPH_PRESET_BINARY_TREE,
  GRAPH_PRESET_CYCLE,
  GRAPH_PRESET_DISCONNECTED,
  GRAPH_PRESET_GRID,
  GRAPH_PRESET_DIRECTED,
];

export const DEFAULT_GRAPH_DATA: GraphData = GRAPH_PRESET_SIMPLE.graph;
export const DEFAULT_START_NODE = 0;
