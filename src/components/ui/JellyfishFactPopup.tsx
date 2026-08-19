"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface JellyfishFactPopupProps {
  /** How long each popup stays on screen, in milliseconds. Default: 2 minutes. */
  visibleDuration?: number;
  /** Time between the start of one popup and the next, in milliseconds. Default: 15 minutes. */
  interval?: number;
  /** Delay before the very first popup appears, in milliseconds. Default: 4 seconds. */
  initialDelay?: number;
  /** Fun facts to cycle through. */
  facts?: string[];
}

const DEFAULT_FACTS: string[] = [
  "Jellyfish have been drifting through the oceans for over 500 million years — older than dinosaurs and even trees.",
  "Jellyfish have no brain, no heart, and no bones. They're about 95% water.",
  "A group of jellyfish is called a smack, a bloom, or a swarm.",
  "The immortal jellyfish (Turritopsis dohrnii) can revert to its juvenile stage, effectively cheating death.",
  "The lion's mane jellyfish can have tentacles over 30 metres long — longer than a blue whale.",
  "Some jellyfish glow in the dark through bioluminescence to lure prey or startle predators.",
  "Box jellyfish have 24 eyes, and some can even see in full colour.",
  "Jellyfish sense the world through a nerve net spread across their whole body instead of a central brain.",
  "In 2007, a swarm of jellyfish wiped out an entire salmon farm off the coast of Ireland.",
  "Astronauts sent jellyfish to space in 1991 — the ones born in orbit struggled to cope with gravity back on Earth.",
];

/**
 * A glassy, iOS-style popup that surfaces a random jellyfish fun fact.
 *
 * The glass reacts to the cursor: it tilts in 3D toward the pointer and a soft
 * highlight tracks the mouse across the surface (inspired by Aceternity UI's 3D
 * Card and Magic UI's spotlight cards). Each popup lingers for `visibleDuration`,
 * disappears, and a fresh fact reappears `interval` after the previous one began.
 */
const JellyfishFactPopup: React.FC<JellyfishFactPopupProps> = ({
  visibleDuration = 2 * 60 * 1000,
  interval = 15 * 60 * 1000,
  initialDelay = 4 * 1000,
  facts = DEFAULT_FACTS,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light"; // default to dark styling pre-hydration

  const [fact, setFact] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const lastIndexRef = useRef<number>(-1);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const cardRef = useRef<HTMLDivElement>(null);

  // Cursor tracking (normalised -0.5..0.5 for tilt, and px for the highlight).
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);

  const rotateX = useSpring(useTransform(ny, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(nx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 18,
  });

  // The glare is a bright white bloom on dark glass, but on light glass a soft
  // ocean-blue tint reads far better than an invisible white highlight.
  const glareColor = isDark
    ? "rgba(255,255,255,0.45)"
    : "rgba(37,99,145,0.35)";
  const glare = useMotionTemplate`radial-gradient(180px circle at ${glareX}% ${glareY}%, ${glareColor}, transparent 65%)`;

  const pickFact = useCallback((): string => {
    if (facts.length === 0) return "";
    if (facts.length === 1) return facts[0];
    let idx = Math.floor(Math.random() * facts.length);
    // Avoid showing the same fact twice in a row.
    if (idx === lastIndexRef.current) {
      idx = (idx + 1) % facts.length;
    }
    lastIndexRef.current = idx;
    return facts[idx];
  }, [facts]);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      nx.set(px - 0.5);
      ny.set(py - 0.5);
      glareX.set(px * 100);
      glareY.set(py * 100);
    },
    [nx, ny, glareX, glareY],
  );

  const resetTilt = useCallback(() => {
    nx.set(0);
    ny.set(0);
    glareX.set(50);
    glareY.set(50);
  }, [nx, ny, glareX, glareY]);

  useEffect(() => {
    const show = () => {
      setFact(pickFact());
      setVisible(true);
      hideTimerRef.current = setTimeout(() => setVisible(false), visibleDuration);
    };

    const firstTimer = setTimeout(show, initialDelay);
    const cycle = setInterval(show, interval);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(cycle);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [initialDelay, interval, visibleDuration, pickFact]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-[16rem] sm:bottom-6 sm:right-6"
      style={{ perspective: 1000 }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetTilt}
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
              scale: 1,
              transition: {
                opacity: { duration: 0.4 },
                scale: { type: "spring", stiffness: 260, damping: 20 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.92, transition: { duration: 0.35 } }}
            whileHover={{ scale: 1.03 }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn(
              "pointer-events-auto group relative overflow-hidden rounded-2xl border p-3.5 shadow-2xl",
              "backdrop-blur-2xl backdrop-saturate-150",
              isDark
                ? "border-white/10 bg-white/10"
                : "border-sky-900/10 bg-white/40",
            )}
          >
            {/* Cursor-following highlight (glare) */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: glare }}
            />

            {/* Soft top highlight, iOS glass style */}
            <div
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
                isDark ? "via-white/70" : "via-white/90",
              )}
            />

            {/* Content sits slightly forward in 3D space */}
            <div style={{ transform: "translateZ(30px)" }}>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss jellyfish fact"
                className="absolute right-2 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-foreground/70 transition-colors hover:bg-white/40 hover:text-foreground"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L13 13M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <div className="flex items-start gap-2.5 pr-5">
                <motion.span
                  className="text-xl leading-none"
                  aria-hidden="true"
                  animate={{ y: [0, -4, 0], rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🪼
                </motion.span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-foreground/60">
                    Jellyfish fun fact
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                    {fact}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JellyfishFactPopup;
export type { JellyfishFactPopupProps };
