import React from 'react';
import { Code2 } from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { bubbleSortPseudocode } from '../../algorithms/sorting/bubbleSort';
import { mergeSortPseudocode } from '../../algorithms/sorting/mergeSort';
import { binarySearchPseudocode } from '../../algorithms/searching/binarySearch';
import { bfsPseudocode } from '../../algorithms/graph/bfs';
import { dfsRecursivePseudocode, dfsIterativePseudocode } from '../../algorithms/graph/dfs';
import type { SupportedLanguage } from '../../algorithms/types';

export const PseudocodePanel: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const selectedLanguage = useVisualizerStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useVisualizerStore((state) => state.setSelectedLanguage);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const dfsMode = useVisualizerStore((state) => state.dfsMode);

  const currentStep = steps[currentStepIndex];
  const activeLine = currentStep?.pseudocodeLine ?? 0;
  const currentDefinition =
    activeAlgorithmId === 'bfs'
      ? bfsPseudocode[selectedLanguage] || bfsPseudocode.python
      : activeAlgorithmId === 'dfs'
      ? (dfsMode === 'iterative'
          ? dfsIterativePseudocode[selectedLanguage] || dfsIterativePseudocode.python
          : dfsRecursivePseudocode[selectedLanguage] || dfsRecursivePseudocode.python)
      : activeAlgorithmId === 'binary-search'
      ? binarySearchPseudocode[selectedLanguage] || binarySearchPseudocode.python
      : activeAlgorithmId === 'merge-sort'
      ? mergeSortPseudocode[selectedLanguage] || mergeSortPseudocode.python
      : bubbleSortPseudocode[selectedLanguage] || bubbleSortPseudocode.python;

  // Enhanced token highlight helper matching design tokens
  const renderSyntaxHighlighted = (code: string) => {
    // Split into tokens preserving spaces and punctuation
    const parts = code.split(/(\b(?:def|function|void|public|static|return|for|while|elif|else|in|range|let|const|int|if|vector|std::swap|merge_sort|mergeSort|merge|binary_search|binarySearch|floor|Math|bfs|dfs|queue|stack|visited|append|pop|push|shift|add|not|and|or|true|false|True|False|None|null|new|class|this|self|break|continue|set|list|deque|len)\b|[()[\];,><=+\-/:{}#]|"[^"]*"|'[^']*')/g);

    return parts.map((part, idx) => {
      // Keywords
      if (/^(def|function|void|public|static|return|for|while|elif|else|in|if|let|const|int|vector|not|and|or|class|break|continue|new|this|self)$/.test(part)) {
        return (
          <span key={idx} className="text-[#7C3AED] dark:text-pink-400 font-semibold">
            {part}
          </span>
        );
      }
      // Built-in functions / types
      if (/^(range|std::swap|merge_sort|mergeSort|merge|binary_search|binarySearch|floor|Math|bfs|dfs|queue|stack|visited|append|pop|push|shift|add|set|list|deque|len)$/.test(part)) {
        return (
          <span key={idx} className="text-[#2563EB] dark:text-cyan-400 font-semibold">
            {part}
          </span>
        );
      }
      // Boolean / None literals
      if (/^(true|false|True|False|None|null)$/.test(part)) {
        return (
          <span key={idx} className="text-[#D97706] dark:text-orange-300 font-semibold">
            {part}
          </span>
        );
      }
      // Operators
      if (/^[-+><=]$/.test(part)) {
        return (
          <span key={idx} className="text-[#E11D48] dark:text-purple-300">
            {part}
          </span>
        );
      }
      // Numeric literals
      if (/^\d+$/.test(part)) {
        return (
          <span key={idx} className="text-[#D97706] dark:text-amber-300 font-mono">
            {part}
          </span>
        );
      }
      // String literals
      if (/^["'].*["']$/.test(part)) {
        return (
          <span key={idx} className="text-[#059669] dark:text-green-400">
            {part}
          </span>
        );
      }
      // Comments
      if (part.startsWith('#') || part.startsWith('//')) {
        return (
          <span key={idx} className="text-[#64748B] dark:text-slate-500 italic">
            {part}
          </span>
        );
      }
      return (
        <span key={idx} className="text-[#0F172A] dark:text-slate-200">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#19243C] rounded-2xl p-4 flex flex-col justify-between shadow-sm h-full">
      {/* Header with Title and Language Selector */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#17223A]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#7C3AED] dark:text-purple-400" />
          <span className="text-xs font-bold text-[#0F172A] dark:text-white tracking-wide uppercase font-mono">
            Pseudocode
          </span>
        </div>

        {/* Language pill tabs */}
        <div className="flex items-center gap-0.5 bg-[#F1F5F9] dark:bg-[#0e1628] border border-[#CBD5E1] dark:border-[#1b2742] p-0.5 rounded-lg" role="tablist" aria-label="Programming Language">
          {(
            [
              { id: 'python', label: 'Python' },
              { id: 'javascript', label: 'JavaScript' },
              { id: 'cpp', label: 'C++' },
              { id: 'java', label: 'Java' },
            ] as { id: SupportedLanguage; label: string }[]
          ).map((lang) => {
            const isActive = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                role="tab"
                aria-selected={isActive}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                    : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-[#182038]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Container */}
      <div className="pt-3 font-mono text-xs flex flex-col gap-0.5 overflow-x-auto scrollbar-none" role="tabpanel">
        {currentDefinition.lines.map((line) => {
          const isActive = line.lineNumber === activeLine;
          return (
            <div
              key={line.lineNumber}
              className={`flex items-center gap-3 px-2.5 py-1.5 rounded-lg transition-all font-mono ${
                isActive
                  ? 'bg-[#F3E8FF] dark:bg-purple-950/70 text-[#0F172A] dark:text-purple-200 border-l-[3px] border-l-[#A855F7] border border-[#E9D5FF] dark:border-purple-800/40 shadow-sm'
                  : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 hover:bg-[#F8FAFC] dark:hover:bg-[#0E1628]/50'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Line Number */}
              <span
                className={`w-5 text-right text-[11px] select-none ${
                  isActive ? 'text-[#7C3AED] dark:text-purple-400 font-bold' : 'text-[#64748B] dark:text-slate-600'
                }`}
              >
                {line.lineNumber}
              </span>

              {/* Code text with syntax highlight */}
              <span className="whitespace-pre font-medium">
                {renderSyntaxHighlighted(line.code)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
