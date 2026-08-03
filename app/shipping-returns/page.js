import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = {
  title: "Shipping & Returns",
  description: "How Reet Collections ships your order, and what to do if something isn't right.",
};

export default function ShippingReturnsPage() {
  return (
    <LegalPage eyebrow="Help" title="Shipping & Returns" updated="July 2026">
      <LegalSection title="Shipping">
        <p>Flat-rate shipping is <strong>$9</strong>, and it's <strong>free on orders over $150</strong>.</p>
        <p>Once your order is confirmed, we pack it within 1–3 business days and email you when it's on the way. Every product is checked and folded by hand before it ships.</p>
      </LegalSection>
      <LegalSection title="Returns & exchanges">
        <p>If something isn't right, message us within <strong>7 days of delivery</strong> and we'll make it right — exchange, store credit, or refund.</p>
        <p>Items should be unworn and unwashed with tags attached. Clearance products are final sale and marked as such on the product page.</p>
      </LegalSection>
      <LegalSection title="Damaged or wrong items">
        <p>If your order arrives damaged or isn't what you ordered, send us a photo within 48 hours of delivery and we'll sort it out right away — that one's on us, including shipping.</p>
      </LegalSection>
      <LegalSection title="Questions">
        <p>Message us on <a href="https://m.me/Reetcollections068" target="_blank" rel="noopener noreferrer" className="text-rose underline hover:text-rose-deep">Facebook</a> or send us an <Link href="/inquiry" className="text-rose underline hover:text-rose-deep">inquiry</Link> — we're happy to help.</p>
      </LegalSection>
    </LegalPage>
  );
}
