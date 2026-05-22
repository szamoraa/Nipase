"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { label: "SS26", href: "/shop/ss26" },
  { label: "STORY", href: "/about" },
  { label: "CART", href: "/cart" },
] as const;

const NAV_PILL =
  "inline-flex h-[28px] shrink-0 items-center justify-center whitespace-nowrap rounded-[50px] bg-[#dcdcdc] font-[family-name:var(--font-ojuju)] text-[12px] font-medium leading-none text-[#000002]";

/** Global fixed shell — renders on every page. */
export function Nav() {
  const { itemCount } = useCart();
  const pathname = usePathname() ?? "";
  const isHome = pathname === "/";

  return (
    <>
      {/* Wordmark — top-left, closer on mobile */}
      <div className="fixed left-[20px] top-[20px] z-50 flex w-[178px] flex-col gap-[60px] md:left-[60px] md:top-[60px]">
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
        {/* Tagline — desktop only */}
        <p className={`hidden w-[178px] font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:block ${isHome ? "" : "md:invisible"}`}>
          Centred on the richness of one&rsquo;s being.
        </p>
      </div>

      {/* Nav pills
          Mobile:  horizontal row pinned bottom-left
          Desktop: vertical column pinned left, 280px from top */}
      <nav
        aria-label="Primary"
        className="fixed bottom-[20px] left-[20px] z-50 flex flex-row items-center gap-[10px] md:bottom-auto md:left-[60px] md:top-[280px] md:flex-col md:items-start md:gap-[18px]"
      >
        {NAV_LINKS.map(({ label, href }) => {
          if (label === "CART") {
            return (
              <Link
                key={label}
                href={href}
                aria-label={
                  itemCount > 0
                    ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
                    : "Cart"
                }
                className="inline-flex items-center gap-[6px] transition-opacity hover:opacity-70"
              >
                <span className={`${NAV_PILL} min-w-[64px] px-[18px] py-[5px]`}>CART</span>
                {itemCount > 0 && (
                  <span
                    className={`${NAV_PILL} min-w-[28px] px-[10px] py-[5px]`}
                    aria-hidden
                  >
                    {itemCount}
                  </span>
                )}
              </Link>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              className={`${NAV_PILL} min-w-[64px] px-[18px] py-[5px] transition-opacity hover:opacity-70`}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sunburst — top-right, closer on mobile */}
      <Link
        href="/"
        aria-label="Nipase home"
        className="fixed right-[20px] top-[20px] z-50 block transition-opacity hover:opacity-70 md:right-[60px] md:top-[60px]"
      >
        <Image
          src="/nipase-sunburst.svg"
          alt=""
          width={54}
          height={58}
          className="h-auto w-[32px] md:w-[clamp(40px,3.5vw,54px)]"
        />
      </Link>

      {/* Footer credits — desktop only */}
      <div className="fixed bottom-[60px] left-[60px] z-50 hidden flex-col font-[family-name:var(--font-geist-mono)] text-[11.93px] font-light leading-normal text-[#000002] md:flex">
        <p>Made in India</p>
        <p className="mt-[10px]">Based in Canada</p>
        <p className="mt-[60px]">2026</p>
      </div>
    </>
  );
}
