"use client";

import React, { useEffect, useRef } from 'react';

interface FloatingJellyfishProps {
  /** Milliseconds between each jellyfish spawn */
  spawnInterval?: number;
  /** Minimum animation duration in seconds */
  minDuration?: number;
  /** Maximum animation duration in seconds */
  maxDuration?: number;
  /** Minimum jellyfish size in pixels */
  minSize?: number;
  /** Maximum jellyfish size in pixels */
  maxSize?: number;
  /** Array of jellyfish image paths */
  jellyfishImages?: string[];
}

const FloatingJellyfish: React.FC<FloatingJellyfishProps> = ({ 
  spawnInterval = 2000,
  minDuration = 15,
  maxDuration = 25,
  minSize = 40,
  maxSize = 80,
  jellyfishImages = ['/img/jellyfish-blue.gif', '/img/jellyfish-red.gif']
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const random = (min: number, max: number): number => 
      Math.random() * (max - min) + min;

    const createJellyfish = (): void => {
      if (!containerRef.current) return;

      const jellyfish = document.createElement('img');
      jellyfish.src = jellyfishImages[Math.floor(Math.random() * jellyfishImages.length)];
      jellyfish.className = 'absolute opacity-0 pointer-events-none';
      jellyfish.style.cssText = `
        left: ${random(0, window.innerWidth - 100)}px;
        bottom: -100px;
        width: ${random(minSize, maxSize)}px;
        height: auto;
        animation: floatUp ${random(minDuration, maxDuration)}s linear forwards;
        filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        --drift: ${random(-50, 50)}px;
      `;

      containerRef.current.appendChild(jellyfish);

      setTimeout(() => jellyfish.remove(), maxDuration * 1000 + 2000);
    };

    // Initial spawn
    for (let i = 0; i < 3; i++) {
      setTimeout(createJellyfish, i * 1000);
    }

    const interval = setInterval(createJellyfish, spawnInterval);
    return () => clearInterval(interval);
  }, [spawnInterval, minDuration, maxDuration, minSize, maxSize, jellyfishImages]);

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-120vh) translateX(var(--drift)) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
      <div 
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      />
    </>
  );
};

export default FloatingJellyfish;
export type { FloatingJellyfishProps };