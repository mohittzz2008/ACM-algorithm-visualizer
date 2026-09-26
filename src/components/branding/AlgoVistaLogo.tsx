import React from 'react';

interface AlgoVistaLogoProps {
  variant?: 'horizontal' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  lightText?: boolean;
}

export type ACMLogoProps = AlgoVistaLogoProps;

export const ACMLogo: React.FC<ACMLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  lightText = false,
}) => {
  // Determine sizing dimensions
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  const subtitleSize = size === 'sm' ? 'text-[9.5px]' : size === 'lg' ? 'text-xs' : 'text-[10.5px]';

  const titleColor = lightText
    ? 'text-white drop-shadow-sm font-black'
    : 'text-[#0F172A] dark:text-white font-black';

  const subtitleColor = lightText
    ? 'text-slate-200 font-medium drop-shadow-sm'
    : 'text-[#64748B] dark:text-slate-400 font-medium';

  // The custom geometric "A" constructed of connected graph nodes and smooth edges
  const LogoIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-label="ACM brand logo"
    >
      <defs>
        {/* Primary gradient: rich violet -> indigo -> bright cyan */}
        <linearGradient id="av-leg-left" x1="8" y1="40" x2="24" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="60%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="av-leg-right" x1="24" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        <linearGradient id="av-crossbar" x1="14" y1="28" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Node Glow Filters */}
        <filter id="av-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#8B5CF6" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Crossbar edge */}
      <line
        x1="15"
        y1="28"
        x2="33"
        y2="28"
        stroke="url(#av-crossbar)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Left leg of A (Bottom-left to Apex) */}
      <line
        x1="12"
        y1="38"
        x2="24"
        y2="10"
        stroke="url(#av-leg-left)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Right leg of A (Apex to Bottom-right) */}
      <line
        x1="24"
        y1="10"
        x2="36"
        y2="38"
        stroke="url(#av-leg-right)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Inner crossbar connecting node */}
      <circle cx="24" cy="28" r="3" fill="#FFFFFF" filter="url(#av-glow)" />

      {/* Apex Node (Top Vertex) */}
      <circle cx="24" cy="10" r="4.5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" filter="url(#av-glow)" />

      {/* Bottom Left Node */}
      <circle cx="12" cy="38" r="4.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" filter="url(#av-glow)" />

      {/* Bottom Right Node */}
      <circle cx="36" cy="38" r="4.5" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" filter="url(#av-glow)" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`group inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`tracking-wider ${titleColor} ${titleSize}`}>
            ACM
          </span>
        </div>
        {variant === 'horizontal' && (
          <span className={`tracking-wide mt-0.5 ${subtitleColor} ${subtitleSize}`}>
            Visualize · Learn · Master.
          </span>
        )}
      </div>
    </div>
  );
};

export const AlgoVistaLogo = ACMLogo;
