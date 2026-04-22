import Link from "next/link";

function CroppedImage({
  src,
  alt,
  aspectClass,
  crop,
  wrapClass = "relative min-w-0 flex-1 overflow-hidden",
}: {
  src: string;
  alt: string;
  aspectClass: string;
  crop: { w: string; h: string; left: string; top: string };
  /** Override the wrapper class — defaults to `flex-1` for portrait pair; pass `w-full` for wide landscape. */
  wrapClass?: string;
}) {
  return (
    <div className={`${wrapClass} overflow-hidden ${aspectClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="pointer-events-none absolute max-w-none"
        style={{
          width: crop.w,
          height: crop.h,
          left: crop.left,
          top: crop.top,
        }}
      />
    </div>
  );
}

export function SS26FigmaShop() {
  return (
    <div className="px-[68px] pt-[128px] pb-[60px]">
      <div className="-mt-[30px] flex items-start gap-[60px]">
        {/* Left — gallery: portrait pair + wide landscape */}
        <div className="flex min-w-0 flex-1 flex-col gap-[10.139px]">
          {/* Row 1: two portrait shots side by side */}
          <div className="flex w-full items-start gap-[10.139px]">
            <CroppedImage
              src="/DSC09826.JPEG"
              alt="Yoruba Linen Shirt — look one"
              aspectClass="aspect-[699/932]"
              crop={{ w: "235%", h: "117.5%", left: "-67.5%", top: "-12.93%" }}
            />
            <CroppedImage
              src="/DSC09979.JPEG"
              alt="Yoruba Linen Shirt — look two"
              aspectClass="aspect-[884.25/1179]"
              crop={{ w: "254%", h: "127%", left: "-67.3%", top: "-24.11%" }}
            />
          </div>
          {/* Row 2: wide landscape — spans the full column width */}
          <CroppedImage
            src="/DSC09765-2.JPEG"
            alt="Yoruba Linen Shirt — wide"
            aspectClass="aspect-[2000/1333]"
            wrapClass="relative w-full"
            crop={{ w: "100%", h: "100%", left: "0%", top: "0%" }}
          />
        </div>

        {/* Right — product info (sticky: scrolls with page until stuck; images on the left keep scrolling) */}
        {/* sticky top = SS26Nav height: py-[36px]×2 + h-[60px] logo = 132px */}
        <div className="sticky top-[132px] z-10 flex min-h-0 w-full max-w-[335px] shrink-0 flex-col items-start gap-[41px] self-start overflow-y-auto overscroll-y-contain max-h-[calc(100dvh-132px)]">
          {/* Top block: name · price · description (335px wide) */}
          <div className="flex w-[335px] flex-col gap-[40px]">
            <div className="flex w-full items-end justify-between leading-normal">
              <p className="font-[family-name:var(--font-ojuju)] shrink-0 whitespace-nowrap text-[18px] font-medium not-italic text-black">
                Yoruba Linen Shirt
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] w-[39px] shrink-0 text-right text-[16px] font-light text-[#808080]">
                SS26
              </p>
            </div>

            <p className="font-[family-name:var(--font-geist-mono)] leading-normal text-[14px] font-light text-black">
              $179.99 CAD
            </p>

            <p className="font-[family-name:var(--font-geist-mono)] w-[335px] whitespace-pre-wrap text-[14px] font-light leading-normal text-black">
              {`Slowly Made from 100% linen in a small town in India, this piece of garment can be worn as an overshirt all season or on its own during hot summer seasons.\n\nTaking inspiration from Yoruba styled pockets and the richness of garment construction in India. To achieve our summer colours this shirt is garment dyed in azo-free dyes.`}
            </p>
          </div>

          {/* Bottom block: colour · size · cta (225px wide) */}
          <div className="flex w-[225px] flex-col items-start gap-[153px]">
            <div className="flex w-full flex-col gap-[60px]">
              {/* COLOUR */}
              <div className="flex w-full flex-col gap-[20px]">
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                  COLOUR
                </p>
                <div className="flex h-[80px] w-[35px] flex-col items-start justify-between">
                  <button
                    type="button"
                    aria-label="Colour rust"
                    className="h-[35px] w-[35px] rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                    style={{ backgroundColor: "#963927" }}
                  />
                  <button
                    type="button"
                    aria-label="Colour dark brown"
                    className="h-[35px] w-[35px] rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                    style={{ backgroundColor: "#4B2620" }}
                  />
                </div>
              </div>

              {/* SIZE */}
              <div className="flex w-full flex-col gap-[20px] leading-normal">
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                  SIZE
                </p>
                <div className="flex w-full items-center gap-[35px] whitespace-nowrap not-italic text-[20px] text-black">
                  {(
                    [
                      ["XS", "font-medium"],
                      ["S", "font-medium"],
                      ["M", "font-semibold"],
                      ["L", "font-medium"],
                      ["XL", "font-medium"],
                    ] as const
                  ).map(([size, weight]) => (
                    <span
                      key={size}
                      className={`font-[family-name:var(--font-ojuju)] shrink-0 ${weight}`}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ADD TO CART */}
            <Link
              href="/cart"
              className="-mt-[50px] inline-flex items-center justify-center overflow-hidden bg-[#161920] px-[17px] py-[5px] font-[family-name:var(--font-ojuju)] text-[16px] font-medium whitespace-nowrap not-italic text-white transition-opacity hover:opacity-90"
            >
              ADD TO CART
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
