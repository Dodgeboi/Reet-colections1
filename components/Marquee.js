// A restrained ticker — small caps, hairline rules, slow drift.
export default function Marquee({ items }) {
  const row = [...items, ...items];
  const Track = ({ hidden }) => (
    <div aria-hidden={hidden} className="flex shrink-0 animate-[marquee_44s_linear_infinite] items-center gap-12 pr-12">
      {row.map((t, i) => (
        <span key={i} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-gold-light/90">{t}</span>
          <span className="h-1 w-1 rotate-45 bg-gold/60" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative flex overflow-hidden border-y border-gold/20 bg-onyx py-3.5">
      <Track hidden={false} /><Track hidden={true} />
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[marquee_44s_linear_infinite\\]{animation:none!important}}`}</style>
    </div>
  );
}
