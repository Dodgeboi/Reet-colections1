"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/AccountProvider";
import { useWishlist } from "@/components/WishlistProvider";
import ProductCard from "@/components/ProductCard";
import GoldThread from "@/components/GoldThread";
import GoogleButton from "@/components/GoogleButton";

const STATUS_LABEL = { new: "Received", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
const STATUS_CLASS = {
  new: "bg-gold/15 text-gold-deep",
  confirmed: "bg-blush/60 text-rose-deep",
  shipped: "bg-onyx/10 text-onyx/70",
  delivered: "bg-gold/25 text-gold-deep",
  cancelled: "bg-onyx/5 text-onyx/40",
};

export default function AccountClient({ googleEnabled }) {
  const { account, ready, signInWithGoogle, signOut } = useAccount();
  const wishlist = useWishlist();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Orders live on the server, tied to the signed-in email.
  useEffect(() => {
    if (!account) { setOrders([]); return; }
    fetch("/api/orders").then((r) => (r.ok ? r.json() : [])).then((d) => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, [account]);

  if (!ready) return <div className="min-h-[70vh] pt-28" />;

  // ---------- signed OUT ----------
  if (!account) {
    return (
      <div className="pb-24 pt-28">
        <div className="mx-auto max-w-md px-5">
          <div className="text-center">
            <p className="eyebrow">Your account</p>
            <h1 className="mt-2 font-display text-4xl font-light text-onyx">Welcome to Reet</h1>
            <div className="mt-4 flex justify-center"><GoldThread width={140} /></div>
            <p className="mx-auto mt-5 max-w-sm font-sans text-sm leading-relaxed text-onyx/60">
              Sign in to keep your wishlist and orders together, on any device.
            </p>
          </div>
          <div className="mt-8 border border-onyx/10 bg-white p-6 shadow-card">
            {googleEnabled ? (
              <>
                <GoogleButton onClick={() => signInWithGoogle("/account")} />
                <p className="mt-4 text-center font-sans text-xs leading-relaxed text-onyx/45">
                  We use your Google account only to sign you in — no passwords to remember, nothing posted on your behalf.
                </p>
              </>
            ) : (
              <p className="text-center font-sans text-sm leading-relaxed text-onyx/55">
                Sign-in is opening soon. You can still browse, add to your bag and place orders as a guest.
              </p>
            )}
          </div>
          <p className="mt-6 text-center font-sans text-xs text-onyx/40">
            Questions? <Link href="/contact" className="underline hover:text-rose">We're happy to help.</Link>
          </p>
        </div>
      </div>
    );
  }

  // ---------- signed IN ----------
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const wished = (wishlist?.ids || []).map((id) => byId[id]).filter(Boolean);
  const viewed = (wishlist?.viewed || []).map((id) => byId[id]).filter(Boolean).filter((p) => !wished.includes(p));
  const firstName = account.name.split(" ")[0];
  const Empty = ({ children }) => <div className="border border-dashed border-onyx/15 bg-white/60 py-12 text-center">{children}</div>;

  return (
    <div className="pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-onyx/10 pb-6">
          <div className="flex items-center gap-4">
            {account.image && (
              <img src={account.image} alt="" referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-full ring-2 ring-gold/40" />
            )}
            <div>
              <p className="eyebrow">Your account</p>
              <h1 className="mt-1 font-display text-4xl font-light text-onyx sm:text-5xl">Welcome back, {firstName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {account.isOwner && <Link href="/admin" className="btn-gold !py-2 text-xs">Owner dashboard</Link>}
            <button onClick={signOut} className="btn-outline !py-2 text-xs">Sign out</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-onyx/10 bg-white p-5">
            <p className="eyebrow">Profile</p>
            <p className="mt-2 font-display text-xl text-onyx">{account.name}</p>
            <p className="font-sans text-sm text-onyx/55">{account.email}</p>
            {account.since && <p className="mt-1 font-sans text-xs text-onyx/40">Member since {new Date(account.since).toLocaleDateString()}</p>}
          </div>
          <div className="flex flex-col items-center justify-center border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{wished.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45">Saved pieces</p>
          </div>
          <div className="flex flex-col items-center justify-center border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{orders.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45">Orders</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 font-display text-3xl font-light text-onyx">Your Wishlist{wished.length ? ` (${wished.length})` : ""}</h2>
          {wished.length ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-4">{wished.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <Empty>
              <p className="font-sans text-sm text-onyx/50">No saved pieces yet — tap the heart on anything you love.</p>
              <Link href="/collections" className="btn-rose mt-4 inline-block !py-2 text-xs">Browse the collection</Link>
            </Empty>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-display text-3xl font-light text-onyx">Order History</h2>
          {orders.length ? (
            <div className="space-y-3">{orders.map((o) => (
              <div key={o.no} className="border border-onyx/10 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg text-onyx">{o.no}</p>
                    <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-wide ${STATUS_CLASS[o.status] || STATUS_CLASS.new}`}>{STATUS_LABEL[o.status] || o.status}</span>
                  </div>
                  <p className="font-sans text-sm text-onyx/55">{new Date(o.at).toLocaleDateString()} · ${o.total} · {o.items.reduce((a, i) => a + i.qty, 0)} item(s)</p>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto">{o.items.map((i, idx) => (
                  <div key={idx} className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-ivory ring-1 ring-onyx/5"><img src={i.image} alt={i.name} className="h-full w-full object-cover" /></div>
                ))}</div>
              </div>
            ))}</div>
          ) : (
            <Empty><p className="font-sans text-sm text-onyx/50">No orders yet — when you place one, it'll appear here.</p></Empty>
          )}
        </section>

        {viewed.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-3xl font-light text-onyx">Recently Viewed</h2>
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-4">{viewed.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
