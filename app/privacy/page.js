import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description: "What information Reet Collections collects and how it's used.",
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="July 2026">
      <LegalSection title="What we collect">
        <p>When you place an order, we collect your name, email, phone number, and delivery address — the details needed to get your pieces to you.</p>
        <p>If you sign in with Google, we receive your name, email address, and profile photo from Google. We never see your Google password, and we never post anything on your behalf.</p>
        <p>If you join our live-notification list, we store your email address.</p>
      </LegalSection>
      <LegalSection title="How we use it">
        <p>Only to run the shop: confirming and delivering your orders, answering your messages, and — if you've joined the list — letting you know when we go live. We don't sell or share your information with anyone, and we don't send marketing you didn't ask for.</p>
      </LegalSection>
      <LegalSection title="Payments">
        <p>We don't collect card details on this site. Payment is arranged personally with you after your order is confirmed.</p>
      </LegalSection>
      <LegalSection title="On your device">
        <p>Your shopping bag, wishlist, and recently-viewed pieces are stored in your own browser so they're waiting for you when you come back. Signing in uses a session cookie to keep you signed in.</p>
      </LegalSection>
      <LegalSection title="Your choices">
        <p>Want your details or your email removed from our list? Just ask through the <Link href="/contact" className="text-rose underline hover:text-rose-deep">contact page</Link> and we'll take care of it.</p>
      </LegalSection>
    </LegalPage>
  );
}
