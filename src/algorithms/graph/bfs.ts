import type {
  AlgorithmMetadata,
  AlgorithmStep,
  ElementVisualState,
  PseudocodeDefinition,
  SupportedLanguage,
} from '../types';
import type { GraphData, GraphNode } from './types';
import { buildAdjacencyList } from './types';

export const bfsMetadata: AlgorithmMetadata = {
  id: 'bfs',
  name: 'Breadth First Search (BFS)',
  category: 'graph',
  description: 'Explore a graph level by level, visiting all neighbors before moving to the next level.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
  stable: false,
  inPlace: false,
};

export const bfsPseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python',
    lines: [
      { lineNumber: 1, code: 'def bfs(graph, start):', indent: 0 },
      { lineNumber: 2, code: '    visited = set()', indent: 1 },
      { lineNumber: 3, code: '    queue = [start]', indent: 1 },
      { lineNumber: 4, code: '    visited.add(start)', indent: 1 },
      { lineNumber: 5, code: '    ', indent: 0 },
      { lineNumber: 6, code: '    while queue:', indent: 1 },
      { lineNumber: 7, code: '        node = queue.pop(0)', indent: 2 },
      { lineNumber: 8, code: '        for neighbor in graph[node]:', indent: 2 },
      { lineNumber: 9, code: '            if neighbor not in visited:', indent: 3 },
      { lineNumber: 10, code: '                visited.add(neighbor)', indent: 4 },
      { lineNumber: 11, code: '                queue.append(neighbor)', indent: 4 },
      { lineNumber: 12, code: '    return visited', indent: 1 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript',
    lines: [
      { lineNumber: 1, code: 'function bfs(graph, start) {', indent: 0 },
      { lineNumber: 2, code: '    const visited = new Set();', indent: 1 },
      { lineNumber: 3, code: '    const queue = [start];', indent: 1 },
      { lineNumber: 4, code: '    visited.add(start);', indent: 1 },
      { lineNumber: 5, code: '    ', indent: 0 },
      { lineNumber: 6, code: '    while (queue.length > 0) {', indent: 1 },
      { lineNumber: 7, code: '        const node = queue.shift();', indent: 2 },
      { lineNumber: 8, code: '        for (const neighbor of graph[node]) {', indent: 2 },
      { lineNumber: 9, code: '            if (!visited.has(neighbor)) {', indent: 3 },
      { lineNumber: 10, code: '                visited.add(neighbor);', indent: 4 },
      { lineNumber: 11, code: '                queue.push(neighbor);', indent: 4 },
      { lineNumber: 12, code: '    return visited;', indent: 1 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++',
    lines: [
      { lineNumber: 1, code: 'void bfs(const vector<vector<int>>& graph, int start) {', indent: 0 },
      { lineNumber: 2, code: '    vector<bool> visited(graph.size(), false);', indent: 1 },
      { lineNumber: 3, code: '    queue<int> q; q.push(start);', indent: 1 },
      { lineNumber: 4, code: '    visited[start] = true;', indent: 1 },
      { lineNumber: 5, code: '    ', indent: 0 },
      { lineNumber: 6, code: '    while (!q.empty()) {', indent: 1 },
      { lineNumber: 7, code: '        int node = q.front(); q.pop();', indent: 2 },
      { lineNumber: 8, code: '        for (int neighbor : graph[node]) {', indent: 2 },
      { lineNumber: 9, code: '            if (!visited[neighbor]) {', indent: 3 },
      { lineNumber: 10, code: '                visited[neighbor] = true;', indent: 4 },
      { lineNumber: 11, code: '                q.push(neighbor);', indent: 4 },
      { lineNumber: 12, code: '    }', indent: 1 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java',
    lines: [
      { lineNumber: 1, code: 'public static void bfs(List<List<Integer>> graph, int start) {', indent: 0 },
      { lineNumber: 2, code: '    Set<Integer> visited = new HashSet<>();', indent: 1 },
      { lineNumber: 3, code: '    Queue<Integer> queue = new LinkedList<>(); queue.add(start);', indent: 1 },
      { lineNumber: 4, code: '    visited.add(start);', indent: 1 },
      { lineNumber: 5, code: '    ', indent: 0 },
      { lineNumber: 6, code: '    while (!queue.isEmpty()) {', indent: 1 },
      { lineNumber: 7, code: '        int node = queue.poll();', indent: 2 },
      { lineNumber: 8, code: '        for (int neighbor : graph.get(node)) {', indent: 2 },
      { lineNumber: 9, code: '            if (!visited.contains(neighbor)) {', indent: 3 },
      { lineNumber: 10, code: '                visited.add(neighbor);', indent: 4 },
      { lineNumber: 11, code: '                queue.add(neighbor);', indent: 4 },
      { lineNumber: 12, code: '    }', indent: 1 },
    ],
  },
};

/**
 * Builds visual states mapping for all nodes in the graph
 */
function buildNodeVisualStates(
  nodeIds: number[],
  currentNode: number | null,
  visited: Set<number>,
  queue: number[],
  currentNeighbor: number | null,
  shortestPath?: number[]
): Record<number, ElementVisualState> {
  const states: Record<number, ElementVisualState> = {};
  const queueSet = new Set(queue);
  const pathSet = new Set(shortestPath || []);

  for (const id of nodeIds) {
    if (pathSet.has(id)) {
      states[id] = 'graph-path';
    } else if (currentNode === id) {
      states[id] = 'graph-current';
    } else if (currentNeighbor === id) {
      states[id] = 'graph-neighbor';
    } else if (queueSet.has(id)) {
      states[id] = 'graph-in-queue';
    } else if (visited.has(id)) {
      states[id] = 'graph-visited';
    } else {
      states[id] = 'graph-unvisited';
    }
  }

  return states;
}

/**
 * Reconstructs shortest path from startNode to targetNode using parentMap
 */
function reconstructPath(parentMap: Record<number, number>, startNode: number, targetNode: number): number[] {
  const path: number[] = [];
  let curr: number | undefined = targetNode;
  while (curr !== undefined) {
    path.unshift(curr);
    if (curr === startNode) break;
    curr = parentMap[curr];
  }
  return path[0] === startNode ? path : [];
}

/**
 * Deterministic step generation for Breadth First Search (BFS)
 */
export function generateBFSSteps(
  graph: GraphData,
  startNode: number = 0,
  targetNode?: number | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodeIds = graph.nodes.map((n: GraphNode) => n.id);
  const dummyArray = nodeIds; // For backwards-compatible store typing

  if (nodeIds.length === 0) {
    return steps;
  }

  const effectiveStart = nodeIds.includes(startNode) ? startNode : nodeIds[0];
  const adj = buildAdjacencyList(graph);

  const queue: number[] = [effectiveStart];
  const visited = new Set<number>([effectiveStart]);
  const traversalOrder: number[] = [];
  const parentMap: Record<number, number> = {};
  const nodeLevels: Record<number, number> = { [effectiveStart]: 0 };
  const traversedEdges: [number, number][] = [];

  let edgesTraversedCount = 0; // Successful BFS tree discovery edges
  let edgesInspectedCount = 0; // Total adjacency checks evaluated
  let queueOpsCount = 1;       // Start node enqueue

  const isShortestPathMode = targetNode !== null && targetNode !== undefined;
  const keyConceptText = isShortestPathMode
    ? `BFS guarantees the shortest path (minimum edge count) in unweighted graphs. Tracking parent pointers to target ${targetNode} enables backward path reconstruction.`
    : 'BFS explores the graph level by level using a FIFO queue. Newly discovered nodes are marked visited and enqueued so each node is processed in breadth-first order.';

  // STEP 0: READY / INITIAL STATE
  steps.push({
    id: 0,
    stepIndex: 0,
    type: 'initial',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: [],
    sortedIndices: [],
    visualStates: buildNodeVisualStates(nodeIds, null, new Set(), [], null),
    action: 'Ready',
    indicesLabel: `Start Node: ${effectiveStart}`,
    valuesLabel: 'Queue: [ ]',
    decisionLabel: 'Pending start',
    nextActionLabel: 'Press PLAY or NEXT to begin',
    pass: 0,
    totalPasses: 1,
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 0,
    explanation: 'Ready. Press PLAY or NEXT to begin.',
    currentNode: null,
    currentNeighbor: null,
    activeEdge: null,
    traversedEdges: [],
    visitedNodes: [],
    visitedBefore: [],
    visitedAfter: [],
    queueState: [],
    queueBefore: [],
    queueAfter: [],
    traversalOrder: [],
    traversalOrderBefore: [],
    traversalOrderAfter: [],
    nodeLevels: {},
    currentLevel: 0,
    parentMap: {},
    nodesVisitedCount: 0,
    edgesTraversedCount: 0,
    edgesInspectedCount: 0,
    queueOpsCount: 0,
    queueOp: { type: 'none' },
    graphPhase: 'initialize',
    keyConcept: keyConceptText,
  });

  // STEP 1: ENQUEUE START NODE
  steps.push({
    id: steps.length,
    stepIndex: steps.length,
    type: 'bfs-enqueue',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: [effectiveStart],
    sortedIndices: [],
    visualStates: buildNodeVisualStates(nodeIds, effectiveStart, visited, queue, null),
    action: `Start at Node ${effectiveStart}`,
    indicesLabel: `Start Node: ${effectiveStart}`,
    valuesLabel: `Queue: [${queue.join(', ')}]`,
    decisionLabel: `Enqueue start node ${effectiveStart} into BFS queue`,
    nextActionLabel: `Dequeue node ${effectiveStart} to begin level-0 exploration`,
    pass: 1,
    totalPasses: 1,
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 4,
    explanation: `BFS initialized at start node ${effectiveStart}. Node marked visited and added to the queue at Level 0.`,
    currentNode: effectiveStart,
    currentNeighbor: null,
    activeEdge: null,
    traversedEdges: [],
    visitedNodes: Array.from(visited),
    visitedBefore: [],
    visitedAfter: Array.from(visited),
    queueState: [...queue],
    queueBefore: [],
    queueAfter: [...queue],
    traversalOrder: [],
    traversalOrderBefore: [],
    traversalOrderAfter: [],
    nodeLevels: { ...nodeLevels },
    currentLevel: 0,
    parentMap: { ...parentMap },
    nodesVisitedCount: visited.size,
    edgesTraversedCount: 0,
    edgesInspectedCount: 0,
    queueOpsCount,
    queueOp: { type: 'enqueue', node: effectiveStart },
    graphPhase: 'initialize',
    keyConcept: keyConceptText,
  });

  let targetFound = effectiveStart === targetNode;

  // BFS Loop
  while (queue.length > 0 && !targetFound) {
    // DEQUEUE STEP: Pop front of queue and process current node
    const queueBeforeDequeue = [...queue];
    const currentNode = queue.shift()!;
    queueOpsCount++;
    const traversalOrderBefore = [...traversalOrder];
    traversalOrder.push(currentNode);
    const currentLvl = nodeLevels[currentNode] ?? 0;
    const neighbors = adj[currentNode] || [];

    steps.push({
      id: steps.length,
      stepIndex: steps.length,
      type: 'bfs-dequeue',
      array: dummyArray,
      elementIds: dummyArray,
      activeIndices: [currentNode],
      sortedIndices: Array.from(visited),
      visualStates: buildNodeVisualStates(nodeIds, currentNode, visited, queue, null),
      action: `Process Node ${currentNode}`,
      indicesLabel: `Current Node: ${currentNode}`,
      valuesLabel: `Queue: [${queue.join(', ')}]`,
      decisionLabel: `Dequeued node ${currentNode} (Level ${currentLvl})`,
      nextActionLabel:
        neighbors.length > 0
          ? `Inspect ${neighbors.length} connected neighbor(s)`
          : 'No neighbors connected to this node',
      pass: currentLvl + 1,
      totalPasses: 1,
      comparisonCount: edgesTraversedCount,
      swapCount: 0,
      searchTarget: targetNode ?? undefined,
      pseudocodeLine: 7,
      explanation: `Dequeued node ${currentNode} from the front of the queue. Node ${currentNode} is now processed (Level ${currentLvl}). ${
        neighbors.length > 0
          ? `Now evaluating connected neighbors [${neighbors.join(', ')}].`
          : 'It has no outgoing neighbors to explore.'
      }`,
      currentNode,
      currentNeighbor: null,
      activeEdge: null,
      traversedEdges: [...traversedEdges],
      visitedNodes: Array.from(visited),
      visitedBefore: Array.from(visited),
      visitedAfter: Array.from(visited),
      queueState: [...queue],
      queueBefore: queueBeforeDequeue,
      queueAfter: [...queue],
      traversalOrder: [...traversalOrder],
      traversalOrderBefore,
      traversalOrderAfter: [...traversalOrder],
      nodeLevels: { ...nodeLevels },
      currentLevel: currentLvl,
      parentMap: { ...parentMap },
      nodesVisitedCount: visited.size,
      edgesTraversedCount,
      edgesInspectedCount,
      queueOpsCount,
      queueOp: { type: 'dequeue', node: currentNode },
      graphPhase: 'dequeue',
      keyConcept: keyConceptText,
    });

    // Inspect each neighbor in deterministic ascending order
    for (const neighbor of neighbors) {
      edgesInspectedCount++;
      const isUnvisited = !visited.has(neighbor);

      // STEP: INSPECT NEIGHBOR (Evaluates whether to enqueue or skip)
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'bfs-inspect-neighbor',
        array: dummyArray,
        elementIds: dummyArray,
        activeIndices: [currentNode, neighbor],
        sortedIndices: Array.from(visited),
        visualStates: buildNodeVisualStates(nodeIds, currentNode, visited, queue, neighbor),
        action: `Inspect Neighbor ${neighbor}`,
        indicesLabel: `Edge: ${currentNode} → ${neighbor}`,
        valuesLabel: `Status: ${isUnvisited ? 'Unvisited' : 'Already Visited'}`,
        decisionLabel: isUnvisited
          ? `Neighbor ${neighbor} is unvisited → Enqueue`
          : `Neighbor ${neighbor} already visited → Skip`,
        nextActionLabel: isUnvisited ? `Enqueue node ${neighbor}` : 'Continue to next neighbor',
        pass: currentLvl + 1,
        totalPasses: 1,
        comparisonCount: edgesTraversedCount,
        swapCount: 0,
        searchTarget: targetNode ?? undefined,
        pseudocodeLine: 9,
        explanation: isUnvisited
          ? `Evaluating neighbor ${neighbor} of node ${currentNode}. Node ${neighbor} is unvisited; it will be marked visited and enqueued at Level ${currentLvl + 1}.`
          : `Evaluating neighbor ${neighbor} of node ${currentNode}. Node ${neighbor} has already been visited; skipping edge to prevent cycles.`,
        currentNode,
        currentNeighbor: neighbor,
        activeEdge: [currentNode, neighbor],
        traversedEdges: [...traversedEdges],
        visitedNodes: Array.from(visited),
        visitedBefore: Array.from(visited),
        visitedAfter: Array.from(visited),
        queueState: [...queue],
        queueBefore: [...queue],
        queueAfter: [...queue],
        traversalOrder: [...traversalOrder],
        traversalOrderBefore: [...traversalOrder],
        traversalOrderAfter: [...traversalOrder],
        nodeLevels: { ...nodeLevels },
        currentLevel: currentLvl,
        parentMap: { ...parentMap },
        nodesVisitedCount: visited.size,
        edgesTraversedCount,
        edgesInspectedCount,
        queueOpsCount,
        queueOp: { type: 'none' }, // Strictly NO queue mutation during inspect step
        graphPhase: isUnvisited ? 'inspect-neighbor' : 'skip-neighbor',
        keyConcept: keyConceptText,
      });

      if (isUnvisited) {
        // Mark discovered/visited immediately upon enqueuing
        const queueBeforeEnqueue = [...queue];
        const visitedBeforeEnqueue = Array.from(visited);

        visited.add(neighbor);
        queue.push(neighbor);
        queueOpsCount++;
        edgesTraversedCount++;
        parentMap[neighbor] = currentNode;
        nodeLevels[neighbor] = currentLvl + 1;
        traversedEdges.push([currentNode, neighbor]);

        // STEP: ENQUEUE NEIGHBOR
        steps.push({
          id: steps.length,
          stepIndex: steps.length,
          type: 'bfs-visit-neighbor',
          array: dummyArray,
          elementIds: dummyArray,
          activeIndices: [neighbor],
          sortedIndices: Array.from(visited),
          visualStates: buildNodeVisualStates(nodeIds, currentNode, visited, queue, neighbor),
          action: `Enqueue Node ${neighbor}`,
          indicesLabel: `Node ${neighbor} (Level ${currentLvl + 1})`,
          valuesLabel: `Queue: [${queue.join(', ')}]`,
          decisionLabel: `Parent[${neighbor}] = ${currentNode}, Level = ${currentLvl + 1}`,
          nextActionLabel: queue.length > 0 ? `Next in queue: Node ${queue[0]}` : 'Evaluate queue',
          pass: currentLvl + 1,
          totalPasses: 1,
          comparisonCount: edgesTraversedCount,
          swapCount: 0,
          searchTarget: targetNode ?? undefined,
          pseudocodeLine: 11,
          explanation: `Marked neighbor ${neighbor} as visited and enqueued it at Level ${currentLvl + 1}. Set parent[${neighbor}] = ${currentNode}.`,
          currentNode,
          currentNeighbor: neighbor,
          activeEdge: [currentNode, neighbor],
          traversedEdges: [...traversedEdges],
          visitedNodes: Array.from(visited),
          visitedBefore: visitedBeforeEnqueue,
          visitedAfter: Array.from(visited),
          queueState: [...queue],
          queueBefore: queueBeforeEnqueue,
          queueAfter: [...queue],
          traversalOrder: [...traversalOrder],
          traversalOrderBefore: [...traversalOrder],
          traversalOrderAfter: [...traversalOrder],
          nodeLevels: { ...nodeLevels },
          currentLevel: currentLvl + 1,
          parentMap: { ...parentMap },
          nodesVisitedCount: visited.size,
          edgesTraversedCount,
          edgesInspectedCount,
          queueOpsCount,
          queueOp: { type: 'enqueue', node: neighbor },
          graphPhase: 'enqueue-neighbor',
          keyConcept: keyConceptText,
        });

        if (targetNode !== null && targetNode !== undefined && neighbor === targetNode) {
          targetFound = true;
          break;
        }
      }
    }
  }

  // Reconstruct shortest path if target specified and reached
  const shortestPath =
    targetNode !== null && targetNode !== undefined && visited.has(targetNode)
      ? reconstructPath(parentMap, effectiveStart, targetNode)
      : undefined;

  // FINAL COMPLETE STEP
  steps.push({
    id: steps.length,
    stepIndex: steps.length,
    type: 'bfs-complete',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: shortestPath || Array.from(visited),
    sortedIndices: Array.from(visited),
    visualStates: buildNodeVisualStates(nodeIds, null, visited, [], null, shortestPath),
    action: targetFound ? `Target ${targetNode} Reached!` : 'Traversal Complete',
    indicesLabel: `${visited.size} / ${nodeIds.length} Nodes Visited`,
    valuesLabel: shortestPath ? `Shortest Path: [${shortestPath.join(' → ')}]` : 'Queue Empty',
    decisionLabel: shortestPath
      ? `Shortest path: ${shortestPath.length - 1} edge(s)`
      : 'All reachable nodes from start have been processed.',
    nextActionLabel: 'Execution Finished',
    pass: 1,
    totalPasses: 1,
    comparisonCount: edgesTraversedCount,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 12,
    explanation: shortestPath
      ? `BFS found shortest path to target ${targetNode}: [${shortestPath.join(' → ')}] (${shortestPath.length - 1} edge(s)).`
      : `BFS completed! Visited all ${visited.size} reachable node(s) level by level with zero remaining elements in the queue.`,
    currentNode: null,
    currentNeighbor: null,
    activeEdge: null,
    traversedEdges: [...traversedEdges],
    visitedNodes: Array.from(visited),
    visitedBefore: Array.from(visited),
    visitedAfter: Array.from(visited),
    queueState: [],
    queueBefore: [],
    queueAfter: [],
    traversalOrder: [...traversalOrder],
    traversalOrderBefore: [...traversalOrder],
    traversalOrderAfter: [...traversalOrder],
    nodeLevels: { ...nodeLevels },
    currentLevel: 0,
    parentMap: { ...parentMap },
    shortestPath,
    nodesVisitedCount: visited.size,
    edgesTraversedCount,
    edgesInspectedCount,
    queueOpsCount,
    queueOp: { type: 'none' },
    graphPhase: 'complete',
    keyConcept: keyConceptText,
  });

  return steps;
}
