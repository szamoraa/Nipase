"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/product";

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
  wrapClass?: string;
}) {
  return (
    <div className={`${wrapClass} overflow-hidden ${aspectClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="pointer-events-none absolute max-w-none"
        style={{ width: crop.w, height: crop.h, left: crop.left, top: crop.top }}
      />
    </div>
  );
}

const SIZES = ["XS", "S", "M", "L", "XL"] as const;
type Size = (typeof SIZES)[number];

type Props = {
  product: ShopifyProduct | null;
};

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
    <div className="px-[68px] pt-[128px] pb-[60px]">
      <div className="-mt-[30px] flex items-start gap-[60px]">
        {/* Left — gallery */}
        <div className="flex min-w-0 flex-1 flex-col gap-[10.139px]">
          <div className="flex w-full items-start gap-[10.139px]">
            <CroppedImage
              src="/DSC09826.JPEG"
              alt={`${product?.title ?? "Product"} — look one`}
              aspectClass="aspect-[699/932]"
              crop={{ w: "235%", h: "117.5%", left: "-67.5%", top: "-12.93%" }}
            />
            <CroppedImage
              src="/DSC09979.JPEG"
              alt={`${product?.title ?? "Product"} — look two`}
              aspectClass="aspect-[884.25/1179]"
              crop={{ w: "254%", h: "127%", left: "-67.3%", top: "-24.11%" }}
            />
          </div>
          <CroppedImage
            src="/DSC09765-2.JPEG"
            alt={`${product?.title ?? "Product"} — wide`}
            aspectClass="aspect-[2000/1333]"
            wrapClass="relative w-full"
            crop={{ w: "100%", h: "100%", left: "0%", top: "0%" }}
          />
        </div>

        {/* Right — sticky product info */}
        <div className="sticky top-[132px] z-10 flex min-h-0 w-full max-w-[335px] shrink-0 flex-col items-start gap-[41px] self-start overflow-y-auto overscroll-y-contain max-h-[calc(100dvh-132px)]">
          <div className="flex w-[335px] flex-col gap-[40px]">
            <div className="flex w-full items-end justify-between leading-normal">
              <p className="font-[family-name:var(--font-ojuju)] shrink-0 whitespace-nowrap text-[18px] font-medium not-italic text-black">
                {product?.title ?? "—"}
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] w-[39px] shrink-0 text-right text-[16px] font-light text-[#808080]">
                SS26
              </p>
            </div>

            {variant && (
              <p className="font-[family-name:var(--font-geist-mono)] leading-normal text-[14px] font-light text-black">
                {formatShopifyPrice(variant.price.amount, variant.price.currencyCode)}
              </p>
            )}

            <p className="font-[family-name:var(--font-geist-mono)] w-[335px] whitespace-pre-wrap text-[14px] font-light leading-normal text-black">
              {product?.description ?? ""}
            </p>
          </div>

          <div className="flex w-[225px] flex-col items-start gap-[153px]">
            <div className="flex w-full flex-col gap-[60px]">
              {/* COLOUR */}
              <div className="flex w-full flex-col gap-[20px]">
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                  COLOUR
                </p>
                <div className="flex">
                  <button
                    type="button"
                    aria-label="Colour rust"
                    className="rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
                    style={{ backgroundColor: "#963927", width: 16, height: 16 }}
                  />
                </div>
              </div>

              {/* SIZE */}
              <div className="flex w-full flex-col gap-[20px] leading-normal">
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                  SIZE
                </p>
                <div className="flex w-full items-center gap-[35px] whitespace-nowrap not-italic text-[20px] text-black">
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
            </div>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!variant || !selectedSize || status === "adding"}
              className="-mt-[50px] inline-flex items-center justify-center overflow-hidden bg-[#161920] px-[17px] py-[5px] font-[family-name:var(--font-ojuju)] text-[16px] font-medium whitespace-nowrap not-italic text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
