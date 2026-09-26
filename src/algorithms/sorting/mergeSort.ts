import type {
  AlgorithmMetadata,
  AlgorithmStep,
  MergeTreeNode,
  MergeNodeStatus,
  PseudocodeDefinition,
  SupportedLanguage,
} from '../types';

export const mergeSortMetadata: AlgorithmMetadata = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  description: 'Divides the array into halves, recursively sorts them, and merges the sorted halves.',
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false,
};

export const mergeSortPseudocode: Record<SupportedLanguage, PseudocodeDefinition> = {
  python: {
    language: 'python',
    displayName: 'Python',
    lines: [
      { lineNumber: 1, code: 'def merge_sort(arr, left, right):', indent: 0 },
      { lineNumber: 2, code: '    if left >= right: return', indent: 1 },
      { lineNumber: 3, code: '    mid = (left + right) // 2', indent: 1 },
      { lineNumber: 4, code: '    merge_sort(arr, left, mid)', indent: 1 },
      { lineNumber: 5, code: '    merge_sort(arr, mid + 1, right)', indent: 1 },
      { lineNumber: 6, code: '    merge(arr, left, mid, right):', indent: 1 },
      { lineNumber: 7, code: '        if left_sub[i] <= right_sub[j]:', indent: 2 },
      { lineNumber: 8, code: '            val = left_sub[i]; i += 1', indent: 3 },
      { lineNumber: 9, code: '        else: val = right_sub[j]; j += 1', indent: 2 },
      { lineNumber: 10, code: '        output[k] = val; k += 1', indent: 2 },
      { lineNumber: 11, code: '        copy_remaining(left_sub, right_sub, output)', indent: 2 },
    ],
  },
  javascript: {
    language: 'javascript',
    displayName: 'JavaScript',
    lines: [
      { lineNumber: 1, code: 'function mergeSort(arr, left, right) {', indent: 0 },
      { lineNumber: 2, code: '    if (left >= right) return;', indent: 1 },
      { lineNumber: 3, code: '    const mid = Math.floor((left + right) / 2);', indent: 1 },
      { lineNumber: 4, code: '    mergeSort(arr, left, mid);', indent: 1 },
      { lineNumber: 5, code: '    mergeSort(arr, mid + 1, right);', indent: 1 },
      { lineNumber: 6, code: '    merge(arr, left, mid, right):', indent: 1 },
      { lineNumber: 7, code: '        if (leftSub[i] <= rightSub[j]) {', indent: 2 },
      { lineNumber: 8, code: '            val = leftSub[i]; i++;', indent: 3 },
      { lineNumber: 9, code: '        } else { val = rightSub[j]; j++; }', indent: 2 },
      { lineNumber: 10, code: '        output[k] = val; k++;', indent: 2 },
      { lineNumber: 11, code: '        copyRemaining(leftSub, rightSub, output);', indent: 2 },
    ],
  },
  cpp: {
    language: 'cpp',
    displayName: 'C++',
    lines: [
      { lineNumber: 1, code: 'void mergeSort(vector<int>& arr, int left, int right) {', indent: 0 },
      { lineNumber: 2, code: '    if (left >= right) return;', indent: 1 },
      { lineNumber: 3, code: '    int mid = left + (right - left) / 2;', indent: 1 },
      { lineNumber: 4, code: '    mergeSort(arr, left, mid);', indent: 1 },
      { lineNumber: 5, code: '    mergeSort(arr, mid + 1, right);', indent: 1 },
      { lineNumber: 6, code: '    merge(arr, left, mid, right):', indent: 1 },
      { lineNumber: 7, code: '        if (leftSub[i] <= rightSub[j]) {', indent: 2 },
      { lineNumber: 8, code: '            val = leftSub[i]; i++;', indent: 3 },
      { lineNumber: 9, code: '        } else { val = rightSub[j]; j++; }', indent: 2 },
      { lineNumber: 10, code: '        output[k] = val; k++;', indent: 2 },
      { lineNumber: 11, code: '        copyRemaining(leftSub, rightSub, output);', indent: 2 },
    ],
  },
  java: {
    language: 'java',
    displayName: 'Java',
    lines: [
      { lineNumber: 1, code: 'void mergeSort(int[] arr, int left, int right) {', indent: 0 },
      { lineNumber: 2, code: '    if (left >= right) return;', indent: 1 },
      { lineNumber: 3, code: '    int mid = (left + right) / 2;', indent: 1 },
      { lineNumber: 4, code: '    mergeSort(arr, left, mid);', indent: 1 },
      { lineNumber: 5, code: '    mergeSort(arr, mid + 1, right);', indent: 1 },
      { lineNumber: 6, code: '    merge(arr, left, mid, right):', indent: 1 },
      { lineNumber: 7, code: '        if (leftSub[i] <= rightSub[j]) {', indent: 2 },
      { lineNumber: 8, code: '            val = leftSub[i]; i++;', indent: 3 },
      { lineNumber: 9, code: '        } else { val = rightSub[j]; j++; }', indent: 2 },
      { lineNumber: 10, code: '        output[k] = val; k++;', indent: 2 },
      { lineNumber: 11, code: '        copyRemaining(leftSub, rightSub, output);', indent: 2 },
    ],
  },
};

