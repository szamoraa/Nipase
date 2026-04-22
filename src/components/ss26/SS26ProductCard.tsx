import Image from "next/image";
import Link from "next/link";

import type { SS26Product } from "@/data/ss26-products";
import { formatSS26Price } from "@/data/ss26-products";

type SS26ProductCardProps = {
  product: SS26Product;
};

export function SS26ProductCard({ product }: SS26ProductCardProps) {
  return (
    <Link
      href={`/shop/ss26/${product.slug}`}
      className="group block outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Image
          src={product.imageSrc}
          alt={product.name}
          width={product.imageWidth}
          height={product.imageHeight}
          className="h-full w-full object-cover transition-transform duration-[480ms] ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 384px"
          quality={70}
          loading="lazy"
        />
      </div>
      <div className="mt-5">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1a1a1a]">
          {product.name}
        </h2>
        <p className="mt-1.5 text-xs tracking-wide text-[#555]">
          {product.summary}
        </p>
        <p className="mt-2 text-sm font-medium text-[#1a1a1a]">
          {formatSS26Price(product.priceCents)}
        </p>
      </div>
    </Link>
  );
}
