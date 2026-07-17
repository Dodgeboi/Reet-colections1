import Editable from "./Editable";
import { TEXT_DEFAULTS } from "@/lib/siteText";

export default function TrustBar({ text = {} }) {
  const t = (k) => text[k] || TEXT_DEFAULTS[k] || "";
  return (
    <section className="border-y border-onyx/10 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-onyx/10 sm:grid-cols-4 sm:divide-x">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="px-4 py-5 text-center">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-onyx">
              <Editable k={`trust.${i}.title`} value={t(`trust.${i}.title`)} />
            </p>
            <p className="mt-1 font-sans text-[11px] text-onyx/50">
              <Editable k={`trust.${i}.sub`} value={t(`trust.${i}.sub`)} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
