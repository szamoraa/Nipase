import Image from "next/image";
import Link from "next/link";

/** Vimeo background-mode embed — autoplay, muted, looped, no controls. */
const VIMEO_ID = "1193786975";

const NAV_LINKS = [
  { label: "SS26", href: "/shop/ss26" },
  { label: "STORY", href: "/story" },
  { label: "CART", href: "/cart" },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-6 pb-[45px] pt-10 md:pt-[60px] md:px-[238px]">
      <div className="flex flex-1 flex-col gap-12 md:flex-row md:items-stretch md:gap-0">
        {/* Left column: wordmark, tagline, nav pills — fixed top-left on desktop */}
        <div className="flex flex-row items-start justify-between md:fixed md:left-[60px] md:top-[60px] md:z-50 md:w-[178px] md:flex-col md:justify-start md:gap-[96px]">
          <div className="flex flex-col gap-[60px]">
            <div className="flex flex-col gap-[60px]">
              <Link href="/" aria-label="Nipase home" className="block w-[54px] transition-opacity hover:opacity-70">
                <Image
                  src="/nipase-wordmark.svg"
                  alt="Nipase"
                  width={54}
                  height={16}
                  priority
                  className="h-auto w-[54px]"
                />
              </Link>
              <p className="w-[178px] max-w-full font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002]">
                Centred on the richness of one&rsquo;s being.
              </p>
            </div>

            <nav aria-label="Primary" className="flex w-[64px] flex-col gap-[18px]">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-[28px] items-center justify-center rounded-[50px] bg-[#dcdcdc] px-[18px] py-[5px] text-[12px] font-medium leading-normal text-[#000002] transition-opacity hover:opacity-70"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Sunburst sits top-right on mobile (no dedicated nav bar) */}
          <Link
            href="/"
            aria-label="Nipase home"
            className="block w-[44px] transition-opacity hover:opacity-70 md:hidden"
          >
            <Image src="/nipase-sunburst.svg" alt="" width={54} height={58} className="h-auto w-[44px]" />
          </Link>

        </div>

        {/* Hero image — centred (both axes) in the space between the left column and the sunburst */}
        <div className="flex w-full md:min-w-0 md:flex-1 md:items-start md:justify-center">
          {/* 4:3 matches the 2880×2160 source; background=1 = autoplay+muted+loop+no-controls */}
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4/3", maxWidth: "min(946px, calc(100vw - 636px))" }}>
            <iframe
              src={`https://player.vimeo.com/video/${VIMEO_ID}?background=1&quality=1080p&autopause=0&app_id=58479`}
              className="absolute -left-px -top-px h-[calc(100%+2px)] w-[calc(100%+2px)]"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title="Nipase hero"
            />
          </div>
        </div>

        {/* Sunburst top-right (desktop) — fixed to mirror the wordmark's 60px top-left anchor */}
        <Link
          href="/"
          aria-label="Nipase home"
          className="fixed right-[60px] top-[60px] z-50 hidden transition-opacity hover:opacity-70 md:block"
        >
          <Image src="/nipase-sunburst.svg" alt="" width={54} height={58} className="h-auto w-[clamp(40px,3.5vw,54px)]" />
        </Link>
      </div>

      {/* SS26 spinning wheel — access point to shop */}
      <div className="flex justify-center py-20 md:py-28">
        <Link href="/shop/ss26" aria-label="Shop SS26" className="group block outline-none">
          {/* Wheel container — rotates slowly */}
          <div
            className="relative"
            style={{
              width: "clamp(300px, 40vw, 640px)",
              height: "clamp(300px, 40vw, 640px)",
              animation: "spin-wheel 28s linear infinite",
              willChange: "transform",
            }}
          >
            {/* 4 arms at 0 / 45 / 90 / 135 degrees, each with a tile at both ends */}
            {[0, 45, 90, 135].map((angle) => (
              <div
                key={angle}
                className="absolute inset-0 flex items-center justify-between"
                style={{ transform: `rotate(${angle}deg)`, padding: "clamp(4px, 0.6vw, 8px)" }}
              >
                <div
                  className="shrink-0 overflow-hidden rounded-[clamp(14px,1.8vw,24px)] bg-[#000002] transition-opacity duration-500 group-hover:opacity-80"
                  style={{ width: "clamp(80px, 10vw, 130px)", height: "clamp(70px, 8.75vw, 113px)" }}
                />
                <div
                  className="shrink-0 overflow-hidden rounded-[clamp(14px,1.8vw,24px)] bg-[#000002] transition-opacity duration-500 group-hover:opacity-80"
                  style={{ width: "clamp(80px, 10vw, 130px)", height: "clamp(70px, 8.75vw, 113px)" }}
                />
              </div>
            ))}
          </div>
        </Link>
      </div>

      {/* © 2026 — mobile: inline at bottom of page */}
      <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:hidden">
        © 2026
      </p>

      {/* Footer block — fixed 60px from bottom-left, mirrors the wordmark's 60px top-left anchor */}
      <div className="fixed bottom-[60px] left-[60px] z-50 hidden flex-col font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:flex">
        <p>Made in India</p>
        <p className="mt-[10px]">Based in Canada</p>
        <p className="mt-[60px]">2026</p>
      </div>
    </div>
  );
}
