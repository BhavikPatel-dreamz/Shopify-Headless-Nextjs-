import { fetchProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/product/ProductGrid";

export const revalidate = 60; // ISR every 60s

export default async function Home() {
  const { nodes: products } = await fetchProducts({ first: 12 });
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Latest products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
