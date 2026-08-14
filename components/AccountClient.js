"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useAccount } from "@/components/AccountProvider";
import { useWishlist } from "@/components/WishlistProvider";
import ProductCard from "@/components/ProductCard";
import GoldThread from "@/components/GoldThread";
import GoogleButton from "@/components/GoogleButton";
import Editable from "@/components/Editable";
import { useSiteText } from "@/components/SiteTextProvider";

const STATUS_KEYS = { new: "new", confirmed: "confirmed", shipped: "shipped", delivered: "delivered", cancelled: "cancelled" };
const STATUS_CLASS = {
  new: "bg-gold/15 text-gold-deep",
  confirmed: "bg-blush/60 text-rose-deep",
  shipped: "bg-onyx/10 text-onyx/70",
  delivered: "bg-gold/25 text-gold-deep",
  cancelled: "bg-onyx/5 text-onyx/40",
};

export default function AccountClient({ googleEnabled, facebookEnabled, codeEnabled }) {
  const { account, ready, signInWithGoogle, signOut } = useAccount();
  const wishlist = useWishlist();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const t = {
    welcomeTitle: useSiteText("account.welcomeTitle"),
    welcomeBody: useSiteText("account.welcomeBody"),
    comingSoon: useSiteText("account.comingSoon"),
    questionsPre: useSiteText("account.questionsPre"),
    questionsLink: useSiteText("account.questionsLink"),
    welcomeBackPre: useSiteText("account.welcomeBackPre"),
    ownerDashboard: useSiteText("account.ownerDashboard"),
    signOut: useSiteText("account.signOut"),
    profile: useSiteText("account.profile"),
    memberSince: useSiteText("account.memberSince"),
    savedProducts: useSiteText("account.savedProducts"),
    ordersLabel: useSiteText("account.ordersLabel"),
    yourWishlist: useSiteText("account.yourWishlist"),
    noSaved: useSiteText("account.noSaved"),
    browseCollection: useSiteText("account.browseCollection"),
    orderHistory: useSiteText("account.orderHistory"),
    orderHistorySub: useSiteText("account.orderHistorySub"),
    noOrders: useSiteText("account.noOrders"),
    recentlyViewed: useSiteText("account.recentlyViewed"),
  };

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then((d) => setProducts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Orders live on the server, tied to the signed-in email.
  useEffect(() => {
    if (!account) { setOrders([]); return; }
    fetch("/api/orders?mine=1").then((r) => (r.ok ? r.json() : [])).then((d) => setOrders(Array.isArray(d) ? d : [])).catch(() => {});
  }, [account]);

  if (!ready) return <div className="min-h-[70vh] pt-28" />;

  // ---------- signed OUT ----------
  if (!account) {
    return (
      <div className="pb-24 pt-28">
        <div className="mx-auto max-w-md px-5">
          <div className="text-center">
            <p className="eyebrow">Your account</p>
            <h1 className="mt-2 font-display text-4xl font-light text-onyx"><Editable k="account.welcomeTitle" value={t.welcomeTitle} /></h1>
            <div className="mt-4 flex justify-center"><GoldThread width={140} /></div>
            <p className="mx-auto mt-5 max-w-sm font-sans text-sm leading-relaxed text-onyx/60">
              <Editable k="account.welcomeBody" value={t.welcomeBody} />
            </p>
          </div>
          <div className="mt-8 border border-onyx/10 bg-white p-6 shadow-card">
            {(googleEnabled || facebookEnabled || codeEnabled) ? (
              <SignInMethods googleEnabled={googleEnabled} facebookEnabled={facebookEnabled} codeEnabled={codeEnabled} signInWithGoogle={signInWithGoogle} />
            ) : (
              <p className="text-center font-sans text-sm leading-relaxed text-onyx/55">
                <Editable k="account.comingSoon" value={t.comingSoon} />
              </p>
            )}
          </div>
          <p className="mt-6 text-center font-sans text-xs text-onyx/40">
            <Editable k="account.questionsPre" value={t.questionsPre} /> <Link href="/inquiry" className="underline hover:text-rose"><Editable k="account.questionsLink" value={t.questionsLink} /></Link>
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
              <h1 className="mt-1 font-display text-4xl font-light text-onyx sm:text-5xl"><Editable k="account.welcomeBackPre" value={t.welcomeBackPre} /> {firstName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {account.isOwner && <Link href="/admin" className="btn-gold !py-2 text-xs"><Editable k="account.ownerDashboard" value={t.ownerDashboard} /></Link>}
            <button onClick={signOut} className="btn-outline !py-2 text-xs"><Editable k="account.signOut" value={t.signOut} /></button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-onyx/10 bg-white p-5">
            <p className="eyebrow"><Editable k="account.profile" value={t.profile} /></p>
            <p className="mt-2 font-display text-xl text-onyx">{account.name}</p>
            <p className="font-sans text-sm text-onyx/55">{account.email}</p>
            {account.since && <p className="mt-1 font-sans text-xs text-onyx/40"><Editable k="account.memberSince" value={t.memberSince} /> {new Date(account.since).toLocaleDateString()}</p>}
          </div>
          <div className="flex flex-col items-center justify-center border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{wished.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45"><Editable k="account.savedProducts" value={t.savedProducts} /></p>
          </div>
          <div className="flex flex-col items-center justify-center border border-onyx/10 bg-white p-5 text-center">
            <p className="font-display text-3xl text-onyx">{orders.length}</p>
            <p className="font-sans text-xs uppercase tracking-label text-onyx/45"><Editable k="account.ordersLabel" value={t.ordersLabel} /></p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-5 font-display text-3xl font-light text-onyx"><Editable k="account.yourWishlist" value={t.yourWishlist} />{wished.length ? ` (${wished.length})` : ""}</h2>
          {wished.length ? (
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-4">{wished.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          ) : (
            <Empty>
              <p className="font-sans text-sm text-onyx/50"><Editable k="account.noSaved" value={t.noSaved} /></p>
              <Link href="/collections" className="btn-rose mt-4 inline-block !py-2 text-xs"><Editable k="account.browseCollection" value={t.browseCollection} /></Link>
            </Empty>
          )}
        </section>

        <section className="mt-12">
          <h2 className="mb-2 font-display text-3xl font-light text-onyx"><Editable k="account.orderHistory" value={t.orderHistory} /></h2>
          <p className="mb-5 font-sans text-sm text-onyx/55"><Editable k="account.orderHistorySub" value={t.orderHistorySub} /></p>
          {orders.length ? (
            <div className="space-y-3">{orders.map((o) => <OrderCard key={o.no} order={o} />)}</div>
          ) : (
            <Empty><p className="font-sans text-sm text-onyx/50"><Editable k="account.noOrders" value={t.noOrders} /></p></Empty>
          )}
        </section>

        {viewed.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-display text-3xl font-light text-onyx"><Editable k="account.recentlyViewed" value={t.recentlyViewed} /></h2>
            <div className="grid grid-cols-2 gap-x-2 gap-y-7 sm:gap-x-3 lg:grid-cols-4">{viewed.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}


// One order, written the way a customer would want it explained: what it is,
// where it stands, what's in it, and what it cost.
function OrderCard({ order: o }) {
  const [open, setOpen] = useState(false);
  const units = o.items.reduce((a, i) => a + i.qty, 0);
  const placed = new Date(o.at);
  const subtotal = o.subtotal ?? o.items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = o.shipping ?? Math.max(0, (o.total || 0) - subtotal);
  const statusKey = STATUS_KEYS[o.status] || "new";
  const statusLabel = useSiteText(`order.status.${statusKey}`);
  const statusNote = useSiteText(`order.note.${statusKey}`);
  const t = {
    detailsShow: useSiteText("order.showDetails"), detailsHide: useSiteText("order.hideDetails"),
    paymentLabel: useSiteText("order.payment.label"), subtotalLabel: useSiteText("order.payment.subtotalLabel"),
    shippingLabel: useSiteText("order.payment.shippingLabel"), totalLabel: useSiteText("order.payment.totalLabel"),
    paymentNote: useSiteText("order.payment.note"), deliveryLabel: useSiteText("order.delivery.label"),
    yourNote: useSiteText("order.yourNoteLabel"), askPre: useSiteText("order.askPre"),
    askLink: useSiteText("order.askLink"), askQuote: useSiteText("order.askQuote"),
    freeShipping: useSiteText("order.freeShipping"), freeShippingWord: useSiteText("order.freeShippingWord"),
  };

  return (
    <div className="border border-onyx/10 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <p className="font-display text-lg text-onyx">{o.no}</p>
          <span className={`rounded-full px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-wide ${STATUS_CLASS[o.status] || STATUS_CLASS.new}`}><Editable k={`order.status.${statusKey}`} value={statusLabel} /></span>
        </div>
        <p className="font-sans text-sm text-onyx/55">
          {placed.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} · {units} item{units === 1 ? "" : "s"} · ${o.total}
        </p>
      </div>

      {/* what this order is, in plain English */}
      <p className="mt-3 border-l-2 border-gold/50 pl-3 font-sans text-[13px] leading-relaxed text-onyx/70">
        You ordered {units} item{units === 1 ? "" : "s"} on {placed.toLocaleDateString()} for ${o.total}, including {shipping === 0 ? <Editable k="order.freeShipping" value={t.freeShipping} /> : `$${shipping} shipping`}.{" "}
        <Editable k={`order.note.${statusKey}`} value={statusNote} />
      </p>

      {/* what's in it */}
      <div className="mt-3 space-y-2">
        {o.items.map((i, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-ivory ring-1 ring-onyx/5">
              <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm text-onyx">{i.name}</p>
              <p className="font-sans text-xs text-onyx/50">
                {[i.color, i.size ? `Size ${i.size}` : "", `Qty ${i.qty}`].filter(Boolean).join(" · ")}
              </p>
            </div>
            <p className="shrink-0 font-sans text-sm text-onyx/70">${i.price * i.qty}</p>
          </div>
        ))}
      </div>

      <button onClick={() => setOpen((v) => !v)} className="mt-3 font-sans text-xs text-onyx/45 underline hover:text-onyx">
        {open ? <Editable k="order.hideDetails" value={t.detailsHide} /> : <Editable k="order.showDetails" value={t.detailsShow} />}
      </button>

      {open && (
        <div className="mt-3 grid gap-4 border-t border-onyx/8 pt-3 font-sans text-xs leading-relaxed text-onyx/65 sm:grid-cols-2">
          <div>
            <p className="font-medium uppercase tracking-label text-onyx/45"><Editable k="order.payment.label" value={t.paymentLabel} /></p>
            <p className="mt-1"><Editable k="order.payment.subtotalLabel" value={t.subtotalLabel} /> ${subtotal}</p>
            <p><Editable k="order.payment.shippingLabel" value={t.shippingLabel} /> {shipping === 0 ? <Editable k="order.freeShippingWord" value={t.freeShippingWord} /> : `$${shipping}`}</p>
            <p className="mt-1 text-onyx"><Editable k="order.payment.totalLabel" value={t.totalLabel} /> <strong>${o.total}</strong></p>
            <p className="mt-1 text-onyx/45"><Editable k="order.payment.note" value={t.paymentNote} /></p>
          </div>
          <div>
            <p className="font-medium uppercase tracking-label text-onyx/45"><Editable k="order.delivery.label" value={t.deliveryLabel} /></p>
            <p className="mt-1">{o.customer?.name}</p>
            <p>{o.customer?.address}</p>
            <p>{[o.customer?.city, o.customer?.zip].filter(Boolean).join(" ")}{o.customer?.country ? `, ${o.customer.country}` : ""}</p>
            {o.customer?.phone && <p>{o.customer.phone}</p>}
            {o.customer?.note && <p className="mt-1 italic text-onyx/50"><Editable k="order.yourNoteLabel" value={t.yourNote} /> &ldquo;{o.customer.note}&rdquo;</p>}
          </div>
        </div>
      )}

      <p className="mt-3 font-sans text-xs text-onyx/45">
        <Editable k="order.askPre" value={t.askPre} />{" "}
        <Link href={`/inquiry?order=${encodeURIComponent(o.no)}`} className="underline hover:text-rose"><Editable k="order.askLink" value={t.askLink} /></Link> <Editable k="order.askQuote" value={t.askQuote} /> {o.no}.
      </p>
    </div>
  );
}

const field = "w-full border border-onyx/20 bg-white px-3.5 py-2.5 font-sans text-sm text-onyx placeholder:text-onyx/35 focus:border-gold focus:outline-none";

function SignInMethods({ googleEnabled, facebookEnabled, codeEnabled, signInWithGoogle }) {
  const [step, setStep] = useState("start"); // start -> code
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const t = {
    continueFacebook: useSiteText("account.continueFacebook"),
    orReetSignIn: useSiteText("account.orReetSignIn"),
    emailPlaceholder: useSiteText("account.emailPlaceholder"),
    sendCode: useSiteText("account.sendCode"),
    sending: useSiteText("account.sending"),
    codeSentPre: useSiteText("account.codeSentPre"),
    signInCta: useSiteText("account.signInCta"),
    checking: useSiteText("account.checking"),
    differentEmail: useSiteText("account.differentEmail"),
    privacyNote: useSiteText("account.privacyNote"),
  };

  const requestCode = async () => {
    if (busy) return;
    setBusy(true); setErr(""); setNote("");
    try {
      const r = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Couldn't send the code.");
      setStep("code");
      setNote(`${t.codeSentPre} ${email.trim()}.`);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  const verifyCode = async () => {
    if (busy) return;
    setBusy(true); setErr("");
    const res = await signIn("reet-code", { email, code, redirect: false });
    if (res?.ok) { window.location.href = "/account"; return; }
    setErr("That code isn't right (or it expired) — check the email and try again.");
    setBusy(false);
  };

  return (
    <div>
      {googleEnabled && <GoogleButton onClick={() => signInWithGoogle("/account")} />}
      {facebookEnabled && (
        <button onClick={() => signIn("facebook", { callbackUrl: "/account" })}
          className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-onyx/15 bg-[#1877F2] px-5 py-3 font-sans text-sm font-medium text-white shadow-soft transition hover:bg-[#0f66d6]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.5-1.5H16V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7v3h2.6v8H13z" /></svg>
          <Editable k="account.continueFacebook" value={t.continueFacebook} />
        </button>
      )}

      {codeEnabled && (
        <>
          {(googleEnabled || facebookEnabled) && (
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-onyx/10" />
              <span className="font-sans text-[11px] uppercase tracking-label text-onyx/40"><Editable k="account.orReetSignIn" value={t.orReetSignIn} /></span>
              <span className="h-px flex-1 bg-onyx/10" />
            </div>
          )}
          {step === "start" ? (
            <div className="space-y-3">
              <input className={field} type="email" placeholder={t.emailPlaceholder} value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && requestCode()} />
              <button onClick={requestCode} disabled={busy || !email.trim()} className="btn-gold w-full disabled:opacity-40">
                {busy ? t.sending : <Editable k="account.sendCode" value={t.sendCode} />}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {note && <p className="font-sans text-xs text-onyx/55">{note}</p>}
              <input className={`${field} text-center text-lg tracking-[0.4em]`} inputMode="numeric" maxLength={6}
                placeholder="000000" value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && verifyCode()} autoFocus />
              <button onClick={verifyCode} disabled={busy || code.length !== 6} className="btn-gold w-full disabled:opacity-40">
                {busy ? t.checking : <Editable k="account.signInCta" value={t.signInCta} />}
              </button>
              <button onClick={() => { setStep("start"); setCode(""); setErr(""); }} className="w-full text-center font-sans text-xs text-onyx/45 underline hover:text-onyx">
                <Editable k="account.differentEmail" value={t.differentEmail} />
              </button>
            </div>
          )}
        </>
      )}
      {err && <p className="mt-3 font-sans text-xs text-rose-deep">{err}</p>}
      <p className="mt-4 text-center font-sans text-xs leading-relaxed text-onyx/45">
        <Editable k="account.privacyNote" value={t.privacyNote} />
      </p>
    </div>
  );
}
