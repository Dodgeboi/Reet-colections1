import AdminLoginForm from "@/components/AdminLoginForm";
import { googleEnabled, authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { isAdminEmail } from "@/lib/adminEmails";
import { adminTwoFactorEnabled } from "@/lib/adminOtp";

export const metadata = { title: "Owner Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  const session = await getServerSession(authOptions);
  const rawEmail = session?.user?.email || "";
  const googleAdminEmail = isAdminEmail(rawEmail) ? rawEmail.trim().toLowerCase() : null;
  return (
    <AdminLoginForm
      googleEnabled={googleEnabled()}
      googleAdminEmail={googleAdminEmail}
      twoFactorEnabled={adminTwoFactorEnabled()}
    />
  );
}
