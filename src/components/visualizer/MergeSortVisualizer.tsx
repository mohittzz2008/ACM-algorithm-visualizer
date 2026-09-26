import React from 'react';
import { Legend } from './Legend';
import { MergeTreeVisualizer } from './MergeTreeVisualizer';
import { MergeWorkspace } from './MergeWorkspace';
import { MergeOperationHUD } from './MergeOperationHUD';
import { PlaybackControls } from '../controls/PlaybackControls';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { Box, Check, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export const MergeSortVisualizer: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const initialArray = useVisualizerStore((state) => state.initialArray);
  const reset = useVisualizerStore((state) => state.reset);
  const play = useVisualizerStore((state) => state.play);

  const currentStep = steps[currentStepIndex] || steps[0];
  const isComplete = currentStep?.type === 'complete';

  // Determine active phase for the 6-phase Indicator (DIVIDE -> RECURSE -> COMPARE -> SELECT -> WRITE -> COMPLETE)
  type MergePhase = 'divide' | 'recurse' | 'compare' | 'select' | 'write' | 'complete';

  const getActivePhase = (): MergePhase => {
    if (isComplete || currentStep?.type === 'complete') return 'complete';
    if (!currentStep) return 'divide';

    if (currentStep.type === 'write' || currentStep.type === 'merge-complete') {
      return 'write';
    }

    if (
      currentStep.type === 'take-left' ||
      currentStep.type === 'take-right' ||
      currentStep.type === 'append-left' ||
      currentStep.type === 'append-right'
    ) {
      return 'select';
    }

    if (currentStep.type === 'compare' || currentStep.type === 'merge-start') {
      return 'compare';
    }

    if (
      currentStep.phase === 'recurse' ||
      currentStep.type === 'recurse-left' ||
      currentStep.type === 'recurse-right' ||
      currentStep.type === 'base-case' ||
      currentStep.type === 'return-from-recursion'
    ) {
      return 'recurse';
    }

    return 'divide';
  };

  const activePhase = getActivePhase();

  return (
    <div className="relative w-full bg-white dark:bg-[#0B0F19] border border-[#CBD5E1] dark:border-[#19243C] rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Background ambient lighting for dark mode */}
      <div className="hidden dark:block absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-24 bg-purple-600/10 blur-3xl pointer-events-none" />

      {/* Top Header: Title, Phase Indicator, and Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 z-10 w-full mb-3 pb-2.5 border-b border-[#E2E8F0] dark:border-[#141B2D]">
        {/* Left: Title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-lg bg-[#F3E8FF] dark:bg-purple-600/20 border border-[#C084FC] dark:border-purple-500/30 flex items-center justify-center">
            <Box className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white tracking-wide font-mono uppercase">
            Visualization
          </span>
        </div>

        {/* Center: 6-Phase Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#F8FAFC] dark:bg-[#0C1222] border border-[#CBD5E1] dark:border-[#1A2644] px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[9px] sm:text-[11px] overflow-x-auto scrollbar-none">
          {/* Divide */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'divide'
                  ? 'bg-[#7C3AED] dark:bg-purple-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'divide' ? 'text-[#6D28D9] dark:text-purple-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              DIVIDE
            </span>
          </div>

          <span className="text-[#94A3B8] dark:text-slate-600 select-none">→</span>

          {/* Recurse */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'recurse'
                  ? 'bg-[#2563EB] dark:bg-blue-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'recurse' ? 'text-[#2563EB] dark:text-blue-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              RECURSE
            </span>
          </div>

          <span className="text-[#94A3B8] dark:text-slate-600 select-none">→</span>

          {/* Compare */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'compare'
                  ? 'bg-[#B45309] dark:bg-amber-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'compare' ? 'text-[#B45309] dark:text-amber-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              COMPARE
            </span>
          </div>

          <span className="text-[#94A3B8] dark:text-slate-600 select-none">→</span>

          {/* Select */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'select'
                  ? 'bg-[#DC2626] dark:bg-rose-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'select' ? 'text-[#DC2626] dark:text-rose-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              SELECT
            </span>
          </div>

          <span className="text-[#94A3B8] dark:text-slate-600 select-none">→</span>

          {/* Write */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'write'
                  ? 'bg-[#0369A1] dark:bg-cyan-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'write' ? 'text-[#0369A1] dark:text-cyan-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              WRITE
            </span>
          </div>

          <span className="text-[#94A3B8] dark:text-slate-600 select-none">→</span>

          {/* Complete */}
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                activePhase === 'complete'
                  ? 'bg-[#047857] dark:bg-emerald-400 scale-125'
                  : 'bg-[#CBD5E1] dark:bg-slate-700'
              }`}
            />
            <span
              className={
                activePhase === 'complete' ? 'text-[#047857] dark:text-emerald-300 font-bold' : 'text-[#64748B] dark:text-slate-500 font-medium'
              }
            >
              COMPLETE
            </span>
          </div>
        </div>

        {/* Right: Legend */}
        <div className="shrink-0">
          <Legend />
        </div>
      </div>

      {/* Completion Banner (when finished) */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="z-10 w-full mb-3 bg-[#ECFDF5] dark:bg-[#0A161E]/95 border border-[#A7F3D0] dark:border-emerald-700/50 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
        >
          {/* Left: Completion Badge & Final Sorted Array */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg border text-[11px] font-bold tracking-wider uppercase bg-white dark:bg-emerald-950/60 text-[#047857] dark:text-emerald-300 border-[#A7F3D0] dark:border-emerald-600/50 flex items-center gap-1.5 shadow-sm">
                <Check className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />
                SORTING COMPLETE
              </span>
              <span className="text-xs text-[#064E3B] dark:text-slate-300 font-medium">Final sorted array:</span>
            </div>

            {/* Final Sorted Array Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
              {currentStep.array.map((val, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white dark:bg-[#0D2422] border border-[#A7F3D0] dark:border-emerald-600/40 text-[#047857] dark:text-emerald-200 text-xs font-mono font-semibold"
                >
                  {val}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Key Summary Statistics & Replay */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="grid grid-cols-4 gap-2 text-center bg-white dark:bg-[#07131A] border border-[#CBD5E1] dark:border-[#142C33] rounded-lg px-3 py-1.5 shadow-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#475569] dark:text-slate-400 uppercase font-mono">Comparisons</span>
                <span className="text-xs font-bold text-[#B45309] dark:text-amber-300 font-mono">
                  {currentStep.comparisonCount}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] dark:border-[#142C33] pl-2">
                <span className="text-[10px] text-[#475569] dark:text-slate-400 uppercase font-mono">Merges</span>
                <span className="text-xs font-bold text-[#DC2626] dark:text-rose-300 font-mono">
                  {currentStep.mergeCount || Math.max(0, initialArray.length - 1)}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] dark:border-[#142C33] pl-2">
                <span className="text-[10px] text-[#475569] dark:text-slate-400 uppercase font-mono">Writes</span>
                <span className="text-xs font-bold text-[#0369A1] dark:text-cyan-300 font-mono">
                  {currentStep.arrayWrites ?? 0}
                </span>
              </div>
              <div className="flex flex-col border-l border-[#CBD5E1] dark:border-[#142C33] pl-2">
                <span className="text-[10px] text-[#475569] dark:text-slate-400 uppercase font-mono">Total Steps</span>
                <span className="text-xs font-bold text-[#6D28D9] dark:text-purple-300 font-mono">
                  {steps.length}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                reset();
                play();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#047857] hover:bg-[#065F46] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>REPLAY</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Main 2-Column Work Area: Tree & Workspace on Left, HUD on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full my-1 z-10">
        {/* Left Column (8 cols): Tree Map & Active Merge Workspace */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {/* Tree Visualization Card */}
          <div className="w-full bg-[#F8FAFC] dark:bg-[#080D1A]/80 border border-[#CBD5E1] dark:border-[#162238] rounded-xl p-3 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#475569] dark:text-slate-400 pb-1 border-b border-[#E2E8F0] dark:border-[#121B2F]">
              <span className="font-semibold text-[#0F172A] dark:text-slate-300">Recursive Range Tree</span>
              <span>Total Levels: <strong className="text-[#6D28D9] dark:text-purple-300">{currentStep.maxRecursionDepth ? currentStep.maxRecursionDepth + 1 : 1}</strong></span>
            </div>

            <MergeTreeVisualizer
              nodes={currentStep.treeNodes}
              arrayLength={initialArray.length}
            />
          </div>

          {/* Active Merge Workspace */}
          <MergeWorkspace currentStep={currentStep} />
        </div>

        {/* Right Column (4 cols): Current Operation HUD */}
        <div className="lg:col-span-4">
          <MergeOperationHUD currentStep={currentStep} />
        </div>
      </div>

      {/* Integrated Playback Controls at bottom of Visualizer Card */}
      <div className="w-full pt-3 mt-2 border-t border-[#E2E8F0] dark:border-[#141B2D] z-10">
        <PlaybackControls />
      </div>
    </div>
  );
};
