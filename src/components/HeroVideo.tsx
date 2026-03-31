"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  className?: string;
  style?: React.CSSProperties;
};

export function HeroVideo({ className, style }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    void el.play().catch(() => {
      /* autoplay blocked — user gesture or browser policy */
    });
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label="Nipase"
    >
      {/* H.264 MP4 for browsers; ProRes .mov is a fallback (Safari / QuickTime) */}
      <source src="/nipase-full-colourburn-icon.mp4" type="video/mp4" />
      <source src="/nipase-full-colourburn-icon.mov" type="video/quicktime" />
    </video>
  );
}
