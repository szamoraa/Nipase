"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function Nav() {
  const pathname = usePathname() ?? "";
  const { itemCount } = useCart();
  const showCenterLogo = pathname !== "/";
  /** SS26 shop uses its own dedicated header (`SS26Nav`) per Figma; bail out so we don't render two. */
  if (pathname.startsWith("/shop/ss26")) {
    return null;
  }

  /** Home renders its own editorial left-column header (wordmark + CART) per Figma. */
  if (pathname === "/") {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full ${pathname === "/cart" ? "" : "mix-blend-difference"}`}>
      <nav
        className="relative flex items-center justify-between px-[68px] py-[36px]"
        aria-label="Primary"
      >
        {showCenterLogo && (
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 block transition-opacity hover:opacity-70"
            style={{ isolation: "isolate" }}
            aria-label="Home"
          >
            <Image
              src="/agbalumo-logo.png"
              alt=""
              width={1081}
              height={1080}
              priority
              className="h-[60px] w-[60px] shrink-0 object-contain"
            />
          </Link>
        )}

        <Link
          href="/"
          className="block transition-opacity hover:opacity-70"
          style={{ isolation: "isolate" }}
        >
          <Image
            src="/agbalumo-wordmark.png"
            alt="Nipase"
            width={271}
            height={90}
            priority
            className="h-[36.885px] w-auto max-w-[82px] shrink-0 object-contain"
          />
        </Link>

        <ul className="flex items-center gap-[29px]">
          <li>
            <Link
              href="/cart"
              className="font-[family-name:var(--font-ojuju)] text-[16.533px] font-medium text-white no-underline transition-opacity hover:opacity-50"
            >
              CART{itemCount > 0 && ` (${itemCount})`}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
