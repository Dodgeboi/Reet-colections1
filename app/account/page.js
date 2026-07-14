"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "@/components/AccountProvider";
import { useWishlist } from "@/components/WishlistProvider";
import ProductCard from "@/components/ProductCard";
import GoldThread from "@/components/GoldThread";

const field = "w-full rounded-lg border border-onyx/15 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

export default function AccountPage() {
  const { account, ready, createAccount, signIn, signOut } = useAccount();
  const wishlist = useWishlist();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "" });
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
    try { setOrders(JSON.parse(localStorage.getItem("reet-orders") || "[]")); } catch {}
  }, []);

  const submit = () => {
    const res = tab === "create" ? createAccount(form.name, form.email) : signIn(form.email);
    if (res?.error) setErr(res.error); else setErr("");
  };

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
          </div>
          <div className="mt-8 rounded-2xl border border-onyx/10 bg-white p-6 shadow-card">
            <div className="mb-5 flex rounded-full bg-ivory p-1 font-sans text-sm">
              <button onClick={() => { setTab("signin"); setErr(""); }} className={`flex-1 rounded-full py-2 transition ${tab === "signin" ? "bg-onyx text-ivory" : "text-onyx/60"}`}>Sign in</button>
              <button onClick={() => { setTab("create"); setErr(""); }} className={`flex-1 rounded-full py-2 transition ${tab === "create" ? "bg-onyx text-ivory" : "text-onyx/60"}`}>Create account</button>
            </div>
            <div className="space-y-3">
              {tab === "create" && <input className={field} placeholder="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />}
              <input className={field} type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && submit()} />
              {err && <p className="font-sans text-xs text-rose-deep">{err}</p>}
              <button onClick={submit} className="btn-gold w-full">{tab === "create" ? "Create my account" : "Sign in"}</button>
            </div>
            <p className="mt-4 text-center font-sans text-xs leading-relaxed text-onyx/45">Your account keeps your wishlist and orders together in one place.</p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- signed IN ----------
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const wished = (wishlist?.ids || []).map((id) => byId[id]).filter(Boolean);
  const viewed = (wishlist?.viewed || []).map((id) => byId[id]).filter(Boolean).filter((p) => !wished.includes(p));
  const firstName = account.name.split(" ")[0];
  const Empty = ({ children }) => <div className="rounded-2xl border border-dashed border-onyx/15 bg-white/60 py-12 text-center">{children}</div>;

  return (
    <div className="pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-onyx/10 pb-6">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="mt-1 font-display text-4xl font-light text-onyx sm:text-5xl">Welcome back, {firstName}</h1>
          </div>
          <button onClick={signOut} className="btn-outline !py-2 text-xs">Sign out</button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-onyx/10 bg-white p-5">
            <p className="eyebrow">Profile</p>
            <p className="mt-2 font-display text-xl text-onyx">{account.name}</p>
            <p className="font-sans text-sm text-onyx/55">{account.email}</p>
            {account.since && <p className="mt-1 font-sans text-xs text-onyx/40">Member since {new Date(account.since).toLocaleDateString()}</p>}
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{wished.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45">Saved pieces</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{orders.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45">Orders</p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 font-display text-3xl font-light text-onyx">Your Wishlist{wished.length ? ` (${wished.length})` : ""}</h2>
          {wished.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{wished.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <Empty><p className="font-sans text-sm text-onyx/50">No saved pieces yet — tap the ♥ on anything you love.</p><Link href="/collections" className="btn-rose mt-4 inline-block !py-2 text-xs">Browse the collection</Link></Empty>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-5 font-display text-3xl font-light text-onyx">Order History</h2>
          {orders.length ? (
            <div className="space-y-3">{orders.map((o) => (
              <div key={o.no} className="rounded-2xl border border-onyx/10 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-display text-lg text-onyx">{o.no}</p>
                  <p className="font-sans text-sm text-onyx/55">{new Date(o.at).toLocaleDateString()} · ${o.total} · {o.items.reduce((a, i) => a + i.qty, 0)} item(s)</p>
                </div>
                <div className="mt-3 flex gap-2 overflow-x-auto">{o.items.map((i, idx) => (
                  <div key={idx} className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-ivory ring-1 ring-onyx/5"><img src={i.image} alt={i.name} className="h-full w-full object-cover" /></div>
                ))}</div>
              </div>
            ))}</div>
          ) : (
            <Empty><p className="font-sans text-sm text-onyx/50">No orders yet — when you check out, they&apos;ll appear here.</p></Empty>
          )}
        </section>

        {viewed.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-3xl font-light text-onyx">Recently Viewed</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{viewed.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}
