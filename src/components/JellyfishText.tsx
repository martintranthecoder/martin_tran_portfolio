"use client";

import { useState } from "react";

export default function JellyfishText() {
  const [isFloating, setIsFloating] = useState(false);

  const handleHover = () => {
    if (isFloating) return;
    setIsFloating(true);

    // Reset after animation completes
    setTimeout(() => {
      setIsFloating(false);
    }, 1900);
  };

  return (
    <span
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleHover}
    >
      {/* Floating jellyfish */}
      {isFloating && (
        <span
          className="absolute left-1/2 -translate-x-1/2 text-2xl animate-float-away pointer-events-none"
        >
          🪼
        </span>
      )}

      {/* Text */}
      <span
        className={`font-medium text-blue-400 transition-opacity duration-300 ${
          isFloating ? "opacity-0" : "opacity-100"
        }`}
        style={{
          textShadow: "0 0 8px rgba(96, 165, 250, 0.6), 0 0 16px rgba(96, 165, 250, 0.4), 0 0 24px rgba(96, 165, 250, 0.2)",
        }}
      >
        jellyfish
      </span>
    </span>
  );
}
