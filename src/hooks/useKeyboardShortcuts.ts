import { useEffect } from 'react';
import { useVisualizerStore } from '../store/useVisualizerStore';

export function useKeyboardShortcuts() {
  const togglePlay = useVisualizerStore((state) => state.togglePlay);
  const nextStep = useVisualizerStore((state) => state.nextStep);
  const prevStep = useVisualizerStore((state) => state.prevStep);
  const reset = useVisualizerStore((state) => state.reset);
  const goToFirst = useVisualizerStore((state) => state.goToFirst);
  const goToLast = useVisualizerStore((state) => state.goToLast);
  const setShortcutsModalOpen = useVisualizerStore((state) => state.setShortcutsModalOpen);
  const isShortcutsModalOpen = useVisualizerStore((state) => state.isShortcutsModalOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'KeyR':
          e.preventDefault();
          reset();
          break;
        case 'Home':
          e.preventDefault();
          goToFirst();
          break;
        case 'End':
          e.preventDefault();
          goToLast();
          break;
        case 'Slash':
          if (e.shiftKey) {
            // '?' key
            e.preventDefault();
            setShortcutsModalOpen(!isShortcutsModalOpen);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    nextStep,
    prevStep,
    reset,
    goToFirst,
    goToLast,
    setShortcutsModalOpen,
    isShortcutsModalOpen,
  ]);
}
