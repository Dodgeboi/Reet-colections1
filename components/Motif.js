// A quiet separator: two hairlines meeting at a small gold diamond.
export default function MotifDivider({ width = 120, dark = false, className = "" }) {
  const rule = dark ? "to-gold-light/70" : "to-gold";
  const diamond = dark ? "bg-gold-light" : "bg-gold-deep";
  return (
    <div className={`inline-flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px bg-gradient-to-r from-transparent ${rule}`} style={{ width }} />
      <span className={`h-1.5 w-1.5 rotate-45 ${diamond}`} />
      <span className={`h-px bg-gradient-to-l from-transparent ${rule}`} style={{ width }} />
    </div>
  );
}
