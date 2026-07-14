"use client";
import { createContext, useContext } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

// Accounts are real Google sign-ins (NextAuth). This provider bridges the
// NextAuth session into the small { account, ready } shape the rest of the
// site already uses.
const Ctx = createContext(null);

function Bridge({ children }) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const account = user
    ? {
        name: user.name || (user.email ? user.email.split("@")[0] : "Friend"),
        email: (user.email || "").toLowerCase(),
        image: user.image || null,
        since: user.since || null,
      }
    : null;

  const value = {
    account,
    ready: status !== "loading",
    signInWithGoogle: (callbackUrl = "/account") => signIn("google", { callbackUrl }),
    signOut: () => signOut({ callbackUrl: "/" }),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function AccountProvider({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <Bridge>{children}</Bridge>
    </SessionProvider>
  );
}

export const useAccount = () => useContext(Ctx);
