import type { AlgorithmMetadata, AlgorithmStep, PseudocodeDefinition, SupportedLanguage } from '../types';

export const bubbleSortMetadata: AlgorithmMetadata = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  description: 'Repeatedly compares adjacent elements and swaps them if they are in the wrong order.',
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
};

export const bubbleSortPseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python',
    lines: [
      { lineNumber: 1, code: 'for i in range(n - 1):', indent: 0 },
      { lineNumber: 2, code: '    for j in range(n - i - 1):', indent: 1 },
      { lineNumber: 3, code: '        if arr[j] > arr[j + 1]:', indent: 2 },
      { lineNumber: 4, code: '            arr[j], arr[j + 1] = arr[j + 1], arr[j]', indent: 3 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript',
    lines: [
      { lineNumber: 1, code: 'for (let i = 0; i < n - 1; i++) {', indent: 0 },
      { lineNumber: 2, code: '    for (let j = 0; j < n - i - 1; j++) {', indent: 1 },
      { lineNumber: 3, code: '        if (arr[j] > arr[j + 1]) {', indent: 2 },
      { lineNumber: 4, code: '            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];', indent: 3 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++',
    lines: [
      { lineNumber: 1, code: 'for (int i = 0; i < n - 1; i++) {', indent: 0 },
      { lineNumber: 2, code: '    for (int j = 0; j < n - i - 1; j++) {', indent: 1 },
      { lineNumber: 3, code: '        if (arr[j] > arr[j + 1]) {', indent: 2 },
      { lineNumber: 4, code: '            std::swap(arr[j], arr[j + 1]);', indent: 3 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java',
    lines: [
      { lineNumber: 1, code: 'for (int i = 0; i < n - 1; i++) {', indent: 0 },
      { lineNumber: 2, code: '    for (int j = 0; j < n - i - 1; j++) {', indent: 1 },
      { lineNumber: 3, code: '        if (arr[j] > arr[j + 1]) {', indent: 2 },
      { lineNumber: 4, code: '            int temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;', indent: 3 },
    ],
  },
};

/**
 * Deterministically generates all execution steps for Bubble Sort on any input array.
 * Pure algorithm logic with ZERO React UI coupling.
 */
export function generateBubbleSortSteps(initialArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const arr = [...initialArray];
  const elementIds = initialArray.map((_, i) => i);
  const n = arr.length;
  let stepId = 0;
  let comparisonCount = 0;
  let swapCount = 0;
  const sortedIndices: number[] = [];

  // Step 0: Initial state
  steps.push({
    id: stepId++,
    type: 'initial',
    array: [...arr],
    elementIds: [...elementIds],
    activeIndices: [],
    sortedIndices: n <= 1 ? Array.from({ length: n }, (_, i) => i) : [],
    action: 'Ready',
    indicesLabel: 'None',
    valuesLabel: 'Initial array state',
    decisionLabel: 'Pending start',
    nextActionLabel: 'Press PLAY or NEXT to begin',
    pass: 0,
    totalPasses: Math.max(1, n - 1),
    comparisonCount: 0,
    swapCount: 0,
    pseudocodeLine: 0,
    explanation:
      n <= 1
        ? 'The array is already sorted since it contains 1 or fewer elements.'
        : 'Ready. Press PLAY or NEXT to begin.',
  });

  if (n <= 1) {
    steps.push({
      id: stepId++,
      type: 'complete',
      array: [...arr],
      elementIds: [...elementIds],
      activeIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      action: 'Sorted',
      indicesLabel: n === 1 ? 'Index 0' : 'Empty',
      valuesLabel: n === 1 ? `Value: ${arr[0]}` : 'No elements',
      decisionLabel: 'Array fully sorted',
      nextActionLabel: 'Visualization complete',
      pass: 1,
      totalPasses: 1,
      comparisonCount: 0,
      swapCount: 0,
      pseudocodeLine: 1,
      explanation:
        n === 1
          ? 'A single-element array is trivially sorted with 0 comparisons and 0 swaps required.'
          : 'An empty array is trivially sorted.',
    });
    return steps;
  }

  const totalPasses = n - 1;
  let actualPasses = 0;

  for (let i = 0; i < n - 1; i++) {
    const currentPass = i + 1;
    actualPasses = currentPass;
    let swappedInThisPass = false;
    const comparisonsInPass = n - i - 1;

    // Start Pass step: highlights outer loop (for i in range(n - 1))
    steps.push({
      id: stepId++,
      type: 'initial',
      array: [...arr],
      elementIds: [...elementIds],
      activeIndices: [0, 1],
      sortedIndices: [...sortedIndices],
      action: 'Start Pass',
      indicesLabel: `Pass ${currentPass} of ${totalPasses}`,
      valuesLabel: `Unsorted range: [0 ... ${n - 1 - i}]`,
      decisionLabel: `Initialize Pass ${currentPass}`,
      nextActionLabel: `Compare adjacent elements at index 0 and 1`,
      pass: currentPass,
      totalPasses,
      comparisonInPass: 0,
      totalComparisonsInPass: comparisonsInPass,
      comparisonCount,
      swapCount,
      pseudocodeLine: 1,
      explanation: `Starting Pass ${currentPass} of ${totalPasses}. Bubble Sort will iterate through unsorted elements (indices 0 to ${n - 1 - i}) and compare adjacent pairs.`,
    });

    for (let j = 0; j < n - i - 1; j++) {
      const comparisonInPass = j + 1;
      comparisonCount++;
      const valA = arr[j];
      const valB = arr[j + 1];
      const needsSwap = valA > valB;

      // 1. Compare Step
      steps.push({
        id: stepId++,
        type: 'compare',
        array: [...arr],
        elementIds: [...elementIds],
        activeIndices: [j, j + 1],
        comparingIndex: j,
        swappingIndex: needsSwap ? j + 1 : undefined,
        sortedIndices: [...sortedIndices],
        action: 'Compare',
        indicesLabel: `${j} and ${j + 1}`,
        valuesLabel: `A[${j}] = ${valA}, A[${j + 1}] = ${valB}`,
        decisionLabel: `${valA} > ${valB} (${needsSwap ? 'True' : 'False'})`,
        nextActionLabel: needsSwap ? 'Swap elements' : 'Advance to next pair',
        pass: currentPass,
        totalPasses,
        comparisonInPass,
        totalComparisonsInPass: comparisonsInPass,
        comparisonCount,
        swapCount,
        pseudocodeLine: 3,
        explanation: needsSwap
          ? `Bubble Sort compares adjacent elements. Since ${valA} is greater than ${valB}, they are out of order and must be swapped.`
          : `Bubble Sort compares adjacent elements. Since ${valA} is less than or equal to ${valB}, they are already in correct relative order; no swap needed.`,
      });

      // 2. Action Step (Swap)
      if (needsSwap) {
        swapCount++;
        swappedInThisPass = true;
        // Perform swap of values and persistent element IDs
        arr[j] = valB;
        arr[j + 1] = valA;
        const tempId = elementIds[j];
        elementIds[j] = elementIds[j + 1];
        elementIds[j + 1] = tempId;

        steps.push({
          id: stepId++,
          type: 'swap',
          array: [...arr],
          elementIds: [...elementIds],
          activeIndices: [j, j + 1],
          comparingIndex: j,
          swappingIndex: j + 1,
          sortedIndices: [...sortedIndices],
          action: 'Swap',
          indicesLabel: `${j} and ${j + 1}`,
          valuesLabel: `A[${j}] = ${valB}, A[${j + 1}] = ${valA}`,
          decisionLabel: `Swapped (${valA} ↔ ${valB})`,
          nextActionLabel:
            j + 1 < n - i - 1 ? `Compare next pair (indices ${j + 1} and ${j + 2})` : 'Finalize current pass',
          pass: currentPass,
          totalPasses,
          comparisonInPass,
          totalComparisonsInPass: comparisonsInPass,
          comparisonCount,
          swapCount,
          pseudocodeLine: 4,
          explanation: `Swapped elements at index ${j} and ${j + 1}. The larger value (${valA}) moves forward towards its sorted position.`,
        });
      }
    }

    // End of pass: the element at n - 1 - i is guaranteed in its final sorted position
    const settledIndex = n - 1 - i;
    sortedIndices.push(settledIndex);

    steps.push({
      id: stepId++,
      type: 'pass-complete',
      array: [...arr],
      elementIds: [...elementIds],
      activeIndices: [settledIndex],
      sortedIndices: [...sortedIndices],
      action: 'Pass Complete',
      indicesLabel: `Index ${settledIndex}`,
      valuesLabel: `A[${settledIndex}] = ${arr[settledIndex]}`,
      decisionLabel: `Pass ${currentPass} finished`,
      nextActionLabel:
        currentPass < totalPasses && swappedInThisPass
          ? `Begin Pass ${currentPass + 1}`
          : 'Finalize sorting',
      pass: currentPass,
      totalPasses,
      comparisonCount,
      swapCount,
      pseudocodeLine: 1,
      explanation: `Pass ${currentPass} complete — the largest remaining unsorted value (${arr[settledIndex]}) has bubbled into its final position at index ${settledIndex}.`,
    });

    // Optimization: If no swaps occurred in this entire pass, the array is already completely sorted
    if (!swappedInThisPass) {
      break;
    }
  }

  // All remaining elements are sorted
  const allIndices = Array.from({ length: n }, (_, i) => i);

  steps.push({
    id: stepId++,
    type: 'complete',
    array: [...arr],
    elementIds: [...elementIds],
    activeIndices: [],
    sortedIndices: allIndices,
    action: 'Sorted',
    indicesLabel: 'All indices (0 to ' + (n - 1) + ')',
    valuesLabel: 'Entire array verified',
    decisionLabel: 'Array fully sorted',
    nextActionLabel: 'Visualization complete',
    pass: actualPasses,
    totalPasses: actualPasses,
    comparisonCount,
    swapCount,
    pseudocodeLine: 1,
    explanation: `Bubble Sort has completed. The array is now fully sorted in ascending order with 0 inversions remaining across ${comparisonCount} comparisons and ${swapCount} swaps.`,
  });

  return steps;
}
