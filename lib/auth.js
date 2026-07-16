import GoogleProvider from "next-auth/providers/google";
import { isAdminEmail } from "@/lib/adminEmails";

// Google sign-in is live once GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set
// (see docs/DEPLOYMENT.md for the 5-minute Google Cloud setup).
export const googleEnabled = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const authOptions = {
  providers: googleEnabled()
    ? [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })]
    : [],
  session: { strategy: "jwt" },
  callbacks: {
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
