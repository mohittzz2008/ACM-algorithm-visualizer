import type {
  AlgorithmMetadata,
  AlgorithmStep,
  ElementVisualState,
  PseudocodeDefinition,
  SupportedLanguage,
} from '../types';
import type { GraphData } from './types';
import { buildAdjacencyList } from './types';

export const dfsMetadata: AlgorithmMetadata = {
  id: 'dfs',
  name: 'Depth First Search (DFS)',
  category: 'graph',
  description: 'Explore one branch as deeply as possible before backtracking.',
  timeComplexity: {
    best: 'O(V + E)',
    average: 'O(V + E)',
    worst: 'O(V + E)',
  },
  spaceComplexity: 'O(V)',
  stable: false,
  inPlace: false,
};

export const dfsRecursivePseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python',
    lines: [
      { lineNumber: 1, code: 'def dfs(graph, start, visited=None):', indent: 0 },
      { lineNumber: 2, code: '    if visited is None:', indent: 1 },
      { lineNumber: 3, code: '        visited = set()', indent: 2 },
      { lineNumber: 4, code: '    ', indent: 0 },
      { lineNumber: 5, code: '    visited.add(start)', indent: 1 },
      { lineNumber: 6, code: '    for neighbor in graph[start]:', indent: 1 },
      { lineNumber: 7, code: '        if neighbor not in visited:', indent: 2 },
      { lineNumber: 8, code: '            dfs(graph, neighbor, visited)', indent: 3 },
      { lineNumber: 9, code: '    return visited', indent: 1 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript',
    lines: [
      { lineNumber: 1, code: 'function dfs(graph, start, visited = new Set()) {', indent: 0 },
      { lineNumber: 2, code: '    visited.add(start);', indent: 1 },
      { lineNumber: 3, code: '    for (const neighbor of graph[start]) {', indent: 1 },
      { lineNumber: 4, code: '        if (!visited.has(neighbor)) {', indent: 2 },
      { lineNumber: 5, code: '            dfs(graph, neighbor, visited);', indent: 3 },
      { lineNumber: 6, code: '        }', indent: 2 },
      { lineNumber: 7, code: '    }', indent: 1 },
      { lineNumber: 8, code: '    return visited;', indent: 1 },
      { lineNumber: 9, code: '}', indent: 0 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++',
    lines: [
      { lineNumber: 1, code: 'void dfs(const vector<vector<int>>& graph, int start, vector<bool>& visited) {', indent: 0 },
      { lineNumber: 2, code: '    visited[start] = true;', indent: 1 },
      { lineNumber: 3, code: '    for (int neighbor : graph[start]) {', indent: 1 },
      { lineNumber: 4, code: '        if (!visited[neighbor]) {', indent: 2 },
      { lineNumber: 5, code: '            dfs(graph, neighbor, visited);', indent: 3 },
      { lineNumber: 6, code: '        }', indent: 2 },
      { lineNumber: 7, code: '    }', indent: 1 },
      { lineNumber: 8, code: '    return;', indent: 1 },
      { lineNumber: 9, code: '}', indent: 0 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java',
    lines: [
      { lineNumber: 1, code: 'public static void dfs(List<List<Integer>> graph, int start, Set<Integer> visited) {', indent: 0 },
      { lineNumber: 2, code: '    visited.add(start);', indent: 1 },
      { lineNumber: 3, code: '    for (int neighbor : graph.get(start)) {', indent: 1 },
      { lineNumber: 4, code: '        if (!visited.contains(neighbor)) {', indent: 2 },
      { lineNumber: 5, code: '            dfs(graph, neighbor, visited);', indent: 3 },
      { lineNumber: 6, code: '        }', indent: 2 },
      { lineNumber: 7, code: '    }', indent: 1 },
      { lineNumber: 8, code: '    return;', indent: 1 },
      { lineNumber: 9, code: '}', indent: 0 },
    ],
  },
};

export const dfsIterativePseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python (Iterative)',
    lines: [
      { lineNumber: 1, code: 'def dfs_iterative(graph, start):', indent: 0 },
      { lineNumber: 2, code: '    visited = set()', indent: 1 },
      { lineNumber: 3, code: '    stack = [start]', indent: 1 },
      { lineNumber: 4, code: '    while stack:', indent: 1 },
      { lineNumber: 5, code: '        node = stack.pop()', indent: 2 },
      { lineNumber: 6, code: '        if node not in visited:', indent: 2 },
      { lineNumber: 7, code: '            visited.add(node)', indent: 3 },
      { lineNumber: 8, code: '            for neighbor in reversed(graph[node]):', indent: 3 },
      { lineNumber: 9, code: '                if neighbor not in visited:', indent: 4 },
      { lineNumber: 10, code: '                    stack.append(neighbor)', indent: 5 },
      { lineNumber: 11, code: '    return visited', indent: 1 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript (Iterative)',
    lines: [
      { lineNumber: 1, code: 'function dfsIterative(graph, start) {', indent: 0 },
      { lineNumber: 2, code: '    const visited = new Set();', indent: 1 },
      { lineNumber: 3, code: '    const stack = [start];', indent: 1 },
      { lineNumber: 4, code: '    while (stack.length > 0) {', indent: 1 },
      { lineNumber: 5, code: '        const node = stack.pop();', indent: 2 },
      { lineNumber: 6, code: '        if (!visited.has(node)) {', indent: 2 },
      { lineNumber: 7, code: '            visited.add(node);', indent: 3 },
      { lineNumber: 8, code: '            for (const neighbor of [...graph[node]].reverse()) {', indent: 3 },
      { lineNumber: 9, code: '                if (!visited.has(neighbor)) stack.push(neighbor);', indent: 4 },
      { lineNumber: 10, code: '            }', indent: 3 },
      { lineNumber: 11, code: '        }', indent: 2 },
      { lineNumber: 12, code: '    }', indent: 1 },
      { lineNumber: 13, code: '    return visited;', indent: 1 },
      { lineNumber: 14, code: '}', indent: 0 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++ (Iterative)',
    lines: [
      { lineNumber: 1, code: 'void dfsIterative(const vector<vector<int>>& graph, int start) {', indent: 0 },
      { lineNumber: 2, code: '    vector<bool> visited(graph.size(), false);', indent: 1 },
      { lineNumber: 3, code: '    stack<int> s; s.push(start);', indent: 1 },
      { lineNumber: 4, code: '    while (!s.empty()) {', indent: 1 },
      { lineNumber: 5, code: '        int node = s.top(); s.pop();', indent: 2 },
      { lineNumber: 6, code: '        if (!visited[node]) {', indent: 2 },
      { lineNumber: 7, code: '            visited[node] = true;', indent: 3 },
      { lineNumber: 8, code: '            for (auto it = graph[node].rbegin(); it != graph[node].rend(); ++it) {', indent: 3 },
      { lineNumber: 9, code: '                if (!visited[*it]) s.push(*it);', indent: 4 },
      { lineNumber: 10, code: '            }', indent: 3 },
      { lineNumber: 11, code: '        }', indent: 2 },
      { lineNumber: 12, code: '    }', indent: 1 },
      { lineNumber: 13, code: '}', indent: 0 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java (Iterative)',
    lines: [
      { lineNumber: 1, code: 'public static void dfsIterative(List<List<Integer>> graph, int start) {', indent: 0 },
      { lineNumber: 2, code: '    Set<Integer> visited = new HashSet<>();', indent: 1 },
      { lineNumber: 3, code: '    Deque<Integer> stack = new ArrayDeque<>(); stack.push(start);', indent: 1 },
      { lineNumber: 4, code: '    while (!stack.isEmpty()) {', indent: 1 },
      { lineNumber: 5, code: '        int node = stack.pop();', indent: 2 },
      { lineNumber: 6, code: '        if (!visited.contains(node)) {', indent: 2 },
      { lineNumber: 7, code: '            visited.add(node);', indent: 3 },
      { lineNumber: 8, code: '            List<Integer> neighbors = graph.get(node);', indent: 3 },
      { lineNumber: 9, code: '            for (int i = neighbors.size() - 1; i >= 0; i--) {', indent: 3 },
      { lineNumber: 10, code: '                if (!visited.contains(neighbors.get(i))) stack.push(neighbors.get(i));', indent: 4 },
      { lineNumber: 11, code: '            }', indent: 3 },
      { lineNumber: 12, code: '        }', indent: 2 },
      { lineNumber: 13, code: '    }', indent: 1 },
      { lineNumber: 14, code: '}', indent: 0 },
    ],
  },
};

// Default export for backward compatibility with PseudocodePanel
export const dfsPseudocode = dfsRecursivePseudocode;

/**
 * Builds explicit semantic node visual states for DFS:
 * - CURRENT: currently active node (amber)
 * - NEIGHBOR: currently inspected neighbor (indigo)
 * - ON CALL STACK: ancestor in recursion (purple)
 * - FINISHED: fully explored, backtracked from (teal/green)
 * - UNVISITED: neutral
 */
function buildDFSNodeVisualStates(
  nodeIds: number[],
  currentNode: number | null,
  currentNeighbor: number | null,
  callStack: number[],
  finishedNodes: Set<number>,
  visitedNodes: Set<number>
): Record<number, ElementVisualState> {
  const states: Record<number, ElementVisualState> = {};
  const stackSet = new Set(callStack);

  for (const id of nodeIds) {
    if (currentNode === id) {
      states[id] = 'graph-current';
    } else if (currentNeighbor === id) {
      states[id] = 'graph-neighbor';
    } else if (stackSet.has(id)) {
      states[id] = 'graph-call-stack';
    } else if (finishedNodes.has(id)) {
      states[id] = 'graph-finished';
    } else if (visitedNodes.has(id)) {
      states[id] = 'graph-visited';
    } else {
      states[id] = 'graph-unvisited';
    }
  }

  return states;
}

/**
 * Generates deterministic execution steps for Recursive DFS
 */
export function generateRecursiveDFSSteps(
  graph: GraphData,
  startNode: number = 0,
  targetNode?: number | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodeIds = graph.nodes.map((n) => n.id);
  const dummyArray = nodeIds;

  if (nodeIds.length === 0) {
    return steps;
  }

  const effectiveStart = nodeIds.includes(startNode) ? startNode : nodeIds[0];
  const adj = buildAdjacencyList(graph);

  const callStack: number[] = [];
  const visited = new Set<number>();
  const finished = new Set<number>();
  const traversalOrder: number[] = [];
  const treeEdges: [number, number][] = [];
  const backEdges: [number, number][] = [];
  const skippedEdges: [number, number][] = [];

  let neighborChecksCount = 0;
  let backtracksCount = 0;
  let maxRecursionDepth = 0;
  let targetFound = false;

  const keyConceptText =
    'DFS explores one branch as deeply as possible before backtracking. It does NOT guarantee the shortest path in an unweighted graph.';

  // STEP 0: READY / INITIAL STATE
  steps.push({
    id: 0,
    stepIndex: 0,
    type: 'initial',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: [],
    sortedIndices: [],
    visualStates: buildDFSNodeVisualStates(nodeIds, null, null, callStack, finished, visited),
    action: 'Ready',
    indicesLabel: `Start Node: ${effectiveStart}`,
    valuesLabel: 'Call Stack: [ ]',
    decisionLabel: 'Pending start',
    nextActionLabel: 'Press PLAY or NEXT to begin',
    pass: 0,
    totalPasses: 1,
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 0,
    explanation: `Ready to start Depth First Search from node ${effectiveStart}. Exploration will proceed deeply along each branch in adjacency order.`,
    currentNode: null,
    currentNeighbor: null,
    nextNeighbor: null,
    activeEdge: null,
    traversedEdges: [],
    treeEdges: [],
    backEdges: [],
    skippedEdges: [],
    visitedNodes: [],
    finishedNodes: [],
    stackState: [],
    callStack: [],
    traversalOrder: [],
    recursionDepth: 0,
    maxRecursionDepth: 0,
    nodesVisitedCount: 0,
    edgesTraversedCount: 0,
    treeEdgesCount: 0,
    neighborChecksCount: 0,
    backtracksCount: 0,
    graphPhase: 'initialize',
    keyConcept: keyConceptText,
    dfsMode: 'recursive',
  });

  // STEP 1: INITIALIZE AT START NODE
  steps.push({
    id: 1,
    stepIndex: 1,
    type: 'graph-init',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: [effectiveStart],
    sortedIndices: [],
    visualStates: buildDFSNodeVisualStates(nodeIds, effectiveStart, null, callStack, finished, visited),
    action: `Initialize at Node ${effectiveStart}`,
    indicesLabel: `Start Node: ${effectiveStart}`,
    valuesLabel: 'Call Stack: [ ]',
    decisionLabel: `Ready to invoke dfs(${effectiveStart})`,
    nextActionLabel: `Invoke dfs(${effectiveStart})`,
    pass: 1,
    totalPasses: 1,
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 1,
    explanation: `DFS initialized at start node ${effectiveStart}. The selected start node explores its reachable component.`,
    currentNode: effectiveStart,
    currentNeighbor: null,
    nextNeighbor: null,
    activeEdge: null,
    traversedEdges: [],
    treeEdges: [],
    backEdges: [],
    skippedEdges: [],
    visitedNodes: [],
    finishedNodes: [],
    stackState: [],
    callStack: [],
    traversalOrder: [],
    recursionDepth: 0,
    maxRecursionDepth: 0,
    nodesVisitedCount: 0,
    edgesTraversedCount: 0,
    treeEdgesCount: 0,
    neighborChecksCount: 0,
    backtracksCount: 0,
    graphPhase: 'initialize',
    keyConcept: keyConceptText,
    dfsMode: 'recursive',
  });

  // Recursive DFS helper
  function dfs(curr: number, parent: number | null) {
    if (targetFound) return;

    visited.add(curr);
    callStack.push(curr);
    traversalOrder.push(curr);
    maxRecursionDepth = Math.max(maxRecursionDepth, callStack.length);

    const neighbors = adj[curr] || [];
    const firstNeighbor = neighbors.length > 0 ? neighbors[0] : null;

    // STEP: VISIT NODE / PUSH CALL STACK FRAME
    steps.push({
      id: steps.length,
      stepIndex: steps.length,
      type: 'dfs-visit',
      array: dummyArray,
      elementIds: dummyArray,
      activeIndices: [curr],
      sortedIndices: Array.from(visited),
      visualStates: buildDFSNodeVisualStates(nodeIds, curr, null, callStack, finished, visited),
      action: parent !== null ? `Traverse to Node ${curr}` : `Visit Start Node ${curr}`,
      indicesLabel: `dfs(${curr})`,
      valuesLabel: `Call Stack: [${callStack.join(', ')}]`,
      decisionLabel: `Mark node ${curr} visited and push frame to Call Stack (Depth ${callStack.length})`,
      nextActionLabel: neighbors.length > 0 ? `Inspect neighbor ${firstNeighbor}` : 'No neighbors to explore',
      pass: callStack.length,
      totalPasses: 1,
      comparisonCount: treeEdges.length,
      swapCount: 0,
      searchTarget: targetNode ?? undefined,
      pseudocodeLine: 5,
      explanation: `Visit node ${curr}. Node ${curr} is marked visited and pushed to the Call Stack (recursion depth ${callStack.length}). Traversal order: [${traversalOrder.join(' → ')}].`,
      currentNode: curr,
      currentNeighbor: null,
      nextNeighbor: firstNeighbor,
      activeEdge: parent !== null ? [parent, curr] : null,
      traversedEdges: [...treeEdges],
      treeEdges: [...treeEdges],
      backEdges: [...backEdges],
      skippedEdges: [...skippedEdges],
      visitedNodes: Array.from(visited),
      finishedNodes: Array.from(finished),
      stackState: [...callStack],
      callStack: [...callStack],
      traversalOrder: [...traversalOrder],
      recursionDepth: callStack.length,
      maxRecursionDepth,
      nodesVisitedCount: visited.size,
      edgesTraversedCount: treeEdges.length,
      treeEdgesCount: treeEdges.length,
      neighborChecksCount,
      backtracksCount,
      graphPhase: 'visit',
      keyConcept: keyConceptText,
      dfsMode: 'recursive',
      stackOp: { type: 'push', node: curr },
    });

    if (targetNode !== null && targetNode !== undefined && curr === targetNode) {
      targetFound = true;
      return;
    }

    // Inspect each neighbor in deterministic adjacency-list order
    for (let i = 0; i < neighbors.length; i++) {
      if (targetFound) return;
      const neighbor = neighbors[i];
      neighborChecksCount++;
      const isUnvisited = !visited.has(neighbor);

      // Edge classification
      const isDirected = graph.isDirected;
      const isCallStackAncestor = callStack.slice(0, -1).includes(neighbor);
      const isParent = !isDirected && parent === neighbor;
      const isBackEdge = isCallStackAncestor && !isParent;

      // STEP: INSPECT NEIGHBOR
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'dfs-inspect-neighbor',
        array: dummyArray,
        elementIds: dummyArray,
        activeIndices: [curr, neighbor],
        sortedIndices: Array.from(visited),
        visualStates: buildDFSNodeVisualStates(nodeIds, curr, neighbor, callStack, finished, visited),
        action: `Inspect Neighbor ${neighbor}`,
        indicesLabel: `Edge: ${curr} → ${neighbor}`,
        valuesLabel: `Status: ${isUnvisited ? 'Unvisited' : 'Already Visited'}`,
        decisionLabel: isUnvisited
          ? `Neighbor ${neighbor} unvisited → Recurse deeper`
          : isBackEdge
          ? `Neighbor ${neighbor} is on Call Stack → Back edge / cycle`
          : `Neighbor ${neighbor} already explored → Skip edge`,
        nextActionLabel: isUnvisited
          ? `Invoke dfs(${neighbor})`
          : i < neighbors.length - 1
          ? `Inspect next neighbor ${neighbors[i + 1]}`
          : `All neighbors inspected, prepare to backtrack`,
        pass: callStack.length,
        totalPasses: 1,
        comparisonCount: treeEdges.length,
        swapCount: 0,
        searchTarget: targetNode ?? undefined,
        pseudocodeLine: 7,
        explanation: isUnvisited
          ? `Node ${curr} inspecting neighbor ${neighbor} in adjacency order. Since node ${neighbor} is unvisited, DFS explores deeper along this branch.`
          : isBackEdge
          ? `Node ${curr} inspecting neighbor ${neighbor}. Node ${neighbor} is currently on the active Call Stack! This edge (${curr} → ${neighbor}) is a BACK EDGE, indicating a cycle.`
          : `Node ${curr} inspecting neighbor ${neighbor}. Node ${neighbor} is already visited. DFS skips edge (${curr} → ${neighbor}) to avoid redundant cycles.`,
        currentNode: curr,
        currentNeighbor: neighbor,
        nextNeighbor: neighbor,
        activeEdge: [curr, neighbor],
        traversedEdges: [...treeEdges],
        treeEdges: [...treeEdges],
        backEdges: [...backEdges],
        skippedEdges: [...skippedEdges],
        visitedNodes: Array.from(visited),
        finishedNodes: Array.from(finished),
        stackState: [...callStack],
        callStack: [...callStack],
        traversalOrder: [...traversalOrder],
        recursionDepth: callStack.length,
        maxRecursionDepth,
        nodesVisitedCount: visited.size,
        edgesTraversedCount: treeEdges.length,
        treeEdgesCount: treeEdges.length,
        neighborChecksCount,
        backtracksCount,
        graphPhase: 'inspect-neighbor',
        keyConcept: keyConceptText,
        dfsMode: 'recursive',
      });

      if (isUnvisited) {
        // Record tree edge
        treeEdges.push([curr, neighbor]);

        // STEP: TRAVERSE TREE EDGE
        steps.push({
          id: steps.length,
          stepIndex: steps.length,
          type: 'dfs-traverse-edge',
          array: dummyArray,
          elementIds: dummyArray,
          activeIndices: [curr, neighbor],
          sortedIndices: Array.from(visited),
          visualStates: buildDFSNodeVisualStates(nodeIds, curr, neighbor, callStack, finished, visited),
          action: `Traverse Tree Edge ${curr} → ${neighbor}`,
          indicesLabel: `Tree Edge: ${curr} → ${neighbor}`,
          valuesLabel: `dfs(${neighbor})`,
          decisionLabel: `Discovery edge discovered new unvisited node ${neighbor}`,
          nextActionLabel: `Enter dfs(${neighbor})`,
          pass: callStack.length,
          totalPasses: 1,
          comparisonCount: treeEdges.length,
          swapCount: 0,
          searchTarget: targetNode ?? undefined,
          pseudocodeLine: 8,
          explanation: `Tree edge ${curr} → ${neighbor} traversed. Traversal enters recursive call dfs(${neighbor}).`,
          currentNode: curr,
          currentNeighbor: neighbor,
          nextNeighbor: neighbor,
          activeEdge: [curr, neighbor],
          traversedEdges: [...treeEdges],
          treeEdges: [...treeEdges],
          backEdges: [...backEdges],
          skippedEdges: [...skippedEdges],
          visitedNodes: Array.from(visited),
          finishedNodes: Array.from(finished),
          stackState: [...callStack],
          callStack: [...callStack],
          traversalOrder: [...traversalOrder],
          recursionDepth: callStack.length,
          maxRecursionDepth,
          nodesVisitedCount: visited.size,
          edgesTraversedCount: treeEdges.length,
          treeEdgesCount: treeEdges.length,
          neighborChecksCount,
          backtracksCount,
          graphPhase: 'traverse-edge',
          keyConcept: keyConceptText,
          dfsMode: 'recursive',
        });

        // Recurse into neighbor
        dfs(neighbor, curr);
      } else {
        // Already visited: classify edge
        if (isBackEdge) {
          backEdges.push([curr, neighbor]);
        } else {
          skippedEdges.push([curr, neighbor]);
        }
      }
    }

    // ALL NEIGHBORS OF `curr` HAVE BEEN FULLY EXPLORED
    finished.add(curr);

    if (callStack.length > 1 && !targetFound) {
      backtracksCount++;
      const finishedNode = callStack.pop()!;
      const parentNode = callStack[callStack.length - 1];

      // Find if parent has an upcoming neighbor
      const parentNeighbors = adj[parentNode] || [];
      const currentIdxInParent = parentNeighbors.indexOf(finishedNode);
      const nextParentNeighbor =
        currentIdxInParent >= 0 && currentIdxInParent + 1 < parentNeighbors.length
          ? parentNeighbors[currentIdxInParent + 1]
          : null;

      // STEP: BACKTRACK TO PARENT
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'dfs-backtrack',
        array: dummyArray,
        elementIds: dummyArray,
        activeIndices: [parentNode, finishedNode],
        sortedIndices: Array.from(visited),
        visualStates: buildDFSNodeVisualStates(nodeIds, parentNode, null, callStack, finished, visited),
        action: `Backtrack to Node ${parentNode}`,
        indicesLabel: `dfs(${finishedNode}) returns`,
        valuesLabel: `Call Stack: [${callStack.join(', ')}]`,
        decisionLabel: `All neighbors of node ${finishedNode} fully explored`,
        nextActionLabel: nextParentNeighbor !== null ? `Inspect next neighbor ${nextParentNeighbor} of node ${parentNode}` : `Backtrack from node ${parentNode}`,
        pass: callStack.length,
        totalPasses: 1,
        comparisonCount: treeEdges.length,
        swapCount: 0,
        searchTarget: targetNode ?? undefined,
        pseudocodeLine: 9,
        explanation: `All neighbors of node ${finishedNode} have been fully explored. DFS finishes node ${finishedNode} and returns to parent node ${parentNode}. Now we continue with the next unvisited neighbor of node ${parentNode}.`,
        currentNode: parentNode,
        currentNeighbor: null,
        nextNeighbor: nextParentNeighbor,
        activeEdge: [finishedNode, parentNode],
        traversedEdges: [...treeEdges],
        treeEdges: [...treeEdges],
        backEdges: [...backEdges],
        skippedEdges: [...skippedEdges],
        visitedNodes: Array.from(visited),
        finishedNodes: Array.from(finished),
        stackState: [...callStack],
        callStack: [...callStack],
        traversalOrder: [...traversalOrder],
        recursionDepth: callStack.length,
        maxRecursionDepth,
        nodesVisitedCount: visited.size,
        edgesTraversedCount: treeEdges.length,
        treeEdgesCount: treeEdges.length,
        neighborChecksCount,
        backtracksCount,
        isBacktracking: true,
        backtrackFrom: finishedNode,
        backtrackTo: parentNode,
        graphPhase: 'backtrack',
        keyConcept: keyConceptText,
        dfsMode: 'recursive',
        stackOp: { type: 'pop', node: finishedNode },
      });
    } else if (callStack.length === 1 && !targetFound) {
      callStack.pop(); // Root frame completes
    }
  }

  // Execute recursive DFS from start node
  dfs(effectiveStart, null);

  // FINAL COMPLETE STEP
  steps.push({
    id: steps.length,
    stepIndex: steps.length,
    type: 'dfs-complete',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: Array.from(visited),
    sortedIndices: Array.from(visited),
    visualStates: buildDFSNodeVisualStates(nodeIds, null, null, [], finished, visited),
    action: targetFound ? `Target ${targetNode} Located!` : 'DFS Complete',
    indicesLabel: `${visited.size} / ${nodeIds.length} Nodes Visited`,
    valuesLabel: 'Call Stack Empty',
    decisionLabel: `Explored complete reachable branch with ${treeEdges.length} tree edge(s)`,
    nextActionLabel: 'Execution Finished',
    pass: 1,
    totalPasses: 1,
    comparisonCount: treeEdges.length,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 9,
    explanation: `DFS completed! Explored ${visited.size} reachable node(s) using ${treeEdges.length} tree edge(s) with ${backtracksCount} backtrack(s). Traversal path: [${traversalOrder.join(' → ')}]. Call stack is empty.`,
    currentNode: null,
    currentNeighbor: null,
    nextNeighbor: null,
    activeEdge: null,
    traversedEdges: [...treeEdges],
    treeEdges: [...treeEdges],
    backEdges: [...backEdges],
    skippedEdges: [...skippedEdges],
    visitedNodes: Array.from(visited),
    finishedNodes: Array.from(finished),
    stackState: [],
    callStack: [],
    traversalOrder: [...traversalOrder],
    recursionDepth: 0,
    maxRecursionDepth,
    nodesVisitedCount: visited.size,
    edgesTraversedCount: treeEdges.length,
    treeEdgesCount: treeEdges.length,
    neighborChecksCount,
    backtracksCount,
    graphPhase: 'complete',
    keyConcept: keyConceptText,
    dfsMode: 'recursive',
  });

  return steps;
}

/**
 * Generates deterministic execution steps for Iterative DFS (explicit LIFO stack)
 */
export function generateIterativeDFSSteps(
  graph: GraphData,
  startNode: number = 0,
  targetNode?: number | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodeIds = graph.nodes.map((n) => n.id);
  const dummyArray = nodeIds;

  if (nodeIds.length === 0) {
    return steps;
  }

  const effectiveStart = nodeIds.includes(startNode) ? startNode : nodeIds[0];
  const adj = buildAdjacencyList(graph);

  // Explicit LIFO stack
  const stack: number[] = [effectiveStart];
  const visited = new Set<number>();
  const finished = new Set<number>();
  const traversalOrder: number[] = [];
  const treeEdges: [number, number][] = [];
  const backEdges: [number, number][] = [];
  const skippedEdges: [number, number][] = [];
  const parentMap: Record<number, number> = {};

  let neighborChecksCount = 0;
  let maxStackDepth = 1;
  let targetFound = false;

  const keyConceptText =
    'Iterative DFS uses an explicit LIFO (Last-In, First-Out) stack. It explores as deep as possible before popping from the stack.';

  // STEP 0: READY / INITIAL STATE
  steps.push({
    id: 0,
    stepIndex: 0,
    type: 'initial',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: [],
    sortedIndices: [],
    visualStates: buildDFSNodeVisualStates(nodeIds, null, null, stack, finished, visited),
    action: 'Ready',
    indicesLabel: `Start Node: ${effectiveStart}`,
    valuesLabel: `Stack: [${stack.join(', ')}]`,
    decisionLabel: 'Push start node onto explicit LIFO stack',
    nextActionLabel: 'Press PLAY or NEXT to begin',
    pass: 0,
    totalPasses: 1,
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 0,
    explanation: `Iterative DFS ready. Node ${effectiveStart} is pushed onto the explicit stack. Press PLAY or NEXT to pop and explore.`,
    currentNode: null,
    currentNeighbor: null,
    nextNeighbor: null,
    activeEdge: null,
    traversedEdges: [],
    treeEdges: [],
    backEdges: [],
    skippedEdges: [],
    visitedNodes: [],
    finishedNodes: [],
    stackState: [...stack],
    callStack: [...stack],
    traversalOrder: [],
    recursionDepth: 1,
    maxRecursionDepth: 1,
    nodesVisitedCount: 0,
    edgesTraversedCount: 0,
    treeEdgesCount: 0,
    neighborChecksCount: 0,
    backtracksCount: 0,
    graphPhase: 'initialize',
    keyConcept: keyConceptText,
    dfsMode: 'iterative',
    stackOp: { type: 'push', node: effectiveStart },
  });

  while (stack.length > 0) {
    maxStackDepth = Math.max(maxStackDepth, stack.length);
    const curr = stack.pop()!;

    // STEP: POP NODE FROM STACK
    steps.push({
      id: steps.length,
      stepIndex: steps.length,
      type: 'dfs-visit',
      array: dummyArray,
      elementIds: dummyArray,
      activeIndices: [curr],
      sortedIndices: Array.from(visited),
      visualStates: buildDFSNodeVisualStates(nodeIds, curr, null, stack, finished, visited),
      action: `Pop Node ${curr} from Stack`,
      indicesLabel: `Popped: ${curr}`,
      valuesLabel: `Stack: [${stack.join(', ')}]`,
      decisionLabel: !visited.has(curr) ? `Node ${curr} unvisited → Process and inspect neighbors` : `Node ${curr} already visited → Skip`,
      nextActionLabel: !visited.has(curr) ? `Mark node ${curr} visited` : 'Pop next node from stack',
      pass: stack.length + 1,
      totalPasses: 1,
      comparisonCount: treeEdges.length,
      swapCount: 0,
      searchTarget: targetNode ?? undefined,
      pseudocodeLine: 5,
      explanation: `Popped node ${curr} from top of the stack. Next, DFS checks if node ${curr} has been visited yet.`,
      currentNode: curr,
      currentNeighbor: null,
      nextNeighbor: null,
      activeEdge: parentMap[curr] !== undefined ? [parentMap[curr], curr] : null,
      traversedEdges: [...treeEdges],
      treeEdges: [...treeEdges],
      backEdges: [...backEdges],
      skippedEdges: [...skippedEdges],
      visitedNodes: Array.from(visited),
      finishedNodes: Array.from(finished),
      stackState: [...stack],
      callStack: [...stack],
      traversalOrder: [...traversalOrder],
      recursionDepth: stack.length + 1,
      maxRecursionDepth: maxStackDepth,
      nodesVisitedCount: visited.size,
      edgesTraversedCount: treeEdges.length,
      treeEdgesCount: treeEdges.length,
      neighborChecksCount,
      backtracksCount: 0,
      graphPhase: 'visit',
      keyConcept: keyConceptText,
      dfsMode: 'iterative',
      stackOp: { type: 'pop', node: curr },
    });

    if (!visited.has(curr)) {
      visited.add(curr);
      traversalOrder.push(curr);

      if (parentMap[curr] !== undefined) {
        treeEdges.push([parentMap[curr], curr]);
      }

      if (targetNode !== null && targetNode !== undefined && curr === targetNode) {
        targetFound = true;
        break;
      }

      const rawNeighbors = adj[curr] || [];
      // Push neighbors in reverse order so first neighbor is popped first (matching recursive traversal)
      const reversedNeighbors = [...rawNeighbors].reverse();

      for (let i = 0; i < reversedNeighbors.length; i++) {
        const neighbor = reversedNeighbors[i];
        neighborChecksCount++;
        const isUnvisited = !visited.has(neighbor);

        // STEP: INSPECT NEIGHBOR
        steps.push({
          id: steps.length,
          stepIndex: steps.length,
          type: 'dfs-inspect-neighbor',
          array: dummyArray,
          elementIds: dummyArray,
          activeIndices: [curr, neighbor],
          sortedIndices: Array.from(visited),
          visualStates: buildDFSNodeVisualStates(nodeIds, curr, neighbor, stack, finished, visited),
          action: `Inspect Neighbor ${neighbor}`,
          indicesLabel: `Edge: ${curr} → ${neighbor}`,
          valuesLabel: `Stack: [${stack.join(', ')}]`,
          decisionLabel: isUnvisited ? `Neighbor ${neighbor} unvisited → Push to stack` : `Neighbor ${neighbor} visited → Skip`,
          nextActionLabel: isUnvisited ? `Push ${neighbor} to stack` : 'Continue inspecting neighbors',
          pass: stack.length,
          totalPasses: 1,
          comparisonCount: treeEdges.length,
          swapCount: 0,
          searchTarget: targetNode ?? undefined,
          pseudocodeLine: 9,
          explanation: isUnvisited
            ? `Inspecting neighbor ${neighbor} from node ${curr}. Neighbor is unvisited, so push node ${neighbor} onto the LIFO stack.`
            : `Inspecting neighbor ${neighbor} from node ${curr}. Node ${neighbor} is already visited, so DFS skips it.`,
          currentNode: curr,
          currentNeighbor: neighbor,
          nextNeighbor: neighbor,
          activeEdge: [curr, neighbor],
          traversedEdges: [...treeEdges],
          treeEdges: [...treeEdges],
          backEdges: [...backEdges],
          skippedEdges: [...skippedEdges],
          visitedNodes: Array.from(visited),
          finishedNodes: Array.from(finished),
          stackState: [...stack],
          callStack: [...stack],
          traversalOrder: [...traversalOrder],
          recursionDepth: stack.length,
          maxRecursionDepth: maxStackDepth,
          nodesVisitedCount: visited.size,
          edgesTraversedCount: treeEdges.length,
          treeEdgesCount: treeEdges.length,
          neighborChecksCount,
          backtracksCount: 0,
          graphPhase: 'inspect-neighbor',
          keyConcept: keyConceptText,
          dfsMode: 'iterative',
        });

        if (isUnvisited) {
          stack.push(neighbor);
          if (parentMap[neighbor] === undefined) {
            parentMap[neighbor] = curr;
          }
          maxStackDepth = Math.max(maxStackDepth, stack.length);

          // STEP: PUSH TO STACK
          steps.push({
            id: steps.length,
            stepIndex: steps.length,
            type: 'dfs-traverse-edge',
            array: dummyArray,
            elementIds: dummyArray,
            activeIndices: [curr, neighbor],
            sortedIndices: Array.from(visited),
            visualStates: buildDFSNodeVisualStates(nodeIds, curr, neighbor, stack, finished, visited),
            action: `Push Node ${neighbor} to Stack`,
            indicesLabel: `Pushed: ${neighbor}`,
            valuesLabel: `Stack: [${stack.join(', ')}]`,
            decisionLabel: `Node ${neighbor} added to top of LIFO stack`,
            nextActionLabel: 'Process next neighbor or pop stack',
            pass: stack.length,
            totalPasses: 1,
            comparisonCount: treeEdges.length,
            swapCount: 0,
            searchTarget: targetNode ?? undefined,
            pseudocodeLine: 10,
            explanation: `Pushed unvisited neighbor ${neighbor} to top of the stack. Stack now has ${stack.length} element(s).`,
            currentNode: curr,
            currentNeighbor: neighbor,
            nextNeighbor: neighbor,
            activeEdge: [curr, neighbor],
            traversedEdges: [...treeEdges],
            treeEdges: [...treeEdges],
            backEdges: [...backEdges],
            skippedEdges: [...skippedEdges],
            visitedNodes: Array.from(visited),
            finishedNodes: Array.from(finished),
            stackState: [...stack],
            callStack: [...stack],
            traversalOrder: [...traversalOrder],
            recursionDepth: stack.length,
            maxRecursionDepth: maxStackDepth,
            nodesVisitedCount: visited.size,
            edgesTraversedCount: treeEdges.length,
            treeEdgesCount: treeEdges.length,
            neighborChecksCount,
            backtracksCount: 0,
            graphPhase: 'traverse-edge',
            keyConcept: keyConceptText,
            dfsMode: 'iterative',
            stackOp: { type: 'push', node: neighbor },
          });
        } else {
          skippedEdges.push([curr, neighbor]);
        }
      }

      finished.add(curr);
    }
  }

  // FINAL COMPLETE STEP
  steps.push({
    id: steps.length,
    stepIndex: steps.length,
    type: 'dfs-complete',
    array: dummyArray,
    elementIds: dummyArray,
    activeIndices: Array.from(visited),
    sortedIndices: Array.from(visited),
    visualStates: buildDFSNodeVisualStates(nodeIds, null, null, [], finished, visited),
    action: targetFound ? `Target ${targetNode} Located!` : 'Iterative DFS Complete',
    indicesLabel: `${visited.size} / ${nodeIds.length} Nodes Visited`,
    valuesLabel: 'Stack Empty',
    decisionLabel: 'LIFO Stack is empty — all reachable nodes processed',
    nextActionLabel: 'Execution Finished',
    pass: 1,
    totalPasses: 1,
    comparisonCount: treeEdges.length,
    swapCount: 0,
    searchTarget: targetNode ?? undefined,
    pseudocodeLine: 11,
    explanation: `Iterative DFS completed! Explored ${visited.size} reachable node(s). Traversal path: [${traversalOrder.join(' → ')}]. The explicit stack is now empty.`,
    currentNode: null,
    currentNeighbor: null,
    nextNeighbor: null,
    activeEdge: null,
    traversedEdges: [...treeEdges],
    treeEdges: [...treeEdges],
    backEdges: [...backEdges],
    skippedEdges: [...skippedEdges],
    visitedNodes: Array.from(visited),
    finishedNodes: Array.from(finished),
    stackState: [],
    callStack: [],
    traversalOrder: [...traversalOrder],
    recursionDepth: 0,
    maxRecursionDepth: maxStackDepth,
    nodesVisitedCount: visited.size,
    edgesTraversedCount: treeEdges.length,
    treeEdgesCount: treeEdges.length,
    neighborChecksCount,
    backtracksCount: 0,
    graphPhase: 'complete',
    keyConcept: keyConceptText,
    dfsMode: 'iterative',
  });

  return steps;
}

/**
 * Universal DFS entrypoint supporting both recursive and iterative execution modes
 */
export function generateDFSSteps(
  graph: GraphData,
  startNode: number = 0,
  targetNode?: number | null,
  dfsMode: 'recursive' | 'iterative' = 'recursive'
): AlgorithmStep[] {
  if (dfsMode === 'iterative') {
    return generateIterativeDFSSteps(graph, startNode, targetNode);
  }
  return generateRecursiveDFSSteps(graph, startNode, targetNode);
}
