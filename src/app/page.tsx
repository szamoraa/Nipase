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
    <div className="flex min-h-screen w-full flex-col bg-white px-6 pb-[45px] pt-10 md:px-[60px] md:pt-[60px]">
      <div className="flex flex-1 flex-col gap-12 md:flex-row md:items-stretch md:gap-0">
        {/* Left column: wordmark, tagline, nav pills, year */}
        <div className="flex flex-row items-start justify-between md:w-[178px] md:shrink-0 md:flex-col md:justify-between md:gap-[96px]">
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

          <p className="hidden font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:block">
            2026
          </p>
        </div>

        {/* Hero image — centred (both axes) in the space between the left column and the sunburst */}
        <div className="flex w-full md:min-w-0 md:flex-1 md:items-start md:justify-center md:px-[clamp(2rem,5vw,6rem)]">
          {/* 4:3 matches the 2880×2160 source; background=1 = autoplay+muted+loop+no-controls */}
          <div className="relative w-full overflow-hidden md:max-w-[946px]" style={{ aspectRatio: "4/3" }}>
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

        {/* Sunburst top-right (desktop) */}
        <Link
          href="/"
          aria-label="Nipase home"
          className="hidden w-[clamp(40px,3.5vw,54px)] shrink-0 self-start transition-opacity hover:opacity-70 md:block"
        >
          <Image src="/nipase-sunburst.svg" alt="" width={54} height={58} className="h-auto w-[54px]" />
        </Link>
      </div>

      {/* Year pinned to bottom-left on mobile */}
      <p className="mt-10 font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:hidden">
        2026
      </p>
    </div>
  );
}
