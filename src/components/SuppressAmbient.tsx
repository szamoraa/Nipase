"use client";

import { useEffect } from "react";
import { useAudio } from "@/context/AudioContext";

export function SuppressAmbient() {
  const audio = useAudio();

  useEffect(() => {
    audio?.pause();
    return () => { audio?.resume(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
