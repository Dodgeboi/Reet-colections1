export default function LiveBadge({ variant = "light", className = "" }) {
  const styles = {
    light:   { ring: "border-rose/30 bg-white/70", text: "text-onyx/80" },
    onDark:  { ring: "border-gold/40 bg-onyx-soft/60 backdrop-blur-sm", text: "text-ivory" },
  };
  const s = styles[variant] || styles.light;
  return (
    <span className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 ${s.ring} ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-rose animate-pulseSoft" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
      </span>
      <span className={`font-sans text-[11px] uppercase tracking-label ${s.text}`}>Live every evening · 8 PM</span>
    </span>
  );
}
