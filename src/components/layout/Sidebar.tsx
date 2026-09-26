import React, { useState } from 'react';
import {
  Layers,
  Search,
  Network,
  Settings,
  HelpCircle,
  Share2,
  Lock,
  Boxes,
  Split,
  Binary,
  GitBranch,
  Check,
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { ALGORITHM_CATEGORIES } from '../../algorithms/registry';

export const Sidebar: React.FC = () => {
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const setActiveAlgorithmId = useVisualizerStore((state) => state.setActiveAlgorithmId);
  const setShortcutsModalOpen = useVisualizerStore((state) => state.setShortcutsModalOpen);
  const setSettingsModalOpen = useVisualizerStore((state) => state.setSettingsModalOpen);
  const [copied, setCopied] = useState(false);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'sorting':
        return <Layers className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />;
      case 'searching':
        return <Search className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />;
      case 'graph':
        return <Network className="w-3.5 h-3.5 text-[#047857] dark:text-emerald-400" />;
      default:
        return <Boxes className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />;
    }
  };

  const getAlgoIcon = (id: string) => {
    switch (id) {
      case 'bubble-sort':
        return <Boxes className="w-4 h-4" />;
      case 'merge-sort':
        return <Split className="w-4 h-4" />;
      case 'binary-search':
        return <Binary className="w-4 h-4" />;
      case 'bfs':
      case 'dfs':
        return <GitBranch className="w-4 h-4" />;
      default:
        return <Boxes className="w-4 h-4" />;
    }
  };

  const handleShare = () => {
    const text = `ACM Algorithm Visualizer: Active ${activeAlgorithmId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between py-1 min-h-[580px] select-none" aria-label="Algorithm Directory">
      {/* Category List */}
      <div className="flex flex-col gap-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#475569] dark:text-slate-400 px-3">
          Algorithms
        </span>

        {ALGORITHM_CATEGORIES.map((category) => (
          <div key={category.id} className="flex flex-col gap-1">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold text-[#475569] dark:text-slate-300">
              {getCategoryIcon(category.id)}
              <span>{category.name}</span>
            </div>

            {/* Algorithm Items */}
            <div className="flex flex-col gap-1">
              {category.algorithms.map((algo) => {
                const isActive = algo.id === activeAlgorithmId;
                return (
                  <button
                    key={algo.id}
                    onClick={() => {
                      if (algo.implemented) {
                        setActiveAlgorithmId(algo.id);
                      }
                    }}
                    disabled={!algo.implemented}
                    title={!algo.implemented ? `${algo.name} is scheduled for Phase 2` : algo.name}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#F3E8FF] dark:bg-purple-600/20 text-[#6D28D9] dark:text-purple-200 border border-[#C084FC] dark:border-purple-500/50 shadow-xs font-semibold'
                        : algo.implemented
                        ? 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] hover:bg-[#F8FAFC] dark:hover:text-slate-200 dark:hover:bg-[#12192D] border border-transparent cursor-pointer'
                        : 'text-[#94A3B8] dark:text-slate-600 border border-transparent cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#7C3AED] dark:text-purple-400' : algo.implemented ? 'text-[#475569] dark:text-slate-400' : 'text-[#94A3B8] dark:text-slate-600'}>
                        {getAlgoIcon(algo.id)}
                      </span>
                      <span>{algo.name}</span>
                    </div>

                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] dark:bg-purple-400 animate-pulse" />
                    ) : !algo.implemented ? (
                      <span className="flex items-center gap-1 text-[10px] text-[#64748B] dark:text-slate-500 bg-[#F1F5F9] dark:bg-[#0E1528] px-1.5 py-0.5 rounded border border-[#CBD5E1] dark:border-[#1E2942]">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Soon</span>
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Tools (Keyboard Shortcuts, Visualization Settings, Share) */}
      <div className="mt-8 bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#18233C] rounded-2xl p-3 flex flex-col gap-1.5 shadow-sm">
        <span className="text-[10px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-wider px-2 py-0.5">
          Tools
        </span>

        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#334155] hover:text-[#0F172A] hover:bg-[#F8FAFC] dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#162038] transition-colors text-left cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#7C3AED] dark:text-purple-400" />
          <span>Keyboard Shortcuts</span>
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#334155] hover:text-[#0F172A] hover:bg-[#F8FAFC] dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#162038] transition-colors text-left cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-[#0284C7] dark:text-blue-400" />
          <span>Visualization Settings</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#334155] hover:text-[#0F172A] hover:bg-[#F8FAFC] dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#162038] transition-colors text-left cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-[#E11D48] dark:text-pink-400" />
          )}
          <span>{copied ? 'Link Copied!' : 'Share / Export'}</span>
        </button>
      </div>
    </aside>
  );
};
