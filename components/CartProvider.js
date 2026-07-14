"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { effectivePrice, FREE_SHIP, SHIP_FLAT } from "@/lib/products";

const CartContext = createContext(null);
export { FREE_SHIP };

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // load + persist (real app in the browser — localStorage is fine here)
  useEffect(() => {
    try { const s = localStorage.getItem("reet-cart"); if (s) setItems(JSON.parse(s)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) { try { localStorage.setItem("reet-cart", JSON.stringify(items)); } catch {} }
  }, [items, ready]);

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
