import type { Metadata } from "next";

import { SS26FigmaShop } from "@/components/ss26/SS26FigmaShop";
import { getSS26Product } from "@/lib/ss26";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const product = await getSS26Product();
  return {
    title: product ? `${product.title} | SS26 | Nipase` : "Shop SS26 | Nipase",
    description: product?.description ?? "SS26 — Nipase Spring Summer collection.",
  };
}

export default async function ShopSS26Page() {
  const product = await getSS26Product();

  return (
    <main className="flex-1 bg-white">
      <SS26FigmaShop product={product} />
    </main>
  );
}
