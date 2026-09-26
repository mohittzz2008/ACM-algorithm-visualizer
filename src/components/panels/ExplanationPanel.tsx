import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const ExplanationPanel: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const currentStep = steps[currentStepIndex];

  const targetNode = useVisualizerStore((state) => state.targetNode);

  // Dynamic pedagogical explanation text
  const getExplanation = () => {
    if (!currentStep) {
      if (activeAlgorithmId === 'bfs') {
        return 'Breadth First Search is ready. Press Play or Next to explore the graph level by level using a queue.';
      }
      if (activeAlgorithmId === 'dfs') {
        return 'Depth First Search is ready. Press Play or Next to explore deeply along each branch using recursion / stack.';
      }
      if (activeAlgorithmId === 'binary-search') {
        return 'Binary Search is ready. Press Play or Next to inspect the midpoint and narrow the sorted search space.';
      }
      return activeAlgorithmId === 'merge-sort'
        ? 'Merge Sort is ready. Press Play to watch the array divide recursively into single-element base cases and merge back in sorted order.'
        : 'Bubble Sort is ready. Press Play to watch adjacent elements compare and bubble the largest unsorted numbers to the right.';
    }

    return currentStep.explanation;
  };

  const getKeyConcept = () => {
    if (activeAlgorithmId === 'bfs') {
      if (targetNode !== null && targetNode !== undefined) {
        return (
          currentStep?.keyConcept ||
          `BFS guarantees the shortest path (minimum edge count) in unweighted graphs when searching for a target node. Tracking parent pointers to target ${targetNode} enables backward path reconstruction.`
        );
      }
      return (
        currentStep?.keyConcept ||
        'BFS explores an unweighted graph level by level using a FIFO queue. Newly discovered nodes are marked visited and enqueued so each node is processed in breadth-first order.'
      );
    }
    if (activeAlgorithmId === 'dfs') {
      return (
        currentStep?.keyConcept ||
        'DFS explores one branch as deeply as possible before backtracking. It does NOT guarantee the shortest path in an unweighted graph. DFS is useful for cycle detection, topological sorting, and finding connected components.'
      );
    }
    if (!currentStep) {
      return 'By continually evaluating the midpoint of a sorted array, Binary Search eliminates half the remaining candidates with every single comparison.';
    }
    if (currentStep.type === 'target-found' || currentStep.comparisonResult === 'equal') {
      return 'When the middle element equals the target, the search terminates immediately with verified index location.';
    }
    if (currentStep.type === 'target-not-found' || (currentStep.low !== undefined && currentStep.high !== undefined && currentStep.low > currentStep.high)) {
      return 'When the low pointer crosses high (low > high), the search interval becomes empty, proving the target is not present.';
    }
    if (currentStep.comparisonResult === 'greater') {
      return 'In a sorted array, if the middle element is smaller than the target, the target can only reside in the right half. The left half is permanently discarded.';
    }
    if (currentStep.comparisonResult === 'less') {
      return 'In a sorted array, if the middle element is greater than the target, the target can only reside in the left half. The right half is permanently discarded.';
    }
    return 'Binary Search halves the search space at each iteration, achieving optimal O(log n) time complexity.';
  };

  const isCompleted = currentStep?.type === 'complete' && activeAlgorithmId !== 'binary-search';
  const showKeyConcept =
    activeAlgorithmId === 'binary-search' ||
    activeAlgorithmId === 'bfs' ||
    activeAlgorithmId === 'dfs';

  return (
    <div className="bg-white dark:bg-[#0A0E1A] border border-[#CBD5E1] dark:border-[#162136] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2.5 border-b border-[#E2E8F0] dark:border-[#141B2D]">
        <Lightbulb className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />
        <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-mono">
          Explanation
        </span>
      </div>

      {/* Content */}
      <div className="pt-2 flex flex-col justify-between flex-1 gap-2.5">
        <p className="text-xs leading-relaxed text-[#334155] dark:text-slate-300 font-normal">
          {getExplanation()}
        </p>

        {/* Pedagogical Visual State Changes for DFS */}
        {activeAlgorithmId === 'dfs' && currentStep && (
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B101D] border border-[#CBD5E1] dark:border-[#17233B] text-[11px] font-mono flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#7C3AED] dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
              Visual State Changes
            </span>
            <div className="flex flex-col gap-1 text-[#334155] dark:text-slate-300 text-[10.5px]">
              {/* Current Node / Neighbor */}
              {currentStep.currentNode !== null && currentStep.currentNode !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Current Node:</span>
                  <span className="text-[#D97706] dark:text-amber-300 font-bold">
                    Node {currentStep.currentNode}
                  </span>
                </div>
              )}

              {/* Call Stack / Stack */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">
                  {currentStep.dfsMode === 'iterative' ? 'Stack:' : 'Call Stack:'}
                </span>
                <span className="text-[#7C3AED] dark:text-purple-300 font-bold">
                  {(currentStep.callStack || currentStep.stackState || []).length > 0
                    ? `[${(currentStep.callStack || currentStep.stackState || []).join(', ')}]`
                    : '[ Empty ]'}
                </span>
              </div>

              {/* Visited Set */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Visited Set:</span>
                <span className="text-[#059669] dark:text-emerald-300 font-semibold">
                  `[${(currentStep.visitedNodes || []).join(', ')}]`
                </span>
              </div>

              {/* Traversal Order */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Traversal Order:</span>
                <span className="text-[#059669] dark:text-emerald-300 font-bold">
                  {currentStep.traversalOrder && currentStep.traversalOrder.length > 0
                    ? `[${currentStep.traversalOrder.join(' → ')}]`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pedagogical Visual State Changes for BFS */}
        {activeAlgorithmId === 'bfs' && currentStep && (
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B101D] border border-[#CBD5E1] dark:border-[#17233B] text-[11px] font-mono flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-[#7C3AED] dark:text-purple-400 uppercase tracking-wider flex items-center gap-1">
              Visual State Changes
            </span>
            <div className="flex flex-col gap-1 text-[#334155] dark:text-slate-300 text-[10.5px]">
              {/* Current Node / Neighbor */}
              {currentStep.currentNeighbor !== null && currentStep.currentNeighbor !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Neighbor {currentStep.currentNeighbor}:</span>
                  <span className={currentStep.graphPhase === 'enqueue-neighbor' ? 'text-[#0284C7] dark:text-cyan-300 font-semibold' : 'text-[#7C3AED] dark:text-indigo-300'}>
                    {currentStep.graphPhase === 'enqueue-neighbor'
                      ? 'Unvisited → In Queue (Visited)'
                      : currentStep.graphPhase === 'skip-neighbor'
                      ? 'Already Visited (Skipped)'
                      : 'Inspecting (Unvisited)'}
                  </span>
                </div>
              ) : currentStep.currentNode !== null && currentStep.currentNode !== undefined ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Node {currentStep.currentNode}:</span>
                  <span className="text-[#D97706] dark:text-amber-300 font-semibold">
                    {currentStep.graphPhase === 'dequeue' ? 'Dequeued (Processing)' : 'Start Node'}
                  </span>
                </div>
              ) : null}

              {/* Queue State Transition */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Queue:</span>
                <span className="text-[#0284C7] dark:text-cyan-300 font-bold">
                  {currentStep.queueBefore && currentStep.queueAfter
                    ? `[${currentStep.queueBefore.join(', ')}] → [${currentStep.queueAfter.join(', ')}]`
                    : `[${(currentStep.queueState || []).join(', ')}]`}
                </span>
              </div>

              {/* Visited Set Transition */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Visited Set:</span>
                <span className="text-[#059669] dark:text-emerald-300 font-semibold">
                  {currentStep.visitedBefore && currentStep.visitedAfter && currentStep.visitedBefore.length !== currentStep.visitedAfter.length
                    ? `[${currentStep.visitedBefore.join(', ')}] → [${currentStep.visitedAfter.join(', ')}]`
                    : `[${(currentStep.visitedNodes || []).join(', ')}]`}
                </span>
              </div>

              {/* Traversal Order */}
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500 w-24 shrink-0">Traversal Order:</span>
                <span className="text-[#059669] dark:text-emerald-300 font-bold">
                  {currentStep.traversalOrder && currentStep.traversalOrder.length > 0
                    ? `[${currentStep.traversalOrder.join(', ')}]`
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Key Concept Callout */}
        {showKeyConcept && (
          <div className="mt-1 p-2.5 rounded-xl bg-[#FFFBEB] dark:bg-[#121008] border border-[#F59E0B] dark:border-amber-600/40 text-[11px] flex gap-2.5 items-start">
            <div className="w-5 h-5 rounded-md bg-[#FEF3C7] dark:bg-amber-500/20 border border-[#FDE68A] dark:border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#D97706] dark:text-amber-400" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-[#B45309] dark:text-amber-400 uppercase tracking-wider font-mono">
                Key Concept
              </span>
              <p className="text-[#334155] dark:text-slate-300 font-sans leading-relaxed">
                {getKeyConcept()}
              </p>
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mt-2 flex items-center gap-2 p-2.5 rounded-xl bg-[#ECFDF5] dark:bg-emerald-950/40 border border-[#A7F3D0] dark:border-emerald-600/40 text-[11px] text-[#059669] dark:text-emerald-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-emerald-400 shrink-0" />
            <span>Array fully sorted in ascending order.</span>
          </div>
        )}
      </div>
    </div>
  );
};
