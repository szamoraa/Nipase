import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  SS26_PRODUCTS,
  formatSS26Price,
  getSS26Product,
} from "@/data/ss26-products";

type SS26ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SS26_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: SS26ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getSS26Product(slug);
  if (!product) {
    return { title: "Product | Nipase" };
  }
  return {
    title: `${product.name} | SS26 | Nipase`,
    description: product.description,
  };
}

export default async function SS26ProductPage({ params }: SS26ProductPageProps) {
  const { slug } = await params;
  const product = getSS26Product(slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1 bg-white px-6 pb-24 pt-[calc(var(--nav-h)+2.5rem)] md:px-10 md:pb-32 md:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="mx-auto max-w-6xl">
        <nav className="text-xs uppercase tracking-[0.2em] text-[#555]">
          <Link
            href="/shop/ss26"
            className="transition-opacity hover:opacity-60 hover:underline hover:underline-offset-4"
          >
            SS26
          </Link>
          <span className="mx-2 text-[#ccc]" aria-hidden>
            /
          </span>
          <span className="text-[#1a1a1a]">{product.name}</span>
        </nav>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
            <Image
              src={product.imageSrc}
              alt={product.name}
              width={product.imageWidth}
              height={product.imageHeight}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col md:pt-4">
            <p className="text-xs uppercase tracking-[0.28em] text-[#555]">
              SS26
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#1a1a1a] md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-[#555]">{product.summary}</p>
            <p className="mt-6 text-lg font-medium text-[#1a1a1a]">
              {formatSS26Price(product.priceCents)}
            </p>
            <p className="mt-6 text-sm leading-relaxed text-[#555]">
              {product.description}
            </p>

            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-[#555]">
              Sizes
            </p>
            <ul className="mt-3 flex flex-wrap gap-2" aria-label="Available sizes">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <li key={size}>
                  <span className="inline-flex min-w-[2.75rem] justify-center border border-[#e5e5e5] px-3 py-2 text-xs font-medium text-[#1a1a1a]">
                    {size}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center bg-[#1a1a1a] px-8 py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-85"
              >
                Add to bag
              </Link>
              <Link
                href="/shop/ss26"
                className="text-center text-xs uppercase tracking-[0.2em] text-[#555] underline-offset-4 transition-opacity hover:text-[#1a1a1a] hover:underline sm:text-left"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
