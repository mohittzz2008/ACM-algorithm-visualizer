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
        badgeClass: 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309]',
        arrowColor: 'text-[#D97706]',
      };
    }
    if (isLow && isMid) {
      return {
        label: `LOW=MID (${idx})`,
        badgeClass: 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309]',
        arrowColor: 'text-[#D97706]',
      };
    }
    if (isMid && isHigh) {
      return {
        label: `MID=HIGH (${idx})`,
        badgeClass: 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309]',
        arrowColor: 'text-[#D97706]',
      };
    }
    if (isLow && isHigh) {
      return {
        label: `LOW=HIGH (${idx})`,
        badgeClass: 'bg-[#F8FAFC] border-[#3F3F3F] text-[#3F3F3F]',
        arrowColor: 'text-[#3F3F3F]',
      };
    }
    if (isMid) {
      return {
        label: `MID (${idx})`,
        badgeClass: 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309] ring-1 ring-[#FFC107]/50',
        arrowColor: 'text-[#D97706]',
      };
    }
    if (isLow) {
      return {
        label: `LOW (${idx})`,
        badgeClass: 'bg-[#F0F9FF] border-[#38BDF8] text-[#0284C7]',
        arrowColor: 'text-[#0284C7]',
      };
    }
    if (isHigh) {
      return {
        label: `HIGH (${idx})`,
        badgeClass: 'bg-[#F0F9FF] border-[#38BDF8] text-[#0284C7]',
        arrowColor: 'text-[#0284C7]',
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
      return { text: 'Decision: Target Found', bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' };
    }
    if (isNotFound) {
      return { text: 'Decision: Target Not Found', bg: 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]' };
    }
    if (currentStep?.binarySearchPhase === 'initialize') {
      return { text: 'Decision: Search Initialized', bg: 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]' };
    }
    if (currentStep?.binarySearchPhase === 'calculate-mid') {
      return { text: 'Decision: Evaluate midpoint', bg: 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]' };
    }
    if (currentStep?.binarySearchPhase === 'compare') {
      if (targetValue === midValue) {
        return { text: 'Decision: Target Found', bg: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#059669]' };
      }
      return {
        text: targetValue < midValue! ? 'Decision: Target is smaller' : 'Decision: Target is greater',
        bg: 'bg-[#F0F9FF] border-[#BAE6FD] text-[#0284C7]',
      };
    }
    if (currentStep?.binarySearchPhase === 'decide') {
      return {
        text: targetValue < midValue! ? 'Decision: Discard right half' : 'Decision: Discard left half',
        bg: targetValue < midValue! ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#E11D48]' : 'bg-[#FFFBEB] border-[#FDE68A] text-[#D97706]',
      };
    }
    if (currentStep?.binarySearchPhase === 'eliminate') {
      return {
        text: 'Decision: Range Updated',
        bg: 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309]',
      };
    }
    return { text: 'Decision: Evaluate midpoint', bg: 'bg-[#F8FAFC] border-[#CBD5E1] text-[#334155]' };
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

    let boxClasses = `${cellSizeClass} rounded-xl flex items-center justify-center font-mono font-bold transition-colors relative select-none shadow-sm `;

    if (isTargetMatch) {
      boxClasses +=
        'bg-[#ECFDF5] border-2 border-[#059669] text-[#065F46] shadow-[0_2px_8px_rgba(5,150,105,0.25)] scale-105 z-20';
    } else if (isMid) {
      boxClasses +=
        'bg-[#FFFBEB] border-2 border-[#D97706] text-[#92400E] shadow-[0_2px_8px_rgba(217,119,6,0.25)] ring-2 ring-[#FFC107]/50 scale-105 z-10';
    } else if (isInActiveRange) {
      boxClasses +=
        'bg-white border-2 border-[#0284C7] text-[#0F172A] hover:border-[#0284C7] shadow-xs';
    } else if (isEliminated) {
      boxClasses +=
        'bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] opacity-80 line-through';
    } else {
      boxClasses +=
        'bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] opacity-80';
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
              ? 'text-[#D97706] font-bold'
              : isInActiveRange
              ? 'text-[#0284C7]'
              : 'text-[#64748B]'
          }`}
        >
          {idx}
        </div>

        {/* Value Box */}
        <div className={boxClasses}>
          {val}
          {isTargetMatch && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✓
            </span>
          )}
        </div>
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
    <div className="relative w-full bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-clean-card flex flex-col justify-between overflow-hidden">
      {/* Top Header: Title, 6-Phase Stepper with Connected Lines, and Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 z-10 w-full mb-3 pb-3 border-b border-[#E2E8F0]">
        {/* Left: Section Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-[#FFC107]/15 border border-[#FFC107]/40 flex items-center justify-center">
            <Search className="w-3.5 h-3.5 text-[#B45309]" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#18181B] tracking-wide font-mono uppercase">
            Visualization
          </span>
        </div>

        {/* Center: 6-Phase Indicator with Numbered Nodes & Connecting Lines */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 overflow-x-auto scrollbar-none max-w-full">
          {phases.map((phase, idx) => {
            const isActive = activePhaseNum === phase.num;
            const isCompleted = activePhaseNum > phase.num;

            return (
              <React.Fragment key={phase.key}>
                {idx > 0 && (
                  <div
                    className={`h-0.5 w-3 sm:w-5 rounded transition-colors ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-[background-color,transform,color] ${
                      isActive
                        ? 'bg-[#FFC107] text-[#18181B] shadow-[0_0_10px_rgba(255,193,7,0.5)] ring-2 ring-[#FFC107]/50 scale-110'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 text-emerald-600" /> : phase.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-mono tracking-tight transition-colors hidden md:inline ${
                      isActive
                        ? 'text-[#18181B] font-bold'
                        : isCompleted
                        ? 'text-slate-600 font-medium'
                        : 'text-slate-400'
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
        <div className="flex items-center gap-2.5 text-[10px] font-medium text-[#3F3F3F] overflow-x-auto scrollbar-none shrink-0">
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="text-[#0284C7] font-semibold">Active Range</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
            <span className="text-[#B45309] font-semibold">Mid Element</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#059669]" />
            <span className="text-[#059669] font-semibold">Target</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
            <span className="text-[#64748B]">Eliminated</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#CBD5E1]" />
            <span className="text-[#64748B]">Outside Range</span>
          </div>
        </div>
      </div>

      {/* Main Workspace: 2-Column Desktop Grid (Left: Array Stage, Right: Current Operation HUD) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 my-1 items-stretch min-w-0">
        {/* Left Column: Horizontally Centered Sorted Array Stage */}
        <div className="xl:col-span-7 2xl:col-span-8 bg-[#FAFAFA] border border-[#E2E8F0] rounded-2xl p-3 sm:p-4 flex flex-col justify-between items-center min-h-[340px] shadow-sm overflow-hidden w-full min-w-0">
          {/* Centered Array Stage Content */}
          <div className="w-full flex-1 flex flex-col items-center justify-center py-2">
            <div className="w-full overflow-x-auto scrollbar-none px-4 sm:px-6 py-2">
              <div className="w-fit mx-auto flex items-center shrink-0 py-1">
                {/* Group 1: Left Eliminated (if low > 0) */}
                {hasLeftElim && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F1F5F9]/80 p-1 sm:p-2 flex items-center ${colGapClass}`}>
                      {leftIndices.map((idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#64748B] mt-2 select-none">
                      Eliminated (0 - {low - 1})
                    </span>
                  </div>
                )}

                {/* Gap between left eliminated and active range */}
                {hasLeftElim && isActiveValid && <div className="w-2.5 sm:w-3 shrink-0" />}

                {/* Group 2: Active Search Range (if low <= high) */}
                {isActiveValid && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-[#0284C7] bg-[#F0F9FF]/70 p-1.5 sm:p-2 flex items-center ${colGapClass} shadow-[0_0_16px_rgba(2,132,199,0.08)]`}>
                      {activeIndices.map((idx) => renderElementColumn(idx, true))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#0284C7] mt-2 select-none">
                      Active Search Range ({low} - {high})
                    </span>
                  </div>
                )}

                {/* Gap between active range and right eliminated */}
                {isActiveValid && hasRightElim && <div className="w-2.5 sm:w-3 shrink-0" />}

                {/* Group 3: Right Eliminated (if high < length - 1) */}
                {hasRightElim && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F1F5F9]/80 p-1 sm:p-2 flex items-center ${colGapClass}`}>
                      {rightIndices.map((idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-[#64748B] mt-2 select-none">
                      Eliminated ({high + 1} - {initialArray.length - 1})
                    </span>
                  </div>
                )}

                {/* Group 4: Search Exhausted (if low > high) */}
                {isExhausted && (
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`rounded-xl border-2 border-dashed border-[#E11D48]/60 bg-[#FFF1F2]/80 p-1.5 sm:p-2 flex items-center ${colGapClass}`}>
                      {initialArray.map((_, idx) => renderElementColumn(idx, false))}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#E11D48] mt-2 select-none">
                      Search Range Empty (Exhausted)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Below elements: LOW, MID, HIGH pointer summary cards */}
          <div className="w-full flex items-center justify-center gap-2 sm:gap-4 pt-3 border-t border-[#E2E8F0] shrink-0">
            {/* LOW Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0284C7] uppercase tracking-wider">LOW</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#18181B] mt-0.5">
                {low <= high && low < initialArray.length ? `idx = ${low}` : 'crossed'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#0284C7]">
                {low <= high && low < initialArray.length ? `val = ${initialArray[low] ?? '—'}` : '—'}
              </span>
            </div>

            {/* MID Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#B45309] uppercase tracking-wider">MID</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#18181B] mt-0.5">
                {mid !== undefined ? `idx = ${mid}` : 'pending'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#B45309]">
                {midValue !== undefined ? `val = ${midValue}` : '—'}
              </span>
            </div>

            {/* HIGH Card */}
            <div className="flex flex-col items-center px-2.5 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] min-w-[75px] sm:min-w-[85px] shadow-xs">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#0284C7] uppercase tracking-wider">HIGH</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold text-[#18181B] mt-0.5">
                {high >= 0 && high < initialArray.length && low <= high ? `idx = ${high}` : 'crossed'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-[#0284C7]">
                {high >= 0 && high < initialArray.length && low <= high ? `val = ${initialArray[high] ?? '—'}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dedicated Current Operation Card */}
        <div className="xl:col-span-5 2xl:col-span-4 bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-clean-card min-h-[340px] min-w-0">
          <div className="flex flex-col gap-3">
            {/* Header: Title and Step Badge */}
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#3F3F3F]" />
                <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
                  Current Operation
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-[#3F3F3F] bg-[#F1F5F9] px-2 py-0.5 rounded-md border border-[#E2E8F0]">
                Step {currentStepIndex + 1} / {steps.length}
              </div>
            </div>

            {/* Subheading: Phase action title & subtitle */}
            <div className="flex items-start gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFC107]/20 border border-[#FFC107]/40 flex items-center justify-center text-[#B45309] shrink-0 mt-0.5">
                {isFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isNotFound ? (
                  <XCircle className="w-4 h-4 text-rose-600" />
                ) : (
                  <span className="text-[#B45309] text-base">💡</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#18181B] font-mono">
                  {currentStep?.action || 'Search Initialized'}
                </span>
                <span className="text-[11px] text-[#475569] leading-tight">
                  {getOperationSubtitle()}
                </span>
              </div>
            </div>

            {/* Side-by-Side Target vs A[mid] Cards */}
            <div className="flex items-center justify-between gap-1 my-1">
              {/* Target Box */}
              <div className="flex-1 flex flex-col items-center justify-center bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 shadow-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                  Target
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-800 mt-0.5">
                  {targetValue}
                </span>
              </div>

              {/* VS Divider Badge */}
              <div className="w-7 h-7 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[10px] font-mono font-bold text-[#3F3F3F] flex items-center justify-center shrink-0 z-10 -mx-2">
                VS
              </div>

              {/* A[mid] Box */}
              <div className="flex-1 flex flex-col items-center justify-center bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-2.5 shadow-sm">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B45309]">
                  A[mid]
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#92400E] mt-0.5">
                  {midValue !== undefined ? midValue : '—'}
                </span>
              </div>
            </div>

            {/* Math Formula Bar & Decision Badge */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-sm sm:text-base font-bold font-mono text-[#18181B]">
                {getMathFormula()}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-tight border ${decisionBadge.bg}`}>
                {decisionBadge.text}
              </span>
            </div>

            {/* Pointer Details Rows */}
            <div className="flex flex-col gap-1.5 text-xs font-mono pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569]">Low Pointer (left)</span>
                <span className="text-[#0284C7] font-semibold">
                  {low <= high && low < initialArray.length
                    ? `idx = ${low} → val = ${initialArray[low] ?? '—'}`
                    : `idx = ${low} (crossed)`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569]">Mid Pointer (mid)</span>
                <span className="text-[#B45309] font-semibold">
                  {mid !== undefined ? `idx = ${mid} → val = ${midValue}` : '— (pending)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569]">High Pointer (right)</span>
                <span className="text-[#0284C7] font-semibold">
                  {high >= 0 && high < initialArray.length && low <= high
                    ? `idx = ${high} → val = ${initialArray[high] ?? '—'}`
                    : `idx = ${high} (crossed)`}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569]">Current Range</span>
                <span className="text-[#18181B] font-semibold">
                  {low <= high ? `[ ${low} — ${high} ]` : 'Empty (Exhausted)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#475569]">Next Action</span>
                <span className="text-emerald-700 font-semibold truncate max-w-[190px]">
                  {currentStep?.nextActionLabel || 'Evaluate midpoint'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Context Tip */}
          <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex items-center gap-1.5 text-[10px] text-[#64748B] font-sans">
            <HelpCircle className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
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
      <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
        <PlaybackControls />
      </div>
    </div>
  );
};


