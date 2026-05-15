import Image from "next/image";
import Link from "next/link";

import { HomeHero } from "@/components/HomeHero";

/** Swap this path/URL for the final hero image or wire a video component later—layout stays in `HomeHero`. */
const HERO_MEDIA_SRC = "/hero-placeholder.jpg";

const SS26_IMAGE_SRC = "/DSC09765-2.JPEG";
const SS26_IMAGE_WIDTH = 2000;
const SS26_IMAGE_HEIGHT = 1333;

export default function Home() {
  return (
    <div className="min-h-0 flex-1 bg-white pb-32 md:pb-40">
      <div className="relative min-h-screen">
        <HomeHero heroSrc={HERO_MEDIA_SRC} />
        <p className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-center text-xs uppercase tracking-[0.3em] text-[#555]">
          SS26
        </p>
      </div>
      <div className="relative z-10 mx-auto mt-10 w-full max-w-[39.2rem] px-6">
        <Link
          href="/shop/ss26"
          className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          <Image
            src={SS26_IMAGE_SRC}
            alt="Shop the SS26 collection"
            width={SS26_IMAGE_WIDTH}
            height={SS26_IMAGE_HEIGHT}
            className="h-auto w-full object-contain transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 640px) 100vw, 627px"
          />
        </Link>
        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/shop/ss26"
            className="text-xs uppercase tracking-[0.25em] text-[#1a1a1a] underline-offset-4 hover:underline"
          >
            Shop SS26
          </Link>
          <Link
            href="/cart"
            className="text-xs uppercase tracking-[0.25em] text-[#555] underline-offset-4 hover:underline"
          >
            View bag
          </Link>
        </div>
      </div>
    </div>
  );
}
