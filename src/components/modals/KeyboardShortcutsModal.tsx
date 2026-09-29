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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md shadow-clean-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFC107]/15 text-[#B45309] border border-[#FFC107]/40">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#18181B] m-0">Keyboard Shortcuts</h2>
              <p className="text-xs text-[#64748B] m-0">Control the algorithm visualizer with ease</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#18181B] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 flex flex-col gap-2">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs"
            >
              <span className="text-[#18181B] font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] font-mono text-[#3F3F3F] text-xs font-bold shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-[#3F3F3F] hover:bg-[#2A2A2A] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
