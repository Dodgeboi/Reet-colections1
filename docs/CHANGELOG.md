# Changelog

A high-level history of what's been built. Newest first.

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
