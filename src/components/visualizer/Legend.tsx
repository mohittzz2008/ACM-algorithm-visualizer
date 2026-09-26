import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const Legend: React.FC = () => {
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);

  if (activeAlgorithmId === 'merge-sort') {
    return (
      <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-[#0B101E]/90 border border-[#CBD5E1] dark:border-[#1C2742] px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-sm shadow-sm flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] dark:bg-blue-500" />
          <span className="text-[#334155] dark:text-slate-300 font-medium text-[11px]">Unsorted</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] dark:bg-purple-500" />
          <span className="text-[#334155] dark:text-slate-300 font-medium text-[11px]">Splitting</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706] dark:bg-amber-400" />
          <span className="text-[#334155] dark:text-slate-300 font-medium text-[11px]">Comparing</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED] dark:bg-rose-500" />
          <span className="text-[#334155] dark:text-slate-300 font-medium text-[11px]">Merging</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669] dark:bg-emerald-500" />
          <span className="text-[#334155] dark:text-slate-300 font-medium text-[11px]">Sorted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-white dark:bg-[#0B101E]/90 border border-[#CBD5E1] dark:border-[#1C2742] px-3.5 py-1.5 rounded-xl text-xs backdrop-blur-sm shadow-sm flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706] dark:bg-amber-400" />
        <span className="text-[#334155] dark:text-slate-300 font-medium">Comparing</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48] dark:bg-rose-500" />
        <span className="text-[#334155] dark:text-slate-300 font-medium">Swapping</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#0284C7] dark:bg-blue-500" />
        <span className="text-[#334155] dark:text-slate-300 font-medium">Unsorted</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#059669] dark:bg-emerald-500" />
        <span className="text-[#334155] dark:text-slate-300 font-medium">Sorted</span>
      </div>
    </div>
  );
};
