import PageBanner from "@/components/PageBanner";
import Shop from "@/components/Shop";
import Editable from "@/components/Editable";
import { categoryBySlug } from "@/lib/categories";
import { getCatalog } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/siteSettings";
import { textOf } from "@/lib/siteText";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const [products, site] = await Promise.all([getCatalog(), getSiteSettings()]);
  const cat = categoryBySlug[params.category];
  const title = cat?.name || "Collection";
  return (
    <>
      <PageBanner eyebrow={<Editable k="banner.collections.eyebrow" value={textOf(site, "banner.collections.eyebrow")} />} title={title}
        subtitle={<Editable k="banner.category.subtitle" value={textOf(site, "banner.category.subtitle")} />} />
      <Shop initialSlug={params.category} products={products} />
    </>
  );
}
