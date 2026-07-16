import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminSession";
import { isAdminEmail } from "@/lib/adminEmails";

// True when the request carries a valid owner password session — or when the
// visitor is signed in with Google as one of the owners (ADMIN_EMAILS).
export async function isAdmin() {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (await verifySessionToken(process.env.ADMIN_SESSION_SECRET, token)) return true;
  } catch {}
  try {
    const session = await getServerSession(authOptions);
    return isAdminEmail(session?.user?.email);
  } catch {
    return false;
  }
}
