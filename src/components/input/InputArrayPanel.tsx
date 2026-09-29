import React, { useState } from 'react';
import {
  Dice5,
  Shuffle,
  BarChart2,
  RotateCw,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { parseAndValidateArrayInput, isSortedAscending } from '../../utils/arrayGenerators';
import { BINARY_SEARCH_PRESETS, BINARY_SEARCH_DEFAULT_ARRAY, BINARY_SEARCH_DEFAULT_TARGET } from '../../algorithms/searching/binarySearch';

export const InputArrayPanel: React.FC = () => {
  const initialArray = useVisualizerStore((state) => state.initialArray);
  const arraySize = useVisualizerStore((state) => state.arraySize);
  const targetValue = useVisualizerStore((state) => state.targetValue);
  const setArray = useVisualizerStore((state) => state.setArray);
  const setArraySize = useVisualizerStore((state) => state.setArraySize);
  const setTargetValue = useVisualizerStore((state) => state.setTargetValue);
  const setBinarySearchInput = useVisualizerStore((state) => state.setBinarySearchInput);
  const generateRandom = useVisualizerStore((state) => state.generateRandom);
  const generateSorted = useVisualizerStore((state) => state.generateSorted);
  const sortCurrentArray = useVisualizerStore((state) => state.sortCurrentArray);
  const shuffle = useVisualizerStore((state) => state.shuffle);
  const nearlySorted = useVisualizerStore((state) => state.nearlySorted);
  const reverse = useVisualizerStore((state) => state.reverse);
  const reset = useVisualizerStore((state) => state.reset);
  const setCustomInputModalOpen = useVisualizerStore((state) => state.setCustomInputModalOpen);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);

  // Inline custom editing state
  const [isEditing, setIsEditing] = useState(false);
  const [customInputValue, setCustomInputValue] = useState(initialArray.join(', '));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const isSorted = isSortedAscending(initialArray);
  const isBinarySearch = activeAlgorithmId === 'binary-search';

  const handleOpenEdit = () => {
    setCustomInputValue(initialArray.join(', '));
    setErrorMessage(null);
    setWarningMessage(null);
    setIsEditing(true);
  };

  const handleApplyCustomArray = () => {
    const result = parseAndValidateArrayInput(customInputValue);
    if (!result.success) {
      setErrorMessage(result.error || 'Invalid array input');
      return;
    }

    if (isBinarySearch && !isSortedAscending(result.array)) {
      setWarningMessage('Note: Binary Search requires a sorted array. You can use the "Sort Array" button to sort it.');
    } else {
      setWarningMessage(result.warning || null);
    }

    setErrorMessage(null);
    setArray(result.array);
    setIsEditing(false);
  };

  const handleClear = () => {
    setCustomInputModalOpen(true);
  };

  const handleResetBinarySearch = () => {
    setArray(BINARY_SEARCH_DEFAULT_ARRAY);
    setTargetValue(BINARY_SEARCH_DEFAULT_TARGET);
    reset();
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex flex-col gap-3 shadow-clean-card">
      {/* Header Row for Non-Binary Search (Bubble Sort & Merge Sort) */}
      {!isBinarySearch && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wide font-mono">
              Input Array
            </span>
            <span className="text-[11px] text-[#64748B] font-normal">
              (Enter custom numbers or select a preset pattern)
            </span>
          </div>

          {/* Array Size Slider */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#475569] font-medium">Array Size:</span>
              <span className="font-mono font-bold text-[#B45309]">{arraySize}</span>
            </div>

            <div className="flex items-center gap-2 w-28 sm:w-36">
              <span className="text-[10px] text-[#64748B] font-mono">
                {activeAlgorithmId === 'merge-sort' ? '4' : '5'}
              </span>
              <input
                type="range"
                min={activeAlgorithmId === 'merge-sort' ? 4 : 5}
                max={activeAlgorithmId === 'merge-sort' ? 20 : 30}
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#3F3F3F]"
              />
              <span className="text-[10px] text-[#64748B] font-mono">
                {activeAlgorithmId === 'merge-sort' ? '20' : '30'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Unsorted Array Warning for Binary Search */}
      {isBinarySearch && !isSorted && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>
              <strong>Sorted Array Required:</strong> Binary Search requires monotonic data to eliminate half the search space.
            </span>
          </div>
          <button
            onClick={sortCurrentArray}
            className="px-3 py-1 rounded-lg bg-[#3F3F3F] hover:bg-[#18181B] text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            Sort Array Now
          </button>
        </div>
      )}

      {/* Main Content: Custom Edit Mode vs Interactive Array Display */}
      {isEditing ? (
        /* Direct Text Input Field for Manual Editing */
        <div className="flex flex-col gap-2 pt-0.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={customInputValue}
                onChange={(e) => {
                  setCustomInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyCustomArray();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                placeholder="Enter numbers separated by commas or spaces, e.g. 5, 12, 18, 25, 31, 43"
                className="w-full bg-[#FAFAFA] border-2 border-[#3F3F3F] rounded-xl px-3.5 py-2 text-sm text-[#18181B] font-mono placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#FFC107] shadow-inner"
                autoFocus
              />
            </div>
            <button
              onClick={handleApplyCustomArray}
              className="px-4 py-2 rounded-xl bg-[#3F3F3F] hover:bg-[#18181B] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#FFC107]" />
              <span>Apply Array</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#18181B] text-xs font-medium transition-colors shrink-0 cursor-pointer border border-[#CBD5E1]"
            >
              Cancel
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#DC2626] bg-[#FEF2F2] border border-[#DC2626]/40 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {warningMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1.5 rounded-lg">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>
      ) : isBinarySearch ? (
        /* Binary Search: 4 Clean Sub-Panels */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          {/* Sub-Panel 1: Input Sorted Array */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[11px] font-bold text-[#18181B] font-mono tracking-tight uppercase">
                Input — Sorted Array
              </span>
              <span className="text-[10px] text-[#64748B] hidden xl:inline truncate">
                Enter sorted numbers or select a preset
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
              {initialArray.map((val, idx) => (
                <div
                  key={idx}
                  onClick={handleOpenEdit}
                  title="Click to edit array manually"
                  className={`px-2 py-1 rounded-lg border text-xs font-mono font-medium shrink-0 transition-colors select-none cursor-pointer ${
                    val === targetValue
                      ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857] font-bold shadow-xs ring-1 ring-[#10B981]/50'
                      : 'bg-white border-[#CBD5E1] hover:border-[#3F3F3F] text-[#18181B]'
                  }`}
                >
                  {val}
                </div>
              ))}

              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95 ml-1"
                title="Enter custom array numbers"
              >
                <Edit3 className="w-3 h-3 text-[#D97706]" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Sub-Panel 2: Target Value Stepper */}
          <div className="md:col-span-3 lg:col-span-2 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
            <span className="text-[11px] font-bold text-[#18181B] font-mono mb-1.5">
              Target Value
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTargetValue(targetValue - 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#3F3F3F] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title="Decrement target"
              >
                -
              </button>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-14 bg-white border border-[#CBD5E1] rounded-lg px-2 py-1 text-center font-mono font-bold text-xs text-[#18181B] focus:outline-none focus:border-[#3F3F3F]"
              />
              <button
                onClick={() => setTargetValue(targetValue + 1)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#3F3F3F] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title="Increment target"
              >
                +
              </button>
            </div>
          </div>

          {/* Sub-Panel 3: Quick Target Options */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
            <span className="text-[11px] font-bold text-[#18181B] font-mono mb-1.5">
              Quick Target:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {Array.from(new Set([
                initialArray[0],
                initialArray[Math.floor(initialArray.length / 3)],
                initialArray[Math.floor(initialArray.length / 2)],
                initialArray[Math.floor((initialArray.length * 2) / 3)],
                initialArray[initialArray.length - 1],
              ])).slice(0, 5).map((qVal, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => setTargetValue(qVal)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    targetValue === qVal
                      ? 'bg-[#047857] text-white shadow-xs ring-1 ring-[#10B981]'
                      : 'bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#3F3F3F] hover:text-[#18181B]'
                  }`}
                >
                  {qVal}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Panel 4: Array Size Slider & Actions */}
          <div className="md:col-span-12 lg:col-span-3 flex flex-col justify-between gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]">
            {/* Top: Array Size */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] font-medium">Array Size:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#B45309] text-xs">{arraySize}</span>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-20 h-1.5 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#3F3F3F]"
                />
              </div>
            </div>

            {/* Bottom: Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                onClick={generateSorted}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3F3F3F] hover:bg-[#18181B] text-white font-semibold text-xs transition-colors shadow-xs active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3 h-3 text-[#FFC107]" />
                <span>Generate Sorted</span>
              </button>

              <button
                onClick={shuffle}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] font-medium text-xs transition-colors shrink-0 cursor-pointer"
                title="Shuffle elements"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleResetBinarySearch}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] font-medium text-xs transition-colors shrink-0 cursor-pointer"
                title="Reset to default example"
              >
                <RotateCcw className="w-3 h-3 text-[#DC2626]" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Bubble Sort & Merge Sort Actions Row */
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5 min-w-0">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-1 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95"
                title="Enter custom array numbers"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Edit Manually</span>
              </button>

              {initialArray.map((val, idx) => (
                <div
                  key={idx}
                  onClick={handleOpenEdit}
                  title="Click to edit array manually"
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium shrink-0 transition-colors shadow-xs select-none cursor-pointer bg-[#F8FAFC] border-[#CBD5E1] hover:border-[#3F3F3F] text-[#18181B]"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <button
              onClick={generateRandom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3F3F3F] hover:bg-[#18181B] text-white font-semibold text-xs transition-colors shadow-xs active:scale-95 shrink-0 cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>Generate Random</span>
            </button>

            <button
              onClick={shuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={nearlySorted}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Nearly Sorted</span>
            </button>

            <button
              onClick={reverse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reverse</span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#DC2626]/40 font-medium text-xs transition-colors shrink-0 cursor-pointer"
              title="Clear or open full array dialog"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Preset Scenarios: 3 Distinct Bordered Card Boxes */}
      {isBinarySearch && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-[#E2E8F0]">
          {/* Box 1: FOUND (Quick Scenarios) */}
          <div className="md:col-span-4 p-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#047857] font-bold uppercase tracking-wider px-1">
              FOUND (QUICK SCENARIOS)
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {BINARY_SEARCH_PRESETS.filter((p) => p.category === 'found').map((preset) => {
                const isActive =
                  preset.target === targetValue &&
                  preset.array.length === initialArray.length &&
                  preset.array.every((v, i) => v === initialArray[i]);

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setBinarySearchInput(preset.array, preset.target);
                    }}
                    title={preset.description}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] font-bold ring-1 ring-[#FFC107]'
                        : 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#3F3F3F] hover:text-[#18181B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 2: Not Found */}
          <div className="md:col-span-3 p-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#B45309] font-bold uppercase tracking-wider px-1">
              Not Found
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {BINARY_SEARCH_PRESETS.filter((p) => p.category === 'not-found').map((preset) => {
                const isActive =
                  preset.target === targetValue &&
                  preset.array.length === initialArray.length &&
                  preset.array.every((v, i) => v === initialArray[i]);

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setBinarySearchInput(preset.array, preset.target);
                    }}
                    title={preset.description}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] font-bold ring-1 ring-[#FFC107]'
                        : 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#3F3F3F] hover:text-[#18181B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 3: Special Cases */}
          <div className="md:col-span-5 p-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#18181B] font-bold uppercase tracking-wider px-1">
              Special Cases
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {BINARY_SEARCH_PRESETS.filter((p) => p.category === 'special').map((preset) => {
                const isActive =
                  preset.target === targetValue &&
                  preset.array.length === initialArray.length &&
                  preset.array.every((v, i) => v === initialArray[i]);

                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setBinarySearchInput(preset.array, preset.target);
                    }}
                    title={preset.description}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] font-bold ring-1 ring-[#FFC107]'
                        : 'bg-white hover:bg-[#F1F5F9] border-[#CBD5E1] text-[#3F3F3F] hover:text-[#18181B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
