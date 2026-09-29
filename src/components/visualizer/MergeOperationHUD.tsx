import React from 'react';
import { GitMerge, CheckCircle2, Split, ArrowDownRight, Layers } from 'lucide-react';
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
        badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
        icon: <CheckCircle2 className="w-4 h-4 text-[#047857]" />,
      };
    }
    if (currentStep.type === 'merge-complete') {
      return {
        title: 'MERGE COMPLETE',
        subtitle: `Range [${currentStep.mergeRange?.[0]} — ${currentStep.mergeRange?.[1]}] is now fully merged and sorted.`,
        badge: 'MERGED',
        badgeClass: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
        icon: <CheckCircle2 className="w-4 h-4 text-[#047857]" />,
      };
    }
    if (currentStep.type === 'append-left') {
      return {
        title: 'COPY REMAINING LEFT',
        subtitle: `Right subarray exhausted. Taking remaining ${currentStep.chosenValue} from left subarray.`,
        badge: 'APPEND LEFT',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        icon: <GitMerge className="w-4 h-4 text-[#D97706]" />,
      };
    }
    if (currentStep.type === 'append-right') {
      return {
        title: 'COPY REMAINING RIGHT',
        subtitle: `Left subarray exhausted. Taking remaining ${currentStep.chosenValue} from right subarray.`,
        badge: 'APPEND RIGHT',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        icon: <GitMerge className="w-4 h-4 text-[#D97706]" />,
      };
    }
    if (currentStep.type === 'take-left') {
      return {
        title: 'TAKE LEFT',
        subtitle: `Selected ${currentStep.chosenValue} from left subarray.`,
        badge: 'TAKE LEFT',
        badgeClass: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
        icon: <GitMerge className="w-4 h-4 text-[#E11D48]" />,
      };
    }
    if (currentStep.type === 'take-right') {
      return {
        title: 'TAKE RIGHT',
        subtitle: `Selected ${currentStep.chosenValue} from right subarray.`,
        badge: 'TAKE RIGHT',
        badgeClass: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
        icon: <GitMerge className="w-4 h-4 text-[#E11D48]" />,
      };
    }
    if (currentStep.type === 'write') {
      return {
        title: 'WRITE TO BUFFER',
        subtitle: `Placed value ${currentStep.chosenValue} into output buffer slot k = ${currentStep.outputPointer}.`,
        badge: `WRITE ${currentStep.chosenValue}`,
        badgeClass: 'bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]',
        icon: <ArrowDownRight className="w-4 h-4 text-[#0284C7]" />,
      };
    }
    if (currentStep.type === 'compare') {
      return {
        title: 'COMPARING',
        subtitle: 'Compare the front elements from left and right subarrays.',
        badge: 'COMPARING',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        icon: <GitMerge className="w-4 h-4 text-[#D97706]" />,
      };
    }
    if (currentStep.type === 'merge-start') {
      return {
        title: 'MERGE START',
        subtitle: `Beginning merge on range [${currentStep.mergeRange?.[0]} — ${currentStep.mergeRange?.[1]}].`,
        badge: 'START',
        badgeClass: 'bg-[#F4F4F5] text-[#3F3F3F] border-[#E4E4E7]',
        icon: <GitMerge className="w-4 h-4 text-[#3F3F3F]" />,
      };
    }
    if (isBaseCase) {
      return {
        title: 'BASE CASE',
        subtitle: 'Subarray has 1 element. Already sorted by definition.',
        badge: 'RETURN',
        badgeClass: 'bg-[#F4F4F5] text-[#3F3F3F] border-[#E4E4E7]',
        icon: <CheckCircle2 className="w-4 h-4 text-[#3F3F3F]" />,
      };
    }
    if (isDivide) {
      return {
        title: 'DIVIDE',
        subtitle: `Splitting array into halves around mid = ${currentStep.mid ?? '—'}.`,
        badge: 'DIVIDE',
        badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
        icon: <Split className="w-4 h-4 text-[#D97706]" />,
      };
    }
    return {
      title: 'MERGE SORT',
      subtitle: currentStep.action || 'Executing divide-and-conquer steps.',
      badge: 'ACTIVE',
      badgeClass: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
      icon: <GitMerge className="w-4 h-4 text-[#D97706]" />,
    };
  };

  const details = getPhaseDetails();

  // Local pointer coordinates for HUD sub-views
  const leftStart = currentStep.leftRange ? currentStep.leftRange[0] : 0;
  const leftEnd = currentStep.leftRange ? currentStep.leftRange[1] : 0;
  const rightStart = currentStep.rightRange ? currentStep.rightRange[0] : 0;
  const rightEnd = currentStep.rightRange ? currentStep.rightRange[1] : 0;
  const leftSub = currentStep.leftSubarray || [];
  const rightSub = currentStep.rightSubarray || [];
  const mergedOut = currentStep.mergedOutput || [];
  const leftLocalPtr = currentStep.leftPointer !== undefined ? currentStep.leftPointer : -1;
  const rightLocalPtr = currentStep.rightPointer !== undefined ? currentStep.rightPointer : -1;
  const totalSlots = currentStep.mergeRange ? currentStep.mergeRange[1] - currentStep.mergeRange[0] + 1 : 0;
  const isLeftExhausted = leftSub.length > 0 && leftLocalPtr >= leftSub.length;
  const isRightExhausted = rightSub.length > 0 && rightLocalPtr >= rightSub.length;

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-3 shadow-clean-card h-full justify-between">
      {/* 1. Main Header Card */}
      <div className="flex flex-col gap-2">
        {/* Pass / Progress Pill */}
        <div className="flex items-center justify-between text-[11px] font-mono pb-2 border-b border-[#E2E8F0]">
          <span className="font-bold text-[#18181B]">{levelText}</span>
          <span className="text-[#64748B] font-semibold">{mergeProgress}</span>
        </div>

        {/* Phase Header */}
        <div className="flex items-start gap-2.5 pt-1">
          <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-center shrink-0 shadow-xs">
            {details.icon}
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider font-mono">
              Current Operation
            </span>
            <span className="text-sm font-bold text-[#18181B] font-mono leading-tight">
              {details.title}
            </span>
            <p className="text-[11px] text-[#475569] mt-0.5 leading-relaxed font-sans">
              {details.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Detail Card Based on Phase */}
        {currentStep.type === 'write' ? (
          /* WRITE HUD DETAILS */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg p-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#0284C7] uppercase font-semibold">Writing Element</span>
                <span className="text-lg font-bold font-mono text-[#0369A1]">
                  Value: {currentStep.chosenValue}
                </span>
                <span className="text-[10px] text-[#0284C7] font-mono">
                  Into slot index k = {currentStep.outputPointer}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono uppercase tracking-wider shadow-xs ${details.badgeClass}`}>
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
                    ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857]'
                    : 'bg-[#FFFBEB] border border-[#FDE68A]'
                }`}
              >
                <div className="text-[10px] text-[#64748B] font-sans">
                  Left: arr[{leftStart + (leftLocalPtr >= 0 ? leftLocalPtr : 0)}]
                </div>
                <div className="text-base font-bold text-[#B45309] mt-0.5">
                  {currentStep.leftValue ?? '—'}
                </div>
                <span className="text-[9px] text-[#64748B]">i = {leftLocalPtr}</span>
              </div>

              {/* Operator Pill */}
              <div className="w-7 h-7 rounded-full bg-white border border-[#CBD5E1] flex items-center justify-center font-bold text-[#475569] text-xs shrink-0 shadow-xs">
                {currentStep.decisionLabel?.includes('<=') ? '≤' : currentStep.decisionLabel?.includes('<') ? '<' : 'vs'}
              </div>

              {/* Right Candidate */}
              <div
                className={`flex-1 rounded-lg p-2 text-center border shadow-xs ${
                  currentStep.chosenFrom === 'right'
                    ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857]'
                    : 'bg-[#F4F4F5] border border-[#E4E4E7]'
                }`}
              >
                <div className="text-[10px] text-[#64748B] font-sans">
                  Right: arr[{rightStart + (rightLocalPtr >= 0 ? rightLocalPtr : 0)}]
                </div>
                <div className="text-base font-bold text-[#18181B] mt-0.5">
                  {currentStep.rightValue ?? '—'}
                </div>
                <span className="text-[9px] text-[#64748B]">j = {rightLocalPtr}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Decision</span>
                <span className="text-xs font-mono font-bold text-[#18181B]">
                  {currentStep.decisionLabel || 'Evaluating candidates'}
                </span>
              </div>
              <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono uppercase tracking-wider shadow-xs ${details.badgeClass}`}>
                {details.badge}
              </div>
            </div>
          </div>
        ) : (
          /* GENERIC STAGE CARD */
          <div className="flex flex-col gap-2 pt-1">
            <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-[#475569]">
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
      <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 flex flex-col gap-2 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#3F3F3F]" />
            <span className="text-[10px] font-bold text-[#18181B] uppercase font-mono tracking-wider">
              Current Merge State
            </span>
          </div>
          {currentStep.mergeRange && (
            <span className="text-[10px] font-mono text-[#64748B]">
              [{currentStep.mergeRange[0]} — {currentStep.mergeRange[1]}]
            </span>
          )}
        </div>

        {isMerge && currentStep.leftRange && currentStep.rightRange ? (
          <div className="flex flex-col gap-2 text-xs">
            {/* Left Array & Right Array mini row */}
            <div className="grid grid-cols-2 gap-2">
              {/* Left Subarray */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-white border border-[#CBD5E1] shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Left ({leftStart}-{leftEnd})</span>
                  <span className={`font-bold ${isLeftExhausted ? 'text-[#E11D48]' : 'text-[#B45309]'}`}>
                    i = {isLeftExhausted ? 'exhausted' : leftLocalPtr >= 0 ? leftLocalPtr : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {leftSub.map((v, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                        i === leftLocalPtr
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          : i < leftLocalPtr
                          ? 'text-[#94A3B8] line-through opacity-70'
                          : 'bg-white text-[#18181B] border border-[#CBD5E1]'
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Subarray */}
              <div className="flex flex-col gap-1 p-2 rounded-lg bg-white border border-[#CBD5E1] shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Right ({rightStart}-{rightEnd})</span>
                  <span className={`font-bold ${isRightExhausted ? 'text-[#E11D48]' : 'text-[#3F3F3F]'}`}>
                    j = {isRightExhausted ? 'exhausted' : rightLocalPtr >= 0 ? rightLocalPtr : '—'}
                  </span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {rightSub.map((v, i) => (
                    <span
                      key={i}
                      className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                        i === rightLocalPtr
                          ? 'bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]'
                          : i < rightLocalPtr
                          ? 'text-[#94A3B8] line-through opacity-70'
                          : 'bg-white text-[#18181B] border border-[#CBD5E1]'
                      }`}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Merged Output Buffer */}
            <div className="flex flex-col gap-1 p-2 rounded-lg bg-white border border-[#CBD5E1] shadow-xs">
              <div className="text-[10px] font-mono text-[#0284C7] font-semibold">
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
                          ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]'
                          : 'border border-dashed border-[#CBD5E1] text-[#94A3B8] px-2'
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
          <div className="text-[11px] font-mono text-[#64748B] py-1 text-center">
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
