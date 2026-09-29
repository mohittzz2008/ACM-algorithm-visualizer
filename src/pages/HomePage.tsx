import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Pause,
  BookOpen,
  Zap,
  GraduationCap,
  X,
  Sparkles,
  Search,
  GitBranch,
  BarChart3,
  Database,
  HelpCircle,
  Box,
  Mouse,
  ChevronDown,
} from 'lucide-react';
import { useVisualizerStore } from '../store/useVisualizerStore';
import { ACMLogo } from '../components/branding/AlgoVistaLogo';
import studentStudyingImg from '../assets/student-studying-desk.jpg';
import studentDiscoversImg from '../assets/student-discovers-acm.jpg';
import heroBgLandscapeImg from '../assets/hero-bg-landscape.jpg';
import { GeometricCanvasBackground } from '../components/layout/GeometricCanvasBackground';
import './HomePage.css';

// ─────────────────────────────────────────────────────────────
// Mini Visualization Components for 3D Category Cards
// ─────────────────────────────────────────────────────────────

const SortingViz: React.FC = () => {
  const heights = [18, 32, 14, 40, 26, 46];
  const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#1D4ED8', '#2563EB', '#3B82F6'];

  return (
    <div className="mini-sort-bars">
      {heights.map((h, i) => (
        <div
          key={i}
          className="mini-sort-bar"
          style={{ height: `${h}px`, background: colors[i] }}
        />
      ))}
    </div>
  );
};

const SearchingViz: React.FC = () => (
  <svg viewBox="0 0 80 40" width="80" height="40">
    {[0, 1, 2, 3, 4].map((i) => (
      <rect
        key={i}
        x={i * 15 + 2}
        y={12}
        width={13}
        height={16}
        rx={2}
        fill={i === 2 ? '#D97706' : '#E2E8F0'}
        stroke={i === 2 ? '#D97706' : '#94A3B8'}
        strokeWidth={0.8}
      />
    ))}
    <circle cx={66} cy={18} r={7} fill="none" stroke="#2563EB" strokeWidth={1.5} />
    <line x1={71} y1={23} x2={76} y2={28} stroke="#2563EB" strokeWidth={1.5} strokeLinecap="round" />
  </svg>
);

const GraphViz: React.FC = () => {
  const nodeColor = '#2563EB';
  const edgeColor = '#94A3B8';
  const activeColor = '#D97706';

  return (
    <svg viewBox="0 0 80 44" width="80" height="44">
      <line x1={20} y1={14} x2={42} y2={8} stroke={activeColor} strokeWidth={1.5} />
      <line x1={20} y1={14} x2={38} y2={32} stroke={edgeColor} strokeWidth={1} />
      <line x1={42} y1={8} x2={62} y2={20} stroke={edgeColor} strokeWidth={1} />
      <line x1={38} y1={32} x2={62} y2={20} stroke={edgeColor} strokeWidth={1} />
      <circle cx={20} cy={14} r={5} fill={activeColor} />
      <circle cx={42} cy={8} r={5} fill={nodeColor} />
      <circle cx={62} cy={20} r={5} fill={nodeColor} opacity={0.6} />
      <circle cx={38} cy={32} r={5} fill={nodeColor} opacity={0.4} />
    </svg>
  );
};

