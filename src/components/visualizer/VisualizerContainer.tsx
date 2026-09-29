import React from 'react';
import { Legend } from './Legend';
import { BarVisualizer } from './BarVisualizer';
import { MergeSortVisualizer } from './MergeSortVisualizer';
import { BinarySearchVisualizer } from './BinarySearchVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { PlaybackControls } from '../controls/PlaybackControls';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Box, Sparkles, ArrowRightLeft, CheckCircle2, Check, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const VisualizerContainer: React.FC = () => {
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const reset = useVisualizerStore((state) => state.reset);
  const play = useVisualizerStore((state) => state.play);

  // Dedicated visualizers
  if (activeAlgorithmId === 'merge-sort') {
    return <MergeSortVisualizer />;
  }
  if (activeAlgorithmId === 'binary-search') {
    return <BinarySearchVisualizer />;
  }
  if (activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs') {
    return <GraphVisualizer />;
  }

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep?.type === 'complete';

  // Derive dynamic Operation HUD data
  const getOperationHudData = () => {
    if (!currentStep || currentStep.type === 'initial') {
      return {
        passLabel: 'PASS 1',
        passSub: 'Ready to start',
        opHeader: 'CURRENT OPERATION',
        opMain: 'READY',
        opDetail: 'Press PLAY or NEXT to begin sorting',
        badge: 'READY',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        icon: <Sparkles className="w-4 h-4 text-[#D97706]" />,
      };
    }

    if (currentStep.type === 'pass-complete') {
      const settledIdx = currentStep.activeIndices[0] ?? currentStep.array.length - 1;
      const settledVal = currentStep.array[settledIdx];
      return {
        passLabel: `PASS ${currentStep.pass} COMPLETE`,
        passSub: `"${settledVal} is now in its final position."`,
        opHeader: 'CURRENT OPERATION',
        opMain: 'PASS COMPLETE',
        opDetail: 'Largest remaining element reached its final position.',
        badge: 'PASS COMPLETE',
        badgeClass: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        icon: <CheckCircle2 className="w-4 h-4 text-[#059669]" />,
      };
    }

    if (currentStep.type === 'swap') {
      const idxA = currentStep.activeIndices[0];
      const idxB = currentStep.activeIndices[1];
      const valA = currentStep.array[idxA];
      const valB = currentStep.array[idxB];
      return {
        passLabel: `PASS ${currentStep.pass}`,
        passSub: currentStep.comparisonInPass
          ? `COMPARISON ${currentStep.comparisonInPass} / ${currentStep.totalComparisonsInPass}`
          : `STEP ${currentStepIndex}`,
        opHeader: 'CURRENT OPERATION',
        opMain: 'SWAPPING',
        opDetail: `${valA} ↔ ${valB}`,
        badge: 'SWAPPING',
        badgeClass: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
        icon: <ArrowRightLeft className="w-4 h-4 text-[#E11D48]" />,
      };
    }

    if (currentStep.type === 'compare') {
      const idxA = currentStep.activeIndices[0];
      const idxB = currentStep.activeIndices[1];
      const valA = currentStep.array[idxA];
      const valB = currentStep.array[idxB];
      const needsSwap = valA > valB;

      return {
        passLabel: `PASS ${currentStep.pass}`,
        passSub: currentStep.comparisonInPass
          ? `COMPARISON ${currentStep.comparisonInPass} / ${currentStep.totalComparisonsInPass}`
          : `STEP ${currentStepIndex}`,
        opHeader: 'CURRENT OPERATION',
        opMain: `Comparing A[${idxA}] and A[${idxB}]`,
        opDetail: needsSwap ? `${valA} > ${valB}` : `${valA} ≤ ${valB}`,
        badge: needsSwap ? 'SWAP REQUIRED' : 'NO SWAP',
        badgeClass: needsSwap
          ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
          : 'bg-[#F4F4F5] text-[#3F3F3F] border-[#E4E4E7]',
        icon: <Sparkles className={`w-4 h-4 ${needsSwap ? 'text-[#D97706]' : 'text-[#3F3F3F]'}`} />,
      };
    }

    return {
      passLabel: `PASS ${currentStep.pass || 1}`,
      passSub: 'In progress',
      opHeader: 'CURRENT OPERATION',
      opMain: currentStep.action,
      opDetail: currentStep.valuesLabel,
      badge: currentStep.action.toUpperCase(),
      badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      icon: <Sparkles className="w-4 h-4 text-[#D97706]" />,
    };
  };

  const hud = getOperationHudData();

  return (
    <div className="relative w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-clean-elevated flex flex-col justify-between overflow-hidden">
      {/* Top Header inside Visualizer: Title on left, Legend on right */}
      <div className="flex items-center justify-between z-10 w-full mb-3 pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center">
            <Box className="w-3.5 h-3.5 text-[#B45309]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#18181B] tracking-wide font-mono uppercase">
            Visualization
          </span>
        </div>

        <Legend />
      </div>

      {/* Current Operation Area / Completion State banner */}
      {isComplete ? (
        /* Completion State Card: Subtle success animation, final sorted array, metrics */
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="z-10 w-full mb-2 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          {/* Left: Completion Badge & Final Sorted Array */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg border text-[11px] font-bold tracking-wider uppercase bg-white text-[#047857] border-[#A7F3D0] flex items-center gap-1.5 shadow-xs">
                <Check className="w-3.5 h-3.5 text-[#047857]" />
                SORTING COMPLETE
              </span>
              <span className="text-xs text-[#064E3B] font-medium">Final sorted array:</span>
            </div>

            {/* Final Sorted Array Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {currentStep.array.map((val, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white border border-[#A7F3D0] text-[#047857] text-xs font-mono font-semibold"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Key Summary Statistics & Replay */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="grid grid-cols-4 gap-2 text-center bg-white border border-[#CBD5E1] rounded-lg px-3 py-1.5 shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B] uppercase font-mono">Comparisons</span>
                <span className="text-xs font-bold text-[#B45309] font-mono">
                  {currentStep.comparisonCount}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] pl-2">
                <span className="text-[10px] text-[#64748B] uppercase font-mono">Swaps</span>
                <span className="text-xs font-bold text-[#E11D48] font-mono">
                  {currentStep.swapCount}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] pl-2">
                <span className="text-[10px] text-[#64748B] uppercase font-mono">Passes</span>
                <span className="text-xs font-bold text-[#3F3F3F] font-mono">
                  {currentStep.totalPasses}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] pl-2">
                <span className="text-[10px] text-[#64748B] uppercase font-mono">Total Steps</span>
                <span className="text-xs font-bold text-[#18181B] font-mono">
                  {steps.length}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                reset();
                play();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REPLAY</span>
            </button>
          </div>
        </motion.div>
      ) : (
        /* Compact Current Operation HUD */
        <div className="z-10 w-full mb-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Left: Dynamic Pass Storytelling */}
          <div className="flex flex-col min-w-[150px]">
            <span className="text-xs font-bold font-mono text-[#18181B] tracking-wide">
              {hud.passLabel}
            </span>
            <span className="text-[11px] font-mono text-[#475569] truncate max-w-[220px]">
              {hud.passSub}
            </span>
          </div>

          {/* Center: Current Operation Details */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center shrink-0 shadow-xs">
              {hud.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                {hud.opHeader}
              </span>
              <span className="text-xs font-bold text-[#18181B] font-mono">{hud.opMain}</span>
              <span className="text-[11px] font-mono font-medium text-[#475569]">
                {hud.opDetail}
              </span>
            </div>
          </div>

          {/* Right: Current Operation Status Badge */}
          <div className="flex flex-col items-end min-w-[130px]">
            <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider mb-0.5">
              Status
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold tracking-wide shadow-xs ${hud.badgeClass}`}
            >
              {hud.badge}
            </span>
          </div>
        </div>
      )}

      {/* Visualizer Canvas: Vertical Bars with clean light background */}
      <div className="w-full flex items-end justify-center my-1 bg-[#FAFAFA] rounded-xl p-2 sm:p-3 border border-[#F1F5F9]">
        <BarVisualizer />
      </div>

      {/* Integrated Playback Controls at bottom of Visualizer Card */}
      <div className="w-full pt-3 mt-1 border-t border-[#E2E8F0]">
        <PlaybackControls />
      </div>
    </div>
  );
};
