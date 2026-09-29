import React from 'react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const Legend: React.FC = () => {
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);

  if (activeAlgorithmId === 'merge-sort') {
    return (
      <div className="flex items-center gap-3 sm:gap-4 bg-white border border-[#CBD5E1] px-3.5 py-1.5 rounded-xl text-xs shadow-xs flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3F3F3F]" />
          <span className="text-[#3F3F3F] font-medium text-[11px]">Unsorted</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
          <span className="text-[#3F3F3F] font-medium text-[11px]">Splitting</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107] border border-[#D97706]" />
          <span className="text-[#3F3F3F] font-medium text-[11px]">Comparing</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span className="text-[#3F3F3F] font-medium text-[11px]">Merging</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
          <span className="text-[#3F3F3F] font-medium text-[11px]">Sorted</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4 bg-white border border-[#CBD5E1] px-3.5 py-1.5 rounded-xl text-xs shadow-xs flex-wrap">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#FFC107] border border-[#D97706]" />
        <span className="text-[#3F3F3F] font-medium">Comparing</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]" />
        <span className="text-[#3F3F3F] font-medium">Swapping</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#3F3F3F]" />
        <span className="text-[#3F3F3F] font-medium">Unsorted</span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]" />
        <span className="text-[#3F3F3F] font-medium">Sorted</span>
      </div>
    </div>
  );
};
