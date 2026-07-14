const items = [
  ["New drops every evening", "Fresh styles, live at 8 PM"],
  ["Selected with love", "Every piece handpicked"],
  ["Ships nationwide", "Carefully packed for you"],
  ["Easy size help", "Message us anytime"],
];

export default function TrustBar() {
  return (
    <section className="border-y border-onyx/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-onyx/10 sm:grid-cols-4 sm:divide-x">
        {items.map(([t, d]) => (
          <div key={t} className="px-4 py-5 text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-onyx">{t}</p>
            <p className="mt-1 font-sans text-[11px] text-onyx/50">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
