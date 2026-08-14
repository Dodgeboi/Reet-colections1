"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import GoldThread from "@/components/GoldThread";
import GoogleButton from "@/components/GoogleButton";

const field = "mt-2 w-full border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

export default function AdminLoginForm({ googleEnabled, googleAdminEmail, twoFactorEnabled }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeEmail, setCodeEmail] = useState(null); // set once step 1 succeeds -> stage "code"
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const from = () => {
    const f = new URLSearchParams(window.location.search).get("from") || "/admin";
    return f.startsWith("/admin") ? f : "/admin";
  };

  const submitPassword = async () => {
    if (!email || !password) { setErr("Enter your email and password."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.stage === "code") {
        setCodeEmail(email.trim().toLowerCase());
        setLoading(false);
      } else if (r.ok) {
        window.location.href = from();
      } else {
        setErr(d.error || "Login failed."); setLoading(false);
      }
    } catch {
      setErr("Something went wrong. Please try again."); setLoading(false);
    }
  };

  const sendGoogleCode = async () => {
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login/google", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.stage === "code") {
        setCodeEmail(d.email || googleAdminEmail);
        setLoading(false);
      } else if (r.ok) {
        window.location.href = from();
      } else {
        setErr(d.error || "Couldn't send a code."); setLoading(false);
      }
    } catch {
      setErr("Something went wrong. Please try again."); setLoading(false);
    }
  };

  const submitCode = async () => {
    if (!/^\d{6}$/.test(code)) { setErr("Enter the 6-digit code from your email."); return; }
    setLoading(true); setErr("");
    try {
      const r = await fetch("/api/admin/login/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (r.ok) {
        window.location.href = from();
      } else {
        const d = await r.json().catch(() => ({}));
        setErr(d.error || "That code isn't right."); setLoading(false);
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
          {codeEmail ? (
            <>
              <p className="font-sans text-sm text-onyx/70">
                We emailed a 6-digit code to <span className="font-medium text-onyx">{codeEmail}</span>. It expires in 10 minutes.
              </p>
              <label className="mt-4 block font-sans text-[11px] uppercase tracking-label text-onyx/55" htmlFor="admin-code">Code</label>
              <input id="admin-code" type="text" inputMode="numeric" autoComplete="one-time-code" autoFocus
                maxLength={6} value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submitCode()}
                placeholder="123456" className={field} />
              {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}
              <button onClick={submitCode} disabled={loading} className="btn-gold mt-5 w-full disabled:opacity-50">{loading ? "Checking…" : "Verify & sign in"}</button>
              <button
                onClick={() => { setCodeEmail(null); setCode(""); setErr(""); }}
                className="mt-3 w-full text-center font-sans text-xs text-onyx/50 hover:text-onyx"
              >
                Use a different account
              </button>
            </>
          ) : (
            <>
              {googleAdminEmail && (
                <>
                  <p className="font-sans text-sm text-onyx/70">
                    Signed in with Google as <span className="font-medium text-onyx">{googleAdminEmail}</span>.
                    We'll email a code to confirm it's you.
                  </p>
                  <button onClick={sendGoogleCode} disabled={loading} className="btn-gold mt-4 w-full disabled:opacity-50">
                    {loading ? "Sending…" : "Email me a code"}
                  </button>
                  <div className="my-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-onyx/10" />
                    <span className="font-sans text-[11px] uppercase tracking-label text-onyx/40">or use password</span>
                    <span className="h-px flex-1 bg-onyx/10" />
                  </div>
                </>
              )}

              <label className="font-sans text-[11px] uppercase tracking-label text-onyx/55" htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" autoFocus={!googleAdminEmail} value={email} autoComplete="username"
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                placeholder="you@example.com" className={field} />
              <label className="mt-4 block font-sans text-[11px] uppercase tracking-label text-onyx/55" htmlFor="admin-password">Password</label>
              <input id="admin-password" type="password" value={password} autoComplete="current-password"
                onChange={(e) => { setPassword(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submitPassword()}
                placeholder="Your password" className={field} />
              {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}
              <button onClick={submitPassword} disabled={loading} className="btn-gold mt-5 w-full disabled:opacity-50">{loading ? "Checking…" : "Sign in"}</button>

              {googleEnabled && !googleAdminEmail && (
                <>
                  <div className="my-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-onyx/10" />
                    <span className="font-sans text-[11px] uppercase tracking-label text-onyx/40">or</span>
                    <span className="h-px flex-1 bg-onyx/10" />
                  </div>
                  <GoogleButton label="Sign in with Google" onClick={() => signIn("google", { callbackUrl: `/admin/login?from=${encodeURIComponent(from())}` })} />
                </>
              )}
              <p className="mt-4 text-center font-sans text-xs text-onyx/40">
                This area is private to Reet Collections.
                {twoFactorEnabled && " A code is emailed to confirm every sign-in."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
