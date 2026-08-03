# Architecture

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, JavaScript) | React framework with built-in routing, server rendering, and API routes |
| UI library | **React 18** | Component model |
| Styling | **Tailwind CSS** | Utility-first styling with a custom brand theme |
| Animation | **Framer Motion** | Subtle, premium motion (hero, reveals) |
| Fonts | Cormorant Garamond, Jost, Noto Serif Devanagari | Display serif, clean sans, and Devanagari for cultural accents |
| Data | JSON files in dev · **Vercel Blob** in production | One storage layer (`lib/store.js`), zero-setup locally, persistent when deployed |
| Auth (owner) | Email + hashed password → signed expiring **httpOnly cookie**; or owner's Google account | Two ways into `/admin` |
| Auth (customer) | **NextAuth + Google OAuth** (JWT sessions) | Real accounts, no password handling, no database needed |
| Hosting | **Vercel** | Built for Next.js, free tier, automatic HTTPS ([Deployment](./DEPLOYMENT.md)) |

## How a page request flows

1. A visitor hits a route (e.g. `/collections`).
2. Next.js renders the matching **server component** in `app/`.
3. Server pages read product data via `lib/catalog.js` → `lib/store.js` (a fresh read on
   every request — local JSON in dev, Vercel Blob in production — so the storefront always
   reflects the latest admin saves).
4. The server passes data to **client components** (the interactive bits — filters, cart,
   wishlist) which run in the browser.
5. Client components talk to **API routes** in `app/api/` for actions (saving inventory,
   placing orders, subscribing).

## Folder structure

```
reet-collections/
├── app/                      # Pages (Next.js App Router) + API routes
│   ├── page.js               # Home
│   ├── layout.js             # Global shell: providers, Header, Footer
│   ├── globals.css           # Base styles + design tokens
│   ├── not-found.js          # Custom 404
│   ├── collections/          # Shop (all + per-category)
│   ├── product/[id]/         # Product detail
│   ├── checkout/             # Checkout flow
│   ├── account/              # Customer account (Google sign-in + dashboard)
│   ├── about/ faq/ inquiry/ live/     # faq = Help · inquiry = Inquiries form
│   ├── contact/              # legacy path, redirects to /inquiry
│   ├── privacy/ terms/ shipping-returns/   # Legal pages
│   ├── admin/                # Owner dashboard (protected)
│   │   ├── login/            # Owner login page
│   │   └── import/           # AI photo-import tool
│   └── api/                  # Backend endpoints (see API.md)
│       ├── products/         # GET catalog (public) · POST save (owner)
│       ├── orders/           # POST place order · GET list · PATCH status
│       ├── subscribers/      # POST subscribe (public) · GET list (owner)
│       ├── inquiries/        # POST send (public) · GET list · PATCH status (owner)
│       ├── accounts/         # GET account count + list (owner)
│       ├── auth/[...nextauth]/ # Google sign-in (NextAuth)
│       ├── admin/login/      # POST login · DELETE logout
│       ├── admin/status/     # GET dashboard health (owner)
│       └── import/           # AI import (owner)
├── components/               # Reusable UI + context providers
├── lib/                      # Helpers (catalog, products, categories, lives, adminAuth)
├── data/                     # products.json, orders.json, subscribers.json,
│                             # inquiries.json, accounts.json (dev seeds)
├── public/images/            # Logos, hero images, product photos
├── middleware.js             # Gatekeeper for /admin
├── docs/                     # ← you are here
├── .env.local                # Secrets (owner login, NextAuth, Google) — not committed
└── .env.example              # Template for the env file
```

## Key modules (`lib/`)

- **`store.js`** — `readJson`/`writeJson`: the one storage layer (local files in dev,
  Vercel Blob in production) plus `writesPersist()` for the dashboard health check.
- **`catalog.js`** — `getCatalog()` reads the product list fresh on every request (server only).
- **`products.js`** — client-safe helpers: sizes, shipping constants, sale math (`onSale`,
  `effectivePrice`, `discountPct`), category filtering (`filterCategory`).
- **`categories.js`** — the category list and slug lookups.
- **`lives.js`** — Facebook page link, the most recent lives, date-based week labels.
- **`auth.js`** — NextAuth configuration (Google provider, JWT sessions).
- **`adminAuth.js`** — `isAdmin()` server check (owner cookie **or** owner Google session).
- **`adminSession.js`** — signed expiring session tokens (Web Crypto; runs in middleware too).
- **`site.js`** — the canonical site URL for SEO metadata, sitemap, JSON-LD.

## State management (client)

Three React Context providers wrap the app in `layout.js`:

- **`CartProvider`** — cart items + totals, persisted in `localStorage`.
- **`AccountProvider`** — bridges the NextAuth (Google) session into `{ account, ready }`.
- **`WishlistProvider`** — wishlist tied to the signed-in account, plus recently-viewed.

> The provider order matters: `Account` wraps `Wishlist`, so the wishlist always knows
> who is signed in and shows the right list (or none, when signed out).
