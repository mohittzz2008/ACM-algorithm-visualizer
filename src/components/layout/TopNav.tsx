import React, { useEffect, useRef, useState } from 'react';
import { Search, Sun, Moon, Terminal } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { ACMLogo } from '../branding/AlgoVistaLogo';

export const TopNav: React.FC = () => {
  const theme = useVisualizerStore((state) => state.theme);
  const toggleTheme = useVisualizerStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';
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
    <header className="w-full bg-white/95 dark:bg-[#080B14]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1A2338] sticky top-0 z-40 px-3 sm:px-6 py-2.5 max-w-full overflow-hidden transition-colors">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand with geometric graph "A" logo — click to go home */}
        <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
          <ACMLogo variant="horizontal" size="md" />
        </div>

        {/* Center Nav Links with dynamic active indicator */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive = item.page === currentPage;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => item.page && setCurrentPage(item.page)}
                className={`text-xs cursor-pointer py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-[#7C3AED] dark:text-white relative after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#A855F7] dark:after:bg-purple-500 after:rounded-full after:shadow-[0_0_8px_#a855f7]'
                    : 'font-medium text-[#334155] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                {...(isActive ? { 'aria-current': 'page' as const } : {})}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search bar */}
          <div className="relative hidden lg:flex items-center">
            <Search className="w-3.5 h-3.5 text-[#475569] dark:text-slate-400 absolute left-3 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search algorithms"
              className="bg-white dark:bg-[#0F162A] text-xs text-[#0F172A] dark:text-slate-200 pl-8 pr-14 py-1.5 rounded-xl border border-[#CBD5E1] dark:border-[#1E2942] focus:border-[#7C3AED] focus:outline-none w-52 xl:w-60 placeholder:text-[#64748B] dark:placeholder:text-slate-500 transition-all focus:w-68 shadow-xs"
            />
            <div className="absolute right-2 flex items-center pointer-events-none">
              <kbd className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#18223B] border border-[#CBD5E1] dark:border-[#2A3756] text-[#64748B] dark:text-slate-400">
                Ctrl K
              </kbd>
            </div>
          </div>

          {/* Keyboard shortcut trigger button */}
          <button
            onClick={() => setShortcutsModalOpen(true)}
            title="Keyboard Shortcuts"
            aria-label="Open keyboard shortcuts"
            className="p-2 rounded-xl bg-white dark:bg-[#0F162A] border border-[#CBD5E1] dark:border-[#1E2942] text-[#334155] hover:text-[#0F172A] hover:border-[#94A3B8] dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-500 transition-colors hidden sm:flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Theme Toggle - available only in the visualizer application, hidden on homepage */}
          {currentPage !== 'home' && (
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              className="p-2 rounded-xl bg-white dark:bg-[#0F162A] border border-[#CBD5E1] dark:border-[#1E2942] text-[#334155] hover:text-[#7C3AED] hover:border-[#94A3B8] dark:text-slate-400 dark:hover:text-amber-400 dark:hover:border-slate-500 transition-colors flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          {/* User Profile Avatar */}
          <button
            type="button"
            aria-label="User Profile"
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs border border-purple-400/40 shadow-sm shadow-purple-900/30 cursor-pointer hover:ring-2 hover:ring-purple-400/50 transition-all"
          >
            M
          </button>
        </div>
      </div>
    </header>
  );
};
