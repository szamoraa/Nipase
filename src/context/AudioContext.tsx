"use client";

import { createContext, useEffect, useRef } from "react";

const AudioCtx = createContext<null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const audio = new Audio("/nipase-ambient.m4a");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    function start() {
      if (started.current) return;
      started.current = true;
      audio.play().catch(() => {});
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    }

    document.addEventListener("click", start);
    document.addEventListener("touchstart", start, { passive: true });

    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
      audio.pause();
    };
  }, []);

  return <AudioCtx.Provider value={null}>{children}</AudioCtx.Provider>;
}
