import { SpinningWheel } from "@/components/SpinningWheel";
import { getShopifyProduct } from "@/lib/product";

const VIMEO_ID = "1193786975";
const SS26_PRODUCT_ID = "gid://shopify/Product/8005607030886";

/**
 * Local fallback so the wheel is never empty if Shopify returns no
 * images. These mirror the SS26 page fallback set.
 */
const FALLBACK_IMAGES = [
  { url: "/nipase-100gbani.jpg", altText: "Nipase look one" },
  { url: "/nipase-100gbani-1.jpg", altText: "Nipase look two" },
  { url: "/nipase-100gbani-2.jpg", altText: "Nipase look three" },
  { url: "/nipase-100gbani-3.jpg", altText: "Nipase look four" },
  { url: "/nipase-dsc09849.jpg", altText: "Nipase look five" },
] as const;

export const revalidate = 60;

export default async function Home() {
  const product = await getShopifyProduct(SS26_PRODUCT_ID);
  const wheelImages =
    product?.images && product.images.length > 0 ? product.images : FALLBACK_IMAGES;

  return (
    <div className="flex min-h-screen w-full flex-col bg-white px-[60px] pt-[60px] pb-[45px] md:px-[238px]">

      {/* Video hero — viewport-centred, min 80px gap from fixed anchors */}
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

      {/* SS26 spinning wheel — access point to shop */}
      <SpinningWheel images={wheelImages} />
    </div>
  );
}
