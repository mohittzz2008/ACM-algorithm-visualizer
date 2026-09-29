import React, { useEffect, useRef, useState } from 'react';
import { Search, Terminal } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { ACMLogo } from '../branding/AlgoVistaLogo';

export const TopNav: React.FC = () => {
  const currentPage = useVisualizerStore((state) => state.currentPage);
  const setCurrentPage = useVisualizerStore((state) => state.setCurrentPage);
  const setShortcutsModalOpen = useVisualizerStore((state) => state.setShortcutsModalOpen);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Ctrl+K / Cmd+K listener to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Visualizer', page: 'visualizer' as const },
    { label: 'Learn', page: null },
    { label: 'About', page: null },
  ];

  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] relative z-30 px-4 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-3 sm:gap-4 min-w-0">
        {/* Brand with geometric graph "A" logo — click to go home */}
        <div className="flex items-center shrink-0 whitespace-nowrap min-w-max cursor-pointer" onClick={() => setCurrentPage('home')}>
          <ACMLogo variant="horizontal" size="md" />
        </div>

        {/* Center Nav Links with clean yellow indicator */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 shrink-0 min-w-max" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = item.page === currentPage;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.page && setCurrentPage(item.page)}
                className={`text-xs cursor-pointer py-1 transition-colors ${
                  isActive
                    ? 'font-bold text-[#18181B] relative after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#FFC107] after:rounded-full after:shadow-[0_0_8px_#ffc107]'
                    : 'font-medium text-[#475569] hover:text-[#18181B]'
                }`}
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-max">
          {/* Search bar */}
          <div className="relative hidden lg:flex items-center">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search algorithms"
              className="bg-[#F8FAFC] text-xs text-[#18181B] pl-8 pr-14 py-1.5 rounded-xl border border-[#CBD5E1] focus:border-[#3F3F3F] focus:ring-1 focus:ring-[#3F3F3F] focus:outline-none w-36 lg:w-44 xl:w-52 placeholder:text-[#94A3B8] transition-colors shadow-xs"
            />
            <div className="absolute right-2 flex items-center pointer-events-none">
              <kbd className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#64748B]">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Keyboard shortcut trigger button */}
          <button
            onClick={() => setShortcutsModalOpen(true)}
            title="Keyboard Shortcuts"
            aria-label="Open keyboard shortcuts"
            className="p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#3F3F3F] hover:text-[#18181B] hover:border-[#3F3F3F] hover:bg-[#F8FAFC] transition-colors hidden sm:flex items-center justify-center cursor-pointer active:scale-95 shadow-xs shrink-0"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Clean ACM Mode Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[11px] font-mono font-semibold text-[#B45309] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
            <span>ACM Active</span>
          </div>

          {/* User Profile Avatar */}
          <button
            type="button"
            aria-label="User Profile"
            className="w-8 h-8 rounded-full bg-[#3F3F3F] text-[#FFC107] font-bold text-xs border border-[#3F3F3F] shadow-sm flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#FFC107]/60 transition-colors"
          >
            M
          </button>
        </div>
      </div>
    </header>
  );
};
