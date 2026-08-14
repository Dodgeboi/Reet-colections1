"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { Reveal } from "@/components/Reveal";
import { FACEBOOK_PAGE } from "@/lib/lives";
import Editable from "@/components/Editable";
import { useSiteText } from "@/components/SiteTextProvider";

const CONTACT_EMAIL = "reetunaren@gmail.com";
const MESSENGER = "https://m.me/Reetcollections068";

// Kept in step with INQUIRY_TOPICS in /api/inquiries — not owner-editable
// text, since the exact strings are matched against that server-side list.
const TOPICS = ["An order", "Sizing & fit", "A product", "Shipping & returns", "Something else"];

// t/d (title/description) are owner-editable copy; v (the contact value —
// email address, handle) is real contact data, not copy, so it isn't.
const CHANNEL_KEYS = ["inquiry.channel.messenger", "inquiry.channel.facebook", "inquiry.channel.email"];
const channelValues = { "inquiry.channel.messenger": "Message us", "inquiry.channel.facebook": "Reet Collections", "inquiry.channel.email": CONTACT_EMAIL };
const channelHrefs = { "inquiry.channel.messenger": MESSENGER, "inquiry.channel.facebook": FACEBOOK_PAGE, "inquiry.channel.email": `mailto:${CONTACT_EMAIL}` };

const field = "w-full border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none";

