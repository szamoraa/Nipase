import { SpinningWheel } from "@/components/SpinningWheel";
import { getSS26Product, resolveGalleryImages } from "@/lib/ss26";

const VIMEO_ID = "1193786975";

export const revalidate = 60;

export default async function Home() {
  const product = await getSS26Product();
  const wheelImages = resolveGalleryImages(product);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-[60px] pt-[60px] pb-[45px] md:px-[238px]">
      <div className="flex flex-1 items-start justify-center">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/3", maxWidth: "min(946px, max(200px, calc(100vw - 636px)))" }}
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

      <SpinningWheel images={wheelImages} />
    </div>
  );
}
