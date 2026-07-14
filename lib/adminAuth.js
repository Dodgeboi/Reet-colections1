import { cookies } from "next/headers";
export function isAdmin() {
  try {
    const token = cookies().get("reet_admin")?.value;
    return !!process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN;
  } catch { return false; }
}
