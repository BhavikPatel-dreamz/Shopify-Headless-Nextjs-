"use client";
import Image from "next/image";
import type { CartLine } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { memo } from "react";

function CartLineItemBase({ line }: { line: CartLine }) {
  const { setLineQuantity, removeLine, isLoading } = useCart();
  const merchandise = line.merchandise;
  const product = merchandise.product;
  const image = merchandise.image || product.featuredImage || null;
  const price = line.cost.totalAmount;
  return (
    <div className="flex gap-4 py-4">
      <div className="h-24 w-24 overflow-hidden rounded border bg-muted">
        {image && <Image src={image.url} alt={image.altText || product.title} width={96} height={96} className="h-full w-full object-cover" />}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-medium">{product.title}</div>
            <div className="text-xs text-muted-foreground">{merchandise.title}</div>
          </div>
          <div className="text-sm">
            {new Intl.NumberFormat(undefined, { style: "currency", currency: price.currencyCode }).format(Number(price.amount))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            className="rounded border px-2"
            disabled={isLoading || line.quantity <= 1}
            onClick={() => setLineQuantity(line.id, line.quantity - 1)}
          >
            −
          </button>
          <div className="w-8 text-center text-sm">{line.quantity}</div>
          <button
            type="button"
            className="rounded border px-2"
            disabled={isLoading}
            onClick={() => setLineQuantity(line.id, line.quantity + 1)}
          >
            +
          </button>
          <button
            type="button"
            className="ml-4 text-sm text-red-600 hover:underline"
            disabled={isLoading}
            onClick={() => removeLine(line.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export const CartLineItem = memo(CartLineItemBase);
CartLineItem.displayName = "CartLineItem";


