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
        return <Layers className="w-3.5 h-3.5 text-[#D97706]" />;
      case 'searching':
        return <Search className="w-3.5 h-3.5 text-[#3F3F3F]" />;
      case 'graph':
        return <Network className="w-3.5 h-3.5 text-[#059669]" />;
      default:
        return <Boxes className="w-3.5 h-3.5 text-[#64748B]" />;
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
    <nav
      className="w-full h-full bg-white flex flex-col justify-between gap-5 p-3.5 sm:p-4 select-none min-w-0"
      aria-label="Algorithm Directory"
    >
      {/* Category List */}
      <div className="flex flex-col gap-3">
        {/* Sidebar Directory Header */}
        <div className="flex items-center justify-between px-2 pt-0.5 pb-2 border-b border-[#F1F5F9] shrink-0 w-full">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#475569] font-mono flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-[#FFC107] ring-2 ring-[#FEF3C7] shrink-0" />
            Algorithms
          </span>
          <span className="text-[10px] font-mono font-bold text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#E2E8F0] shrink-0 whitespace-nowrap">
            Directory
          </span>
        </div>

        {/* Algorithm Categories */}
        <div className="flex flex-col gap-3.5">
          {ALGORITHM_CATEGORIES.map((category) => (
            <div key={category.id} className="flex flex-col gap-1.5">
              {/* Category Section Heading with Strong Visual Hierarchy */}
              <div className="flex items-center justify-between px-2 py-1 bg-[#F8FAFC] border border-[#E2E8F0]/80 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-white border border-[#E2E8F0] shadow-2xs">
                    {getCategoryIcon(category.id)}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#18181B] font-mono">
                    {category.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#64748B] bg-white border border-[#E2E8F0] px-1.5 py-0.2 rounded shadow-2xs">
                  {category.algorithms.length}
                </span>
              </div>

              {/* Algorithm Items */}
              <div className="flex flex-col gap-1 pl-1">
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
                      title={!algo.implemented ? `${algo.name} (Coming Soon)` : algo.name}
                      className={`group flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs transition-colors ${
                        isActive
                          ? 'bg-[#3F3F3F] text-white border border-[#27272A] shadow-xs font-semibold'
                          : algo.implemented
                          ? 'text-[#18181B] font-semibold hover:text-black hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] cursor-pointer'
                          : 'text-[#334155] font-medium bg-[#F8FAFC]/70 border border-dashed border-[#CBD5E1] cursor-not-allowed hover:bg-[#F1F5F9]/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#FFC107]'
                              : algo.implemented
                              ? 'text-[#475569] group-hover:text-[#18181B]'
                              : 'text-[#64748B]'
                          }`}
                        >
                          {getAlgoIcon(algo.id)}
                        </span>
                        <span className="truncate">{algo.name}</span>
                      </div>

                      {isActive ? (
                        <span className="w-2 h-2 rounded-full bg-[#FFC107] shadow-[0_0_8px_rgba(255,193,7,0.9)] shrink-0 ml-1.5" />
                      ) : !algo.implemented ? (
                        <span className="shrink-0 ml-1.5 flex items-center gap-1 text-[10px] font-bold font-mono text-[#78350F] bg-[#FEF3C7] px-2 py-0.5 rounded-full border border-[#FDE68A] shadow-2xs">
                          <Lock className="w-2.5 h-2.5 text-[#D97706]" />
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
      </div>

      {/* Secondary Tools (Keyboard Shortcuts, Visualization Settings, Share) */}
      <div className="pt-3 border-t border-[#E2E8F0] flex flex-col gap-1.5">
        <span className="text-[10px] font-extrabold text-[#64748B] uppercase tracking-wider px-2 py-0.5 font-mono">
          Tools
        </span>

        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#18181B] hover:text-black hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors text-left cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#475569]" />
          <span>Keyboard Shortcuts</span>
        </button>

        <button
          onClick={() => setSettingsModalOpen(true)}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#18181B] hover:text-black hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors text-left cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-[#D97706]" />
          <span>Visualization Settings</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#18181B] hover:text-black hover:bg-[#F1F5F9] border border-transparent hover:border-[#E2E8F0] transition-colors text-left cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#059669]" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-[#475569]" />
          )}
          <span>{copied ? 'Link Copied!' : 'Share / Export'}</span>
        </button>
      </div>
    </nav>
  );
};

