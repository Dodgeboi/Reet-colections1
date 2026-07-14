"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import GoldThread from "@/components/GoldThread";

const field = "w-full rounded-lg border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", country: "United States", card: "", exp: "", cvc: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const required = ["name", "email", "address", "city", "zip", "card", "exp", "cvc"];
  const valid = required.every((k) => form[k].trim()) && items.length > 0;

  const placeOrder = async () => {
    if (!valid) return;
    setProcessing(true);
    const orderItems = items.map((i) => ({ id: i.id, qty: i.qty, name: i.name, price: i.price, image: i.image, size: i.size, color: i.color }));
    const no = "RC-" + Math.floor(100000 + Math.random() * 900000);
    // mark inventory sold / decrement stock so the admin reflects the sale
    try { await fetch("/api/purchase", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderItems.map((i) => ({ id: i.id, qty: i.qty }))) }); } catch {}
    // keep an order record for the customer's account
    try {
      const prev = JSON.parse(localStorage.getItem("reet-orders") || "[]");
      prev.unshift({ no, at: new Date().toISOString(), email: form.email, items: orderItems, total });
      localStorage.setItem("reet-orders", JSON.stringify(prev.slice(0, 20)));
    } catch {}
    setTimeout(() => { setOrderNo(no); setPlaced(true); setProcessing(false); clearCart(); window.scrollTo(0, 0); }, 900);
  };

  if (placed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/20 text-4xl text-gold-deep">✓</div>
        <h1 className="mt-6 font-display text-4xl font-light text-onyx sm:text-5xl">Thank you!</h1>
        <div className="my-5"><GoldThread width={180} /></div>
        <p className="max-w-md font-sans text-onyx/70">Your order <strong className="text-onyx">{orderNo}</strong> is confirmed. We'll pack it with love and send a confirmation to <strong className="text-onyx">{form.email}</strong>.</p>
        <p className="mt-2 font-sans text-xs text-onyx/40">(Demo order — no real payment was taken.)</p>
        <Link href="/collections" className="btn-gold mt-8">Continue shopping</Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center">
        <h1 className="font-display text-4xl font-light text-onyx">Your bag is empty</h1>
        <p className="mt-3 font-sans text-onyx/60">Add a piece or two before checking out.</p>
        <Link href="/collections" className="btn-gold mt-6">Browse the collection</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-8">
      <h1 className="mb-1 font-display text-4xl font-light text-onyx">Checkout</h1>
      <p className="mb-8 font-sans text-sm text-onyx/50">Demo checkout — enter anything; no real card is charged.</p>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        {/* form */}
        <div className="space-y-7">
          <section>
            <h2 className="mb-3 font-display text-2xl text-onyx">Shipping details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={`${field} sm:col-span-2`} placeholder="Full name" value={form.name} onChange={set("name")} />
              <input className={`${field} sm:col-span-2`} placeholder="Email" value={form.email} onChange={set("email")} />
              <input className={`${field} sm:col-span-2`} placeholder="Street address" value={form.address} onChange={set("address")} />
              <input className={field} placeholder="City" value={form.city} onChange={set("city")} />
              <input className={field} placeholder="ZIP / Postal code" value={form.zip} onChange={set("zip")} />
              <input className={`${field} sm:col-span-2`} placeholder="Country" value={form.country} onChange={set("country")} />
            </div>
          </section>

          <section>
            <h2 className="mb-1 font-display text-2xl text-onyx">Payment</h2>
            <p className="mb-3 font-sans text-xs text-onyx/45">🔒 Mock payment — for demonstration only.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={`${field} sm:col-span-2`} placeholder="Card number (e.g. 4242 4242 4242 4242)" value={form.card} onChange={set("card")} />
              <input className={field} placeholder="MM / YY" value={form.exp} onChange={set("exp")} />
              <input className={field} placeholder="CVC" value={form.cvc} onChange={set("cvc")} />
            </div>
          </section>

          <button onClick={placeOrder} disabled={!valid || processing} className="btn-gold w-full disabled:opacity-40">
            {processing ? "Processing payment…" : `Pay $${total}`}
          </button>
          {!valid && <p className="text-center font-sans text-xs text-onyx/40">Fill in every field to place your order.</p>}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 pt-1 font-sans text-[11px] text-onyx/45">
            <span>🔒 Secure checkout</span><span>· Packed with care</span><span>· Easy size help on the live</span>
          </div>
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-onyx/10 bg-white p-6 shadow-soft">
            <h2 className="mb-4 font-display text-xl text-onyx">Order summary</h2>
            <div className="max-h-72 space-y-3 overflow-y-auto">
              {items.map((i) => (
                <div key={i.key} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-ivory ring-1 ring-onyx/5">
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
            <div className="mt-5 space-y-1.5 border-t border-onyx/10 pt-4 font-sans text-sm text-onyx/70">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="mt-2 flex justify-between border-t border-onyx/10 pt-3 font-display text-xl text-onyx"><span>Total</span><span>${total}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
