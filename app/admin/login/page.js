import AdminLoginForm from "@/components/AdminLoginForm";
import { googleEnabled } from "@/lib/auth";

export const metadata = { title: "Owner Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLogin() {
  return <AdminLoginForm googleEnabled={googleEnabled()} />;
}
