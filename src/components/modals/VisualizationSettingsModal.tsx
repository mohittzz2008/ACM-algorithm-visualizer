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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#0D1322] border border-[#CBD5E1] dark:border-[#202E4E] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1A253E]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A] dark:text-white m-0">Visualization Settings</h2>
              <p className="text-[11px] text-[#475569] dark:text-slate-400 m-0">Customize visual appearance and physics</p>
            </div>
          </div>
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18233C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-5 flex flex-col gap-3.5">
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">Show Element Values</span>
              <span className="text-[11px] text-[#475569] dark:text-slate-400">Display numerical values above each bar</span>
            </div>
            <button
              onClick={() => setShowValues(!showValues)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                showValues ? 'bg-[#7C3AED] justify-end' : 'bg-slate-200 dark:bg-[#1C263D] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">Show Array Indices</span>
              <span className="text-[11px] text-[#475569] dark:text-slate-400">Display 0-indexed positions below bars</span>
            </div>
            <button
              onClick={() => setShowIndices(!showIndices)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                showIndices ? 'bg-[#7C3AED] justify-end' : 'bg-slate-200 dark:bg-[#1C263D] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">Spring Physics Animation</span>
              <span className="text-[11px] text-[#475569] dark:text-slate-400">Smooth physical bar movements during swaps</span>
            </div>
            <button
              onClick={() => setSmoothAnimations(!smoothAnimations)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                smoothAnimations ? 'bg-[#7C3AED] justify-end' : 'bg-slate-200 dark:bg-[#1C263D] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200">High Contrast Highlights</span>
              <span className="text-[11px] text-[#475569] dark:text-slate-400">Crisp outline borders for active comparisons</span>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                highContrast ? 'bg-[#7C3AED] justify-end' : 'bg-slate-200 dark:bg-[#1C263D] justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1A253E] bg-[#F8FAFC] dark:bg-[#0A0F1D] flex items-center justify-end">
          <button
            onClick={() => setSettingsModalOpen(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
