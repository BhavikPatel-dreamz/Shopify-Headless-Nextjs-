"use client";
import { useCartStore } from "@/stores/cartStore";

export function useCart() {
  const { cart, isLoading, error, addToCart, ensureCart, refreshCart, setLineQuantity, removeLine } = useCartStore();
  const totalQuantity = cart?.totalQuantity ?? 0;
  const checkoutUrl = cart?.checkoutUrl ?? null;
  return { cart, totalQuantity, checkoutUrl, isLoading, error, addToCart, ensureCart, refreshCart, setLineQuantity, removeLine };
}


