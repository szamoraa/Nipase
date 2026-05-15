"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Cart,
  cartCreate,
  cartLinesAdd,
  cartLinesRemove,
  getCart,
} from "@/lib/cart";

type CartContextValue = {
  cart: Cart | null;
  itemCount: number;
  checkoutUrl: string | null;
  loading: boolean;
  addToCart: (variantId: string) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_ID_KEY = "nipase_cart_id";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    getCart(cartId).then((c) => {
      if (c) setCart(c);
      else localStorage.removeItem(CART_ID_KEY);
    });
  }, []);

  const addToCart = useCallback(async (variantId: string) => {
    setLoading(true);
    try {
      const cartId = localStorage.getItem(CART_ID_KEY);
      const updated = cartId
        ? await cartLinesAdd(cartId, variantId)
        : await cartCreate(variantId);
      if (!cartId) localStorage.setItem(CART_ID_KEY, updated.id);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCart = useCallback(async (lineId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY);
    if (!cartId) return;
    setLoading(true);
    try {
      const updated = await cartLinesRemove(cartId, lineId);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.totalQuantity ?? 0,
        checkoutUrl: cart?.checkoutUrl ?? null,
        loading,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
