import Link from "next/link";
import ProductCard from "./ProductCard";
export default function ProductRow({ eyebrow, title, viewAllHref, products, tone = "ivory" }) {
  if (!products?.length) return null;
  return (
    <section className={`${tone === "blush" ? "bg-white" : "bg-ivory"} py-10 sm:py-14`}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 className="mt-1.5 font-display text-2xl font-light text-onyx sm:text-4xl">{title}</h2>
          </div>
          {viewAllHref && (
            <Link href={viewAllHref} className="shrink-0 border-b border-onyx/30 pb-0.5 font-sans text-[11px] uppercase tracking-[0.14em] text-onyx/70 transition-colors hover:border-onyx hover:text-onyx sm:text-xs">View all</Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
