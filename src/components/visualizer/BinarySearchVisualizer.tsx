import React from 'react';
import { PlaybackControls } from '../controls/PlaybackControls';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import {
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BinarySearchVisualizer: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const initialArray = useVisualizerStore((state) => state.initialArray);
  const targetValue = useVisualizerStore((state) => state.targetValue);

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep?.type === 'complete' || currentStep?.type === 'target-found' || currentStep?.type === 'target-not-found';
  const isFound = currentStep?.type === 'target-found' || (currentStep?.foundIndex !== undefined && currentStep.foundIndex >= 0);
  const isNotFound = currentStep?.type === 'target-not-found' || currentStep?.foundIndex === -1;

  // 6-Phase Definition matching section 6
  // 1: INITIALIZE -> 2: CALCULATE MID -> 3: COMPARE -> 4: DECIDE -> 5: ELIMINATE -> 6: COMPLETE
  const phases = [
    { num: 1, key: 'initialize', label: 'INITIALIZE' },
    { num: 2, key: 'calculate-mid', label: 'CALCULATE MID' },
    { num: 3, key: 'compare', label: 'COMPARE' },
    { num: 4, key: 'decide', label: 'DECIDE' },
    { num: 5, key: 'eliminate', label: 'ELIMINATE' },
    { num: 6, key: 'complete', label: 'COMPLETE' },
  ] as const;

  const getActivePhaseNum = (): number => {
    if (currentStep?.binarySearchPhase === 'initialize') return 1;
    if (currentStep?.binarySearchPhase === 'calculate-mid') return 2;
    if (currentStep?.binarySearchPhase === 'compare') return 3;
    if (currentStep?.binarySearchPhase === 'decide') return 4;
    if (currentStep?.binarySearchPhase === 'eliminate') return 5;
    if (currentStep?.binarySearchPhase === 'complete') return 6;
    if (isComplete) return 6;
    return 1;
  };

  const activePhaseNum = getActivePhaseNum();

  // Pointer variables
  const low = currentStep?.low ?? 0;
  const high = currentStep?.high ?? initialArray.length - 1;
  const mid = currentStep?.mid;
  const midValue = currentStep?.midValue ?? (mid !== undefined ? initialArray[mid] : undefined);
  const eliminatedIndices = new Set(currentStep?.eliminatedIndices || []);

  // Top pointer indicator above element
  const getTopPointer = (idx: number) => {
    // Only show pointers if the search is not exhausted or if within valid bounds
    const isExhausted = low > high;
    const isLow = !isExhausted && low === idx && idx >= 0 && idx < initialArray.length;
    const isMid = mid !== undefined && mid === idx;
    const isHigh = !isExhausted && high === idx && idx >= 0 && idx < initialArray.length;

    if (isLow && isMid && isHigh) {
      return {
        label: `LOW=MID=HIGH (${idx})`,
        badgeClass: 'bg-[#F3E8FF] dark:bg-purple-950/95 border-[#C084FC] text-[#6D28D9] dark:text-purple-200',
        arrowColor: 'text-[#7C3AED] dark:text-purple-400',
      };
    }
    if (isLow && isMid) {
      return {
        label: `LOW=MID (${idx})`,
        badgeClass: 'bg-[#FFFBEB] dark:bg-amber-950/95 border-[#F59E0B] text-[#92400E] dark:text-amber-200',
        arrowColor: 'text-[#D97706] dark:text-amber-400',
      };
    }
    if (isMid && isHigh) {
      return {
        label: `MID=HIGH (${idx})`,
        badgeClass: 'bg-[#FFFBEB] dark:bg-amber-950/95 border-[#F59E0B] text-[#92400E] dark:text-amber-200',
        arrowColor: 'text-[#D97706] dark:text-amber-400',
      };
    }
    if (isLow && isHigh) {
      return {
        label: `LOW=HIGH (${idx})`,
        badgeClass: 'bg-[#F3E8FF] dark:bg-purple-950/95 border-[#C084FC] text-[#6D28D9] dark:text-purple-200',
        arrowColor: 'text-[#7C3AED] dark:text-purple-400',
      };
    }
    if (isMid) {
      return {
        label: `MID (${idx})`,
        badgeClass: 'bg-[#FFFBEB] dark:bg-amber-950/95 border-[#F59E0B] text-[#92400E] dark:text-amber-200 ring-1 ring-[#F59E0B]/40',
        arrowColor: 'text-[#D97706] dark:text-amber-400',
      };
    }
    if (isLow) {
      return {
        label: `LOW (${idx})`,
        badgeClass: 'bg-[#F0F9FF] dark:bg-sky-950/95 border-[#38BDF8] text-[#0284C7] dark:text-sky-200',
        arrowColor: 'text-[#0284C7] dark:text-sky-400',
      };
    }
    if (isHigh) {
      return {
        label: `HIGH (${idx})`,
        badgeClass: 'bg-[#F0F9FF] dark:bg-sky-950/95 border-[#38BDF8] text-[#0284C7] dark:text-sky-200',
        arrowColor: 'text-[#0284C7] dark:text-sky-400',
      };
    }
    return null;
  };

  // Comparison formula and decision badge
  const getMathFormula = () => {
    if (currentStep?.binarySearchPhase === 'initialize' || midValue === undefined) {
      return isNotFound ? 'low > high (empty)' : 'mid = pending';
    }
    if (currentStep?.binarySearchPhase === 'calculate-mid') {
      return `mid = ${low} + (${high} - ${low}) // 2 = ${mid}`;
    }
    if (targetValue === midValue) {
      return `${targetValue} === ${midValue}`;
    }
    if (targetValue < midValue) {
      return `${targetValue} < ${midValue}`;
    }
    return `${targetValue} > ${midValue}`;
  };

  const getDecisionBadge = () => {
    if (isFound) {
      return { text: 'Decision: Target Found', bg: 'bg-[#ECFDF5] dark:bg-emerald-950/80 border-[#A7F3D0] dark:border-emerald-500/80 text-[#059669] dark:text-emerald-300' };
    }
    if (isNotFound) {
      return { text: 'Decision: Target Not Found', bg: 'bg-[#FFF1F2] dark:bg-rose-950/80 border-[#FECDD3] dark:border-rose-500/80 text-[#E11D48] dark:text-rose-300' };
    }
    if (currentStep?.binarySearchPhase === 'initialize') {
      return { text: 'Decision: Search Initialized', bg: 'bg-[#F1F5F9] dark:bg-[#141B2D] border-[#CBD5E1] dark:border-[#202E4E] text-[#334155] dark:text-slate-300' };
    }
    if (currentStep?.binarySearchPhase === 'calculate-mid') {
      return { text: 'Decision: Evaluate midpoint', bg: 'bg-[#FFFBEB] dark:bg-amber-950/80 border-[#FDE68A] dark:border-amber-600/80 text-[#D97706] dark:text-amber-300' };
    }
    if (currentStep?.binarySearchPhase === 'compare') {
      if (targetValue === midValue) {
        return { text: 'Decision: Target Found', bg: 'bg-[#ECFDF5] dark:bg-emerald-950/80 border-[#A7F3D0] dark:border-emerald-500/80 text-[#059669] dark:text-emerald-300' };
      }
      return {
        text: targetValue < midValue! ? 'Decision: Target is smaller' : 'Decision: Target is greater',
        bg: 'bg-[#F0F9FF] dark:bg-sky-950/80 border-[#BAE6FD] dark:border-sky-600/80 text-[#0284C7] dark:text-sky-300',
      };
    }
    if (currentStep?.binarySearchPhase === 'decide') {
      return {
        text: targetValue < midValue! ? 'Decision: Discard right half' : 'Decision: Discard left half',
        bg: targetValue < midValue! ? 'bg-[#FFF1F2] dark:bg-rose-950/80 border-[#FECDD3] dark:border-rose-600/80 text-[#E11D48] dark:text-rose-300' : 'bg-[#FFFBEB] dark:bg-amber-950/80 border-[#FDE68A] dark:border-amber-500/80 text-[#D97706] dark:text-amber-300',
      };
    }
    if (currentStep?.binarySearchPhase === 'eliminate') {
      return {
        text: 'Decision: Range Updated',
        bg: 'bg-[#F3E8FF] dark:bg-purple-950/80 border-[#C084FC] dark:border-purple-500/80 text-[#7C3AED] dark:text-purple-300',
      };
    }
    return { text: 'Decision: Evaluate midpoint', bg: 'bg-[#F1F5F9] dark:bg-[#141B2D] border-[#CBD5E1] dark:border-[#202E4E] text-[#334155] dark:text-slate-300' };
  };

  const decisionBadge = getDecisionBadge();

  // Operation subtitle
  const getOperationSubtitle = () => {
    if (isFound) return 'The target matches the element at the midpoint.';
    if (isNotFound) return 'The search interval is exhausted. Target is not present.';
    if (currentStep?.binarySearchPhase === 'initialize') return 'Search initialized. Calculate the midpoint to begin comparison.';
    if (currentStep?.binarySearchPhase === 'calculate-mid') return `Calculated midpoint index ${mid}. Middle element is ${midValue}.`;
    if (currentStep?.binarySearchPhase === 'compare') return `Comparing target ${targetValue} with midpoint element arr[${mid}] (${midValue}).`;
    if (currentStep?.binarySearchPhase === 'decide') return targetValue < midValue! ? `Target is smaller than ${midValue}. Discard right half.` : `Target is greater than ${midValue}. Discard left half.`;
    if (currentStep?.binarySearchPhase === 'eliminate') return 'Narrow search window to remaining active subarray.';
    return 'Binary Search step executed.';
  };

  // Adaptive cell sizing based on array length to avoid horizontal scrolling
  const numElements = initialArray.length;
  const cellSizeClass =
    numElements <= 8
      ? 'w-9 sm:w-11 md:w-12 h-11 sm:h-13 md:h-14 text-xs sm:text-sm md:text-base'
      : numElements <= 12
      ? 'w-8 sm:w-9 md:w-10 h-10 sm:h-11 md:h-12 text-xs sm:text-sm'
      : numElements <= 16
      ? 'w-7 sm:w-8 md:w-8 h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs'
      : 'w-6 sm:w-7 md:w-7 h-8 sm:h-9 md:h-9 text-[10px] sm:text-[11px]';

  const colWidthClass =
    numElements <= 8
      ? 'w-9 sm:w-11 md:w-12'
      : numElements <= 12
      ? 'w-8 sm:w-9 md:w-10'
      : numElements <= 16
      ? 'w-7 sm:w-8 md:w-8'
      : 'w-6 sm:w-7 md:w-7';

  const colGapClass =
    numElements <= 8 ? 'gap-1 sm:gap-1.5' : numElements <= 12 ? 'gap-1' : 'gap-0.5';

  // Helper to render an individual array element column
  const renderElementColumn = (idx: number, isInActiveRange: boolean) => {
    const val = initialArray[idx];
    const topPointer = getTopPointer(idx);
    const isTargetMatch = isFound && currentStep?.foundIndex === idx;
    const isMid = mid === idx;
    const isEliminated = !isInActiveRange || eliminatedIndices.has(idx);

    let boxClasses = `${cellSizeClass} rounded-xl flex items-center justify-center font-mono font-bold transition-all relative select-none shadow-sm `;

    if (isTargetMatch) {
      boxClasses +=
        'bg-[#ECFDF5] dark:bg-emerald-950/90 border-2 border-[#059669] text-[#065F46] dark:text-emerald-200 shadow-[0_2px_8px_rgba(5,150,105,0.25)] scale-105 z-20';
    } else if (isMid) {
      boxClasses +=
        'bg-[#FFFBEB] dark:bg-[#1e1906] border-2 border-[#D97706] text-[#92400E] dark:text-amber-200 shadow-[0_2px_8px_rgba(217,119,6,0.25)] ring-2 ring-[#F59E0B]/50 scale-105 z-10';
    } else if (isInActiveRange) {
      boxClasses +=
        'bg-white dark:bg-[#0C152B] border-2 border-[#0284C7] text-[#0F172A] dark:text-white hover:border-[#0284C7] shadow-xs';
    } else if (isEliminated) {
      boxClasses +=
        'bg-[#F1F5F9] dark:bg-[#080C17]/80 border border-[#CBD5E1] dark:border-rose-950/50 text-[#64748B] dark:text-slate-400 opacity-80 line-through';
    } else {
      boxClasses +=
        'bg-[#F1F5F9] dark:bg-[#080C17]/80 border border-[#CBD5E1] dark:border-[#16213B] text-[#64748B] dark:text-slate-500 opacity-80';
    }

    return (
      <div key={idx} className={`flex flex-col items-center shrink-0 ${colWidthClass}`}>
        {/* Top Pointer Badge */}
        <div className="h-7 sm:h-8 flex flex-col items-center justify-end mb-1">
          {topPointer ? (
            <motion.div
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <span
                className={`px-1 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold font-mono tracking-wider border shadow-xs whitespace-nowrap ${topPointer.badgeClass}`}
              >
                {topPointer.label}
              </span>
              <span className={`text-xs leading-none mt-0.5 ${topPointer.arrowColor}`}>↓</span>
            </motion.div>
          ) : (
            <div className="h-6" />
          )}
        </div>

        {/* Index */}
        <div
          className={`h-5 mb-1 text-center text-[11px] sm:text-xs font-mono font-semibold transition-colors ${
            isMid
              ? 'text-[#D97706] dark:text-amber-400 font-bold'
              : isInActiveRange
              ? 'text-[#0284C7] dark:text-sky-400'
              : 'text-[#64748B] dark:text-slate-500'
          }`}
        >
          {idx}
        </div>

        {/* Value Box */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className={boxClasses}
        >
          {val}
          {isTargetMatch && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✓
            </span>
          )}
        </motion.div>
      </div>
    );
  };

  // Segment the array into Left-Eliminated, Active-Range, and Right-Eliminated
  const hasLeftElim = low > 0 && initialArray.length > 0;
  const leftIndices = hasLeftElim
    ? Array.from({ length: Math.min(low, initialArray.length) }, (_, i) => i)
    : [];

  const isActiveValid = low <= high && low < initialArray.length && high >= 0;
  const activeIndices = isActiveValid
    ? Array.from({ length: Math.min(high - low + 1, initialArray.length - low) }, (_, i) => low + i)
    : [];

  const hasRightElim = high < initialArray.length - 1 && high >= 0;
  const rightIndices = hasRightElim
    ? Array.from(
        { length: initialArray.length - (high + 1) },
        (_, i) => high + 1 + i
      )
    : [];

  const isExhausted = !isActiveValid && initialArray.length > 0;

  return (
    <div className="relative w-full bg-white dark:bg-[#0B0F19] border border-[#CBD5E1] dark:border-[#19243C] rounded-2xl p-4 sm:p-5 shadow-lg dark:shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 bg-blue-600/5 dark:bg-blue-600/10 blur-3xl pointer-events-none" />

      {/* Top Header: Title, 6-Phase Stepper with Connected Lines, and Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 z-10 w-full mb-3 pb-3 border-b border-[#E2E8F0] dark:border-[#141B2D]">
        {/* Left: Section Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white tracking-wide font-mono uppercase">
            Visualization
          </span>
        </div>

        {/* Center: 6-Phase Indicator with Numbered Nodes & Connecting Lines (Reference Image Callout 6) */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 overflow-x-auto scrollbar-none max-w-full">
          {phases.map((phase, idx) => {
            const isActive = activePhaseNum === phase.num;
            const isCompleted = activePhaseNum > phase.num;

            return (
              <React.Fragment key={phase.key}>
                {idx > 0 && (
                  <div
                    className={`h-0.5 w-3 sm:w-5 rounded transition-colors ${
                      isCompleted ? 'bg-purple-500/70' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.8)] ring-2 ring-purple-400/50 scale-110'
                        : isCompleted
                        ? 'bg-purple-50 dark:bg-[#18233C] text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40'
                        : 'bg-slate-100 dark:bg-[#0E1528] text-slate-500 border border-slate-300 dark:border-[#1A253E]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 text-purple-600 dark:text-purple-300" /> : phase.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono tracking-tight transition-colors hidden md:inline ${
                      isActive
                        ? 'text-purple-700 dark:text-purple-300 font-bold'
                        : isCompleted
                        ? 'text-slate-600 dark:text-slate-400 font-medium'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {phase.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Legend */}
        <div className="flex items-center gap-2.5 text-[10px] font-medium text-[#334155] dark:text-slate-300 overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="text-[#0284C7] dark:text-sky-300 font-semibold">Active Range</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span className="text-[#D97706] dark:text-amber-300 font-semibold">Mid Element</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span className="text-[#059669] dark:text-emerald-300 font-semibold">Target</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
            <span className="text-[#64748B] dark:text-slate-400">Eliminated</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1] dark:bg-slate-700" />
            <span className="text-[#64748B]">Outside Range</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Desktop Grid (Left: Array Stage, Right: Current Operation HUD) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-1 items-stretch">
        {/* Left Column: Horizontally Centered Sorted Array Stage (fits naturally, zero scrollbars) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B] rounded-2xl p-3 sm:p-4 flex flex-col justify-between items-center min-h-[340px] shadow-sm dark:shadow-inner overflow-hidden w-full">
          {/* Centered Array Stage Content */}
          <div className="w-full flex-1 flex flex-col items-center justify-center py-2">
            <div className="w-full overflow-x-auto scrollbar-none px-4 sm:px-6 py-2">
              <div className="w-fit mx-auto flex items-center shrink-0 py-1">
                {/* Group 1: Left Eliminated (if low > 0) */}
                {hasLeftElim && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#CBD5E1] dark:border-rose-500/60 bg-[#F1F5F9]/80 dark:bg-rose-950/15 p-1 sm:p-2 flex items-center ${colGapClass}`}>
                      {leftIndices.map((idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#64748B] dark:text-rose-400 mt-2 select-none">
                      Eliminated (0 - {low - 1})
                    </span>
                  </div>
                )}

                {/* Gap between left eliminated and active range */}
                {hasLeftElim && isActiveValid && <div className="w-2.5 sm:w-3 shrink-0" />}

                {/* Group 2: Active Search Range (if low <= high) */}
                {isActiveValid && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-[#0284C7] bg-[#F0F9FF]/60 dark:bg-blue-950/15 p-1.5 sm:p-2 flex items-center ${colGapClass} shadow-[0_0_24px_rgba(2,132,199,0.12)]`}>
                      {activeIndices.map((idx) => renderElementColumn(idx, true))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0284C7] dark:text-cyan-400 mt-2 select-none">
                      Active Search Range ({low} - {high})
                    </span>
                  </div>
                )}

                {/* Gap between active range and right eliminated */}
                {isActiveValid && hasRightElim && <div className="w-2.5 sm:w-3 shrink-0" />}

                {/* Group 3: Right Eliminated (if high < length - 1) */}
                {hasRightElim && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#CBD5E1] dark:border-rose-500/60 bg-[#F1F5F9]/80 dark:bg-rose-950/15 p-1 sm:p-2 flex items-center ${colGapClass}`}>
                      {rightIndices.map((idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#64748B] dark:text-rose-400 mt-2 select-none">
                      Eliminated ({high + 1} - {initialArray.length - 1})
                    </span>
                  </div>
                )}

                {/* Group 4: Search Exhausted (if low > high) */}
                {isExhausted && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#E11D48]/60 dark:border-rose-500/70 bg-[#FFF1F2]/80 dark:bg-rose-950/20 p-1.5 sm:p-2 flex items-center ${colGapClass}`}>
                      {initialArray.map((_, idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#E11D48] dark:text-rose-400 mt-2 select-none">
                      Search Range Empty (Exhausted)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Below elements: LOW, MID, HIGH pointer summary cards (Placed below array, centered) */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 pt-3 border-t border-[#E2E8F0] dark:border-[#141B2D]/80 shrink-0">
            {/* LOW Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#F0F9FF] dark:bg-purple-950/40 border border-[#BAE6FD] dark:border-purple-800/40 min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0284C7] dark:text-purple-400 uppercase tracking-wider">LOW</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0F172A] dark:text-slate-200 mt-0.5">
                {low <= high && low < initialArray.length ? `idx = ${low}` : 'crossed'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#0284C7] dark:text-purple-300">
                {low <= high && low < initialArray.length ? `val = ${initialArray[low] ?? '—'}` : '—'}
              </span>
            </div>

            {/* MID Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-800/40 min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#D97706] dark:text-amber-400 uppercase tracking-wider">MID</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0F172A] dark:text-slate-200 mt-0.5">
                {mid !== undefined ? `idx = ${mid}` : 'pending'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#D97706] dark:text-amber-300">
                {midValue !== undefined ? `val = ${midValue}` : '—'}
              </span>
            </div>

            {/* HIGH Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#F0F9FF] dark:bg-cyan-950/40 border border-[#BAE6FD] dark:border-cyan-800/40 min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0284C7] dark:text-cyan-400 uppercase tracking-wider">HIGH</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0F172A] dark:text-slate-200 mt-0.5">
                {high >= 0 && high < initialArray.length && low <= high ? `idx = ${high}` : 'crossed'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#0284C7] dark:text-cyan-300">
                {high >= 0 && high < initialArray.length && low <= high ? `val = ${initialArray[high] ?? '—'}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols on lg, 4 on xl): Dedicated Current Operation Card */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#F8FAFC] dark:bg-[#090E1C] border border-[#CBD5E1] dark:border-[#17233E] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-sm dark:shadow-xl min-h-[340px]">
          <div className="flex flex-col gap-3">
            {/* Header: Title and Step Badge */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0] dark:border-[#141C30]">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-mono">
                  Current Operation
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
            </div>

            {/* Subheading: Phase action title & subtitle */}
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                {isFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : isNotFound ? (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                ) : (
                  <span className="text-amber-600 dark:text-amber-400 text-base">💡</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#0F172A] dark:text-white font-mono">
                  {currentStep?.action || 'Search Initialized'}
                </span>
                <span className="text-[11px] text-[#475569] dark:text-slate-400 leading-tight">
                  {getOperationSubtitle()}
                </span>
              </div>
            </div>

            {/* Side-by-Side Target vs A[mid] Cards */}
            <div className="flex items-center justify-between gap-1 my-1">
              {/* Target Box */}
              <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 dark:bg-[#071618] border border-emerald-300 dark:border-emerald-500/40 rounded-xl p-2.5 shadow-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Target
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 dark:text-emerald-300 mt-0.5">
                  {targetValue}
                </span>
              </div>

              {/* VS Divider Badge */}
              <div className="w-7 h-7 rounded-full bg-white dark:bg-[#11192C] border border-slate-300 dark:border-[#202E4E] text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center shrink-0 z-10 -mx-2">
                VS
              </div>

              {/* A[mid] Box */}
              <div className="flex-1 flex flex-col items-center justify-center bg-amber-50 dark:bg-[#181408] border border-amber-300 dark:border-amber-500/40 rounded-xl p-2.5 shadow-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  A[mid]
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-amber-800 dark:text-amber-300 mt-0.5">
                  {midValue !== undefined ? midValue : '—'}
                </span>
              </div>
            </div>

            {/* Math Formula Bar & Decision Badge */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-[#070B16] border border-[#CBD5E1] dark:border-[#16213B]">
              <span className="text-sm sm:text-base font-bold font-mono text-[#0F172A] dark:text-white">
                {getMathFormula()}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight border ${decisionBadge.bg}`}>
                {decisionBadge.text}
              </span>
            </div>

            {/* Pointer Details Rows */}
            <div className="flex flex-col gap-1.5 text-xs font-mono pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569] dark:text-slate-400">Low Pointer (left)</span>
                <span className="text-purple-700 dark:text-purple-300 font-semibold">
                  {low <= high && low < initialArray.length
                    ? `idx = ${low} → val = ${initialArray[low] ?? '—'}`
                    : `idx = ${low} (crossed)`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569] dark:text-slate-400">Mid Pointer (mid)</span>
                <span className="text-amber-700 dark:text-amber-300 font-semibold">
                  {mid !== undefined ? `idx = ${mid} → val = ${midValue}` : '— (pending)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569] dark:text-slate-400">High Pointer (right)</span>
                <span className="text-cyan-700 dark:text-cyan-300 font-semibold">
                  {high >= 0 && high < initialArray.length && low <= high
                    ? `idx = ${high} → val = ${initialArray[high] ?? '—'}`
                    : `idx = ${high} (crossed)`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569] dark:text-slate-400">Current Range</span>
                <span className="text-[#0F172A] dark:text-slate-200 font-semibold">
                  {low <= high ? `[ ${low} — ${high} ]` : 'Empty (Exhausted)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569] dark:text-slate-400">Next Action</span>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold truncate max-w-[190px]">
                  {currentStep?.nextActionLabel || 'Evaluate midpoint'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context Tip */}
          <div className="mt-3 pt-2 border-t border-[#E2E8F0] dark:border-[#141C30] flex items-center gap-1.5 text-[10px] text-[#64748B] dark:text-slate-400 font-sans">
            <HelpCircle className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-500 shrink-0" />
            <span className="truncate">
              {isFound
                ? 'Target successfully located at current midpoint.'
                : isNotFound
                ? 'Low and high have crossed. Value absent from array.'
                : currentStep?.type === 'initial'
                ? 'Search initialized. Calculate the midpoint to begin comparison.'
                : 'Pointers dictate the next search subarray boundary.'}
            </span>
          </div>
        </div>
      </div>

      {/* Integrated Bottom Playback Controls */}
      <div className="mt-3 pt-3 border-t border-[#E2E8F0] dark:border-[#141B2D]">
        <PlaybackControls />
      </div>
    </div>
  );
};


