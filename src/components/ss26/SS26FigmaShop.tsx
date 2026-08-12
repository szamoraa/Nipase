"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { resolveGalleryImages } from "@/lib/ss26";
import { formatShopifyPrice, getOptionValue, type ShopifyProduct } from "@/lib/product";

/**
 * Shopify `Size` option values in display order, with their short labels.
 * Variants are matched on these values rather than by position — Shopify does
 * not guarantee variant ordering, and the RUSTIC BROWN colourway is in fact
 * stored out of size order.
 */
const SIZE_ORDER = ["Extra Small", "Small", "Medium", "Large", "Extra Large"] as const;
const SIZE_LABEL: Record<string, string> = {
  "Extra Small": "XS",
  Small: "S",
  Medium: "M",
  Large: "L",
  "Extra Large": "XL",
};

/**
 * Swatch colours for the Shopify colour option values. Shopify has no
 * colour-hex field on options, so these approximations of the garment dye are
 * maintained here — an unrecognised value still renders, as a neutral chip.
 */
const COLOUR_SWATCH: Record<string, string> = {
  "RUSTIC RED": "#A8412A",
  "RUSTIC BROWN": "#7C4A33",
};
const FALLBACK_SWATCH = "#c4c4c4";

/**
 * The option is currently named "Color" in Shopify Admin. We accept either
 * spelling so that renaming it to "Colour" in Admin — to match the copy on
 * this page — cannot silently break variant matching.
 */
function getColour(variant: Parameters<typeof getOptionValue>[0]) {
  return getOptionValue(variant, "Color") ?? getOptionValue(variant, "Colour");
}

const SIZE_CHART = [
  { size: "XS", back: "67cm",   arm: "62cm",   chest: "46cm", shoulder: "38cm" },
  { size: "S",  back: "70cm",   arm: "62.5cm", chest: "48cm", shoulder: "40cm" },
  { size: "M",  back: "73cm",   arm: "64cm",   chest: "52cm", shoulder: "43cm" },
  { size: "L",  back: "74.5cm", arm: "65cm",   chest: "53cm", shoulder: "44cm" },
  { size: "XL", back: "75cm",   arm: "67cm",   chest: "56cm", shoulder: "40cm" },
] as const;

type Props = { product: ShopifyProduct | null };

export function SS26FigmaShop({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [pickedColour, setPickedColour] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { addToCart } = useCart();

  const variants = product?.variants ?? [];

  // Colourways in Shopify order, de-duplicated. Empty when Shopify is absent,
  // which hides the picker rather than showing a single dead swatch.
  const colours = Array.from(
    new Set(
      variants
        .map(getColour)
        .filter((colour): colour is string => Boolean(colour))
    )
  );
  const activeColour = pickedColour ?? colours[0] ?? null;

  // Only offer sizes the store actually carries; fall back to the full run so
  // the layout still reads correctly before Shopify data arrives.
  const sizes = product
    ? SIZE_ORDER.filter((size) =>
        variants.some((variant) => getOptionValue(variant, "Size") === size)
      )
    : [...SIZE_ORDER];

  function findVariant(colour: string | null, size: string | null) {
    if (!size) return null;
    return (
      variants.find(
        (variant) =>
          getOptionValue(variant, "Size") === size &&
          (colour === null || getColour(variant) === colour)
      ) ?? null
    );
  }

  const selectedVariant = findVariant(activeColour, selectedSize);
  const isSoldOut = Boolean(selectedVariant && !selectedVariant.availableForSale);

  // Price is shown before a size is picked, so fall back to the colourway's
  // first variant. Every variant is currently the same price regardless.
  const priceVariant =
    selectedVariant ??
    variants.find((variant) => getColour(variant) === activeColour) ??
    variants[0] ??
    null;

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
    if (!selectedVariant || isSoldOut || status === "adding") return;
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
            : isSoldOut
              ? "SOLD OUT"
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
              {priceVariant && (
                <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light leading-normal text-black">
                  {formatShopifyPrice(priceVariant.price.amount, priceVariant.price.currencyCode)}
                </p>
              )}
              <p className="font-[family-name:var(--font-geist-mono)] w-full whitespace-pre-wrap text-[12px] font-normal leading-normal text-[#1a1d24] md:w-[305px]">
                {product?.description ?? ""}
              </p>
            </div>

            {/* COLOUR — hidden unless the store carries more than one colourway */}
            {colours.length > 1 && (
              <div className="flex flex-col gap-[20px] leading-normal">
                <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light text-[#808080]">
                  COLOUR
                </p>
                <div className="flex items-center gap-[14px]">
                  {colours.map((colour) => (
                    <button
                      key={colour}
                      type="button"
                      onClick={() => setPickedColour(colour)}
                      aria-label={colour}
                      aria-pressed={activeColour === colour}
                      title={colour}
                      style={{ backgroundColor: COLOUR_SWATCH[colour] ?? FALLBACK_SWATCH }}
                      className={`h-[18px] w-[18px] shrink-0 rounded-full transition-opacity ${
                        activeColour === colour
                          ? "ring-1 ring-black/70 ring-offset-2 ring-offset-white"
                          : "opacity-60 hover:opacity-100"
                      }`}
                    />
                  ))}
                  <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-light text-[#808080]">
                    {activeColour}
                  </span>
                </div>
              </div>
            )}

            {/* SIZE */}
            <div className="flex flex-col gap-[20px] leading-normal">
              <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light text-[#808080]">
                SIZE
              </p>
              <div className="flex items-center gap-[20px] whitespace-nowrap not-italic text-[16px] text-black md:gap-[35px]">
                {sizes.map((size) => {
                  // With no Shopify data there is nothing to mark unavailable.
                  const available = !product || Boolean(findVariant(activeColour, size)?.availableForSale);
                  const state = !available
                    ? "font-medium cursor-not-allowed line-through opacity-25"
                    : selectedSize === size
                      ? "font-semibold underline underline-offset-4"
                      : "font-medium opacity-40 hover:opacity-100";
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      disabled={!available}
                      aria-pressed={selectedSize === size}
                      className={`font-[family-name:var(--font-ojuju)] shrink-0 transition-opacity ${state}`}
                    >
                      {SIZE_LABEL[size] ?? size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant || isSoldOut || status === "adding"}
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
