"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

function formatPrice(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}

export default function CartPage() {
  const { cart, itemCount, checkoutUrl, loading, removeFromCart } = useCart();
  const lines = cart?.lines.edges.map((e) => e.node) ?? [];

  if (!cart || itemCount === 0) {
    return (
      <main className="flex-1 bg-white px-[68px] pt-[200px] pb-[60px]">
        <h1 className="text-xs uppercase tracking-[0.28em] text-[#808080]">Your bag</h1>
        <p className="mt-16 font-[family-name:var(--font-ojuju)] text-[32px] font-medium text-black">
          Your bag is empty.
        </p>
        <Link
          href="/shop/ss26"
          className="mt-8 inline-block font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080] underline underline-offset-4 hover:text-black"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-white px-[68px] pt-[200px] pb-[60px]">
      <h1 className="text-xs uppercase tracking-[0.28em] text-[#808080]">Your bag</h1>

      <div className="mt-16 flex items-start gap-[60px]">
        {/* Line items */}
        <ul className="min-w-0 flex-1 divide-y divide-[#e5e5e5]">
          {lines.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-10 py-8">
              <div className="flex flex-col gap-[10px]">
                <p className="font-[family-name:var(--font-ojuju)] text-[18px] font-medium leading-normal text-black">
                  {line.merchandise.product.title}
                </p>
                {line.merchandise.title !== "Default Title" && (
                  <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                    {line.merchandise.title}
                  </p>
                )}
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                  Qty {line.quantity}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-4">
                <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-black">
                  {formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
                </p>
                <button
                  onClick={() => removeFromCart(line.id)}
                  disabled={loading}
                  className="font-[family-name:var(--font-geist-mono)] text-[13px] font-light text-[#808080] underline-offset-4 hover:underline disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary — sticky */}
        <div className="sticky top-[132px] flex w-full max-w-[335px] shrink-0 flex-col gap-[40px]">
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center justify-between">
              <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-[#808080]">
                Total
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] text-[14px] font-light text-black">
                {formatPrice(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
              </p>
            </div>
            <div className="h-px bg-[#e5e5e5]" />
          </div>

          <a
            href={checkoutUrl!}
            className="flex w-full items-center justify-center bg-[#161920] px-[17px] py-[10px] font-[family-name:var(--font-ojuju)] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Checkout
          </a>

          <Link
            href="/shop/ss26"
            className="text-center font-[family-name:var(--font-geist-mono)] text-[13px] font-light text-[#808080] underline-offset-4 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
