import React, { useState, useEffect } from 'react';
import {
  Network,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Plus,
  Minus,
  ListFilter,
  Grid,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { GRAPH_PRESETS } from '../../algorithms/graph/presets';
import { buildAdjacencyList, buildAdjacencyMatrix } from '../../algorithms/graph/types';

export const GraphInputPanel: React.FC = () => {
  const graphData = useVisualizerStore((state) => state.graphData);
  const startNode = useVisualizerStore((state) => state.startNode);
  const activeGraphPresetId = useVisualizerStore((state) => state.activeGraphPresetId);
  const graphInputMode = useVisualizerStore((state) => state.graphInputMode);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const edgeFeedback = useVisualizerStore((state) => state.edgeFeedback);

  const setStartNode = useVisualizerStore((state) => state.setStartNode);
  const toggleDirectedGraph = useVisualizerStore((state) => state.toggleDirectedGraph);
  const selectGraphPreset = useVisualizerStore((state) => state.selectGraphPreset);
  const setGraphInputMode = useVisualizerStore((state) => state.setGraphInputMode);
  const setGraphNodesCount = useVisualizerStore((state) => state.setGraphNodesCount);
  const toggleEdge = useVisualizerStore((state) => state.toggleEdge);
  const addEdge = useVisualizerStore((state) => state.addEdge);
  const removeEdge = useVisualizerStore((state) => state.removeEdge);
  const setEdgeFeedback = useVisualizerStore((state) => state.setEdgeFeedback);
  const clearGraph = useVisualizerStore((state) => state.clearGraph);
  const generateExampleGraph = useVisualizerStore((state) => state.generateExampleGraph);
  const dfsMode = useVisualizerStore((state) => state.dfsMode);
  const setDfsMode = useVisualizerStore((state) => state.setDfsMode);

  const nodeCount = graphData.nodes.length;
  const isBFS = activeAlgorithmId === 'bfs';

  // State for custom edge addition
  const [edgeFrom, setEdgeFrom] = useState<number>(0);
  const [edgeTo, setEdgeTo] = useState<number>(1);

  // Derive safe valid From and To node IDs according to current graph nodes
  const nodeIds = graphData.nodes.map((n) => n.id);
  const currentFrom = nodeIds.includes(edgeFrom) ? edgeFrom : (nodeIds[0] ?? 0);
  const currentTo = nodeIds.includes(edgeTo)
    ? edgeTo
    : (nodeIds.find((id) => id !== currentFrom) ?? nodeIds[0] ?? 1);

  // Auto-dismiss edge feedback after 4 seconds
  useEffect(() => {
    if (edgeFeedback) {
      const timer = setTimeout(() => {
        setEdgeFeedback(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [edgeFeedback, setEdgeFeedback]);

  const adjList = buildAdjacencyList(graphData);
  const adjMatrix = buildAdjacencyMatrix(graphData);

  const handleAddEdge = () => {
    addEdge(currentFrom, currentTo);
  };

  return (
    <div className="bg-white dark:bg-[#0C1120] border border-[#CBD5E1] dark:border-[#18233C] rounded-2xl p-3.5 flex flex-col gap-3 shadow-sm">
      {/* Top Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-center">
        {/* Left Column: Graph Input & Controls (Span 6) */}
        <div className="lg:col-span-6 flex flex-col gap-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                Graph Input
              </span>
              <span className="text-[11px] text-[#475569] dark:text-slate-400 font-normal hidden sm:inline">
                ({isBFS ? 'Level-by-level queue expansion' : 'Deep branch exploration with backtracking'})
              </span>
            </div>

            {/* Input Mode Toggle: Adjacency List / Matrix */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] p-0.5 rounded-lg shadow-sm">
              <button
                type="button"
                onClick={() => setGraphInputMode('list')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  graphInputMode === 'list'
                    ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                    : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200'
                }`}
              >
                <ListFilter className="w-3 h-3" />
                Adjacency List
              </button>
              <button
                type="button"
                onClick={() => setGraphInputMode('matrix')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  graphInputMode === 'matrix'
                    ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                    : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-3 h-3" />
                Adjacency Matrix
              </button>
            </div>

            {/* DFS Mode Toggle (Recursive / Iterative) matching reference image */}
            {activeAlgorithmId === 'dfs' && (
              <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] p-0.5 rounded-lg shadow-sm">
                <span className="text-[10.5px] font-bold text-[#475569] dark:text-slate-300 px-1 font-mono">
                  DFS Mode:
                </span>
                <button
                  type="button"
                  onClick={() => setDfsMode('recursive')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    dfsMode === 'recursive'
                      ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                      : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200'
                  }`}
                >
                  Recursive
                </button>
                <button
                  type="button"
                  onClick={() => setDfsMode('iterative')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                    dfsMode === 'iterative'
                      ? 'bg-[#7C3AED] text-white font-bold shadow-sm'
                      : 'text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200'
                  }`}
                >
                  Iterative
                </button>
              </div>
            )}
          </div>

          {/* Node Count & Directed Toggle & Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Number of nodes counter */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] px-2.5 py-1 rounded-lg text-xs shadow-sm">
              <span className="text-[#334155] dark:text-slate-400 font-medium">Nodes:</span>
              <span className="font-mono font-bold text-[#7C3AED] dark:text-purple-400 w-4 text-center">{nodeCount}</span>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setGraphNodesCount(nodeCount - 1)}
                  disabled={nodeCount <= 1}
                  className="w-5 h-5 rounded flex items-center justify-center bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-300 border border-[#CBD5E1] dark:border-transparent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Decrease nodes"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setGraphNodesCount(nodeCount + 1)}
                  disabled={nodeCount >= 20}
                  className="w-5 h-5 rounded flex items-center justify-center bg-white dark:bg-[#131B2E] hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0F172A] dark:text-slate-300 border border-[#CBD5E1] dark:border-transparent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Increase nodes"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Directed Graph Toggle */}
            <button
              type="button"
              onClick={toggleDirectedGraph}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-all shadow-sm ${
                graphData.isDirected
                  ? 'bg-[#F3E8FF] dark:bg-purple-950/50 border-[#C084FC] dark:border-purple-600/60 text-[#7C3AED] dark:text-purple-300 font-semibold'
                  : 'bg-white dark:bg-[#090D18] border-[#CBD5E1] dark:border-[#1A253E] text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  graphData.isDirected ? 'bg-[#7C3AED] dark:bg-purple-400 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'
                }`}
              />
              <span>{graphData.isDirected ? 'Directed Graph' : 'Undirected Graph'}</span>
            </button>

            {/* Clear Graph Button */}
            <button
              type="button"
              onClick={clearGraph}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#334155] hover:text-[#0F172A] dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
            >
              <RotateCcw className="w-3 h-3 text-[#64748B] dark:text-slate-400" />
              <span>Clear Graph</span>
            </button>

            {/* Generate Example Button */}
            <button
              type="button"
              onClick={generateExampleGraph}
              className="px-3 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-purple-200" />
              <span>Generate Example</span>
            </button>
          </div>
        </div>

        {/* Middle Column: Start Node Selection (Span 2) */}
        <div className="lg:col-span-2 flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wider font-mono">
            Start Node
          </label>
          <div className="relative">
            <select
              value={startNode}
              onChange={(e) => setStartNode(Number(e.target.value))}
              className="w-full appearance-none bg-white dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] hover:border-[#7C3AED] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#D97706] dark:text-amber-300 cursor-pointer focus:outline-none focus:border-[#7C3AED] transition-colors shadow-sm"
            >
              {graphData.nodes.map((node) => (
                <option key={node.id} value={node.id} className="bg-white dark:bg-[#0C1120] text-[#0F172A] dark:text-slate-200">
                  Node {node.id}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Preset Graphs (Span 4) */}
        <div className="lg:col-span-4 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#475569] dark:text-slate-300 uppercase tracking-wider font-mono">
              Preset Graphs
            </span>
            <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-mono">
              {GRAPH_PRESETS.length} presets
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {GRAPH_PRESETS.map((preset) => {
              const isActive = activeGraphPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => selectGraphPreset(preset.id)}
                  title={preset.description}
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium border text-center transition-all truncate cursor-pointer shadow-sm ${
                    isActive
                      ? 'bg-[#7C3AED] border-[#7C3AED] text-white font-bold'
                      : 'bg-white dark:bg-[#090D18] border-[#CBD5E1] dark:border-[#1A253E] text-[#334155] dark:text-slate-400 hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}

            {/* Custom preset indicator */}
            <button
              type="button"
              disabled
              className={`px-2 py-1 rounded-lg text-[11px] font-medium border text-center transition-all truncate ${
                activeGraphPresetId === 'custom'
                  ? 'bg-amber-100 dark:bg-amber-600/30 border-amber-400 dark:border-amber-500/50 text-amber-800 dark:text-amber-300 font-bold'
                  : 'bg-[#F8FAFC]/50 dark:bg-[#090D18]/50 border-[#CBD5E1]/60 dark:border-[#1A253E]/60 text-slate-400 dark:text-slate-600'
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Connect Edge Action Bar (Visible in both List and Matrix modes) */}
      <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-[#17223A] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-[#334155] dark:text-slate-400 font-bold flex items-center gap-1.5">
            Connect Edge:
          </span>

          {/* From Node Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] hover:border-[#7C3AED] px-2.5 py-1 rounded-lg transition-colors shadow-sm">
            <span className="text-[#64748B] dark:text-slate-500 font-mono text-[11px]">From:</span>
            <div className="relative flex items-center">
              <select
                value={currentFrom}
                onChange={(e) => setEdgeFrom(Number(e.target.value))}
                className="bg-transparent text-[#D97706] dark:text-amber-300 font-bold font-mono focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {graphData.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-white dark:bg-[#0C1120] text-[#0F172A] dark:text-slate-200">
                    Node {n.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-slate-400 pointer-events-none absolute right-0" />
            </div>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />

          {/* To Node Selector */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] hover:border-[#7C3AED] px-2.5 py-1 rounded-lg transition-colors shadow-sm">
            <span className="text-[#64748B] dark:text-slate-500 font-mono text-[11px]">To:</span>
            <div className="relative flex items-center">
              <select
                value={currentTo}
                onChange={(e) => setEdgeTo(Number(e.target.value))}
                className="bg-transparent text-[#0284C7] dark:text-cyan-300 font-bold font-mono focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {graphData.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-white dark:bg-[#0C1120] text-[#0F172A] dark:text-slate-200">
                    Node {n.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-slate-400 pointer-events-none absolute right-0" />
            </div>
          </div>

          {/* Add Edge Button */}
          <button
            type="button"
            onClick={handleAddEdge}
            className="px-3.5 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5B21B6] text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Edge</span>
          </button>
        </div>

        {/* User-facing Validation & Status Message (Self-loop, duplicate, or success feedback) */}
        {edgeFeedback && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all shadow-sm ${
              edgeFeedback.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600/60 text-emerald-800 dark:text-emerald-300'
                : edgeFeedback.type === 'warning'
                ? 'bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-600/60 text-amber-800 dark:text-amber-300'
                : 'bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-600/60 text-rose-800 dark:text-rose-300'
            }`}
          >
            {edgeFeedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : edgeFeedback.type === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{edgeFeedback.message}</span>
          </div>
        )}
      </div>

      {/* Interactive Adjacency List View */}
      {graphInputMode === 'list' && (
        <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#17223A] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-300 font-mono flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              Adjacency List ({nodeCount} nodes)
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">
              Click any neighbor badge to remove edge
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {graphData.nodes.map((node) => {
              const nbrs = adjList[node.id] || [];
              return (
                <div
                  key={node.id}
                  className="bg-[#F8FAFC] dark:bg-[#090D18] border border-[#CBD5E1] dark:border-[#1A253E] rounded-xl p-2 flex flex-col gap-1.5 text-xs font-mono shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#141E33] pb-1">
                    <span className="font-bold text-purple-700 dark:text-purple-300">Node {node.id}</span>
                    <span className="text-[10px] text-[#64748B] dark:text-slate-500 font-sans">{nbrs.length} nbr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[22px] items-center">
                    {nbrs.length > 0 ? (
                      nbrs.map((nbrId) => (
                        <button
                          key={nbrId}
                          type="button"
                          onClick={() => removeEdge(node.id, nbrId)}
                          title={`Click to remove edge ${node.id} ${graphData.isDirected ? '→' : '—'} ${nbrId}`}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-[#131B2E] hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-[#CBD5E1] dark:border-[#1F2C4A] hover:border-rose-300 dark:hover:border-rose-600/60 text-[#0F172A] dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 transition-colors cursor-pointer text-[11px] flex items-center gap-1 group"
                        >
                          <span>{nbrId}</span>
                          <span className="text-slate-400 dark:text-slate-500 group-hover:text-rose-600 dark:group-hover:text-rose-400 text-[10px]">×</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-[11px] italic">empty</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Adjacency Matrix View */}
      {graphInputMode === 'matrix' && (
        <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#17223A] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0F172A] dark:text-slate-300 font-mono flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Adjacency Matrix ({nodeCount} × {nodeCount})
            </span>
            <span className="text-[11px] text-[#64748B] dark:text-slate-400">
              Click any cell to toggle an edge
            </span>
          </div>

          <div className="overflow-x-auto pb-1">
            <table className="border-collapse font-mono text-xs mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[#64748B] dark:text-slate-500 font-bold text-center w-8">#</th>
                  {graphData.nodes.map((n) => (
                    <th key={n.id} className="p-1 text-purple-700 dark:text-purple-300 font-bold text-center w-8">
                      {n.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graphData.nodes.map((rowNode, rIdx) => (
                  <tr key={rowNode.id}>
                    <td className="p-1 text-purple-700 dark:text-purple-300 font-bold text-center">{rowNode.id}</td>
                    {graphData.nodes.map((colNode, cIdx) => {
                      const hasEdge = (adjMatrix[rIdx] && adjMatrix[rIdx][cIdx] === 1) || false;
                      const isSelf = rowNode.id === colNode.id;
                      return (
                        <td key={colNode.id} className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => toggleEdge(rowNode.id, colNode.id)}
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                              isSelf
                                ? 'bg-[#F8FAFC] dark:bg-[#090D18] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 border border-slate-200 dark:border-slate-800'
                                : hasEdge
                                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm border border-purple-500'
                                : 'bg-white dark:bg-[#0F162A] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#475569] dark:text-slate-400 border border-[#CBD5E1] dark:border-[#1A2640]'
                            }`}
                            title={
                              isSelf
                                ? 'Self loop (not allowed)'
                                : `Toggle edge ${rowNode.id} ↔ ${colNode.id}`
                            }
                          >
                            {hasEdge ? 1 : 0}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
