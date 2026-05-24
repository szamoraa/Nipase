"use client";

import { createContext, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

type AudioContextValue = { pause: () => void; resume: () => void };
const AudioCtx = createContext<AudioContextValue | null>(null);

export function useAudio() {
  return useContext(AudioCtx);
}

const SUPPRESS_PATHS = ["/about"];

/**
 * Single ambient-audio instance for the whole app. Module-level (not a ref) so
 * that StrictMode double-invokes and dev HMR reloads can never spawn duplicate
 * `Audio()` objects that keep looping with no reference to pause them.
 */
type AmbientState = { audio: HTMLAudioElement; started: boolean; suppressed: boolean };
let ambient: AmbientState | null = null;

function getAmbient(): AmbientState | null {
  if (typeof window === "undefined") return null;
  if (!ambient) {
    const audio = new Audio("/nipase-ambient.m4a");
    audio.loop = true;
    audio.volume = 0.35;
    ambient = { audio, started: false, suppressed: false };
  }
  return ambient;
}

function applyAmbient() {
  if (!ambient || !ambient.started) return;
  if (ambient.suppressed) {
    ambient.audio.pause();
  } else {
    ambient.audio.play().catch(() => {});
  }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const suppressed = SUPPRESS_PATHS.some((p) => pathname === p);

  // Start playback on the first user gesture (respecting current suppression).
  useEffect(() => {
    const a = getAmbient();
    if (!a) return;

    function start() {
      const cur = getAmbient();
      if (!cur || cur.started) return;
      cur.started = true;
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
      applyAmbient();
    }

    document.addEventListener("click", start);
    document.addEventListener("touchstart", start, { passive: true });
    return () => {
      document.removeEventListener("click", start);
      document.removeEventListener("touchstart", start);
    };
  }, []);

  // Pause on suppressed routes, resume elsewhere — runs on every route change.
  useEffect(() => {
    const a = getAmbient();
    if (!a) return;
    a.suppressed = suppressed;
    applyAmbient();
  }, [suppressed]);

  const value: AudioContextValue = {
    pause: () => { const a = getAmbient(); if (a) { a.audio.pause(); } },
    resume: () => { const a = getAmbient(); if (a && a.started) { a.audio.play().catch(() => {}); } },
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}
