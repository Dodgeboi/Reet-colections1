import PageBanner from "@/components/PageBanner";
import Shop from "@/components/Shop";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default function CollectionsPage() {
  const products = getCatalog();
  return (
    <>
      <PageBanner eyebrow="Shop" title="The Collection"
        subtitle="Browse everything in the boutique. Tap a category to filter, then sort to find your favorite — new pieces drop on the live every evening." />
      <Shop initialSlug="all" products={products} />
    </>
  );
}
