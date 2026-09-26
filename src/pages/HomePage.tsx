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
}

const OrbitalSystem: React.FC<OrbitalSystemProps> = ({
  visible,
  speedMultiplier = 1,
  compact = false,
  onCardClick,
  onOrbClick,
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
        const opacity = 0.65 + (depth + 1) * 0.175;
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
        const pOpacity = 0.25 + (pDepth + 1) * 0.35;
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
        line.style.opacity = String(0.1 + (depth + 1) * 0.12);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [visible, speedMultiplier, radiusX, radiusY]);

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
            stroke="#2563EB"
            strokeWidth={1.2}
            strokeDasharray="4 4"
            opacity={0.12}
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
          <span className="font-black text-2xl tracking-widest text-white drop-shadow-sm">ACM</span>
          <span className="text-[9px] font-bold tracking-wider text-blue-100 uppercase opacity-95 mt-0.5">Visualizer</span>
        </div>
      </div>

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
          className="orbital-card orbital-card--light group hover:border-blue-400 hover:shadow-xl transition-all"
          onClick={() => onCardClick?.(cat.name)}
          title={`Explore ${cat.name}`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            {cat.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
              {cat.name.split(' ')[0]}
            </span>
          </div>

          <div className="orbital-card__icon my-1">
            <cat.VizComponent />
          </div>

          <div className="orbital-card__title text-slate-900 font-bold">
            {cat.name}
          </div>

          <div className="orbital-card__subtitle text-slate-500 font-medium text-[10px]">
            {cat.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Interactive Watch Demo Modal
// ─────────────────────────────────────────────────────────────

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchVisualizer: () => void;
}

const WatchDemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, onLaunchVisualizer }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [step, setStep] = useState(1);
  const [activeArray, setActiveArray] = useState([42, 18, 65, 27, 89, 34]);
  const [comparing, setComparing] = useState<[number, number] | null>([0, 1]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setStep((prevStep) => {
        const nextStep = prevStep >= 6 ? 1 : prevStep + 1;
        if (nextStep === 1) {
          setActiveArray([42, 18, 65, 27, 89, 34]);
          setComparing([0, 1]);
        } else if (nextStep === 2) {
          setActiveArray([18, 42, 65, 27, 89, 34]);
          setComparing([1, 2]);
        } else if (nextStep === 3) {
          setActiveArray([18, 42, 65, 27, 89, 34]);
          setComparing([2, 3]);
        } else if (nextStep === 4) {
          setActiveArray([18, 42, 27, 65, 89, 34]);
          setComparing([3, 4]);
        } else if (nextStep === 5) {
          setActiveArray([18, 42, 27, 65, 34, 89]);
          setComparing([4, 5]);
        } else {
          setActiveArray([18, 27, 34, 42, 65, 89]);
          setComparing(null);
        }
        return nextStep;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">ACM Visualizer — Live Interactive Demo</h3>
              <p className="text-xs text-slate-500 font-medium">Real-time Step-by-Step Bubble Sort Trace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
              {step === 6 ? 'Pass Complete' : `Comparing arr[${comparing?.[0] ?? 0}] & arr[${comparing?.[1] ?? 1}]`}
            </span>
            <span className="text-xs font-mono font-bold text-slate-600">
              Step {step} / 6
            </span>
          </div>

          <div className="h-44 flex items-end justify-center gap-3 pt-4 border-b border-slate-200 pb-2">
            {activeArray.map((val, idx) => {
              const isComp = comparing && (idx === comparing[0] || idx === comparing[1]);
              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 max-w-[50px]">
                  <span className={`text-[11px] font-bold font-mono ${isComp ? 'text-blue-700' : 'text-slate-600'}`}>
                    {val}
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isComp
                        ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-md shadow-blue-500/30 ring-2 ring-blue-300'
                        : 'bg-slate-300'
                    }`}
                    style={{ height: `${val * 1.5}px` }}
                  />
                  <span className="text-[9px] font-mono text-slate-400">[{idx}]</span>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs font-medium text-slate-600 text-center italic">
            {step === 1 && 'Comparing 42 and 18. Since 42 > 18, swap elements.'}
            {step === 2 && 'Comparing 42 and 65. Since 42 < 65, maintain order.'}
            {step === 3 && 'Comparing 65 and 27. Since 65 > 27, swap elements.'}
            {step === 4 && 'Comparing 65 and 89. Since 65 < 89, maintain order.'}
            {step === 5 && 'Comparing 89 and 34. Since 89 > 34, swap elements.'}
            {step === 6 && 'First pass complete! 89 is in its correct sorted position.'}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Demo' : 'Play Demo'}</span>
          </button>

          <button
            onClick={onLaunchVisualizer}
            className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Launch Full Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};



const STATS = [
  { icon: <BookOpen className="w-4 h-4 text-blue-600" />, value: '30+', label: 'Algorithms' },
  { icon: <Zap className="w-4 h-4 text-blue-600" />, value: '100%', label: 'Interactive' },
  { icon: <Box className="w-4 h-4 text-blue-600" />, value: '3D', label: 'Visualization' },
  { icon: <GraduationCap className="w-4 h-4 text-blue-600" />, value: 'Step-by-Step', label: 'Learning' },
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

  // Intro Panels: 1 = Struggling Student, 2 = Discovery, 3 = Pure ACM Rapid Acceleration, 4 = Final Landing Page
  const [panel, setPanel] = useState<number>(() => (skipIntroOnNextHome ? 4 : 1));
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [orbitalSpeed, setOrbitalSpeed] = useState<number>(1);
  const [transitioning, setTransitioning] = useState<boolean>(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);

  // Consume in-app navigation skip flag on mount if set
  useEffect(() => {
    if (skipIntroOnNextHome) {
      setSkipIntroOnNextHome(false);
    }
  }, []);

  // Automatic panel progression timeline matching the user's exact cinematic choreography
  useEffect(() => {
    if (panel >= 4) return;

    // Panel 1 question sequence
    const tq1 = setTimeout(() => setQuestionsCount(1), 1000);
    const tq2 = setTimeout(() => setQuestionsCount(2), 1800);
    const tq3 = setTimeout(() => setQuestionsCount(3), 2600);
    const tq4 = setTimeout(() => setQuestionsCount(4), 3400);

    // Transition to Panel 2 (ACM Discovery) at 4.2s
    const p2 = setTimeout(() => setPanel(2), 4200);

    // Transition to Panel 3 (ACM Rapid Acceleration) at 6.8s
    const p3 = setTimeout(() => {
      setPanel(3);
      setOrbitalSpeed(1.5);
    }, 6800);

    return () => {
      clearTimeout(tq1);
      clearTimeout(tq2);
      clearTimeout(tq3);
      clearTimeout(tq4);
      clearTimeout(p2);
      clearTimeout(p3);
    };
  }, [panel]);

  // Smooth continuous exponential acceleration during Panel 3 (ACM Rapid Rotation Transition)
  useEffect(() => {
    if (panel !== 3) return;

    const startTime = Date.now();
    const duration = 2600; // 2.6 seconds continuous rotation acceleration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);

      // Continuous exponential speed acceleration: 1.5 -> 42.0
      const currentSpeed = 1.5 + Math.pow(progress, 2.5) * 40.5;
      setOrbitalSpeed(currentSpeed);

      if (progress >= 1.0) {
        clearInterval(interval);
        setPanel(4);
        setOrbitalSpeed(1.0);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [panel]);

  const handleSkipIntro = useCallback(() => {
    setPanel(4);
    setOrbitalSpeed(1.0);
  }, []);

  const handleStartExploring = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        const rect = e.currentTarget.getBoundingClientRect();
        setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }

      setPanel(4);

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
    <div className={`home-page ${panel >= 4 ? 'hero-bg--light' : 'bg-slate-950'}`}>
      {/* ─── Top Header Navigation ─── */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 transition-all duration-700 ${
        panel >= 4 ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs' : 'bg-slate-950/70 backdrop-blur-md border-b border-white/15 text-white'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <ACMLogo variant="horizontal" size="md" lightText={panel < 4} />
            <span className={`text-[11px] font-semibold uppercase tracking-wider hidden sm:inline-block border-l pl-3 ${
              panel >= 4 ? 'text-slate-500 border-slate-300' : 'text-slate-200 border-white/30 drop-shadow-sm'
            }`}>
              Visualize · Learn · Master
            </span>
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
                    ? `${panel >= 4 ? 'text-slate-900' : 'text-white'} relative after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600 after:rounded-full`
                    : `${panel >= 4 ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'}`
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={handleStartExploring}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Start Exploring</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ─── CINEMATIC INTRO PANELS (1 TO 3) ─── */}
      <AnimatePresence mode="wait">
        {panel <= 3 && (
          <motion.div
            key={`panel-${panel}`}
            className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Panel 1: Struggling Student */}
            {panel === 1 && (
              <>
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={studentStudyingImg}
                    alt="Student struggling at study desk"
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.92) contrast(1.05)' }}
                  />
                  <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
                </div>

                <motion.div
                  className="absolute top-20 left-6 sm:left-12 z-10 text-white font-mono"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="text-3xl sm:text-5xl font-extrabold tracking-wider text-slate-100 drop-shadow-md">
                    02:15 <span className="text-xs font-bold text-amber-400 align-top">AM</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium tracking-widest text-slate-300 uppercase mt-1 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Still Confused? _</span>
                  </div>
                </motion.div>

                {questionsCount > 0 && (
                  <motion.div
                    className="absolute top-[18%] right-[6%] sm:right-[12%] z-20 max-w-sm w-full bg-slate-900/90 text-white border border-slate-700/70 rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-slate-800">
                      <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                          Student Thoughts
                        </span>
                        <span className="text-[10px] text-slate-400">Struggling with Algorithm Concepts</span>
                      </div>
                    </div>

                    <div className="space-y-2 font-sans">
                      {thoughtQuestions.slice(0, questionsCount).map((q, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                          className={`text-xs sm:text-sm font-medium py-1 px-2.5 rounded-lg transition-colors ${
                            idx === questionsCount - 1
                              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20'
                              : 'text-slate-300'
                          }`}
                        >
                          {q}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {/* Panel 2: ACM Discovery */}
            {panel === 2 && (
              <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                <img
                  src={studentDiscoversImg}
                  alt="Student discovers ACM"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

                <motion.div
                  className="absolute bottom-16 sm:bottom-24 z-10 text-center px-4 max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-full mb-3 inline-block">
                    A New Way to Learn
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-white drop-shadow-lg tracking-tight">
                    What if you could <span className="text-blue-400">see</span> how algorithms work?
                  </h3>
                </motion.div>
              </div>
            )}

            {/* Panel 3: Rapid ACM Rotation Scene (Matching Reference Panel 3) */}
            {panel === 3 && (
              <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-4">
                {/* Radial Blue Light Energy Aura */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    className="w-[650px] h-[650px] rounded-full blur-3xl transition-all duration-500"
                    style={{
                      background: orbitalSpeed > 5
                        ? 'radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(6, 182, 212, 0.3) 45%, transparent 75%)'
                        : 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
                      opacity: orbitalSpeed > 5 ? 0.9 : 0.5,
                      transform: `scale(${1 + (orbitalSpeed / 12) * 0.25})`,
                    }}
                  />
                </div>

                <motion.div
                  className="w-full max-w-4xl flex flex-col items-center justify-center relative z-10"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-4 z-10">
                    <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase bg-blue-950/80 px-3.5 py-1 rounded-full border border-blue-800/60 shadow-md">
                      {orbitalSpeed > 5 ? 'Rapid ACM Rotation' : 'ACM Core Acceleration'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-white mt-3 tracking-tight drop-shadow-md">
                      Transforming Algorithmic Understanding
                    </h2>
                  </div>

                  <div
                    className="w-full h-[480px] flex items-center justify-center relative transition-all duration-300"
                    style={{
                      filter: orbitalSpeed > 6 ? `blur(${Math.min((orbitalSpeed - 6) * 0.15, 1.2)}px)` : 'none',
                    }}
                  >
                    <OrbitalSystem
                      visible={true}
                      speedMultiplier={orbitalSpeed}
                      onCardClick={() => handleStartExploring()}
                      onOrbClick={() => handleStartExploring()}
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── PANEL 4: FINAL LANDING PAGE (PERFECT 100% MATCH TO REFERENCE SCREENSHOT 3) ─── */}
      <AnimatePresence>
        {panel >= 4 && (
          <motion.div
            className="hero-page-wrapper relative w-full min-h-screen pt-20 pb-12 px-4 sm:px-8 overflow-x-hidden flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={heroBgLandscapeImg}
                alt="ACM Hero Educational Architecture Landscape"
                className="w-full h-full object-cover object-center opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />
            </div>

            {/* Main 2-Column Hero Grid */}
            <div className="relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
              {/* Left Text Column */}
              <div className="col-span-12 lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="hero-badge hero-badge--light inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>Interactive Algorithm Visualizer</span>
                  </div>
                </motion.div>

                <motion.h1
                  className="hero-heading hero-heading--light text-slate-900 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                >
                  Visualize <br />
                  Algorithms <br />
                  Like <span className="hero-heading__accent text-blue-600">Never Before.</span>
                </motion.h1>

                <motion.p
                  className="hero-subtext text-slate-600 font-medium text-sm sm:text-base max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Turn complex algorithms and data structures into interactive, visual experiences. Learn, experiment and master concepts step by step.
                </motion.p>

                <motion.div
                  className="hero-ctas flex items-center justify-center lg:justify-start gap-4 pt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.65 }}
                >
                  <button
                    onClick={handleStartExploring}
                    className="cta-primary"
                    type="button"
                  >
                    {ripple && (
                      <span
                        className="cta-primary__ripple"
                        style={{ left: ripple.x, top: ripple.y }}
                      />
                    )}
                    <span>Start Exploring</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoModalOpen(true)}
                    className="cta-secondary cta-secondary--light"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span>Watch Demo</span>
                  </button>
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
                <Mouse className="w-4 h-4 animate-bounce text-blue-600" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Scroll to explore</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Skip Intro Button ─── */}
      {panel < 4 && (
        <button
          className="skip-intro skip-intro--light"
          onClick={handleSkipIntro}
          type="button"
        >
          Skip Intro
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* ─── Interactive Demo Modal ─── */}
      <WatchDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onLaunchVisualizer={() => {
          setDemoModalOpen(false);
          handleStartExploring();
        }}
      />

      {/* ─── Page Transition Flash Overlay ─── */}
      {transitioning && <div className="page-transition-overlay" />}
    </div>
  );
};

export default HomePage;
