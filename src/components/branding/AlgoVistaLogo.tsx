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
  const subtitleSize = size === 'sm' ? 'text-[9.5px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  const titleColor = lightText
    ? 'text-white drop-shadow-sm font-black'
    : 'text-[#18181B] font-black';

  const subtitleColor = lightText
    ? 'text-slate-200 font-medium drop-shadow-sm'
    : 'text-[#64748B] font-medium';

  // The custom geometric "A" constructed of connected graph nodes and angular edges in charcoal (#3F3F3F) and yellow (#FFC107)
  const LogoIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      style={{ width: `${iconSize}px`, height: `${iconSize}px`, flexShrink: 0 }}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      className="shrink-0 block"
      aria-label="ACM brand logo"
    >
      <defs>
        {/* Left leg: charcoal to yellow */}
        <linearGradient id="acm-leg-left" x1="12" y1="38" x2="24" y2="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3F3F3F" />
          <stop offset="70%" stopColor="#3F3F3F" />
          <stop offset="100%" stopColor="#FFC107" />
        </linearGradient>

        {/* Right leg: yellow to charcoal */}
        <linearGradient id="acm-leg-right" x1="24" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="30%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#3F3F3F" />
        </linearGradient>

        {/* Crossbar: charcoal with gold tint */}
        <linearGradient id="acm-crossbar" x1="14" y1="28" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3F3F3F" />
          <stop offset="50%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#3F3F3F" />
        </linearGradient>

      </defs>

      {/* Crossbar edge */}
      <line
        x1="15"
        y1="28"
        x2="33"
        y2="28"
        stroke="url(#acm-crossbar)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Left leg of A */}
      <line
        x1="12"
        y1="38"
        x2="24"
        y2="10"
        stroke="url(#acm-leg-left)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Right leg of A */}
      <line
        x1="24"
        y1="10"
        x2="36"
        y2="38"
        stroke="url(#acm-leg-right)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Inner crossbar connecting node */}
      <circle cx="24" cy="28" r="3" fill="#FFFFFF" stroke="#3F3F3F" strokeWidth="2" />

      {/* Apex Node (Top Vertex - Gold Yellow) */}
      <circle cx="24" cy="10" r="4.5" fill="#FFC107" stroke="#18181B" strokeWidth="2" />

      {/* Bottom Left Node (Charcoal) */}
      <circle cx="12" cy="38" r="4.5" fill="#3F3F3F" stroke="#FFFFFF" strokeWidth="2" />

      {/* Bottom Right Node (Yellow) */}
      <circle cx="36" cy="38" r="4.5" fill="#FFC107" stroke="#3F3F3F" strokeWidth="2" />
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center shrink-0 ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none shrink-0 whitespace-nowrap min-w-max ${className}`}>
      <div
        className="shrink-0 flex items-center justify-center"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      >
        {LogoIcon}
      </div>
      <div className="flex flex-col shrink-0 justify-center whitespace-nowrap min-w-max">
        <div className="flex items-center gap-1.5 leading-none whitespace-nowrap">
          <span className={`tracking-wider font-black leading-none ${titleColor} ${titleSize} whitespace-nowrap`}>
            ACM
          </span>
          <span
            className="block w-1.5 h-1.5 rounded-full bg-[#FFC107] shrink-0"
            aria-hidden="true"
          />
        </div>
        {variant === 'horizontal' && (
          <span
            className={`tracking-wide ${subtitleSize} font-medium whitespace-nowrap ${subtitleColor} leading-none mt-1`}
          >
            Visualize · Learn · Master
          </span>
        )}
      </div>
    </div>
  );
};

export const AlgoVistaLogo = ACMLogo;
