"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart } from "@/lib/types";
import { addLinesToCart, createCart, fetchCart, updateCartLines } from "@/lib/shopify";

type CartState = {
  cart: Cart | null;
  isLoading: boolean;
  error?: string;
  ensureCart: () => Promise<Cart>;
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  refreshCart: () => Promise<void>;
  setLineQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      async ensureCart() {
        const current = get().cart;
        if (current) return current;
        set({ isLoading: true });
        try {
          const newCart = await createCart();
          set({ cart: newCart, isLoading: false });
          return newCart;
        } catch (e: unknown) {
          const message = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Failed to create cart";
          set({ isLoading: false, error: message });
          throw e;
        }
      },
      async addToCart(variantId, quantity = 1) {
        const cart = await get().ensureCart();
        set({ isLoading: true });
        try {
          await addLinesToCart(cart.id, [{ merchandiseId: variantId, quantity }]);
          const updated = await fetchCart(cart.id);
          if (updated) set({ cart: updated });
        } catch (e: unknown) {
          const message = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Failed to add to cart";
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
      },
      async refreshCart() {
        const cart = get().cart;
        if (!cart) return;
        try {
          const fresh = await fetchCart(cart.id);
          if (fresh) set({ cart: fresh });
        } catch {
          // ignore
        }
      },
      async setLineQuantity(lineId, quantity) {
        const cart = get().cart;
        if (!cart) return;
        set({ isLoading: true });
        try {
          await updateCartLines(cart.id, [{ id: lineId, quantity }]);
          const updated = await fetchCart(cart.id);
          if (updated) set({ cart: updated });
        } catch (e: unknown) {
          const message = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Failed to update cart";
          set({ error: message });
        } finally {
          set({ isLoading: false });
        }
      },
      async removeLine(lineId) {
        return get().setLineQuantity(lineId, 0);
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);


