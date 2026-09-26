import { useEffect, useRef } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';

const BASE_INTERVAL_MS = 450;

export function usePlaybackEngine() {
  const isPlaying = useVisualizerStore((state) => state.isPlaying);
  const playbackSpeed = useVisualizerStore((state) => state.playbackSpeed);
  const nextStep = useVisualizerStore((state) => state.nextStep);
  const pause = useVisualizerStore((state) => state.pause);
  const incrementElapsedTime = useVisualizerStore((state) => state.incrementElapsedTime);

  const lastTickTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      lastTickTimeRef.current = null;
      return;
    }

    const initialStore = useVisualizerStore.getState();
    if (initialStore.currentStepIndex >= initialStore.steps.length - 1) {
      pause();
      return;
    }

    const intervalMs = Math.max(40, Math.round(BASE_INTERVAL_MS / playbackSpeed));
    lastTickTimeRef.current = performance.now();

    const intervalId = setInterval(() => {
      const now = performance.now();
      if (lastTickTimeRef.current !== null) {
        const delta = now - lastTickTimeRef.current;
        incrementElapsedTime(delta);
      }
      lastTickTimeRef.current = now;

      const store = useVisualizerStore.getState();
      if (store.currentStepIndex >= store.steps.length - 1) {
        store.pause();
      } else {
        nextStep();
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
      lastTickTimeRef.current = null;
    };
  }, [isPlaying, playbackSpeed, nextStep, pause, incrementElapsedTime]);
}
