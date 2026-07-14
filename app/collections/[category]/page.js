import PageBanner from "@/components/PageBanner";
import Shop from "@/components/Shop";
import { categoryBySlug } from "@/lib/categories";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function CategoryPage({ params }) {
  const products = getCatalog();
  const cat = categoryBySlug[params.category];
  const title = cat?.name || "Collection";
  return (
    <>
      <PageBanner eyebrow="Shop" title={title}
        subtitle="Hover any category to explore more, or tap to filter the pieces below." />
      <Shop initialSlug={params.category} products={products} />
    </>
  );
}
