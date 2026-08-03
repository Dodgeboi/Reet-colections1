import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getCatalog } from "@/lib/catalog";
import { onSale, effectivePrice } from "@/lib/products";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const p = (await getCatalog()).find((x) => x.id === params.id);
  if (!p) return { title: "Reet Collections" };
  const description = p.note || `${p.name} in ${p.color} — handpicked Indian ethnic wear, selected with love & care by Reet Collections.`;
  return {
    title: p.name,
    description,
    openGraph: { title: p.name, description, images: p.image ? [{ url: p.image }] : [] },
  };
}

export default async function ProductPage({ params }) {
  const products = await getCatalog();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  // Product schema so the product can appear as a rich result in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image?.startsWith("http") ? product.image : `${siteUrl()}${product.image}`,
    description: product.note || `${product.name} — handpicked by Reet Collections.`,
    sku: product.code || product.id,
    color: product.color || undefined,
    material: product.fabric || undefined,
    brand: { "@type": "Brand", name: "Reet Collections" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/product/${product.id}`,
      price: onSale(product) ? effectivePrice(product) : Number(product.price) || 0,
      priceCurrency: "USD",
      availability: product.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
