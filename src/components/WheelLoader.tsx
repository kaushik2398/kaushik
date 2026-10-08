import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';

interface WheelLoaderProps {
  size?: number;
  label?: string;
  subtext?: string;
}

export const WheelLoader: React.FC<WheelLoaderProps> = ({
  size = 72,
  label,
  subtext,
}) => {
  const wheelRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!wheelRef.current) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const anim = animate(wheelRef.current, {
      rotate: '360deg',
      duration: 2200,
      ease: 'linear',
      loop: true,
    });

    return () => {
      anim.pause();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none" role="status" aria-live="polite">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Glow ambient circle */}
        <div 
          className="absolute inset-0 rounded-full bg-lime-400/10 blur-md pointer-events-none" 
          style={{ width: size, height: size }}
        />

        {/* Wheel SVG */}
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox="0 0 100 100"
          className="will-change-transform drop-shadow-md"
          aria-hidden="true"
        >
          {/* Outer Tire */}
          <circle cx="50" cy="50" r="47" fill="#0A0F1D" stroke="#1E293B" strokeWidth="4" />
          
          {/* Tire Tread Notches */}
          <circle cx="50" cy="50" r="44" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3, 4" opacity="0.6" />

          {/* Alloy Rim Barrel */}
          <circle cx="50" cy="50" r="40" fill="#0F172A" stroke="#475569" strokeWidth="2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#64748B" strokeWidth="0.8" opacity="0.5" />

          {/* 5-Spoke Alloy Design */}
          <g stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round">
            {/* Spoke 1 */}
            <line x1="50" y1="50" x2="50" y2="15" />
            {/* Spoke 2 */}
            <line x1="50" y1="50" x2="83.3" y2="39.2" />
            {/* Spoke 3 */}
            <line x1="50" y1="50" x2="70.6" y2="78.3" />
            {/* Spoke 4 */}
            <line x1="50" y1="50" x2="29.4" y2="78.3" />
            {/* Spoke 5 */}
            <line x1="50" y1="50" x2="16.7" y2="39.2" />
          </g>

          {/* Bolt Circle Screws */}
          <circle cx="50" cy="30" r="1.5" fill="#CBD5E1" />
          <circle cx="69" cy="44" r="1.5" fill="#CBD5E1" />
          <circle cx="62" cy="67" r="1.5" fill="#CBD5E1" />
          <circle cx="38" cy="67" r="1.5" fill="#CBD5E1" />
          <circle cx="31" cy="44" r="1.5" fill="#CBD5E1" />

          {/* Center Hub Outer Ring */}
          <circle cx="50" cy="50" r="15" fill="#0B132B" stroke="#CBD5E1" strokeWidth="1.5" />
          
          {/* Roundel Motif - 4 Quadrants (Blue & White segmented center badge) */}
          <g>
            {/* Top-Right Quadrant: Deep Sky Blue */}
            <path d="M 50 50 L 50 36 A 14 14 0 0 1 64 50 Z" fill="#0284C7" />
            {/* Bottom-Right Quadrant: Crisp Ivory White */}
            <path d="M 50 50 L 64 50 A 14 14 0 0 1 50 64 Z" fill="#F8FAFC" />
            {/* Bottom-Left Quadrant: Deep Sky Blue */}
            <path d="M 50 50 L 50 64 A 14 14 0 0 1 36 50 Z" fill="#0284C7" />
            {/* Top-Left Quadrant: Crisp Ivory White */}
            <path d="M 50 50 L 36 50 A 14 14 0 0 1 50 36 Z" fill="#F8FAFC" />
          </g>

          {/* Fine Cross divider & Center Cap Pin */}
          <line x1="36" y1="50" x2="64" y2="50" stroke="#0F172A" strokeWidth="0.8" />
          <line x1="50" y1="36" x2="50" y2="64" stroke="#0F172A" strokeWidth="0.8" />
          <circle cx="50" cy="50" r="2.2" fill="#0A0F1D" stroke="#E2E8F0" strokeWidth="0.8" />
        </svg>
      </div>

      {label && (
        <p className="mt-3 text-sm font-medium text-slate-200 tracking-wide">
          {label}
        </p>
      )}
      {subtext && (
        <p className="mt-0.5 text-xs text-slate-400">
          {subtext}
        </p>
      )}
    </div>
  );
};