/**
 * Pre-builds static tree hierarchy of ranges for Merge Sort visualization.
 */
function buildTreeStructure(arr: number[]): MergeTreeNode[] {
  const nodes: MergeTreeNode[] = [];

  function helper(left: number, right: number, level: number, parentId?: string): string {
    const id = `${left}-${right}-L${level}`;
    const values = arr.slice(left, right + 1);

    nodes.push({
      id,
      left,
      right,
      level,
      values,
      status: 'inactive',
      parentId,
    });

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      helper(left, mid, level + 1, id);
      helper(mid + 1, right, level + 1, id);
    }

    return id;
  }

  if (arr.length > 0) {
    helper(0, arr.length - 1, 0);
  }

  return nodes;
}

/**
 * Generates pure, deterministic execution timeline for Top-Down Recursive Merge Sort.
 * Follows real depth-first execution order.
 */
export function generateMergeSortSteps(initialArray: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const n = initialArray.length;
  const arr = [...initialArray];
  const elementIds = initialArray.map((_, i) => i);

  let stepId = 0;
  let comparisonCount = 0;
  let mergeCount = 0;
  let arrayWrites = 0;

  // Initialize tree hierarchy
  const staticTree = buildTreeStructure(initialArray);
  const maxRecursionDepth = staticTree.length > 0 ? Math.max(...staticTree.map((n) => n.level)) : 0;

  // Pre-calculate total merge operations for n elements
  // In a full binary recursion tree, total merges = n - 1 (or 0 if n <= 1)
  const totalMerges = Math.max(0, n - 1);
  const nodeStatusMap = new Map<string, { status: MergeNodeStatus; values: number[] }>();

  staticTree.forEach((node) => {
    nodeStatusMap.set(node.id, {
      status: 'inactive',
      values: [...node.values],
    });
  });

  const getTreeSnapshot = (): MergeTreeNode[] => {
    return staticTree.map((node) => {
      const live = nodeStatusMap.get(node.id);
      return {
        ...node,
        status: live ? live.status : node.status,
        values: live ? [...live.values] : [...node.values],
      };
    });
  };

  // Helper to push step
  const pushStep = (params: {
    type: AlgorithmStep['type'];
    phase: AlgorithmStep['phase'];
    action: string;
    indicesLabel: string;
    valuesLabel: string;
    decisionLabel: string;
    nextActionLabel: string;
    pseudocodeLine: number;
    explanation: string;
    activeIndices?: number[];
    sortedIndices?: number[];
    mergeRange?: [number, number];
    leftRange?: [number, number];
    rightRange?: [number, number];
    mid?: number;
    leftPointer?: number;
    rightPointer?: number;
    outputPointer?: number;
    leftValue?: number;
    rightValue?: number;
    chosenValue?: number;
    chosenFrom?: 'left' | 'right';
    recursionLevel?: number;
    leftSubarray?: number[];
    rightSubarray?: number[];
    mergedOutput?: (number | null)[];
    visualStates?: AlgorithmStep['visualStates'];
  }) => {
    steps.push({
      id: stepId++,
      type: params.type,
      array: [...arr],
      elementIds: [...elementIds],
      activeIndices: params.activeIndices || [],
      sortedIndices: params.sortedIndices || [],
      visualStates: params.visualStates,
      action: params.action,
      indicesLabel: params.indicesLabel,
      valuesLabel: params.valuesLabel,
      decisionLabel: params.decisionLabel,
      nextActionLabel: params.nextActionLabel,
      pass: mergeCount,
      totalPasses: totalMerges,
      comparisonCount,
      swapCount: arrayWrites, // Map array writes for generic stats
      mergeRange: params.mergeRange,
      leftRange: params.leftRange,
      rightRange: params.rightRange,
      mid: params.mid,
      leftPointer: params.leftPointer,
      rightPointer: params.rightPointer,
      outputPointer: params.outputPointer,
      leftValue: params.leftValue,
      rightValue: params.rightValue,
      chosenValue: params.chosenValue,
      chosenFrom: params.chosenFrom,
      recursionLevel: params.recursionLevel || 0,
      maxRecursionDepth,
      mergeCount,
      totalMerges,
      arrayWrites,
      leftSubarray: params.leftSubarray ? [...params.leftSubarray] : undefined,
      rightSubarray: params.rightSubarray ? [...params.rightSubarray] : undefined,
      mergedOutput: params.mergedOutput ? [...params.mergedOutput] : undefined,
      treeNodes: getTreeSnapshot(),
      phase: params.phase,
      pseudocodeLine: params.pseudocodeLine,
      explanation: params.explanation,
    });
  };

  // Step 0: Ready / Initial state
  pushStep({
    type: 'initial',
    phase: 'divide',
    action: 'Ready',
    indicesLabel: n > 0 ? `0 to ${n - 1}` : 'Empty',
    valuesLabel: 'Initial array state',
    decisionLabel: 'Pending start',
    nextActionLabel: n <= 1 ? 'Algorithm complete' : 'Press PLAY or NEXT to begin',
    pseudocodeLine: 0,
    mergeRange: n > 0 ? [0, n - 1] : undefined,
    explanation:
      n <= 1
        ? 'The array has 1 or fewer elements and is already sorted.'
        : 'Ready. Press PLAY or NEXT to begin.',
  });

  if (n <= 1) {
    if (n === 1) {
      const rootNode = nodeStatusMap.get(`0-0-L0`);
      if (rootNode) rootNode.status = 'merged';
    }

    pushStep({
      type: 'complete',
      phase: 'complete',
      action: 'Sorting Complete',
      indicesLabel: n > 0 ? `[0 to ${n - 1}]` : 'Empty',
      valuesLabel: 'Entire array sorted',
      decisionLabel: 'Array fully sorted',
      nextActionLabel: 'Visualization complete',
      pseudocodeLine: 1,
      sortedIndices: n === 1 ? [0] : [],
      explanation: 'Merge Sort complete. Array contains 1 or fewer elements and is already sorted.',
    });

    return steps;
  }

  // Set root node to active
  const rootNode = nodeStatusMap.get(`0-${n - 1}-L0`);
  if (rootNode) rootNode.status = 'active';

  // Recursive Merge Sort Function
  function recursiveMergeSort(left: number, right: number, level: number) {
    const nodeId = `${left}-${right}-L${level}`;
    const currNode = nodeStatusMap.get(nodeId);

    // 1. Base Case Check
    if (left >= right) {
      if (currNode) currNode.status = 'base-case';

      pushStep({
        type: 'base-case',
        phase: 'base-case',
        action: 'Base Case',
        indicesLabel: `Index ${left}`,
        valuesLabel: `A[${left}] = ${arr[left]}`,
        decisionLabel: `left (${left}) >= right (${right})`,
        nextActionLabel: 'Return from recursion (single element is sorted)',
        pseudocodeLine: 2,
        activeIndices: [left],
        mergeRange: [left, right],
        recursionLevel: level,
        explanation: `Base case reached at range [${left}, ${right}]. A single element (${arr[left]}) is already trivially sorted, so recursion returns.`,
      });

      return;
    }

    // 2. Divide Phase
    const mid = Math.floor((left + right) / 2);
    if (currNode) currNode.status = 'dividing';

    const leftChildId = `${left}-${mid}-L${level + 1}`;
    const rightChildId = `${mid + 1}-${right}-L${level + 1}`;
    const leftChild = nodeStatusMap.get(leftChildId);
    const rightChild = nodeStatusMap.get(rightChildId);
    if (leftChild) leftChild.status = 'active';
    if (rightChild) rightChild.status = 'active';

    pushStep({
      type: 'divide',
      phase: 'divide',
      action: 'Divide Range',
      indicesLabel: `Range [${left} - ${right}]`,
      valuesLabel: `Midpoint at index ${mid}`,
      decisionLabel: `mid = floor((${left} + ${right}) / 2) = ${mid}`,
      nextActionLabel: `Recurse on left subarray [${left} - ${mid}]`,
      pseudocodeLine: 3,
      mergeRange: [left, right],
      leftRange: [left, mid],
      rightRange: [mid + 1, right],
      mid,
      activeIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      recursionLevel: level,
      explanation: `Dividing range [${left} - ${right}] at midpoint ${mid}. Left subarray is [${left} - ${mid}], Right subarray is [${mid + 1} - ${right}].`,
    });

    // 3. Recurse Left
    recursiveMergeSort(left, mid, level + 1);

    // 4. Recurse Right
    recursiveMergeSort(mid + 1, right, level + 1);

    // 5. Merge Phase
    merge(left, mid, right, level);
  }

  // Merge Procedure
  function merge(left: number, mid: number, right: number, level: number) {
    mergeCount++;
    const rangeLength = right - left + 1;
    const nodeId = `${left}-${right}-L${level}`;
    const currNode = nodeStatusMap.get(nodeId);
    if (currNode) currNode.status = 'merging';

    // Left and Right sorted copies
    const leftSub = arr.slice(left, mid + 1);
    const rightSub = arr.slice(mid + 1, right + 1);
    const mergedBuffer: (number | null)[] = new Array(rangeLength).fill(null);

    // Step: Merge Start
    pushStep({
      type: 'merge-start',
      phase: 'merge',
      action: 'Merge Start',
      indicesLabel: `Range [${left} - ${right}]`,
      valuesLabel: `Left: [${leftSub.join(', ')}], Right: [${rightSub.join(', ')}]`,
      decisionLabel: `Merge ${mergeCount} of ${totalMerges}`,
      nextActionLabel: 'Compare front elements',
      pseudocodeLine: 6,
      mergeRange: [left, right],
      leftRange: [left, mid],
      rightRange: [mid + 1, right],
      mid,
      leftPointer: 0,
      rightPointer: 0,
      outputPointer: 0,
      recursionLevel: level,
      leftSubarray: leftSub,
      rightSubarray: rightSub,
      mergedOutput: mergedBuffer,
      explanation: `Beginning merge operation ${mergeCount} of ${totalMerges} on range [${left} - ${right}]. Combining sorted left subarray [${leftSub.join(', ')}] and right subarray [${rightSub.join(', ')}].`,
    });

    let i = 0; // left pointer (local index in leftSub)
    let j = 0; // right pointer (local index in rightSub)
    let k = 0; // buffer write pointer (local index in mergedBuffer)

    while (i < leftSub.length && j < rightSub.length) {
      comparisonCount++;
      const valA = leftSub[i];
      const valB = rightSub[j];
      const isEqual = valA === valB;
      const takeLeft = valA <= valB; // STABILITY: <= ensures left is preferred on equal!

      // 1. Step: Compare Front Elements (Output buffer has NOT received chosen value yet!)
      pushStep({
        type: 'compare',
        phase: 'merge',
        action: 'Compare',
        indicesLabel: `A[${left + i}] vs A[${mid + 1 + j}]`,
        valuesLabel: `Left: ${valA}, Right: ${valB}`,
        decisionLabel: isEqual
          ? `${valA} == ${valB} (Equal)`
          : takeLeft
          ? `${valA} < ${valB} (True)`
          : `${valB} < ${valA} (True)`,
        nextActionLabel: takeLeft
          ? `Select ${valA} from left subarray`
          : `Select ${valB} from right subarray`,
        pseudocodeLine: 7,
        activeIndices: [left + i, mid + 1 + j],
        visualStates: {
          [left + i]: 'comparing',
          [mid + 1 + j]: 'comparing',
        },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: i,
        rightPointer: j,
        outputPointer: k,
        leftValue: valA,
        rightValue: valB,
        chosenValue: undefined, // Not chosen yet during comparison!
        chosenFrom: undefined,
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer,
        explanation: isEqual
          ? `Compare front elements: ${valA} (left, arr[${left + i}]) and ${valB} (right, arr[${mid + 1 + j}]). Since values are equal (${valA} == ${valB}), select ${valA} from left subarray to preserve stability.`
          : takeLeft
          ? `Compare front elements: ${valA} (left, arr[${left + i}]) and ${valB} (right, arr[${mid + 1 + j}]). Since ${valA} ≤ ${valB}, select ${valA} from left subarray.`
          : `Compare front elements: ${valA} (left, arr[${left + i}]) and ${valB} (right, arr[${mid + 1 + j}]). Since ${valB} < ${valA}, select ${valB} from right subarray.`,
      });

      const chosen = takeLeft ? valA : valB;

      // 2. Step: Take Left / Take Right (Element is selected, buffer still waiting for write!)
      pushStep({
        type: takeLeft ? 'take-left' : 'take-right',
        phase: 'merge',
        action: takeLeft ? 'Take Left' : 'Take Right',
        indicesLabel: takeLeft ? `A[${left + i}] = ${chosen}` : `A[${mid + 1 + j}] = ${chosen}`,
        valuesLabel: `Selected ${chosen} from ${takeLeft ? 'left' : 'right'}`,
        decisionLabel: isEqual
          ? `${valA} == ${valB} → Take Left (Stability)`
          : takeLeft
          ? `${valA} < ${valB} → Take Left`
          : `${valB} < ${valA} → Take Right`,
        nextActionLabel: `Write ${chosen} to output buffer slot ${k}`,
        pseudocodeLine: takeLeft ? 8 : 9,
        activeIndices: takeLeft ? [left + i] : [mid + 1 + j],
        visualStates: takeLeft ? { [left + i]: 'selected' } : { [mid + 1 + j]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: i,
        rightPointer: j,
        outputPointer: k,
        leftValue: valA,
        rightValue: valB,
        chosenValue: chosen,
        chosenFrom: takeLeft ? 'left' : 'right',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer, // Buffer is untouched before write!
        explanation: `${takeLeft ? `Left element ${valA} (arr[${left + i}])` : `Right element ${valB} (arr[${mid + 1 + j}])`} is smaller${
          isEqual ? ' (equal value: left chosen to preserve stability)' : ''
        }. Selected ${chosen} from ${takeLeft ? 'left' : 'right'} subarray. Next action is to write into output position k = ${k}.`,
      });

      // 3. Step: Write to Output Buffer and Advance Pointers
      arrayWrites++;
      mergedBuffer[k] = chosen;

      const nextI = takeLeft ? i + 1 : i;
      const nextJ = takeLeft ? j : j + 1;
      const nextK = k + 1;

      pushStep({
        type: 'write',
        phase: 'merge',
        action: 'Write to Buffer',
        indicesLabel: `output[${k}] = ${chosen}`,
        valuesLabel: `Written ${chosen}`,
        decisionLabel: `output[${k}] = ${chosen}`,
        nextActionLabel:
          nextK >= rangeLength
            ? 'Merge complete'
            : nextI < leftSub.length && nextJ < rightSub.length
            ? 'Compare next front elements'
            : nextI < leftSub.length
            ? 'Append remaining left elements'
            : 'Append remaining right elements',
        pseudocodeLine: 10,
        activeIndices: [left + k],
        visualStates: { [left + k]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: nextI,
        rightPointer: nextJ,
        outputPointer: nextK < rangeLength ? nextK : k,
        leftValue: valA,
        rightValue: valB,
        chosenValue: chosen,
        chosenFrom: takeLeft ? 'left' : 'right',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer, // Buffer NOW contains chosen!
        explanation: `Written ${chosen} into output buffer position k = ${k} (target arr[${left + k}]). ${
          takeLeft
            ? nextI >= leftSub.length
              ? `Left pointer advances (i: ${i} → exhausted).`
              : `Left pointer advances (i: ${i} → ${nextI}).`
            : nextJ >= rightSub.length
            ? `Right pointer advances (j: ${j} → exhausted).`
            : `Right pointer advances (j: ${j} → ${nextJ}).`
        } ${nextK >= rangeLength ? 'Merge buffer is full.' : `Output pointer advances to k = ${nextK}.`}`,
      });

      if (takeLeft) {
        i++;
      } else {
        j++;
      }
      k++;
    }

    // Append remaining from left subarray
    while (i < leftSub.length) {
      const val = leftSub[i];

      // 1. Select remaining
      pushStep({
        type: 'append-left',
        phase: 'merge',
        action: 'Append Left',
        indicesLabel: `A[${left + i}] = ${val}`,
        valuesLabel: `Remaining left: ${val}`,
        decisionLabel: 'Right subarray exhausted → Copy left',
        nextActionLabel: `Write ${val} to output buffer slot ${k}`,
        pseudocodeLine: 11,
        activeIndices: [left + i],
        visualStates: { [left + i]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: i,
        rightPointer: j,
        outputPointer: k,
        chosenValue: val,
        chosenFrom: 'left',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer,
        explanation: `Right subarray is exhausted. Taking remaining element ${val} from left subarray (arr[${left + i}]) to copy directly into output position k = ${k} without comparison.`,
      });

      // 2. Write
      arrayWrites++;
      mergedBuffer[k] = val;
      const nextI = i + 1;
      const nextK = k + 1;

      pushStep({
        type: 'write',
        phase: 'merge',
        action: 'Write to Buffer',
        indicesLabel: `output[${k}] = ${val}`,
        valuesLabel: `Written ${val}`,
        decisionLabel: `output[${k}] = ${val}`,
        nextActionLabel: nextK >= rangeLength ? 'Merge complete' : 'Append next remaining element',
        pseudocodeLine: 10,
        activeIndices: [left + k],
        visualStates: { [left + k]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: nextI,
        rightPointer: j,
        outputPointer: nextK < rangeLength ? nextK : k,
        chosenValue: val,
        chosenFrom: 'left',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer,
        explanation: `Written remaining element ${val} into output buffer position k = ${k} (target arr[${left + k}]). ${
          nextI >= leftSub.length
            ? `Left pointer advances (i: ${i} → exhausted).`
            : `Left pointer advances (i: ${i} → ${nextI}).`
        } ${nextK >= rangeLength ? 'Merge buffer is full.' : `Output pointer advances to k = ${nextK}.`}`,
      });

      i++;
      k++;
    }

    // Append remaining from right subarray
    while (j < rightSub.length) {
      const val = rightSub[j];

      // 1. Select remaining
      pushStep({
        type: 'append-right',
        phase: 'merge',
        action: 'Append Right',
        indicesLabel: `A[${mid + 1 + j}] = ${val}`,
        valuesLabel: `Remaining right: ${val}`,
        decisionLabel: 'Left subarray exhausted → Copy right',
        nextActionLabel: `Write ${val} to output buffer slot ${k}`,
        pseudocodeLine: 11,
        activeIndices: [mid + 1 + j],
        visualStates: { [mid + 1 + j]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: i,
        rightPointer: j,
        outputPointer: k,
        chosenValue: val,
        chosenFrom: 'right',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer,
        explanation: `Left subarray is exhausted. Taking remaining element ${val} from right subarray (arr[${mid + 1 + j}]) to copy directly into output position k = ${k} without comparison.`,
      });

      // 2. Write
      arrayWrites++;
      mergedBuffer[k] = val;
      const nextJ = j + 1;
      const nextK = k + 1;

      pushStep({
        type: 'write',
        phase: 'merge',
        action: 'Write to Buffer',
        indicesLabel: `output[${k}] = ${val}`,
        valuesLabel: `Written ${val}`,
        decisionLabel: `output[${k}] = ${val}`,
        nextActionLabel: nextJ >= rightSub.length || nextK >= rangeLength ? 'Merge complete' : 'Append next remaining element',
        pseudocodeLine: 10,
        activeIndices: [left + k],
        visualStates: { [left + k]: 'selected' },
        mergeRange: [left, right],
        leftRange: [left, mid],
        rightRange: [mid + 1, right],
        mid,
        leftPointer: i,
        rightPointer: nextJ,
        outputPointer: nextK < rangeLength ? nextK : k,
        chosenValue: val,
        chosenFrom: 'right',
        recursionLevel: level,
        leftSubarray: leftSub,
        rightSubarray: rightSub,
        mergedOutput: mergedBuffer,
        explanation: `Written remaining element ${val} into output buffer position k = ${k} (target arr[${left + k}]). ${
          nextJ >= rightSub.length
            ? `Right pointer advances (j: ${j} → exhausted).`
            : `Right pointer advances (j: ${j} → ${nextJ}).`
        } ${nextK >= rangeLength ? 'Merge buffer is full.' : `Output pointer advances to k = ${nextK}.`}`,
      });

      j++;
      k++;
    }

    // Commit merged buffer back into the primary array arr
    for (let idx = 0; idx < rangeLength; idx++) {
      arr[left + idx] = mergedBuffer[idx] as number;
    }

    // Update node status in tree
    if (currNode) {
      currNode.status = 'merged';
      currNode.values = mergedBuffer as number[];
    }

    const mergedIndices = Array.from({ length: rangeLength }, (_, idx) => left + idx);

    pushStep({
      type: 'merge-complete',
      phase: 'merge',
      action: 'Merge Complete',
      indicesLabel: `Range [${left} - ${right}]`,
      valuesLabel: `Merged: [${mergedBuffer.join(', ')}]`,
      decisionLabel: `Merge ${mergeCount} finished`,
      nextActionLabel: mergeCount < totalMerges ? 'Return to parent caller' : 'Finalize sort',
      pseudocodeLine: 6,
      activeIndices: mergedIndices,
      sortedIndices: mergedIndices,
      mergeRange: [left, right],
      leftRange: [left, mid],
      rightRange: [mid + 1, right],
      mid,
      outputPointer: rangeLength - 1,
      recursionLevel: level,
      leftSubarray: leftSub,
      rightSubarray: rightSub,
      mergedOutput: mergedBuffer,
      explanation: `Merge complete for range [${left} - ${right}]. Subarrays successfully merged into sorted order: [${mergedBuffer.join(', ')}].`,
    });
  }

  // Execute Recursive Algorithm
  recursiveMergeSort(0, n - 1, 0);

  // Mark all tree nodes as merged on complete
  staticTree.forEach((node) => {
    const live = nodeStatusMap.get(node.id);
    if (live) live.status = 'merged';
  });

  const allIndices = Array.from({ length: n }, (_, i) => i);

  pushStep({
    type: 'complete',
    phase: 'complete',
    action: 'Sorting Complete',
    indicesLabel: `All indices (0 to ${n - 1})`,
    valuesLabel: 'Entire array sorted',
    decisionLabel: 'Array fully sorted',
    nextActionLabel: 'Visualization complete',
    pseudocodeLine: 1,
    activeIndices: [],
    sortedIndices: allIndices,
    mergeRange: [0, n - 1],
    explanation: `Merge Sort has completed. The array is fully sorted in ascending order across ${comparisonCount} comparisons, ${mergeCount} merge operations, and ${arrayWrites} array writes.`,
  });

  return steps;
}
