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
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
      {/* Product Title & Tagline with Breadcrumb */}
      <div className="flex flex-col min-w-0">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] font-mono mb-1">
          <span className="text-[#475569] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-slate-300 transition-colors cursor-default">Visualizer</span>
          <span className="text-[#64748B] dark:text-slate-500 select-none" aria-hidden="true">&gt;</span>
          <span className="text-[#334155] dark:text-slate-300 font-semibold">{categoryName}</span>
          <span className="text-[#64748B] dark:text-slate-500 select-none" aria-hidden="true">&gt;</span>
          <span className="text-[#7C3AED] dark:text-purple-300 font-bold">{metadata.name}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] dark:bg-purple-400/80 animate-pulse ml-1" aria-hidden="true" />
        </nav>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white m-0 flex items-center gap-2.5">
          {metadata.name}
        </h1>

        <p className="text-xs text-[#334155] dark:text-slate-400 font-normal mt-0.5 max-w-xl">
          {tagline}
        </p>
      </div>

      {/* Compact Metadata Badges Row */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {/* Category Badge */}
        {activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3E8FF] border border-[#C084FC] text-[#7C3AED] dark:bg-purple-950/40 dark:border-purple-700/50 dark:text-purple-300 text-xs font-semibold shadow-sm">
            <Network className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
            <span>Graph Traversal</span>
          </div>
        ) : activeAlgorithmId === 'binary-search' ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300 text-xs font-semibold shadow-sm">
            <Search className="w-3.5 h-3.5 text-[#0284C7] dark:text-blue-400" />
            <span>Searching</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3E8FF] border border-[#C084FC] text-[#7C3AED] dark:bg-purple-950/40 dark:border-purple-800/40 dark:text-purple-300 text-xs font-semibold shadow-sm">
            <Layers className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
            <span>Sorting</span>
          </div>
        )}

        {/* Time Complexity */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] dark:bg-amber-950/30 dark:border-amber-700/40 dark:text-amber-300 text-xs font-mono shadow-sm"
          title="Worst / Average Time Complexity"
        >
          <Clock className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
          <span className="text-[#B45309] dark:text-amber-200/80 text-[11px] font-sans font-medium">Time:</span>
          <span className="font-bold text-[#D97706] dark:text-amber-300">{metadata.timeComplexity.worst}</span>
        </div>

        {/* Space Complexity */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] dark:bg-cyan-950/30 dark:border-cyan-700/40 dark:text-cyan-300 text-xs font-mono shadow-sm"
          title="Auxiliary Space Complexity"
        >
          <Cpu className="w-3.5 h-3.5 text-[#0284C7] dark:text-cyan-400" />
          <span className="text-[#0369A1] dark:text-cyan-200/80 text-[11px] font-sans font-medium">Space:</span>
          <span className="font-bold text-[#0284C7] dark:text-cyan-300">{metadata.spaceComplexity}</span>
        </div>

        {/* Stability / Specific Property Badge */}
        {activeAlgorithmId === 'bfs' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] dark:bg-emerald-950/30 dark:border-emerald-600/40 dark:text-emerald-300 text-xs font-semibold shadow-sm"
            title="BFS finds shortest path by edge count in unweighted graphs"
          >
            <Compass className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
            <span>Unweighted Graph: Shortest Path</span>
          </div>
        ) : activeAlgorithmId === 'dfs' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3E8FF] border border-[#C084FC] text-[#7C3AED] dark:bg-purple-950/30 dark:border-purple-500/40 dark:text-purple-300 text-xs font-semibold shadow-sm"
            title="DFS explores depth before backtracking"
          >
            <Compass className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
            <span>Depth &amp; Backtracking</span>
          </div>
        ) : activeAlgorithmId === 'binary-search' ? (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] dark:bg-emerald-950/30 dark:border-emerald-600/40 dark:text-emerald-300 text-xs font-semibold shadow-sm"
            title="Binary Search fundamentally requires sorted data"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
            <span>Sorted Input Required: Yes</span>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] dark:bg-emerald-950/30 dark:border-emerald-600/40 dark:text-emerald-300 text-xs font-semibold shadow-sm"
            title="Maintains relative order of equal elements"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
            <span>Stable: {metadata.stable ? 'Yes' : 'No'}</span>
          </div>
        )}
      </div>
    </header>
  );
};
