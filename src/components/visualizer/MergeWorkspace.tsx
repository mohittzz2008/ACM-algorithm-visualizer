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
      <div className="w-full bg-white border border-[#E2E8F0] rounded-xl p-3 sm:p-4 flex flex-col gap-3 shadow-xs">
        {/* Stage Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFC107] animate-pulse" />
            <span className="text-[11px] font-bold uppercase font-mono tracking-wider text-[#B45309]">
              Active Merge Stage
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">
              Range [{currentStep.mergeRange?.[0]} — {currentStep.mergeRange?.[1]}]
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-[#64748B]">
            <span>Recursion Level: <strong className="text-[#18181B]">{currentStep.recursionLevel}</strong></span>
          </div>
        </div>

        {/* Subarrays Row: Left Subarray ↔ Right Subarray */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 py-2 pb-6">
          {/* Left Subarray Box */}
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] shadow-xs min-w-[140px]">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#3F3F3F] font-semibold px-1">
              <span>Left Subarray</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B]">[{leftStart} — {leftEnd}]</span>
                {isLeftExhausted && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FFF1F2] border border-[#FECDD3] text-[9px] font-bold text-[#E11D48] uppercase">
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
                    className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono text-xs font-bold transition-colors shadow-xs ${
                      isSelected
                        ? 'bg-[#FFF1F2] border-2 border-[#E11D48] text-[#E11D48] scale-110 z-10'
                        : isComparing
                        ? 'bg-[#FFFBEB] border-2 border-[#D97706] text-[#B45309] scale-105 z-10'
                        : isConsumed
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#94A3B8] opacity-60'
                        : 'bg-white border border-[#CBD5E1] text-[#18181B]'
                    }`}
                  >
                    <span>{val}</span>
                    {isConsumed && (
                      <span className="absolute -top-1.5 -right-1 text-[9px] text-[#047857] font-bold bg-white border border-[#A7F3D0] rounded-full px-0.5 shadow-xs">
                        ✓
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                        <span className={`text-[10px] font-bold leading-none ${isSelected ? 'text-[#E11D48]' : 'text-[#B45309]'}`}>↑</span>
                        <span className={`text-[9px] font-bold font-mono ${isSelected ? 'text-[#E11D48]' : 'text-[#B45309]'}`}>
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
          <div className="flex flex-col items-center justify-center text-[#64748B] self-center">
            <div
              className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-xs ${
                isLeftExhausted || isRightExhausted
                  ? 'bg-[#F4F4F5] border-[#CBD5E1] text-[#18181B]'
                  : 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono mt-1 text-[#64748B]">
              {isLeftExhausted ? 'copy right' : isRightExhausted ? 'copy left' : 'compare'}
            </span>
          </div>

          {/* Right Subarray Box */}
          <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] shadow-xs min-w-[140px]">
            <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#3F3F3F] font-semibold px-1">
              <span>Right Subarray</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#64748B]">[{rightStart} — {rightEnd}]</span>
                {isRightExhausted && (
                  <span className="px-1.5 py-0.2 rounded bg-[#FFF1F2] border border-[#FECDD3] text-[9px] font-bold text-[#E11D48] uppercase">
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
                    className={`relative flex flex-col items-center justify-center w-10 h-10 rounded-xl font-mono text-xs font-bold transition-colors shadow-xs ${
                      isSelected
                        ? 'bg-[#FFF1F2] border-2 border-[#E11D48] text-[#E11D48] scale-110 z-10'
                        : isComparing
                        ? 'bg-[#FFFBEB] border-2 border-[#D97706] text-[#B45309] scale-105 z-10'
                        : isConsumed
                        ? 'bg-[#F1F5F9] border border-[#CBD5E1] text-[#94A3B8] opacity-60'
                        : 'bg-white border border-[#CBD5E1] text-[#18181B]'
                    }`}
                  >
                    <span>{val}</span>
                    {isConsumed && (
                      <span className="absolute -top-1.5 -right-1 text-[9px] text-[#047857] font-bold bg-white border border-[#A7F3D0] rounded-full px-0.5 shadow-xs">
                        ✓
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                        <span className={`text-[10px] font-bold leading-none ${isSelected ? 'text-[#E11D48]' : 'text-[#B45309]'}`}>↑</span>
                        <span className={`text-[9px] font-bold font-mono ${isSelected ? 'text-[#E11D48]' : 'text-[#B45309]'}`}>
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
          <ArrowDown className="w-4 h-4 text-[#64748B]" />
        </div>

        {/* Merged Output Buffer Slots */}
        <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] pb-6">
          <div className="flex items-center justify-between w-full text-[10px] font-mono text-[#3F3F3F] font-semibold px-2">
            <span>Merged Output Buffer</span>
            <span className="text-[#64748B]">Target Range [{currentStep.mergeRange?.[0]} — {currentStep.mergeRange?.[1]}]</span>
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
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                      isCurrentWrite
                        ? 'bg-[#FFFBEB] border-2 border-[#D97706] text-[#B45309] shadow-xs scale-105 z-10'
                        : isFilled
                        ? 'bg-[#ECFDF5] border border-[#10B981] text-[#047857] shadow-xs'
                        : isTargetSlot
                        ? 'border-2 border-[#3F3F3F] bg-[#F4F4F5] text-[#18181B]'
                        : 'border-2 border-dashed border-[#CBD5E1] bg-white text-[#94A3B8]'
                    }`}
                  >
                    {isFilled ? val : '·'}
                  </div>

                  {isTargetSlot && (
                    <div className="absolute -bottom-5 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                      <span className={`text-[10px] font-bold leading-none ${isCurrentWrite ? 'text-[#B45309]' : 'text-[#3F3F3F]'}`}>↑</span>
                      <span className={`text-[9px] font-bold font-mono ${isCurrentWrite ? 'text-[#B45309]' : 'text-[#3F3F3F]'}`}>
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
      <div className="w-full bg-[#F4F4F5] border border-[#E4E4E7] rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#3F3F3F]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#18181B] font-mono uppercase tracking-wide">
              Base Case Reached
            </span>
            <span className="text-[11px] text-[#475569]">
              Subarray has 1 element: <strong className="text-[#18181B] font-mono">{singleVal}</strong> at index [{currentStep.activeRange[0]}]. A single element is already sorted.
            </span>
          </div>
        </div>
        <div className="px-3 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#18181B] font-mono text-xs font-bold shadow-xs">
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
      <div className="w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
            <Split className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#B45309] font-mono uppercase tracking-wide">
              Dividing Subarray [{start} — {end}]
            </span>
            <span className="text-[11px] text-[#475569]">
              Midpoint index: <strong className="text-[#B45309] font-mono">{mid}</strong>. Splitting into Left [{start} — {mid}] and Right [{mid + 1} — {end}].
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#B45309]">
          <span className="px-2 py-1 rounded-lg bg-white border border-[#FDE68A] shadow-xs">
            Left: [{start}...{mid}]
          </span>
          <span className="text-[#64748B]">+</span>
          <span className="px-2 py-1 rounded-lg bg-white border border-[#FDE68A] shadow-xs">
            Right: [{mid + 1}...{end}]
          </span>
        </div>
      </div>
    );
  }

  // Final Complete State
  if (isComplete) {
    return (
      <div className="w-full bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#A7F3D0] flex items-center justify-center text-[#047857]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#047857] font-mono uppercase tracking-wide">
              All Merges Complete
            </span>
            <span className="text-[11px] text-[#475569]">
              All subproblems merged recursively in non-decreasing order. The entire array is sorted.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#047857]">
          {currentStep.array.map((val, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-[#A7F3D0] shadow-xs">
              {val}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Default / Initial State
  return (
    <div className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs text-[#475569]">
        <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
        <span>Ready to begin Merge Sort. Press <strong className="text-[#18181B]">Play</strong> or <strong className="text-[#18181B]">Next</strong> to watch recursive divide and conquer.</span>
      </div>
      <div className="text-[11px] font-mono text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-lg">
        {currentStep.array.length} Elements
      </div>
    </div>
  );
};
