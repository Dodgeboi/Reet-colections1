"use client";
import { useEffect, useRef, useState } from "react";

const SLOTS = [
  { key: "hero", label: "Home — big top photo", desc: "The full-width photo at the very top of the home page. A tall (portrait) photo works best." },
  { key: "heritage", label: "Home — heritage photo", desc: "The photo inside the dark “Woven with heritage” band, halfway down the home page." },
  { key: "about", label: "Our Story — portrait", desc: "The big portrait on the About page. A lovely spot for a photo of you." },
];

export default function AdminPhotos() {
  const [settings, setSettings] = useState(null);
  const [busy, setBusy] = useState("");
  const [msg, setMsg] = useState({});
  const inputs = useRef({});

  useEffect(() => {
    fetch("/api/site").then((r) => r.json()).then(setSettings).catch(() => setSettings({}));
  }, []);

  const uploadFor = async (key, file) => {
    if (!file) return;
    setBusy(key); setMsg((m) => ({ ...m, [key]: "" }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(upData.error || "Upload failed.");
      const save = await fetch("/api/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: upData.url }),
      });
      const saveData = await save.json().catch(() => ({}));
      if (!save.ok) throw new Error(saveData.error || "Couldn't save the new photo.");
      setSettings(saveData.settings);
      setMsg((m) => ({ ...m, [key]: "Saved — it's live on the site now." }));
    } catch (e) {
      setMsg((m) => ({ ...m, [key]: e.message }));
    } finally {
      setBusy("");
      if (inputs.current[key]) inputs.current[key].value = "";
    }
  };

  if (!settings) return <p className="py-10 text-center font-sans text-onyx/50">Loading photos…</p>;

  return (
    <div className="mt-6">
      <p className="font-sans text-sm leading-relaxed text-onyx/60">
        These are the big photos around the site (product photos are changed on the Inventory tab,
        right on each product). Upload a new one and it goes live immediately — no save button needed.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {SLOTS.map((slot) => (
          <div key={slot.key} className="border border-onyx/10 bg-white p-4">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-onyx">{slot.label}</p>
            <p className="mt-1 min-h-[42px] font-sans text-xs leading-relaxed text-onyx/50">{slot.desc}</p>
            <div className="relative mt-3 aspect-[4/5] overflow-hidden bg-ivory">
              {settings[slot.key] && (
                <img src={settings[slot.key]} alt={slot.label} className="h-full w-full object-cover" />
              )}
              {busy === slot.key && (
                <div className="absolute inset-0 flex items-center justify-center bg-onyx/50 font-sans text-xs uppercase tracking-wide text-ivory">Uploading…</div>
              )}
            </div>
            <label className={`btn-outline mt-3 w-full cursor-pointer !py-2 text-xs ${busy ? "pointer-events-none opacity-50" : ""}`}>
              Upload new photo
              <input ref={(el) => { inputs.current[slot.key] = el; }} type="file" accept="image/*" className="hidden"
                onChange={(e) => uploadFor(slot.key, e.target.files?.[0])} />
            </label>
            {msg[slot.key] && (
              <p className={`mt-2 font-sans text-xs ${msg[slot.key].startsWith("Saved") ? "text-gold-deep" : "text-rose-deep"}`}>{msg[slot.key]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
