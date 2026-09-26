import type {
  AlgorithmMetadata,
  AlgorithmStep,
  ElementVisualState,
  PseudocodeDefinition,
  SupportedLanguage,
} from '../types';

export const BINARY_SEARCH_DEFAULT_ARRAY = [5, 12, 18, 25, 31, 43, 56, 72];
export const BINARY_SEARCH_DEFAULT_TARGET = 31;

export const binarySearchMetadata: AlgorithmMetadata = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'searching',
  description: 'Find a target by repeatedly halving the search space in a sorted array.',
  timeComplexity: {
    best: 'O(1)',
    average: 'O(log n)',
    worst: 'O(log n)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
};

export const binarySearchPseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python',
    lines: [
      { lineNumber: 1, code: 'def binary_search(arr, target):', indent: 0 },
      { lineNumber: 2, code: '    left = 0', indent: 1 },
      { lineNumber: 3, code: '    right = len(arr) - 1', indent: 1 },
      { lineNumber: 4, code: '    while left <= right:', indent: 1 },
      { lineNumber: 5, code: '        mid = left + (right - left) // 2', indent: 2 },
      { lineNumber: 6, code: '        if arr[mid] == target:', indent: 2 },
      { lineNumber: 7, code: '            return mid', indent: 3 },
      { lineNumber: 8, code: '        elif arr[mid] < target:', indent: 2 },
      { lineNumber: 9, code: '            left = mid + 1', indent: 3 },
      { lineNumber: 10, code: '        else:', indent: 2 },
      { lineNumber: 11, code: '            right = mid - 1', indent: 3 },
      { lineNumber: 12, code: '    return -1', indent: 1 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript',
    lines: [
      { lineNumber: 1, code: 'function binarySearch(arr, target) {', indent: 0 },
      { lineNumber: 2, code: '    let left = 0;', indent: 1 },
      { lineNumber: 3, code: '    let right = arr.length - 1;', indent: 1 },
      { lineNumber: 4, code: '    while (left <= right) {', indent: 1 },
      { lineNumber: 5, code: '        const mid = left + Math.floor((right - left) / 2);', indent: 2 },
      { lineNumber: 6, code: '        if (arr[mid] === target) {', indent: 2 },
      { lineNumber: 7, code: '            return mid;', indent: 3 },
      { lineNumber: 8, code: '        } else if (arr[mid] < target) {', indent: 2 },
      { lineNumber: 9, code: '            left = mid + 1;', indent: 3 },
      { lineNumber: 10, code: '        } else {', indent: 2 },
      { lineNumber: 11, code: '            right = mid - 1;', indent: 3 },
      { lineNumber: 12, code: '    return -1;', indent: 1 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++',
    lines: [
      { lineNumber: 1, code: 'int binarySearch(const vector<int>& arr, int target) {', indent: 0 },
      { lineNumber: 2, code: '    int left = 0;', indent: 1 },
      { lineNumber: 3, code: '    int right = arr.size() - 1;', indent: 1 },
      { lineNumber: 4, code: '    while (left <= right) {', indent: 1 },
      { lineNumber: 5, code: '        int mid = left + (right - left) / 2;', indent: 2 },
      { lineNumber: 6, code: '        if (arr[mid] == target) {', indent: 2 },
      { lineNumber: 7, code: '            return mid;', indent: 3 },
      { lineNumber: 8, code: '        } else if (arr[mid] < target) {', indent: 2 },
      { lineNumber: 9, code: '            left = mid + 1;', indent: 3 },
      { lineNumber: 10, code: '        } else {', indent: 2 },
      { lineNumber: 11, code: '            right = mid - 1;', indent: 3 },
      { lineNumber: 12, code: '    return -1;', indent: 1 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java',
    lines: [
      { lineNumber: 1, code: 'public static int binarySearch(int[] arr, int target) {', indent: 0 },
      { lineNumber: 2, code: '    int left = 0;', indent: 1 },
      { lineNumber: 3, code: '    int right = arr.length - 1;', indent: 1 },
      { lineNumber: 4, code: '    while (left <= right) {', indent: 1 },
      { lineNumber: 5, code: '        int mid = left + (right - left) / 2;', indent: 2 },
      { lineNumber: 6, code: '        if (arr[mid] == target) {', indent: 2 },
      { lineNumber: 7, code: '            return mid;', indent: 3 },
      { lineNumber: 8, code: '        } else if (arr[mid] < target) {', indent: 2 },
      { lineNumber: 9, code: '            left = mid + 1;', indent: 3 },
      { lineNumber: 10, code: '        } else {', indent: 2 },
      { lineNumber: 11, code: '            right = mid - 1;', indent: 3 },
      { lineNumber: 12, code: '    return -1;', indent: 1 },
    ],
  },
};

export interface BinarySearchPreset {
  id: string;
  category: 'found' | 'not-found' | 'special';
  label: string;
  description: string;
  array: number[];
  target: number;
}

export const BINARY_SEARCH_PRESETS: BinarySearchPreset[] = [
  {
    id: 'first-element',
    category: 'found',
    label: 'First Position',
    description: 'Target 5 located at index 0',
    array: [5, 12, 18, 25, 31, 43, 56, 72],
    target: 5,
  },
  {
    id: 'middle-element',
    category: 'found',
    label: 'Middle Position',
    description: 'Target 31 located near the center of the array',
    array: [5, 12, 18, 25, 31, 43, 56, 72],
    target: 31,
  },
  {
    id: 'last-element',
    category: 'found',
    label: 'Last Position',
    description: 'Target 72 located at index 7',
    array: [5, 12, 18, 25, 31, 43, 56, 72],
    target: 72,
  },
  {
    id: 'between-values',
    category: 'not-found',
    label: 'Between Values',
    description: 'Target 20 falls between elements 18 and 25',
    array: [3, 7, 12, 18, 25, 31, 42, 50],
    target: 20,
  },
  {
    id: 'smaller-than-min',
    category: 'not-found',
    label: 'Below Minimum',
    description: 'Target 2 is smaller than all array elements',
    array: [10, 20, 30, 40, 50, 60],
    target: 2,
  },
  {
    id: 'larger-than-max',
    category: 'not-found',
    label: 'Above Maximum',
    description: 'Target 99 is larger than all array elements',
    array: [10, 20, 30, 40, 50, 60],
    target: 99,
  },
  {
    id: 'duplicates',
    category: 'special',
    label: 'Duplicates',
    description: 'Target 12 with multiple occurrences',
    array: [2, 5, 5, 8, 12, 12, 18, 25],
    target: 12,
  },
  {
    id: 'negatives',
    category: 'special',
    label: 'Negative Numbers',
    description: 'Array containing negative and positive integers',
    array: [-25, -14, -8, -2, 0, 7, 15, 23],
    target: -8,
  },
  {
    id: 'single-found',
    category: 'special',
    label: 'Single Element (Found)',
    description: 'One element array with matching target',
    array: [42],
    target: 42,
  },
  {
    id: 'single-not-found',
    category: 'special',
    label: 'Single Element (Not Found)',
    description: 'One element array with non-matching target',
    array: [42],
    target: 20,
  },
];

/**
 * Generate visual states map for all array elements
 */
function buildVisualStates(
  arrayLength: number,
  low: number,
  high: number,
  mid: number | undefined,
  eliminatedIndices: Set<number>,
  foundIndex: number | undefined
): Record<number, ElementVisualState> {
  const visualStates: Record<number, ElementVisualState> = {};
  for (let i = 0; i < arrayLength; i++) {
    if (foundIndex !== undefined && i === foundIndex) {
      visualStates[i] = 'target-found';
    } else if (mid !== undefined && i === mid) {
      visualStates[i] = 'mid';
    } else if (eliminatedIndices.has(i) || i < low || i > high) {
      visualStates[i] = 'eliminated';
    } else if (i >= low && i <= high) {
      visualStates[i] = 'active-range';
    } else {
      visualStates[i] = 'inactive';
    }
  }
  return visualStates;
}

/**
 * Generate deterministic AlgorithmStep timeline for Binary Search
 */
export function generateBinarySearchSteps(inputArray: number[], target: number): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const array = [...inputArray];
  const n = array.length;
  const elementIds = array.map((_, i) => i);

  let comparisons = 0;
  let iterations = 0;

  // Handle empty array edge case
  if (n === 0) {
    steps.push({
      id: 0,
      stepIndex: 0,
      type: 'initial',
      array,
      elementIds,
      activeIndices: [],
      sortedIndices: [],
      visualStates: {},
      action: 'Empty Array',
      indicesLabel: '—',
      valuesLabel: '—',
      decisionLabel: 'Cannot search empty array',
      nextActionLabel: 'Please enter at least 1 element',
      pass: 0,
      totalPasses: 0,
      comparisonCount: 0,
      swapCount: 0,
      searchTarget: target,
      low: 0,
      high: -1,
      eliminatedIndices: [],
      remainingCandidates: 0,
      foundIndex: -1,
      binarySearchPhase: 'initialize',
      pseudocodeLine: 1,
      explanation: 'The search array is empty. Binary Search requires at least 1 element.',
    });

    steps.push({
      id: 1,
      stepIndex: 1,
      type: 'target-not-found',
      array,
      elementIds,
      activeIndices: [],
      sortedIndices: [],
      visualStates: {},
      action: 'Target Not Found',
      indicesLabel: '—',
      valuesLabel: '—',
      decisionLabel: 'Target not found in empty array',
      nextActionLabel: 'Search Complete',
      pass: 0,
      totalPasses: 0,
      comparisonCount: 0,
      swapCount: 0,
      searchTarget: target,
      low: 0,
      high: -1,
      eliminatedIndices: [],
      remainingCandidates: 0,
      foundIndex: -1,
      binarySearchPhase: 'complete',
      pseudocodeLine: 12,
      explanation: `Target ${target} was not found because the array is empty. Returns -1.`,
    });

    return steps;
  }

  const eliminatedSet = new Set<number>();
  let low = 0;
  let high = n - 1;

  // STEP 0: Initial Ready State
  steps.push({
    id: 0,
    stepIndex: 0,
    type: 'initial',
    array,
    elementIds,
    activeIndices: Array.from({ length: n }, (_, i) => i),
    sortedIndices: [],
    activeRange: [0, n - 1],
    visualStates: buildVisualStates(n, 0, n - 1, undefined, eliminatedSet, undefined),
    action: 'Ready',
    indicesLabel: `[0 — ${n - 1}]`,
    valuesLabel: `Target: ${target}`,
    decisionLabel: 'Pending start',
    nextActionLabel: 'Press PLAY or NEXT to begin',
    pass: 0,
    totalPasses: Math.max(1, Math.ceil(Math.log2(n + 1))),
    comparisonCount: 0,
    swapCount: 0,
    searchTarget: target,
    low: 0,
    high: n - 1,
    mid: undefined,
    midValue: undefined,
    eliminatedIndices: [],
    remainingCandidates: n,
    foundIndex: undefined,
    binarySearchPhase: 'initialize',
    previousLow: 0,
    previousHigh: n - 1,
    nextLow: 0,
    nextHigh: n - 1,
    pseudocodeLine: 0,
    explanation: 'Ready. Press PLAY or NEXT to begin.',
  });

  // Main Binary Search Loop
  while (low <= high) {
    iterations++;
    const currentLow = low;
    const currentHigh = high;
    const mid = currentLow + Math.floor((currentHigh - currentLow) / 2);
    const midValue = array[mid];

    // STAGE 2: CALCULATE MID
    steps.push({
      id: steps.length,
      stepIndex: steps.length,
      type: 'calculate-mid',
      array,
      elementIds,
      activeIndices: [mid],
      sortedIndices: [],
      activeRange: [currentLow, currentHigh],
      comparingIndex: mid,
      visualStates: buildVisualStates(n, currentLow, currentHigh, mid, eliminatedSet, undefined),
      action: 'Calculate Midpoint',
      indicesLabel: `mid = ${mid}`,
      valuesLabel: `arr[${mid}] = ${midValue}, Target = ${target}`,
      decisionLabel: 'Evaluate midpoint',
      nextActionLabel: `Compare arr[${mid}] (${midValue}) with target (${target})`,
      pass: iterations,
      totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
      comparisonCount: comparisons,
      swapCount: 0,
      searchTarget: target,
      low: currentLow,
      high: currentHigh,
      mid,
      midValue,
      eliminatedIndices: Array.from(eliminatedSet),
      remainingCandidates: currentHigh - currentLow + 1,
      foundIndex: undefined,
      binarySearchPhase: 'calculate-mid',
      previousLow: currentLow,
      previousHigh: currentHigh,
      nextLow: currentLow,
      nextHigh: currentHigh,
      pseudocodeLine: 5,
      explanation: `Calculate the midpoint: mid = ${currentLow} + (${currentHigh} - ${currentLow}) // 2 = ${mid}. The middle element is arr[${mid}] = ${midValue}.`,
    });

    // STAGE 3: COMPARE
    comparisons++;
    const isMatch = midValue === target;
    const isSmaller = target < midValue;

    steps.push({
      id: steps.length,
      stepIndex: steps.length,
      type: 'compare',
      array,
      elementIds,
      activeIndices: [mid],
      sortedIndices: isMatch ? [mid] : [],
      activeRange: [currentLow, currentHigh],
      comparingIndex: mid,
      visualStates: buildVisualStates(n, currentLow, currentHigh, mid, eliminatedSet, isMatch ? mid : undefined),
      action: 'Compare with Target',
      indicesLabel: `mid = ${mid}`,
      valuesLabel: `arr[${mid}] = ${midValue}, Target = ${target}`,
      decisionLabel: isMatch
        ? `${target} === ${midValue} → Target Found`
        : isSmaller
        ? `${target} < ${midValue}`
        : `${target} > ${midValue}`,
      nextActionLabel: isMatch
        ? 'Complete search'
        : isSmaller
        ? 'Decide to discard right half'
        : 'Decide to discard left half',
      pass: iterations,
      totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
      comparisonCount: comparisons,
      swapCount: 0,
      searchTarget: target,
      low: currentLow,
      high: currentHigh,
      mid,
      midValue,
      comparisonResult: isMatch ? 'equal' : isSmaller ? 'less' : 'greater',
      decision: isMatch ? 'Target Found' : isSmaller ? 'Target is smaller' : 'Target is greater',
      eliminatedIndices: Array.from(eliminatedSet),
      remainingCandidates: currentHigh - currentLow + 1,
      foundIndex: isMatch ? mid : undefined,
      binarySearchPhase: 'compare',
      previousLow: currentLow,
      previousHigh: currentHigh,
      nextLow: currentLow,
      nextHigh: currentHigh,
      pseudocodeLine: 6,
      explanation: isMatch
        ? `The middle element arr[${mid}] (${midValue}) matches the target ${target}.`
        : isSmaller
        ? `Target ${target} is less than middle element arr[${mid}] (${midValue}).`
        : `Target ${target} is greater than middle element arr[${mid}] (${midValue}).`,
    });

    // If Target is Found -> STAGE 6: COMPLETE
    if (isMatch) {
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'target-found',
        array,
        elementIds,
        activeIndices: [mid],
        sortedIndices: [mid],
        activeRange: [currentLow, currentHigh],
        visualStates: buildVisualStates(n, currentLow, currentHigh, mid, eliminatedSet, mid),
        action: 'Target Found',
        indicesLabel: `Index ${mid}`,
        valuesLabel: `arr[${mid}] = ${target}`,
        decisionLabel: `Target found at index ${mid}`,
        nextActionLabel: 'Execution Finished',
        pass: iterations,
        totalPasses: iterations,
        comparisonCount: comparisons,
        swapCount: 0,
        searchTarget: target,
        low: currentLow,
        high: currentHigh,
        mid,
        midValue,
        comparisonResult: 'equal',
        decision: 'Target Found',
        eliminatedIndices: Array.from(eliminatedSet),
        remainingCandidates: 1,
        foundIndex: mid,
        binarySearchPhase: 'complete',
        previousLow: currentLow,
        previousHigh: currentHigh,
        nextLow: currentLow,
        nextHigh: currentHigh,
        pseudocodeLine: 7,
        explanation: `Target ${target} successfully found at index ${mid} after ${comparisons} comparison(s). Returns index ${mid}.`,
      });

      return steps;
    }

    if (isSmaller) {
      // TARGET IS SMALLER -> STAGE 4: DECIDE (Discard right half)
      const nextHigh = mid - 1;

      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'decide',
        array,
        elementIds,
        activeIndices: [mid],
        sortedIndices: [],
        activeRange: [currentLow, currentHigh],
        comparingIndex: mid,
        visualStates: buildVisualStates(n, currentLow, currentHigh, mid, eliminatedSet, undefined),
        action: 'Decide Search Half',
        indicesLabel: `mid = ${mid}`,
        valuesLabel: `${target} < ${midValue}`,
        decisionLabel: 'Discard right half',
        nextActionLabel: `Eliminate indices [${mid} — ${currentHigh}] and update high = ${nextHigh}`,
        pass: iterations,
        totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
        comparisonCount: comparisons,
        swapCount: 0,
        searchTarget: target,
        low: currentLow,
        high: currentHigh,
        mid,
        midValue,
        comparisonResult: 'less',
        decision: 'Discard right half',
        eliminatedIndices: Array.from(eliminatedSet),
        eliminatedRange: [mid, currentHigh],
        remainingCandidates: currentHigh - currentLow + 1,
        foundIndex: undefined,
        binarySearchPhase: 'decide',
        previousLow: currentLow,
        previousHigh: currentHigh,
        nextLow: currentLow,
        nextHigh,
        pseudocodeLine: 10,
        explanation: `Target ${target} is smaller than arr[${mid}] (${midValue}). Because the array is sorted, values from index ${mid} to ${currentHigh} cannot contain the target. Discard right half.`,
      });

      // Mark right half as eliminated
      for (let k = mid; k <= currentHigh; k++) {
        eliminatedSet.add(k);
      }

      // STAGE 5: ELIMINATE
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'eliminate',
        array,
        elementIds,
        activeIndices: nextHigh >= currentLow ? [currentLow, nextHigh] : [],
        sortedIndices: [],
        activeRange: [currentLow, nextHigh],
        visualStates: buildVisualStates(n, currentLow, nextHigh, undefined, eliminatedSet, undefined),
        action: 'Eliminate Right Half',
        indicesLabel: `[${mid} — ${currentHigh}] eliminated`,
        valuesLabel: `New Range: [${currentLow} — ${nextHigh}]`,
        decisionLabel: nextHigh >= currentLow ? `high = mid - 1 (${nextHigh})` : 'Search interval exhausted',
        nextActionLabel: nextHigh >= currentLow ? 'Calculate next midpoint' : 'Conclude target not found',
        pass: iterations,
        totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
        comparisonCount: comparisons,
        swapCount: 0,
        searchTarget: target,
        low: currentLow,
        high: nextHigh,
        mid: undefined,
        midValue: undefined,
        comparisonResult: 'less',
        decision: 'Discard right half',
        eliminatedIndices: Array.from(eliminatedSet),
        eliminatedRange: [mid, currentHigh],
        remainingCandidates: Math.max(0, nextHigh - currentLow + 1),
        foundIndex: undefined,
        binarySearchPhase: 'eliminate',
        previousLow: currentLow,
        previousHigh: currentHigh,
        nextLow: currentLow,
        nextHigh,
        pseudocodeLine: 11,
        explanation: `Eliminated ${currentHigh - mid + 1} elements (indices ${mid} to ${currentHigh}). Search range narrowed to [${currentLow} — ${nextHigh}] with ${Math.max(0, nextHigh - currentLow + 1)} candidate(s) remaining.`,
      });

      high = nextHigh;
    } else {
      // TARGET IS GREATER -> STAGE 4: DECIDE (Discard left half)
      const nextLow = mid + 1;

      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'decide',
        array,
        elementIds,
        activeIndices: [mid],
        sortedIndices: [],
        activeRange: [currentLow, currentHigh],
        comparingIndex: mid,
        visualStates: buildVisualStates(n, currentLow, currentHigh, mid, eliminatedSet, undefined),
        action: 'Decide Search Half',
        indicesLabel: `mid = ${mid}`,
        valuesLabel: `${target} > ${midValue}`,
        decisionLabel: 'Discard left half',
        nextActionLabel: `Eliminate indices [${currentLow} — ${mid}] and update low = ${nextLow}`,
        pass: iterations,
        totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
        comparisonCount: comparisons,
        swapCount: 0,
        searchTarget: target,
        low: currentLow,
        high: currentHigh,
        mid,
        midValue,
        comparisonResult: 'greater',
        decision: 'Discard left half',
        eliminatedIndices: Array.from(eliminatedSet),
        eliminatedRange: [currentLow, mid],
        remainingCandidates: currentHigh - currentLow + 1,
        foundIndex: undefined,
        binarySearchPhase: 'decide',
        previousLow: currentLow,
        previousHigh: currentHigh,
        nextLow,
        nextHigh: currentHigh,
        pseudocodeLine: 8,
        explanation: `Target ${target} is greater than arr[${mid}] (${midValue}). Because the array is sorted, values from index ${currentLow} to ${mid} cannot contain the target. Discard left half.`,
      });

      // Mark left half as eliminated
      for (let k = currentLow; k <= mid; k++) {
        eliminatedSet.add(k);
      }

      // STAGE 5: ELIMINATE
      steps.push({
        id: steps.length,
        stepIndex: steps.length,
        type: 'eliminate',
        array,
        elementIds,
        activeIndices: currentHigh >= nextLow ? [nextLow, currentHigh] : [],
        sortedIndices: [],
        activeRange: [nextLow, currentHigh],
        visualStates: buildVisualStates(n, nextLow, currentHigh, undefined, eliminatedSet, undefined),
        action: 'Eliminate Left Half',
        indicesLabel: `[${currentLow} — ${mid}] eliminated`,
        valuesLabel: `New Range: [${nextLow} — ${currentHigh}]`,
        decisionLabel: currentHigh >= nextLow ? `low = mid + 1 (${nextLow})` : 'Search interval exhausted',
        nextActionLabel: currentHigh >= nextLow ? 'Calculate next midpoint' : 'Conclude target not found',
        pass: iterations,
        totalPasses: Math.max(iterations, Math.ceil(Math.log2(n + 1))),
        comparisonCount: comparisons,
        swapCount: 0,
        searchTarget: target,
        low: nextLow,
        high: currentHigh,
        mid: undefined,
        midValue: undefined,
        comparisonResult: 'greater',
        decision: 'Discard left half',
        eliminatedIndices: Array.from(eliminatedSet),
        eliminatedRange: [currentLow, mid],
        remainingCandidates: Math.max(0, currentHigh - nextLow + 1),
        foundIndex: undefined,
        binarySearchPhase: 'eliminate',
        previousLow: currentLow,
        previousHigh: currentHigh,
        nextLow,
        nextHigh: currentHigh,
        pseudocodeLine: 9,
        explanation: `Eliminated ${mid - currentLow + 1} elements (indices ${currentLow} to ${mid}). Search range narrowed to [${nextLow} — ${currentHigh}] with ${Math.max(0, currentHigh - nextLow + 1)} candidate(s) remaining.`,
      });

      low = nextLow;
    }
  }

  // STAGE 6: COMPLETE (TARGET NOT FOUND)
  steps.push({
    id: steps.length,
    stepIndex: steps.length,
    type: 'target-not-found',
    array,
    elementIds,
    activeIndices: [],
    sortedIndices: [],
    visualStates: buildVisualStates(n, low, high, undefined, eliminatedSet, undefined),
    action: 'Target Not Found',
    indicesLabel: `low = ${low}, high = ${high}`,
    valuesLabel: 'Search range empty',
    decisionLabel: 'low > high → Target absent',
    nextActionLabel: 'Search Complete (Returns -1)',
    pass: iterations,
    totalPasses: iterations,
    comparisonCount: comparisons,
    swapCount: 0,
    searchTarget: target,
    low,
    high,
    mid: undefined,
    midValue: undefined,
    comparisonResult: undefined,
    decision: 'Target Not Found',
    eliminatedIndices: Array.from(eliminatedSet),
    remainingCandidates: 0,
    foundIndex: -1,
    binarySearchPhase: 'complete',
    previousLow: low,
    previousHigh: high,
    nextLow: low,
    nextHigh: high,
    pseudocodeLine: 12,
    explanation: `The search range is exhausted (${low} > ${high}). Target ${target} is not present in the array. Returns -1.`,
  });

  return steps;
}
