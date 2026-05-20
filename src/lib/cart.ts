import { getShopifyClient } from "./shopify";

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string };
  };
  cost: { totalAmount: { amount: string; currencyCode: string } };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  lines: { edges: Array<{ node: CartLine }> };
};

const CART_FIELDS = /* GraphQL */ `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            product { title handle }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
    }
  }
`;

const CART_CREATE = /* GraphQL */ `
  mutation cartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

const GET_CART = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }
`;

function requireClient() {
  const client = getShopifyClient();
  if (!client) throw new Error("Shopify storefront is not configured");
  return client;
}

export async function cartCreate(variantId: string, quantity = 1): Promise<Cart> {
  const { data, errors } = await requireClient().request(CART_CREATE, {
    variables: { lines: [{ merchandiseId: variantId, quantity }] },
  });
  if (errors) throw new Error("Failed to create cart");
  return data.cartCreate.cart;
}

export async function cartLinesAdd(
  cartId: string,
  variantId: string,
  quantity = 1
): Promise<Cart> {
  const { data, errors } = await requireClient().request(CART_LINES_ADD, {
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
  });
  if (errors) throw new Error("Failed to add to cart");
  return data.cartLinesAdd.cart;
}

export async function cartLinesRemove(cartId: string, lineId: string): Promise<Cart> {
  const { data, errors } = await requireClient().request(CART_LINES_REMOVE, {
    variables: { cartId, lineIds: [lineId] },
  });
  if (errors) throw new Error("Failed to remove from cart");
  return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const client = getShopifyClient();
  if (!client) return null;
  const { data } = await client.request(GET_CART, { variables: { cartId } });
  return data?.cart ?? null;
}
