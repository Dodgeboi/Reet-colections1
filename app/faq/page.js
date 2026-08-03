import PageBanner from "@/components/PageBanner";

const FAQS = [
  ["How do I order?", "Browse the collection, choose your size, and add to cart — or claim a product live on Facebook each evening. Placing an order reserves those products, and we confirm everything with you personally before payment."],
  ["How does live shopping work?", "We go live on Facebook most evenings at 8 PM to reveal new arrivals. Comment to claim a product during the live, and we'll hold it for you. Want a reminder? Add your email and we'll notify you when we go live."],
  ["What sizes do you carry?", "Most products come in S–XXL. Each product page has a size guide with measurements. When you're between sizes, we suggest sizing up — and you can always message us for help."],
  ["How much is shipping?", "Flat-rate shipping is $9, and it's free on orders over $150. Every order is packed with care."],
  ["Do you accept returns?", "If something isn't right, reach out within 7 days of delivery and we'll make it right. Items should be unworn with tags attached."],
  ["How do I pay?", "Nothing is charged online. Once you place an order we message you to confirm your total and arrange payment the way that suits you — exactly like on our lives."],
  ["Still have a question?", "Anything not answered here can be sent to us from the Inquiries page — it goes straight to us and a real person replies, usually within a day. You can also message us on Facebook."],
];

export default function FaqPage() {
  return (
    <>
      <PageBanner eyebrow="Help" title="Frequently Asked Questions" subtitle="Answers to the questions we get asked most about shopping with Reet Collections." />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="space-y-4">
          {FAQS.map(([q, a]) => (
            <details key={q} className="group border border-onyx/10 bg-white p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between font-display text-xl text-onyx">
                {q}
                <span className="text-gold-deep transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-onyx/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
