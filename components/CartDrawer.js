"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart, FREE_SHIP } from "./CartProvider";

export default function CartDrawer() {
  const { items, updateQty, removeItem, subtotal, shipping, total, open, setOpen } = useCart();
  const remaining = Math.max(0, FREE_SHIP - subtotal);

  return (
    <>
      <div onClick={() => setOpen(false)} aria-hidden
        className={`fixed inset-0 z-[60] bg-onyx/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-400 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-onyx/10 px-6 py-5">
          <h2 className="font-display text-2xl text-onyx">Your Bag <span className="text-onyx/40">({items.length})</span></h2>
          <button onClick={() => setOpen(false)} aria-label="Close" className="text-2xl text-onyx/50 hover:text-onyx">×</button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="font-display text-2xl text-onyx/50">Your bag is empty</p>
            <Link href="/collections" onClick={() => setOpen(false)} className="btn-gold">Start shopping</Link>
          </div>
        ) : (
          <>
            <div className="bg-blush/40 px-6 py-2.5">
              <p className="text-center font-sans text-xs text-rose-deep">
                {subtotal < FREE_SHIP ? <>You're <strong>${remaining}</strong> away from free shipping ✦</> : <>✦ You've unlocked <strong>free shipping</strong>!</>}
              </p>
              <div className="mx-auto mt-1.5 h-1 w-full max-w-[260px] overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-gradient-to-r from-gold-light to-gold-deep transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / FREE_SHIP) * 100)}%` }} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((i) => (
                <div key={i.key} className="flex gap-4 border-b border-onyx/8 py-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-onyx/5">
                    <Image src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-display text-base leading-tight text-onyx">{i.name}</h3>
                      <button onClick={() => removeItem(i.key)} aria-label="Remove" className="text-onyx/30 hover:text-rose">×</button>
                    </div>
                    <p className="mt-0.5 font-sans text-xs text-onyx/50">{i.color}{i.size ? ` · Size ${i.size}` : ""}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-onyx/15">
                        <button onClick={() => updateQty(i.key, i.qty - 1)} className="px-2.5 py-1 text-onyx/60 hover:text-onyx">−</button>
                        <span className="min-w-[20px] text-center font-sans text-sm">{i.qty}</span>
                        <button onClick={() => updateQty(i.key, i.qty + 1)} className="px-2.5 py-1 text-onyx/60 hover:text-onyx">+</button>
                      </div>
                      <span className="font-display text-lg text-onyx">${i.price * i.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-onyx/10 px-6 py-5">
              <div className="flex justify-between font-sans text-sm text-onyx/70"><span>Subtotal</span><span>${subtotal}</span></div>
              <div className="mt-1 flex justify-between font-sans text-sm text-onyx/70"><span>Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping}`}</span></div>
              <div className="mt-3 flex justify-between border-t border-onyx/10 pt-3 font-display text-xl text-onyx"><span>Total</span><span>${total}</span></div>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-gold mt-4 w-full">Checkout</Link>
              <button onClick={() => setOpen(false)} className="mt-2 w-full font-sans text-xs uppercase tracking-wide text-onyx/50 hover:text-onyx">Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
