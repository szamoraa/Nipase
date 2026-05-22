import Link from "next/link";
import { getSS26Product, resolveGalleryImages } from "@/lib/ss26";

const VIMEO_ID = "1193786975";

export const revalidate = 60;

export default async function Home() {
  const product = await getSS26Product();
  const galleryImages = resolveGalleryImages(product);
  const stripImages = galleryImages.slice(0, 4);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-[20px] pt-[70px] pb-[80px] md:px-[60px] md:pt-[60px] md:pb-[45px] lg:px-[238px]">
      {/* Hero video — full width on mobile, constrained on desktop */}
      <div className="flex flex-1 items-start justify-center">
        <div
          className="relative w-full overflow-hidden md:[max-width:min(946px,max(200px,calc(100vw-636px)))]"
          style={{ aspectRatio: "4/3" }}
        >
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

      {/* Bottom image strip
          Mobile:  full width, images flex-1 to fill
          Desktop: fixed 316px centered */}
      <div className="flex w-full flex-col gap-[10px] md:w-[316px] md:self-center">
        <div className="flex w-full items-center justify-between font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002]">
          <p className="shrink-0">The Buba Overshirt</p>
          <Link
            href="/shop/ss26"
            className="whitespace-nowrap transition-opacity hover:opacity-70"
          >
            Shop SS26 now
          </Link>
        </div>
        <div className="flex h-[88px] gap-[12px] md:gap-[16px]">
          {stripImages.map(({ url, altText }, i) => (
            <Link
              key={i}
              href="/shop/ss26"
              className="relative h-[88px] min-w-0 flex-1 overflow-hidden transition-opacity hover:opacity-80 md:w-[67px] md:flex-none md:shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={altText ?? ""}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
