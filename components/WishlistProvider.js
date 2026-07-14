"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "./AccountProvider";
const Ctx = createContext(null);

export function WishlistProvider({ children }) {
  const { account } = useAccount() || {};
  const email = account?.email || null;
  const [ids, setIds] = useState([]);
  const [viewed, setViewed] = useState([]);
  const [ready, setReady] = useState(false);

  // wishlist is tied to the signed-in account; empty when signed out
  useEffect(() => {
    if (!email) { setIds([]); setReady(true); return; }
    try { const w = localStorage.getItem(`reet-wishlist:${email}`); setIds(w ? JSON.parse(w) : []); } catch { setIds([]); }
    setReady(true);
  }, [email]);
  useEffect(() => {
    if (ready && email) { try { localStorage.setItem(`reet-wishlist:${email}`, JSON.stringify(ids)); } catch {} }
  }, [ids, email, ready]);

  // recently-viewed is device-level (fine for guests)
  useEffect(() => { try { const v = localStorage.getItem("reet-viewed"); if (v) setViewed(JSON.parse(v)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("reet-viewed", JSON.stringify(viewed)); } catch {} }, [viewed]);

  const has = (id) => !!email && ids.includes(id);
  // returns false when signed out so callers can prompt sign-in
  const toggle = (id) => { if (!email) return false; setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [id, ...p])); return true; };
  const addViewed = (id) => setViewed((p) => [id, ...p.filter((x) => x !== id)].slice(0, 10));

  return <Ctx.Provider value={{ ids: email ? ids : [], has, toggle, count: email ? ids.length : 0, signedIn: !!email, viewed, addViewed }}>{children}</Ctx.Provider>;
}
export const useWishlist = () => useContext(Ctx);
