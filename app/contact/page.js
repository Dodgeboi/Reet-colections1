"use client";
import { useState } from "react";
import PageBanner from "@/components/PageBanner";
import { Reveal } from "@/components/Reveal";
import { FACEBOOK_PAGE } from "@/lib/lives";

const CONTACT_EMAIL = "reetunaren@gmail.com";
const MESSENGER = "https://m.me/Reetcollections068";

const channels = [
  { t: "Facebook Messenger", d: "Fastest for orders & sizing — we're on every evening", v: "Message us", href: MESSENGER },
  { t: "Facebook", d: "Watch the lives & browse new drops", v: "Reet Collections", href: FACEBOOK_PAGE },
  { t: "Email", d: "For anything else — we reply within a day", v: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const field = "w-full border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const ready = form.name.trim() && form.message.trim();

  // Opens the visitor's own mail app with everything pre-filled.
  const send = () => {
    if (!ready) return;
    const subject = encodeURIComponent(`Message from ${form.name.trim()} — reetcollections.com`);
    const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()}${form.email ? ` (${form.email.trim()})` : ""}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Say Hello"
        subtitle="Questions about a piece, your size, or an order? We'd love to hear from you."
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
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-onyx/10 bg-white p-7 shadow-card">
              <h2 className="font-display text-3xl font-light text-onyx">Send a message</h2>
              <p className="mt-2 font-sans text-sm text-onyx/50">This opens your email app with everything filled in — just press send.</p>
              <div className="mt-6 space-y-4">
                <input type="text" placeholder="Your name" value={form.name} onChange={set("name")} className={field} />
                <input type="email" placeholder="Your email (so we can reply)" value={form.email} onChange={set("email")} className={field} />
                <textarea rows={4} placeholder="How can we help?" value={form.message} onChange={set("message")} className={field} />
                <button onClick={send} disabled={!ready} className="btn-gold w-full disabled:opacity-40">Send message</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
