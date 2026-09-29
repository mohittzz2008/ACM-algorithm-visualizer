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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg shadow-clean-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-bold text-[#18181B] m-0">Custom Array Input</h2>
            <p className="text-xs text-[#64748B] m-0">
              Provide any custom array of numbers (separated by commas or spaces)
            </p>
          </div>
          <button
            onClick={() => setCustomInputModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#18181B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#18181B]">
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
              className="w-full bg-[#FAFAFA] border border-[#CBD5E1] focus:border-[#FFC107] rounded-xl p-3 text-sm font-mono text-[#18181B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFC107]/40"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Presets */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-[#64748B]">Quick Test Cases:</span>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPreset(preset.array)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#FFFBEB] border border-[#CBD5E1] hover:border-[#FFC107] text-xs font-medium text-[#3F3F3F] hover:text-[#B45309] transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-end gap-2">
          <button
            onClick={() => setCustomInputModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#64748B] hover:text-[#18181B] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFC107] hover:bg-[#F59E0B] text-[#18181B] text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Array</span>
          </button>
        </div>
      </div>
    </div>
  );
};
