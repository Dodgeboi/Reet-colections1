"use client";
import { useEffect, useState } from "react";

const STATUSES = ["new", "answered", "closed"];
const LABEL = { new: "New", answered: "Answered", closed: "Closed" };

export default function AdminInquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openRef, setOpenRef] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setStatus = async (ref, status) => {
    const prev = items;
    setItems((list) => list.map((i) => (i.ref === ref ? { ...i, status } : i)));
    setErr("");
    try {
      const r = await fetch("/api/inquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ref, status }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Couldn't update the inquiry.");
    } catch (e) {
      setItems(prev);
      setErr(e.message);
    }
  };

  const fresh = items.filter((i) => i.status === "new").length;

  return (
    <div className="mt-4 rounded-2xl border border-rose/25 bg-white p-4 shadow-soft">
      <div>
        <p className="font-sans text-[11px] uppercase tracking-label text-rose">Inquiries</p>
        <p className="mt-0.5 font-display text-xl text-onyx">
          {loading ? "Loading inquiries…" : items.length === 0 ? "No inquiries yet" : fresh > 0 ? `${fresh} new inquir${fresh === 1 ? "y" : "ies"} to answer` : `${items.length} inquir${items.length === 1 ? "y" : "ies"}`}
        </p>
        <p className="mt-0.5 font-sans text-xs text-onyx/50">Sent from the Inquiries page on the site. Reply by email — the address is a link.</p>
      </div>
      {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}

      {items.length > 0 && (
        <div className="mt-3 space-y-2">
          {items.map((i) => (
            <div key={i.ref} className={`rounded-xl border p-3 ${i.status === "new" ? "border-rose/40 bg-rose/5" : "border-onyx/8"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setOpenRef(openRef === i.ref ? null : i.ref)} className="flex flex-wrap items-center gap-3 text-left">
                  <span className="font-display text-lg text-onyx">{i.name}</span>
                  <span className="font-sans text-xs text-onyx/55">{i.topic} · {new Date(i.at).toLocaleDateString()}</span>
                </button>
                <select value={i.status} onChange={(e) => setStatus(i.ref, e.target.value)}
                  className="rounded-md border border-onyx/12 bg-white px-2 py-1 font-sans text-xs">
                  {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                </select>
              </div>

              {openRef === i.ref && (
                <div className="mt-3 border-t border-onyx/8 pt-3 font-sans text-xs leading-relaxed text-onyx/70">
                  <p>
                    <a href={`mailto:${i.email}?subject=${encodeURIComponent(`Re: your inquiry ${i.ref} — Reet Collections`)}`} className="text-rose hover:underline">{i.email}</a>
                    {i.phone ? ` · ${i.phone}` : ""}
                  </p>
                  {i.orderNo && <p className="mt-0.5">Order {i.orderNo}</p>}
                  <p className="mt-2 whitespace-pre-wrap text-onyx/80">{i.message}</p>
                  <p className="mt-2 text-onyx/40">Reference {i.ref}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
