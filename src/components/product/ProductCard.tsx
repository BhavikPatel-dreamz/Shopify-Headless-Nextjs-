import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { Product } from "@/lib/types";

function ProductCardBase({ product }: { product: Product }) {
  const image = product.featuredImage ?? product.images?.[0] ?? null;
  const price = product.variants?.nodes?.[0]?.price;
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="aspect-[4/5] w-full overflow-hidden rounded border bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            width={600}
            height={750}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium">{product.title}</p>
        {price ? (
          <p className="text-sm text-muted-foreground">
            {new Intl.NumberFormat(undefined, { style: "currency", currency: price.currencyCode }).format(Number(price.amount))}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardBase);
ProductCard.displayName = "ProductCard";


