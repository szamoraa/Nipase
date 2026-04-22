export type SS26Product = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  priceCents: number;
  imageSrc: string;
  imageWidth: number;
  imageHeight: number;
};

export const SS26_PRODUCTS: SS26Product[] = [
  {
    slug: "camp-collar-shirt-rust",
    name: "Camp collar shirt",
    summary: "Rust cotton poplin",
    description:
      "Relaxed camp collar shirt in garment-dyed cotton poplin. Corozo buttons, curved hem, SS26 palette.",
    priceCents: 28000,
    imageSrc: "/DSC09765-2.JPEG",
    imageWidth: 2000,
    imageHeight: 1333,
  },
  {
    slug: "pleated-trouser-ink",
    name: "Pleated trouser",
    summary: "High-rise, ink wool blend",
    description:
      "Wide pleated trouser with a high rise and clean drape. Pressed crease, side adjusters, lined to the knee.",
    priceCents: 36000,
    imageSrc: "/DSC09826.JPEG",
    imageWidth: 2000,
    imageHeight: 1333,
  },
  {
    slug: "layered-knit-oatmeal",
    name: "Layered knit",
    summary: "Oatmeal merino blend",
    description:
      "Fine-gauge merino blend knit with a relaxed shoulder and extended cuff. Designed as a base or mid layer.",
    priceCents: 24000,
    imageSrc: "/DSC09979.JPEG",
    imageWidth: 2000,
    imageHeight: 1333,
  },
];

export function formatSS26Price(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function getSS26Product(slug: string): SS26Product | undefined {
  return SS26_PRODUCTS.find((p) => p.slug === slug);
}
