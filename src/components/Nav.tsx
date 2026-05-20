"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "SS26", href: "/shop/ss26" },
  { label: "STORY", href: "/story" },
  { label: "CART", href: "/cart" },
] as const;

/** Global fixed shell — renders on every page. */
export function Nav() {
  const { itemCount } = useCart();
  const pathname = usePathname() ?? "";
  const isHome = pathname === "/";

  return (
    <>
      {/* Left column — fixed top-left on all pages */}
      <div className="fixed left-[60px] top-[60px] z-50 flex w-[178px] flex-col gap-[96px]">
        <div className="flex flex-col gap-[60px]">
          <div className="flex flex-col gap-[60px]">
            <Link href="/" aria-label="Nipase home" className="block w-[54px] transition-opacity hover:opacity-70">
              <Image
                src="/nipase-wordmark.svg"
                alt="Nipase"
                width={54}
                height={16}
                priority
                className="h-auto w-[54px]"
              />
            </Link>
            {isHome && (
              <p className="w-[178px] font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002]">
                Centred on the richness of one&rsquo;s being.
              </p>
            )}
          </div>

          <nav aria-label="Primary" className="flex w-[64px] flex-col gap-[18px]">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex h-[28px] items-center justify-center rounded-[50px] bg-[#dcdcdc] px-[18px] py-[5px] text-[12px] font-medium leading-normal text-[#000002] transition-opacity hover:opacity-70"
              >
                {label === "CART" && itemCount > 0 ? `CART (${itemCount})` : label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sunburst — fixed top-right on all pages */}
      <Link
        href="/"
        aria-label="Nipase home"
        className="fixed right-[60px] top-[60px] z-50 block transition-opacity hover:opacity-70"
      >
        <Image src="/nipase-sunburst.svg" alt="" width={54} height={58} className="h-auto w-[clamp(40px,3.5vw,54px)]" />
      </Link>

      {/* Footer — fixed bottom-left on all pages */}
      <div className="fixed bottom-[60px] left-[60px] z-50 flex flex-col font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002]">
        <p>Made in India</p>
        <p className="mt-[10px]">Based in Canada</p>
        <p className="mt-[60px]">2026</p>
      </div>
    </>
  );
}
