import { getShopifyClient } from "./shopify";

export type ShopifySelectedOption = { name: string; value: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: { amount: string; currencyCode: string };
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
};

/**
 * Shared selection set for both lookups.
 *
 * `variants` must stay comfortably above the real variant count — the Buba
 * Overshirt alone is 2 colours × 5 sizes = 10, so a limit of 10 would silently
 * truncate the moment a colourway or size is added in Admin.
 */
const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    description
    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 50) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions { name value }
          price { amount currencyCode }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

const GET_PRODUCT = /* GraphQL */ `
  ${PRODUCT_FIELDS}
  query getProduct($id: ID!) {
    product(id: $id) {
      ...ProductFields
    }
  }
`;

function mapProduct(p: {
  id: string;
  title: string;
  description: string;
  variants: { edges: Array<{ node: ShopifyVariant }> };
  images: { edges: Array<{ node: ShopifyImage }> };
}): ShopifyProduct {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    variants: p.variants.edges.map((e) => e.node),
    images: p.images.edges.map((e) => e.node),
  };
}

export async function getShopifyProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const shopify = getShopifyClient();
  if (!shopify) return null;

  try {
    const { data } = await shopify.request(GET_PRODUCT_BY_HANDLE, {
      variables: { handle },
    });
    const p = data?.product;
    if (!p) return null;
    return mapProduct(p);
  } catch (error) {
    console.error("[shopify] getShopifyProductByHandle failed:", error);
    return null;
  }
}

export async function getShopifyProduct(id: string): Promise<ShopifyProduct | null> {
  const shopify = getShopifyClient();
  if (!shopify) return null;

  try {
    const { data } = await shopify.request(GET_PRODUCT, { variables: { id } });
    const p = data?.product;
    if (!p) return null;
    return mapProduct(p);
  } catch (error) {
    console.error("[shopify] getShopifyProduct failed:", error);
    return null;
  }
}

/** Read one of a variant's Shopify option values (e.g. "Color", "Size"). */
export function getOptionValue(
  variant: ShopifyVariant,
  optionName: string
): string | null {
  const match = variant.selectedOptions.find(
    (option) => option.name.toLowerCase() === optionName.toLowerCase()
  );
  return match?.value ?? null;
}

export function formatShopifyPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
}
