import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { fetchCollectionByHandle } from "@/lib/shopify";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 120;

type SearchParams = { sort?: string; order?: "asc" | "desc" };

export default async function CollectionPage({ params, searchParams }: { params: { handle: string }; searchParams: SearchParams }) {
  const sortKey = mapSortKey(searchParams.sort);
  const reverse = (searchParams.order ?? "asc") === "desc";
  const collection = await fetchCollectionByHandle(params.handle, { first: 24, sortKey, reverse });
  if (!collection) return null;
  const products = collection.products.nodes;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: collection.title }]} />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{collection.title}</h1>
        <SortSelect currentSort={searchParams.sort} currentOrder={searchParams.order} />
      </div>
      <ProductGrid products={products} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: collection.title,
          description: collection.description,
        }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const c = await fetchCollectionByHandle(params.handle, { first: 1 });
  if (!c) return {};
  const url = `/collections/${params.handle}`;
  const title = c.title;
  const description = c.description || undefined;
  const image = c.image || null;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: image ? [{ url: image.url, alt: image.altText || title }] : undefined,
    },
    alternates: { canonical: url },
  };
}

function mapSortKey(sort?: string) {
  switch (sort) {
    case "TITLE":
      return "TITLE";
    case "BEST_SELLING":
      return "BEST_SELLING";
    case "CREATED":
      return "CREATED";
    case "PRICE":
      return "PRICE";
    case "ID":
      return "ID";
    default:
      return null;
  }
}

function SortSelect({ currentSort }: { currentSort?: string; currentOrder?: "asc" | "desc" }) {
  const entries: { label: string; sort?: string; order?: "asc" | "desc" }[] = [
    { label: "Default" },
    { label: "Title A→Z", sort: "TITLE", order: "asc" },
    { label: "Title Z→A", sort: "TITLE", order: "desc" },
    { label: "Price Low→High", sort: "PRICE", order: "asc" },
    { label: "Price High→Low", sort: "PRICE", order: "desc" },
    { label: "Newest", sort: "CREATED", order: "desc" },
    { label: "Best Selling", sort: "BEST_SELLING", order: "desc" },
  ];
  return (
    <div className="text-sm">
      <form>
        <select
          name="sort"
          defaultValue={currentSort || ""}
          className="rounded border bg-background px-2 py-1"
          onChange={(e) => {
            const url = new URL(window.location.href);
            const choice = entries[e.currentTarget.selectedIndex];
            if (choice.sort) url.searchParams.set("sort", choice.sort);
            else url.searchParams.delete("sort");
            if (choice.order) url.searchParams.set("order", choice.order);
            else url.searchParams.delete("order");
            window.location.href = url.toString();
          }}
        >
          {entries.map((e) => (
            <option key={e.label} value={e.sort || ""}>
              {e.label}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}


