import { createStorefrontApiClient } from "@shopify/storefront-api-client";

type StorefrontClient = ReturnType<typeof createStorefrontApiClient>;

let cachedClient: StorefrontClient | null = null;

/**
 * Lazily construct the Shopify Storefront client.
 *
 * Importing this module must NEVER crash the build (e.g. during static
 * prerender on Vercel) if the env vars happen to be missing — instead we
 * return `null` and let callers gracefully fall back.
 */
export function getShopifyClient(): StorefrontClient | null {
  if (cachedClient) return cachedClient;

  const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const publicAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!storeDomain || !publicAccessToken) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[shopify] Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN — Shopify calls will be skipped."
      );
    }
    return null;
  }

  cachedClient = createStorefrontApiClient({
    storeDomain,
    apiVersion: "2026-01",
    publicAccessToken,
  });
  return cachedClient;
}
