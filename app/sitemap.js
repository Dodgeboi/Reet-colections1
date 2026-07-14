import { getCatalog } from "@/lib/catalog";
import { categories } from "@/lib/categories";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = siteUrl();
  const now = new Date();
  const staticPages = ["", "/collections", "/live", "/about", "/faq", "/contact", "/shipping-returns", "/privacy", "/terms"]
    .map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
  const categoryPages = categories.map((c) => ({
    url: `${base}/collections/${c.slug}`, lastModified: now, changeFrequency: "daily", priority: 0.8,
  }));
  const products = (await getCatalog())
    .filter((p) => p.status !== "sold")
    .map((p) => ({ url: `${base}/product/${p.id}`, lastModified: now, changeFrequency: "daily", priority: 0.6 }));
  return [...staticPages, ...categoryPages, ...products];
}
