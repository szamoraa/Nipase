import { getShopifyProduct, getShopifyProductByHandle, type ShopifyProduct } from "./product";

/** Shopify handle for the SS26 hero product (title may change in Admin). */
export const SS26_PRODUCT_HANDLE = "yoruba-linen-shirt";

/** Stable product GID — fallback if handle lookup fails. */
export const SS26_PRODUCT_ID = "gid://shopify/Product/8005607030886";

/**
 * Gallery shown when Shopify has no product media yet.
 * Same set on homepage wheel + /shop/ss26 — keep in sync here only.
 */
export const SS26_FALLBACK_GALLERY = [
  { url: "/nipase-100gbani.jpg", altText: "Nipase look one" },
  { url: "/nipase-100gbani-1.jpg", altText: "Nipase look two" },
  { url: "/nipase-100gbani-2.jpg", altText: "Nipase look three" },
  { url: "/nipase-100gbani-3.jpg", altText: "Nipase look four" },
  { url: "/nipase-dsc09849.jpg", altText: "Nipase look five" },
] as const;

export async function getSS26Product(): Promise<ShopifyProduct | null> {
  const byHandle = await getShopifyProductByHandle(SS26_PRODUCT_HANDLE);
  if (byHandle) return byHandle;
  return getShopifyProduct(SS26_PRODUCT_ID);
}

export function resolveGalleryImages(product: ShopifyProduct | null) {
  if (product?.images && product.images.length > 0) {
    return product.images.map((img, i) => ({
      url: img.url,
      altText: img.altText ?? `${product.title} — look ${i + 1}`,
    }));
  }
  return SS26_FALLBACK_GALLERY;
}
