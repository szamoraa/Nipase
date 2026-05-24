"use client";

import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

export function VimeoPlayer({ videoId }: { videoId: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const player = new Player(containerRef.current, {
      id: videoId,
      loop: true,
      autoplay: false,
      muted: false,
      controls: false,
    });
    playerRef.current = player;
    player.ready().then(() => { player.pause(); setReady(true); });
    player.on("play", () => setPlaying(true));
    player.on("pause", () => setPlaying(false));
    return () => { player.destroy(); };
  }, [videoId]);

  const toggle = () => {
    const p = playerRef.current;
    if (!p) return;
    playing ? p.pause() : p.play();
  };

  return (
    <div className="relative aspect-video w-full">
      <div ref={containerRef} className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full" />
      {ready && (
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <span className={`flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity duration-300 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}>
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="3.5" height="12" rx="1" />
                <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2.5l9 5.5-9 5.5V2.5z" />
              </svg>
            )}
          </span>
        </button>
      )}
    </div>
  );
}
