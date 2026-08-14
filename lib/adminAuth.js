import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminSession";

// True only when the request carries a valid owner session — issued by
// /api/admin/login or /api/admin/login/verify after 2FA. Google sign-in is
// just the first factor for owners who use it (see app/api/admin/login/google);
// it never grants access on its own, so this doesn't check NextAuth directly.
export async function isAdmin() {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    return await verifySessionToken(process.env.ADMIN_SESSION_SECRET, token);
  } catch {
    return false;
  }
}
