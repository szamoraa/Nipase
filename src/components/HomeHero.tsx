import fs from "node:fs";
import path from "node:path";

import Image from "next/image";

import { HeroVideo } from "@/components/HeroVideo";

export type HomeHeroProps = {
  /** Optional full-bleed image behind the video (e.g. texture). Omit file in public to skip. */
  heroSrc?: string;
};

const DEFAULT_HERO_SRC = "/hero-placeholder.jpg";

function isRemoteUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function publicFileExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\//, "");
  if (!relative || relative.includes("..")) {
    return false;
  }
  const absolutePath = path.join(process.cwd(), "public", relative);
  return fs.existsSync(absolutePath);
}

export function HomeHero({ heroSrc = DEFAULT_HERO_SRC }: HomeHeroProps) {
  const src = heroSrc || DEFAULT_HERO_SRC;
  const showImage = isRemoteUrl(src) || publicFileExists(src);

  return (
    <section
      className="relative min-h-screen w-full bg-white"
      aria-label="Nipase hero"
    >
      {showImage ? (
        <>
          <Image
            src={src}
            alt=""
            fill
            priority
            unoptimized={isRemoteUrl(src)}
            className="z-0 object-cover object-center"
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-black/10"
            aria-hidden
          />
        </>
      ) : null}

      {/* Centred in the visible area below the fixed nav */}
      <div
        className="absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        style={{ top: "calc(50vh + var(--nav-h, 132px) / 2)" }}
      >
        <h1 className="sr-only">Nipase</h1>
        <HeroVideo
          className="max-h-[57.5vh] max-w-[100vw] object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
    </section>
  );
}
