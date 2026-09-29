import React from 'react';
import { Clock, Cpu, CheckCircle2, Layers, Search, ShieldCheck, Network, Compass } from 'lucide-react';
import { bubbleSortMetadata } from '../../algorithms/sorting/bubbleSort';
import { mergeSortMetadata } from '../../algorithms/sorting/mergeSort';
import { binarySearchMetadata } from '../../algorithms/searching/binarySearch';
import { bfsMetadata } from '../../algorithms/graph/bfs';
import { dfsMetadata } from '../../algorithms/graph/dfs';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const HeaderInfo: React.FC = () => {
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const metadata =
    activeAlgorithmId === 'bfs'
      ? bfsMetadata
      : activeAlgorithmId === 'dfs'
      ? dfsMetadata
      : activeAlgorithmId === 'binary-search'
      ? binarySearchMetadata
      : activeAlgorithmId === 'merge-sort'
      ? mergeSortMetadata
      : bubbleSortMetadata;

  const categoryName =
    activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs'
      ? 'Graph Traversal'
      : activeAlgorithmId === 'binary-search'
      ? 'Searching'
      : 'Sorting';

  const tagline =
    activeAlgorithmId === 'bfs'
      ? 'Explore a graph level by level, visiting all neighbors before moving to the next level.'
      : activeAlgorithmId === 'dfs'
      ? 'Explore as deep as possible along each branch before backtracking.'
      : activeAlgorithmId === 'binary-search'
      ? 'Find a target in a sorted array by repeatedly halving the search space.'
      : activeAlgorithmId === 'merge-sort'
      ? 'Visualize divide, compare, and merge in real time.'
      : 'Visualize every comparison, swap, and pass in real time.';

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-1 min-w-0">
      {/* Product Title & Tagline with Breadcrumb */}
      <div className="flex flex-col min-w-0 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-mono mb-1 shrink-0 whitespace-nowrap">
          <span className="text-[#64748B] hover:text-[#18181B] transition-colors cursor-default shrink-0">Visualizer</span>
          <span className="text-[#94A3B8] select-none shrink-0" aria-hidden="true">&gt;</span>
          <span className="text-[#3F3F3F] font-semibold shrink-0">{categoryName}</span>
          <span className="text-[#94A3B8] select-none shrink-0" aria-hidden="true">&gt;</span>
          <span className="text-[#18181B] font-bold shrink-0">{metadata.name}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] ml-1 shrink-0" aria-hidden="true" />
        </nav>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#18181B] m-0 flex items-center gap-2.5 break-words">
          {metadata.name}
        </h1>

        <p className="text-xs text-[#475569] font-normal mt-0.5 max-w-xl">
          {tagline}
        </p>
      </div>

      {/* Compact Metadata Badges Row */}
      <div className="flex items-center gap-2 flex-wrap min-w-0">
        {/* Category Badge */}
        {activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold shadow-xs">
            <Network className="w-3.5 h-3.5 text-[#059669]" />
            <span>Graph Traversal</span>
          </div>
        ) : activeAlgorithmId === 'binary-search' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-[#3F3F3F] text-xs font-semibold shadow-xs">
            <Search className="w-3.5 h-3.5 text-[#3F3F3F]" />
            <span>Searching</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-semibold shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Sorting</span>
          </div>
        )}

        {/* Time Complexity */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-mono shadow-xs"
          title="Worst / Average Time Complexity"
        >
          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          <span className="text-[#92400E] text-[11px] font-sans font-medium">Time:</span>
          <span className="font-bold text-[#B45309]">{metadata.timeComplexity.worst}</span>
        </div>

        {/* Space Complexity */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] text-[#3F3F3F] text-xs font-mono shadow-xs"
          title="Auxiliary Space Complexity"
        >
          <Cpu className="w-3.5 h-3.5 text-[#3F3F3F]" />
          <span className="text-[#52525B] text-[11px] font-sans font-medium">Space:</span>
          <span className="font-bold text-[#18181B]">{metadata.spaceComplexity}</span>
        </div>

        {/* Stability / Specific Property Badge */}
        {activeAlgorithmId === 'bfs' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold shadow-xs"
            title="BFS finds shortest path by edge count in unweighted graphs"
          >
            <Compass className="w-3.5 h-3.5 text-[#059669]" />
            <span>Unweighted Graph: Shortest Path</span>
          </div>
        ) : activeAlgorithmId === 'dfs' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs font-semibold shadow-xs"
            title="DFS explores depth before backtracking"
          >
            <Compass className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Depth &amp; Backtracking</span>
          </div>
        ) : activeAlgorithmId === 'binary-search' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold shadow-xs"
            title="Binary Search fundamentally requires sorted data"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>Sorted Input Required: Yes</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-semibold shadow-xs"
            title="Maintains relative order of equal elements"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
            <span>Stable: {metadata.stable ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>
    </header>
  );
};
