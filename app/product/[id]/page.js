import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }) {
  const p = getCatalog().find((x) => x.id === params.id);
  if (!p) return { title: "Reet Collections" };
  const description = p.note || `${p.name} in ${p.color} — handpicked Indian ethnic wear, selected with love & care by Reet Collections.`;
  return {
    title: `${p.name} — Reet Collections`,
    description,
    openGraph: { title: p.name, description, images: p.image ? [{ url: p.image }] : [] },
  };
}

export default function ProductPage({ params }) {
  const products = getCatalog();
  const product = products.find((p) => p.id === params.id);
  if (!product) notFound();
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
