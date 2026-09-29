import React, { useState } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const VisualizationSettingsModal: React.FC = () => {
  const isSettingsModalOpen = useVisualizerStore((state) => state.isSettingsModalOpen);
  const setSettingsModalOpen = useVisualizerStore((state) => state.setSettingsModalOpen);

  const [showValues, setShowValues] = useState(true);
  const [showIndices, setShowIndices] = useState(true);
  const [smoothAnimations, setSmoothAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md shadow-clean-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FFC107]/15 border border-[#FFC107]/40 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5 text-[#B45309]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#18181B] m-0">Visualization Settings</h2>
              <p className="text-[11px] text-[#64748B] m-0">Customize visual appearance and physics</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#18181B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#18181B]">Show Element Values</span>
              <span className="text-[11px] text-[#64748B]">Display numerical values above each bar</span>
            </div>
            <button
              onClick={() => setShowValues(!showValues)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                showValues ? 'bg-[#FFC107] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#18181B]">Show Array Indices</span>
              <span className="text-[11px] text-[#64748B]">Display 0-indexed positions below bars</span>
            </div>
            <button
              onClick={() => setShowIndices(!showIndices)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                showIndices ? 'bg-[#FFC107] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#18181B]">Spring Physics Animation</span>
              <span className="text-[11px] text-[#64748B]">Smooth physical bar movements during swaps</span>
            </div>
            <button
              onClick={() => setSmoothAnimations(!smoothAnimations)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                smoothAnimations ? 'bg-[#FFC107] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#18181B]">High Contrast Highlights</span>
              <span className="text-[11px] text-[#64748B]">Crisp outline borders for active comparisons</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                highContrast ? 'bg-[#FFC107] justify-end' : 'bg-slate-200 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFC107] hover:bg-[#F59E0B] text-[#18181B] text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
