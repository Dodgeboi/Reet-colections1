export default function LiveBadge({ variant = "light", className = "" }) {
  const text = variant === "onDark" ? "text-ivory/90" : "text-onyx/75";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-rose animate-pulseSoft" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose" />
      </span>
      <span className={`font-sans text-[11px] uppercase tracking-label ${text}`}>Live every evening · 8 PM</span>
    </span>
  );
}
