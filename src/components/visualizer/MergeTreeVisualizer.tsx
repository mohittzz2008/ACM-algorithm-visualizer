import React, { useMemo } from 'react';
import type { MergeTreeNode } from '../../algorithms/types';
import { useVisualizerStore } from '../../store/useVisualizerStore';

interface MergeTreeVisualizerProps {
  nodes?: MergeTreeNode[];
  arrayLength: number;
}

interface PositionedNode extends MergeTreeNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const MergeTreeVisualizer: React.FC<MergeTreeVisualizerProps> = ({
  nodes = [],
  arrayLength,
}) => {
  const theme = useVisualizerStore((state) => state.theme);
  const isDark = theme === 'dark';

  // Calculate layout coordinates for SVG unconditionally
  const { positionedNodes, connectors, svgWidth, svgHeight } = useMemo(() => {
    if (!nodes || nodes.length === 0 || arrayLength === 0) {
      return {
        positionedNodes: [],
        connectors: [],
        svgWidth: 760,
        svgHeight: 180,
      };
    }

    // 1. Group nodes by level
    let highestLevel = 0;
    nodes.forEach((node) => {
      highestLevel = Math.max(highestLevel, node.level);
    });

    // 2. Geometry calculations
    // Base width on arrayLength so nodes have ample breathing room
    const baseWidth = Math.max(760, arrayLength * 70);
    const nodeHeight = 32;
    const verticalGap = 42;
    const topPadding = 24;
    const totalHeight = topPadding + (highestLevel + 1) * (nodeHeight + verticalGap);

    const leafWidth = baseWidth / Math.max(1, arrayLength);

    // Map each node id to positioned data
    const posMap = new Map<string, PositionedNode>();

    // Calculate node coordinates:
    // A node spanning [left, right] has its center at average of leaf positions [left...right]
    nodes.forEach((node) => {
      const leftX = (node.left + 0.5) * leafWidth;
      const rightX = (node.right + 0.5) * leafWidth;
      const centerX = (leftX + rightX) / 2;
      const centerY = topPadding + node.level * (nodeHeight + verticalGap);

      // Width of node depends on number of elements
      const count = node.right - node.left + 1;
      const chipWidth = count <= 2 ? 26 : count <= 4 ? 24 : count <= 8 ? 22 : 18;
      const calcWidth = Math.max(38, count * chipWidth + 16);

      posMap.set(node.id, {
        ...node,
        x: centerX,
        y: centerY,
        width: calcWidth,
        height: nodeHeight,
      });
    });

    const positioned = Array.from(posMap.values());

    // 3. Generate parent-to-child connector paths
    const lines: Array<{
      id: string;
      d: string;
      isActive: boolean;
      status: string;
    }> = [];

    positioned.forEach((child) => {
      if (child.parentId) {
        const parent = posMap.get(child.parentId);
        if (parent) {
          const x1 = parent.x;
          const y1 = parent.y + parent.height / 2;
          const x2 = child.x;
          const y2 = child.y - child.height / 2;
          const midY = (y1 + y2) / 2;

          // Stepped cubic curve
          const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
          const isActive =
            child.status === 'active' ||
            child.status === 'dividing' ||
            child.status === 'merging';

          lines.push({
            id: `${parent.id}->${child.id}`,
            d,
            isActive,
            status: child.status,
          });
        }
      }
    });

    return {
      positionedNodes: positioned,
      connectors: lines,
      svgWidth: baseWidth,
      svgHeight: totalHeight,
    };
  }, [nodes, arrayLength]);

  if (positionedNodes.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-slate-500 text-xs font-mono">
        Tree structure generating...
      </div>
    );
  }

  // Node style theme according to status
  const getNodeStyles = (status: MergeTreeNode['status']) => {
    if (!isDark) {
      switch (status) {
        case 'merging':
          return {
            fill: '#FFFBEB',
            stroke: '#B45309',
            strokeWidth: 2,
            textColor: '#78350F',
            chipBg: '#FEF3C7',
            chipBorder: '#FDE68A',
            glow: 'filter drop-shadow(0 1px 3px rgba(180, 83, 9, 0.2))',
          };
        case 'merged':
          return {
            fill: '#ECFDF5',
            stroke: '#047857',
            strokeWidth: 1.5,
            textColor: '#064E3B',
            chipBg: '#D1FAE5',
            chipBorder: '#A7F3D0',
            glow: 'filter drop-shadow(0 1px 3px rgba(4, 120, 87, 0.2))',
          };
        case 'dividing':
          return {
            fill: '#F3E8FF',
            stroke: '#7C3AED',
            strokeWidth: 2,
            textColor: '#6D28D9',
            chipBg: '#E9D5FF',
            chipBorder: '#C084FC',
            glow: 'filter drop-shadow(0 1px 3px rgba(109, 40, 217, 0.2))',
          };
        case 'active':
          return {
            fill: '#EFF6FF',
            stroke: '#2563EB',
            strokeWidth: 2,
            textColor: '#1D4ED8',
            chipBg: '#DBEAFE',
            chipBorder: '#BFDBFE',
            glow: 'filter drop-shadow(0 1px 3px rgba(37, 99, 235, 0.2))',
          };
        case 'base-case':
          return {
            fill: '#F0F9FF',
            stroke: '#0369A1',
            strokeWidth: 2,
            textColor: '#075985',
            chipBg: '#E0F2FE',
            chipBorder: '#BAE6FD',
            glow: 'filter drop-shadow(0 1px 3px rgba(3, 105, 161, 0.2))',
          };
        case 'inactive':
        default:
          return {
            fill: '#FFFFFF',
            stroke: '#CBD5E1',
            strokeWidth: 1,
            textColor: '#475569',
            chipBg: '#F1F5F9',
            chipBorder: '#CBD5E1',
            glow: '',
          };
      }
    }

    switch (status) {
      case 'merging':
        return {
          fill: '#24180A',
          stroke: '#F59E0B',
          strokeWidth: 2,
          textColor: '#FDE68A',
          chipBg: '#3B240B',
          chipBorder: '#B45309',
          glow: 'filter drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))',
        };
      case 'merged':
        return {
          fill: '#081E19',
          stroke: '#10B981',
          strokeWidth: 1.5,
          textColor: '#A7F3D0',
          chipBg: '#0E362D',
          chipBorder: '#059669',
          glow: 'filter drop-shadow(0 0 4px rgba(16, 185, 129, 0.3))',
        };
      case 'dividing':
        return {
          fill: '#1D1130',
          stroke: '#A855F7',
          strokeWidth: 2,
          textColor: '#F3E8FF',
          chipBg: '#341757',
          chipBorder: '#9333EA',
          glow: 'filter drop-shadow(0 0 6px rgba(168, 85, 247, 0.45))',
        };
      case 'active':
        return {
          fill: '#0E1D3B',
          stroke: '#3B82F6',
          strokeWidth: 2,
          textColor: '#BFDBFE',
          chipBg: '#172C5B',
          chipBorder: '#2563EB',
          glow: 'filter drop-shadow(0 0 5px rgba(59, 130, 246, 0.4))',
        };
      case 'base-case':
        return {
          fill: '#0B2328',
          stroke: '#06B6D4',
          strokeWidth: 2,
          textColor: '#CFFAFE',
          chipBg: '#133E46',
          chipBorder: '#0891B2',
          glow: 'filter drop-shadow(0 0 5px rgba(6, 182, 212, 0.4))',
        };
      case 'inactive':
      default:
        return {
          fill: '#0F162A',
          stroke: '#223252',
          strokeWidth: 1,
          textColor: '#94A3B8',
          chipBg: '#17223D',
          chipBorder: '#2A3C63',
          glow: '',
        };
    }
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#CBD5E1] py-1">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full min-w-[640px] h-auto select-none"
        style={{ maxHeight: '270px' }}
      >
        <defs>
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Connecting Lines between Parent and Children */}
        <g className="connectors">
          {connectors.map((c) => {
            const strokeColor = isDark
              ? (c.status === 'merging'
                  ? '#F59E0B'
                  : c.status === 'merged'
                  ? '#10B981'
                  : c.status === 'dividing'
                  ? '#A855F7'
                  : c.status === 'active'
                  ? '#3B82F6'
                  : '#1E2C48')
              : (c.status === 'merging'
                  ? '#B45309'
                  : c.status === 'merged'
                  ? '#047857'
                  : c.status === 'dividing'
                  ? '#7C3AED'
                  : c.status === 'active'
                  ? '#2563EB'
                  : '#CBD5E1');

            return (
              <path
                key={c.id}
                d={c.d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={c.isActive ? 2 : 1.25}
                strokeDasharray={c.status === 'inactive' ? '3 3' : 'none'}
                className="transition-[stroke,opacity] duration-200"
              />
            );
          })}
        </g>

        {/* 2. Nodes with Array Values */}
        <g className="nodes">
          {positionedNodes.map((node) => {
            const styles = getNodeStyles(node.status);
            const count = node.values.length;
            const itemWidth = Math.max(16, (node.width - 12) / Math.max(1, count));
            const startX = node.x - node.width / 2;
            const startY = node.y - node.height / 2;

            return (
              <g key={node.id} className="transition-[opacity] duration-200 cursor-default">
                {/* Node Outer Background */}
                <rect
                  x={startX}
                  y={startY}
                  width={node.width}
                  height={node.height}
                  rx={8}
                  fill={styles.fill}
                  stroke={styles.stroke}
                  strokeWidth={styles.strokeWidth}
                  className={styles.glow}
                />

                {/* Subarray Values Chips */}
                {node.values.map((val, valIdx) => {
                  const chipX = startX + 6 + valIdx * itemWidth;
                  const chipY = startY + 4;
                  const chipW = itemWidth - 3;
                  const chipH = node.height - 8;

                  return (
                    <g key={valIdx}>
                      <rect
                        x={chipX}
                        y={chipY}
                        width={Math.max(14, chipW)}
                        height={chipH}
                        rx={4}
                        fill={styles.chipBg}
                        stroke={styles.chipBorder}
                        strokeWidth={0.75}
                      />
                      <text
                        x={chipX + Math.max(14, chipW) / 2}
                        y={chipY + chipH / 2 + 3.5}
                        textAnchor="middle"
                        fill={styles.textColor}
                        fontSize={count > 6 ? 9 : 11}
                        fontWeight="600"
                        fontFamily="monospace"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Level and Range Label next to or below node */}
                <text
                  x={node.x}
                  y={node.y + node.height / 2 + 11}
                  textAnchor="middle"
                  fill="#64748B"
                  fontSize="8.5"
                  fontWeight="500"
                  fontFamily="monospace"
                >
                  {node.left === node.right
                    ? `(${node.left},${node.right})`
                    : `L${node.level} (${node.left}-${node.right})`}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
