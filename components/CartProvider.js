"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { effectivePrice, FREE_SHIP, SHIP_FLAT } from "@/lib/products";
import { useAccount } from "./AccountProvider";

const CartContext = createContext(null);
export { FREE_SHIP };

// Each identity gets its own bag: guests use "reet-cart", signed-in customers
// use "reet-cart:<email>". Signing in carries the guest bag over (merged);
// signing out returns you to the (now empty) guest bag — nobody ever sees
// someone else's items.
const keyFor = (email) => (email ? `reet-cart:${email}` : "reet-cart");
const readCart = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
};

export function CartProvider({ children }) {
  const { account, ready: accountReady } = useAccount() || {};
  const email = account?.email || null;
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const identityRef = useRef(undefined); // last identity whose bag is loaded

  useEffect(() => {
    if (!accountReady) return;
    const prev = identityRef.current;
    if (prev === email) return;
    identityRef.current = email;

    const next = readCart(keyFor(email));
    // Just signed in on this device — bring the guest bag along.
    if (email && prev === null) {
      const guest = readCart("reet-cart");
      if (guest.length) {
        for (const g of guest) {
          const i = next.findIndex((x) => x.key === g.key);
          if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + g.qty };
          else next.push(g);
        }
        try { localStorage.removeItem("reet-cart"); } catch {}
      }
    }
    setItems(next);
    setLoaded(true);
  }, [email, accountReady]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(keyFor(identityRef.current), JSON.stringify(items)); } catch {}
  }, [items, loaded]);

  const addToCart = (product, size, qty = 1) => {
    setItems((prev) => {
      const key = product.id + "|" + (size || "");
      const i = prev.findIndex((x) => x.key === key);
      if (i >= 0) { const next = [...prev]; next[i] = { ...next[i], qty: next[i].qty + qty }; return next; }
      return [...prev, { key, id: product.id, name: product.name, price: effectivePrice(product), image: product.image, color: product.color, size: size || "", qty }];
    });
    setOpen(true);
  };
  const updateQty = (key, qty) => setItems((p) => (qty <= 0 ? p.filter((i) => i.key !== key) : p.map((i) => (i.key === key ? { ...i, qty } : i))));
  const removeItem = (key) => setItems((p) => p.filter((i) => i.key !== key));
  const clearCart = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIP ? 0 : SHIP_FLAT;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeItem, clearCart, count, subtotal, shipping, total, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
