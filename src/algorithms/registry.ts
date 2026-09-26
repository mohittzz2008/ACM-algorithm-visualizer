import type { AlgorithmMetadata } from './types';
import { bubbleSortMetadata } from './sorting/bubbleSort';
import { mergeSortMetadata } from './sorting/mergeSort';
import { binarySearchMetadata } from './searching/binarySearch';
import { bfsMetadata } from './graph/bfs';
import { dfsMetadata } from './graph/dfs';

export interface AlgorithmNavItem {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph';
  implemented: boolean;
  metadata?: AlgorithmMetadata;
}

export interface AlgorithmCategory {
  id: string;
  name: string;
  algorithms: AlgorithmNavItem[];
}

export const ALGORITHM_CATEGORIES: AlgorithmCategory[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    algorithms: [
      {
        id: 'bubble-sort',
        name: 'Bubble Sort',
        category: 'sorting',
        implemented: true,
        metadata: bubbleSortMetadata,
      },
      {
        id: 'merge-sort',
        name: 'Merge Sort',
        category: 'sorting',
        implemented: true,
        metadata: mergeSortMetadata,
      },
    ],
  },
  {
    id: 'searching',
    name: 'Searching',
    algorithms: [
      {
        id: 'binary-search',
        name: 'Binary Search',
        category: 'searching',
        implemented: true,
        metadata: binarySearchMetadata,
      },
      {
        id: 'linear-search',
        name: 'Linear Search',
        category: 'searching',
        implemented: false,
      },
      {
        id: 'jump-search',
        name: 'Jump Search',
        category: 'searching',
        implemented: false,
      },
    ],
  },
  {
    id: 'graph',
    name: 'Graph Traversal',
    algorithms: [
      {
        id: 'bfs',
        name: 'Breadth First Search',
        category: 'graph',
        implemented: true,
        metadata: bfsMetadata,
      },
      {
        id: 'dfs',
        name: 'Depth First Search',
        category: 'graph',
        implemented: true,
        metadata: dfsMetadata,
      },
    ],
  },
];
