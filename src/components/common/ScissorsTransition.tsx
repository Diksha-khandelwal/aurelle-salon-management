import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScissorsTransitionProps {
  children: React.ReactNode;
}

export const ScissorsTransition: React.FC<ScissorsTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [outgoingLocation, setOutgoingLocation] = useState<typeof location | null>(null);
  const lastLocationRef = useRef(location);
  const scrollOffsetRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  // Check user preference for reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Only animate when pathname changes to a genuinely DIFFERENT route
    if (lastLocationRef.current.pathname !== location.pathname) {
      if (prefersReducedMotion) {
        lastLocationRef.current = location;
        return;
      }

      // Capture scroll offset and freeze the outgoing route location
      scrollOffsetRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
      setOutgoingLocation(lastLocationRef.current);
      lastLocationRef.current = location;
      setIsTransitioning(true);

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Full cutting and parting transition duration: 2050ms
      timeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        setOutgoingLocation(null);
      }, 2050);
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [location, prefersReducedMotion]);

  return (
    <div className="relative w-full min-h-screen">
      {/* =========================================================================
          LAYER 1 — INCOMING PAGE (MOUNTED UNDERNEATH)
          Already rendered and ready behind the outgoing page. Revealed through the cut.
          ========================================================================= */}
      <div className="w-full min-h-screen">
        {children}
      </div>

      {/* =========================================================================
          LAYER 2 — OUTGOING PAGE (DIVIDED INTO TOP & BOTTOM HALVES)
          Physical sheet of paper simulation: the existing page is divided horizontally
          along y = 50%, and the two sections physically separate as the scissors cut.
          ========================================================================= */}
      {isTransitioning && outgoingLocation && !prefersReducedMotion && (
        <div
          className="fixed inset-0 z-40 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Top Half Section: lifts & tilts upward as the cut proceeds */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 50.1%, 0% 50.1%)',
              animation: 'cutTopHalfSeparate 2050ms cubic-bezier(0.35, 0, 0.25, 1) forwards',
              filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.38))',
            }}
          >
            <div
              className="w-full min-h-screen bg-[#FBF9F5]"
              style={{
                transform: `translateY(-${scrollOffsetRef.current}px)`,
              }}
            >
              <div className={outgoingLocation.pathname !== '/' && outgoingLocation.pathname !== '/display' ? 'pt-24 sm:pt-28' : ''}>
                {React.cloneElement(children as React.ReactElement<any>, { location: outgoingLocation })}
              </div>
            </div>
          </div>

          {/* Bottom Half Section: drops & tilts downward as the cut proceeds */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
            style={{
              clipPath: 'polygon(0% 49.9%, 100% 49.9%, 100% 100%, 0% 100%)',
              animation: 'cutBottomHalfSeparate 2050ms cubic-bezier(0.35, 0, 0.25, 1) forwards',
              filter: 'drop-shadow(0 -10px 24px rgba(0,0,0,0.38))',
            }}
          >
            <div
              className="w-full min-h-screen bg-[#FBF9F5]"
              style={{
                transform: `translateY(-${scrollOffsetRef.current}px)`,
              }}
            >
              <div className={outgoingLocation.pathname !== '/' && outgoingLocation.pathname !== '/display' ? 'pt-24 sm:pt-28' : ''}>
                {React.cloneElement(children as React.ReactElement<any>, { location: outgoingLocation })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          LAYER 3 — REALISTIC JAPANESE SALON SHEARS TRAVERSING THE CUT LINE
          Pivots at center, glides horizontally across y = 50%, opening and closing
          blades in 5 synchronized, crisp cutting strokes.
          ========================================================================= */}
      {isTransitioning && !prefersReducedMotion && (
        <div
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Scissors Horizontal Glide Along Page Centerline */}
          <div
            className="absolute top-1/2 will-change-transform filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
            style={{
              animation: 'scissorsTravelCut 2050ms cubic-bezier(0.35, 0, 0.25, 1) forwards',
            }}
          >
            <div className="relative w-64 h-32 sm:w-80 sm:h-40 -ml-40 -mt-16 sm:-mt-20">
              <svg
                viewBox="0 0 340 160"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* High-Specular Champagne Gold Gradient */}
                  <linearGradient id="aurelleGoldLuster" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="20%" stopColor="#F7EEDD" />
                    <stop offset="45%" stopColor="#D9BF97" />
                    <stop offset="70%" stopColor="#B39265" />
                    <stop offset="100%" stopColor="#6E5535" />
                  </linearGradient>

                  {/* Convex Razor Bevel Edge */}
                  <linearGradient id="aurelleBevelEdge" x1="0%" y1="0%" x2="100%" y2="20%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="30%" stopColor="#ECE3D4" />
                    <stop offset="60%" stopColor="#C5A880" />
                    <stop offset="100%" stopColor="#7A5E3A" />
                  </linearGradient>

                  {/* Blade Core Shading */}
                  <linearGradient id="aurelleBladeCore" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor="#9C7E54" />
                    <stop offset="40%" stopColor="#DBC29E" />
                    <stop offset="80%" stopColor="#F4ECE1" />
                    <stop offset="100%" stopColor="#FFFFFF" />
                  </linearGradient>

                  {/* Tension Dial Jewel Gradient */}
                  <radialGradient id="aurellePivotJewel" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#529B77" />
                    <stop offset="40%" stopColor="#162E25" />
                    <stop offset="90%" stopColor="#0B1713" />
                    <stop offset="100%" stopColor="#050B08" />
                  </radialGradient>
                </defs>

                {/* ========================================================
                    UPPER BLADE & FINGER RING (PIVOTS AT 130, 80)
                    ======================================================== */}
                <g
                  style={{
                    transformOrigin: '130px 80px',
                    animation: 'shearsBladeUpperCut 2050ms cubic-bezier(0.35, 0, 0.25, 1) forwards',
                  }}
                >
                  {/* Upper Blade Convex Spine & Bevel */}
                  <path
                    d="M 130 76 C 175 70 235 73 310 80 C 240 84 175 81 130 80 Z"
                    fill="url(#aurelleBladeCore)"
                  />
                  <path
                    d="M 130 76 C 175 69 240 71 310 80 C 255 77 185 75 130 76 Z"
                    fill="url(#aurelleBevelEdge)"
                  />

                  {/* Upper Handle Ergonomic Shank */}
                  <path
                    d="M 130 76 C 105 74 85 58 65 48 C 55 43 45 42 35 48"
                    stroke="url(#aurelleGoldLuster)"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Finger Ring Loop */}
                  <ellipse
                    cx="45"
                    cy="42"
                    rx="17"
                    ry="14"
                    stroke="url(#aurelleGoldLuster)"
                    strokeWidth="5"
                    fill="none"
                    transform="rotate(-15 45 42)"
                  />

                  {/* Ergonomic Pinky Rest / Tang */}
                  <path
                    d="M 31 36 C 22 30 14 26 8 16 C 6 12 10 10 13 13 C 18 19 25 24 33 28"
                    fill="url(#aurelleGoldLuster)"
                  />
                </g>

                {/* ========================================================
                    LOWER BLADE & THUMB RING (PIVOTS AT 130, 80)
                    ======================================================== */}
                <g
                  style={{
                    transformOrigin: '130px 80px',
                    animation: 'shearsBladeLowerCut 2050ms cubic-bezier(0.35, 0, 0.25, 1) forwards',
                  }}
                >
                  {/* Lower Blade Convex Spine & Bevel */}
                  <path
                    d="M 130 84 C 175 90 235 87 310 80 C 240 76 175 79 130 80 Z"
                    fill="url(#aurelleBladeCore)"
                  />
                  <path
                    d="M 130 84 C 175 91 240 89 310 80 C 255 83 185 85 130 84 Z"
                    fill="url(#aurelleBevelEdge)"
                  />

                  {/* Lower Handle Crane Offset Shank */}
                  <path
                    d="M 130 84 C 105 88 88 102 70 114 C 62 119 50 120 40 116"
                    stroke="url(#aurelleGoldLuster)"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Anatomical Thumb Ring Loop */}
                  <ellipse
                    cx="52"
                    cy="118"
                    rx="17"
                    ry="14"
                    stroke="url(#aurelleGoldLuster)"
                    strokeWidth="5"
                    fill="none"
                    transform="rotate(15 52 118)"
                  />

                  {/* Rubber Silencer Stopper */}
                  <circle cx="56" cy="80" r="3" fill="#1C1917" stroke="#8C704B" strokeWidth="1" />
                </g>

                {/* ========================================================
                    PIVOT TENSION SCREW WITH JEWELED CABOCHON
                    ======================================================== */}
                {/* Outer Knurled Gold Dial */}
                <circle cx="130" cy="80" r="10" fill="url(#aurelleGoldLuster)" stroke="#5A4526" strokeWidth="1.5" />
                {/* Inner Bezel Ring */}
                <circle cx="130" cy="80" r="7" fill="#8C704B" stroke="#F4ECE1" strokeWidth="1" />
                {/* Emerald Cabochon Jewel */}
                <circle cx="130" cy="80" r="4.5" fill="url(#aurellePivotJewel)" />
                {/* Diamond Specular Highlight */}
                <circle cx="128.5" cy="78.5" r="1.2" fill="#FFFFFF" opacity="0.95" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Synchronized Cut & Page Separation Keyframe Styles */}
      <style>{`
        /* Top Half: Remains flush initially, lifts & tilts upward as cut proceeds, then glides away */
        @keyframes cutTopHalfSeparate {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          22% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          55% {
            transform: translate3d(-1%, -38%, 0) rotate(-3.5deg);
            transform-origin: 95% 50%;
            opacity: 1;
          }
          82% {
            transform: translate3d(-2%, -85%, 0) rotate(-6deg);
            opacity: 0.95;
          }
          100% {
            transform: translate3d(-3%, -115%, 0) rotate(-8deg);
            opacity: 0;
          }
        }

        /* Bottom Half: Remains flush initially, drops & tilts downward as cut proceeds, then glides away */
        @keyframes cutBottomHalfSeparate {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          22% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
          }
          55% {
            transform: translate3d(-1%, 38%, 0) rotate(3.5deg);
            transform-origin: 95% 50%;
            opacity: 1;
          }
          82% {
            transform: translate3d(-2%, 85%, 0) rotate(6deg);
            opacity: 0.95;
          }
          100% {
            transform: translate3d(-3%, 115%, 0) rotate(8deg);
            opacity: 0;
          }
        }

        /* Scissors Travel Across Viewport */
        @keyframes scissorsTravelCut {
          0% {
            left: -18vw;
            transform: translateY(-50%) rotate(-3deg);
          }
          20% {
            left: 5vw;
            transform: translateY(-50%) rotate(0deg);
          }
          45% {
            left: 38vw;
            transform: translateY(-50%) rotate(1deg);
          }
          70% {
            left: 72vw;
            transform: translateY(-50%) rotate(-1deg);
          }
          88% {
            left: 98vw;
            transform: translateY(-50%) rotate(2deg);
          }
          100% {
            left: 120vw;
            transform: translateY(-50%) rotate(0deg);
          }
        }

        /* Upper blade rhythmic, elegant snips across the 2050ms cut */
        @keyframes shearsBladeUpperCut {
          0% {
            transform: rotate(-4deg);
          }
          15% {
            transform: rotate(-16deg);
          }
          28% {
            transform: rotate(1deg);
          }
          42% {
            transform: rotate(-15deg);
          }
          56% {
            transform: rotate(1deg);
          }
          70% {
            transform: rotate(-14deg);
          }
          84% {
            transform: rotate(1deg);
          }
          95% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        /* Lower blade rhythmic, elegant snips in exact counter-harmony */
        @keyframes shearsBladeLowerCut {
          0% {
            transform: rotate(4deg);
          }
          15% {
            transform: rotate(16deg);
          }
          28% {
            transform: rotate(-1deg);
          }
          42% {
            transform: rotate(15deg);
          }
          56% {
            transform: rotate(-1deg);
          }
          70% {
            transform: rotate(14deg);
          }
          84% {
            transform: rotate(-1deg);
          }
          95% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};
