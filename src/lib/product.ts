import { shopify } from "./shopify";

export type ShopifyVariant = {
  id: string;
  title: string;
  price: { amount: string; currencyCode: string };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  variants: ShopifyVariant[];
};

const GET_PRODUCT = /* GraphQL */ `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      description
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
  const { data } = await shopify.request(GET_PRODUCT, { variables: { id } });
  const p = data?.product;
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    variants: p.variants.edges.map((e: { node: ShopifyVariant }) => e.node),
  };
}

export function formatShopifyPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
}
