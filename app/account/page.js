import AccountClient from "@/components/AccountClient";
import { googleEnabled } from "@/lib/auth";

export const metadata = { title: "Your Account" };
export const dynamic = "force-dynamic";

export default function AccountPage() {
  return <AccountClient googleEnabled={googleEnabled()} />;
}
