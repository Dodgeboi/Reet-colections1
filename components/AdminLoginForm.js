"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import GoldThread from "@/components/GoldThread";
import GoogleButton from "@/components/GoogleButton";

const field = "mt-2 w-full border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

export default function AdminLoginForm({ googleEnabled }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const from = () => {
    const f = new URLSearchParams(window.location.search).get("from") || "/admin";
    return f.startsWith("/admin") ? f : "/admin";
  };

  const submit = async () => {
    if (!email || !password) { setErr("Enter your email and password."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (r.ok) {
        window.location.href = from();
      } else {
        const d = await r.json().catch(() => ({}));
        setErr(d.error || "Login failed."); setLoading(false);
      }
    } catch {
      setErr("Something went wrong. Please try again."); setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="eyebrow">Reet Collections</p>
          <h1 className="mt-2 font-display text-4xl font-light text-onyx">Owner Login</h1>
          <div className="mt-4 flex justify-center"><GoldThread width={140} /></div>
        </div>
        <div className="mt-8 border border-onyx/10 bg-white p-6 shadow-card">
          <label className="font-sans text-[11px] uppercase tracking-label text-onyx/55" htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" autoFocus value={email} autoComplete="username"
            onChange={(e) => { setEmail(e.target.value); setErr(""); }}
            placeholder="you@example.com" className={field} />
          <label className="mt-4 block font-sans text-[11px] uppercase tracking-label text-onyx/55" htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} autoComplete="current-password"
            onChange={(e) => { setPassword(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Your password" className={field} />
          {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}
          <button onClick={submit} disabled={loading} className="btn-gold mt-5 w-full disabled:opacity-50">{loading ? "Checking…" : "Sign in"}</button>

          {googleEnabled && (
            <>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-onyx/10" />
                <span className="font-sans text-[11px] uppercase tracking-label text-onyx/40">or</span>
                <span className="h-px flex-1 bg-onyx/10" />
              </div>
              <GoogleButton label="Sign in with Google" onClick={() => signIn("google", { callbackUrl: from() })} />
            </>
          )}
          <p className="mt-4 text-center font-sans text-xs text-onyx/40">This area is private to Reet Collections.</p>
        </div>
      </div>
    </div>
  );
}
