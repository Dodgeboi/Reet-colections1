"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAccount } from "@/components/AccountProvider";
import GoldThread from "@/components/GoldThread";
import Editable from "@/components/Editable";
import { useSiteText } from "@/components/SiteTextProvider";

const field = "w-full border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { account } = useAccount() || {};
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", zip: "", country: "United States", note: "" });
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErr(""); };

  // Signed-in customers shouldn't have to retype what we already know.
  useEffect(() => {
    if (account) setForm((f) => ({ ...f, name: f.name || account.name, email: f.email || account.email }));
  }, [account]);

  const required = ["name", "email", "address", "city", "zip"];
  const valid = required.every((k) => form[k].trim()) && items.length > 0;

  const t = {
    thankYouTitle: useSiteText("checkout.thankYou.title"),
    thankYouPre: useSiteText("checkout.thankYou.body.pre"),
    thankYouMid: useSiteText("checkout.thankYou.body.mid"),
    thankYouPost: useSiteText("checkout.thankYou.body.post"),
    thankYouNote: useSiteText("checkout.thankYou.note"),
    thankYouContinue: useSiteText("checkout.thankYou.continueShopping"),
    emptyTitle: useSiteText("checkout.empty.title"),
    emptyBody: useSiteText("checkout.empty.body"),
    emptyBrowse: useSiteText("checkout.empty.browse"),
    title: useSiteText("checkout.title"),
    subtitle: useSiteText("checkout.subtitle"),
    contactDelivery: useSiteText("checkout.contactDelivery"),
    paymentTitle: useSiteText("checkout.paymentTitle"),
    paymentBody: useSiteText("checkout.paymentBody"),
    placeOrder: useSiteText("checkout.placeOrder"),
    placingOrder: useSiteText("checkout.placingOrder"),
    requiredHint: useSiteText("checkout.requiredHint"),
    orderSummary: useSiteText("checkout.orderSummary"),
    subtotalLabel: useSiteText("checkout.subtotalLabel"),
    shippingLabel: useSiteText("checkout.shippingLabel"),
    freeLabel: useSiteText("checkout.freeLabel"),
    totalLabel: useSiteText("checkout.totalLabel"),
    footNote: useSiteText("checkout.footNote"),
  };

  const placeOrder = async () => {
    if (!valid || processing) return;
    setProcessing(true); setErr("");
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ id: i.id, qty: i.qty, size: i.size })),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't place the order — please try again.");
      setOrderNo(d.no); setConfirmEmail(form.email); setPlaced(true); clearCart(); window.scrollTo(0, 0);
    } catch (e) {
      setErr(e.message);
    } finally {
      setProcessing(false);
    }
  };

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold-deep"><path d="M20 6 9 17l-5-5" /></svg>
        </div>
        <h1 className="mt-6 font-display text-4xl font-light text-onyx sm:text-5xl"><Editable k="checkout.thankYou.title" value={t.thankYouTitle} /></h1>
        <div className="my-5"><GoldThread width={180} /></div>
        <p className="max-w-md font-sans text-onyx/70">
          <Editable k="checkout.thankYou.body.pre" value={t.thankYouPre} /> <strong className="text-onyx">{orderNo}</strong> <Editable k="checkout.thankYou.body.mid" value={t.thankYouMid} />{" "}
          <strong className="text-onyx">{confirmEmail}</strong> <Editable k="checkout.thankYou.body.post" value={t.thankYouPost} />
        </p>
        <p className="mt-3 max-w-md font-sans text-sm text-onyx/50"><Editable k="checkout.thankYou.note" value={t.thankYouNote} /></p>
        <Link href="/collections" className="btn-gold mt-8"><Editable k="checkout.thankYou.continueShopping" value={t.thankYouContinue} /></Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <h1 className="font-display text-4xl font-light text-onyx"><Editable k="checkout.empty.title" value={t.emptyTitle} /></h1>
        <p className="mt-3 font-sans text-onyx/60"><Editable k="checkout.empty.body" value={t.emptyBody} /></p>
        <Link href="/collections" className="btn-gold mt-6"><Editable k="checkout.empty.browse" value={t.emptyBrowse} /></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8">
      <h1 className="mb-1 font-display text-4xl font-light text-onyx"><Editable k="checkout.title" value={t.title} /></h1>
      <p className="mb-8 font-sans text-sm text-onyx/50"><Editable k="checkout.subtitle" value={t.subtitle} /></p>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* form */}
        <div className="space-y-7">
          <section>
            <h2 className="mb-3 font-display text-2xl text-onyx"><Editable k="checkout.contactDelivery" value={t.contactDelivery} /></h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Full name *" autoComplete="name" value={form.name} onChange={set("name")} />
              <input className={field} type="email" placeholder="Email *" autoComplete="email" value={form.email} onChange={set("email")} />
              <input className={`${field} sm:col-span-2`} type="tel" placeholder="Phone (for delivery updates)" autoComplete="tel" value={form.phone} onChange={set("phone")} />
              <input className={`${field} sm:col-span-2`} placeholder="Street address *" autoComplete="street-address" value={form.address} onChange={set("address")} />
              <input className={field} placeholder="City *" autoComplete="address-level2" value={form.city} onChange={set("city")} />
              <input className={field} placeholder="ZIP / Postal code *" autoComplete="postal-code" value={form.zip} onChange={set("zip")} />
              <input className={`${field} sm:col-span-2`} placeholder="Country" autoComplete="country-name" value={form.country} onChange={set("country")} />
              <textarea className={`${field} sm:col-span-2`} rows={2} placeholder="Anything we should know? (size help, gift note…)" value={form.note} onChange={set("note")} />
            </div>
          </section>

          <section className="border border-gold/30 bg-gold/5 p-5">
            <h2 className="font-display text-xl text-onyx"><Editable k="checkout.paymentTitle" value={t.paymentTitle} /></h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-onyx/70">
              <Editable k="checkout.paymentBody" value={t.paymentBody} />
            </p>
          </section>

          {err && <p className="bg-rose/10 px-4 py-3 font-sans text-sm text-rose-deep">{err}</p>}

          <button onClick={placeOrder} disabled={!valid || processing} className="btn-gold w-full disabled:opacity-40">
            {processing ? t.placingOrder : <><Editable k="checkout.placeOrder" value={t.placeOrder} /> · ${total}</>}
          </button>
          {!valid && <p className="text-center font-sans text-xs text-onyx/40"><Editable k="checkout.requiredHint" value={t.requiredHint} /></p>}
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-onyx/10 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-display text-xl text-onyx"><Editable k="checkout.orderSummary" value={t.orderSummary} /></h2>
            <div className="max-h-72 space-y-3 overflow-y-auto">
              {items.map((i) => (
                <div key={i.key} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ivory ring-1 ring-onyx/5">
                    <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-onyx text-[10px] text-ivory">{i.qty}</span>
                  </div>
                  <div className="flex flex-1 justify-between gap-2">
                    <div>
                      <p className="font-display text-sm leading-tight text-onyx">{i.name}</p>
                      <p className="font-sans text-[11px] text-onyx/45">{i.color}{i.size ? ` · ${i.size}` : ""}</p>
                    </div>
                    <span className="font-sans text-sm text-onyx/70">${i.price * i.qty}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-onyx/10 pt-4 font-sans text-sm">
              <div className="flex justify-between text-onyx/60"><span><Editable k="checkout.subtotalLabel" value={t.subtotalLabel} /></span><span>${subtotal}</span></div>
              <div className="flex justify-between text-onyx/60"><span><Editable k="checkout.shippingLabel" value={t.shippingLabel} /></span><span>{shipping === 0 ? t.freeLabel : `$${shipping}`}</span></div>
              <div className="flex justify-between border-t border-onyx/10 pt-2 font-display text-lg text-onyx"><span><Editable k="checkout.totalLabel" value={t.totalLabel} /></span><span>${total}</span></div>
            </div>
            <p className="mt-4 font-sans text-[11px] leading-relaxed text-onyx/45"><Editable k="checkout.footNote" value={t.footNote} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}
