import Image from "next/image";
import { formatLiveDate, weekLabel } from "@/lib/lives";

export default function LiveCard({ live }) {
  return (
    <a href={live.facebookUrl} target="_blank" rel="noopener noreferrer" className="group block bg-white">
      <div className="relative aspect-video overflow-hidden bg-[#F3EDE4]">
        <Image src={live.thumbnail} alt={live.title} fill sizes="(max-width:768px) 90vw, 30vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          data-edit={`live:${live.id}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/50 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-ivory/95 text-onyx transition-colors duration-300 group-hover:bg-rose-deep group-hover:text-ivory">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="absolute left-0 top-3 bg-onyx px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.14em] text-ivory">{weekLabel(live.date)}</span>
      </div>
      <div className="px-0.5 py-3.5">
        <h3 className="font-display text-xl text-onyx">{live.title}</h3>
        <p className="mt-1 flex items-center justify-between font-sans text-xs text-onyx/55">
          <span>{formatLiveDate(live.date)}</span>
          <span className="border-b border-transparent uppercase tracking-[0.12em] text-[10px] transition-colors group-hover:border-onyx/40 group-hover:text-onyx">Watch on Facebook</span>
        </p>
      </div>
    </a>
  );
}
