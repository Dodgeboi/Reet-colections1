# Roadmap

## ✅ Phase 1 — Storefront & brand (complete)

- Full storefront: home, shop (filters + sort + mobile drawer), product pages, cart, checkout.
- Customer **accounts + wishlist** (account-tied), recently-viewed, order history.
- **Owner dashboard**: inventory management, sale pricing, AI photo import.
- **Password-protected admin** (middleware + signed cookie + guarded APIs).
- **Live-notify**: email signup + one-click "We're live" blast to subscribers.
- Standard e-commerce polish: search, size guide, free-shipping meter, FAQ, 404, SEO.
- Culturally rich, hand-crafted design (Devanagari accents, lotus motifs, occasion theming).
- Clean, brand-forward header (logo in corner) and a single, well-structured footer.

## ✅ Phase 2 — A real, working shop (complete)

- **Production storage** — one storage layer (`lib/store.js`): JSON files in dev,
  **Vercel Blob** in production. Products, orders, and subscribers persist when deployed.
- **Real orders** — checkout reserves pieces through `POST /api/orders` (server-side
  pricing + stock decrement); the owner confirms, and tracks status from the dashboard;
  customers see their orders on the account page.
- **Google sign-in** — real customer accounts via NextAuth + Google OAuth.
- **Owner login v2** — email + hashed password, signed expiring session, login throttling —
  or sign in with the owner Google account.
- **Legal pages live** — Privacy, Terms, Shipping & Returns are real site pages.
- **SEO & PWA** — sitemap, robots, web-app manifest ("Add to Home Screen"), Product/Store
  structured data, self-hosted fonts.
- Removed for honesty: fabricated star ratings, mock card checkout, placeholder contacts.

## 🔜 Phase 3 — Growing the shop (next)

1. **Online payments — Stripe Checkout** (hosted, PCI-compliant) once order volume makes
   personally-arranged payment slow. A webhook would auto-confirm paid orders.
2. **Transactional email** — automatic order confirmations (Resend), instead of the owner
   emailing personally.
3. **A real database** (Supabase/Postgres) when concurrent admin edits or reporting needs
   outgrow Blob's last-write-wins model.
4. **Global rate-limiting** for public POST endpoints (Upstash) — the in-memory login
   throttle only protects a single server instance.
5. **Content** — clean, consistent product photography (see
   [Content Guide](./CONTENT-GUIDE.md)) — the biggest remaining visual upgrade.
6. **Launch checklist** — domain, final QA on real devices, share the link on the lives.

## 🌟 Phase 3 — Growth (later)

- Make it an installable app (PWA) or a wrapped mobile app.
- Email marketing / abandoned-cart flows.
- Analytics & SEO expansion.
- Discount codes, gift cards, bundles.

## What only you/your mom can do (accounts & business)

- Create the **Stripe** account (business details + bank account for payouts + ID verification).
- Create the **Supabase** project.
- Provide the API keys (as environment variables) for wiring up.
- Decide shipping rates, return policy, and confirm tax/entity details with a professional.
