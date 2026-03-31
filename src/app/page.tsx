import { HomeHero } from "@/components/HomeHero";

/** Swap this path/URL for the final hero image or wire a video component later—layout stays in `HomeHero`. */
const HERO_MEDIA_SRC = "/hero-placeholder.jpg";

export default function Home() {
  return (
    <div className="min-h-0 flex-1 bg-white">
      <HomeHero heroSrc={HERO_MEDIA_SRC} />
      <p className="relative z-10 mx-auto mt-[180px] max-w-prose text-center text-xs uppercase tracking-[0.3em] text-[#555]">
        SS26
      </p>
    </div>
  );
}
