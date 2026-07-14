# Roadmap

## ✅ Phase 1 — Storefront & brand (complete)

- Full storefront: home, shop (filters + sort + mobile drawer), product pages, cart, checkout.
- Customer **accounts + wishlist** (account-tied), recently-viewed, order history.
- **Owner dashboard**: inventory management, sale pricing, AI photo import.
- **Password-protected admin** (middleware + signed cookie + guarded APIs).
- **Live-notify**: email signup + one-click "We're live" blast to subscribers.
- Standard e-commerce polish: search, size guide, ratings, free-shipping meter, FAQ, 404, SEO.
- Culturally rich, hand-crafted design (Devanagari accents, lotus motifs, occasion theming).
- Clean, brand-forward header (logo in corner) and a single, well-structured footer.

## 🔜 Phase 2 — Make it a real, transacting store (next)

This is the work that turns a beautiful prototype into a live shop that takes money.

1. **Database — Supabase**
   - Move products, orders, and subscribers off JSON files into Supabase.
   - Wire the admin Save, storefront reads, and subscriber list to the database so they
     **persist in production**.
   - *(Unblocks deploying on Vercel for real.)*

2. **Payments — Stripe**
   - Replace the mock card form with **Stripe Checkout** (hosted, PCI-compliant — we never
     touch card data).
   - A webhook records paid orders and decrements stock automatically.
   - Real order records in the database.

3. **Transactional email**
   - Order confirmations (Resend, or Stripe's built-in receipts to start).

4. **Customer auth (real)**
   - Supabase Auth for proper, cross-device logins (replaces the device-local accounts).

5. **Security hardening**
   - Gate `GET /api/subscribers` to admin.
   - Rate-limit public POST endpoints.

6. **Legal & compliance**
   - Publish Privacy Policy, Terms of Service, Shipping & Returns (templates in `docs/legal`).
   - Decide sales-tax handling (Stripe Tax can automate US sales tax).

7. **Content**
   - Clean, consistent product photography (see [Content Guide](./CONTENT-GUIDE.md)) — the
     biggest remaining visual upgrade.

8. **Launch**
   - Deploy to Vercel, connect the GoDaddy domain, set production env vars, final QA.

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
