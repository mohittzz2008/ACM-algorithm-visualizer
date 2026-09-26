import React from 'react';
import { Layers, ArrowRight, Split, Compass, Search } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const CurrentStepPanel: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const currentStep = steps[currentStepIndex] || steps[0];

  if (!currentStep) return null;

  // Binary Search specific view
  if (activeAlgorithmId === 'binary-search') {
    const low = currentStep.low ?? 0;
    const high = currentStep.high ?? currentStep.array.length - 1;
    const mid = currentStep.mid;
    const midValue = currentStep.midValue ?? (mid !== undefined ? currentStep.array[mid] : undefined);
    const target = currentStep.searchTarget;

    const rangeText = low <= high
      ? `[${low} — ${high}]`
      : 'Empty (Search Space Exhausted)';

    const lowText = low <= high && low < currentStep.array.length
      ? `${low} → arr[${low}] = ${currentStep.array[low]}`
      : `${low} (crossed)`;

    const midText = mid !== undefined
      ? `${mid} → arr[${mid}] = ${midValue}`
      : '—';

    const highText = high >= 0 && high < currentStep.array.length
      ? `${high} → arr[${high}] = ${currentStep.array[high]}`
      : `${high} (crossed)`;

    const comparisonText = midValue !== undefined && target !== undefined
      ? `${target} ${target === midValue ? '===' : target < midValue ? '<' : '>'} ${midValue}`
      : '—';

    const eliminatedRangeText = currentStep.eliminatedRange
      ? `[${currentStep.eliminatedRange[0]} — ${currentStep.eliminatedRange[1]}]`
      : 'None';

    return (
      <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#1E2B48] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full">
        {/* Header with Title and Candidates badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#17223A]">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
            <span className="text-xs font-bold text-[#0F172A] dark:text-white tracking-wide uppercase font-mono">
              Current Step Details
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#475569] dark:text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] dark:bg-[#11172A] dark:border-[#1E2D4C] dark:text-emerald-400 font-bold">
              Target: {target}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#F0F9FF] border border-[#BAE6FD] text-[#0284C7] dark:bg-[#11172A] dark:border-[#1E2D4C] dark:text-sky-300 font-semibold">
              {currentStep.remainingCandidates ?? Math.max(0, high - low + 1)} Candidates
            </span>
          </div>
        </div>

        {/* Structured Rows */}
        <div className="flex flex-col gap-1.5 pt-2.5 flex-1 font-mono text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
              Action
            </span>
            <span className="text-[#7C3AED] dark:text-purple-300 font-bold">{currentStep.action}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#0284C7] dark:text-blue-400" />
              Active Range
            </span>
            <span className="text-[#0F172A] dark:text-white font-semibold">{rangeText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Low Pointer</span>
            <span className="text-[#0284C7] dark:text-sky-300 font-semibold">{lowText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Mid Pointer</span>
            <span className="text-[#D97706] dark:text-amber-300 font-semibold">{midText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">High Pointer</span>
            <span className="text-[#0284C7] dark:text-sky-300 font-semibold">{highText}</span>
          </div>

          {midValue !== undefined && (
            <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
              <span className="text-[#475569] dark:text-slate-400 text-[11px]">Comparison</span>
              <span className="text-[#D97706] dark:text-amber-300 font-bold">{comparisonText}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Decision</span>
            <span className="text-[#0F172A] dark:text-slate-200 font-semibold">{currentStep.decision || 'Inspecting midpoint'}</span>
          </div>

          {currentStep.eliminatedRange && (
            <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
              <span className="text-[#475569] dark:text-slate-400 text-[11px]">Eliminated Range</span>
              <span className="text-[#E11D48] dark:text-rose-300 font-semibold">{eliminatedRangeText}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[#475569] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
              Next Action
            </span>
            <span className="text-[#059669] dark:text-emerald-300 font-semibold text-right max-w-[240px] truncate">
              {currentStep.nextActionLabel}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Merge Sort specific view
  if (activeAlgorithmId === 'merge-sort') {
    const rangeText = currentStep.mergeRange
      ? `(${currentStep.mergeRange[0]} — ${currentStep.mergeRange[1]})`
      : currentStep.activeRange
      ? `(${currentStep.activeRange[0]} — ${currentStep.activeRange[1]})`
      : '—';

    const leftStart = currentStep.leftRange ? currentStep.leftRange[0] : 0;
    const rightStart = currentStep.rightRange ? currentStep.rightRange[0] : 0;
    const mergeStart = currentStep.mergeRange ? currentStep.mergeRange[0] : 0;

    const leftSub = currentStep.leftSubarray;
    const rightSub = currentStep.rightSubarray;
    const isLeftExhausted = leftSub && currentStep.leftPointer !== undefined && currentStep.leftPointer >= leftSub.length;
    const isRightExhausted = rightSub && currentStep.rightPointer !== undefined && currentStep.rightPointer >= rightSub.length;

    const leftPtrText = isLeftExhausted
      ? `i = ${currentStep.leftPointer} (Exhausted)`
      : currentStep.leftPointer !== undefined
      ? `i = ${currentStep.leftPointer} → arr[${leftStart + currentStep.leftPointer}] = ${currentStep.leftValue ?? '—'}`
      : '—';

    const rightPtrText = isRightExhausted
      ? `j = ${currentStep.rightPointer} (Exhausted)`
      : currentStep.rightPointer !== undefined
      ? `j = ${currentStep.rightPointer} → arr[${rightStart + currentStep.rightPointer}] = ${currentStep.rightValue ?? '—'}`
      : '—';

    const outputPtrText =
      currentStep.outputPointer !== undefined
        ? `k = ${currentStep.outputPointer} → arr[${mergeStart + currentStep.outputPointer}]`
        : '—';

    const chosenText =
      currentStep.chosenValue !== undefined
        ? `${currentStep.chosenValue}`
        : '—';

    const sourceText =
      currentStep.chosenFrom === 'left'
        ? 'Left Subarray'
        : currentStep.chosenFrom === 'right'
        ? 'Right Subarray'
        : '—';

    const nextAction =
      currentStep.nextActionLabel ||
      (currentStep.type === 'compare'
        ? 'Select smaller of front elements'
        : currentStep.type === 'take-left' || currentStep.type === 'take-right'
        ? 'Write selected value into merged buffer'
        : currentStep.type === 'write'
        ? 'Advance pointer in active subarray'
        : 'Proceed with recursive step');

    return (
      <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#1E2B48] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full">
        {/* Header with Title and Level badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#17223A]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />
            <span className="text-xs font-bold text-[#0F172A] dark:text-white tracking-wide uppercase font-mono">
              Current Step Details
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#475569] dark:text-slate-300">
            <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#11172A] border border-[#CBD5E1] dark:border-[#1E2D4C]">
              Level {currentStep.recursionLevel ?? 0}
            </span>
            {currentStep.totalMerges && currentStep.totalMerges > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#11172A] border border-[#CBD5E1] dark:border-[#1E2D4C]">
                Merge {currentStep.mergeCount ?? 0} of {currentStep.totalMerges}
              </span>
            )}
          </div>
        </div>

        {/* Structured Rows */}
        <div className="flex flex-col gap-1.5 pt-2.5 flex-1 font-mono text-xs">
          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
              Action
            </span>
            <span className="text-[#6D28D9] dark:text-purple-300 font-bold">{currentStep.action}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
              Range
            </span>
            <span className="text-[#0F172A] dark:text-white font-semibold">{rangeText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Left Pointer (i)</span>
            <span className="text-[#B45309] dark:text-amber-300 font-semibold">{leftPtrText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Right Pointer (j)</span>
            <span className="text-[#0369A1] dark:text-cyan-300 font-semibold">{rightPtrText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Output Pointer (k)</span>
            <span className="text-[#047857] dark:text-emerald-300 font-semibold">{outputPtrText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Decision</span>
            <span className="text-[#0F172A] dark:text-white font-medium">{currentStep.decisionLabel || '—'}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Selected Value</span>
            <span className="text-[#047857] dark:text-emerald-300 font-bold">{chosenText}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#E2E8F0] dark:border-[#152037]">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Source</span>
            <span className="text-[#475569] dark:text-slate-300">{sourceText}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#475569] dark:text-slate-400 text-[11px]">Next Action</span>
            <span className="text-[#475569] dark:text-slate-300 text-right truncate max-w-[170px]" title={nextAction}>
              {nextAction}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Extract structured values
  const isComparing = currentStep.type === 'compare';
  const isSwapping = currentStep.type === 'swap';
  const isPassComplete = currentStep.type === 'pass-complete';
  const isComplete = currentStep.type === 'complete';
  const isInitial = currentStep.type === 'initial';

  // Elements
  const idxA = currentStep.activeIndices[0];
  const idxB = currentStep.activeIndices[1];
  const valA = idxA !== undefined ? currentStep.array[idxA] : undefined;
  const valB = idxB !== undefined ? currentStep.array[idxB] : undefined;

  // Decision label formatting
  let decisionText = currentStep.decisionLabel;
  if (isComparing && valA !== undefined && valB !== undefined) {
    decisionText = valA > valB ? `${valA} > ${valB}` : `${valA} ≤ ${valB}`;
  } else if (isSwapping && valA !== undefined && valB !== undefined) {
    decisionText = `${valA} ↔ ${valB}`;
  } else if (isPassComplete && valA !== undefined) {
    decisionText = `${valA} reached final position`;
  } else if (isComplete) {
    decisionText = 'Array fully sorted';
  } else if (isInitial) {
    decisionText = 'Pending start';
  }

  // Next action formatting
  let nextText = currentStep.nextActionLabel;
  if (isComparing && valA !== undefined && valB !== undefined) {
    nextText = valA > valB ? 'SWAP' : 'Move to next comparison';
  }

  // Operation badge color
  const getOpBadgeClass = () => {
    if (isComparing) return 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A] dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
    if (isSwapping) return 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3] dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50';
    if (isPassComplete || isComplete) return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
    return 'bg-[#F3E8FF] text-[#7C3AED] border-[#C084FC] dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/40';
  };

  return (
    <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#1E2B48] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full">
      {/* Header with Title and Pass badge */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#17223A]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />
          <span className="text-xs font-bold text-[#0F172A] dark:text-white tracking-wide uppercase font-mono">
            Current Step Details
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#475569] dark:text-slate-300">
          <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#11172A] border border-[#CBD5E1] dark:border-[#1E2D4C]">
            Pass {currentStep.pass || 1} of {currentStep.totalPasses}
          </span>
          {currentStep.comparisonInPass && (
            <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#11172A] border border-[#CBD5E1] dark:border-[#1E2D4C]">
              Comparison {currentStep.comparisonInPass} / {currentStep.totalComparisonsInPass}
            </span>
          )}
        </div>
      </div>

      {/* Structured Sections matching technical specification */}
      <div className="flex flex-col gap-3 pt-3 flex-1">
        {/* 1. CURRENT OPERATION Section */}
        <div className="flex flex-col gap-1.5 bg-[#F8FAFC] dark:bg-[#0F162A]/60 border border-[#CBD5E1] dark:border-[#18233C] rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider font-mono">
              Current Operation
            </span>
            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wider font-mono ${getOpBadgeClass()}`}
            >
              {currentStep.action}
            </span>
          </div>

          {/* Active elements display */}
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            {isComparing || isSwapping ? (
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 bg-white dark:bg-[#090D1A] border border-[#CBD5E1] dark:border-[#1A2640] rounded-lg px-2.5 py-1.5 text-center shadow-xs">
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px]">A[{idxA}] = </span>
                  <span className="text-[#0F172A] dark:text-white font-bold">{valA}</span>
                </div>
                <span className="text-[#64748B] dark:text-slate-500 font-sans text-xs">and</span>
                <div className="flex-1 bg-white dark:bg-[#090D1A] border border-[#CBD5E1] dark:border-[#1A2640] rounded-lg px-2.5 py-1.5 text-center shadow-xs">
                  <span className="text-[#64748B] dark:text-slate-400 text-[11px]">A[{idxB}] = </span>
                  <span className="text-[#0F172A] dark:text-white font-bold">{valB}</span>
                </div>
              </div>
            ) : isPassComplete ? (
              <div className="w-full bg-white dark:bg-[#090D1A] border border-[#CBD5E1] dark:border-[#1A2640] rounded-lg px-2.5 py-1.5 text-center shadow-xs">
                <span className="text-[#64748B] dark:text-slate-400 text-[11px]">Settled Element: </span>
                <span className="text-[#059669] dark:text-emerald-300 font-bold">A[{idxA}] = {valA}</span>
              </div>
            ) : (
              <div className="w-full bg-white dark:bg-[#090D1A] border border-[#CBD5E1] dark:border-[#1A2640] rounded-lg px-2.5 py-1.5 text-center text-[#475569] dark:text-slate-400 text-xs shadow-xs">
                {currentStep.valuesLabel}
              </div>
            )}
          </div>
        </div>

        {/* 2. DECISION Section */}
        <div className="flex flex-col gap-1 bg-[#F8FAFC] dark:bg-[#0F162A]/60 border border-[#CBD5E1] dark:border-[#18233C] rounded-xl p-3">
          <span className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider font-mono">
            Decision
          </span>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-mono font-semibold text-[#0F172A] dark:text-white tracking-wide">
              {decisionText}
            </span>
            {isComparing && (
              <span
                className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded-md ${
                  valA !== undefined && valB !== undefined && valA > valB
                    ? 'text-[#E11D48] bg-[#FFF1F2] border border-[#FECDD3] dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-800/40'
                    : 'text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800/40'
                }`}
              >
                {valA !== undefined && valB !== undefined && valA > valB ? 'True' : 'False'}
              </span>
            )}
          </div>
        </div>

        {/* 3. NEXT Section */}
        <div className="flex flex-col gap-1 bg-[#F8FAFC] dark:bg-[#0F162A]/60 border border-[#CBD5E1] dark:border-[#18233C] rounded-xl p-3">
          <span className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider font-mono">
            Next Action
          </span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#7C3AED] dark:text-purple-200 font-medium pt-0.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400 shrink-0" />
            <span className="tracking-wide">{nextText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
