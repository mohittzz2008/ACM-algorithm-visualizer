import React from 'react';
import { ArrowDown, ArrowLeftRight, CheckCircle2, Split, Sparkles } from 'lucide-react';
import type { AlgorithmStep } from '../../algorithms/types';

interface MergeWorkspaceProps {
  currentStep: AlgorithmStep;
}

export const MergeWorkspace: React.FC<MergeWorkspaceProps> = ({ currentStep }) => {
  const isMergePhase =
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

  // If we are actively in a merge stage
  if (isMergePhase && currentStep.leftRange && currentStep.rightRange) {
    const [leftStart, leftEnd] = currentStep.leftRange;
    const [rightStart, rightEnd] = currentStep.rightRange;
    const totalSlots = (currentStep.mergeRange ? currentStep.mergeRange[1] - currentStep.mergeRange[0] + 1 : 0);

    const leftSubarray = currentStep.leftSubarray || [];
    const rightSubarray = currentStep.rightSubarray || [];
    const mergedOutput = currentStep.mergedOutput || [];

    const leftPtr = currentStep.leftPointer !== undefined ? currentStep.leftPointer : -1;
    const rightPtr = currentStep.rightPointer !== undefined ? currentStep.rightPointer : -1;
    const outPtr = currentStep.outputPointer !== undefined ? currentStep.outputPointer : -1;

    const isLeftExhausted = leftSubarray.length > 0 && leftPtr >= leftSubarray.length;
    const isRightExhausted = rightSubarray.length > 0 && rightPtr >= rightSubarray.length;

    return (
      <div className="w-full bg-white dark:bg-[#0A0E1A]/80 border border-[#CBD5E1] dark:border-[#1B2945] rounded-xl p-3 sm:p-4 flex flex-col gap-3 shadow-sm">
        {/* Stage Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#141F36] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B45309] dark:bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#B45309] dark:text-amber-300">
              Active Merge Stage
            </span>
            <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono">
              Range [{currentStep.mergeRange?.[0]} — {currentStep.mergeRange?.[1]}]
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#64748B] dark:text-slate-400">
            <span>Recursion Level: <strong className="text-[#6D28D9] dark:text-purple-300">{currentStep.recursionLevel}</strong></span>
          </div>
        </div>

        {/* Subarrays Row: Left Subarray ↔ Right Subarray */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-2 pb-6">
          {/* Left Subarray Box */}
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172E] border border-[#CBD5E1] dark:border-blue-900/40 shadow-sm min-w-[140px]">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#2563EB] dark:text-blue-300 font-semibold px-1">
              <span>Left Subarray</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500">[{leftStart} — {leftEnd}]</span>
                {isLeftExhausted && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FEF2F2] border border-[#FECDD3] text-[9px] font-bold text-[#DC2626] dark:bg-rose-950/60 dark:border-rose-800/60 dark:text-rose-300 uppercase">
                    Exhausted
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              {leftSubarray.map((val, idx) => {
                const isActive = idx === leftPtr;
                const isConsumed = idx < leftPtr;
                const isComparing = currentStep.type === 'compare' && isActive;
                const isSelected = (currentStep.type === 'take-left' || currentStep.type === 'append-left') && isActive;

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all shadow-sm ${
                      isSelected
                        ? 'bg-[#FEF2F2] border-2 border-[#DC2626] text-[#DC2626] dark:bg-rose-500/25 dark:border-rose-400 dark:text-rose-200 shadow-sm scale-110 z-10'
                        : isComparing
                        ? 'bg-[#FFFBEB] border-2 border-[#B45309] text-[#B45309] dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 shadow-sm scale-105 z-10'
                        : isConsumed
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#94A3B8] opacity-60 dark:bg-[#090D18] dark:border-[#162035] dark:text-slate-500'
                        : 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] dark:bg-[#152347] dark:border-blue-600/40 dark:text-blue-200'
                    }`}
                  >
                    <span>{val}</span>
                    {isConsumed && (
                      <span className="absolute -top-1.5 -right-1 text-[9px] text-[#047857] font-bold bg-white dark:bg-[#0A161E] border border-[#A7F3D0] rounded-full px-0.5 shadow-sm">
                        ✓
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                        <span className={`text-[10px] font-bold leading-none ${isSelected ? 'text-[#DC2626]' : 'text-[#B45309]'}`}>↑</span>
                        <span className={`text-[9px] font-bold font-mono ${isSelected ? 'text-[#DC2626]' : 'text-[#B45309]'}`}>
                          i = {idx} <span className="text-[8px] opacity-75 font-normal">arr[{leftStart + idx}]</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Central Compare / Exhausted Arrow */}
          <div className="flex flex-col items-center justify-center text-[#64748B] dark:text-slate-400 self-center">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-sm ${
                isLeftExhausted || isRightExhausted
                  ? 'bg-[#F3E8FF] border-[#C084FC] text-[#6D28D9] dark:bg-[#1A1024] dark:border-purple-600/50 dark:text-purple-300'
                  : 'bg-white border-[#CBD5E1] text-[#B45309] dark:bg-[#141B2D] dark:border-[#23304D] dark:text-amber-400'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span
              className={`text-[9px] font-mono mt-1 ${
                isLeftExhausted || isRightExhausted ? 'text-[#6D28D9] dark:text-purple-300 font-semibold' : 'text-[#64748B] dark:text-slate-500'
              }`}
            >
              {isLeftExhausted ? 'copy right' : isRightExhausted ? 'copy left' : 'compare'}
            </span>
          </div>

          {/* Right Subarray Box */}
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0F172E] border border-[#CBD5E1] dark:border-blue-900/40 shadow-sm min-w-[140px]">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#2563EB] dark:text-blue-300 font-semibold px-1">
              <span>Right Subarray</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B] dark:text-slate-500">[{rightStart} — {rightEnd}]</span>
                {isRightExhausted && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FEF2F2] border border-[#FECDD3] text-[9px] font-bold text-[#DC2626] dark:bg-rose-950/60 dark:border-rose-800/60 dark:text-rose-300 uppercase">
                    Exhausted
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 pb-1">
              {rightSubarray.map((val, idx) => {
                const isActive = idx === rightPtr;
                const isConsumed = idx < rightPtr;
                const isComparing = currentStep.type === 'compare' && isActive;
                const isSelected = (currentStep.type === 'take-right' || currentStep.type === 'append-right') && isActive;

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono text-xs font-bold transition-all shadow-sm ${
                      isSelected
                        ? 'bg-[#FEF2F2] border-2 border-[#DC2626] text-[#DC2626] dark:bg-rose-500/25 dark:border-rose-400 dark:text-rose-200 shadow-sm scale-110 z-10'
                        : isComparing
                        ? 'bg-[#FFFBEB] border-2 border-[#B45309] text-[#B45309] dark:bg-amber-500/20 dark:border-amber-400 dark:text-amber-200 shadow-sm scale-105 z-10'
                        : isConsumed
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#94A3B8] opacity-60 dark:bg-[#090D18] dark:border-[#162035] dark:text-slate-500'
                        : 'bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] dark:bg-[#152347] dark:border-blue-600/40 dark:text-blue-200'
                    }`}
                  >
                    <span>{val}</span>
                    {isConsumed && (
                      <span className="absolute -top-1.5 -right-1 text-[9px] text-[#047857] font-bold bg-white dark:bg-[#0A161E] border border-[#A7F3D0] rounded-full px-0.5 shadow-sm">
                        ✓
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                        <span className={`text-[10px] font-bold leading-none ${isSelected ? 'text-[#DC2626]' : 'text-[#B45309]'}`}>↑</span>
                        <span className={`text-[9px] font-bold font-mono ${isSelected ? 'text-[#DC2626]' : 'text-[#B45309]'}`}>
                          j = {idx} <span className="text-[8px] opacity-75 font-normal">arr[{rightStart + idx}]</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Transition Down Arrow */}
        <div className="flex justify-center -my-1">
          <ArrowDown className="w-4 h-4 text-[#64748B] dark:text-slate-500 animate-bounce" />
        </div>

        {/* Merged Output Buffer Slots */}
        <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#08131A] border border-[#CBD5E1] dark:border-cyan-900/30 pb-6">
          <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#0369A1] dark:text-cyan-300 font-semibold px-2">
            <span>Merged Output Buffer</span>
            <span className="text-[#64748B] dark:text-slate-500">Target Range [{currentStep.mergeRange?.[0]} — {currentStep.mergeRange?.[1]}]</span>
          </div>

          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none py-1">
            {Array.from({ length: totalSlots }).map((_, slotIdx) => {
              const val = mergedOutput[slotIdx];
              const isFilled = val !== null && val !== undefined;
              const isCurrentWrite = currentStep.type === 'write' && slotIdx === outPtr;
              const isTargetSlot = slotIdx === outPtr && !isComplete && currentStep.type !== 'merge-complete';

              return (
                <div key={slotIdx} className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                      isCurrentWrite
                        ? 'bg-[#FFFBEB] border-2 border-[#B45309] text-[#B45309] dark:bg-amber-500/30 dark:border-amber-400 dark:text-amber-200 shadow-sm scale-105 z-10'
                        : isFilled
                        ? 'bg-[#ECFDF5] border border-[#10B981] text-[#047857] dark:bg-emerald-950/60 dark:border-emerald-500/60 dark:text-emerald-200 shadow-sm'
                        : isTargetSlot
                        ? 'border-2 border-[#0369A1] bg-[#F0F9FF] text-[#0369A1] dark:border-cyan-500/60 dark:bg-cyan-950/20 dark:text-cyan-400'
                        : 'border-2 border-dashed border-[#CBD5E1] bg-white text-[#94A3B8] dark:border-[#1E2E48] dark:bg-[#070D18] dark:text-slate-600'
                    }`}
                  >
                    {isFilled ? val : '·'}
                  </div>

                  {isTargetSlot && (
                    <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                      <span className={`text-[10px] font-bold leading-none ${isCurrentWrite ? 'text-[#B45309]' : 'text-[#0369A1]'}`}>↑</span>
                      <span className={`text-[9px] font-bold font-mono ${isCurrentWrite ? 'text-[#B45309]' : 'text-[#0369A1]'}`}>
                        k = {slotIdx} <span className="text-[8px] opacity-75 font-normal">{isCurrentWrite ? '(written)' : '(next write)'}</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Base Case Display
  if (isBaseCase && currentStep.activeRange) {
    const singleVal = currentStep.array[currentStep.activeRange[0]];
    return (
      <div className="w-full bg-[#F0F9FF] dark:bg-[#0A161E]/70 border border-[#BAE6FD] dark:border-cyan-800/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-cyan-950/60 border border-[#BAE6FD] dark:border-cyan-600/40 flex items-center justify-center text-[#0369A1] dark:text-cyan-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0369A1] dark:text-cyan-200 font-mono uppercase tracking-wide">
              Base Case Reached
            </span>
            <span className="text-[11px] text-[#475569] dark:text-slate-400">
              Subarray has 1 element: <strong className="text-[#0F172A] dark:text-white font-mono">{singleVal}</strong> at index [{currentStep.activeRange[0]}]. A single element is already sorted.
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-lg bg-white dark:bg-cyan-950/60 border border-[#BAE6FD] dark:border-cyan-600/40 text-[#0369A1] dark:text-cyan-300 font-mono text-xs font-bold shadow-sm">
          [{singleVal}]
        </div>
      </div>
    );
  }

  // Divide Phase Display
  if (isDivide && currentStep.activeRange) {
    const [start, end] = currentStep.activeRange;
    const mid = currentStep.mid !== undefined ? currentStep.mid : Math.floor((start + end) / 2);
    return (
      <div className="w-full bg-[#F3E8FF] dark:bg-[#130E26]/70 border border-[#C084FC] dark:border-purple-800/40 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-purple-950/60 border border-[#C084FC] dark:border-purple-600/40 flex items-center justify-center text-[#6D28D9] dark:text-purple-400">
            <Split className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#6D28D9] dark:text-purple-200 font-mono uppercase tracking-wide">
              Dividing Subarray [{start} — {end}]
            </span>
            <span className="text-[11px] text-[#475569] dark:text-slate-400">
              Midpoint index: <strong className="text-[#6D28D9] dark:text-purple-300 font-mono">{mid}</strong>. Splitting into Left [{start} — {mid}] and Right [{mid + 1} — {end}].
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#6D28D9] dark:text-purple-300">
          <span className="px-2 py-1 rounded-lg bg-white dark:bg-purple-950/80 border border-[#C084FC] dark:border-purple-700/50 shadow-sm">
            Left: [{start}...{mid}]
          </span>
          <span className="text-[#64748B] dark:text-slate-500">+</span>
          <span className="px-2 py-1 rounded-lg bg-white dark:bg-purple-950/80 border border-[#C084FC] dark:border-purple-700/50 shadow-sm">
            Right: [{mid + 1}...{end}]
          </span>
        </div>
      </div>
    );
  }

  // Final Complete State
  if (isComplete) {
    return (
      <div className="w-full bg-[#ECFDF5] dark:bg-[#081F18]/70 border border-[#A7F3D0] dark:border-emerald-700/50 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-emerald-950/60 border border-[#A7F3D0] dark:border-emerald-600/50 flex items-center justify-center text-[#047857] dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#047857] dark:text-emerald-200 font-mono uppercase tracking-wide">
              All Merges Complete
            </span>
            <span className="text-[11px] text-[#475569] dark:text-slate-400">
              All subproblems merged recursively in non-decreasing order. The entire array is sorted.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#047857] dark:text-emerald-300">
          {currentStep.array.map((val, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-emerald-950/80 border border-[#A7F3D0] dark:border-emerald-600/40 shadow-sm">
              {val}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Default / Initial State
  return (
    <div className="w-full bg-[#F8FAFC] dark:bg-[#0A0F1E]/60 border border-[#CBD5E1] dark:border-[#192642] rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-[#475569] dark:text-slate-400">
        <span className="w-2 h-2 rounded-full bg-[#7C3AED] dark:bg-purple-400" />
        <span>Ready to begin Merge Sort. Press <strong className="text-[#0F172A] dark:text-white">Play</strong> or <strong className="text-[#0F172A] dark:text-white">Next</strong> to watch recursive divide and conquer.</span>
      </div>
      <div className="text-[11px] font-mono text-[#6D28D9] dark:text-purple-300 bg-[#F3E8FF] dark:bg-purple-950/40 border border-[#C084FC] dark:border-purple-800/40 px-2.5 py-1 rounded-lg">
        {currentStep.array.length} Elements
      </div>
    </div>
  );
};
