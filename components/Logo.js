import Image from "next/image";
import Link from "next/link";

export default function Logo({ variant = "dark", showText = true, size = 40 }) {
  // variant "dark" = for light backgrounds (onyx text); "light" = for dark backgrounds (ivory text)
  const textColor = variant === "light" ? "text-ivory" : "text-onyx";
  const subColor = variant === "light" ? "text-gold-light/80" : "text-gold";
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Reet Collections home">
      <span
        className="relative inline-block rounded-full ring-1 ring-gold/40 transition-transform duration-500 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/logo-gold.png"
          alt="Reet Collections"
          fill
          sizes="40px"
          className="object-contain p-[3px]"
          priority
        />
      </span>
      {showText && (
        <span className="leading-none">
          <span className={`block font-display text-xl font-medium tracking-wide ${textColor}`}>
            Reet
          </span>
          <span className={`block font-sans text-[9px] uppercase tracking-label ${subColor}`}>
            Collections
          </span>
        </span>
      )}
    </Link>
  );
}
