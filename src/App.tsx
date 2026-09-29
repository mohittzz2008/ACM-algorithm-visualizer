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
import { GeometricCanvasBackground } from './components/layout/GeometricCanvasBackground';
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
    <div className="min-h-screen bg-white text-[#18181B] flex flex-col font-sans selection:bg-[#FFC107] selection:text-[#18181B] relative">
      {/* Edge & Corner Minimal Geometric Yellow & Charcoal Shapes */}
      <GeometricCanvasBackground variant="visualizer" />

      {/* Top Navigation */}
      <TopNav />

      {/* Main Content Area: Seamlessly Integrated Workspace */}
      <div className="relative z-10 flex-1 flex w-full min-h-0">
        {/* Desktop Left Sidebar - stable 256px width eliminates 32px snapping at 1280px zoom */}
        <aside className="hidden lg:flex flex-col shrink-0 w-64 border-r border-[#E2E8F0] bg-white min-h-full">
          <Sidebar />
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-xs"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-72 bg-white border-r border-[#CBD5E1] h-full p-4 flex flex-col z-10 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="font-bold text-sm text-[#18181B]">Algorithms Menu</span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Primary Interactive Workspace - smooth stable padding across zoom levels */}
        <main className="flex-1 flex flex-col gap-4 min-w-0 p-4 sm:p-6 max-w-[1440px] w-full">
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center justify-between bg-white border border-[#CBD5E1] rounded-xl px-4 py-2 shadow-xs">
            <span className="text-xs font-semibold text-[#3F3F3F]">Algorithm Navigation</span>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[#18181B] font-semibold px-2.5 py-1 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] hover:bg-[#FEF3C7] cursor-pointer"
            >
              <Menu className="w-4 h-4 text-[#D97706]" />
              <span>Browse</span>
            </button>
          </div>

          {/* Product Header & Complexity Cards */}
          <HeaderInfo />

          {/* Dynamic Input Panel: GraphInputPanel for BFS/DFS, InputArrayPanel for Sorting/Searching */}
          {isGraphAlgorithm ? <GraphInputPanel /> : <InputArrayPanel />}

          {/* Primary Visualization Stage with integrated Operation HUD and Playback Controls */}
          <VisualizerContainer />

          {/* Lower Information Area - stable lg breakpoint prevents sudden 1-column jumping on zoom */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
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
