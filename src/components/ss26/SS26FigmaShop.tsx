"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { resolveGalleryImages } from "@/lib/ss26";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/product";

/**
 * Size labels map positionally to Shopify variant order (index 0–4).
 * Shopify variant titles: "… / Extra Small", "… / Small", etc.
 * Keep this array in the same order as variants are set up in the store.
 */
const SIZES = ["XS", "S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];
const SIZE_INDEX: Record<Size, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4 };

const SIZE_CHART = [
  { size: "XS", back: "67cm",   arm: "62cm",   chest: "46cm", shoulder: "38cm" },
  { size: "S",  back: "70cm",   arm: "62.5cm", chest: "48cm", shoulder: "40cm" },
  { size: "M",  back: "73cm",   arm: "64cm",   chest: "52cm", shoulder: "43cm" },
  { size: "L",  back: "74.5cm", arm: "65cm",   chest: "53cm", shoulder: "44cm" },
  { size: "XL", back: "75cm",   arm: "67cm",   chest: "56cm", shoulder: "40cm" },
] as const;

type Props = { product: ShopifyProduct | null };

export function SS26FigmaShop({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();

  // Resolve to the variant that matches the selected size by position.
  const selectedVariant =
    product && selectedSize
      ? (product.variants[SIZE_INDEX[selectedSize]] ?? product.variants[0] ?? null)
      : (product?.variants[0] ?? null);

  // For availability display purposes (price shown before size selection).
  const firstVariant = product?.variants[0] ?? null;

  const gallery = resolveGalleryImages(product);
  const galleryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const elements = galleryRefs.current.filter(Boolean) as HTMLDivElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = Number(mostVisible.target.getAttribute("data-index"));
        if (!Number.isNaN(index)) setActiveIndex(index);
      },
      { rootMargin: "-60px 0px -45% 0px", threshold: [0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [gallery.length]);

  function scrollToImage(index: number) {
    setActiveIndex(index);
    galleryRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleAddToCart() {
    if (!selectedVariant || !selectedSize || status === "adding") return;
    setStatus("adding");
    try {
      await addToCart(selectedVariant.id);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("[cart] addToCart failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  const ctaLabel =
    status === "adding"
      ? "ADDING…"
      : status === "added"
        ? "ADDED ✓"
        : status === "error"
          ? "TRY AGAIN"
          : !selectedSize
            ? "SELECT A SIZE"
            : "ADD TO CART";

  return (
    /*
     * Mobile:  flex-col, simple px-[20px] padding, pt clears the mobile nav bar
     * Desktop: flex-row, complex sidebar-aware padding, filmstrip on right
     */
    <div className="flex min-h-screen flex-col gap-[40px] px-[20px] pt-[80px] pb-[60px] md:flex-row md:items-start md:gap-[60px] md:pl-[238px] md:pr-[calc(60px+clamp(40px,3.5vw,54px)+30px)] md:pt-[60px] md:pb-[60px]">

      {/* ── Images column ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-[20px] md:gap-[30px] md:max-w-[489px]">
        {gallery.map(({ url, altText }, i) => (
          <div
            key={`${url}-${i}`}
            ref={(el) => {
              galleryRefs.current[i] = el;
            }}
            data-index={i}
            id={`gallery-image-${i}`}
            className="relative aspect-[3/4] w-full scroll-mt-[60px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={altText}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── Product info column
          Mobile:  full width, normal flow, minimal padding
          Desktop: sticky, 343px wide, large top/bottom padding ── */}
      <div className="flex w-full flex-col gap-[40px] md:sticky md:top-[60px] md:w-[343px] md:shrink-0 md:gap-[92px] md:py-[220px]">

        {/* Upper block: title → price → description → size → CTA */}
        <div className="flex flex-col gap-[18px]">
          <p className="font-[family-name:var(--font-ojuju)] text-[18px] font-medium not-italic leading-normal text-black">
            {product?.title ?? "Yoruba Linen Shirt"}
          </p>

          <div className="flex flex-col gap-[41px]">
            {/* Price + description */}
            <div className="flex flex-col gap-[40px] md:gap-[60px]">
              {firstVariant && (
                <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light leading-normal text-black">
                  {formatShopifyPrice(firstVariant.price.amount, firstVariant.price.currencyCode)}
                </p>
              )}
              <p className="font-[family-name:var(--font-geist-mono)] w-full whitespace-pre-wrap text-[12px] font-normal leading-normal text-[#1a1d24] md:w-[305px]">
                {product?.description ?? ""}
              </p>
            </div>

            {/* SIZE */}
            <div className="flex flex-col gap-[20px] leading-normal">
              <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light text-[#808080]">
                SIZE
              </p>
              <div className="flex items-center gap-[20px] whitespace-nowrap not-italic text-[16px] text-black md:gap-[35px]">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`font-[family-name:var(--font-ojuju)] shrink-0 transition-opacity ${
                      selectedSize === size
                        ? "font-semibold underline underline-offset-4"
                        : "font-medium opacity-40 hover:opacity-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!firstVariant || !selectedSize || status === "adding"}
              className={`self-start inline-flex items-center justify-center overflow-hidden rounded-[60px] px-[17px] py-[5px] font-[family-name:var(--font-ojuju)] text-[16px] font-medium not-italic whitespace-nowrap leading-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${status === "error" ? "bg-red-700" : "bg-[#161920]"}`}
            >
              {ctaLabel}
            </button>
          </div>
        </div>

        {/* Lower block: materials + care + size guide */}
        <div className="flex flex-col gap-[0px] font-[family-name:var(--font-geist-mono)] text-[12px] font-normal leading-normal text-[#1a1d24] w-full md:w-[305px]">
          <p>100% linen</p>
          <p>Azo-free dyes</p>
          <p className="mt-[1em]">Wash cold</p>
          <p>Lay flat to dry</p>
          <p>Iron damp</p>
          <button
            type="button"
            onClick={() => setShowSizeGuide(true)}
            className="mt-[20px] self-start font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light text-[#808080] transition-opacity hover:opacity-60"
          >
            Size Guide
          </button>
        </div>
      </div>

      {/* ── Size Guide modal ── */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-[2px]"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="relative mx-[20px] w-full max-w-[460px] bg-white p-[36px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-[28px] flex items-center justify-between">
              <p className="font-[family-name:var(--font-ojuju)] text-[14px] font-medium text-[#000002]">
                Size Guide
              </p>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                aria-label="Close size guide"
                className="font-[family-name:var(--font-geist-mono)] text-[18px] font-light leading-none text-[#808080] transition-opacity hover:opacity-60"
              >
                ×
              </button>
            </div>

            {/* Table */}
            <table className="w-full font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal">
              <thead>
                <tr>
                  {["Size", "Back", "Arm", "Chest", "Shoulder"].map((h) => (
                    <th key={h} className="pb-[12px] text-left font-light text-[#808080]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_CHART.map(({ size, back, arm, chest, shoulder }) => (
                  <tr key={size} className="border-t border-[#dcdcdc]">
                    <td className="py-[10px] text-[#000002]">{size}</td>
                    <td className="py-[10px] text-[#1a1d24]">{back}</td>
                    <td className="py-[10px] text-[#1a1d24]">{arm}</td>
                    <td className="py-[10px] text-[#1a1d24]">{chest}</td>
                    <td className="py-[10px] text-[#1a1d24]">{shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-[20px] font-[family-name:var(--font-geist-mono)] text-[10px] font-light text-[#808080]">
              All measurements in centimetres.
            </p>
          </div>
        </div>
      )}

      {/* ── Right filmstrip — desktop only, hidden on mobile ── */}
      <div
        className="fixed right-[60px] z-40 hidden flex-col gap-[16px] md:flex"
        style={{ top: "280px", width: "clamp(40px, 3.5vw, 54px)" }}
      >
        {gallery.map(({ url, altText }, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => scrollToImage(i)}
            aria-label={`View ${altText ?? `image ${i + 1}`}`}
            aria-current={activeIndex === i ? "true" : undefined}
            className={`relative aspect-[3/4] w-full overflow-hidden transition-opacity ${
              activeIndex === i ? "opacity-100" : "opacity-40 hover:opacity-70"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
