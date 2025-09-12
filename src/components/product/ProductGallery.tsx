"use client";
import Image from "next/image";
import { useState } from "react";
import type { Image as ShopifyImage } from "@/lib/types";

export function ProductGallery({ images }: { images: ShopifyImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_96px]">
      {active ? (
        <div className="aspect-square overflow-hidden rounded border bg-muted">
          <Image
            src={active.url}
            alt={active.altText || "Product image"}
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      ) : null}
      <div className="flex md:flex-col gap-2 overflow-auto">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Thumbnail ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`aspect-square w-24 overflow-hidden rounded border ${i === activeIndex ? "ring-2 ring-foreground" : ""}`}
          >
            <Image src={img.url} alt={img.altText || ""} width={300} height={300} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}


