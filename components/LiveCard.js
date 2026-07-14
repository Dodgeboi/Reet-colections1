import Image from "next/image";
import { formatLiveDate } from "@/lib/lives";

export default function LiveCard({ live }) {
  return (
    <a href={live.facebookUrl} target="_blank" rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-onyx/5 transition-all duration-500 hover:-translate-y-1 hover:ring-rose/40">
      <div className="relative aspect-video overflow-hidden">
        <Image src={live.thumbnail} alt={live.title} fill sizes="(max-width:768px) 90vw, 30vw"
          className="object-cover object-top transition-transform duration-[1.1s] group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/55 via-transparent to-transparent" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose/90 text-ivory shadow-soft transition-transform duration-300 group-hover:scale-110">
          <span className="ml-1 text-xl">▶</span>
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 font-sans text-[10px] uppercase tracking-label text-onyx">{live.week}</span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-onyx">{live.title}</h3>
        <p className="mt-1 flex items-center justify-between font-sans text-xs text-onyx/55">
          <span>{formatLiveDate(live.date)}</span>
          <span className="text-rose transition-transform duration-300 group-hover:translate-x-1">Watch on Facebook →</span>
        </p>
      </div>
    </a>
  );
}
