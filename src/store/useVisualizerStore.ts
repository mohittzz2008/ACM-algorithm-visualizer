import { create } from 'zustand';
import type { AlgorithmStep, SupportedLanguage } from '../algorithms/types';
import { generateBubbleSortSteps } from '../algorithms/sorting/bubbleSort';
import { generateMergeSortSteps } from '../algorithms/sorting/mergeSort';
import {
  generateBinarySearchSteps,
  BINARY_SEARCH_DEFAULT_ARRAY,
  BINARY_SEARCH_DEFAULT_TARGET,
} from '../algorithms/searching/binarySearch';
import { generateBFSSteps } from '../algorithms/graph/bfs';
import { generateDFSSteps } from '../algorithms/graph/dfs';
import type { GraphData } from '../algorithms/graph/types';
import {
  DEFAULT_GRAPH_DATA,
  DEFAULT_START_NODE,
  GRAPH_PRESETS,
} from '../algorithms/graph/presets';
import { computeAutoLayout } from '../algorithms/graph/layout';
import {
  DEFAULT_ARRAY,
  generateNearlySortedArray,
  generateRandomArray,
  generateSortedArray,
  isSortedAscending,
  reverseArray,
  shuffleArray,
} from '../utils/arrayGenerators';

export const MERGE_DEFAULT_ARRAY = [38, 12, 27, 43, 9, 31, 18, 25];

export function generateStepsForAlgorithm(
  algorithmId: string,
  array: number[],
  target: number = BINARY_SEARCH_DEFAULT_TARGET,
  graphData: GraphData = DEFAULT_GRAPH_DATA,
  startNode: number = DEFAULT_START_NODE,
  targetNode: number | null = null,
  dfsMode: 'recursive' | 'iterative' = 'recursive'
): AlgorithmStep[] {
  if (algorithmId === 'bfs') {
    return generateBFSSteps(graphData, startNode, targetNode);
  }
  if (algorithmId === 'dfs') {
    return generateDFSSteps(graphData, startNode, targetNode, dfsMode);
  }
  if (algorithmId === 'binary-search') {
    return generateBinarySearchSteps(array, target);
  }
  if (algorithmId === 'merge-sort') {
    return generateMergeSortSteps(array);
  }
  return generateBubbleSortSteps(array);
}

export interface VisualizerState {
  // Array & Steps
  initialArray: number[];
  arraySize: number;
  targetValue: number;
  steps: AlgorithmStep[];
  currentStepIndex: number;

  // Graph state
  graphData: GraphData;
  startNode: number;
  targetNode: number | null;
  activeGraphPresetId: string;
  graphInputMode: 'list' | 'matrix';
  edgeFeedback: { type: 'success' | 'warning' | 'error'; message: string } | null;
  dfsMode: 'recursive' | 'iterative';

  // Playback
  isPlaying: boolean;
  playbackSpeed: number; // 0.5, 1, 2, 4
  elapsedTimeMs: number;

  // UI state
  currentPage: 'home' | 'visualizer';
  skipIntroOnNextHome: boolean;
  theme: 'dark' | 'light';
  selectedLanguage: SupportedLanguage;
  activeAlgorithmId: string;
  isCustomInputModalOpen: boolean;
  isShortcutsModalOpen: boolean;
  isSettingsModalOpen: boolean;

  // Page Navigation
  setCurrentPage: (page: 'home' | 'visualizer') => void;
  setSkipIntroOnNextHome: (skip: boolean) => void;

  // Theme Actions
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;

  // Array Actions
  setArray: (newArray: number[]) => void;
  setArraySize: (size: number) => void;
  setTargetValue: (target: number) => void;
  setBinarySearchInput: (newArray: number[], target: number) => void;
  generateRandom: () => void;
  generateSorted: () => void;
  sortCurrentArray: () => void;
  shuffle: () => void;
  nearlySorted: () => void;
  reverse: () => void;
  clear: () => void;