const DataStructViz: React.FC = () => {
  const fill = '#E2E8F0';
  const stroke = '#2563EB';
  const accent = '#D97706';

  return (
    <svg viewBox="0 0 80 44" width="80" height="44">
      <rect x={8} y={4} width={28} height={8} rx={2} fill={accent} stroke={accent} strokeWidth={0.5} />
      <rect x={8} y={14} width={28} height={8} rx={2} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <rect x={8} y={24} width={28} height={8} rx={2} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <rect x={8} y={34} width={28} height={8} rx={2} fill={fill} stroke={stroke} strokeWidth={0.5} />
      <line x1={58} y1={8} x2={48} y2={22} stroke={stroke} strokeWidth={1} />
      <line x1={58} y1={8} x2={68} y2={22} stroke={stroke} strokeWidth={1} />
      <line x1={48} y1={22} x2={42} y2={36} stroke={stroke} strokeWidth={1} />
      <line x1={48} y1={22} x2={54} y2={36} stroke={stroke} strokeWidth={1} />
      <circle cx={58} cy={8} r={4} fill={accent} />
      <circle cx={48} cy={22} r={3.5} fill={fill} stroke={stroke} strokeWidth={0.8} />
      <circle cx={68} cy={22} r={3.5} fill={fill} stroke={stroke} strokeWidth={0.8} />
      <circle cx={42} cy={36} r={3} fill={fill} stroke={stroke} strokeWidth={0.8} />
      <circle cx={54} cy={36} r={3} fill={fill} stroke={stroke} strokeWidth={0.8} />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────
// Category Data Definitions
// ─────────────────────────────────────────────────────────────

interface CategoryInfo {
  name: string;
  subtitle: string;
  color: string;
  VizComponent: React.FC;
  offset: number;
  icon: React.ReactNode;
}

const CATEGORIES: CategoryInfo[] = [
  { name: 'Sorting', subtitle: 'Bubble Sort · Merge Sort · Quick Sort', color: '#2563EB', VizComponent: SortingViz, offset: 0, icon: <BarChart3 className="w-3.5 h-3.5 text-blue-600" /> },
  { name: 'Searching', subtitle: 'Binary Search · Linear Search', color: '#D97706', VizComponent: SearchingViz, offset: 90, icon: <Search className="w-3.5 h-3.5 text-amber-600" /> },
  { name: 'Graph Traversal', subtitle: 'BFS · DFS · Dijkstra · More', color: '#059669', VizComponent: GraphViz, offset: 180, icon: <GitBranch className="w-3.5 h-3.5 text-emerald-600" /> },
  { name: 'Data Structures', subtitle: 'Arrays · Linked Lists · Trees · Graphs', color: '#7C3AED', VizComponent: DataStructViz, offset: 270, icon: <Database className="w-3.5 h-3.5 text-purple-600" /> },
];

// ─────────────────────────────────────────────────────────────
// Sized 3D Orbital System Component (Confined to Right Column)
// ─────────────────────────────────────────────────────────────

interface OrbitalSystemProps {
  visible: boolean;
  speedMultiplier?: number;
  compact?: boolean;
  onCardClick?: (categoryName: string) => void;
  onOrbClick?: () => void;
  cardOpacityMultiplier?: number;
  yellowRingOpacity?: number;
  yellowRingAngle?: number;
}

const OrbitalSystem: React.FC<OrbitalSystemProps> = ({
  visible,
  speedMultiplier = 1,
  compact = false,
  onCardClick,
  onOrbClick,
  cardOpacityMultiplier = 1,
  yellowRingOpacity = 0,
  yellowRingAngle = 0,
}) => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = useRef<(SVGLineElement | null)[]>([]);
  const angleRef = useRef(0);
  const frameRef = useRef<number>(0);

  // Spacious orbital radii tailored for optimal visual breathing room
  const radiusX = compact ? 210 : 255;
  const radiusY = compact ? 80 : 100;
  const particleCount = 12;

  useEffect(() => {
    if (!visible) return;

    const animate = () => {
      angleRef.current = (angleRef.current + 0.15 * speedMultiplier) % 360;
      const a = angleRef.current;

      CATEGORIES.forEach((cat, i) => {
        const rad = ((a + cat.offset) * Math.PI) / 180;
        const x = Math.cos(rad) * radiusX;
        const y = Math.sin(rad) * radiusY;
        const depth = Math.sin(rad);

        const scale = 0.7 + (depth + 1) * 0.22;
        const zIndex = Math.round((depth + 1) * 50) + 10;
        const opacity = (0.65 + (depth + 1) * 0.175) * cardOpacityMultiplier;
        const blurPx = depth < -0.4 ? Math.abs(depth + 0.4) * 1.5 : 0;

        const el = cardRefs.current[i];
        if (el) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
          el.style.zIndex = String(zIndex);
          el.style.opacity = String(Math.min(opacity, 1));
          el.style.filter = blurPx > 0 ? `blur(${blurPx}px)` : 'none';
        }
      });

      particleRefs.current.forEach((el, i) => {
        if (!el) return;
        const pOffset = (360 / particleCount) * i + 30;
        const pRad = ((a * 1.4 + pOffset) * Math.PI) / 180;
        const px = Math.cos(pRad) * (radiusX + 16);
        const py = Math.sin(pRad) * (radiusY + 10);
        const pDepth = Math.sin(pRad);
        const pOpacity = (0.25 + (pDepth + 1) * 0.35) * cardOpacityMultiplier;
        const pScale = 0.5 + (pDepth + 1) * 0.4;
        el.style.transform = `translate3d(${px}px, ${py}px, 0px) scale(${pScale})`;
        el.style.opacity = String(Math.min(pOpacity, 0.9));
      });

      connectorRefs.current.forEach((line, i) => {
        if (!line) return;
        const rad = ((a + CATEGORIES[i].offset) * Math.PI) / 180;
        const x = Math.cos(rad) * radiusX;
        const y = Math.sin(rad) * radiusY;
        const depth = Math.sin(rad);
        line.setAttribute('x2', String(x));
        line.setAttribute('y2', String(y));
        line.style.opacity = String((0.1 + (depth + 1) * 0.12) * cardOpacityMultiplier);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, speedMultiplier, radiusX, radiusY, cardOpacityMultiplier]);

  if (!visible) return null;

  return (
    <div className="orbital-system-container">
      {/* Soft Ambient Core Glow */}
      <div className="orbital-ambient-glow" />

      {/* 3D Elliptical Guide Lines */}
      <div
        className="orbital-path orbital-path--light"
        style={{ width: radiusX * 2 + 20, height: radiusY * 2 + 20, left: '50%', top: '50%', transform: `translate(-50%, -50%)` }}
      />
      <div
        className="orbital-path orbital-path--light"
        style={{ width: radiusX * 2 + 60, height: radiusY * 2 + 40, left: '50%', top: '50%', transform: `translate(-50%, -50%)`, opacity: 0.08 }}
      />

      {/* Connector lines SVG */}
      <svg
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: radiusX * 2 + 100, height: radiusY * 2 + 100, pointerEvents: 'none', overflow: 'visible' }}
        viewBox={`${-radiusX - 50} ${-radiusY - 50} ${(radiusX + 50) * 2} ${(radiusY + 50) * 2}`}
      >
        {CATEGORIES.map((_, i) => (
          <line
            key={`conn-${i}`}
            ref={(el) => { connectorRefs.current[i] = el; }}
            x1={0}
            y1={0}
            x2={0}
            y2={0}
            stroke="#CBD5E1"
            strokeWidth={1.2}
            strokeDasharray="4 4"
            opacity={0.16}
          />
        ))}
      </svg>

      {/* Central 3D ACM Orb */}
      <div
        className="acm-orb acm-orb--light"
        id="acm-orb"
        onClick={onOrbClick}
        title="Launch ACM Visualizer"
        style={{ cursor: onOrbClick ? 'pointer' : 'default' }}
      >
        <div className="flex flex-col items-center leading-none z-10">
          <span className="font-black text-2xl tracking-widest text-[#FFC107] drop-shadow-sm">ACM</span>
          <span className="text-[9px] font-bold tracking-wider text-slate-300 uppercase opacity-95 mt-0.5">Visualizer</span>
        </div>
      </div>

      {/* Synchronized Dynamic ACM-Yellow (#FFC107) Rotating Accent Ring */}
      {yellowRingOpacity > 0.01 && (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{
            width: 172,
            height: 172,
            opacity: yellowRingOpacity,
            zIndex: 55,
          }}
        >
          <svg
            className="w-full h-full"
            viewBox="0 0 172 172"
            style={{
              transform: `rotate(${yellowRingAngle}deg)`,
              filter: `drop-shadow(0 0 12px rgba(255, 193, 7, ${0.65 * yellowRingOpacity})) drop-shadow(0 0 24px rgba(255, 193, 7, ${0.4 * yellowRingOpacity}))`,
            }}
          >
            {/* Primary Sharp Yellow Ring */}
            <circle
              cx="86"
              cy="86"
              r="78"
              fill="none"
              stroke="#FFC107"
              strokeWidth="2.8"
              strokeDasharray="95 35 45 25"
              strokeLinecap="round"
            />
            {/* Secondary Outer Concentric Accent Ring */}
            <circle
              cx="86"
              cy="86"
              r="83"
              fill="none"
              stroke="#FFC107"
              strokeWidth="1.2"
              strokeDasharray="16 16"
              opacity="0.8"
            />
            {/* Synchronized Orbiting Accent Dots */}
            <circle cx="86" cy="8" r="3.5" fill="#FFC107" />
            <circle cx="86" cy="164" r="2.5" fill="#FFC107" />
          </svg>
        </div>
      )}

      {/* Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={(el) => { particleRefs.current[i] = el; }}
          className="orbital-particle orbital-particle--light"
        />
      ))}

      {/* Category Cards */}
      {CATEGORIES.map((cat, i) => (
        <div
          key={cat.name}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="orbital-card orbital-card--light group hover:border-[#FFC107] hover:shadow-xl transition-all"
          onClick={() => onCardClick?.(cat.name)}
          title={`Explore ${cat.name}`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            {cat.icon}
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border"
              style={{
                color: cat.color,
                backgroundColor: `${cat.color}14`,
                borderColor: `${cat.color}30`,
              }}
            >
              {cat.name.split(' ')[0]}
            </span>
          </div>

          <div className="orbital-card__icon my-1">
            <cat.VizComponent />
          </div>

          <div className="orbital-card__title text-[#18181B] font-bold">
            {cat.name}
          </div>

          <div className="orbital-card__subtitle text-[#64748B] font-medium text-[10px]">
            {cat.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};

const STATS = [
  { icon: <BookOpen className="w-4 h-4 text-[#D97706]" />, value: '30+', label: 'Algorithms' },
  { icon: <Zap className="w-4 h-4 text-[#D97706]" />, value: '100%', label: 'Interactive' },
  { icon: <Box className="w-4 h-4 text-[#3F3F3F]" />, value: '3D', label: 'Visualization' },
  { icon: <GraduationCap className="w-4 h-4 text-[#3F3F3F]" />, value: 'Step-by-Step', label: 'Learning' },
];

// ─────────────────────────────────────────────────────────────
// 4 Glass Feature Cards (Matching Reference Screenshot 3)
// ─────────────────────────────────────────────────────────────

const HERO_FEATURE_CARDS = [
  {
    icon: <BarChart3 className="w-4 h-4 text-blue-600" />,
    bg: 'bg-blue-50 border-blue-200',
    title: 'Sorting Algorithms',
    desc: 'Bubble, Merge, Quick, Heap & Insert sort animations',
  },
  {
    icon: <Search className="w-4 h-4 text-amber-600" />,
    bg: 'bg-amber-50 border-amber-200',
    title: 'Searching Algorithms',
    desc: 'Binary search, Linear search & Hash lookups',
  },
  {
    icon: <GitBranch className="w-4 h-4 text-emerald-600" />,
    bg: 'bg-emerald-50 border-emerald-200',
    title: 'Graph Traversal',
    desc: 'Interactive BFS, DFS, Dijkstra & Shortest Path',
  },
  {
    icon: <Database className="w-4 h-4 text-purple-600" />,
    bg: 'bg-purple-50 border-purple-200',
    title: 'Data Structures',
    desc: 'Trees, Linked Lists, Stacks, Queues & Heaps',
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN HOMEPAGE COMPONENT
// ─────────────────────────────────────────────────────────────

export const HomePage: React.FC = () => {
  const setCurrentPage = useVisualizerStore((s) => s.setCurrentPage);
  const skipIntroOnNextHome = useVisualizerStore((s) => s.skipIntroOnNextHome);
  const setSkipIntroOnNextHome = useVisualizerStore((s) => s.setSkipIntroOnNextHome);

  // Unified Continuous 3-Stage Cinematic Intro Animation State
  const [introActive, setIntroActive] = useState<boolean>(() => !skipIntroOnNextHome);
  const [questionsCount, setQuestionsCount] = useState<number>(0);

  // Layer 1 (Struggling Student) Transform States
  const [layer1Opacity, setLayer1Opacity] = useState<number>(1);
  const [layer1Scale, setLayer1Scale] = useState<number>(1);
  const [layer1RotateX, setLayer1RotateX] = useState<number>(0);
  const [layer1Blur, setLayer1Blur] = useState<number>(0);

  // Golden Luminous Transformation Bridge between Stage 1 and Stage 2
  const [bridgeGlowOpacity, setBridgeGlowOpacity] = useState<number>(0);

  // Layer 2 (Student Discovers ACM) Transform States
  const [layer2Opacity, setLayer2Opacity] = useState<number>(0);
  const [layer2Scale, setLayer2Scale] = useState<number>(0.94);
  const [layer2RotateX, setLayer2RotateX] = useState<number>(-2);

  // Layer 3 (Unique Pure ACM Rotation with Synchronized Yellow Ring)
  const [layer3Opacity, setLayer3Opacity] = useState<number>(0);
  const [orbitalSpeed, setOrbitalSpeed] = useState<number>(0.8);
  const [yellowRingOpacity, setYellowRingOpacity] = useState<number>(0);
  const [yellowRingAngle, setYellowRingAngle] = useState<number>(0);
  const ringAngleRef = useRef<number>(0);

  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  // Consume in-app navigation skip flag on mount if set
  useEffect(() => {
    if (skipIntroOnNextHome) {
      setIntroActive(false);
      setSkipIntroOnNextHome(false);
    }
  }, []);

  // Continuous Single-Timeline Cinematic Orchestration (0s to 7.8s)
  // Stage 1 -> Transformation with Depth & Tilt -> Stage 2 -> Emergence -> Stage 3 (Slow -> Continuous 1.4s Acceleration + Yellow Spinning Ring -> Immediate Seamless Reveal)
  useEffect(() => {
    if (!introActive) return;

    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;

      // ─── Stage 1 Thought Questions Timeline ───
      if (elapsed < 700) {
        setQuestionsCount(0);
      } else if (elapsed < 1400) {
        setQuestionsCount(1);
      } else if (elapsed < 2100) {
        setQuestionsCount(2);
      } else if (elapsed < 2800) {
        setQuestionsCount(3);
      } else if (elapsed < 3200) {
        setQuestionsCount(4);
      }

      // ─── Stage 1: 0ms to 3200ms (Late night study struggle) ───
      if (elapsed < 3200) {
        setLayer1Opacity(1);
        setLayer1Scale(1);
        setLayer1RotateX(0);
        setLayer1Blur(0);
        setBridgeGlowOpacity(0);
        setLayer2Opacity(0);
        setLayer2Scale(0.94);
        setLayer2RotateX(-2);
        setLayer3Opacity(0);
      }
      // ─── Transition 1 → 2: 3200ms to 4400ms (Natural 3D Emergence with depth, rotation, scaling & easing) ───
      else if (elapsed >= 3200 && elapsed < 4400) {
        const t = (elapsed - 3200) / 1200;
        // EaseInOutCubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Layer 1 smoothly pushes deeper with subtle rotation and focal blur
        setLayer1Opacity(1 - ease);
        setLayer1Scale(1.0 + ease * 0.06);
        setLayer1RotateX(ease * 2.2);
        setLayer1Blur(ease * 3.5);

        // Warm golden light bridge emerges from open book
        const glowProg = Math.sin(t * Math.PI);
        setBridgeGlowOpacity(glowProg * 0.85);

        // Layer 2 naturally emerges from depth with 3D perspective
        setLayer2Opacity(ease);
        setLayer2Scale(0.94 + ease * 0.06);
        setLayer2RotateX(-2 * (1 - ease));
        setLayer3Opacity(0);
      }
      // ─── Stage 2: 4400ms to 5800ms (Student Discovery Moment) ───
      else if (elapsed >= 4400 && elapsed < 5800) {
        setLayer1Opacity(0);
        setBridgeGlowOpacity(0);
        setLayer2Opacity(1);
        setLayer2Scale(1);
        setLayer2RotateX(0);
        setLayer3Opacity(0);
      }
      // ─── Transition 2 → 3: 5800ms to 6400ms (Continuous Emergence of ACM System) ───
      else if (elapsed >= 5800 && elapsed < 6400) {
        const t = (elapsed - 5800) / 600;
        const ease = t * t * (3 - 2 * t);

        setLayer2Opacity(1 - ease);
        setLayer2Scale(1 + ease * 0.03);
        setLayer3Opacity(ease);
        setOrbitalSpeed(0.8 + ease * 0.2);
        setYellowRingOpacity(0);
      }
      // ─── Stage 3: 6400ms to 7800ms (1.4s Pure Rotation Acceleration + Synchronized Yellow Ring) ───
      else if (elapsed >= 6400 && elapsed < 7800) {
        setLayer2Opacity(0);
        setLayer3Opacity(1);

        const t = (elapsed - 6400) / 1400; // Continuous 0.0 to 1.0 over 1.4s

        // Starts rotating very slowly (0.8), accelerates continuously to fast smooth peak (~12.8)
        const currentSpeed = 0.8 + Math.pow(t, 2.05) * 12.0;
        setOrbitalSpeed(currentSpeed);

        // ACM-yellow (#FFC107) circular border/ring becomes increasingly prominent as rotation accelerates
        const ringOp = Math.min(Math.pow(t, 1.35) * 1.1, 1.0);
        setYellowRingOpacity(ringOp);

        // Advance rotating ring angle in direct sync with acceleration speed
        ringAngleRef.current = (ringAngleRef.current + currentSpeed * 2.8) % 360;
        setYellowRingAngle(ringAngleRef.current);
      }

      // ─── Peak Reached: Immediately Transition Smoothly into Main Home Page ───
      if (elapsed >= 7800) {
        setIntroActive(false);
        setOrbitalSpeed(1.0);
        setYellowRingOpacity(0);
        return;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [introActive]);

  const handleSkipIntro = useCallback(() => {
    setIntroActive(false);
    setOrbitalSpeed(1.0);
    setYellowRingOpacity(0);
  }, []);

  const handleStartExploring = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }

      setIntroActive(false);
      setYellowRingOpacity(0);

      const orbEl = document.getElementById('acm-orb');
      if (orbEl) {
        orbEl.classList.add('acm-orb--pulse');
      }

      setOrbitalSpeed(4);
      setTransitioning(true);
      setTimeout(() => {
        setCurrentPage('visualizer');
      }, 850);
    },
    [setCurrentPage]
  );

  useEffect(() => {
    if (ripple) {
      const t = setTimeout(() => setRipple(null), 600);
      return () => clearTimeout(t);
    }
  }, [ripple]);

  const thoughtQuestions = [
    '• What is DFS?',
    '• How does Merge Sort work?',
    '• What is a graph traversal?',
    '• I just can\'t visualize it...',
  ];

  return (
    <div className="home-page bg-white min-h-screen relative text-[#18181B]">
      {/* Background with geometric yellow and dark charcoal shapes at corners/edges matching reference */}
      <GeometricCanvasBackground />

      {/* ─── Top Header Navigation ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 transition-colors bg-white border-b border-[#E2E8F0] text-[#0F172A] shadow-xs">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between min-w-0">
          <div className="flex items-center shrink-0 whitespace-nowrap cursor-pointer" onClick={() => setCurrentPage('home')}>
            <ACMLogo variant="horizontal" size="md" lightText={false} />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Home', 'Visualizer', 'Learn', 'About'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (item === 'Visualizer') setCurrentPage('visualizer');
                }}
                className={`text-xs font-semibold transition-colors cursor-pointer py-1 ${
                  item === 'Home'
                    ? 'text-[#0F172A] relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFC107] after:rounded-full'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={handleStartExploring}
            className="px-4 py-2 rounded-xl bg-[#FFC107] hover:bg-[#F59E0B] text-[#18181B] font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ─── UNIFIED CONTINUOUS 3-STAGE CINEMATIC INTRO ─── */}
      <AnimatePresence>
        {introActive && (
          <motion.div
            key="cinematic-intro-stage"
            className="fixed inset-0 z-30 overflow-hidden flex items-center justify-center bg-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.75, ease: [0.25, 0.1, 0.25, 1.0] } }}
            style={{ perspective: '1200px' }}
          >
            {/* Background geometric shapes around edges */}
            <GeometricCanvasBackground />

            {/* ── Layer 1: Struggling Student at Desk ── */}
            <div
              className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center pointer-events-none"
              style={{
                opacity: layer1Opacity,
                transform: `scale(${layer1Scale}) rotateX(${layer1RotateX}deg)`,
                transformOrigin: '50% 60%',
                filter: layer1Blur > 0 ? `blur(${layer1Blur}px)` : 'none',
                willChange: 'transform, opacity, filter',
              }}
            >
              <img
                src={studentStudyingImg}
                alt="Student struggling at study desk"
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(0.92) contrast(1.05)' }}
              />
              <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

              {/* Stage 1 Clock */}
              <div className="absolute top-20 left-6 sm:left-12 z-10 text-white font-mono">
                <div className="text-3xl sm:text-5xl font-extrabold tracking-wider text-slate-100 drop-shadow-md">
                  02:15 <span className="text-xs font-bold text-amber-400 align-top">AM</span>
                </div>
                <div className="text-xs sm:text-sm font-medium tracking-widest text-slate-300 uppercase mt-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Still Confused? _</span>
                </div>
              </div>

              {/* Stage 1 Thought Questions */}
              {questionsCount > 0 && (
                <div className="absolute top-[18%] right-[6%] sm:right-[12%] z-20 max-w-sm w-full bg-white/95 text-[#18181B] border border-[#CBD5E1] rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-[#E2E8F0]">
                    <div className="w-6 h-6 rounded-md bg-[#FFFBEB] border border-[#FFC107]/50 flex items-center justify-center text-[#D97706]">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#18181B] uppercase tracking-wider block">
                        Student Thoughts
                      </span>
                      <span className="text-[10px] text-[#64748B]">Struggling with Algorithm Concepts</span>
                    </div>
                  </div>

                  <div className="space-y-2 font-sans">
                    {thoughtQuestions.slice(0, questionsCount).map((q, idx) => (
                      <div
                        key={idx}
                        className={`text-xs sm:text-sm font-medium py-1 px-2.5 rounded-lg transition-colors ${
                          idx === questionsCount - 1
                            ? 'text-[#B45309] bg-[#FFFBEB] border border-[#FFC107]/40'
                            : 'text-[#475569]'
                        }`}
                      >
                        {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Luminescent Golden Transformation Bridge ── */}
            {bridgeGlowOpacity > 0.01 && (
              <div
                className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center"
                style={{ opacity: bridgeGlowOpacity }}
              >
                <div
                  className="w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 193, 7, 0.5) 0%, rgba(254, 243, 199, 0.25) 45%, transparent 70%)',
                  }}
                />
              </div>
            )}

            {/* ── Layer 2: Discovery Scene (Naturally Emerges from Depth) ── */}
            <div
              className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center pointer-events-none"
              style={{
                opacity: layer2Opacity,
                transform: `scale(${layer2Scale}) rotateX(${layer2RotateX}deg)`,
                transformOrigin: '50% 60%',
                willChange: 'transform, opacity',
              }}
            >
              <img
                src={studentDiscoversImg}
                alt="Student discovers ACM"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

              {/* Stage 2 Headline */}
              <div className="absolute bottom-16 sm:bottom-24 z-10 text-center px-4 max-w-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-[#B45309] bg-[#FFFBEB] border border-[#FFC107]/50 px-3 py-1 rounded-full mb-3 inline-block shadow-xs">
                  A New Way to Learn
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg tracking-tight">
                  What if you could <span className="text-[#FFC107]">see</span> how algorithms work?
                </h3>
              </div>
            </div>

            {/* ── Layer 3: ACM Visual Pure Rotation with Synchronized Yellow Ring ── */}
            <div
              className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none overflow-hidden"
              style={{
                opacity: layer3Opacity,
                willChange: 'opacity',
              }}
            >
              {/* Radial Warm Golden Ambient Energy Aura */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div
                  className="w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none transition-all duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 193, 7, 0.28) 0%, rgba(254, 243, 199, 0.12) 45%, transparent 70%)',
                    opacity: 0.55 + yellowRingOpacity * 0.45,
                  }}
                />
              </div>

              {/* Central Visual Stage: Completely Stable (NO Zoom, NO Camera Movement) */}
              <div className="w-full h-[520px] flex items-center justify-center relative pointer-events-auto">
                <OrbitalSystem
                  visible={layer3Opacity > 0.05}
                  speedMultiplier={orbitalSpeed}
                  yellowRingOpacity={yellowRingOpacity}
                  yellowRingAngle={yellowRingAngle}
                  onCardClick={() => handleStartExploring()}
                  onOrbClick={() => handleStartExploring()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── MAIN LANDING PAGE (Always Mounted or Seamlessly Revealed) ─── */}
      <motion.div
        className="hero-page-wrapper relative w-full min-h-screen pt-20 pb-12 px-4 sm:px-8 overflow-x-hidden flex flex-col justify-between bg-transparent text-[#18181B]"
        initial={{ opacity: introActive ? 0 : 1, scale: introActive ? 1.02 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
            {/* Main 2-Column Hero Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
              {/* Left Text Column */}
              <div className="col-span-12 lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start gap-4">
                {/* Architectural Eyebrow / Kicker with geometric diamond accents */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 bg-[#FFC107] rotate-45 inline-block shadow-xs" />
                    <span className="w-1.5 h-1.5 bg-[#3F3F3F] rotate-45 inline-block" />
                  </div>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-[#3F3F3F]">
                    ACM // Computational Logic
                  </span>
                  <span className="h-px w-10 bg-gradient-to-r from-[#CBD5E1] to-transparent hidden sm:inline-block" />
                </motion.div>

                {/* Refined Bespoke Editorial Headline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.35 }}
                  className="space-y-1"
                >
                  <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-[-0.035em] leading-[1.08] text-[#18181B]">
                    <span className="block">Precision Logic.</span>
                    <span className="block text-[#3F3F3F] font-semibold text-2xl sm:text-4xl lg:text-[2.65rem] mt-1 tracking-tight">
                      Visualized in Motion.
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#FFC107] font-black mt-1">
                      Master Every Step.
                    </span>
                  </h1>
                </motion.div>

                {/* Structured Architectural Feature Strip (Bridges space naturally) */}
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-3 gap-2.5 w-full max-w-lg pt-1 pb-1"
                >
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B45309]">
                      01 // Execution
                    </span>
                    <span className="text-xs font-bold text-[#18181B] truncate">
                      Step Traces
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3F3F3F]">
                      02 // Topology
                    </span>
                    <span className="text-xs font-bold text-[#18181B] truncate">
                      Graph & Trees
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-xs flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#059669]">
                      03 // Analysis
                    </span>
                    <span className="text-xs font-bold text-[#18181B] truncate">
                      Complexity O(n)
                    </span>
                  </div>
                </motion.div>

                {/* Start Exploring Action Section (Repositioned & Balanced) */}
                <motion.div
                  className="w-full flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3 pb-1"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                >
                  <button
                    onClick={handleStartExploring}
                    className="cta-primary px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer group w-full sm:w-auto"
                    type="button"
                  >
                    {ripple && (
                      <span
                        className="cta-primary__ripple"
                        style={{ left: ripple.x, top: ripple.y }}
                      />
                    )}
                    <span>Start Exploring</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-xl shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                    <span>Free & Interactive Engine · 30+ Algorithms</span>
                  </div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                  className="stats-bar stats-bar--light mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {STATS.map((stat, i) => (
                    <div key={i} className="stat-item">
                      <div className="stat-item__icon stat-item__icon--light">
                        {stat.icon}
                      </div>
                      <div className="stat-item__value stat-item__value--light">{stat.value}</div>
                      <div className="stat-item__label stat-item__label--light">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: 3D ACM Orbital System (Sized strictly within right column) */}
              <motion.div
                className="col-span-12 lg:col-span-6 flex items-center justify-center relative min-h-[460px] w-full"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <OrbitalSystem
                  visible={true}
                  speedMultiplier={orbitalSpeed}
                  compact
                  onCardClick={() => handleStartExploring()}
                  onOrbClick={() => handleStartExploring()}
                />
              </motion.div>
            </div>

            {/* Bottom Section: 4 Feature Glass Cards + Scroll Indicator (Matching Reference Screenshot 3) */}
            <div className="relative z-10 max-w-[1300px] mx-auto w-full pt-4">
              <motion.div
                className="w-full bg-white/85 border border-slate-200/90 rounded-2xl p-4 shadow-xl backdrop-blur-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                {HERO_FEATURE_CARDS.map((card, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-200/60"
                  >
                    <div className={`w-10 h-10 rounded-xl ${card.bg} border flex items-center justify-center shrink-0 shadow-xs`}>
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Scroll to explore indicator */}
              <div className="flex flex-col items-center justify-center gap-1 mt-6 text-slate-400">
                <Mouse className="w-4 h-4 animate-bounce text-[#FFC107]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Scroll to explore</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </motion.div>

      {/* ─── Skip Intro Button ─── */}
      {introActive && (
        <button
          className="skip-intro skip-intro--light"
          onClick={handleSkipIntro}
          type="button"
        >
          Skip Intro
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ─── Page Transition Flash Overlay ─── */}
      {transitioning && <div className="page-transition-overlay" />}
    </div>
  );
};

export default HomePage;
