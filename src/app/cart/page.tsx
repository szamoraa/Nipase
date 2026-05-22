"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
}

export default function CartPage() {
  const { cart, itemCount, checkoutUrl, loading, removeFromCart } = useCart();
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  if (!cart || itemCount === 0) {
    return (
      <main className="flex-1 bg-white">
        <div className="flex min-h-screen flex-col items-center justify-center gap-[18px] px-[60px]">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light text-[#5b5b64]">
            Your bag is empty.
          </p>
          <Link
            href="/shop/ss26"
            className="inline-flex h-[28px] items-center justify-center rounded-[50px] bg-[#161920] px-[18px] font-[family-name:var(--font-geist-mono)] text-[12px] font-normal text-white transition-opacity hover:opacity-80"
          >
            Shop SS26
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white">
      {/* Page header — item count */}
      <div className="flex justify-center px-[60px] pt-[120px]">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light text-[#000002]">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Line items — centred column matching Figma width */}
      <div className="mx-auto mt-[60px] flex w-full max-w-[340px] flex-col gap-[60px] px-0 pb-[120px]">
        <ul className="flex flex-col gap-[50px]">
          {lines.map((line) => {
            const imgUrl =
              line.merchandise.product.images?.edges?.[0]?.node?.url ?? null;

            return (
              <li key={line.id} className="flex flex-col gap-[50px]">
                {/* Product image — 3:4 aspect, full column width */}
                {imgUrl && (
                  <div className="relative aspect-[699/932] w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={line.merchandise.product.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Product info */}
                <div className="flex flex-col gap-[18px]">
                  {/* Title row + QTY */}
                  <div className="flex items-center justify-between">
                    <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light leading-normal text-[#000002]">
                      {line.merchandise.product.title}
                    </p>
                    <p className="font-[family-name:var(--font-geist-mono)] text-[12px] font-light leading-normal text-[#000002]">
                      <span className="text-[#5b5b64]">QTY</span>
                      {` ${line.quantity}`}
                    </p>
                  </div>

                  {/* Variant + remove */}
                  <div className="flex items-center justify-between">
                    {line.merchandise.title !== "Default Title" && (
                      <p className="font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#5b5b64]">
                        {line.merchandise.title}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFromCart(line.id)}
                      disabled={loading}
                      aria-label={`Remove ${line.merchandise.product.title}`}
                      className="ml-auto shrink-0 font-[family-name:var(--font-geist-mono)] text-[12px] font-light leading-none text-[#000002] transition-opacity hover:opacity-50 disabled:opacity-30"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Total + Checkout */}
        <div className="flex items-center justify-between">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002]">
            {"Total  "}
            <span className="font-normal">
              {formatPrice(
                cart.cost.totalAmount.amount,
                cart.cost.totalAmount.currencyCode
              )}
            </span>
          </p>

          <a
            href={checkoutUrl!}
            className="inline-flex h-[28px] items-center justify-center rounded-[50px] bg-[#161920] px-[18px] font-[family-name:var(--font-geist-mono)] text-[12px] font-normal text-white transition-opacity hover:opacity-80"
          >
            Checkout
          </a>
        </div>
      </div>
    </main>
  );
}
