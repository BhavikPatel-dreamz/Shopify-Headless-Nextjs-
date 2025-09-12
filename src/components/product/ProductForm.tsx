"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/hooks/useCart";

function toKey(selected: Record<string, string>) {
  return Object.entries(selected)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
    .join("/");
}

export function ProductForm({ product, onAddToCart }: { product: Product; onAddToCart?: (variantId: string) => Promise<void> | void }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const option of product.options) initial[option.name] = option.values[0] ?? "";
    return initial;
  });

  const selectedVariant = useMemo(() => {
    const key = toKey(selected);
    return product?.variants?.nodes?.find((v) => toKey(Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value]))) === key);
  }, [product?.variants?.nodes, selected]);

  const handleSelect = (name: string, value: string) => {
    setSelected((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="space-y-4">
      {product.options.map((opt) => (
        <div key={opt.name} className="space-y-2">
          <div className="text-sm font-medium">{opt.name}</div>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => {
              const active = selected[opt.name] === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleSelect(opt.name, v)}
                  className={`rounded border px-3 py-1 text-sm ${active ? "bg-foreground text-background" : "hover:bg-muted"}`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={!selectedVariant?.availableForSale}
        onClick={async () => {
          if (!selectedVariant) return;
          if (onAddToCart) return onAddToCart(selectedVariant.id);
          await addToCart(selectedVariant.id, 1);
        }}
        className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {selectedVariant?.availableForSale ? "Add to cart" : "Out of stock"}
      </button>
    </form>
  );
}


