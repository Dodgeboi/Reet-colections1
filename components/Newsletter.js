"use client";
import { useState } from "react";
export default function Newsletter({ dark = false, compact = false }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const submit = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setState("invalid"); return; }
    setState("loading");
    try {
      const r = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!r.ok) throw new Error();
      setState("done"); setEmail("");
    } catch { setState("error"); }
  };
  if (state === "done") return <p className={`font-sans text-sm ${dark ? "text-gold-light" : "text-rose-deep"}`}>You're on the list — we'll email you the moment we go live.</p>;
  return (
    <div>
      <div className={`flex overflow-hidden border ${dark ? "border-ivory/30 bg-white/5" : "border-onyx/20 bg-white"}`}>
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Your email address"
          className={`w-full bg-transparent px-4 py-2.5 font-sans text-sm focus:outline-none ${dark ? "text-ivory placeholder:text-ivory/40" : "text-onyx placeholder:text-onyx/40"}`} />
        <button onClick={submit} disabled={state === "loading"} className={`shrink-0 px-5 font-sans text-[11px] font-medium uppercase tracking-[0.14em] transition-colors disabled:opacity-60 ${dark ? "bg-ivory text-onyx hover:bg-gold-light" : "bg-onyx text-ivory hover:bg-gold-deep hover:text-onyx"}`}>
          {state === "loading" ? "…" : "Notify me"}
        </button>
      </div>
      {state === "invalid" && <p className="mt-1.5 font-sans text-xs text-rose-deep">Please enter a valid email.</p>}
      {state === "error" && <p className="mt-1.5 font-sans text-xs text-rose-deep">Something went wrong — please try again.</p>}
      {!compact && state === "idle" && <p className={`mt-1.5 font-sans text-xs ${dark ? "text-ivory/40" : "text-onyx/40"}`}>Get an email every time we go live. No spam, ever.</p>}
    </div>
  );
}
