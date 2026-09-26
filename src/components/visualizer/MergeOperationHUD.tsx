import React from 'react';
import { GitMerge, Sparkles, CheckCircle2, Split, ArrowDownRight, Layers } from 'lucide-react';
import type { AlgorithmStep } from '../../algorithms/types';

interface MergeOperationHUDProps {
  currentStep: AlgorithmStep;
}

export const MergeOperationHUD: React.FC<MergeOperationHUDProps> = ({ currentStep }) => {
  const isMerge =
    currentStep.phase === 'merge' ||
    currentStep.type === 'compare' ||
    currentStep.type === 'take-left' ||
    currentStep.type === 'take-right' ||
    currentStep.type === 'write' ||
    currentStep.type === 'merge-start' ||
    currentStep.type === 'merge-complete';

  const isComplete = currentStep.type === 'complete';
  const isDivide = currentStep.type === 'divide' || currentStep.type === 'enter-range';
  const isBaseCase = currentStep.type === 'base-case';

  // Level & Merge label
  const levelText = `LEVEL ${currentStep.recursionLevel ?? 0}`;
  const mergeProgress =
    currentStep.totalMerges && currentStep.totalMerges > 0
      ? `MERGE ${currentStep.mergeCount ?? 0} OF ${currentStep.totalMerges}`
      : `STEP ${currentStep.stepIndex ?? 0}`;

  // Action badge and colors
  const getPhaseDetails = () => {
    if (isComplete) {
      return {
        title: 'COMPLETE',
        subtitle: 'All recursive calls completed and merged.',
        badge: 'SORTING COMPLETE',
        badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/50',
        icon: <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-emerald-400" />,
      };
    }
    if (currentStep.type === 'merge-complete') {
      return {
        title: 'MERGE COMPLETE',
        subtitle: `Range [${currentStep.mergeRange?.[0]} — ${currentStep.mergeRange?.[1]}] is now fully merged and sorted.`,
        badge: 'MERGED',
        badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/50',
        icon: <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-emerald-400" />,
      };
    }
    if (currentStep.type === 'append-left') {
      return {
        title: 'COPY REMAINING LEFT',
        subtitle: `Right subarray exhausted. Taking remaining ${currentStep.chosenValue} from left subarray.`,
        badge: 'APPEND LEFT',
        badgeClass: 'bg-[#F3E8FF] text-[#6D28D9] border-[#C084FC] dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />,
      };
    }
    if (currentStep.type === 'append-right') {
      return {
        title: 'COPY REMAINING RIGHT',
        subtitle: `Left subarray exhausted. Taking remaining ${currentStep.chosenValue} from right subarray.`,
        badge: 'APPEND RIGHT',
        badgeClass: 'bg-[#F3E8FF] text-[#6D28D9] border-[#C084FC] dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />,
      };
    }
    if (currentStep.type === 'take-left') {
      return {
        title: 'TAKE LEFT',
        subtitle: `Selected ${currentStep.chosenValue} from left subarray.`,
        badge: 'TAKE LEFT',
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECDD3] dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#DC2626] dark:text-rose-400" />,
      };
    }
    if (currentStep.type === 'take-right') {
      return {
        title: 'TAKE RIGHT',
        subtitle: `Selected ${currentStep.chosenValue} from right subarray.`,
        badge: 'TAKE RIGHT',
        badgeClass: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECDD3] dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#DC2626] dark:text-rose-400" />,
      };
    }
    if (currentStep.type === 'write') {
      return {
        title: 'WRITE TO BUFFER',
        subtitle: `Placed value ${currentStep.chosenValue} into output buffer slot k = ${currentStep.outputPointer}.`,
        badge: `WRITE ${currentStep.chosenValue}`,
        badgeClass: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD] dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/50',
        icon: <ArrowDownRight className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />,
      };
    }
    if (currentStep.type === 'compare') {
      return {
        title: 'COMPARING',
        subtitle: 'Compare the front elements from left and right subarrays.',
        badge: 'COMPARING',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#B45309] dark:text-amber-400" />,
      };
    }
    if (currentStep.type === 'merge-start') {
      return {
        title: 'MERGE START',
        subtitle: `Beginning merge on range [${currentStep.mergeRange?.[0]} — ${currentStep.mergeRange?.[1]}].`,
        badge: 'START',
        badgeClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500/50',
        icon: <GitMerge className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />,
      };
    }
    if (isBaseCase) {
      return {
        title: 'BASE CASE',
        subtitle: 'Subarray has 1 element. Already sorted by definition.',
        badge: 'RETURN',
        badgeClass: 'bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD] dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/50',
        icon: <CheckCircle2 className="w-4 h-4 text-[#0369A1] dark:text-cyan-400" />,
      };
    }
    if (isDivide) {
      return {
        title: 'DIVIDING',
        subtitle: 'Dividing active subarray at midpoint into two halves.',
        badge: 'DIVIDE',
        badgeClass: 'bg-[#F3E8FF] text-[#6D28D9] border-[#C084FC] dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/50',
        icon: <Split className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />,
      };
    }
    return {
      title: 'INITIALIZING',
      subtitle: 'Merge Sort initialized and ready to run.',
      badge: 'READY',
      badgeClass: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1] dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700',
      icon: <Sparkles className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />,
    };
  };

  const details = getPhaseDetails();

  // Mini Current Merge State values
  const leftStart = currentStep.leftRange ? currentStep.leftRange[0] : 0;
  const leftEnd = currentStep.leftRange ? currentStep.leftRange[1] : 0;
  const rightStart = currentStep.rightRange ? currentStep.rightRange[0] : 0;
  const rightEnd = currentStep.rightRange ? currentStep.rightRange[1] : 0;

  const leftSub = currentStep.leftSubarray || [];
  const rightSub = currentStep.rightSubarray || [];
  const mergedOut = currentStep.mergedOutput || [];
  const totalSlots = currentStep.mergeRange ? currentStep.mergeRange[1] - currentStep.mergeRange[0] + 1 : 0;

  const leftLocalPtr = currentStep.leftPointer !== undefined ? currentStep.leftPointer : -1;
  const rightLocalPtr = currentStep.rightPointer !== undefined ? currentStep.rightPointer : -1;
  const isLeftExhausted = leftSub.length > 0 && leftLocalPtr >= leftSub.length;
  const isRightExhausted = rightSub.length > 0 && rightLocalPtr >= rightSub.length;

  return (
    <div className="flex flex-col gap-3 h-full justify-between">
      {/* 1. Main Operation Box */}
      <div className="bg-white dark:bg-[#0C1222] border border-[#CBD5E1] dark:border-[#192642] rounded-xl p-3.5 flex flex-col gap-2.5 shadow-sm">
        {/* Header with Level & Merge counter */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#16213A] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F3E8FF] dark:bg-purple-950/60 border border-[#C084FC] dark:border-purple-600/40 flex items-center justify-center text-[#7C3AED] dark:text-purple-400">
              {details.icon}
            </div>
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-slate-200 uppercase font-mono tracking-wider">
              Current Operation
            </span>
          </div>

          <div className="text-[10px] font-mono font-semibold text-[#475569] dark:text-slate-400">
            <span className="text-[#6D28D9] dark:text-purple-300">{levelText}</span> · {mergeProgress}
          </div>
        </div>

        {/* Phase Title & Subtitle */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase font-mono tracking-wide">
            {details.title}
          </span>
          <span className="text-[11px] text-[#475569] dark:text-slate-400 leading-snug">
            {details.subtitle}
          </span>
        </div>

        {/* Dynamic Context Card based on Operation */}
        {currentStep.type === 'write' ? (
          /* WRITE OPERATION CARD */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between gap-2 font-mono text-xs">
              <div className="flex-1 bg-[#F0F9FF] dark:bg-[#07151D] border border-[#BAE6FD] dark:border-cyan-700/50 rounded-lg p-2 text-center shadow-xs">
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-sans">Written Value</div>
                <div className="text-base font-bold text-[#0369A1] dark:text-cyan-300 mt-0.5">{currentStep.chosenValue}</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-white dark:bg-[#0E202B] border border-[#CBD5E1] dark:border-cyan-800/40 flex items-center justify-center font-bold text-[#0369A1] dark:text-cyan-400 text-xs shrink-0 shadow-xs">
                →
              </div>
              <div className="flex-1 bg-[#ECFDF5] dark:bg-[#07151D] border border-[#A7F3D0] dark:border-emerald-700/50 rounded-lg p-2 text-center shadow-xs">
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-sans">Target Position</div>
                <div className="text-base font-bold text-[#047857] dark:text-emerald-300 mt-0.5">output[{currentStep.outputPointer}]</div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#172238] rounded-lg px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase">Action</span>
                <span className="text-xs font-mono font-bold text-[#0369A1] dark:text-cyan-300">
                  output[{currentStep.outputPointer}] = {currentStep.chosenValue}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-lg border text-xs font-bold font-mono uppercase tracking-wider shadow-sm ${details.badgeClass}`}>
                {details.badge}
              </div>
            </div>
          </div>
        ) : (currentStep.type === 'append-left' || currentStep.type === 'append-right') ? (
          /* EXHAUSTED / APPEND CARD */
          <div className="flex flex-col gap-2 pt-1">
            <div className="bg-[#F3E8FF] dark:bg-[#120D1F] border border-[#C084FC] dark:border-purple-800/50 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#6D28D9] dark:text-purple-300 uppercase font-mono font-bold">
                  {currentStep.type === 'append-left' ? 'Right Side Exhausted' : 'Left Side Exhausted'}
                </span>
                <span className="text-xs font-mono text-[#0F172A] dark:text-white mt-0.5">
                  Append {currentStep.chosenValue} from {currentStep.type === 'append-left' ? 'Left' : 'Right'}
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-[#6D28D9] dark:text-purple-300">
                {currentStep.chosenValue}
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#172238] rounded-lg px-3 py-2">
              <span className="text-[11px] font-mono text-[#475569] dark:text-slate-400">
                Direct copy remaining sorted elements
              </span>
              <div className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold font-mono uppercase ${details.badgeClass}`}>
                {details.badge}
              </div>
            </div>
          </div>
        ) : currentStep.type === 'compare' ? (
          /* COMPARISON HUD DETAILS */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between gap-2 font-mono text-xs">
              {/* Left Candidate */}
              <div
                className={`flex-1 rounded-lg p-2 text-center border shadow-xs ${
                  currentStep.chosenFrom === 'left'
                    ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857] dark:bg-emerald-950/40 dark:border-emerald-500/60'
                    : 'bg-[#FFFBEB] border border-[#FDE68A] dark:bg-[#090F1C] dark:border-amber-600/50'
                }`}
              >
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-sans">
                  Left: arr[{leftStart + (leftLocalPtr >= 0 ? leftLocalPtr : 0)}]
                </div>
                <div className="text-base font-bold text-[#B45309] dark:text-amber-300 mt-0.5">
                  {currentStep.leftValue ?? '—'}
                </div>
                <span className="text-[9px] text-[#64748B] dark:text-slate-400">i = {leftLocalPtr}</span>
              </div>

              {/* Operator Pill */}
              <div className="w-7 h-7 rounded-full bg-white dark:bg-[#141C30] border border-[#CBD5E1] dark:border-[#233150] flex items-center justify-center font-bold text-[#475569] dark:text-slate-300 text-xs shrink-0 shadow-xs">
                {currentStep.decisionLabel?.includes('<=') ? '≤' : currentStep.decisionLabel?.includes('<') ? '<' : 'vs'}
              </div>

              {/* Right Candidate */}
              <div
                className={`flex-1 rounded-lg p-2 text-center border shadow-xs ${
                  currentStep.chosenFrom === 'right'
                    ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857] dark:bg-emerald-950/40 dark:border-emerald-500/60'
                    : 'bg-[#EFF6FF] border border-[#BFDBFE] dark:bg-[#090F1C] dark:border-blue-600/50'
                }`}
              >
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 font-sans">
                  Right: arr[{rightStart + (rightLocalPtr >= 0 ? rightLocalPtr : 0)}]
                </div>
                <div className="text-base font-bold text-[#2563EB] dark:text-blue-300 mt-0.5">
                  {currentStep.rightValue ?? '—'}
                </div>
                <span className="text-[9px] text-[#64748B] dark:text-slate-400">j = {rightLocalPtr}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#172238] rounded-lg px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase">Decision</span>
                <span className="text-xs font-mono font-bold text-[#0F172A] dark:text-white">
                  {currentStep.decisionLabel || 'Evaluating candidates'}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono uppercase tracking-wider shadow-sm ${details.badgeClass}`}>
                {details.badge}
              </div>
            </div>
          </div>
        ) : (
          /* GENERIC STAGE CARD */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#172238] rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-[#475569] dark:text-slate-300">
                {currentStep.action}
              </span>
              <div className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-bold font-mono uppercase ${details.badgeClass}`}>
                {details.badge}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Subpanel: CURRENT MERGE STATE */}
      <div className="bg-[#F8FAFC] dark:bg-[#090E1C] border border-[#CBD5E1] dark:border-[#18243C] rounded-xl p-3 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#141E34] pb-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span className="text-[10px] font-bold text-[#0F172A] dark:text-slate-300 uppercase font-mono tracking-wider">
              Current Merge State
            </span>
          </div>
          {currentStep.mergeRange && (
            <span className="text-[10px] font-mono text-[#64748B] dark:text-slate-500">
              [{currentStep.mergeRange[0]} — {currentStep.mergeRange[1]}]
            </span>
          )}
        </div>

        {isMerge && currentStep.leftRange && currentStep.rightRange ? (
          <div className="flex flex-col gap-2 text-xs">
            {/* Left Array & Right Array mini row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left Subarray */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-white dark:bg-[#0C1529] border border-[#CBD5E1] dark:border-[#1E2E50] shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-slate-400">
                  <span>Left ({leftStart}-{leftEnd})</span>
                  <span className={`font-bold ${isLeftExhausted ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#B45309] dark:text-amber-400'}`}>
                    i = {isLeftExhausted ? 'exhausted' : leftLocalPtr >= 0 ? leftLocalPtr : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {leftSub.map((v, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                        i === leftLocalPtr
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/60'
                          : i < leftLocalPtr
                          ? 'text-[#94A3B8] dark:text-slate-600 line-through opacity-70'
                          : 'bg-[#EFF6FF] text-[#2563EB] dark:bg-[#152345] dark:text-blue-200'
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Subarray */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-white dark:bg-[#0C1529] border border-[#CBD5E1] dark:border-[#1E2E50] shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] dark:text-slate-400">
                  <span>Right ({rightStart}-{rightEnd})</span>
                  <span className={`font-bold ${isRightExhausted ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#2563EB] dark:text-blue-400'}`}>
                    j = {isRightExhausted ? 'exhausted' : rightLocalPtr >= 0 ? rightLocalPtr : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {rightSub.map((v, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                        i === rightLocalPtr
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A] dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/60'
                          : i < rightLocalPtr
                          ? 'text-[#94A3B8] dark:text-slate-600 line-through opacity-70'
                          : 'bg-[#EFF6FF] text-[#2563EB] dark:bg-[#152345] dark:text-blue-200'
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Merged Output Buffer */}
            <div className="flex flex-col gap-1 p-2 rounded-lg bg-white dark:bg-[#07131A] border border-[#CBD5E1] dark:border-[#142C33] shadow-xs">
              <div className="text-[10px] font-mono text-[#0369A1] dark:text-cyan-300 font-semibold">
                Merged Output ({currentStep.mergeRange ? `${currentStep.mergeRange[0]}-${currentStep.mergeRange[1]}` : ''})
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {Array.from({ length: totalSlots }).map((_, slotIdx) => {
                  const val = mergedOut[slotIdx];
                  const hasVal = val !== null && val !== undefined;
                  return (
                    <span
                      key={slotIdx}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        hasVal
                          ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600/40'
                          : 'border border-dashed border-[#CBD5E1] text-[#94A3B8] px-2 dark:border-[#1E2E48] dark:text-slate-600'
                      }`}
                    >
                      {hasVal ? val : '·'}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-[#64748B] dark:text-slate-500 py-1 text-center">
            {currentStep.activeRange
              ? isDivide
                ? `Dividing range [${currentStep.activeRange[0]} — ${currentStep.activeRange[1]}]`
                : isBaseCase
                ? `Base case at index [${currentStep.activeRange[0]}]`
                : 'Subarrays will appear during merge phases.'
              : 'Subarrays will appear during merge phases.'}
          </div>
        )}
      </div>
    </div>
  );
};
