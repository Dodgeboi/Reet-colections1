"use client";
import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";

// Owner-only, in-place editing. When edit mode is on:
//   images tagged data-edit="type:id" → file picker → crop → replaced live
//     (site:hero|heritage|about, product:<id>, live:<id>, category:<slug>)
//   text tagged data-edit-text="key"  → text editor → saved to site settings

const ASPECTS = { site: 4 / 5, product: 4 / 5, live: 16 / 9, category: 3 / 4 };

export default function PhotoEditMode() {
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [textTarget, setTextTarget] = useState(null); // { key, value }
  const fileRef = useRef(null);
  const targetRef = useRef(null);

  // Works for both owner logins: the Google session or the password cookie.
  // The body must explicitly confirm ownership — a bare 200 isn't enough.
  useEffect(() => {
    fetch("/api/admin/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.owner === true) setIsOwner(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.classList.toggle("photo-edit-mode", editing);
    return () => document.body.classList.remove("photo-edit-mode");
  }, [editing]);

  useEffect(() => {
    if (!editing) return;
    const onClick = (e) => {
      const textEl = e.target.closest?.("[data-edit-text]");
      if (textEl) {
        e.preventDefault();
        e.stopPropagation();
        setErr("");
        setTextTarget({ key: textEl.getAttribute("data-edit-text"), value: textEl.textContent || "" });
        return;
      }
      const el = e.target.closest?.("[data-edit]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      targetRef.current = el.getAttribute("data-edit");
      fileRef.current?.click();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [editing]);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setTarget(targetRef.current);
    setImageUrl(URL.createObjectURL(f));
    setCrop({ x: 0, y: 0 }); setZoom(1); setArea(null); setErr("");
  };

  const close = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null); setTarget(null); setErr(""); setBusy(false);
  };

  const croppedBlob = async () => {
    const img = await new Promise((res, rej) => {
      const i = new window.Image();
      i.onload = () => res(i); i.onerror = rej; i.src = imageUrl;
    });
    const a = area || { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight };
    const scale = Math.min(1, 1600 / Math.max(a.width, a.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(a.width * scale));
    canvas.height = Math.max(1, Math.round(a.height * scale));
    canvas.getContext("2d").drawImage(img, a.x, a.y, a.width, a.height, 0, 0, canvas.width, canvas.height);
    return new Promise((res) => canvas.toBlob(res, "image/jpeg", 0.9));
  };

  const save = async (skipCrop = false) => {
    if (busy) return;
    setBusy(true); setErr("");
    try {
      const blob = skipCrop ? await (await fetch(imageUrl)).blob() : await croppedBlob();
      const fd = new FormData();
      fd.append("file", new File([blob], "photo.jpg", { type: blob.type || "image/jpeg" }));
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upd = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(upd.error || "Upload failed.");

      const [type, id] = String(target).split(":");
      const json = (body) => ({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      let r;
      if (type === "site") r = await fetch("/api/site", json({ [id]: upd.url }));
      else if (type === "product") r = await fetch("/api/products", { ...json({ id, image: upd.url }), method: "PATCH" });
      else if (type === "live") r = await fetch("/api/site", json({ liveThumbs: { [id]: upd.url } }));
      else if (type === "category") r = await fetch("/api/site", json({ categoryTiles: { [id]: upd.url } }));
      else throw new Error("Unknown photo slot.");
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't save the photo.");
      window.location.reload();
    } catch (e) {
      setErr(e.message); setBusy(false);
    }
  };

  const saveText = async () => {
    if (busy || !textTarget) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: { [textTarget.key]: textTarget.value.trim() } }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't save the text.");
      window.location.reload();
    } catch (e) {
      setErr(e.message); setBusy(false);
    }
  };

  if (!isOwner) return null;
  const aspect = ASPECTS[String(target).split(":")[0]] || 4 / 5;

  return (
    <>
      {/* floating toggle */}
      <div className="fixed bottom-5 left-5 z-[80] flex items-center gap-3">
        <button
          onClick={() => setEditing((v) => !v)}
          className={`px-4 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] shadow-card transition-colors ${editing ? "bg-gold-deep text-onyx" : "bg-onyx text-ivory hover:bg-gold-deep hover:text-onyx"}`}>
          {editing ? "Done editing" : "Edit photos"}
        </button>
        {editing && <span className="bg-white/95 px-3 py-2 font-sans text-[11px] text-onyx/70 shadow-soft">Tap any outlined photo or text to change it</span>}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />

      {/* text editor */}
      {textTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-onyx/80 p-5" onClick={() => !busy && setTextTarget(null)}>
          <div className="w-full max-w-lg bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-onyx/60">Edit text</p>
            <textarea
              autoFocus
              rows={Math.min(8, Math.max(3, Math.ceil(textTarget.value.length / 60)))}
              value={textTarget.value}
              onChange={(e) => setTextTarget((t) => ({ ...t, value: e.target.value }))}
              className="mt-3 w-full border border-onyx/20 bg-white p-3 font-sans text-[15px] leading-relaxed text-onyx focus:border-gold focus:outline-none"
            />
            {err && <p className="mt-2 font-sans text-sm text-rose-deep">{err}</p>}
            <div className="mt-4 flex gap-3">
              <button onClick={saveText} disabled={busy || !textTarget.value.trim()} className="btn-gold flex-1 disabled:opacity-50">{busy ? "Saving…" : "Save text"}</button>
              <button onClick={() => setTextTarget(null)} disabled={busy} className="btn-outline disabled:opacity-50">Cancel</button>
            </div>
            <p className="mt-3 font-sans text-xs text-onyx/45">The change goes live the moment you save.</p>
          </div>
        </div>
      )}

      {/* crop screen */}
      {imageUrl && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-onyx/95">
          <div className="flex items-center justify-between px-5 py-4">
            <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-ivory/85">Adjust your photo</p>
            <button onClick={close} className="font-sans text-2xl leading-none text-ivory/60 hover:text-ivory" aria-label="Cancel">×</button>
          </div>
          <div className="relative mx-auto w-full max-w-3xl flex-1">
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_c, px) => setArea(px)}
            />
          </div>
          <div className="mx-auto w-full max-w-3xl px-5 pb-6 pt-4">
            <label className="flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.14em] text-ivory/70">
              Zoom
              <input type="range" min="1" max="3" step="0.05" value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-[#C9A24B]" />
            </label>
            {err && <p className="mt-3 bg-rose-deep/20 px-3 py-2 font-sans text-sm text-ivory">{err}</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => save(false)} disabled={busy} className="btn-light flex-1 disabled:opacity-50">{busy ? "Saving…" : "Save photo"}</button>
              <button onClick={() => save(true)} disabled={busy} className="btn-light-outline disabled:opacity-50">Use full photo</button>
              <button onClick={close} disabled={busy} className="px-5 font-sans text-[12px] uppercase tracking-[0.14em] text-ivory/60 hover:text-ivory disabled:opacity-50">Cancel</button>
            </div>
            <p className="mt-3 font-sans text-xs text-ivory/45">Drag to position · pinch or use the slider to zoom. The photo goes live the moment you save.</p>
          </div>
        </div>
      )}
    </>
  );
}
