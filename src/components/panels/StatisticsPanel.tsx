import React from 'react';
import { BarChart2, GitCompare, ArrowLeftRight, Boxes, History, Timer, GitMerge, Edit } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const StatisticsPanel: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const initialArray = useVisualizerStore((state) => state.initialArray);
  const elapsedTimeMs = useVisualizerStore((state) => state.elapsedTimeMs);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const graphData = useVisualizerStore((state) => state.graphData);
  const targetNode = useVisualizerStore((state) => state.targetNode);
  const isPlaying = useVisualizerStore((state) => state.isPlaying);

  const currentStep = steps[currentStepIndex];
  const comparisons = currentStep ? currentStep.comparisonCount : 0;
  const swaps = currentStep ? currentStep.swapCount : 0;
  const merges = currentStep ? (currentStep.mergeCount ?? 0) : 0;
  const arrayWrites = currentStep ? (currentStep.arrayWrites ?? 0) : 0;
  const elements = initialArray.length;
  const totalSteps = steps.length;
  const formattedTime = (elapsedTimeMs / 1000).toFixed(2) + 's';

  const stats =
    activeAlgorithmId === 'bfs'
      ? [
          {
            label: 'Nodes Visited',
            value: `${currentStep?.nodesVisitedCount ?? (currentStep?.visitedNodes?.length ?? 0)} / ${graphData.nodes.length}`,
            icon: <Boxes className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />,
            color: 'text-[#059669] dark:text-emerald-300 font-mono font-bold',
          },
          {
            label: 'Edges Traversed',
            value: `${currentStep?.edgesTraversedCount ?? (currentStep?.traversedEdges?.length ?? 0)} / ${graphData.edges.length}`,
            icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#0284C7] dark:text-cyan-400" />,
            color: 'text-[#0284C7] dark:text-cyan-300 font-mono font-bold',
          },
          {
            label: 'Queue Operations',
            value: currentStep?.queueOpsCount ?? 0,
            icon: <GitCompare className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />,
            color: 'text-[#7C3AED] dark:text-purple-300 font-mono font-bold',
          },
          {
            label: 'Total Steps',
            value: steps.length,
            icon: <History className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: isPlaying ? 'Animation Time' : 'Execution Time',
            value: isPlaying ? formattedTime : '< 0.1ms',
            icon: <Timer className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />,
            color: 'text-[#D97706] dark:text-amber-300 font-mono font-bold',
          },
        ]
      : activeAlgorithmId === 'dfs'
      ? [
          {
            label: 'Nodes Visited',
            value: `${currentStep?.nodesVisitedCount ?? (currentStep?.visitedNodes?.length ?? 0)} / ${graphData.nodes.length}`,
            icon: <Boxes className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />,
            color: 'text-[#059669] dark:text-emerald-300 font-mono font-bold',
          },
          {
            label: 'Tree Edges',
            value: currentStep?.treeEdgesCount ?? (currentStep?.treeEdges?.length ?? 0),
            icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Neighbor Checks',
            value: currentStep?.neighborChecksCount ?? 0,
            icon: <GitCompare className="w-3.5 h-3.5 text-[#0284C7] dark:text-cyan-400" />,
            color: 'text-[#0284C7] dark:text-cyan-300 font-mono font-bold',
          },
          {
            label: currentStep?.dfsMode === 'iterative' ? 'Max Stack Depth' : 'Max Recursion Depth',
            value: currentStep?.maxRecursionDepth ?? (currentStep?.recursionDepth ?? 1),
            icon: <GitMerge className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />,
            color: 'text-[#7C3AED] dark:text-purple-300 font-mono font-bold',
          },
          {
            label: 'Total Steps',
            value: steps.length,
            icon: <History className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Animation Time',
            value: isPlaying ? formattedTime : '0.00s',
            icon: <Timer className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />,
            color: 'text-[#D97706] dark:text-amber-300 font-mono font-bold',
          },
        ]
      : activeAlgorithmId === 'binary-search'
      ? [
          {
            label: 'Comparisons',
            value: comparisons,
            icon: <GitCompare className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Eliminated Elements',
            value: currentStep?.eliminatedIndices?.length ?? 0,
            icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#E11D48] dark:text-rose-400" />,
            color: 'text-[#E11D48] dark:text-rose-300 font-mono font-bold',
          },
          {
            label: 'Remaining Candidates',
            value: currentStep?.remainingCandidates ?? (currentStep?.low !== undefined && currentStep?.high !== undefined && currentStep.low <= currentStep.high ? currentStep.high - currentStep.low + 1 : 0),
            icon: <Boxes className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />,
            color: 'text-[#059669] dark:text-emerald-300 font-mono font-bold',
          },
          {
            label: 'Total Steps',
            value: steps.length,
            icon: <History className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />,
            color: 'text-[#7C3AED] dark:text-purple-300 font-mono font-bold',
          },
          {
            label: 'Playback Time',
            value: formattedTime,
            icon: <Timer className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />,
            color: 'text-[#D97706] dark:text-amber-300 font-mono font-bold',
          },
        ]
      : activeAlgorithmId === 'merge-sort'
      ? [
          {
            label: 'Comparisons',
            value: comparisons,
            icon: <GitCompare className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Merges',
            value: merges,
            icon: <GitMerge className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />,
            color: 'text-[#7C3AED] dark:text-purple-300 font-mono font-bold',
          },
          {
            label: 'Elements',
            value: elements,
            icon: <Boxes className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />,
            color: 'text-[#059669] dark:text-emerald-300 font-mono font-bold',
          },
          {
            label: 'Array Writes',
            value: arrayWrites,
            icon: <Edit className="w-3.5 h-3.5 text-[#E11D48] dark:text-rose-400" />,
            color: 'text-[#E11D48] dark:text-rose-300 font-mono font-bold',
          },
          {
            label: 'Total Steps',
            value: totalSteps,
            icon: <History className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
        ]
      : [
          {
            label: 'Comparisons',
            value: comparisons,
            icon: <GitCompare className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Swaps',
            value: swaps,
            icon: <ArrowLeftRight className="w-3.5 h-3.5 text-[#E11D48] dark:text-rose-400" />,
            color: 'text-[#E11D48] dark:text-rose-300 font-mono font-bold',
          },
          {
            label: 'Elements',
            value: elements,
            icon: <Boxes className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />,
            color: 'text-[#059669] dark:text-emerald-300 font-mono font-bold',
          },
          {
            label: 'Total Steps',
            value: totalSteps,
            icon: <History className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />,
            color: 'text-[#2563EB] dark:text-blue-300 font-mono font-bold',
          },
          {
            label: 'Playback Time',
            value: formattedTime,
            icon: <Timer className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />,
            color: 'text-[#D97706] dark:text-amber-300 font-mono font-bold',
          },
        ];

  return (
    <div
      role="region"
      aria-label="Execution Statistics"
      className="bg-white dark:bg-[#0A0E1A] border border-[#CBD5E1] dark:border-[#162136] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full transition-colors"
    >
      {/* Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0] dark:border-[#141B2D]">
        <BarChart2 className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" aria-hidden="true" />
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-mono">
          Execution Statistics
        </span>
      </div>

      {/* Grid of Metrics */}
      <div
        className={`grid gap-2 sm:gap-2.5 pt-2.5 ${
          stats.length === 6
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6'
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5'
        }`}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between gap-1.5 p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1424] border border-[#CBD5E1] dark:border-[#18233C] text-left min-h-[64px] min-w-0 overflow-hidden transition-all duration-200 hover:border-[#94A3B8] dark:hover:border-purple-500/30 hover:bg-[#F1F5F9] dark:hover:bg-[#111A30] shadow-xs"
          >
            <div className="flex items-center gap-1.5 font-medium text-[11px] sm:text-xs min-w-0" title={stat.label}>
              <span className="shrink-0" aria-hidden="true">{stat.icon}</span>
              <span className="truncate text-[#64748B] dark:text-slate-400 font-medium">{stat.label}</span>
            </div>
            <div className={`text-base sm:text-lg font-bold font-mono mt-0.5 truncate ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Algorithmic Complexity Bottom Bar */}
      <div className="mt-3 pt-2 border-t border-[#E2E8F0] dark:border-[#141B2D] flex flex-wrap items-center justify-between text-[11px] text-[#64748B] dark:text-slate-400 font-mono gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[#64748B] dark:text-slate-500">Time Complexity:</span>
          <span className="text-[#D97706] dark:text-amber-300 font-bold">
            {activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs'
              ? 'O(V + E)'
              : activeAlgorithmId === 'binary-search'
              ? 'O(log n)'
              : activeAlgorithmId === 'merge-sort'
              ? 'O(n log n)'
              : 'O(n²)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#64748B] dark:text-slate-500">Space Complexity:</span>
          <span className="text-[#0284C7] dark:text-cyan-300 font-bold">
            {activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs'
              ? 'O(V)'
              : activeAlgorithmId === 'binary-search'
              ? 'O(1)'
              : activeAlgorithmId === 'merge-sort'
              ? 'O(n)'
              : 'O(1)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#64748B] dark:text-slate-500">
            {activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs'
              ? 'Best Used For:'
              : activeAlgorithmId === 'binary-search'
              ? 'Requires Sorted Input:'
              : 'Stable:'}
          </span>
          <span className="text-[#059669] dark:text-emerald-300 font-bold">
            {activeAlgorithmId === 'bfs'
              ? (targetNode !== null && targetNode !== undefined
                  ? 'Shortest path (Unweighted Graph)'
                  : 'Level-Order Traversal (Unweighted Graph)')
              : activeAlgorithmId === 'dfs'
              ? 'Cycle & backtracking'
              : 'Yes'}
          </span>
        </div>
      </div>
    </div>
  );
};
