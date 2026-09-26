export type StepType =
  | 'initial'
  | 'compare'
  | 'swap'
  | 'no-swap'
  | 'pass-complete'
  | 'sorted'
  | 'complete'
  // Merge sort step types
  | 'divide'
  | 'enter-range'
  | 'base-case'
  | 'recurse-left'
  | 'recurse-right'
  | 'return-from-recursion'
  | 'merge-start'
  | 'take-left'
  | 'take-right'
  | 'append-left'
  | 'append-right'
  | 'write'
  | 'merge-complete'
  // Binary search step types
  | 'calc-mid'
  | 'calculate-mid'
  | 'decide'
  | 'eliminate'
  | 'update-range'
  | 'target-found'
  | 'target-not-found'
  // Graph traversal step types
  | 'graph-init'
  | 'bfs-enqueue'
  | 'bfs-dequeue'
  | 'bfs-inspect-neighbor'
  | 'bfs-visit-neighbor'
  | 'bfs-complete'
  | 'dfs-visit'
  | 'dfs-inspect-neighbor'
  | 'dfs-traverse-edge'
  | 'dfs-backtrack'
  | 'dfs-complete';

export type ElementVisualState =
  | 'unsorted'
  | 'comparing'
  | 'swapping'
  | 'sorted'
  | 'splitting'
  | 'merging'
  | 'active-range'
  | 'selected'
  | 'base-case'
  | 'inactive'
  | 'eliminated'
  | 'mid'
  | 'target-found'
  // Graph node states
  | 'graph-unvisited'
  | 'graph-visited'
  | 'graph-current'
  | 'graph-in-queue'
  | 'graph-in-stack'
  | 'graph-call-stack'
  | 'graph-finished'
  | 'graph-neighbor'
  | 'graph-target'
  | 'graph-path';

export type MergeNodeStatus = 'inactive' | 'dividing' | 'active' | 'base-case' | 'merging' | 'merged';

export interface MergeTreeNode {
  id: string; // e.g. "0-7-L0"
  left: number;
  right: number;
  level: number;
  values: number[];
  status: MergeNodeStatus;
  parentId?: string;
}

export interface AlgorithmStep {
  id: number;
  stepIndex?: number;
  type: StepType;
  array: number[];
  elementIds: number[]; // Unique IDs for physical swap layout animation
  activeIndices: number[]; // Indices currently highlighted (e.g. [2, 3])
  sortedIndices: number[]; // Indices guaranteed sorted at this step
  comparingIndex?: number; // Index of the element being evaluated
  swappingIndex?: number; // Index of the element to be swapped
  visualStates?: Record<number, ElementVisualState>;
  activeRange?: [number, number];
  
  // Specific details for the Inspector panel
  action: string;
  indicesLabel: string;
  valuesLabel: string;
  decisionLabel: string;
  nextActionLabel: string;

  // Pass and progress information (Bubble sort)
  pass: number;
  totalPasses: number;
  comparisonInPass?: number;
  totalComparisonsInPass?: number;

  // Aggregate statistics at this point in time
  comparisonCount: number;
  swapCount: number;

  // Merge Sort specific execution state
  mergeRange?: [number, number];
  leftRange?: [number, number];
  rightRange?: [number, number];
  mid?: number;
  leftPointer?: number; // 0-based index in left subarray
  rightPointer?: number; // 0-based index in right subarray
  outputPointer?: number; // 0-based index in merged output buffer
  leftValue?: number;
  rightValue?: number;
  chosenValue?: number;
  chosenFrom?: 'left' | 'right';
  recursionLevel?: number;
  maxRecursionDepth?: number;
  mergeCount?: number;
  totalMerges?: number;
  arrayWrites?: number;
  leftSubarray?: number[];
  rightSubarray?: number[];
  mergedOutput?: (number | null)[];
  treeNodes?: MergeTreeNode[];
  phase?: 'divide' | 'recurse' | 'base-case' | 'merge' | 'complete';

  // Binary Search specific execution state
  searchTarget?: number;
  low?: number;
  high?: number;
  midValue?: number;
  comparisonResult?: 'equal' | 'less' | 'greater';
  decision?: string;
  eliminatedRange?: [number, number];
  eliminatedIndices?: number[];
  remainingCandidates?: number;
  foundIndex?: number;
  binarySearchPhase?: 'initialize' | 'calculate-mid' | 'compare' | 'decide' | 'eliminate' | 'update-range' | 'complete';
  previousLow?: number;
  previousHigh?: number;
  nextLow?: number;
  nextHigh?: number;

  // Graph Traversal (BFS & DFS) specific execution state
  currentNode?: number | null;
  currentNeighbor?: number | null;
  activeEdge?: [number, number] | null;
  traversedEdges?: [number, number][];
  treeEdges?: [number, number][];
  backEdges?: [number, number][];
  skippedEdges?: [number, number][];
  finishedNodes?: number[];
  visitedNodes?: number[];
  visitedBefore?: number[];
  visitedAfter?: number[];
  queueState?: number[];
  queueBefore?: number[];
  queueAfter?: number[];
  stackState?: number[];
  callStack?: number[];
  nextNeighbor?: number | null;
  traversalOrder?: number[];
  traversalOrderBefore?: number[];
  traversalOrderAfter?: number[];
  nodeLevels?: Record<number, number>;
  currentLevel?: number;
  parentMap?: Record<number, number>;
  shortestPath?: number[];
  isBacktracking?: boolean;
  backtrackFrom?: number;
  backtrackTo?: number;
  queueOp?: { type: 'enqueue' | 'dequeue' | 'none'; node?: number };
  stackOp?: { type: 'push' | 'pop' | 'none'; node?: number };
  dfsMode?: 'recursive' | 'iterative';
  recursionDepth?: number;
  nodesVisitedCount?: number;
  edgesTraversedCount?: number;
  edgesInspectedCount?: number;
  treeEdgesCount?: number;
  neighborChecksCount?: number;
  queueOpsCount?: number;
  backtracksCount?: number;
  graphPhase?:
    | 'initialize'
    | 'enqueue'
    | 'dequeue'
    | 'visit'
    | 'inspect-neighbor'
    | 'traverse-edge'
    | 'enqueue-neighbor'
    | 'skip-neighbor'
    | 'backtrack'
    | 'return'
    | 'target-found'
    | 'complete';
  keyConcept?: string;

  // Pseudocode sync
  pseudocodeLine: number; // 1-indexed

  // Educational explanation
  explanation: string;
}

export interface AlgorithmMetadata {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph';
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
}

export type SupportedLanguage = 'python' | 'javascript' | 'cpp' | 'java';

export interface PseudocodeDefinition {
  language: SupportedLanguage;
  displayName: string;
  lines: {
    lineNumber: number;
    code: string;
    indent: number;
  }[];
}