export default function InquiryPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: TOPICS[0], orderNo: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const [err, setErr] = useState("");
  const t = {
    bannerEyebrow: useSiteText("inquiry.banner.eyebrow"),
    bannerTitle: useSiteText("inquiry.banner.title"),
    bannerSubtitle: useSiteText("inquiry.banner.subtitle"),
    quickAnswersTitle: useSiteText("inquiry.quickAnswers.title"),
    quickAnswersPre: useSiteText("inquiry.quickAnswers.pre"),
    quickAnswersLink: useSiteText("inquiry.quickAnswers.link"),
    sentEyebrow: useSiteText("inquiry.sent.eyebrow"),
    sentTitle: useSiteText("inquiry.sent.title"),
    sentRefPre: useSiteText("inquiry.sent.refPre"),
    sentEmailedPre: useSiteText("inquiry.sent.emailedPre"),
    sentEmailedPost: useSiteText("inquiry.sent.emailedPost"),
    sendAnother: useSiteText("inquiry.sendAnother"),
    formTitle: useSiteText("inquiry.form.title"),
    formSubtitle: useSiteText("inquiry.form.subtitle"),
    namePlaceholder: useSiteText("inquiry.form.namePlaceholder"),
    emailPlaceholder: useSiteText("inquiry.form.emailPlaceholder"),
    phonePlaceholder: useSiteText("inquiry.form.phonePlaceholder"),
    orderPlaceholder: useSiteText("inquiry.form.orderPlaceholder"),
    messagePlaceholder: useSiteText("inquiry.form.messagePlaceholder"),
    sendInquiry: useSiteText("inquiry.form.sendInquiry"),
    sending: useSiteText("inquiry.form.sending"),
    privacyNote: useSiteText("inquiry.form.privacyNote"),
  };
  const channelText = {
    "inquiry.channel.messenger": { title: useSiteText("inquiry.channel.messenger.title"), desc: useSiteText("inquiry.channel.messenger.desc") },
    "inquiry.channel.facebook": { title: useSiteText("inquiry.channel.facebook.title"), desc: useSiteText("inquiry.channel.facebook.desc") },
    "inquiry.channel.email": { title: useSiteText("inquiry.channel.email.title"), desc: useSiteText("inquiry.channel.email.desc") },
  };

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
        eyebrow={<Editable k="inquiry.banner.eyebrow" value={t.bannerEyebrow} />}
        title={<Editable k="inquiry.banner.title" value={t.bannerTitle} />}
        subtitle={<Editable k="inquiry.banner.subtitle" value={t.bannerSubtitle} />}
      />

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {CHANNEL_KEYS.map((key) => (
                <a
                  key={key}
                  href={channelHrefs[key]}
                  target={channelHrefs[key].startsWith("http") ? "_blank" : undefined}
                  rel={channelHrefs[key].startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group block border border-onyx/10 bg-white p-6 shadow-card transition-all duration-300 hover:border-gold/50"
                >
                  <p className="eyebrow"><Editable k={`${key}.title`} value={channelText[key].title} /></p>
                  <p className="mt-2 font-display text-2xl text-onyx">{channelValues[key]}</p>
                  <p className="font-sans text-sm text-onyx/50"><Editable k={`${key}.desc`} value={channelText[key].desc} /></p>
                </a>
              ))}
              <div className="border border-onyx/10 bg-ivory/60 p-6">
                <p className="eyebrow"><Editable k="inquiry.quickAnswers.title" value={t.quickAnswersTitle} /></p>
                <p className="mt-2 font-sans text-sm leading-relaxed text-onyx/60">
                  <Editable k="inquiry.quickAnswers.pre" value={t.quickAnswersPre} />{" "}
                  <Link href="/faq" className="text-rose underline hover:text-rose-deep"><Editable k="inquiry.quickAnswers.link" value={t.quickAnswersLink} /></Link>.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-onyx/10 bg-white p-7 shadow-card">
              {sent ? (
                <div className="py-6 text-center">
                  <p className="eyebrow"><Editable k="inquiry.sent.eyebrow" value={t.sentEyebrow} /></p>
                  <h2 className="mt-2 font-display text-3xl font-light text-onyx"><Editable k="inquiry.sent.title" value={t.sentTitle} /></h2>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-onyx/60">
                    <Editable k="inquiry.sent.refPre" value={t.sentRefPre} /> <strong className="text-onyx">{sent}</strong>. <Editable k="inquiry.sent.emailedPre" value={t.sentEmailedPre} />{" "}
                    {form.email.trim()} <Editable k="inquiry.sent.emailedPost" value={t.sentEmailedPost} />
                  </p>
                  <button
                    onClick={() => { setSent(null); setForm({ name: "", email: "", phone: "", topic: TOPICS[0], orderNo: "", message: "" }); }}
                    className="btn-outline mt-6 !py-2 text-xs"
                  >
                    <Editable k="inquiry.sendAnother" value={t.sendAnother} />
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-3xl font-light text-onyx"><Editable k="inquiry.form.title" value={t.formTitle} /></h2>
                  <p className="mt-2 font-sans text-sm text-onyx/50"><Editable k="inquiry.form.subtitle" value={t.formSubtitle} /></p>
                  <div className="mt-6 space-y-4">
                    <input type="text" placeholder={t.namePlaceholder} value={form.name} onChange={set("name")} className={field} />
                    <input type="email" placeholder={t.emailPlaceholder} value={form.email} onChange={set("email")} className={field} />
                    <input type="tel" placeholder={t.phonePlaceholder} value={form.phone} onChange={set("phone")} className={field} />
                    <select value={form.topic} onChange={set("topic")} className={field}>
                      {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                    </select>
                    {form.topic === "An order" && (
                      <input type="text" placeholder={t.orderPlaceholder} value={form.orderNo} onChange={set("orderNo")} className={field} />
                    )}
                    <textarea rows={5} placeholder={t.messagePlaceholder} value={form.message} onChange={set("message")} className={field} />
                    <button onClick={submit} disabled={!ready || busy} className="btn-gold w-full disabled:opacity-40">
                      {busy ? t.sending : <Editable k="inquiry.form.sendInquiry" value={t.sendInquiry} />}
                    </button>
                    {err && <p className="font-sans text-xs text-rose-deep">{err}</p>}
                    <p className="font-sans text-[11px] leading-relaxed text-onyx/45">
                      <Editable k="inquiry.form.privacyNote" value={t.privacyNote} />
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
