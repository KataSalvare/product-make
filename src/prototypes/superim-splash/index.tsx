/**
 * @name Splash Screen
 * @description SuperIM brand splash screen with smooth entrance animation
 * @mode axure
 * @skill /skills/axure-export-workflow/SKILL.md
 */

import React, { useEffect, useState } from 'react';
import '../../themes/equatorial-minimalism/globals.css';
import './style.css';

const Component: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Start animation sequence
    const phaseTimer = setTimeout(() => setAnimationPhase(1), 100);
    
    // Auto-transition after 2.5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => {
      clearTimeout(phaseTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) {
    return (
      <div className="h-full bg-[var(--surface)] flex items-center justify-center opacity-0 transition-opacity duration-500">
        {/* Transitioned out */}
      </div>
    );
  }

  return (
    <div className="h-full bg-[var(--surface)] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[var(--primary)]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[var(--secondary)]/3 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo container */}
        <div
          className={`transition-all duration-1000 ease-out ${
            animationPhase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <div className="w-24 h-24 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-ambient-lg mb-6">
            <span className="text-[var(--on-primary)] text-5xl font-bold font-[var(--font-headline)]">
              S
            </span>
          </div>
        </div>

        {/* Brand name */}
        <h1
          className={`text-headline-xl text-[var(--primary)] mb-3 transition-all duration-1000 delay-300 ease-out ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          SuperIM
        </h1>

        {/* Tagline */}
        <p
          className={`text-body-lg text-[var(--on-surface-variant)] tracking-wide transition-all duration-1000 delay-500 ease-out ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Connect. Share. Belong.
        </p>
      </div>

      {/* Loading indicator */}
      <div
        className={`absolute bottom-20 flex items-center gap-2 transition-all duration-1000 delay-700 ease-out ${
          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-[var(--secondary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Version info */}
      <div
        className={`absolute bottom-8 text-label-sm text-[var(--on-surface-variant)]/60 transition-all duration-1000 delay-1000 ease-out ${
          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Version 1.0
      </div>
    </div>
  );
};

export default Component;
