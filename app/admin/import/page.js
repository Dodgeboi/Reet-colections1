"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const CATEGORIES = ["kurtis", "lehengas", "sari", "blouses", "pants", "jewelry", "shoes"];

function cleanMoney(value) {
  const n = Number(String(value || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function ImportPage() {
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [savedCount, setSavedCount] = useState(0);

  const selectedCount = useMemo(() => products.filter((p) => p.selected).length, [products]);

  const onPickFiles = (event) => {
    setFiles(Array.from(event.target.files || []));
    setProducts([]);
    setSavedCount(0);
    setError("");
  };

  const updateProduct = (idx, patch) => {
    setProducts((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const extract = async () => {
    setError("");
    setSavedCount(0);
    if (!files.length && !caption.trim()) {
      setError("Add at least one photo or paste a Facebook/WhatsApp caption first.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("caption", caption);
      files.forEach((file) => form.append("images", file));

      const res = await fetch("/api/import/extract", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Extraction failed");

      setProducts((data.products || []).map((p) => ({ ...p, selected: true })));
    } catch (err) {
      setError(err.message || "Something went wrong while extracting products.");
    } finally {
      setLoading(false);
    }
  };

  const approve = async () => {
    setError("");
    setSaving(true);
    try {
      const chosen = products
        .filter((p) => p.selected)
        .map((p) => ({ ...p, price: cleanMoney(p.price), qty: Number(p.qty) || 1 }));

      if (!chosen.length) throw new Error("Select at least one product to approve.");

      const res = await fetch("/api/import/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: chosen }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setSavedCount(data.added || chosen.length);
      setProducts([]);
      setFiles([]);
      setCaption("");
    } catch (err) {
      setError(err.message || "Something went wrong while saving products.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen bg-ivory pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Private dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-light text-onyx">Import products</h1>
            <p className="mt-1 max-w-2xl font-sans text-sm text-onyx/55">
              Upload photos from your mom&apos;s phone or paste a Facebook Live caption. Claude creates draft products, then you review and approve them before they appear in the store.
            </p>
          </div>
          <a href="/admin" className="btn-ghost self-start sm:self-auto">Back to inventory</a>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-onyx/8 bg-white p-6 shadow-card">
            <p className="font-display text-2xl text-onyx">1. Add photos and caption</p>
            <p className="mt-1 font-sans text-sm text-onyx/45">Photos can come from Facebook, WhatsApp, iPhone gallery, or live sale screenshots.</p>

            <label className="mt-5 block rounded-2xl border border-dashed border-gold/50 bg-blush/20 p-6 text-center font-sans text-sm text-onyx/60 cursor-pointer hover:bg-blush/30">
              <span className="block font-display text-xl text-onyx">Upload product photos</span>
              <span className="mt-1 block">Choose multiple images</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
            </label>

            {files.length > 0 && (
              <p className="mt-3 font-sans text-xs text-onyx/45">{files.length} image{files.length === 1 ? "" : "s"} selected.</p>
            )}

            <textarea
              className="mt-5 min-h-44 w-full rounded-2xl border border-onyx/12 bg-ivory/50 p-4 font-sans text-sm text-onyx outline-none focus:border-gold"
              placeholder={`Paste caption or notes here, for example:\nAjrak shirt $29, sizes M-L\nRed cord set $45, sizes 40-44\nShipping separate`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            {error && <p className="mt-4 rounded-xl bg-rose/10 p-3 font-sans text-sm text-rose-deep">{error}</p>}
            {savedCount > 0 && <p className="mt-4 rounded-xl bg-gold/15 p-3 font-sans text-sm text-onyx">Saved {savedCount} product{savedCount === 1 ? "" : "s"}. Refresh the shop to see them.</p>}

            <button onClick={extract} disabled={loading} className="btn-gold mt-5 w-full disabled:opacity-50">
              {loading ? "Extracting…" : "Extract products"}
            </button>
          </div>

          <div className="rounded-3xl border border-onyx/8 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-2xl text-onyx">2. Review drafts</p>
                <p className="mt-1 font-sans text-sm text-onyx/45">Fix price, sizes, category, or title before approving.</p>
              </div>
              {products.length > 0 && (
                <button onClick={approve} disabled={saving || !selectedCount} className="btn-gold shrink-0 disabled:opacity-50">
                  {saving ? "Saving…" : `Approve ${selectedCount}`}
                </button>
              )}
            </div>

            {products.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-onyx/12 p-10 text-center font-sans text-sm text-onyx/40">
                Draft products will appear here.
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {products.map((p, idx) => (
                  <div key={idx} className="rounded-2xl border border-onyx/8 bg-ivory/45 p-4">
                    <div className="flex gap-4">
                      <label className="pt-1">
                        <input
                          type="checkbox"
                          checked={!!p.selected}
                          onChange={(e) => updateProduct(idx, { selected: e.target.checked })}
                        />
                      </label>
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-onyx/10">
                        {p.image ? <Image src={p.image} alt={p.name || "Imported product"} fill sizes="80px" className="object-cover" /> : null}
                      </div>
                      <div className="grid flex-1 gap-3 sm:grid-cols-2">
                        <input className="import-input sm:col-span-2" value={p.name || ""} placeholder="Product name" onChange={(e) => updateProduct(idx, { name: e.target.value })} />
                        <select className="import-input" value={p.category || "kurtis"} onChange={(e) => updateProduct(idx, { category: e.target.value })}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input className="import-input" value={p.price || ""} placeholder="Price" onChange={(e) => updateProduct(idx, { price: e.target.value })} />
                        <input className="import-input" value={p.sizesText || ""} placeholder="Sizes, e.g. M, L, XL" onChange={(e) => updateProduct(idx, { sizesText: e.target.value })} />
                        <input className="import-input" value={p.qty || 1} placeholder="Qty" onChange={(e) => updateProduct(idx, { qty: e.target.value })} />
                        <textarea className="import-input sm:col-span-2 min-h-20" value={p.note || ""} placeholder="Description / note" onChange={(e) => updateProduct(idx, { note: e.target.value })} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .import-input { border:1px solid rgba(21,17,14,.14); border-radius:.85rem; padding:.65rem .85rem; background:#fff; font-size:.875rem; }
        .import-input:focus { outline:none; border-color:#C9A24B; }
      `}</style>
    </section>
  );
}
