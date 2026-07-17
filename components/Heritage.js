import Image from "next/image";
import Link from "next/link";
import MotifDivider from "./Motif";
import Editable from "./Editable";
import { TEXT_DEFAULTS } from "@/lib/siteText";

export default function Heritage({ image, text = {} }) {
  const t = (k) => text[k] || TEXT_DEFAULTS[k] || "";
  return (
    <section className="relative overflow-hidden bg-onyx py-16 text-ivory sm:py-20">
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden">
          <Image src={image} alt="Reet Collections craftsmanship" fill sizes="(max-width:1024px) 80vw, 40vw" className="object-cover object-top" data-edit="site:heritage" />
        </div>
        <div className="text-center lg:text-left">
          <p className="font-deva text-lg text-gold-light">परंपरा</p>
          <h2 className="mt-1 max-w-md font-display text-3xl font-light leading-tight sm:text-4xl"><Editable k="heritage.title" value={t("heritage.title")} /></h2>
          <div className="mt-5 flex justify-center lg:justify-start"><MotifDivider width={70} dark /></div>
          <p className="mx-auto mt-5 max-w-md font-sans text-[15px] leading-relaxed text-ivory/75 lg:mx-0">
            <Editable k="heritage.body" value={t("heritage.body")} />
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center lg:text-left">
                <p className="font-display text-lg text-gold-light"><Editable k={`heritage.p${i}.title`} value={t(`heritage.p${i}.title`)} /></p>
                <p className="font-sans text-xs leading-snug text-ivory/55"><Editable k={`heritage.p${i}.sub`} value={t(`heritage.p${i}.sub`)} /></p>
              </div>
            ))}
          </div>
          <Link href="/about" className="btn-gold mt-8">Read our story</Link>
        </div>
      </div>
    </section>
  );
}
