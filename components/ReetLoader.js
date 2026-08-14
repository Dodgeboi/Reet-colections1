import Image from "next/image";

export default function ReetLoader({ label = "Curating your collection" }) {
  return (
    <div className="flex min-h-[62vh] items-center justify-center px-6 pt-28" role="status" aria-live="polite">
      <div className="text-center">
        <div className="reet-loader-mark mx-auto">
          <span className="reet-loader-orbit" aria-hidden="true" />
          <span className="reet-loader-petal reet-loader-petal-one" aria-hidden="true" />
          <span className="reet-loader-petal reet-loader-petal-two" aria-hidden="true" />
          <span className="reet-loader-logo">
            <Image src="/images/logo-gold.png" alt="" fill sizes="72px" className="object-contain" priority />
          </span>
        </div>
        <p className="mt-6 font-display text-2xl font-light text-onyx">Reet Collections</p>
        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-onyx/45">{label}</p>
        <span className="reet-loader-thread mx-auto mt-5 block" aria-hidden="true" />
      </div>
    </div>
  );
}
