import React, { useState } from 'react';
import { TopNav } from './components/layout/TopNav';
import { Sidebar } from './components/layout/Sidebar';
import { HeaderInfo } from './components/layout/HeaderInfo';
import { InputArrayPanel } from './components/input/InputArrayPanel';
import { GraphInputPanel } from './components/input/GraphInputPanel';
import { VisualizerContainer } from './components/visualizer/VisualizerContainer';
import { PseudocodePanel } from './components/panels/PseudocodePanel';
import { CurrentStepPanel } from './components/panels/CurrentStepPanel';
import { StatisticsPanel } from './components/panels/StatisticsPanel';
import { ExplanationPanel } from './components/panels/ExplanationPanel';
import { CustomInputModal } from './components/modals/CustomInputModal';
import { KeyboardShortcutsModal } from './components/modals/KeyboardShortcutsModal';
import { VisualizationSettingsModal } from './components/modals/VisualizationSettingsModal';
import { usePlaybackEngine } from './hooks/usePlaybackEngine';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useVisualizerStore } from './store/useVisualizerStore';
import { HomePage } from './pages/HomePage';
import { Menu, X } from 'lucide-react';

export const App: React.FC = () => {
  const currentPage = useVisualizerStore((state) => state.currentPage);

  // Render HomePage when on 'home' page
  if (currentPage === 'home') {
    return <HomePage />;
  }

  // Render Visualizer when on 'visualizer' page
  return <VisualizerPage />;
};

/** The original visualizer layout, extracted as its own component */
const VisualizerPage: React.FC = () => {
  // Initialize playback timing engine and keyboard shortcuts
  usePlaybackEngine();
  useKeyboardShortcuts();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);

  const isGraphAlgorithm = activeAlgorithmId === 'bfs' || activeAlgorithmId === 'dfs';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080B14] text-[#0F172A] dark:text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 flex gap-6 max-w-full overflow-x-clip">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-white dark:bg-[#0B101D] border-r border-[#CBD5E1] dark:border-[#1E2942] h-full p-4 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1A253E]">
                <span className="font-bold text-sm text-[#0F172A] dark:text-white">Algorithms Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Primary Interactive Workspace */}
        <main className="flex-1 flex flex-col gap-4 min-w-0 max-w-full">
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center justify-between bg-white dark:bg-[#0F162A] border border-[#CBD5E1] dark:border-[#1E2942] rounded-xl px-4 py-2">
            <span className="text-xs font-semibold text-[#475569] dark:text-slate-300">Algorithm Navigation</span>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#6D28D9] dark:text-purple-400 font-semibold px-2.5 py-1 rounded-lg bg-[#F3E8FF] dark:bg-purple-600/20 border border-[#C084FC] dark:border-purple-500/30 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
              <span>Browse</span>
            </button>
          </div>

          {/* Product Header & Complexity Cards */}
          <HeaderInfo />

          {/* Dynamic Input Panel: GraphInputPanel for BFS/DFS, InputArrayPanel for Sorting/Searching */}
          {isGraphAlgorithm ? <GraphInputPanel /> : <InputArrayPanel />}

          {/* Primary Visualization Stage with integrated Operation HUD and Playback Controls */}
          <VisualizerContainer />

          {/* Lower Information Area */}
          {isGraphAlgorithm ? (
            /* Graph Traversal layout (BFS & DFS): Pseudocode & Explanation top row, Statistics full width below */
            <div className="flex flex-col gap-3.5 pt-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                <PseudocodePanel />
                <ExplanationPanel />
              </div>
              <StatisticsPanel />
            </div>
          ) : activeAlgorithmId === 'binary-search' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 pt-1">
              <PseudocodePanel />
              <ExplanationPanel />
              <StatisticsPanel />
            </div>
          ) : (
            /* Bubble Sort & Merge Sort: Established 2-Tier Hierarchy */
            <div className="flex flex-col gap-3.5 pt-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                <PseudocodePanel />
                <CurrentStepPanel />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                <ExplanationPanel />
                <StatisticsPanel />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <CustomInputModal />
      <KeyboardShortcutsModal />
      <VisualizationSettingsModal />
    </div>
  );
};

export default App;
