"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const LABEL = { new: "New", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNo, setOpenNo] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { setOrders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const setStatus = async (no, status) => {
    const prev = orders;
    setOrders((os) => os.map((o) => (o.no === no ? { ...o, status } : o)));
    setErr("");
    try {
      const r = await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ no, status }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Couldn't update the order.");
    } catch (e) {
      setOrders(prev);
      setErr(e.message);
    }
  };

  const fresh = orders.filter((o) => o.status === "new").length;

  return (
    <div className="mt-4 rounded-2xl border border-gold/30 bg-white p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-label text-gold-deep">Orders</p>
          <p className="mt-0.5 font-display text-xl text-onyx">
            {loading ? "Loading orders…" : orders.length === 0 ? "No orders yet" : fresh > 0 ? `${fresh} new order${fresh === 1 ? "" : "s"} to confirm` : `${orders.length} order${orders.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
      {err && <p className="mt-2 font-sans text-xs text-rose-deep">{err}</p>}

      {orders.length > 0 && (
        <div className="mt-3 space-y-2">
          {orders.map((o) => (
            <div key={o.no} className={`rounded-xl border p-3 ${o.status === "new" ? "border-gold/40 bg-gold/5" : "border-onyx/8"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setOpenNo(openNo === o.no ? null : o.no)} className="flex items-center gap-3 text-left">
                  <span className="font-display text-lg text-onyx">{o.no}</span>
                  <span className="font-sans text-xs text-onyx/55">{o.customer?.name} · {new Date(o.at).toLocaleDateString()} · ${o.total}</span>
                </button>
                <select value={o.status} onChange={(e) => setStatus(o.no, e.target.value)}
                  className="rounded-md border border-onyx/12 bg-white px-2 py-1 font-sans text-xs">
                  {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                </select>
              </div>

              {openNo === o.no && (
                <div className="mt-3 grid gap-4 border-t border-onyx/8 pt-3 sm:grid-cols-2">
                  <div className="font-sans text-xs leading-relaxed text-onyx/70">
                    <p className="font-medium text-onyx">{o.customer?.name}</p>
                    <p><a href={`mailto:${o.customer?.email}`} className="text-rose hover:underline">{o.customer?.email}</a></p>
                    {o.customer?.phone && <p>{o.customer.phone}</p>}
                    <p className="mt-1">{o.customer?.address}, {o.customer?.city} {o.customer?.zip}{o.customer?.country ? `, ${o.customer.country}` : ""}</p>
                    {o.customer?.note && <p className="mt-1 italic text-onyx/55">"{o.customer.note}"</p>}
                    <p className="mt-2 text-onyx/50">Subtotal ${o.subtotal} · Shipping {o.shipping === 0 ? "free" : `$${o.shipping}`} · <strong className="text-onyx">Total ${o.total}</strong></p>
                  </div>
                  <div className="space-y-1.5">
                    {o.items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-ivory ring-1 ring-onyx/5">
                          {i.image && <Image src={i.image} alt={i.name} fill sizes="36px" className="object-cover" />}
                        </div>
                        <p className="font-sans text-xs text-onyx/75">
                          {i.qty}× {i.name}{i.size ? ` (${i.size})` : ""} — ${i.price * i.qty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
