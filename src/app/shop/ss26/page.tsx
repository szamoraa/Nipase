import type { Metadata } from "next";

import { SS26FigmaShop } from "@/components/ss26/SS26FigmaShop";
import { SS26Nav } from "@/components/ss26/SS26Nav";
import { getShopifyProduct } from "@/lib/product";

const YORUBA_LINEN_SHIRT_ID = "gid://shopify/Product/8005607030886";

export const revalidate = 60; // re-fetch from Shopify at most once per minute

export async function generateMetadata(): Promise<Metadata> {
  const product = await getShopifyProduct(YORUBA_LINEN_SHIRT_ID);
  return {
    title: product ? `${product.title} | SS26 | Nipase` : "Shop SS26 | Nipase",
    description: product?.description ?? "SS26 — Nipase Spring Summer collection.",
  };
}

export default async function ShopSS26Page() {
  const product = await getShopifyProduct(YORUBA_LINEN_SHIRT_ID);

  return (
    <main className="flex-1 bg-white">
      <SS26Nav />
      <SS26FigmaShop product={product} />
    </main>
  );
}
