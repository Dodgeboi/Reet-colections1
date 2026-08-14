"use client";
import { useState } from "react";
import { useSiteText } from "./SiteTextProvider";
import Editable from "./Editable";
const ROWS = [
  ["XS", "32", "26", "34"], ["S", "34", "28", "36"], ["M", "36", "30", "38"],
  ["L", "38", "32", "40"], ["XL", "40", "34", "42"], ["XXL", "42", "36", "44"],
];
export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  const label = useSiteText("sizeGuide.label");
  const title = useSiteText("sizeGuide.title");
  const note = useSiteText("sizeGuide.note");
  const help = useSiteText("sizeGuide.help");
  return (
    <>
      <button onClick={() => setOpen(true)} className="font-sans text-xs uppercase tracking-wide text-onyx/60 underline underline-offset-2 hover:text-onyx"><Editable k="sizeGuide.label" value={label} /></button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-onyx/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-onyx"><Editable k="sizeGuide.title" value={title} /></h3>
              <button onClick={() => setOpen(false)} className="text-2xl text-onyx/40">×</button>
            </div>
            <p className="mt-1 font-sans text-xs text-onyx/55"><Editable k="sizeGuide.note" value={note} /></p>
            <table className="mt-4 w-full text-center font-sans text-sm">
              <thead><tr className="border-b border-onyx/15 text-onyx/55">
                <th className="py-2 font-medium">Size</th><th className="font-medium">Bust</th><th className="font-medium">Waist</th><th className="font-medium">Hip</th></tr></thead>
              <tbody>{ROWS.map((r) => (<tr key={r[0]} className="border-b border-onyx/8"><td className="py-2 font-medium text-onyx">{r[0]}</td><td className="text-onyx/70">{r[1]}</td><td className="text-onyx/70">{r[2]}</td><td className="text-onyx/70">{r[3]}</td></tr>))}</tbody>
            </table>
            <p className="mt-4 font-sans text-xs text-onyx/50"><Editable k="sizeGuide.help" value={help} /></p>
          </div>
        </div>
      )}
    </>
  );
}
