import React from 'react';

interface AurelleLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gold';
  showSubtitle?: boolean;
}

export const AurelleLogo: React.FC<AurelleLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'light',
  showSubtitle = true,
}) => {
  // Dimensions
  const monogramSizes = {
    sm: { w: 32, h: 32, text: 'text-lg', sub: 'text-[8px]' },
    md: { w: 42, h: 42, text: 'text-xl', sub: 'text-[9px]' },
    lg: { w: 56, h: 56, text: 'text-2xl', sub: 'text-[10px]' },
    xl: { w: 72, h: 72, text: 'text-3xl', sub: 'text-xs' },
  };

  const currentSize = monogramSizes[size];

  const colors = {
    light: {
      bg: '#162E25',
      primaryGold: '#C5A880',
      accentGold: '#E5D5B8',
      wordmark: '#FBF9F5',
      sub: '#C5A880',
      border: '#C5A880',
    },
    dark: {
      bg: '#FAF8F5',
      primaryGold: '#162E25',
      accentGold: '#C5A880',
      wordmark: '#162E25',
      sub: '#A88B65',
      border: '#162E25',
    },
    gold: {
      bg: '#0F221B',
      primaryGold: '#D4AF37',
      accentGold: '#F3E5AB',
      wordmark: '#D4AF37',
      sub: '#E5D5B8',
      border: '#D4AF37',
    },
  };

  const scheme = colors[variant];

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Bespoke A-U Interlocking Monogram SVG */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={currentSize.w}
          height={currentSize.h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          {/* Subtle outer architectural diamond/crest */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="24"
            fill={scheme.bg}
            stroke={scheme.primaryGold}
            strokeWidth="2.5"
            strokeOpacity="0.85"
          />
          <circle
            cx="50"
            cy="50"
            r="41"
            stroke={scheme.primaryGold}
            strokeWidth="0.75"
            strokeDasharray="2 3"
            strokeOpacity="0.5"
          />

          {/* Letter 'A' Form (Serif Apex & Diagonals) */}
          <path
            d="M 50 18 L 32 76 M 50 18 L 68 76"
            stroke={scheme.primaryGold}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* A's Crossbar with luxury serifs */}
          <path
            d="M 38 56 L 62 56"
            stroke={scheme.accentGold}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* A's Base Serifs */}
          <path
            d="M 27 76 L 37 76 M 63 76 L 73 76"
            stroke={scheme.primaryGold}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* A's Apex Serif Finial */}
          <circle cx="50" cy="18" r="3.5" fill={scheme.accentGold} />

          {/* Interlocking 'U' Harmonized Inside & Below Crossbar */}
          <path
            d="M 40 40 V 62 C 40 73 60 73 60 62 V 40"
            stroke={scheme.accentGold}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* U's Top Bilateral Serifs */}
          <path
            d="M 36 40 H 44 M 56 40 H 64"
            stroke={scheme.accentGold}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography Wordmark & Subtitle */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif tracking-[0.22em] font-semibold uppercase leading-none transition-colors duration-300 ${currentSize.text}`}
          style={{ color: scheme.wordmark }}
        >
          Aurelle
        </span>
        {showSubtitle && (
          <span
            className={`font-sans font-medium tracking-[0.28em] uppercase leading-tight mt-1 transition-colors duration-300 ${currentSize.sub}`}
            style={{ color: scheme.sub }}
          >
            Unisex Salon &amp; Studio
          </span>
        )}
      </div>
    </div>
  );
};
