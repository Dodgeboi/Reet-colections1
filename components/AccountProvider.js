"use client";
import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext(null);
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const a = JSON.parse(localStorage.getItem("reet-account") || "null"); if (a) setAccount(a); } catch {}
    setReady(true);
  }, []);

  const accountsMap = () => { try { return JSON.parse(localStorage.getItem("reet-accounts") || "{}"); } catch { return {}; } };
  const persist = (acc) => { try { localStorage.setItem("reet-account", JSON.stringify(acc)); } catch {} setAccount(acc); };

  const createAccount = (name, email) => {
    name = (name || "").trim(); email = (email || "").trim().toLowerCase();
    if (!name) return { error: "Please enter your name." };
    if (!EMAIL.test(email)) return { error: "Please enter a valid email address." };
    const map = accountsMap();
    map[email] = { name, since: map[email]?.since || new Date().toISOString() };
    try { localStorage.setItem("reet-accounts", JSON.stringify(map)); } catch {}
    persist({ name, email, since: map[email].since });
    return { ok: true };
  };
  const signIn = (email) => {
    email = (email || "").trim().toLowerCase();
    if (!EMAIL.test(email)) return { error: "Please enter a valid email address." };
    const map = accountsMap();
    if (!map[email]) return { error: "We couldn't find an account with that email — create one instead." };
    persist({ name: map[email].name, email, since: map[email].since });
    return { ok: true };
  };
  const signOut = () => { try { localStorage.removeItem("reet-account"); } catch {} setAccount(null); };

  return <Ctx.Provider value={{ account, ready, createAccount, signIn, signOut }}>{children}</Ctx.Provider>;
}
export const useAccount = () => useContext(Ctx);
