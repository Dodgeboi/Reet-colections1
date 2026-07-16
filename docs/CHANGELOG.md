# Changelog

A high-level history of what's been built. Newest first.

## Phase 2 — a real, working shop

**Identity separation & ordering fixes**
- Every customer gets their own bag: carts are stored per signed-in account
  (the guest bag merges in when you sign in, and signing out returns an empty
  guest bag — nobody sees anyone else's items).
- Signing out — from the account page or the dashboard — now ends **both**
  login types (Google session and owner password session), so admin powers
  never linger on a device.
- The account page shows only your own orders, even for owners (the full list
  lives on the dashboard).
- Overselling blocked: ordering more units than are in stock is rejected with
  a friendly message instead of silently draining inventory.

**In-place photo editing (owner mode)**
- Signed-in owners get a floating **Edit photos** button on every page. One
  tap outlines every editable photo — home hero, heritage band, About
  portrait, all product photos, live-replay thumbnails, category tiles.
  Tap a photo → pick a file → drag/zoom to crop → it's live instantly.
- Dashboard slimmed to two tabs (**Inventory · Orders**); every inventory row
  still has **Change photo**, and new products are added with a direct upload.
- Signing in with an owner Google account shows an **Admin** link in the site
  header and an **Owner dashboard** button on the account page.
- Multiple owners supported via comma-separated `ADMIN_EMAILS`.

**Luxury redesign**
- Editorial, fashion-house look: full-bleed photographic hero, flat sharp-cornered
  buttons and tags, hairline rules, square imagery, tighter grid gutters.
- Removed decorative noise: blurred glow blobs, henna dot textures, arch-shaped image
  frames, gradient pills, animated gold-sheen text, star/sparkle glyphs.
- New announcement bar (live schedule + free-shipping note) above a slimmer header.
- Denser product cards (color / name / price) and grids across shop, home, account.

**Real customer accounts (Google)**
- "Continue with Google" via NextAuth — customers sign in with their actual Google account;
  the header, wishlist, and account page all follow the real session.
- Degrades gracefully: without Google credentials configured, the site runs guest-only.

**Owner login v2**
- Email **and** password (`ADMIN_EMAIL` + SHA-256 `ADMIN_PASSWORD_HASH`, constant-time
  compare), signed expiring session cookie (HMAC, 30 days), and 15-minute lockout after
  5 wrong tries.
- The owner's own Google account opens `/admin` directly — no password needed.

**Real orders**
- Checkout now places a genuine order (`POST /api/orders`): server-side pricing, stock
  decrement, sold-out detection — no more mock card form (and no fake "payment" collected).
- New **Orders** panel on the dashboard: customer details, items, and a status flow
  (New → Confirmed → Shipped → Delivered / Cancelled).
- Customers see their real orders (with status) on the account page.

**Production storage**
- One storage layer (`lib/store.js`): local JSON in dev, **Vercel Blob** in production —
  admin saves finally persist on the deployed site. The dashboard warns until storage
  is connected.
- AI-import photos upload to Blob in production too.

**Honesty & polish pass**
- Removed fabricated star ratings/review counts, invented fabric "facts", placeholder
  contact details, and the fake card form.
- Real legal pages: `/privacy`, `/terms`, `/shipping-returns` (footer links updated).
- Contact page now lists real channels (Messenger, Facebook, email) and a working
  mail composer; live-replay labels ("This Week"…) compute from the date so they never
  go stale; "Sari" → "Sarees" naming.
- SEO/PWA: `sitemap.xml`, `robots.txt`, web-app manifest (Add to Home Screen),
  ClothingStore + Product JSON-LD, OpenGraph/Twitter cards, self-hosted fonts
  (`next/font`), themed viewport.
- One-size pieces no longer show an empty size picker; the storefront footer no longer
  renders inside the owner dashboard.

## Phase 1 — build & polish

**Accounts & wishlist coherence**
- Sign-in state is now **global** (shown in the header: "Hi, {name}" / "Sign in").
- Wishlist is **tied to the signed-in account** — hidden when signed out, restored on sign-in.
- Saving to wishlist while signed out prompts sign-in.

**Brand & marketing pass**
- Logo moved to the **top-left corner** with a clean wordmark; removed the repeated slogan.
- Removed the "double footer" effect — one structured footer; Heritage band moved mid-page.
- Newsletter signup consolidated to a single place (footer).

**Cultural & visual polish**
- Devanagari accents (उत्सव, अवसर, परंपरा, स्नेह से चुना गया) with Noto Serif Devanagari.
- New **Shop by Occasion** section (jewel-tone cards) and **Heritage** storytelling band.
- Custom **lotus/mandala** motif divider; cultural marquee terms.
- Cleaned hero/heritage/about imagery (removed baked-in watermarks); favicon + richer SEO.

**Admin security**
- Password-protected `/admin` via middleware + signed httpOnly cookie.
- Owner login page; guarded `POST /api/products` and import APIs; sign-out.

**Shop experience**
- Redesigned shop with a filter rail (category, price, color, availability), sort, active
  chips, and a mobile filter drawer.

**Standard e-commerce features**
- Wishlist, product search overlay, star ratings, size guide, stock urgency, free-shipping
  meter, recently-viewed, account hub, FAQ, custom 404, trust badges, breadcrumbs.

**Live & subscribers**
- Email signup + admin "We're live" one-click blast (mailto BCC).

**Sales system**
- Per-product sale pricing with discount badges; checkout marks items sold and decrements stock.

**Foundations**
- Data-driven catalog from `products.json`; reliable category filtering; brand design system
  (colors, fonts, buttons, motion).

> The 3D "design studio" prototype was built and then removed at the owner's request.
