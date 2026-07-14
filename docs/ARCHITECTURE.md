# Architecture

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14** (App Router, JavaScript) | React framework with built-in routing, server rendering, and API routes |
| UI library | **React 18** | Component model |
| Styling | **Tailwind CSS** | Utility-first styling with a custom brand theme |
| Animation | **Framer Motion** | Subtle, premium motion (hero, reveals) |
| Fonts | Cormorant Garamond, Jost, Noto Serif Devanagari | Display serif, clean sans, and Devanagari for cultural accents |
| Data (current) | **JSON files** on disk | Simple, zero-setup. Migrating to Supabase in Phase 2 |
| Auth (admin) | Middleware + signed **httpOnly cookie** | Password-gated owner dashboard |
| Auth (customer) | Browser `localStorage` | Device-local accounts until Supabase |
| Hosting (planned) | **Vercel** | Built for Next.js, free tier, automatic HTTPS |

## How a page request flows

1. A visitor hits a route (e.g. `/collections`).
2. Next.js renders the matching **server component** in `app/`.
3. Server pages read product data via `lib/catalog.js` (a fresh read of
   `data/products.json` on every request, so the storefront always reflects the latest admin saves).
4. The server passes data to **client components** (the interactive bits — filters, cart,
   wishlist) which run in the browser.
5. Client components talk to **API routes** in `app/api/` for actions (saving inventory,
   recording a purchase, subscribing).

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
│   ├── account/              # Customer account (sign in + dashboard)
│   ├── about/ contact/ faq/ live/
│   ├── admin/                # Owner dashboard (protected)
│   │   ├── login/            # Owner login page
│   │   └── import/           # AI photo-import tool
│   └── api/                  # Backend endpoints (see API.md)
│       ├── products/         # GET catalog (public) · POST save (admin)
│       ├── purchase/         # POST decrement stock / mark sold
│       ├── subscribers/      # GET/POST email list
│       ├── admin/login/      # POST login · DELETE logout
│       └── import/           # AI import (admin)
├── components/               # Reusable UI + context providers
├── lib/                      # Helpers (catalog, products, categories, lives, adminAuth)
├── data/                     # products.json, subscribers.json
├── public/images/            # Logos, hero images, product photos
├── middleware.js             # Gatekeeper for /admin
├── docs/                     # ← you are here
├── .env.local                # Secrets (admin password/token) — not committed
└── .env.example              # Template for the env file
```

## Key modules (`lib/`)

- **`catalog.js`** — `getCatalog()` reads `products.json` fresh on every request (server only).
- **`products.js`** — client-safe helpers: sizes, sale math (`onSale`, `effectivePrice`,
  `discountPct`), category filtering (`filterCategory`), and deterministic `rating`/`reviewCount`.
- **`categories.js`** — the category list and slug lookups.
- **`lives.js`** — Facebook page link and the most recent lives.
- **`adminAuth.js`** — `isAdmin()` server check (reads the signed cookie).

## State management (client)

Three React Context providers wrap the app in `layout.js`:

- **`CartProvider`** — cart items + totals, persisted in `localStorage`.
- **`AccountProvider`** — the signed-in customer (global), persisted in `localStorage`.
- **`WishlistProvider`** — wishlist tied to the signed-in account, plus recently-viewed.

> The provider order matters: `Account` wraps `Wishlist`, so the wishlist always knows
> who is signed in and shows the right list (or none, when signed out).
