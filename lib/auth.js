import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "node:crypto";
import { isAdminEmail } from "@/lib/adminEmails";
import { readJson, writeJson } from "@/lib/store";
import { recordAccount } from "@/lib/accounts";
import { emailEnabled } from "@/lib/email";

// Sign-in methods light up as their credentials are configured
// (see docs/DEPLOYMENT.md): Google, Facebook, and the "Reet sign-in"
// (a 6-digit code emailed to you — requires RESEND_API_KEY).
export const googleEnabled = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
export const facebookEnabled = () =>
  !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);
export const codeSignInEnabled = emailEnabled;

const hash = (s) => crypto.createHash("sha256").update(String(s), "utf8").digest("hex");
const prettyName = (email) =>
  email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function buildProviders() {
  const providers = [];
  if (googleEnabled()) {
    providers.push(GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }));
  }
  if (facebookEnabled()) {
    providers.push(FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }));
  }
  if (codeSignInEnabled()) {
    providers.push(CredentialsProvider({
      id: "reet-code",
      name: "Email code",
      credentials: { email: { type: "text" }, code: { type: "text" } },
      // Step 2 of the Reet sign-in: check the emailed code.
      async authorize(credentials) {
        const email = String(credentials?.email || "").trim().toLowerCase();
        const code = String(credentials?.code || "").trim();
        if (!email || !/^\d{6}$/.test(code)) return null;
        const store = await readJson("otp.json", {});
        const entry = store[email];
        if (!entry || entry.exp < Date.now()) return null;
        if ((entry.tries || 0) >= 5) { delete store[email]; await writeJson("otp.json", store); return null; }
        if (entry.hash !== hash(code)) {
          entry.tries = (entry.tries || 0) + 1;
          await writeJson("otp.json", store);
          return null;
        }
        delete store[email]; // a code works exactly once
        await writeJson("otp.json", store);
        return { id: email, email, name: prettyName(email) };
      },
    }));
  }
  return providers;
}

export const authOptions = {
  providers: buildProviders(),
  session: { strategy: "jwt" },
  callbacks: {
    // Every sign-in is written to accounts.json so the dashboard can show
    // how many people have made an account. Never blocks the sign-in.
    async signIn({ user, account }) {
      await recordAccount({
        email: user?.email,
        name: user?.name,
        image: user?.image,
        provider: account?.provider || "",
      });
      return true;
    },
    async jwt({ token, user }) {
      // Remember the first sign-in so the account page can show "member since".
      if (user && !token.since) token.since = Date.now();
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.since = token.since || null;
        session.user.isOwner = isAdminEmail(token.email);
      }
      return session;
    },
  },
};
