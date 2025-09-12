import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts } from "@/lib/shopify";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const revalidate = 60;

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || "").trim();
  const results = q ? await searchProducts(q, { first: 24 }) : null;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      </div>
      <h1 className="mb-4 text-2xl font-semibold">Search</h1>
      {!q && <p className="text-sm text-muted-foreground">Enter a query in the URL, e.g. /search?q=shirt</p>}
      {q && (
        <>
          <p className="mb-6 text-sm text-muted-foreground">{`Results for "${q}"`}</p>
          {results && results.nodes.length > 0 ? <ProductGrid products={results.nodes} /> : <p>No results found.</p>}
        </>
      )}
    </div>
  );
}


