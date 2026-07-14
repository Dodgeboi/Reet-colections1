import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Terms of Service",
  description: "The simple terms for shopping with Reet Collections.",
};

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="July 2026">
      <LegalSection title="Orders">
        <p>Placing an order reserves your pieces — it isn't a charge. We confirm every order personally (total, sizes, delivery) before payment is arranged. If we can't reach you within a few days, we may release reserved pieces back to the shop.</p>
      </LegalSection>
      <LegalSection title="Pricing & availability">
        <p>Most of our pieces are one-of-a-kind or in very limited quantities, sourced piece by piece. Occasionally something sells on a live and online at the same moment — if that happens with your order, we'll let you know right away and make it right.</p>
      </LegalSection>
      <LegalSection title="Product photos & colors">
        <p>We photograph every piece ourselves and describe it as honestly as we can. Screens vary, so colors — especially jewel tones and gold work — can look slightly different in person.</p>
      </LegalSection>
      <LegalSection title="Returns">
        <p>Our full policy lives on the <Link href="/shipping-returns" className="text-rose underline hover:text-rose-deep">Shipping &amp; Returns</Link> page.</p>
      </LegalSection>
      <LegalSection title="Your account">
        <p>Signing in with Google is optional — it keeps your wishlist and order history in one place. Please use your own account and real contact details so we can reach you about your orders.</p>
      </LegalSection>
      <LegalSection title="Getting in touch">
        <p>Anything unclear? We're a small family shop and a real person reads every message — reach us through the <Link href="/contact" className="text-rose underline hover:text-rose-deep">contact page</Link>.</p>
      </LegalSection>
    </LegalPage>
  );
}
