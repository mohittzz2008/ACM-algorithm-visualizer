import React from 'react';

/**
 * GeometricCanvasBackground
 *
 * Renders the clean white canvas with minimal geometric yellow (#FFC107)
 * and dark charcoal-gray (#3F3F3F) angular shapes around the edges/corners,
 * inspired by the ACM reference design. Center remains spacious and clean.
 */
export interface GeometricCanvasBackgroundProps {
  variant?: 'home' | 'visualizer';
}

export const GeometricCanvasBackground: React.FC<GeometricCanvasBackgroundProps> = ({
  variant = 'home',
}) => {
  // Visualizer page has an integrated clean workspace; omit background shapes to avoid GPU offscreen layer issues
  if (variant === 'visualizer') {
    return null;
  }

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ─── Top-Left Geometric Angular Cluster (shown on Home) ─── */}
      <svg
        className="absolute top-0 left-0 w-[clamp(260px,28vw,460px)] h-auto opacity-95 pointer-events-none"
        viewBox="0 0 460 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Corner Yellow Wedge */}
        <polygon points="0,0 150,0 75,75 0,75" fill="#FFC107" />
        <polygon points="0,0 120,0 0,120" fill="#FFC107" />

        {/* Top Charcoal Polygon (45-degree angle slice) */}
        <polygon points="120,0 250,0 150,100 80,30" fill="#3F3F3F" />

        {/* Upper Left Large Charcoal Rhombus / Diamond */}
        <polygon points="0,70 140,210 0,350" fill="#3F3F3F" />

        {/* Lower Left Edge Yellow Triangular / Diamond Accents */}
        <polygon points="0,290 85,375 0,460" fill="#FFC107" />
      </svg>

      {/* ─── Bottom-Right Geometric Angular Cluster ─── */}
      <svg
        className="absolute bottom-0 right-0 w-[clamp(280px,30vw,480px)] h-auto opacity-95 pointer-events-none"
        viewBox="0 0 480 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Right Edge Yellow Diamond (rotated 45-deg) */}
        <polygon points="480,110 390,200 480,290" fill="#FFC107" />

        {/* Mid-Right Large Charcoal Diamond */}
        <polygon points="480,240 340,380 480,520" fill="#3F3F3F" />

        {/* Bottom Corner Accent Charcoal Diamond */}
        <polygon points="340,490 280,550 350,620 410,560" fill="#3F3F3F" />

        {/* Bottom Right Corner Yellow Wedge */}
        <polygon points="480,480 400,560 480,560" fill="#FFC107" />
        <polygon points="480,430 480,560 350,560" fill="#FFC107" />
      </svg>
    </div>
  );
};
