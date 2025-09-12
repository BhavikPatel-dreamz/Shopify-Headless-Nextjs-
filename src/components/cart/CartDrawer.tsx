"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { CartLineItem } from "./CartLineItem";
import { CartSummary } from "./CartSummary";

export function CartDrawerButton() {
  const { totalQuantity } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Cart" onClick={() => setOpen(true)} className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalQuantity > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
            {totalQuantity}
          </span>
        )}
      </button>
      <CartDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}

export function CartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { cart, refreshCart } = useCart();
  useEffect(() => {
    if (open) refreshCart();
  }, [open, refreshCart]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => onOpenChange(false)}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md transform bg-background shadow-xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Your cart</h2>
          <button aria-label="Close" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid h-[calc(100%-56px)] grid-rows-[1fr_auto]">
          <div className="overflow-auto px-4">
            {cart && cart.lines.nodes.length > 0 ? (
              <div className="divide-y">
                {cart.lines.nodes.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">Your cart is empty</div>
            )}
          </div>
          <div className="border-t p-4">
            {cart ? <CartSummary cart={cart} /> : null}
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
}


