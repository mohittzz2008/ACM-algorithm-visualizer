import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const PlaybackControls: React.FC = () => {
  const isPlaying = useVisualizerStore((state) => state.isPlaying);
  const playbackSpeed = useVisualizerStore((state) => state.playbackSpeed);
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);

  const togglePlay = useVisualizerStore((state) => state.togglePlay);
  const nextStep = useVisualizerStore((state) => state.nextStep);
  const prevStep = useVisualizerStore((state) => state.prevStep);
  const goToFirst = useVisualizerStore((state) => state.goToFirst);
  const goToLast = useVisualizerStore((state) => state.goToLast);
  const seekToStep = useVisualizerStore((state) => state.seekToStep);
  const reset = useVisualizerStore((state) => state.reset);
  const setPlaybackSpeed = useVisualizerStore((state) => state.setPlaybackSpeed);

  const totalSteps = Math.max(1, steps.length - 1);
  const speedOptions = [0.5, 1, 2, 4];
  const progressPercent = totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;

  const btnBase =
    'flex items-center gap-1 rounded-xl text-xs font-semibold transition-colors active:scale-95 cursor-pointer disabled:cursor-not-allowed';
  const btnSecondary =
    'px-3 py-2 bg-white hover:bg-[#F8FAFC] text-[#3F3F3F] hover:text-[#18181B] border border-[#CBD5E1] disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:border-[#E2E8F0] disabled:opacity-60 shadow-xs';

  const sliderTrackBg = `linear-gradient(to right, #FFC107 0%, #FFC107 ${progressPercent}%, #E2E8F0 ${progressPercent}%, #E2E8F0 100%)`;

  return (
    <div className="flex flex-col gap-4 w-full" role="toolbar" aria-label="Playback Controls">
      {/* Control Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Buttons Group */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* First Button */}
          <button
            onClick={goToFirst}
            disabled={currentStepIndex === 0}
            className={`${btnBase} ${btnSecondary}`}
            title="Jump to first step (Home)"
            aria-label="First step"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">First</span>
          </button>

          {/* Previous Button */}
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`${btnBase} ${btnSecondary} px-3.5`}
            title="Step backward (Left Arrow)"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Primary Play/Pause Button in Geometric Yellow (#FFC107) */}
          <button
            onClick={togglePlay}
            className={`${btnBase} justify-center gap-2 px-7 py-2.5 font-bold uppercase tracking-wider shadow-md min-w-[110px] ${
              isPlaying
                ? 'bg-[#3F3F3F] hover:bg-[#18181B] text-[#FFC107] border border-[#3F3F3F]'
                : 'bg-[#FFC107] hover:bg-[#E5AC00] text-[#18181B] border border-[#FFC107]'
            }`}
            title="Play / Pause (Space)"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>PLAY</span>
              </>
            )}
          </button>

          {/* Next Button */}
          <button
            onClick={nextStep}
            disabled={currentStepIndex >= steps.length - 1}
            className={`${btnBase} ${btnSecondary} px-3.5`}
            title="Step forward (Right Arrow)"
            aria-label="Next step"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Button */}
          <button
            onClick={goToLast}
            disabled={currentStepIndex >= steps.length - 1}
            className={`${btnBase} ${btnSecondary}`}
            title="Jump to end (End)"
            aria-label="Last step"
          >
            <span className="hidden sm:inline">Last</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-[#CBD5E1] px-3 py-1.5 rounded-xl shadow-xs" role="group" aria-label="Speed Controls">
          <span className="text-xs font-medium text-[#475569]">Speed</span>
          <div className="flex items-center gap-1">
            {speedOptions.map((spd) => {
              const isActive = playbackSpeed === spd;
              return (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#3F3F3F] text-white shadow-xs font-bold'
                      : 'bg-white text-[#3F3F3F] hover:text-[#18181B] hover:bg-[#F1F5F9] border border-[#CBD5E1]'
                  }`}
                  aria-label={`Set speed to ${spd}x`}
                  aria-pressed={isActive}
                >
                  {spd}x
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={reset}
          className={`${btnBase} ${btnSecondary} gap-1.5 px-3.5`}
          title="Reset back to start (R)"
          aria-label="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Timeline Slider Row */}
      <div className="flex items-center gap-4 w-full">
        {/* Current Step Counter */}
        <div className="text-xs font-mono font-semibold text-[#18181B] shrink-0 min-w-[95px]" aria-live="polite">
          Step <span className="text-[#B45309] font-bold">{currentStepIndex + 1}</span> / {steps.length}
        </div>

        {/* Slider Track with yellow progress fill */}
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max={totalSteps}
            value={currentStepIndex}
            onChange={(e) => seekToStep(Number(e.target.value))}
            style={{
              background: sliderTrackBg,
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#3F3F3F] focus:outline-none shadow-inner border border-[#E2E8F0]"
            aria-label="Step timeline"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={currentStepIndex}
          />
        </div>

        {/* Max step number on right */}
        <span className="text-xs font-mono text-[#64748B] shrink-0">{steps.length}</span>
      </div>
    </div>
  );
};
