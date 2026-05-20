import { getShopifyClient } from "./shopify";

export type ShopifyVariant = {
  id: string;
  title: string;
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

const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
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
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
          }
        }
      }
    }
  }
`;

const GET_PRODUCT = /* GraphQL */ `
  query getProduct($id: ID!) {
    product(id: $id) {
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
      variants(first: 10) {
        edges {
          node {
            id
            title
            price { amount currencyCode }
          }
        }
      }
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

export function formatShopifyPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
}
