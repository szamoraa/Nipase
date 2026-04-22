import Image from "next/image";
import Link from "next/link";

/**
 * SS26 shop header — matches Figma PDP (node 47:4):
 * wordmark (82×36.885) · center Agbalumo mark (60×60) · ABOUT / CART (Ojuju Medium 16.533px, gap 29px).
 * Static (not fixed) so the 128px gap to page content is just natural flow.
 */
export function SS26Nav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <nav
        className="flex w-full items-center justify-between px-[68px] py-[36px]"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="block shrink-0 transition-opacity hover:opacity-70"
        >
          <Image
            src="/agbalumo-wordmark.png"
            alt="Nipase"
            width={271}
            height={90}
            priority
            className="h-[36.885px] w-[82px] shrink-0 object-contain"
          />
        </Link>

        <Link
          href="/"
          className="block shrink-0 transition-opacity hover:opacity-70"
          aria-label="Home"
        >
          <Image
            src="/agbalumo-logo.png"
            alt=""
            aria-hidden
            width={1081}
            height={1080}
            priority
            className="h-[60px] w-[60px] shrink-0 object-contain"
          />
        </Link>

        <ul className="flex shrink-0 items-center gap-[29px]">
          <li>
            <Link
              href="/about"
              className="font-[family-name:var(--font-ojuju)] text-[16.533px] font-medium text-black no-underline transition-opacity hover:opacity-55"
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="font-[family-name:var(--font-ojuju)] text-[16.533px] font-medium text-black no-underline transition-opacity hover:opacity-55"
            >
              CART
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