  // Graph Actions
  setGraphData: (data: GraphData) => void;
  setStartNode: (nodeId: number) => void;
  setTargetNode: (nodeId: number | null) => void;
  toggleDirectedGraph: () => void;
  selectGraphPreset: (presetId: string) => void;
  setGraphInputMode: (mode: 'list' | 'matrix') => void;
  setGraphNodesCount: (count: number) => void;
  toggleEdge: (from: number, to: number) => void;
  addEdge: (from: number, to: number) => void;
  removeEdge: (from: number, to: number) => void;
  setEdgeFeedback: (feedback: { type: 'success' | 'warning' | 'error'; message: string } | null) => void;
  clearGraph: () => void;
  generateExampleGraph: () => void;
  setDfsMode: (mode: 'recursive' | 'iterative') => void;

  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToFirst: () => void;
  goToLast: () => void;
  seekToStep: (index: number) => void;
  reset: () => void;

  setPlaybackSpeed: (speed: number) => void;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
  setActiveAlgorithmId: (id: string) => void;
  setCustomInputModalOpen: (open: boolean) => void;
  setShortcutsModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  incrementElapsedTime: (ms: number) => void;
}

const initialSteps = generateBubbleSortSteps(DEFAULT_ARRAY);

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  initialArray: DEFAULT_ARRAY,
  arraySize: DEFAULT_ARRAY.length,
  targetValue: BINARY_SEARCH_DEFAULT_TARGET,
  steps: initialSteps,
  currentStepIndex: 0,

  // Graph state
  graphData: DEFAULT_GRAPH_DATA,
  startNode: DEFAULT_START_NODE,
  targetNode: null,
  activeGraphPresetId: 'simple-graph',
  graphInputMode: 'list',
  edgeFeedback: null,
  dfsMode: 'recursive',

  isPlaying: false,
  playbackSpeed: 1,
  elapsedTimeMs: 0,

  currentPage: (() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPage = localStorage.getItem('acm_current_page');
        if (savedPage === 'visualizer' || savedPage === 'home') {
          return savedPage;
        }
      } catch {
        // ignore storage errors
      }
    }
    return 'home';
  })(),
  skipIntroOnNextHome: false,
  theme: (() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('acm_theme') || localStorage.getItem('algovista_theme');
        if (saved === 'dark' || saved === 'light') {
          if (saved === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
          }
          return saved;
        }
      } catch {
        // ignore
      }
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    return 'light';
  })(),
  selectedLanguage: 'python',
  activeAlgorithmId: 'bubble-sort',
  isCustomInputModalOpen: false,
  isShortcutsModalOpen: false,
  isSettingsModalOpen: false,

  setCurrentPage: (page: 'home' | 'visualizer') => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('acm_current_page', page);
      } catch {
        // ignore storage errors
      }
    }
    const prevPage = get().currentPage;
    if (prevPage === 'visualizer' && page === 'home') {
      set({ skipIntroOnNextHome: true });
    }
    set({ currentPage: page });
  },

  setSkipIntroOnNextHome: (skip: boolean) => {
    set({ skipIntroOnNextHome: skip });
  },

  setTheme: (theme: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      try {
        localStorage.setItem('acm_theme', theme);
        localStorage.setItem('algovista_theme', theme);
      } catch {
        // ignore storage errors
      }
    }
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },

  setArray: (newArray: number[]) => {
    const { activeAlgorithmId, targetValue, graphData, startNode, targetNode } = get();
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      newArray,
      targetValue,
      graphData,
      startNode,
      targetNode
    );
    set({
      initialArray: newArray,
      arraySize: newArray.length,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setArraySize: (size: number) => {
    const { activeAlgorithmId, targetValue, graphData, startNode, targetNode } = get();
    const newArray = activeAlgorithmId === 'binary-search'
      ? generateSortedArray(size)
      : generateRandomArray(size);
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      newArray,
      targetValue,
      graphData,
      startNode,
      targetNode
    );
    set({
      initialArray: newArray,
      arraySize: size,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setTargetValue: (target: number) => {
    const { activeAlgorithmId, initialArray } = get();
    set({ targetValue: target });
    if (activeAlgorithmId === 'binary-search') {
      const steps = generateStepsForAlgorithm(activeAlgorithmId, initialArray, target);
      set({
        steps,
        currentStepIndex: 0,
        isPlaying: false,
        elapsedTimeMs: 0,
      });
    }
  },

  setBinarySearchInput: (newArray: number[], target: number) => {
    const { activeAlgorithmId } = get();
    const steps = generateStepsForAlgorithm(activeAlgorithmId, newArray, target);
    set({
      initialArray: newArray,
      arraySize: newArray.length,
      targetValue: target,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  generateRandom: () => {
    const { arraySize } = get();
    const newArray = generateRandomArray(arraySize);
    get().setArray(newArray);
  },

  generateSorted: () => {
    const { arraySize } = get();
    const newArray = generateSortedArray(arraySize);
    get().setArray(newArray);
  },

  sortCurrentArray: () => {
    const { initialArray } = get();
    const sorted = [...initialArray].sort((a, b) => a - b);
    get().setArray(sorted);
  },

  shuffle: () => {
    const { initialArray } = get();
    const shuffled = shuffleArray(initialArray);
    get().setArray(shuffled);
  },

  nearlySorted: () => {
    const { arraySize } = get();
    const newArray = generateNearlySortedArray(arraySize);
    get().setArray(newArray);
  },

  reverse: () => {
    const { initialArray } = get();
    const reversed = reverseArray(initialArray);
    get().setArray(reversed);
  },

  clear: () => {
    // Reset to minimal 2-element array or open custom input
    get().setCustomInputModalOpen(true);
  },

  setGraphData: (data: GraphData) => {
    const { activeAlgorithmId, initialArray, targetValue, startNode, targetNode, dfsMode } = get();
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      data,
      startNode,
      targetNode,
      dfsMode
    );
    set({
      graphData: data,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setStartNode: (nodeId: number) => {
    const { activeAlgorithmId, initialArray, targetValue, graphData, targetNode, dfsMode } = get();
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      graphData,
      nodeId,
      targetNode,
      dfsMode
    );
    set({
      startNode: nodeId,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setTargetNode: (nodeId: number | null) => {
    const { activeAlgorithmId, initialArray, targetValue, graphData, startNode, dfsMode } = get();
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      graphData,
      startNode,
      nodeId,
      dfsMode
    );
    set({
      targetNode: nodeId,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  toggleDirectedGraph: () => {
    const { graphData, activeAlgorithmId, initialArray, targetValue, startNode, targetNode, dfsMode } = get();
    const updatedGraph: GraphData = {
      ...graphData,
      isDirected: !graphData.isDirected,
    };
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      updatedGraph,
      startNode,
      targetNode,
      dfsMode
    );
    set({
      graphData: updatedGraph,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  selectGraphPreset: (presetId: string) => {
    const preset = GRAPH_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const { activeAlgorithmId, initialArray, targetValue, dfsMode } = get();
    const nextStartNode = preset.defaultStartNode;
    const nextTargetNode = preset.defaultTargetNode ?? null;
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      preset.graph,
      nextStartNode,
      nextTargetNode,
      dfsMode
    );
    set({
      activeGraphPresetId: presetId,
      graphData: preset.graph,
      startNode: nextStartNode,
      targetNode: nextTargetNode,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setGraphInputMode: (mode: 'list' | 'matrix') => {
    set({ graphInputMode: mode });
  },

  setGraphNodesCount: (count: number) => {
    const clampedCount = Math.max(1, Math.min(20, count));
    const { graphData, activeAlgorithmId, initialArray, targetValue, startNode, targetNode, dfsMode } = get();
    if (clampedCount === graphData.nodes.length) return;

    let newNodes = [...graphData.nodes];
    let newEdges = [...graphData.edges];

    if (clampedCount < newNodes.length) {
      newNodes = newNodes.slice(0, clampedCount);
      const validNodeIds = new Set(newNodes.map((n) => n.id));
      newEdges = newEdges.filter(
        (e) => validNodeIds.has(e.from) && validNodeIds.has(e.to)
      );
    } else {
      const existingIds = new Set(newNodes.map((n) => n.id));
      let nextId = 0;
      while (newNodes.length < clampedCount) {
        while (existingIds.has(nextId)) {
          nextId++;
        }
        existingIds.add(nextId);
        newNodes.push({ id: nextId, label: String(nextId), x: 250, y: 180 });

        // Connect new node to the best parent (node with lowest child count in BFS order)
        const childCounts: Record<number, number> = {};
        newNodes.forEach((n) => { childCounts[n.id] = 0; });
        newEdges.forEach((e) => {
          if (childCounts[e.from] !== undefined) childCounts[e.from]++;
        });

        // Find candidate parent among previous nodes
        const prevNodes = newNodes.filter((n) => n.id !== nextId);
        const bestParent = [...prevNodes].sort((a, b) => {
          const countA = childCounts[a.id] ?? 0;
          const countB = childCounts[b.id] ?? 0;
          if (countA !== countB) return countA - countB;
          return a.id - b.id;
        })[0];

        if (bestParent) {
          newEdges.push({ from: bestParent.id, to: nextId });
        }
        nextId++;
      }
    }

    const nextStart = newNodes.some((n) => n.id === startNode) ? startNode : (newNodes[0]?.id ?? 0);
    const nextTarget = targetNode !== null && newNodes.some((n) => n.id === targetNode) ? targetNode : null;

    // Automatically compute bounded non-overlapping layout
    const laidOutNodes = computeAutoLayout(newNodes, newEdges, nextStart, graphData.isDirected);

    const nextGraph: GraphData = {
      ...graphData,
      nodes: laidOutNodes,
      edges: newEdges,
    };

    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      nextGraph,
      nextStart,
      nextTarget,
      dfsMode
    );

    set({
      graphData: nextGraph,
      startNode: nextStart,
      targetNode: nextTarget,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
      activeGraphPresetId: 'custom',
    });
  },

  addEdge: (from: number, to: number) => {
    const { graphData, activeAlgorithmId, initialArray, targetValue, startNode, targetNode } = get();
    const isDirected = graphData.isDirected;

    // Self-loop validation (ISSUE 5)
    if (from === to) {
      set({
        edgeFeedback: {
          type: 'error',
          message: `Cannot add self-loop edge (${from} → ${to}). Self-loops are not allowed.`,
        },
      });
      return;
    }

    // Duplicate edge validation (ISSUE 4)
    const exists = graphData.edges.some((e) =>
      isDirected
        ? e.from === from && e.to === to
        : (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );

    if (exists) {
      set({
        edgeFeedback: {
          type: 'warning',
          message: `Edge (${from} ${isDirected ? '→' : '—'} ${to}) already exists.`,
        },
      });
      return;
    }

    const nextEdges = [...graphData.edges, { from, to }];
    const nextGraph: GraphData = {
      ...graphData,
      edges: nextEdges,
    };

    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      nextGraph,
      startNode,
      targetNode,
      get().dfsMode
    );

    set({
      graphData: nextGraph,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
      activeGraphPresetId: 'custom',
      edgeFeedback: {
        type: 'success',
        message: `Edge (${from} ${isDirected ? '→' : '—'} ${to}) added successfully!`,
      },
    });
  },

  removeEdge: (from: number, to: number) => {
    const { graphData, activeAlgorithmId, initialArray, targetValue, startNode, targetNode } = get();
    const isDirected = graphData.isDirected;
    const existingIndex = graphData.edges.findIndex((e) =>
      isDirected
        ? e.from === from && e.to === to
        : (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );

    if (existingIndex >= 0) {
      const nextEdges = graphData.edges.filter((_, idx) => idx !== existingIndex);
      const nextGraph: GraphData = {
        ...graphData,
        edges: nextEdges,
      };

      const steps = generateStepsForAlgorithm(
        activeAlgorithmId,
        initialArray,
        targetValue,
        nextGraph,
        startNode,
        targetNode,
        get().dfsMode
      );

      set({
        graphData: nextGraph,
        steps,
        currentStepIndex: 0,
        isPlaying: false,
        elapsedTimeMs: 0,
        activeGraphPresetId: 'custom',
        edgeFeedback: {
          type: 'warning',
          message: `Edge (${from} ${isDirected ? '→' : '—'} ${to}) removed.`,
        },
      });
    }
  },

  toggleEdge: (from: number, to: number) => {
    if (from === to) {
      set({
        edgeFeedback: {
          type: 'error',
          message: `Cannot add self-loop edge (${from} → ${to}). Self-loops are not allowed.`,
        },
      });
      return;
    }
    const { graphData } = get();
    const isDirected = graphData.isDirected;
    const exists = graphData.edges.some((e) =>
      isDirected
        ? e.from === from && e.to === to
        : (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );

    if (exists) {
      get().removeEdge(from, to);
    } else {
      get().addEdge(from, to);
    }
  },

  setEdgeFeedback: (feedback: { type: 'success' | 'warning' | 'error'; message: string } | null) => {
    set({ edgeFeedback: feedback });
  },

  clearGraph: () => {
    const { graphData, activeAlgorithmId, initialArray, targetValue, startNode } = get();
    const emptyEdgesGraph: GraphData = {
      ...graphData,
      edges: [],
    };
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      emptyEdgesGraph,
      startNode,
      null,
      get().dfsMode
    );
    set({
      graphData: emptyEdgesGraph,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
      activeGraphPresetId: 'custom',
    });
  },

  generateExampleGraph: () => {
    const { activeGraphPresetId } = get();
    const currentIndex = GRAPH_PRESETS.findIndex((p) => p.id === activeGraphPresetId);
    const nextIndex = (currentIndex + 1) % GRAPH_PRESETS.length;
    const nextPreset = GRAPH_PRESETS[nextIndex];
    get().selectGraphPreset(nextPreset.id);
  },

  setDfsMode: (mode: 'recursive' | 'iterative') => {
    const { activeAlgorithmId, initialArray, targetValue, graphData, startNode, targetNode } = get();
    const steps = generateStepsForAlgorithm(
      activeAlgorithmId,
      initialArray,
      targetValue,
      graphData,
      startNode,
      targetNode,
      mode
    );
    set({
      dfsMode: mode,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  play: () => {
    const { currentStepIndex, steps } = get();
    // If at end, start from 0
    if (currentStepIndex >= steps.length - 1) {
      set({ currentStepIndex: 0, isPlaying: true, elapsedTimeMs: 0 });
    } else {
      set({ isPlaying: true });
    }
  },

  pause: () => {
    set({ isPlaying: false });
  },

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  nextStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },

  goToFirst: () => {
    set({ currentStepIndex: 0, isPlaying: false, elapsedTimeMs: 0 });
  },

  goToLast: () => {
    const { steps } = get();
    set({ currentStepIndex: steps.length - 1, isPlaying: false });
  },

  seekToStep: (index: number) => {
    const { steps } = get();
    const clamped = Math.max(0, Math.min(steps.length - 1, index));
    set({ currentStepIndex: clamped });
  },

  reset: () => {
    set({
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },

  setSelectedLanguage: (lang: SupportedLanguage) => {
    set({ selectedLanguage: lang });
  },

  setActiveAlgorithmId: (id: string) => {
    const { initialArray, activeAlgorithmId, targetValue, graphData, startNode, targetNode } = get();
    if (activeAlgorithmId === id) return;

    let targetArray = initialArray;
    let nextTarget = targetValue;

    if (id === 'binary-search') {
      if (!isSortedAscending(initialArray) || initialArray.length < 2) {
        targetArray = BINARY_SEARCH_DEFAULT_ARRAY;
        nextTarget = BINARY_SEARCH_DEFAULT_TARGET;
      }
    } else if (id === 'merge-sort' && (JSON.stringify(initialArray) === JSON.stringify(DEFAULT_ARRAY) || JSON.stringify(initialArray) === JSON.stringify(BINARY_SEARCH_DEFAULT_ARRAY))) {
      targetArray = MERGE_DEFAULT_ARRAY;
    } else if (id === 'bubble-sort' && (JSON.stringify(initialArray) === JSON.stringify(MERGE_DEFAULT_ARRAY) || JSON.stringify(initialArray) === JSON.stringify(BINARY_SEARCH_DEFAULT_ARRAY))) {
      targetArray = DEFAULT_ARRAY;
    }

    const steps = generateStepsForAlgorithm(
      id,
      targetArray,
      nextTarget,
      graphData,
      startNode,
      targetNode,
      get().dfsMode
    );
    set({
      activeAlgorithmId: id,
      initialArray: targetArray,
      arraySize: targetArray.length,
      targetValue: nextTarget,
      steps,
      currentStepIndex: 0,
      isPlaying: false,
      elapsedTimeMs: 0,
    });
  },

  setCustomInputModalOpen: (open: boolean) => {
    set({ isCustomInputModalOpen: open });
  },

  setShortcutsModalOpen: (open: boolean) => {
    set({ isShortcutsModalOpen: open });
  },

  setSettingsModalOpen: (open: boolean) => {
    set({ isSettingsModalOpen: open });
  },

  incrementElapsedTime: (ms: number) => {
    set((state) => ({ elapsedTimeMs: state.elapsedTimeMs + ms }));
  },
}));
