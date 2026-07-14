export default function Marquee({ items, variant = "onyx" }) {
  const styles = { onyx: "bg-onyx text-gold-light", gold: "bg-gold-grad text-onyx" };
  const bg = styles[variant] || styles.onyx;
  const row = [...items, ...items];
  const Track = ({ hidden }) => (
    <div aria-hidden={hidden} className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 pr-10">
      {row.map((t, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-display text-2xl font-light italic">{t}</span>
          <span className="text-sm opacity-60">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`relative flex overflow-hidden border-y border-gold/25 py-4 ${bg}`}>
      <Track hidden={false} /><Track hidden={true} />
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-100%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[marquee_38s_linear_infinite\\]{animation:none!important}}`}</style>
    </div>
  );
}
