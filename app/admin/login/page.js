"use client";
import { useState } from "react";
import GoldThread from "@/components/GoldThread";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    if (!password) return;
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (r.ok) {
        const from = new URLSearchParams(window.location.search).get("from") || "/admin";
        window.location.href = from.startsWith("/admin") ? from : "/admin";
      } else {
        const d = await r.json().catch(() => ({}));
        setErr(d.error || "Login failed."); setLoading(false);
      }
    } catch { setErr("Something went wrong. Please try again."); setLoading(false); }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="eyebrow">Reet Collections</p>
          <h1 className="mt-2 font-display text-4xl font-light text-onyx">Owner Login</h1>
          <div className="mt-4 flex justify-center"><GoldThread width={140} /></div>
        </div>
        <div className="mt-8 rounded-2xl border border-onyx/10 bg-white p-6 shadow-card">
          <label className="font-sans text-[11px] uppercase tracking-label text-onyx/55">Password</label>
          <input type="password" autoFocus value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter your password" className="mt-2 w-full rounded-lg border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx focus:border-gold focus:outline-none" />
          {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}
          <button onClick={submit} disabled={loading} className="btn-gold mt-4 w-full disabled:opacity-50">{loading ? "Checking…" : "Sign in"}</button>
          <p className="mt-4 text-center font-sans text-xs text-onyx/40">This area is private to Reet Collections.</p>
        </div>
      </div>
    </div>
  );
}
