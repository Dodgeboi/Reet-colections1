"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useAccount } from "@/components/AccountProvider";
import GoldThread from "@/components/GoldThread";

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
        <h1 className="mt-6 font-display text-4xl font-light text-onyx sm:text-5xl">Thank you!</h1>
        <div className="my-5"><GoldThread width={180} /></div>
        <p className="max-w-md font-sans text-onyx/70">
          Your order <strong className="text-onyx">{orderNo}</strong> has been received. We'll reach out at{" "}
          <strong className="text-onyx">{confirmEmail}</strong> to confirm everything and arrange payment &amp; delivery.
        </p>
        <p className="mt-3 max-w-md font-sans text-sm text-onyx/50">Your products are reserved for you in the meantime — just like on the live.</p>
        <Link href="/collections" className="btn-gold mt-8">Continue shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <h1 className="font-display text-4xl font-light text-onyx">Your bag is empty</h1>
        <p className="mt-3 font-sans text-onyx/60">Add a product or two before checking out.</p>
        <Link href="/collections" className="btn-gold mt-6">Browse the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8">
      <h1 className="mb-1 font-display text-4xl font-light text-onyx">Checkout</h1>
      <p className="mb-8 font-sans text-sm text-onyx/50">Reserve your products now — we confirm every order personally before payment.</p>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* form */}
        <div className="space-y-7">
          <section>
            <h2 className="mb-3 font-display text-2xl text-onyx">Contact &amp; delivery</h2>
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
            <h2 className="font-display text-xl text-onyx">How payment works</h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-onyx/70">
              Placing this order reserves your products — nothing is charged online. We'll message you to
              confirm your total and arrange payment the way that suits you best, exactly like on our lives.
            </p>
          </section>

          {err && <p className="bg-rose/10 px-4 py-3 font-sans text-sm text-rose-deep">{err}</p>}

          <button onClick={placeOrder} disabled={!valid || processing} className="btn-gold w-full disabled:opacity-40">
            {processing ? "Placing your order…" : `Place order · $${total}`}
          </button>
          {!valid && <p className="text-center font-sans text-xs text-onyx/40">Fields marked * are required.</p>}
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-onyx/10 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-display text-xl text-onyx">Order summary</h2>
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
              <div className="flex justify-between text-onyx/60"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="flex justify-between text-onyx/60"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="flex justify-between border-t border-onyx/10 pt-2 font-display text-lg text-onyx"><span>Total</span><span>${total}</span></div>
            </div>
            <p className="mt-4 font-sans text-[11px] leading-relaxed text-onyx/45">Free shipping on orders over $150 · Every product checked &amp; packed with care</p>
          </div>
        </div>
      </div>
    </div>
  );
}
