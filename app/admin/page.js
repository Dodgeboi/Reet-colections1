"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut as googleSignOut } from "next-auth/react";
import AdminOrders from "@/components/AdminOrders";
import AdminInquiries from "@/components/AdminInquiries";

const CATEGORIES = ["suits", "anarkalis", "kurtis", "lehengas", "sari", "blouses", "pants", "jewelry", "shoes"];
const STATUSES = ["available", "claimed", "sold"];
const IMG_OPTIONS = [
  "/images/products/pink-ombre-suit-front.png",
  "/images/products/purple-embroidered-suit-front.png",
  "/images/products/brown-floral-anarkali-front.png",
  "/images/products/mint-green-embroidered-suit-front.png",
];
const blankDraft = { name: "", code: "", category: "suits", color: "", price: "", salePrice: "", qty: "1", sizes: "M, L, XL", image: IMG_OPTIONS[0], status: "available" };

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
  const [accounts, setAccounts] = useState({ count: 0, newThisWeek: 0, newThisMonth: 0, accounts: [] });
  const [showAccounts, setShowAccounts] = useState(false);
  const [health, setHealth] = useState(null);
  const [tab, setTab] = useState("inventory");
  const [uploadingId, setUploadingId] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
    fetch("/api/subscribers").then((r) => r.json()).then((d) => setSubs(Array.isArray(d) ? d : [])).catch(() => {});
    fetch("/api/accounts").then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) setAccounts({ ...d, accounts: Array.isArray(d.accounts) ? d.accounts : [] }); }).catch(() => {});
    fetch("/api/admin/status").then((r) => (r.ok ? r.json() : null)).then(setHealth).catch(() => {});
  }, []);

  // Clears both the password session and any Google owner session.
  const signOut = async () => {
    try { await fetch("/api/admin/login", { method: "DELETE" }); } catch {}
    googleSignOut({ callbackUrl: "/admin/login" });
  };
  const notifyLive = () => {
    if (!subs.length) { alert("No subscribers yet \u2014 share the site so people can sign up!"); return; }
    const bcc = subs.map((x) => x.email).join(",");
    const subject = encodeURIComponent("We're LIVE now! Reet Collections");
    const body = encodeURIComponent("Hello!\n\nWe just went live on Facebook with brand-new arrivals \u2014 come join us and claim your favorites before they're gone:\n\nhttps://www.facebook.com/Reetcollections068/\n\nSee you there!\nReet Collections");
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
  };

  const mutate = (fn) => { setItems(fn); setDirty(true); };
  const patch = (id, p) => mutate((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)));
  const adjustQty = (id, d) => mutate((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, (Number(i.qty) || 0) + d) } : i)));
  const remove = (id) => { if (confirm("Delete this product?")) mutate((prev) => prev.filter((i) => i.id !== id)); };

  // Upload a photo for one product; remember to press Save afterwards.
  const uploadPhoto = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Upload failed.");
      patch(id, { image: d.url });
    } catch (e) { alert(e.message); }
    finally { setUploadingId(""); }
  };

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
    <div className="min-h-screen bg-ivory pt-32 pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Owner dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-light text-onyx sm:text-4xl">Reet Collections</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-sans text-xs uppercase tracking-wide text-gold-deep hover:text-onyx">Edit photos on the site →</Link>
            <Link href="/admin/import" className="font-sans text-xs uppercase tracking-wide text-rose hover:text-rose-deep">+ Add from photo (AI)</Link>
            <button onClick={signOut} className="font-sans text-xs uppercase tracking-wide text-onyx/45 hover:text-rose">Sign out</button>
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {[
            ["In stock", stats.available],
            ["Low stock", stats.low],
            ["Sold", stats.sold],
            ["Stock value", "$" + stats.value],
            ["Accounts created", accounts.count, accounts.newThisWeek > 0 ? `+${accounts.newThisWeek} this week` : "people signed up"],
          ].map(([l, v, hint]) => (
            <div key={l} className="rounded-2xl border border-onyx/8 bg-white p-4 shadow-soft">
              <p className="font-sans text-[10px] uppercase tracking-label text-onyx/45">{l}</p>
              <p className="mt-1 font-display text-2xl text-onyx">{v}</p>
              {hint && <p className="mt-0.5 font-sans text-[10px] text-onyx/40">{hint}</p>}
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

        {/* tabs */}
        <div className="mt-6 flex gap-6 border-b border-onyx/10">
          {[["inventory", "Inventory"], ["orders", "Orders"], ["inquiries", "Inquiries"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`-mb-px border-b-2 pb-2.5 font-sans text-[12px] uppercase tracking-[0.14em] transition-colors ${tab === id ? "border-onyx text-onyx" : "border-transparent text-onyx/45 hover:text-onyx"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "orders" && (<>
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

        {/* customer accounts */}
        <div className="mt-4 rounded-2xl border border-onyx/10 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-sans text-[11px] uppercase tracking-label text-onyx/45">Customer accounts</p>
              <p className="mt-0.5 font-display text-xl text-onyx">
                {accounts.count} {accounts.count === 1 ? "person has" : "people have"} made an account
              </p>
              <p className="mt-0.5 font-sans text-xs text-onyx/50">
                {accounts.newThisWeek} new this week · {accounts.newThisMonth} in the last 30 days
              </p>
            </div>
            <button onClick={() => setShowAccounts((v) => !v)} className="btn-outline !py-2 text-xs">{showAccounts ? "Hide list" : "View list"}</button>
          </div>
          {showAccounts && (
            <div className="mt-3 max-h-56 overflow-y-auto rounded-lg bg-ivory p-3 font-sans text-xs text-onyx/70">
              {accounts.accounts.length ? accounts.accounts.map((a, i) => (
                <div key={i} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-onyx/5 py-1.5 last:border-0">
                  <span>{a.name ? `${a.name} · ` : ""}{a.email}</span>
                  <span className="text-onyx/40">joined {a.at ? new Date(a.at).toLocaleDateString() : "—"}{a.provider ? ` · ${a.provider}` : ""}</span>
                </div>
              )) : "No accounts yet — they appear here the first time someone signs in."}
            </div>
          )}
        </div>
        </>)}

        {tab === "inquiries" && <AdminInquiries />}

        {tab === "inventory" && (<>
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
            <div className="flex items-center gap-2">
              <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-ivory ring-1 ring-onyx/10">
                {draft.image && <Image src={draft.image} alt="Product photo" fill sizes="40px" className="object-cover" />}
              </div>
              <label className="btn-outline flex-1 cursor-pointer !py-1.5 text-[11px]">
                Upload photo
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData(); fd.append("file", file);
                  const r = await fetch("/api/upload", { method: "POST", body: fd });
                  const d = await r.json().catch(() => ({}));
                  if (r.ok) setDraft((prev) => ({ ...prev, image: d.url })); else alert(d.error || "Upload failed.");
                }} />
              </label>
            </div>
            <button onClick={addItem} className="btn-gold !py-2 text-xs sm:col-span-2 lg:col-span-1">Add to inventory</button>
          </div>
        )}

        {/* list */}
        <div className="mt-6 space-y-3">
          {loading ? <p className="py-10 text-center font-sans text-onyx/50">Loading inventory…</p> :
            filtered.map((i) => (
              <div key={i.id} className="grid grid-cols-[64px_1fr] gap-3 rounded-2xl border border-onyx/8 bg-white p-3 shadow-soft sm:grid-cols-[72px_1fr_auto]">
                <div>
                  <div className="relative h-20 w-16 overflow-hidden rounded-lg bg-ivory ring-1 ring-onyx/5 sm:h-[88px] sm:w-[72px]">
                    {i.image && <Image src={i.image} alt={i.name} fill sizes="72px" className="object-cover" />}
                    {uploadingId === i.id && <div className="absolute inset-0 flex items-center justify-center bg-onyx/50 font-sans text-[9px] uppercase text-ivory">…</div>}
                  </div>
                  <label className="mt-1 block cursor-pointer text-center font-sans text-[10px] text-onyx/50 underline hover:text-onyx">
                    Change photo
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadPhoto(i.id, e.target.files?.[0])} />
                  </label>
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
        </>)}
      </div>

      {/* sticky save bar */}
      {tab === "inventory" && (
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <p className="font-sans text-xs text-onyx/55">
            {dirty ? "● Unsaved changes" : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : `${stats.total} products`}
          </p>
          <button onClick={save} disabled={!dirty || saving} className="btn-gold !py-2 text-sm disabled:opacity-40">{saving ? "Saving…" : "Save changes"}</button>
        </div>
      </div>
      )}
    </div>
  );
}
