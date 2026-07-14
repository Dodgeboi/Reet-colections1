const items = [
  { t: "New drops every evening", d: "Fresh styles, live at 8 PM" },
  { t: "Selected with love", d: "Every piece handpicked" },
  { t: "Ships nationwide", d: "Carefully packed for you" },
  { t: "Easy size help", d: "Message us anytime" },
];
const Mark = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-gold-deep">
    <path d="M12 3l2.2 4.6L19 8.3l-3.5 3.4.8 4.8L12 14.8 7.7 16.5l.8-4.8L5 8.3l4.8-.7L12 3z" strokeLinejoin="round" />
  </svg>
);
export default function TrustBar() {
  return (
    <section className="border-y border-gold/20 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4">
        {items.map((i) => (
          <div key={i.t} className="flex items-center gap-3 px-4 py-5 sm:justify-center">
            <Mark />
            <div className="leading-tight">
              <p className="font-sans text-[12px] font-medium text-onyx sm:text-sm">{i.t}</p>
              <p className="font-sans text-[10px] text-onyx/50 sm:text-xs">{i.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
