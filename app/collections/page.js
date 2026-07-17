import PageBanner from "@/components/PageBanner";
import Shop from "@/components/Shop";
import Editable from "@/components/Editable";
import { getCatalog } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/siteSettings";
import { textOf } from "@/lib/siteText";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  const [products, site] = await Promise.all([getCatalog(), getSiteSettings()]);
  return (
    <>
      <PageBanner eyebrow="Shop"
        title={<Editable k="banner.collections.title" value={textOf(site, "banner.collections.title")} />}
        subtitle={<Editable k="banner.collections.subtitle" value={textOf(site, "banner.collections.subtitle")} />} />
      <Shop initialSlug="all" products={products} />
    </>
  );
}
