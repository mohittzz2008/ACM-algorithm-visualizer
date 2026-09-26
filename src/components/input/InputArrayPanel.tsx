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
    <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#18233C] rounded-2xl p-3.5 flex flex-col gap-3 shadow-sm">
      {/* Header Row for Non-Binary Search (Bubble Sort & Merge Sort) */}
      {!isBinarySearch && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wide font-mono">
              Input Array
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400 font-normal">
              (Enter custom numbers or select a preset pattern)
            </span>
          </div>

          {/* Array Size Slider */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#475569] dark:text-slate-400 font-medium">Array Size:</span>
              <span className="font-mono font-bold text-[#6D28D9] dark:text-purple-400">{arraySize}</span>
            </div>

            <div className="flex items-center gap-2 w-28 sm:w-36">
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-mono">
                {activeAlgorithmId === 'merge-sort' ? '4' : '5'}
              </span>
              <input
                type="range"
                min={activeAlgorithmId === 'merge-sort' ? 4 : 5}
                max={activeAlgorithmId === 'merge-sort' ? 20 : 30}
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E2E8F0] dark:bg-[#17223A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
              />
              <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-mono">
                {activeAlgorithmId === 'merge-sort' ? '20' : '30'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Unsorted Array Warning for Binary Search */}
      {isBinarySearch && !isSorted && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#FFFBEB] dark:bg-amber-950/40 border border-[#FDE68A] dark:border-amber-600/50 text-[#B45309] dark:text-amber-200 text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B45309] dark:text-amber-400 shrink-0" />
            <span>
              <strong>Sorted Array Required:</strong> Binary Search requires monotonic data to eliminate half the search space.
            </span>
          </div>
          <button
            onClick={sortCurrentArray}
            className="px-3 py-1 rounded-lg bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs transition-colors shrink-0 shadow cursor-pointer self-start sm:self-auto"
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
                className="w-full bg-white dark:bg-[#070B16] border-2 border-[#7C3AED] dark:border-purple-500/70 rounded-xl px-3.5 py-2 text-sm text-[#0F172A] dark:text-white font-mono placeholder:text-[#64748B] dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C084FC] shadow-inner"
                autoFocus
              />
            </div>
            <button
              onClick={handleApplyCustomArray}
              className="px-4 py-2 rounded-xl bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-purple-900/20 shrink-0 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Array</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#131B2F] hover:bg-[#F8FAFC] dark:hover:bg-[#1C2742] text-[#475569] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white text-xs font-medium transition-colors shrink-0 cursor-pointer border border-[#CBD5E1] dark:border-[#202E4E]"
            >
              Cancel
            </button>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#DC2626] bg-[#FEF2F2] dark:bg-rose-950/30 border border-[#DC2626]/40 dark:border-rose-800/40 px-3 py-1.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          {warningMessage && (
            <div className="flex items-center gap-1.5 text-xs text-[#B45309] bg-[#FFFBEB] dark:bg-amber-950/30 border border-[#FDE68A] dark:border-amber-800/40 px-3 py-1.5 rounded-lg">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}
        </div>
      ) : isBinarySearch ? (
        /* Binary Search: 4 Clean Sub-Panels Matching Reference Layout */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          {/* Sub-Panel 1: Input Sorted Array */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B]">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[11px] font-bold text-[#0F172A] dark:text-slate-200 font-mono tracking-tight uppercase">
                Input — Sorted Array
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 hidden xl:inline truncate">
                Enter sorted numbers or select a preset
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin py-0.5">
              {initialArray.map((val, idx) => (
                <div
                  key={idx}
                  onClick={handleOpenEdit}
                  title="Click to edit array manually"
                  className={`px-2 py-1 rounded-lg border text-xs font-mono font-medium shrink-0 transition-all select-none cursor-pointer ${
                    val === targetValue
                      ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857] font-bold shadow-sm ring-1 ring-[#10B981]/50 dark:bg-emerald-950/80 dark:border-emerald-400 dark:text-emerald-300'
                      : 'bg-[#F1F5F9] dark:bg-[#10172A] border-[#CBD5E1] dark:border-[#1E2B48] hover:border-[#C084FC] dark:hover:border-purple-500/60 text-[#0F172A] dark:text-slate-200'
                  }`}
                >
                  {val}
                </div>
              ))}

              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6D28D9] border border-[#C084FC] dark:bg-purple-600/20 dark:hover:bg-purple-600/30 dark:text-purple-200 dark:border-purple-500/50 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95 ml-1"
                title="Enter custom array numbers"
              >
                <Edit3 className="w-3 h-3 text-[#7C3AED] dark:text-purple-400" />
                <span>Edit</span>
              </button>
            </div>
          </div>

          {/* Sub-Panel 2: Target Value Stepper */}
          <div className="md:col-span-3 lg:col-span-2 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B]">
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-slate-200 font-mono mb-1.5">
              Target Value
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTargetValue(targetValue - 1)}
                className="w-7 h-7 rounded-lg bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#C084FC] text-[#6D28D9] dark:bg-purple-600/30 dark:hover:bg-purple-600/50 dark:border-purple-500/50 dark:text-purple-200 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title="Decrement target"
              >
                -
              </button>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-14 bg-white dark:bg-[#070B16] border border-[#CBD5E1] dark:border-[#233355] rounded-lg px-2 py-1 text-center font-mono font-bold text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#7C3AED]"
              />
              <button
                onClick={() => setTargetValue(targetValue + 1)}
                className="w-7 h-7 rounded-lg bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#C084FC] text-[#6D28D9] dark:bg-purple-600/30 dark:hover:bg-purple-600/50 dark:border-purple-500/50 dark:text-purple-200 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                title="Increment target"
              >
                +
              </button>
            </div>
          </div>

          {/* Sub-Panel 3: Quick Target Options */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-between p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B]">
            <span className="text-[11px] font-bold text-[#0F172A] dark:text-slate-200 font-mono mb-1.5">
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
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    targetValue === qVal
                      ? 'bg-[#047857] text-white shadow-sm ring-1 ring-[#10B981] dark:bg-emerald-600'
                      : 'bg-white dark:bg-[#11172A] hover:bg-[#F1F5F9] dark:hover:bg-[#1B2542] border border-[#CBD5E1] dark:border-[#1E2B48] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  {qVal}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Panel 4: Array Size Slider & Actions */}
          <div className="md:col-span-12 lg:col-span-3 flex flex-col justify-between gap-1.5 p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B]">
            {/* Top: Array Size */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#475569] dark:text-slate-400 font-medium">Array Size:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#6D28D9] dark:text-purple-400 text-xs">{arraySize}</span>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="w-20 h-1.5 bg-[#CBD5E1] dark:bg-[#17223A] rounded-lg appearance-none cursor-pointer accent-[#7C3AED]"
                />
              </div>
            </div>

            {/* Bottom: Action Buttons */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                onClick={generateSorted}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate Sorted</span>
              </button>

              <button
                onClick={shuffle}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#11182B] hover:bg-[#F8FAFC] dark:hover:bg-[#18233D] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#212E4D] font-medium text-xs transition-colors shrink-0 cursor-pointer"
                title="Shuffle elements"
              >
                <Shuffle className="w-3 h-3" />
                <span>Shuffle</span>
              </button>

              <button
                onClick={handleResetBinarySearch}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#11182B] hover:bg-[#F8FAFC] dark:hover:bg-[#18233D] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#212E4D] font-medium text-xs transition-colors shrink-0 cursor-pointer"
                title="Reset to default example"
              >
                <RotateCcw className="w-3 h-3 text-[#DC2626] dark:text-rose-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Bubble Sort & Merge Sort Actions Row */
        <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin py-1 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#6D28D9] border border-[#C084FC] dark:bg-purple-600/20 dark:hover:bg-purple-600/30 dark:text-purple-200 dark:border-purple-500/50 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                title="Enter custom array numbers"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
                <span>Edit Manually</span>
              </button>

              {initialArray.map((val, idx) => (
                <div
                  key={idx}
                  onClick={handleOpenEdit}
                  title="Click to edit array manually"
                  className="px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium shrink-0 transition-colors shadow-sm select-none cursor-pointer bg-[#F1F5F9] dark:bg-[#11172A] border-[#CBD5E1] dark:border-[#202E4E] hover:border-[#C084FC] dark:hover:border-purple-500/60 text-[#0F172A] dark:text-slate-200"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={generateRandom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs transition-all shadow-sm active:scale-95 shrink-0 cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>Generate Random</span>
            </button>

            <button
              onClick={shuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#11182B] hover:bg-[#F8FAFC] dark:hover:bg-[#18233D] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#212E4D] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={nearlySorted}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#11182B] hover:bg-[#F8FAFC] dark:hover:bg-[#18233D] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#212E4D] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Nearly Sorted</span>
            </button>

            <button
              onClick={reverse}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#11182B] hover:bg-[#F8FAFC] dark:hover:bg-[#18233D] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white border border-[#CBD5E1] dark:border-[#212E4D] font-medium text-xs transition-colors shrink-0 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reverse</span>
            </button>

            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FEF2F2] dark:bg-[#181120] hover:bg-[#FEE2E2] dark:hover:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 border border-[#DC2626]/40 dark:border-rose-900/50 font-medium text-xs transition-colors shrink-0 cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 border-t border-[#CBD5E1] dark:border-[#141B2D]">
          {/* Box 1: FOUND (Quick Scenarios) */}
          <div className="md:col-span-4 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#047857] dark:text-emerald-400 font-bold uppercase tracking-wider px-1">
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
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F3E8FF] border-[#C084FC] text-[#6D28D9] font-bold ring-1 ring-[#C084FC]/50 dark:bg-purple-950/80 dark:border-purple-500 dark:text-purple-200'
                        : 'bg-white dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#18233C] border-[#CBD5E1] dark:border-[#1C2944] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 2: Not Found */}
          <div className="md:col-span-3 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#B45309] dark:text-amber-400 font-bold uppercase tracking-wider px-1">
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
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F3E8FF] border-[#C084FC] text-[#6D28D9] font-bold ring-1 ring-[#C084FC]/50 dark:bg-purple-950/80 dark:border-purple-500 dark:text-purple-200'
                        : 'bg-white dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#18233C] border-[#CBD5E1] dark:border-[#1C2944] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 3: Special Cases */}
          <div className="md:col-span-5 p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#080D1A] border border-[#CBD5E1] dark:border-[#16213B] flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-[#6D28D9] dark:text-purple-400 font-bold uppercase tracking-wider px-1">
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
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F3E8FF] border-[#C084FC] text-[#6D28D9] font-bold ring-1 ring-[#C084FC]/50 dark:bg-purple-950/80 dark:border-purple-500 dark:text-purple-200'
                        : 'bg-white dark:bg-[#0F172A] hover:bg-[#F1F5F9] dark:hover:bg-[#18233C] border-[#CBD5E1] dark:border-[#1C2944] text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white'
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
