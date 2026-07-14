"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminOrders from "@/components/AdminOrders";

const CATEGORIES = ["kurtis", "lehengas", "sari", "blouses", "pants", "jewelry", "shoes"];
const STATUSES = ["available", "claimed", "sold"];
const IMG_OPTIONS = Array.from({ length: 29 }, (_, i) => `/images/products/reet-${String(i + 1).padStart(2, "0")}.jpg`);
const blankDraft = { name: "", code: "", category: "kurtis", color: "", price: "", salePrice: "", qty: "1", sizes: "M, L, XL", image: IMG_OPTIONS[0], status: "available" };

export default function AdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState(blankDraft);
  const [subs, setSubs] = useState([]);
  const [showSubs, setShowSubs] = useState(false);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    fetch("/api/subscribers").then((r) => r.json()).then((d) => setSubs(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/admin/status").then((r) => (r.ok ? r.json() : null)).then(setHealth).catch(() => {});
  }, []);

  const signOut = async () => { try { await fetch("/api/admin/login", { method: "DELETE" }); } catch {} window.location.href = "/admin/login"; };
  const notifyLive = () => {
    if (!subs.length) { alert("No subscribers yet \u2014 share the site so people can sign up!"); return; }
    const bcc = subs.map((x) => x.email).join(",");
    const subject = encodeURIComponent("We're LIVE now! Reet Collections");
    const body = encodeURIComponent("Hi lovely!\n\nWe just went live on Facebook with brand-new arrivals \u2014 come join us and claim your favorites before they're gone:\n\nhttps://www.facebook.com/Reetcollections068/\n\nSee you there!\nReet Collections");
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  const mutate = (fn) => { setItems(fn); setDirty(true); };
  const patch = (id, p) => mutate((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const adjustQty = (id, d) => mutate((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, (Number(i.qty) || 0) + d) } : i)));
  const remove = (id) => { if (confirm("Delete this product?")) mutate((prev) => prev.filter((i) => i.id !== id)); };

  const addItem = () => {
    if (!draft.name.trim()) return;
    const item = {
      id: "RC-" + Math.floor(1000 + Math.random() * 9000), code: draft.code || "", name: draft.name.trim(),
      category: draft.category, color: draft.color || "", sizes: draft.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      price: Number(draft.price) || 0, salePrice: Number(draft.salePrice) || null, cost: 0, qty: Number(draft.qty) || 1, status: draft.status,
      featured: false, thisWeek: true, newIn: true, clearance: false, image: draft.image, note: "Added from dashboard", addedBy: "admin",
    };
    mutate((prev) => [item, ...prev]); setDraft(blankDraft); setShowForm(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(items) });
      if (!res.ok) throw new Error("save failed");
      setDirty(false); setSavedAt(new Date());
    } catch { alert("Couldn't save your changes. If the site is deployed, make sure a Blob store is connected in Vercel (Storage tab) — see docs/DEPLOYMENT.md."); }
    finally { setSaving(false); }
  };

  const stats = useMemo(() => {
    const available = items.filter((i) => i.status === "available").length;
    const sold = items.filter((i) => i.status === "sold").length;
    const low = items.filter((i) => i.status === "available" && Number(i.qty) <= 1).length;
    const value = items.filter((i) => i.status === "available").reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
    return { total: items.length, available, sold, low, value };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => (i.name || "").toLowerCase().includes(q) || (i.code || "").toLowerCase().includes(q));
  }, [items, query]);

  const fieldCls = "w-full rounded-lg border border-onyx/15 bg-white px-2.5 py-1.5 font-sans text-sm text-onyx focus:border-gold focus:outline-none";

  return (
    <div className="min-h-screen bg-ivory pt-24 pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Owner dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-light text-onyx sm:text-4xl">Inventory</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/import" className="font-sans text-xs uppercase tracking-wide text-rose hover:text-rose-deep">+ Add from photo (AI)</Link>
            <button onClick={signOut} className="font-sans text-xs uppercase tracking-wide text-onyx/45 hover:text-rose">Sign out</button>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[["In stock", stats.available], ["Low stock", stats.low], ["Sold", stats.sold], ["Stock value", "$" + stats.value]].map(([l, v]) => (
            <div key={l} className="rounded-2xl border border-onyx/8 bg-white p-4 shadow-soft">
              <p className="font-sans text-[10px] uppercase tracking-label text-onyx/45">{l}</p>
              <p className="mt-1 font-display text-2xl text-onyx">{v}</p>
            </div>
          ))}
        </div>

        {health && !health.writable && (
          <div className="mt-4 rounded-2xl border border-rose/40 bg-rose/5 p-4">
            <p className="font-sans text-sm font-medium text-rose-deep">Storage isn't connected yet</p>
            <p className="mt-1 font-sans text-xs leading-relaxed text-onyx/60">
              The shop works, but changes you save here won't persist. In Vercel open your project &rarr; Storage &rarr; Create a Blob store, then redeploy. Full steps in docs/DEPLOYMENT.md.
            </p>
          </div>
        )}

        <AdminOrders />

        {/* live announcements + subscribers */}
        <div className="mt-4 rounded-2xl border border-rose/25 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-label text-rose">Live announcements</p>
              <p className="mt-0.5 font-display text-xl text-onyx">{subs.length} subscriber{subs.length === 1 ? "" : "s"} waiting to hear when you go live</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSubs((v) => !v)} className="btn-outline !py-2 text-xs">{showSubs ? "Hide list" : "View list"}</button>
              <button onClick={notifyLive} className="btn-rose !py-2 text-xs">Email everyone &mdash; We&apos;re Live!</button>
            </div>
          </div>
          {showSubs && (
            <div className="mt-3 max-h-40 overflow-y-auto rounded-lg bg-ivory p-3 font-sans text-xs text-onyx/70">
              {subs.length ? subs.map((x, i) => <div key={i} className="border-b border-onyx/5 py-1 last:border-0">{x.email}</div>) : "No subscribers yet."}
            </div>
          )}
        </div>

        {/* toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or code…" className={`${fieldCls} max-w-xs flex-1`} />
          <button onClick={() => setShowForm((v) => !v)} className="btn-outline !py-2 text-xs">{showForm ? "Close" : "+ Add product"}</button>
        </div>

        {showForm && (
          <div className="mt-4 grid gap-3 rounded-2xl border border-gold/30 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
            <input className={fieldCls} placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            <input className={fieldCls} placeholder="Code (optional)" value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
            <input className={fieldCls} placeholder="Color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} />
            <select className={fieldCls} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            <input className={fieldCls} type="number" placeholder="Price $" value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} />
            <input className={fieldCls} type="number" placeholder="Sale $ (optional)" value={draft.salePrice} onChange={(e) => setDraft({ ...draft, salePrice: e.target.value })} />
            <input className={fieldCls} placeholder="Sizes (M, L, XL)" value={draft.sizes} onChange={(e) => setDraft({ ...draft, sizes: e.target.value })} />
            <select className={fieldCls} value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })}>{IMG_OPTIONS.map((im, i) => <option key={im} value={im}>Photo {i + 1}</option>)}</select>
            <button onClick={addItem} className="btn-gold !py-2 text-xs sm:col-span-2 lg:col-span-1">Add to inventory</button>
          </div>
        )}

        {/* list */}
        <div className="mt-6 space-y-3">
          {loading ? <p className="py-10 text-center font-sans text-onyx/50">Loading inventory…</p> :
            filtered.map((i) => (
              <div key={i.id} className="grid grid-cols-[64px_1fr] gap-3 rounded-2xl border border-onyx/8 bg-white p-3 shadow-soft sm:grid-cols-[72px_1fr_auto]">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-ivory ring-1 ring-onyx/5 sm:h-[88px] sm:w-[72px]">
                  {i.image && <Image src={i.image} alt={i.name} fill sizes="72px" className="object-cover" />}
                </div>
                <div className="min-w-0">
                  <input className="w-full bg-transparent font-display text-lg text-onyx focus:outline-none" value={i.name} onChange={(e) => patch(i.id, { name: e.target.value })} />
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <select className="rounded-md border border-onyx/12 bg-white px-2 py-1 font-sans text-xs" value={i.category} onChange={(e) => patch(i.id, { category: e.target.value })}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                    <span className="font-sans text-xs text-onyx/40">$</span>
                    <input type="number" className="w-16 rounded-md border border-onyx/12 px-2 py-1 font-sans text-xs" value={i.price} onChange={(e) => patch(i.id, { price: Number(e.target.value) || 0 })} />
                    <span className="font-sans text-xs text-rose/70">sale</span>
                    <input type="number" placeholder="—" className="w-16 rounded-md border border-rose/30 px-2 py-1 font-sans text-xs text-rose-deep" value={i.salePrice ?? ""} onChange={(e) => patch(i.id, { salePrice: e.target.value === "" ? null : Number(e.target.value) })} />
                    <div className="flex items-center rounded-md border border-onyx/12">
                      <button onClick={() => adjustQty(i.id, -1)} className="px-2 text-onyx/50">−</button>
                      <span className="min-w-[24px] text-center font-sans text-xs">{i.qty}</span>
                      <button onClick={() => adjustQty(i.id, 1)} className="px-2 text-onyx/50">+</button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => (
                      <button key={s} onClick={() => patch(i.id, { status: s })}
                        className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] capitalize ${i.status === s ? "bg-onyx text-ivory" : "bg-onyx/5 text-onyx/55"}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => remove(i.id)} className="self-start justify-self-end font-sans text-xs text-rose/70 hover:text-rose-deep sm:self-center">Delete</button>
              </div>
            ))}
        </div>
      </div>

      {/* sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <p className="font-sans text-xs text-onyx/55">
            {dirty ? "● Unsaved changes" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : `${stats.total} products`}
          </p>
          <button onClick={save} disabled={!dirty || saving} className="btn-gold !py-2 text-sm disabled:opacity-40">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
    </div>
  );
}
