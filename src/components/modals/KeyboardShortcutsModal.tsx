import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';

export const KeyboardShortcutsModal: React.FC = () => {
  const isShortcutsModalOpen = useVisualizerStore((state) => state.isShortcutsModalOpen);
  const setShortcutsModalOpen = useVisualizerStore((state) => state.setShortcutsModalOpen);

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', description: 'Play or pause the visualization' },
    { key: 'Right Arrow', description: 'Step forward one step' },
    { key: 'Left Arrow', description: 'Step backward one step' },
    { key: 'R', description: 'Reset visualization to start' },
    { key: 'Home', description: 'Jump to the first step' },
    { key: 'End', description: 'Jump to the final step' },
    { key: '?', description: 'Open / close this keyboard shortcut dialog' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-[#0D1322] border border-[#CBD5E1] dark:border-[#202E4E] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1A253E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] dark:text-white m-0">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#475569] dark:text-slate-400 m-0">Control the algorithm visualizer with ease</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#18233C] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 flex flex-col gap-2">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#121A2D] border border-[#CBD5E1] dark:border-[#1E2C4B] text-xs"
            >
              <span className="text-[#0F172A] dark:text-slate-300 font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1B253E] border border-[#CBD5E1] dark:border-[#2D3E64] font-mono text-purple-700 dark:text-purple-300 text-xs font-bold shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1A253E] bg-[#F8FAFC] dark:bg-[#0A0F1D] flex justify-end">
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
