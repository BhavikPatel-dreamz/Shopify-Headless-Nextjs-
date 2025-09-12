import { fetchProductByHandle } from "@/lib/shopify";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductForm } from "@/components/product/ProductForm";
import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 120;

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await fetchProductByHandle(params.handle);
  if (!product) return null;
  const images = product.images?.length ? product.images : product.featuredImage ? [product.featuredImage] : [];


  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: product.title }]} />
      </div>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={images} />
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
          </div>
          <ProductForm product={product} />
          <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
        </div>
      </div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: images.map((i) => i.url),
          sku: product.variants?.nodes[0]?.sku || undefined,
          offers: product.variants.nodes?.map((v) => ({
            "@type": "Offer",
            priceCurrency: v.price.currencyCode,
            price: v.price.amount,
            availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          })),
        }}
      />
    </div>
  );
}

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await fetchProductByHandle(params.handle);
  if (!product) return {};
  const url = `/products/${product.handle}`;
  const title = product.title;
  const description = product.description;
  const image = product.featuredImage || product.images?.[0] || null;
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

export async function generateStaticParams() {
  // Optional: could prebuild popular products via collection or tags.
  return [] as { handle: string }[];
}



