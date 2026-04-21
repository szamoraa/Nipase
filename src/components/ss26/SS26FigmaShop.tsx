import Image from "next/image";
import Link from "next/link";

import {
  SS26_FEATURED_SHOP,
  formatSS26PriceCAD,
} from "@/data/ss26-shop-featured";

function FeaturedImage({
  src,
  alt,
  aspectClass,
  crop,
}: {
  src: string;
  alt: string;
  aspectClass: string;
  crop: {
    widthPct: number;
    heightPct: number;
    leftPct: number;
    topPct: number;
  };
}) {
  return (
    <div
      className={`relative min-h-0 w-full overflow-hidden bg-neutral-100 sm:min-w-0 sm:flex-1 sm:basis-0 ${aspectClass}`}
    >
      {/*
        `fill` keeps the img inside the aspect-ratio box. Absolute positioning without `fill`
        removed the image from flex sizing and could collapse the frame to 0px height.
        `unoptimized` avoids Sharp failures on very large local JPEGs in dev / constrained envs.
      */}
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 45vw, 600px"
        className="max-w-none object-cover"
        style={{
          width: `${crop.widthPct}%`,
          height: `${crop.heightPct}%`,
          maxWidth: "none",
          left: `${crop.leftPct}%`,
          top: `${crop.topPct}%`,
          right: "auto",
          bottom: "auto",
        }}
      />
    </div>
  );
}

export function SS26FigmaShop() {
  const f = SS26_FEATURED_SHOP;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1920px] overflow-x-clip px-[68px] pb-20 pt-32 sm:pb-24 md:pb-28 lg:pb-32">
      {/*
        Figma: 128px below nav (pt-32), main row gap-[60px] — two images side-by-side,
        then a right column (335px story + 225px controls) with gap-[41px].
      */}
      <div className="flex w-full min-w-0 flex-col gap-12 lg:flex-row lg:gap-[60px] lg:items-start">
        <div className="order-2 flex min-w-0 w-full flex-1 flex-col gap-[10px] sm:flex-row lg:order-1">
          {f.images.map((img, i) => (
            <FeaturedImage
              key={img.src + i}
              src={img.src}
              alt={i === 0 ? `${f.name} — look one` : `${f.name} — look two`}
              aspectClass={img.aspectClass}
              crop={img.crop}
            />
          ))}
        </div>

        <div className="order-1 flex w-full min-w-0 shrink-0 flex-col gap-[41px] lg:order-2 lg:sticky lg:top-[96px] lg:z-10 lg:max-h-[calc(100dvh-96px)] lg:overflow-y-auto lg:overscroll-y-contain lg:pl-1">
          <div className="flex w-full max-w-[335px] flex-col gap-10 font-[family-name:var(--font-geist-mono)] text-sm font-light leading-normal text-black lg:gap-[40px]">
            <div className="flex w-full items-end justify-between gap-4 leading-normal">
              <h1 className="font-[family-name:var(--font-ojuju)] text-lg font-medium text-black">
                {f.name}
              </h1>
              <p className="w-10 shrink-0 text-right text-base font-light text-[#808080]">
                {f.seasonCode}
              </p>
            </div>
            <p className="text-sm font-light text-black">
              {formatSS26PriceCAD(f.priceCents)}
            </p>
            <div className="w-full max-w-[335px] whitespace-pre-wrap">
              {f.description.map((para, i) => (
                <p key={i} className={i > 0 ? "mt-6" : undefined}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="flex w-full max-w-[225px] flex-col gap-[153px]">
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col gap-5">
                <p className="font-[family-name:var(--font-geist-mono)] text-sm font-light text-[#808080]">
                  COLOUR
                </p>
                <div
                  className="flex flex-col gap-3"
                  role="list"
                  aria-label="Colour options"
                >
                  {f.colours.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="listitem"
                      className="flex h-14 w-14 rounded-full border border-black/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                      style={{ backgroundColor: c.hex }}
                      aria-label={`Colour ${c.id}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-5 leading-normal">
                <p className="font-[family-name:var(--font-geist-mono)] text-sm font-light text-[#808080]">
                  SIZE
                </p>
                <div
                  className="flex flex-wrap items-center gap-x-[35px] gap-y-2 text-xl text-black"
                  role="group"
                  aria-label="Sizes"
                >
                  {f.sizes.map((size) => (
                    <span
                      key={size}
                      className={`font-[family-name:var(--font-ojuju)] whitespace-nowrap ${
                        size === f.defaultSize
                          ? "font-semibold"
                          : "font-medium"
                      }`}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/cart"
              className="inline-flex w-full max-w-[280px] items-center justify-center bg-[#161920] px-[17px] py-[5px] font-[family-name:var(--font-ojuju)] text-base font-medium text-white transition-opacity hover:opacity-90"
            >
              ADD TO CART
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-16 text-center font-[family-name:var(--font-geist-mono)] text-xs text-[#555] sm:mt-20">
        <Link
          href="/"
          className="uppercase tracking-[0.2em] text-[#1a1a1a] underline-offset-4 transition-opacity hover:opacity-60 hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
