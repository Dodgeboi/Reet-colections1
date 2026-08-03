"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { Reveal } from "@/components/Reveal";
import { FACEBOOK_PAGE } from "@/lib/lives";

const CONTACT_EMAIL = "reetunaren@gmail.com";
const MESSENGER = "https://m.me/Reetcollections068";

// Kept in step with INQUIRY_TOPICS in /api/inquiries.
const TOPICS = ["An order", "Sizing & fit", "A product", "Shipping & returns", "Something else"];

const channels = [
  { t: "Facebook Messenger", d: "Fastest for orders & sizing — we're on every evening", v: "Message us", href: MESSENGER },
  { t: "Facebook", d: "Watch the lives & browse new arrivals", v: "Reet Collections", href: FACEBOOK_PAGE },
  { t: "Email", d: "Prefer your own inbox? Write to us directly", v: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const field = "w-full border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none";

export default function InquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: TOPICS[0], orderNo: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const [err, setErr] = useState("");

  // Arriving from "Send an inquiry" on an order? Start with that order filled in.
  useEffect(() => {
    const order = new URLSearchParams(window.location.search).get("order");
    if (order) setForm((f) => ({ ...f, topic: "An order", orderNo: order.slice(0, 40) }));
  }, []);

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErr(""); };
  const ready = form.name.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim()) && form.message.trim();

  // Sends the inquiry straight to the shop — no mail app, no extra steps.
  const submit = async () => {
    if (!ready || busy) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't send your inquiry — please try again.");
      setSent(d.ref);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <>
      <PageBanner
        eyebrow="Inquiries"
        title="Send an Inquiry"
        subtitle="Questions about a product, your size, or an order? Send it here and a real person will reply — usually within a day."
      />

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {channels.map((c) => (
                <a
                  key={c.t}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block border border-onyx/10 bg-white p-6 shadow-card transition-all duration-300 hover:border-gold/50"
                >
                  <p className="eyebrow">{c.t}</p>
                  <p className="mt-2 font-display text-2xl text-onyx">{c.v}</p>
                  <p className="font-sans text-sm text-onyx/50">{c.d}</p>
                </a>
              ))}
              <div className="border border-onyx/10 bg-ivory/60 p-6">
                <p className="eyebrow">Looking for quick answers?</p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-onyx/60">
                  Shipping times, sizing, returns and payment are all covered on our{" "}
                  <Link href="/faq" className="text-rose underline hover:text-rose-deep">Help page</Link>.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-onyx/10 bg-white p-7 shadow-card">
              {sent ? (
                <div className="py-6 text-center">
                  <p className="eyebrow">Inquiry sent</p>
                  <h2 className="mt-2 font-display text-3xl font-light text-onyx">Thank you — we have it</h2>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-onyx/60">
                    Your reference is <strong className="text-onyx">{sent}</strong>. We&apos;ve emailed a copy to{" "}
                    {form.email.trim()} and we&apos;ll reply there, usually within a day.
                  </p>
                  <button
                    onClick={() => { setSent(null); setForm({ name: "", email: "", phone: "", topic: TOPICS[0], orderNo: "", message: "" }); }}
                    className="btn-outline mt-6 !py-2 text-xs"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-light text-onyx">Your inquiry</h2>
                  <p className="mt-2 font-sans text-sm text-onyx/50">Sent straight to us from this page — you&apos;ll get a copy by email.</p>
                  <div className="mt-6 space-y-4">
                    <input type="text" placeholder="Your name" value={form.name} onChange={set("name")} className={field} />
                    <input type="email" placeholder="Your email (so we can reply)" value={form.email} onChange={set("email")} className={field} />
                    <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className={field} />
                    <select value={form.topic} onChange={set("topic")} className={field}>
                      {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {form.topic === "An order" && (
                      <input type="text" placeholder="Order number (e.g. RC-123456)" value={form.orderNo} onChange={set("orderNo")} className={field} />
                    )}
                    <textarea rows={5} placeholder="How can we help?" value={form.message} onChange={set("message")} className={field} />
                    <button onClick={submit} disabled={!ready || busy} className="btn-gold w-full disabled:opacity-40">
                      {busy ? "Sending…" : "Send inquiry"}
                    </button>
                    {err && <p className="font-sans text-xs text-rose-deep">{err}</p>}
                    <p className="font-sans text-[11px] leading-relaxed text-onyx/45">
                      We use your details only to answer this inquiry — never for anything else.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
