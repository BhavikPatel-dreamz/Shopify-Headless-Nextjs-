"use client";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const { cart, refreshCart } = useCart();
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);


  console.log(cart?.lines?.nodes);

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Your cart</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_320px]">
        <div className="divide-y">
          {cart?.lines?.nodes?.map((line) => (
            <CartLineItem key={line.id} line={line} />
          ))}
        </div>
        <CartSummary cart={cart} />
      </div>
    </div>
  );
}


