import PageBanner from "@/components/PageBanner";
import { Reveal } from "@/components/Reveal";

const channels = [
  { t: "WhatsApp", d: "Fastest for orders & sizing", v: "+1 (000) 000-0000", href: "#" },
  { t: "Instagram", d: "DMs always open", v: "@reetcollections", href: "#" },
  { t: "Email", d: "For anything else", v: "hello@reetcollections.com", href: "#" },
];

export default function ContactPage() {
  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Say Hello"
        subtitle="Questions about a piece, your size, or an order? We'd love to hear from you."
      />

      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {channels.map((c) => (
                <a
                  key={c.t}
                  href={c.href}
                  className="group block rounded-2xl border border-onyx/10 bg-white p-6 shadow-card transition-all duration-300 hover:border-gold/50"
                >
                  <p className="eyebrow">{c.t}</p>
                  <p className="mt-2 font-display text-2xl text-onyx">{c.v}</p>
                  <p className="font-sans text-sm text-onyx/50">{c.d}</p>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-onyx/10 bg-white p-7 shadow-card">
              <h2 className="font-display text-3xl font-light text-onyx">Send a message</h2>
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-xl border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-onyx/15 bg-ivory/40 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
                />
                <button className="btn-gold w-full">Send message</button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
