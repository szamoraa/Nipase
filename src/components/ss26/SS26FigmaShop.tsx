"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/product";

/**
 * Size labels map positionally to Shopify variant order (index 0–4).
 * Shopify variant titles: "… / Extra Small", "… / Small", etc.
 * Keep this array in the same order as variants are set up in the store.
 */
const SIZES = ["XS", "S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];
const SIZE_INDEX: Record<Size, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4 };

/**
 * Local fallback gallery — only used if Shopify returns zero images
 * (e.g. during an outage). Production photos are managed in Shopify
 * Admin → Products → Media and pulled via the Storefront API.
 */
const FALLBACK_GALLERY = [
  { url: "/nipase-100gbani.jpg", altText: "look one" },
  { url: "/nipase-100gbani-1.jpg", altText: "look two" },
  { url: "/nipase-100gbani-2.jpg", altText: "look three" },
  { url: "/nipase-100gbani-3.jpg", altText: "look four" },
  { url: "/nipase-dsc09849.jpg", altText: "look five" },
] as const;

type Props = { product: ShopifyProduct | null };

export function SS26FigmaShop({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error">("idle");
  const { addToCart } = useCart();

  // Resolve to the variant that matches the selected size by position.
  const selectedVariant =
    product && selectedSize
      ? (product.variants[SIZE_INDEX[selectedSize]] ?? product.variants[0] ?? null)
      : (product?.variants[0] ?? null);

  // For availability display purposes (price shown before size selection).
  const firstVariant = product?.variants[0] ?? null;

  const gallery =
    product?.images && product.images.length > 0
      ? product.images.map((img, i) => ({
          url: img.url,
          altText: img.altText ?? `${product.title} — look ${i + 1}`,
        }))
      : FALLBACK_GALLERY;

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
    <div className="flex min-h-screen items-start gap-[60px] pl-[238px] pr-[60px] pt-[60px] pb-[60px]">

      {/* ── Images column — tall images stacked vertically, capped at Figma size ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-[30px] max-w-[489px]">
        {gallery.map(({ url, altText }) => (
          <div key={url} className="relative aspect-[3/4] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={altText}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* ── Product info column — sticky, 343 px wide ── */}
      <div className="sticky top-[60px] flex max-h-[calc(100vh-120px)] w-[343px] shrink-0 flex-col gap-[117px] overflow-y-auto overscroll-contain py-[120px]">

        {/* Upper block: title → price → description → size → CTA */}
        <div className="flex flex-col gap-[18px]">
          <p className="font-[family-name:var(--font-ojuju)] text-[20px] font-medium not-italic leading-normal text-black">
            {product?.title ?? "Yoruba Linen Shirt"}
          </p>

          <div className="flex flex-col gap-[41px]">
            {/* Price + description */}
            <div className="flex flex-col gap-[83px]">
              {firstVariant && (
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light leading-normal text-black">
                  {formatShopifyPrice(firstVariant.price.amount, firstVariant.price.currencyCode)}
                </p>
              )}
              <p className="font-[family-name:var(--font-geist-mono)] w-full whitespace-pre-wrap text-[14px] font-light leading-normal text-[#1a1d24]">
                {product?.description ?? ""}
              </p>
            </div>

            {/* SIZE */}
            <div className="flex flex-col gap-[20px] leading-normal">
              <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                SIZE
              </p>
              <div className="flex items-center gap-[35px] whitespace-nowrap not-italic text-[20px] text-black">
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

        {/* Lower block: materials + care */}
        <div className="flex flex-col gap-[50px] font-[family-name:var(--font-geist-mono)] text-[14px] font-light leading-normal text-black">
          <div className="flex flex-col gap-[10px]">
            <p>100% linen</p>
            <p>Azo-free dyes</p>
          </div>
          <div className="flex flex-col gap-[10px]">
            <p>Wash cold</p>
            <p>Lay flat to dry</p>
            <p>Iron damp</p>
          </div>
        </div>
      </div>

      {/* ── Right filmstrip — small thumbnails mirror the main column order ── */}
      {/* Offset matches sunburst height (58px) + gap (201px) + top inset (60px) */}
      <div className="sticky top-[319px] flex w-[47px] shrink-0 flex-col gap-[16px] self-start">
        {gallery.map(({ url, altText }, i) => (
          <div key={url} className="relative aspect-[3/4] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={altText ?? `thumbnail ${i + 1}`}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
