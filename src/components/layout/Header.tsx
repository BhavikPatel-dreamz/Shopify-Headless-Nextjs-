"use client";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export function Header() {
  const { totalQuantity } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold">Shop</Link>
        <nav className="flex items-center gap-4">
          <Link href="/search" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-foreground px-1.5 py-0.5 text-[10px] leading-none text-background">
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}


