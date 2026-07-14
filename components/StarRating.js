export default function StarRating({ value = 5, count, size = 13 }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex text-gold-deep">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= full ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z" strokeLinejoin="round" />
          </svg>
        ))}
      </span>
      {count != null && <span className="font-sans text-xs text-onyx/45">{value.toFixed(1)} ({count})</span>}
    </span>
  );
}
