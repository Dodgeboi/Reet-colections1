"use client";
import { useState } from "react";
const ROWS = [
  ["XS", "32", "26", "34"], ["S", "34", "28", "36"], ["M", "36", "30", "38"],
  ["L", "38", "32", "40"], ["XL", "40", "34", "42"], ["XXL", "42", "36", "44"],
];
export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="font-sans text-xs uppercase tracking-wide text-rose underline-offset-2 hover:underline">Size guide</button>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-onyx/40 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-onyx">Size Guide</h3>
              <button onClick={() => setOpen(false)} className="text-2xl text-onyx/40">×</button>
            </div>
            <p className="mt-1 font-sans text-xs text-onyx/55">Measurements in inches. When between sizes, we suggest sizing up.</p>
            <table className="mt-4 w-full text-center font-sans text-sm">
              <thead><tr className="border-b border-onyx/15 text-onyx/55">
                <th className="py-2 font-medium">Size</th><th className="font-medium">Bust</th><th className="font-medium">Waist</th><th className="font-medium">Hip</th></tr></thead>
              <tbody>{ROWS.map((r) => (<tr key={r[0]} className="border-b border-onyx/8"><td className="py-2 font-medium text-onyx">{r[0]}</td><td className="text-onyx/70">{r[1]}</td><td className="text-onyx/70">{r[2]}</td><td className="text-onyx/70">{r[3]}</td></tr>))}</tbody>
            </table>
            <p className="mt-4 font-sans text-xs text-onyx/50">Need help? Message us on the live and we'll guide you.</p>
          </div>
        </div>
      )}
    </>
  );
}
