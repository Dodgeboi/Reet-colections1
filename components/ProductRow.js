import Link from "next/link";
import ProductCard from "./ProductCard";
export default function ProductRow({ eyebrow, title, viewAllHref, products, tone = "ivory" }) {
  if (!products?.length) return null;
  return (
    <section className={`${tone === "blush" ? "bg-blush/25" : "bg-ivory"} py-12 sm:py-16`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="mt-1.5 font-display text-2xl font-light text-onyx sm:text-4xl">{title}</h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="shrink-0 font-sans text-xs uppercase tracking-wide text-rose hover:text-rose-deep sm:text-sm">View all →</Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
