import type { Metadata } from "next";

import { SS26FigmaShop } from "@/components/ss26/SS26FigmaShop";
import { SS26Nav } from "@/components/ss26/SS26Nav";

export const metadata: Metadata = {
  title: "Shop SS26 | Nipase",
  description:
    "SS26 — Yoruba Linen Shirt and the Nipase Spring Summer collection.",
};

export default function ShopSS26Page() {
  return (
    <main className="flex-1 bg-white">
      <SS26Nav />
      <SS26FigmaShop />
    </main>
  );
}
