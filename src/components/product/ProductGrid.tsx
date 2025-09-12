import { ProductCard } from "./ProductCard";
import { memo } from "react";
import type { Product } from "@/lib/types";

function ProductGridBase({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export const ProductGrid = memo(ProductGridBase);
ProductGrid.displayName = "ProductGrid";


