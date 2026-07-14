import Link from "next/link";
import GoldThread from "@/components/GoldThread";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
      <p className="font-sans text-[11px] uppercase tracking-label text-rose">404</p>
      <h1 className="mt-2 font-display text-5xl font-light text-onyx">This page slipped away</h1>
      <div className="my-5"><GoldThread width={180} /></div>
      <p className="max-w-md font-sans text-onyx/60">The piece you're looking for may have sold or moved. Let's get you back to the collection.</p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className="btn-outline">Home</Link>
        <Link href="/collections" className="btn-gold">Shop the collection</Link>
      </div>
    </div>
  );
}
