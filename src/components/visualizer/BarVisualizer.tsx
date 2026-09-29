import React from 'react';
import { motion } from 'framer-motion';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import type { ElementVisualState } from '../../algorithms/types';

export const BarVisualizer: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const playbackSpeed = useVisualizerStore((state) => state.playbackSpeed);

  const currentStep = steps[currentStepIndex] || steps[0];
  const array = currentStep ? currentStep.array : [];
  const elementIds = currentStep?.elementIds || array.map((_, i) => i);
  const maxVal = Math.max(...array, 1);

  // Compute visual state for each index
  const getBarState = (index: number): ElementVisualState => {
    if (!currentStep) return 'unsorted';

    // If step is complete, all are sorted
    if (currentStep.type === 'complete') {
      return 'sorted';
    }

    // Direct visualState from step generator if available
    if (currentStep.visualStates && currentStep.visualStates[index]) {
      return currentStep.visualStates[index];
    }

    // Check specific comparing or swapping roles
    if (currentStep.comparingIndex === index) {
      return 'comparing';
    }
    if (currentStep.swappingIndex === index) {
      return 'swapping';
    }

    // Fallback active state if not differentiated
    if (currentStep.activeIndices.includes(index)) {
      if (currentStep.type === 'swap') return 'swapping';
      if (currentStep.type === 'compare') return 'comparing';
    }

    // Check if index is settled/sorted
    if (currentStep.sortedIndices.includes(index)) {
      return 'sorted';
    }

    return 'unsorted';
  };

  const getBarStyleClasses = (state: ElementVisualState) => {
    switch (state) {
      case 'comparing':
        return 'bg-gradient-to-t from-[#D97706] via-[#FFC107] to-[#FDE047] border-2 border-[#D97706] shadow-md z-20 scale-[1.02]';
      case 'swapping':
      case 'selected':
        return 'bg-gradient-to-t from-rose-600 via-rose-500 to-red-400 border-2 border-rose-500 shadow-md z-20 scale-[1.02]';
      case 'active-range':
        return 'bg-gradient-to-t from-neutral-800 via-neutral-700 to-neutral-600 border border-neutral-600 shadow-xs z-10';
      case 'base-case':
        return 'bg-gradient-to-t from-cyan-700 via-cyan-600 to-teal-400 border border-cyan-400 shadow-xs z-10';
      case 'sorted':
        return 'bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-400 border border-emerald-500 shadow-xs z-10';
      case 'unsorted':
      default:
        return 'bg-gradient-to-t from-[#2B2B2B] via-[#3F3F3F] to-[#525252] border border-[#3F3F3F] shadow-xs z-0 hover:brightness-110';
    }
  };

  const getValueTextColor = (state: ElementVisualState) => {
    switch (state) {
      case 'comparing':
        return 'text-[#B45309] font-bold';
      case 'swapping':
        return 'text-[#E11D48] font-bold';
      case 'sorted':
        return 'text-[#059669] font-semibold';
      case 'unsorted':
      default:
        return 'text-[#18181B] font-semibold';
    }
  };

  // Determine bar width sizing based on element count
  const count = array.length;
  const barGap = count > 20 ? 'gap-1.5' : count > 14 ? 'gap-2.5' : 'gap-3.5';

  // Dynamic spring physics based on playback speed
  const springTransition = {
    type: 'spring' as const,
    stiffness:
      playbackSpeed === 0.5 ? 240 : playbackSpeed === 2 ? 550 : playbackSpeed === 4 ? 800 : 380,
    damping:
      playbackSpeed === 0.5 ? 24 : playbackSpeed === 2 ? 30 : playbackSpeed === 4 ? 36 : 26,
    mass: 0.8,
  };

  const hasActivePair =
    currentStep &&
    (currentStep.type === 'compare' || currentStep.type === 'swap') &&
    currentStep.activeIndices.length >= 2;

  const activeIndices = currentStep?.activeIndices || [];

  return (
    <div className="w-full h-56 sm:h-64 md:h-72 lg:h-76 flex flex-col items-center justify-end px-3 sm:px-4 pt-3 pb-1 overflow-x-auto scrollbar-none">
      <div className={`flex items-end justify-center h-full w-full max-w-5xl ${barGap}`}>
        {elementIds.map((id, idx) => {
          const value = array[idx];
          const state = getBarState(idx);
          const isActive = activeIndices.includes(idx);
          const isSwappingPair = isActive && currentStep?.type === 'swap';

          // Proportional height
          const heightPercent = Math.max(18, Math.min(92, Math.round((value / maxVal) * 85)));

          // Dim unsorted elements gently when active
          const dimClass =
            hasActivePair && state === 'unsorted'
              ? 'opacity-85 hover:opacity-100 transition-opacity'
              : 'opacity-100';

          return (
            <motion.div
              key={id}
              layout="position"
              transition={springTransition}
              className={`flex-1 flex flex-col items-center justify-end h-full max-w-[72px] min-w-[20px] transition-opacity duration-150 ${dimClass}`}
            >
              {/* Value Label above Bar */}
              <div className="mb-1.5 flex flex-col items-center">
                {isActive ? (
                  <span
                    className={`text-xs md:text-sm font-mono font-bold px-1.5 py-0.5 rounded-md border select-none tracking-tight shadow-xs ${
                      isSwappingPair
                        ? 'text-[#E11D48] bg-[#FFF1F2] border-[#FECDD3]'
                        : 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]'
                    }`}
                  >
                    {value}
                  </span>
                ) : (
                  <span
                    className={`text-xs md:text-sm font-mono select-none tracking-tight ${getValueTextColor(
                      state
                    )}`}
                  >
                    {value}
                  </span>
                )}
              </div>

              {/* Vertical Bar */}
              <motion.div
                initial={false}
                animate={{
                  height: `${heightPercent}%`,
                }}
                transition={springTransition}
                className={`w-full rounded-t-xl transition-colors duration-150 relative ${getBarStyleClasses(
                  state
                )}`}
              >
                {/* Active top highlight bar */}
                {isActive && (
                  <div
                    className={`absolute top-0 inset-x-0 h-1 rounded-t-xl ${
                      isSwappingPair ? 'bg-rose-200' : 'bg-yellow-200'
                    }`}
                  />
                )}
              </motion.div>

              {/* Index & Role Label below Bar */}
              <div className="flex flex-col items-center mt-1.5 select-none">
                <span
                  className={`text-[11px] font-mono font-medium transition-colors ${
                    isActive
                      ? isSwappingPair
                        ? 'text-[#E11D48] font-bold'
                        : 'text-[#B45309] font-bold'
                      : state === 'sorted'
                      ? 'text-[#059669] font-semibold'
                      : 'text-[#64748B]'
                  }`}
                >
                  {idx}
                </span>

                {/* Subtitle active indicator tag: A[idx] */}
                {isActive && (
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-tighter px-1 rounded transition-colors ${
                      isSwappingPair
                        ? 'text-[#E11D48] bg-[#FFF1F2] border border-[#FECDD3]'
                        : 'text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A]'
                    }`}
                  >
                    A[{idx}]
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
