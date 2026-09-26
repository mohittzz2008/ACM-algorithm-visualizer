import React, { useState } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { parseAndValidateArrayInput } from '../../utils/arrayGenerators';

export const CustomInputModal: React.FC = () => {
  const isCustomInputModalOpen = useVisualizerStore((state) => state.isCustomInputModalOpen);
  const setCustomInputModalOpen = useVisualizerStore((state) => state.setCustomInputModalOpen);
  const setArray = useVisualizerStore((state) => state.setArray);
  const initialArray = useVisualizerStore((state) => state.initialArray);

  const [inputValue, setInputValue] = useState(initialArray.join(', '));
  const [error, setError] = useState<string | null>(null);

  if (!isCustomInputModalOpen) return null;

  const presets = [
    { label: 'Default Benchmark', array: [38, 24, 82, 17, 56, 45, 93, 12, 67, 31] },
    { label: 'Prompt Example', array: [5, 1, 4, 2, 8] },
    { label: 'Reverse Order', array: [95, 80, 65, 50, 42, 30, 21, 15] },
    { label: 'Duplicate Elements', array: [45, 12, 88, 12, 67, 45, 90, 33] },
    { label: 'Already Sorted', array: [10, 20, 30, 40, 50, 60, 70, 80] },
  ];

  const handleApply = () => {
    const result = parseAndValidateArrayInput(inputValue);
    if (!result.success) {
      setError(result.error || 'Invalid array values.');
      return;
    }

    setArray(result.array);
    setCustomInputModalOpen(false);
  };

  const handleSelectPreset = (arr: number[]) => {
    setInputValue(arr.join(', '));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#0D1322] border border-[#CBD5E1] dark:border-[#202E4E] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1A253E]">
          <div>
            <h2 className="text-base font-bold text-[#0F172A] dark:text-white m-0">Custom Array Input</h2>
            <p className="text-xs text-[#475569] dark:text-slate-400 m-0">
              Provide any custom array of numbers (separated by commas or spaces)
            </p>
          </div>
          <button
            onClick={() => setCustomInputModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18233C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#475569] dark:text-slate-300">
              Array Elements (Integers between 1 and 999, size 2–30):
            </label>
            <textarea
              rows={3}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. 38, 24, 82, 17, 56, 45, 93, 12, 67, 31"
              className="w-full bg-[#F8FAFC] dark:bg-[#080C16] border border-[#CBD5E1] dark:border-[#233152] focus:border-purple-500 rounded-xl p-3 text-sm font-mono text-[#0F172A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Presets */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-[#475569] dark:text-slate-400">Quick Test Cases:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.array)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#131C30] hover:bg-purple-50 dark:hover:bg-[#1C2845] border border-[#CBD5E1] dark:border-[#212E4D] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1A253E] bg-[#F8FAFC] dark:bg-[#0A0F1D] flex items-center justify-end gap-2">
          <button
            onClick={() => setCustomInputModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#475569] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Array</span>
          </button>
        </div>
      </div>
    </div>
  );
};
