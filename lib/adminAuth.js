import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminSession";

// True when the request carries a valid owner password session — or when the
// visitor is signed in with Google as the owner (ADMIN_EMAIL).
export async function isAdmin() {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (await verifySessionToken(process.env.ADMIN_SESSION_SECRET, token)) return true;
  } catch {}
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    if (!adminEmail) return false;
    const session = await getServerSession(authOptions);
    return (session?.user?.email || "").toLowerCase() === adminEmail;
  } catch {
    return false;
  }
}
