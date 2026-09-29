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
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 flex flex-col gap-3 shadow-clean-card">
      {/* Top Controls Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5 items-center">
        {/* Left Column: Graph Input & Controls (Span 6) */}
        <div className="xl:col-span-6 flex flex-col gap-2.5 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wide font-mono flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-[#3F3F3F]" />
                Graph Input
              </span>
              <span className="text-[11px] text-[#64748B] font-normal hidden sm:inline">
                ({isBFS ? 'Level-by-level queue expansion' : 'Deep branch exploration with backtracking'})
              </span>
            </div>

            {/* Input Mode Toggle: Adjacency List / Matrix */}
            <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-0.5 rounded-lg shadow-xs">
              <button
                type="button"
                onClick={() => setGraphInputMode('list')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  graphInputMode === 'list'
                    ? 'bg-[#3F3F3F] text-white font-bold shadow-xs'
                    : 'text-[#475569] hover:text-[#18181B]'
                }`}
              >
                <ListFilter className="w-3 h-3" />
                Adjacency List
              </button>
              <button
                type="button"
                onClick={() => setGraphInputMode('matrix')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  graphInputMode === 'matrix'
                    ? 'bg-[#3F3F3F] text-white font-bold shadow-xs'
                    : 'text-[#475569] hover:text-[#18181B]'
                }`}
              >
                <Grid className="w-3 h-3" />
                Adjacency Matrix
              </button>
            </div>

            {/* DFS Mode Toggle (Recursive / Iterative) */}
            {activeAlgorithmId === 'dfs' && (
              <div className="flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-0.5 rounded-lg shadow-xs">
                <span className="text-[10.5px] font-bold text-[#475569] px-1 font-mono">
                  DFS Mode:
                </span>
                <button
                  type="button"
                  onClick={() => setDfsMode('recursive')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    dfsMode === 'recursive'
                      ? 'bg-[#FFC107] text-[#18181B] font-bold shadow-xs'
                      : 'text-[#475569] hover:text-[#18181B]'
                  }`}
                >
                  Recursive
                </button>
                <button
                  type="button"
                  onClick={() => setDfsMode('iterative')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    dfsMode === 'iterative'
                      ? 'bg-[#FFC107] text-[#18181B] font-bold shadow-xs'
                      : 'text-[#475569] hover:text-[#18181B]'
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
            <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-2.5 py-1 rounded-lg text-xs shadow-xs">
              <span className="text-[#475569] font-medium">Nodes:</span>
              <span className="font-mono font-bold text-[#18181B] w-4 text-center">{nodeCount}</span>
              <div className="flex items-center gap-0.5 ml-1">
                <button
                  type="button"
                  onClick={() => setGraphNodesCount(nodeCount - 1)}
                  disabled={nodeCount <= 1}
                  className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Decrease nodes"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setGraphNodesCount(nodeCount + 1)}
                  disabled={nodeCount >= 20}
                  className="w-5 h-5 rounded flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#18181B] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium cursor-pointer transition-colors shadow-xs ${
                graphData.isDirected
                  ? 'bg-[#FFFBEB] border-[#FFC107] text-[#B45309] font-semibold'
                  : 'bg-white border-[#E2E8F0] text-[#475569] hover:text-[#18181B]'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  graphData.isDirected ? 'bg-[#FFC107]' : 'bg-slate-400'
                }`}
              />
              <span>{graphData.isDirected ? 'Directed Graph' : 'Undirected Graph'}</span>
            </button>

            {/* Clear Graph Button */}
            <button
              type="button"
              onClick={clearGraph}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#475569] hover:text-[#18181B] text-xs font-medium cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3 h-3 text-[#64748B]" />
              <span>Clear Graph</span>
            </button>

            {/* Generate Example Button */}
            <button
              type="button"
              onClick={generateExampleGraph}
              className="px-3 py-1 rounded-lg bg-[#FFC107] hover:bg-[#F59E0B] text-[#18181B] text-xs font-bold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-[#18181B]" />
              <span>Generate Example</span>
            </button>
          </div>
        </div>

        {/* Middle Column: Start Node Selection (Span 2) */}
        <div className="xl:col-span-2 flex flex-col gap-1.5 min-w-0">
          <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider font-mono">
            Start Node
          </label>
          <div className="relative">
            <select
              value={startNode}
              onChange={(e) => setStartNode(Number(e.target.value))}
              className="w-full appearance-none bg-white border border-[#E2E8F0] hover:border-[#FFC107] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-[#B45309] cursor-pointer focus:outline-none focus:border-[#FFC107] transition-colors shadow-xs"
            >
              {graphData.nodes.map((node) => (
                <option key={node.id} value={node.id} className="bg-white text-[#18181B]">
                  Node {node.id}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right Column: Preset Graphs (Span 4) */}
        <div className="xl:col-span-4 flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider font-mono">
              Preset Graphs
            </span>
            <span className="text-[10px] text-[#64748B] font-mono">
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
                  className={`px-2 py-1 rounded-lg text-[11px] font-medium border text-center transition-colors truncate cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-[#3F3F3F] border-[#3F3F3F] text-white font-bold'
                      : 'bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]'
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
              className={`px-2 py-1 rounded-lg text-[11px] font-medium border text-center transition-colors truncate ${
                activeGraphPresetId === 'custom'
                  ? 'bg-amber-100 border-amber-400 text-amber-800 font-bold'
                  : 'bg-[#F8FAFC]/50 border-[#E2E8F0]/60 text-slate-400'
              }`}
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Connect Edge Action Bar */}
      <div className="pt-2.5 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-[#3F3F3F] font-bold flex items-center gap-1.5">
            Connect Edge:
          </span>

          {/* From Node Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] hover:border-[#FFC107] px-2.5 py-1 rounded-lg transition-colors shadow-xs">
            <span className="text-[#64748B] font-mono text-[11px]">From:</span>
            <div className="relative flex items-center">
              <select
                value={currentFrom}
                onChange={(e) => setEdgeFrom(Number(e.target.value))}
                className="bg-transparent text-[#B45309] font-bold font-mono focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {graphData.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-white text-[#18181B]">
                    Node {n.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#64748B] pointer-events-none absolute right-0" />
            </div>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

          {/* To Node Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] hover:border-[#FFC107] px-2.5 py-1 rounded-lg transition-colors shadow-xs">
            <span className="text-[#64748B] font-mono text-[11px]">To:</span>
            <div className="relative flex items-center">
              <select
                value={currentTo}
                onChange={(e) => setEdgeTo(Number(e.target.value))}
                className="bg-transparent text-[#0284C7] font-bold font-mono focus:outline-none cursor-pointer pr-4 appearance-none"
              >
                {graphData.nodes.map((n) => (
                  <option key={n.id} value={n.id} className="bg-white text-[#18181B]">
                    Node {n.id}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-[#64748B] pointer-events-none absolute right-0" />
            </div>
          </div>

          {/* Add Edge Button */}
          <button
            type="button"
            onClick={handleAddEdge}
            className="px-3.5 py-1 rounded-lg bg-[#3F3F3F] hover:bg-[#2A2A2A] text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#FFC107]" />
            <span>Add Edge</span>
          </button>
        </div>

        {/* User-facing Validation & Status Message */}
        {edgeFeedback && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors shadow-xs ${
              edgeFeedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                : edgeFeedback.type === 'warning'
                ? 'bg-amber-50 border border-amber-300 text-amber-800'
                : 'bg-rose-50 border border-rose-300 text-rose-800'
            }`}
          >
            {edgeFeedback.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : edgeFeedback.type === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span>{edgeFeedback.message}</span>
          </div>
        )}
      </div>

      {/* Interactive Adjacency List View */}
      {graphInputMode === 'list' && (
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#18181B] font-mono flex items-center gap-1.5">
              <ListFilter className="w-3.5 h-3.5 text-[#3F3F3F]" />
              Adjacency List ({nodeCount} nodes)
            </span>
            <span className="text-[11px] text-[#64748B]">
              Click any neighbor badge to remove edge
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {graphData.nodes.map((node) => {
              const nbrs = adjList[node.id] || [];
              return (
                <div
                  key={node.id}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2 flex flex-col gap-1.5 text-xs font-mono shadow-xs"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1">
                    <span className="font-bold text-[#3F3F3F]">Node {node.id}</span>
                    <span className="text-[10px] text-[#64748B] font-sans">{nbrs.length} nbr</span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-h-[22px] items-center">
                    {nbrs.length > 0 ? (
                      nbrs.map((nbrId) => (
                        <button
                          key={nbrId}
                          type="button"
                          onClick={() => removeEdge(node.id, nbrId)}
                          title={`Click to remove edge ${node.id} ${graphData.isDirected ? '→' : '—'} ${nbrId}`}
                          className="px-1.5 py-0.5 rounded bg-white hover:bg-rose-50 border border-[#CBD5E1] hover:border-rose-300 text-[#18181B] hover:text-rose-700 transition-colors cursor-pointer text-[11px] flex items-center gap-1 group shadow-xs"
                        >
                          <span>{nbrId}</span>
                          <span className="text-slate-400 group-hover:text-rose-600 text-[10px]">×</span>
                        </button>
                      ))
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">empty</span>
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
        <div className="pt-2 border-t border-[#E2E8F0] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#18181B] font-mono flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-[#3F3F3F]" />
              Adjacency Matrix ({nodeCount} × {nodeCount})
            </span>
            <span className="text-[11px] text-[#64748B]">
              Click any cell to toggle an edge
            </span>
          </div>

          <div className="overflow-x-auto pb-1">
            <table className="border-collapse font-mono text-xs mx-auto">
              <thead>
                <tr>
                  <th className="p-1 text-[#64748B] font-bold text-center w-8">#</th>
                  {graphData.nodes.map((n) => (
                    <th key={n.id} className="p-1 text-[#3F3F3F] font-bold text-center w-8">
                      {n.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {graphData.nodes.map((rowNode, rIdx) => (
                  <tr key={rowNode.id}>
                    <td className="p-1 text-[#3F3F3F] font-bold text-center">{rowNode.id}</td>
                    {graphData.nodes.map((colNode, cIdx) => {
                      const hasEdge = (adjMatrix[rIdx] && adjMatrix[rIdx][cIdx] === 1) || false;
                      const isSelf = rowNode.id === colNode.id;
                      return (
                        <td key={colNode.id} className="p-1 text-center">
                          <button
                            type="button"
                            onClick={() => toggleEdge(rowNode.id, colNode.id)}
                            className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                              isSelf
                                ? 'bg-[#F8FAFC] text-slate-400 hover:text-slate-600 border border-slate-200'
                                : hasEdge
                                ? 'bg-[#3F3F3F] hover:bg-[#2A2A2A] text-white shadow-xs border border-[#3F3F3F]'
                                : 'bg-white hover:bg-slate-100 text-[#475569] border border-[#CBD5E1]'
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
