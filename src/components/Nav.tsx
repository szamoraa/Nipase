import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <nav
        className="flex items-center justify-between px-8 py-5"
        aria-label="Primary"
      >
        <Link href="/" className="block transition-opacity hover:opacity-70">
          <Image
            src="/agbalumo-wordmark.png"
            alt="Nipase"
            width={271}
            height={90}
            priority
            className="h-[34px] w-auto max-w-[min(126px,32vw)] shrink-0 object-contain"
          />
        </Link>
        <ul className="flex items-center gap-10">
          <li>
            <Link
              href="/about"
              className="text-[12pt] font-medium uppercase tracking-widest text-[#1a1a1a] no-underline transition-opacity hover:opacity-50"
            >
              ABOUT
            </Link>
          </li>
          <li>
            <Link
              href="/cart"
              className="text-[12pt] font-medium uppercase tracking-widest text-[#1a1a1a] no-underline transition-opacity hover:opacity-50"
            >
              CART
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
