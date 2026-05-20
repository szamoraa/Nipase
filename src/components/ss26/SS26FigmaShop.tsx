"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/product";

const SIZES = ["XS", "S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

/** Two product images — stacked vertically in the main gallery column. */
const GALLERY = [
  {
    src: "/DSC09826.JPEG",
    alt: "look one",
    aspect: "aspect-[3/4]",
    crop: { w: "235%", h: "117.5%", left: "-67.5%", top: "-12.93%" },
  },
  {
    src: "/DSC09979.JPEG",
    alt: "look two",
    aspect: "aspect-[3/4]",
    crop: { w: "254%", h: "127%", left: "-67.3%", top: "-24.11%" },
  },
] as const;

type Props = { product: ShopifyProduct | null };

export function SS26FigmaShop({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const { addToCart } = useCart();

  const variant = product?.variants[0] ?? null;

  async function handleAddToCart() {
    if (!variant || !selectedSize || status === "adding") return;
    setStatus("adding");
    try {
      await addToCart(variant.id);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("idle");
    }
  }

  const ctaLabel =
    status === "adding"
      ? "ADDING…"
      : status === "added"
        ? "ADDED!"
        : !selectedSize
          ? "SELECT A SIZE"
          : "ADD TO CART";

  return (
    <div className="flex min-h-screen items-start gap-[60px] pl-[238px] pr-[60px] pt-[60px] pb-[60px]">

      {/* ── Images column — two tall images stacked vertically, capped at Figma size ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-[30px] max-w-[489px]">
        {GALLERY.map(({ src, alt, aspect, crop }) => (
          <div key={src} className={`relative w-full overflow-hidden ${aspect}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${product?.title ?? "Product"} — ${alt}`}
              className="pointer-events-none absolute max-w-none"
              style={{ width: crop.w, height: crop.h, left: crop.left, top: crop.top }}
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
              {variant && (
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light leading-normal text-black">
                  {formatShopifyPrice(variant.price.amount, variant.price.currencyCode)}
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
              disabled={!variant || !selectedSize || status === "adding"}
              className="self-start inline-flex items-center justify-center overflow-hidden rounded-[60px] bg-[#161920] px-[17px] py-[5px] font-[family-name:var(--font-ojuju)] text-[16px] font-medium not-italic whitespace-nowrap leading-normal text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* ── Right filmstrip — 4 small thumbnails, mirrors Figma right column ── */}
      {/* Offset matches sunburst height (58px) + gap (201px) + top inset (60px) */}
      <div className="sticky top-[319px] flex w-[47px] shrink-0 flex-col gap-[16px] self-start">
        {[...GALLERY, ...GALLERY].map(({ src, alt, aspect, crop }, i) => (
          <div key={i} className={`relative w-full overflow-hidden ${aspect}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${product?.title ?? "Product"} — thumbnail ${i + 1}`}
              className="pointer-events-none absolute max-w-none"
              style={{ width: crop.w, height: crop.h, left: crop.left, top: crop.top }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
