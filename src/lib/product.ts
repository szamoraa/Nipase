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

export async function getShopifyProduct(id: string): Promise<ShopifyProduct | null> {
  const shopify = getShopifyClient();
  if (!shopify) return null;

  try {
    const { data } = await shopify.request(GET_PRODUCT, { variables: { id } });
    const p = data?.product;
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      variants: p.variants.edges.map((e: { node: ShopifyVariant }) => e.node),
      images: p.images.edges.map((e: { node: ShopifyImage }) => e.node),
    };
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
