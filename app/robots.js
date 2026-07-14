import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/checkout", "/account"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
