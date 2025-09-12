import type { Cart } from "@/lib/types";

export function CartSummary({ cart }: { cart: Cart }) {
  const { subtotalAmount, totalAmount, totalTaxAmount } = cart.cost;
  const format = (amount?: { amount: string; currencyCode: string } | null) =>
    amount ? new Intl.NumberFormat(undefined, { style: "currency", currency: amount.currencyCode }).format(Number(amount.amount)) : "-";
  return (
    <div className="rounded border p-4">
      <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{format(subtotalAmount)}</span>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span>Tax</span>
        <span>{format(totalTaxAmount || null)}</span>
      </div>
      <div className="mt-3 flex justify-between font-medium">
        <span>Total</span>
        <span>{format(totalAmount)}</span>
      </div>
      <a
        href={cart.checkoutUrl}
        className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Checkout
      </a>
    </div>
  );
}


