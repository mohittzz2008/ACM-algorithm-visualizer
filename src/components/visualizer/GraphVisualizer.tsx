import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Network,
  Plus,
  Minus,
  Maximize2,
  Lightbulb,
} from 'lucide-react';
import { useVisualizerStore } from '../../store/useVisualizerStore';
import { GRAPH_PRESETS } from '../../algorithms/graph/presets';
import { NODE_RADIUS, CANVAS_WIDTH, computeLevelBands } from '../../algorithms/graph/layout';
import type { ElementVisualState } from '../../algorithms/types';

export const GraphVisualizer: React.FC = () => {
  const steps = useVisualizerStore((state) => state.steps);
  const currentStepIndex = useVisualizerStore((state) => state.currentStepIndex);
  const isPlaying = useVisualizerStore((state) => state.isPlaying);
  const playbackSpeed = useVisualizerStore((state) => state.playbackSpeed);
  const graphData = useVisualizerStore((state) => state.graphData);
  const startNode = useVisualizerStore((state) => state.startNode);
  const targetNode = useVisualizerStore((state) => state.targetNode);
  const activeGraphPresetId = useVisualizerStore((state) => state.activeGraphPresetId);
  const activeAlgorithmId = useVisualizerStore((state) => state.activeAlgorithmId);
  const dfsMode = useVisualizerStore((state) => state.dfsMode);

  const togglePlay = useVisualizerStore((state) => state.togglePlay);
  const nextStep = useVisualizerStore((state) => state.nextStep);
  const prevStep = useVisualizerStore((state) => state.prevStep);
  const goToFirst = useVisualizerStore((state) => state.goToFirst);
  const goToLast = useVisualizerStore((state) => state.goToLast);
  const seekToStep = useVisualizerStore((state) => state.seekToStep);
  const reset = useVisualizerStore((state) => state.reset);
  const setPlaybackSpeed = useVisualizerStore((state) => state.setPlaybackSpeed);
  const selectGraphPreset = useVisualizerStore((state) => state.selectGraphPreset);

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = Math.max(1, steps.length);
  const isComplete = currentStep?.type === 'bfs-complete' || currentStep?.type === 'dfs-complete';
  const isBFS = activeAlgorithmId === 'bfs';

  const levelBands = isBFS
    ? computeLevelBands(graphData.nodes, graphData.edges, startNode, currentStep?.nodeLevels)
    : [];

  // Zoom and Pan interaction state
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
  };

  const handleResetView = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFitView = () => {
    if (graphData.nodes.length === 0) {
      handleResetView();
      return;
    }
    const xs = graphData.nodes.map((n) => n.x);
    const ys = graphData.nodes.map((n) => n.y);
    const minX = Math.min(...xs) - NODE_RADIUS - 15;
    const maxX = Math.max(...xs) + NODE_RADIUS + 15;
    const minY = Math.min(...ys) - NODE_RADIUS - 25;
    const maxY = Math.max(...ys) + NODE_RADIUS + 25;

    const graphWidth = Math.max(100, maxX - minX);
    const graphHeight = Math.max(80, maxY - minY);

    const scaleX = 460 / graphWidth;
    const scaleY = 320 / graphHeight;
    const fitScale = Math.min(1.4, Math.max(0.65, Math.min(scaleX, scaleY)));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setZoomScale(+fitScale.toFixed(2));
    setPanOffset({
      x: +(250 - centerX).toFixed(1),
      y: +(180 - centerY).toFixed(1),
    });
  };


  // Node visual state
  const getNodeVisualState = (nodeId: number): ElementVisualState => {
    return currentStep?.visualStates?.[nodeId] || 'graph-unvisited';
  };

  // Node styling by visual state
  const getNodeStyles = (state: ElementVisualState, isStart: boolean) => {
    switch (state) {
      case 'graph-current':
        return {
          fill: '#FFFBEB',
          stroke: '#FFC107',
          textColor: '#B45309',
          glow: 'filter drop-shadow(0 2px 8px rgba(255, 193, 7, 0.45))',
        };
      case 'graph-in-queue':
        return {
          fill: '#F0F9FF',
          stroke: '#0284C7',
          textColor: '#0369A1',
          glow: 'filter drop-shadow(0 2px 6px rgba(2, 132, 199, 0.25))',
        };
      case 'graph-in-stack':
      case 'graph-call-stack':
        return {
          fill: '#FFFBEB',
          stroke: '#D97706',
          textColor: '#92400E',
          glow: 'filter drop-shadow(0 2px 6px rgba(217, 119, 6, 0.25))',
        };
      case 'graph-finished':
        return {
          fill: '#ECFDF5',
          stroke: '#059669',
          textColor: '#047857',
          glow: 'filter drop-shadow(0 2px 6px rgba(5, 150, 105, 0.25))',
        };
      case 'graph-visited':
        return {
          fill: '#ECFDF5',
          stroke: '#059669',
          textColor: '#047857',
          glow: 'filter drop-shadow(0 2px 6px rgba(5, 150, 105, 0.15))',
        };
      case 'graph-neighbor':
        return {
          fill: '#FFFBEB',
          stroke: '#FFC107',
          textColor: '#B45309',
          glow: 'filter drop-shadow(0 2px 6px rgba(255, 193, 7, 0.35))',
        };
      case 'graph-path':
        return {
          fill: '#ECFDF5',
          stroke: '#059669',
          textColor: '#059669',
          glow: 'filter drop-shadow(0 2px 6px rgba(5, 150, 105, 0.25))',
        };
      default:
        return {
          fill: isStart ? '#FFFBEB' : '#FFFFFF',
          stroke: isStart ? '#FFC107' : '#3F3F3F',
          textColor: isStart ? '#B45309' : '#18181B',
          glow: isStart ? 'filter drop-shadow(0 2px 6px rgba(255, 193, 7, 0.3))' : '',
        };
    }
  };

  // Traversed edges set
  const traversedEdges = new Set(
    (currentStep?.traversedEdges || []).map((e) => `${e[0]}-${e[1]}`)
  );
  const treeEdgesSet = new Set(
    (currentStep?.treeEdges || []).map((e) => `${e[0]}-${e[1]}`)
  );
  const backEdgesSet = new Set(
    (currentStep?.backEdges || []).map((e) => `${e[0]}-${e[1]}`)
  );
  const skippedEdgesSet = new Set(
    (currentStep?.skippedEdges || []).map((e) => `${e[0]}-${e[1]}`)
  );
  const activeEdgeKey = currentStep?.activeEdge
    ? `${currentStep.activeEdge[0]}-${currentStep.activeEdge[1]}`
    : null;

  // Shorten line for node radius
  const calculateEdgeCoords = (fromNode: { x: number; y: number }, toNode: { x: number; y: number }) => {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return { x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y };

    const offsetX = (dx / dist) * NODE_RADIUS;
    const offsetY = (dy / dist) * NODE_RADIUS;

    return {
      x1: fromNode.x + offsetX,
      y1: fromNode.y + offsetY,
      x2: toNode.x - offsetX,
      y2: toNode.y - offsetY,
    };
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Primary Card: Graph Canvas + Traversal State HUD */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-clean-card overflow-hidden flex flex-col">
        {/* Top Header: VISUALIZATION Title & Legend */}
        <div className="px-4 py-2.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2.5 bg-[#FAFAFA]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#FFC107]/15 border border-[#FFC107]/40 flex items-center justify-center">
              <Network className="w-3.5 h-3.5 text-[#B45309]" />
            </div>
            <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
              Visualization
            </span>
          </div>

          {/* Dynamic Legend: Distinct DFS and BFS legends */}
          {!isBFS ? (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              {/* Unvisited */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#3F3F3F] bg-white" />
                <span className="text-[#3F3F3F] font-medium">Unvisited</span>
              </div>

              {/* Current Node */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#FFC107] bg-[#FFFBEB] shadow-[0_0_6px_rgba(255,193,7,0.4)]" />
                <span className="text-[#B45309] font-bold">Current Node</span>
              </div>

              {/* On Call Stack */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#D97706] bg-[#FFFBEB] shadow-[0_0_6px_rgba(217,119,6,0.3)]" />
                <span className="text-[#92400E] font-medium">{dfsMode === 'iterative' ? 'On Stack' : 'On Call Stack'}</span>
              </div>

              {/* Visited / Finished */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#059669] bg-[#ECFDF5] shadow-[0_0_6px_rgba(5,150,105,0.3)]" />
                <span className="text-[#059669] font-medium">Visited (Finished)</span>
              </div>

              {/* Tree Edge */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#3F3F3F] rounded" />
                <span className="text-[#3F3F3F] font-semibold">➔ Tree Edge</span>
              </div>

              {/* Back Edge */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-b-2 border-dashed border-[#DC2626]" />
                <span className="text-[#DC2626] font-medium">--- Back Edge</span>
              </div>

              {/* Skipped Edge */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0 border-b-2 border-dashed border-[#94A3B8]" />
                <span className="text-[#64748B] font-medium">--- Skipped Edge</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
              {/* Unvisited */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#3F3F3F] bg-white" />
                <span className="text-[#3F3F3F] font-medium">Unvisited</span>
              </div>

              {/* Visited */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#059669] bg-[#ECFDF5]" />
                <span className="text-[#059669] font-medium">Visited</span>
              </div>

              {/* Current Node */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#FFC107] bg-[#FFFBEB] shadow-[0_0_6px_rgba(255,193,7,0.4)]" />
                <span className="text-[#B45309] font-bold">Current Node</span>
              </div>

              {/* Queue (BFS) */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#0284C7] bg-[#F0F9FF]" />
                <span className="text-[#0284C7] font-medium">In Queue</span>
              </div>

              {/* Inspecting Neighbor */}
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-[#FFC107] bg-[#FFFBEB] shadow-[0_0_6px_rgba(255,193,7,0.3)]" />
                <span className="text-[#B45309] font-medium">Neighbor</span>
              </div>

              {/* Edge */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#CBD5E1] rounded" />
                <span className="text-[#64748B] font-medium">Edge</span>
              </div>

              {/* Traversed Edge */}
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-[#059669] rounded shadow-[0_0_4px_rgba(5,150,105,0.4)]" />
                <span className="text-[#059669] font-semibold">Traversed Edge</span>
              </div>
            </div>
          )}
        </div>

        {/* 2-Column Split: Graph Canvas on Left, Traversal State HUD on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px] divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
          {/* Left: Interactive SVG Graph Viewport (Span 7) */}
          <div
            className="lg:col-span-7 p-3 sm:p-5 flex items-center justify-center relative bg-[#FAFAFA] select-none overflow-hidden"
            onMouseDown={(e) => {
              setIsDragging(true);
              dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
            }}
            onMouseMove={(e) => {
              if (isDragging) {
                setPanOffset({
                  x: e.clientX - dragStartRef.current.x,
                  y: e.clientY - dragStartRef.current.y,
                });
              }
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <svg
              viewBox="0 0 500 360"
              className="w-full h-full max-h-[380px] object-contain"
              style={{ minHeight: '280px' }}
            >
              <defs>
                {/* Arrowheads for Directed Graph */}
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#3F3F3F" />
                </marker>
                <marker
                  id="arrow-traversed"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669" />
                </marker>
                <marker
                  id="arrow-backtrack"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#DC2626" />
                </marker>
                <marker
                  id="arrow-active"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#FFC107" />
                </marker>
              </defs>

              {/* Transformed Content Group for Smooth Zoom and Pan */}
              <g
                transform={`translate(${250 + panOffset.x}, ${180 + panOffset.y}) scale(${zoomScale}) translate(-250, -180)`}
              >
                {/* BFS Level Bands / Guides matching reference design */}
                {isBFS &&
                  levelBands.map((band) => (
                    <g key={`level-band-${band.level}`}>
                      {/* Dashed level container */}
                      <rect
                        x={18}
                        y={band.top}
                        width={CANVAS_WIDTH - 36}
                        height={band.bottom - band.top}
                        rx={10}
                        fill="#F1F5F9"
                        fillOpacity={0.65}
                        stroke="#CBD5E1"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                      />
                      {/* Level Indicator on Left */}
                      <text
                        x={30}
                        y={band.y - 4}
                        fill="#0284C7"
                        fontSize="10.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                        letterSpacing="0.05em"
                      >
                        {band.label}
                      </text>
                      <text
                        x={30}
                        y={band.y + 9}
                        fill="#475569"
                        fontSize="8.5"
                        fontWeight="500"
                        fontFamily="sans-serif"
                      >
                        {band.sublabel}
                      </text>
                    </g>
                  ))}

                {/* Render Graph Edges */}
                {graphData.edges.map((edge, idx) => {
                  const fromNode = graphData.nodes.find((n) => n.id === edge.from);
                  const toNode = graphData.nodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  const forwardKey = `${edge.from}-${edge.to}`;
                  const reverseKey = `${edge.to}-${edge.from}`;
                  const isTraversed =
                    traversedEdges.has(forwardKey) ||
                    (!graphData.isDirected && traversedEdges.has(reverseKey));
                  const isTree =
                    treeEdgesSet.has(forwardKey) ||
                    (!graphData.isDirected && treeEdgesSet.has(reverseKey));
                  const isBack =
                    backEdgesSet.has(forwardKey) ||
                    (!graphData.isDirected && backEdgesSet.has(reverseKey));
                  const isSkipped =
                    skippedEdgesSet.has(forwardKey) ||
                    (!graphData.isDirected && skippedEdgesSet.has(reverseKey));

                  const isActive =
                    activeEdgeKey === forwardKey ||
                    (!graphData.isDirected && activeEdgeKey === reverseKey);
                  const isBacktrack = currentStep?.graphPhase === 'backtrack' && isActive;

                  const coords = calculateEdgeCoords(fromNode, toNode);

                  let strokeColor = '#94A3B8';
                  let strokeWidth = 2;
                  let strokeDasharray: string | undefined = undefined;
                  let markerEnd = graphData.isDirected ? 'url(#arrow-default)' : undefined;

                  if (isBacktrack) {
                    strokeColor = '#E11D48';
                    strokeWidth = 2.75;
                    markerEnd = graphData.isDirected ? 'url(#arrow-backtrack)' : undefined;
                  } else if (isActive) {
                    strokeColor = '#D97706';
                    strokeWidth = 2.75;
                    markerEnd = graphData.isDirected ? 'url(#arrow-active)' : undefined;
                  } else if (!isBFS && isTree) {
                    strokeColor = '#2563EB';
                    strokeWidth = 2.5;
                    markerEnd = graphData.isDirected ? 'url(#arrow-active)' : undefined;
                  } else if (!isBFS && isBack) {
                    strokeColor = '#DC2626';
                    strokeWidth = 2;
                    strokeDasharray = '5 3';
                    markerEnd = graphData.isDirected ? 'url(#arrow-backtrack)' : undefined;
                  } else if (!isBFS && isSkipped) {
                    strokeColor = '#94A3B8';
                    strokeWidth = 1.5;
                    strokeDasharray = '3 3';
                  } else if (isTraversed) {
                    strokeColor = '#059669';
                    strokeWidth = 2.75;
                    markerEnd = graphData.isDirected ? 'url(#arrow-traversed)' : undefined;
                  }

                  return (
                    <g key={`edge-${idx}`}>
                      {(isTraversed || isActive || (!isBFS && isTree)) && (
                        <line
                          x1={coords.x1}
                          y1={coords.y1}
                          x2={coords.x2}
                          y2={coords.y2}
                          stroke={isBacktrack ? 'rgba(225, 29, 72, 0.2)' : isActive ? 'rgba(217, 119, 6, 0.25)' : !isBFS && isTree ? 'rgba(37, 99, 235, 0.2)' : 'rgba(5, 150, 105, 0.2)'}
                          strokeWidth={6}
                          strokeLinecap="round"
                        />
                      )}
                      <line
                        x1={coords.x1}
                        y1={coords.y1}
                        x2={coords.x2}
                        y2={coords.y2}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        markerEnd={markerEnd}
                        strokeLinecap="round"
                        className="transition-colors duration-300"
                      />
                    </g>
                  );
                })}

                {/* Render Graph Nodes */}
                {graphData.nodes.map((node) => {
                  const visualState = getNodeVisualState(node.id);
                  const isStart = node.id === startNode;
                  const isCurrent = currentStep?.currentNode === node.id;
                  const isNeighbor =
                    currentStep?.currentNeighbor === node.id &&
                    (currentStep?.graphPhase === 'inspect-neighbor' || currentStep?.graphPhase === 'skip-neighbor');
                  const style = getNodeStyles(visualState, isStart);

                  return (
                    <g key={`node-${node.id}`} className="cursor-default">
                      {/* Active pulse aura for Current Node */}
                      {isCurrent && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={NODE_RADIUS + 7}
                          fill="none"
                          stroke="#B45309"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                        />
                      )}

                      {/* Focused pulse aura for Inspected Neighbor */}
                      {isNeighbor && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={NODE_RADIUS + 5}
                          fill="none"
                          stroke="#0284C7"
                          strokeWidth="1.5"
                          strokeDasharray="3 2"
                          className="animate-pulse"
                        />
                      )}

                      {/* Node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={NODE_RADIUS}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={isCurrent ? '3' : '2'}
                        className={`transition-colors duration-300 ${style.glow}`}
                      />

                      {/* Node ID label */}
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fill={style.textColor}
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="monospace"
                        pointerEvents="none"
                      >
                        {node.label}
                      </text>

                      {/* START badge positioned safely above start node */}
                      {isStart && (
                        <g transform={`translate(${node.x - 14}, ${node.y - NODE_RADIUS - 13})`}>
                          <rect
                            width="28"
                            height="13"
                            rx="4"
                            fill="#FFFBEB"
                            stroke="#FFC107"
                            strokeWidth="1"
                          />
                          <text
                            x="14"
                            y="9.5"
                            textAnchor="middle"
                            fill="#B45309"
                            fontSize="8.5"
                            fontWeight="bold"
                            fontFamily="sans-serif"
                          >
                            START
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom-Left Zoom, Pan, Fit, and Reset View Controls */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white border border-[#CBD5E1] p-1 rounded-xl shadow-sm z-10">
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In"
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#18181B] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out"
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#18181B] transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleFitView}
                title="Fit to View"
                className="w-6 h-6 rounded-lg flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-[#18181B] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium text-[#475569] hover:text-[#18181B] bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Right: TRAVERSAL STATE HUD (Span 5) */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between gap-4 bg-white">
            {/* HUD Top Bar: Title & Step Counter */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono">
                Traversal State
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F1F5F9] border border-[#CBD5E1] text-[#3F3F3F] text-xs font-mono font-bold">
                <span>Step {currentStepIndex + 1}</span>
                <span className="text-[#94A3B8]">/</span>
                <span>{totalSteps}</span>
              </div>
            </div>

            {/* DFS vs BFS Traversal HUD */}
            {!isBFS ? (
              <>
                {/* Current Operation Section */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isComplete
                          ? 'bg-[#059669]'
                          : currentStep?.graphPhase === 'backtrack'
                          ? 'bg-[#E11D48] animate-pulse'
                          : 'bg-[#FFC107] animate-pulse'
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide font-mono">
                      Current Operation
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-[#18181B]">
                    {isComplete
                      ? 'DFS Complete'
                      : currentStep?.graphPhase === 'initialize'
                      ? 'Initialize'
                      : currentStep?.graphPhase === 'visit'
                      ? (currentStep.action || 'Visit Node')
                      : currentStep?.graphPhase === 'inspect-neighbor'
                      ? 'Inspect Neighbor'
                      : currentStep?.graphPhase === 'traverse-edge'
                      ? 'Traverse Tree Edge'
                      : currentStep?.graphPhase === 'backtrack'
                      ? 'Backtrack to Parent'
                      : 'Step Execution'}
                  </div>

                  <p className="text-xs text-[#475569] leading-relaxed font-normal">
                    {currentStep?.explanation || 'Depth First Search exploring graph branch step by step.'}
                  </p>
                </div>

                {/* 4 Mini Metrics Row matching reference */}
                <div className="grid grid-cols-4 gap-2">
                  {/* CURRENT */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Current
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#D97706] mt-0.5">
                      {currentStep?.currentNode !== null && currentStep?.currentNode !== undefined
                        ? currentStep.currentNode
                        : '—'}
                    </span>
                  </div>

                  {/* CALL STACK / STACK */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      {dfsMode === 'iterative' ? 'Stack' : 'Call Stack'}
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#3F3F3F] truncate max-w-full mt-0.5">
                      {(currentStep?.callStack ?? currentStep?.stackState ?? []).length > 0
                        ? `[${(currentStep?.callStack ?? currentStep?.stackState ?? []).join(', ')}]`
                        : '[]'}
                    </span>
                  </div>

                  {/* VISITED ORDER */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Visited Order
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#059669] truncate max-w-full mt-0.5">
                      {(currentStep?.traversalOrder ?? currentStep?.visitedNodes ?? []).length > 0
                        ? `[${(currentStep?.traversalOrder ?? currentStep?.visitedNodes ?? []).join(', ')}]`
                        : '[]'}
                    </span>
                  </div>

                  {/* NEXT NEIGHBOR */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Next Neighbor
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#0284C7] mt-0.5">
                      {currentStep?.nextNeighbor !== null && currentStep?.nextNeighbor !== undefined
                        ? currentStep.nextNeighbor
                        : (currentStep?.currentNeighbor !== null && currentStep?.currentNeighbor !== undefined ? currentStep.currentNeighbor : '—')}
                    </span>
                  </div>
                </div>

                {/* Call Stack Visual Box matching reference callout 6 */}
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#3F3F3F] uppercase tracking-wider font-mono">
                      {dfsMode === 'iterative' ? 'Stack (Iterative LIFO)' : 'Call Stack (Recursive)'}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Depth: {(currentStep?.callStack ?? currentStep?.stackState ?? []).length}
                    </span>
                  </div>

                  {/* Visual Frames */}
                  <div className="flex items-center justify-center gap-2 py-1 overflow-x-auto min-h-[44px]">
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">
                      Top
                    </span>
                    {(currentStep?.callStack ?? currentStep?.stackState ?? []).length > 0 ? (
                      [...(currentStep?.callStack ?? currentStep?.stackState ?? [])].reverse().map((nodeId, idx) => {
                        const isTopFrame = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center justify-center transition-colors ${
                              isTopFrame
                                ? 'bg-[#3F3F3F] text-white shadow-xs ring-2 ring-[#FFC107] scale-105'
                                : 'bg-white border border-[#CBD5E1] text-[#18181B]'
                            }`}
                          >
                            {nodeId}
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-xs font-mono text-[#64748B] italic">
                        [ Empty ]
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold text-[#64748B]">
                      Bottom
                    </span>
                  </div>
                </div>

                {/* Dual Sub-panel: Action & Traversal Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Action */}
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-2.5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                      Action
                    </span>
                    <p className="text-xs text-[#334155] truncate">
                      {currentStep?.action || 'Explore branch'}
                    </p>
                  </div>

                  {/* Traversal Order (Processed) */}
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-2.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                        Traversal Order
                      </span>
                      <span className="text-[9px] text-[#64748B] font-mono">Visited</span>
                    </div>
                    <div className="text-xs font-mono text-[#059669] font-bold flex items-center flex-wrap gap-1 mt-0.5">
                      {currentStep?.traversalOrder && currentStep.traversalOrder.length > 0 ? (
                        currentStep.traversalOrder.map((nodeId, idx) => (
                          <React.Fragment key={idx}>
                            <span className={nodeId === currentStep.currentNode ? 'text-[#D97706] underline font-extrabold' : ''}>
                              {nodeId}
                            </span>
                            {idx < (currentStep.traversalOrder?.length ?? 0) - 1 && (
                              <span className="text-slate-400 font-normal">→</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span className="text-slate-400 font-normal">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* DFS Key Concept Callout matching reference */}
                <div className="bg-[#FFFBEB] border border-[#FFC107]/60 rounded-xl p-2.5 flex items-start gap-2 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider font-mono">
                      Key Concept
                    </span>
                    <p className="text-[11px] text-[#334155] leading-relaxed font-sans">
                      {currentStep?.keyConcept ||
                        'DFS explores one branch as deeply as possible before backtracking. It does NOT guarantee the shortest path in an unweighted graph.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* BFS Traversal HUD */
              <>
                {/* Current Operation Section */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isComplete
                          ? 'bg-[#059669]'
                          : currentStep?.graphPhase === 'skip-neighbor'
                          ? 'bg-[#E11D48]'
                          : 'bg-[#D97706] animate-pulse'
                      }`}
                    />
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide font-mono">
                      Current Operation
                    </span>
                  </div>

                  <div className="text-base sm:text-lg font-bold text-[#18181B]">
                    {isComplete
                      ? 'Traversal Complete'
                      : currentStep?.graphPhase === 'initialize'
                      ? 'Initialize'
                      : currentStep?.graphPhase === 'dequeue'
                      ? 'Process Node'
                      : currentStep?.graphPhase === 'inspect-neighbor'
                      ? 'Inspect Neighbor'
                      : currentStep?.graphPhase === 'enqueue-neighbor'
                      ? 'Visit Neighbor'
                      : currentStep?.graphPhase === 'skip-neighbor'
                      ? 'Skip Neighbor'
                      : 'Step Execution'}
                  </div>

                  <p className="text-xs text-[#334155] leading-relaxed font-normal">
                    {currentStep?.explanation || 'Traversing graph step by step.'}
                  </p>
                </div>

                {/* 4 Mini Metrics Row */}
                <div className="grid grid-cols-4 gap-2">
                  {/* CURRENT */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Current
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#D97706] mt-0.5">
                      {currentStep?.currentNode !== null && currentStep?.currentNode !== undefined
                        ? currentStep.currentNode
                        : '—'}
                    </span>
                  </div>

                  {/* QUEUE */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Queue
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#0284C7] truncate max-w-full mt-0.5">
                      {currentStep?.queueState && currentStep.queueState.length > 0
                        ? `[${currentStep.queueState.join(', ')}]`
                        : '[]'}
                    </span>
                  </div>

                  {/* VISITED */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Visited
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-mono text-[#059669] truncate max-w-full mt-0.5">
                      {currentStep?.visitedNodes && currentStep.visitedNodes.length > 0
                        ? `[${currentStep.visitedNodes.join(', ')}]`
                        : '[]'}
                    </span>
                  </div>

                  {/* NEIGHBOR */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <span className="text-[10px] text-[#475569] uppercase font-mono text-center truncate w-full">
                      Neighbor
                    </span>
                    <span className="text-sm sm:text-base font-bold font-mono text-[#0284C7] mt-0.5">
                      {currentStep?.currentNeighbor !== null && currentStep?.currentNeighbor !== undefined
                        ? currentStep.currentNeighbor
                        : '—'}
                    </span>
                  </div>
                </div>

                {/* Action Row */}
                <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-2.5 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                    Action
                  </span>
                  <p className="text-xs text-[#334155]">
                    {currentStep?.graphPhase === 'initialize'
                      ? 'Initialize queue and mark start node.'
                      : currentStep?.graphPhase === 'dequeue'
                      ? `Dequeued node ${currentStep.currentNode} to process and inspect its neighbors.`
                      : currentStep?.graphPhase === 'inspect-neighbor'
                      ? `Inspecting neighbor node ${currentStep.currentNeighbor}.`
                      : currentStep?.graphPhase === 'skip-neighbor'
                      ? `Neighbor ${currentStep.currentNeighbor} already visited. Skipping to prevent cycles.`
                      : currentStep?.graphPhase === 'enqueue-neighbor'
                      ? `Marked neighbor ${currentStep.currentNeighbor} as visited and enqueued it.`
                      : isComplete
                      ? 'All reachable nodes fully processed.'
                      : 'Step execution.'}
                  </p>
                </div>

                {/* Dual Sub-panel: Queue Operation & Live Traversal Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Queue Operation */}
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-2.5 flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                      Queue Operation
                    </span>
                    <div className="text-xs font-mono text-[#334155] flex flex-col gap-0.5">
                      <div>
                        <span className="text-[#64748B]">Dequeued:</span>{' '}
                        <span className="text-[#D97706] font-bold">
                          {currentStep?.queueOp?.type === 'dequeue' && currentStep.queueOp.node !== undefined
                            ? currentStep.queueOp.node
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#64748B]">Enqueued:</span>{' '}
                        <span className="text-[#0284C7] font-bold">
                          {currentStep?.queueOp?.type === 'enqueue' && currentStep.queueOp.node !== undefined
                            ? currentStep.queueOp.node
                            : '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Traversal Order (Processed) */}
                  <div className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-2.5 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#475569] uppercase tracking-wider font-mono">
                        Traversal Order
                      </span>
                      <span className="text-[9px] text-[#64748B] font-mono">Processed</span>
                    </div>
                    <div className="text-xs font-mono text-[#059669] font-bold flex items-center flex-wrap gap-1 mt-0.5">
                      {currentStep?.traversalOrder && currentStep.traversalOrder.length > 0 ? (
                        currentStep.traversalOrder.map((nodeId, idx) => (
                          <React.Fragment key={idx}>
                            <span className={nodeId === currentStep.currentNode ? 'text-[#D97706] underline' : ''}>
                              {nodeId}
                            </span>
                            {idx < (currentStep.traversalOrder?.length ?? 0) - 1 && (
                              <span className="text-slate-400 font-normal">→</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <span className="text-slate-400 font-normal">—</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dynamic Key Concept Callout for BFS */}
                <div className="bg-[#FFFBEB] border border-[#FFC107]/60 rounded-xl p-2.5 flex items-start gap-2 text-xs">
                  <Lightbulb className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider font-mono">
                      Key Concept
                    </span>
                    <p className="text-[11px] text-[#334155] leading-relaxed font-sans">
                      {currentStep?.keyConcept ||
                        (targetNode !== null && targetNode !== undefined
                          ? `BFS guarantees the shortest path (minimum edge count) in unweighted graphs to target Node ${targetNode}. Tracking parent pointers to target ${targetNode} enables backward path reconstruction.`
                          : 'BFS guarantees the shortest path (minimum edge count) in unweighted graphs. Tracking parent pointers to target nodes enables backward path reconstruction.')}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Integrated Playback Controls Bar */}
        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Step Stepping Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goToFirst}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] hover:text-[#18181B] border border-[#CBD5E1] transition-colors cursor-pointer shadow-xs"
              title="First step"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] hover:text-[#18181B] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-[#3F3F3F] hover:bg-[#2A2A2A] text-white shadow-xs'
                  : 'bg-[#FFC107] hover:bg-[#F59E0B] text-[#18181B] font-bold shadow-xs'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-[#18181B]" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={currentStepIndex >= totalSteps - 1}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] hover:text-[#18181B] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Next step"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={goToLast}
              disabled={currentStepIndex >= totalSteps - 1}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-[#334155] hover:text-[#18181B] border border-[#CBD5E1] transition-colors cursor-pointer shadow-xs"
              title="Last step"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Middle: Step Progress Slider & Counter */}
          <div className="flex-1 max-w-xs sm:max-w-sm flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-[#475569] shrink-0">
              Step {currentStepIndex + 1} / {totalSteps}
            </span>
            <input
              type="range"
              min={0}
              max={Math.max(0, totalSteps - 1)}
              value={currentStepIndex}
              onChange={(e) => seekToStep(Number(e.target.value))}
              className="w-full accent-[#FFC107] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Right: Speed Toggles & Reset */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-[#CBD5E1] p-0.5 rounded-lg shadow-xs">
              <span className="text-[10px] text-[#475569] font-mono px-1">Speed</span>
              {[0.5, 1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-[#3F3F3F] text-white font-bold'
                      : 'text-[#334155] hover:text-[#18181B]'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={reset}
              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#334155] hover:text-[#18181B] border border-[#CBD5E1] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="Reset traversal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: EXAMPLE GRAPHS (All nodes properly visible with good layout) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-clean-card flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-[#FFC107]" />
            Example Graphs
            <span className="text-[11px] text-[#475569] font-normal font-sans ml-1">
              (All nodes properly visible with bounded layout)
            </span>
          </span>
          <span className="text-[10px] text-[#64748B] font-mono">
            Click to load preset
          </span>
        </div>

        {/* 6 Preset Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {GRAPH_PRESETS.map((preset, idx) => {
            const isActive = activeGraphPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectGraphPreset(preset.id)}
                className={`p-2 rounded-xl border text-left transition-colors cursor-pointer flex flex-col items-center justify-between gap-1.5 min-h-[90px] shadow-xs ${
                  isActive
                    ? 'bg-[#FFFBEB] border-[#FFC107] ring-1 ring-[#FFC107]/50'
                    : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[11px] font-bold font-mono truncate ${
                      isActive ? 'text-[#B45309]' : 'text-[#334155]'
                    }`}
                  >
                    {idx + 1}. {preset.name}
                  </span>
                  <span className="text-[9.5px] font-mono text-[#64748B]">
                    {preset.graph.nodes.length}n
                  </span>
                </div>

                {/* Miniature Graph Preview SVG */}
                <div className="w-full h-12 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 500 360" className="w-full h-full max-h-12 object-contain">
                    {preset.graph.edges.map((e, eIdx) => {
                      const f = preset.graph.nodes.find((n) => n.id === e.from);
                      const t = preset.graph.nodes.find((n) => n.id === e.to);
                      if (!f || !t) return null;
                      return (
                        <line
                          key={eIdx}
                          x1={f.x}
                          y1={f.y}
                          x2={t.x}
                          y2={t.y}
                          stroke="#CBD5E1"
                          strokeWidth="7"
                          strokeLinecap="round"
                        />
                      );
                    })}
                    {preset.graph.nodes.map((n) => (
                      <circle
                        key={n.id}
                        cx={n.x}
                        cy={n.y}
                        r="25"
                        fill={n.id === preset.defaultStartNode ? '#FFFBEB' : '#FFFFFF'}
                        stroke={n.id === preset.defaultStartNode ? '#FFC107' : '#94A3B8'}
                        strokeWidth="7"
                      />
                    ))}
                  </svg>
                </div>

                <div className="flex items-center justify-between w-full">
                  <span className="text-[9px] text-[#64748B] truncate">
                    {preset.graph.isDirected ? 'Directed' : 'Undirected'}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFC107] animate-pulse" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
