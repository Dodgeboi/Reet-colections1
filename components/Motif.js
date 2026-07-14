export function LotusMark({ size = 34, className = "text-gold-deep" }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width={size} height={size} viewBox="-30 -30 60 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      {petals.map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0,-3 C4,-9 4,-19 0,-26 C-4,-19 -4,-9 0,-3 Z" />
      ))}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0,-2 C2,-6 2,-11 0,-15 C-2,-11 -2,-6 0,-2 Z" strokeWidth="0.8" className="opacity-60" />
      ))}
      <circle r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function MotifDivider({ width = 120, dark = false, className = "" }) {
  const rule = dark ? "to-gold-light/70" : "to-gold";
  return (
    <div className={`inline-flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px bg-gradient-to-r from-transparent ${rule}`} style={{ width }} />
      <LotusMark className={dark ? "text-gold-light" : "text-gold-deep"} />
      <span className={`h-px bg-gradient-to-l from-transparent ${rule}`} style={{ width }} />
    </div>
  );
}
