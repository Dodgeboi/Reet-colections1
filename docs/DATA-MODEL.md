# Data model

## Where data lives

Reads and writes go through one storage layer (`lib/store.js`): plain JSON
files in `data/` during development, **Vercel Blob** in production (connect a
Blob store once — see [Deployment](./DEPLOYMENT.md) Step 3).

| Data | Storage | Persists in production? |
|---|---|---|
| Products / inventory | `data/products.json` → Blob | ✅ with Blob connected |
| Site photos (hero, heritage, about) | `data/site.json` → Blob | ✅ with Blob connected |
| Orders | `data/orders.json` → Blob | ✅ with Blob connected |
| Subscribers | `data/subscribers.json` → Blob | ✅ with Blob connected |
| Customer accounts | Google sign-in (NextAuth, JWT) | ✅ no database needed |
| Wishlist / recently viewed / cart | Browser `localStorage` | Device-only by design |

## Product object

Each entry in `data/products.json`:

```json
{
  "id": "RC-1011",            // unique id
  "code": "DUNKI-0",          // display/style code
  "name": "Black & White Chevron Crop Set",
  "category": "lehengas",     // slug — see categories.js
  "color": "Black",
  "sizes": ["S", "M", "L", "XL"],
  "price": 85,                // USD
  "salePrice": null,          // a number when on sale, else null
  "cost": 40,                 // wholesale cost (admin only, for margins)
  "qty": 1,                   // units in stock
  "status": "available",      // "available" | "claimed" | "sold"
  "fabric": "Pure Viscose",
  "featured": true,
  "thisWeek": false,
  "newIn": true,              // shows the "New" badge
  "clearance": false,
  "image": "/images/products/reet-01.jpg",
  "note": "A stunning fusion piece...",
  "addedBy": "admin",
  "source": "manual"
}
```

### Field notes
- **status** drives the badges and whether an item can be bought. `purchase` sets it to
  `"sold"` when `qty` reaches 0.
- **salePrice** — when set, the storefront shows the discounted price, a strike-through
  original, and a "% off" badge.
- **newIn** — set to `true` automatically for items added through the admin, producing the
  "New" badge.
- **Special category slugs** used by filters: `this-week`, `new-in`, `sale`, `clearance`
  (these read the boolean flags above rather than the literal category).

## Site settings (`data/site.json`)

```json
{ "hero": "https://…/upload-123.jpg", "heritage": "/images/heritage-mustard.jpg", "about": "/images/hero-anarkali.jpg" }
```

Only the slots the owner has changed are stored; anything missing falls back
to the built-in defaults (`lib/siteSettings.js`).

## Subscriber object (`data/subscribers.json`)

```json
{ "email": "person@example.com", "at": "2026-06-21T08:00:00.000Z" }
```

## Order object (`data/orders.json`)

Created by `POST /api/orders` at checkout; prices are computed server-side.

```json
{
  "no": "RC-845210",
  "at": "2026-06-21T20:05:00.000Z",
  "status": "new",
  "customer": {
    "name": "Buyer Name",
    "email": "buyer@example.com",
    "phone": "+1 555 0100",
    "address": "12 Lane", "city": "Townsville", "zip": "12345", "country": "United States",
    "note": "size help please"
  },
  "items": [{ "id": "RC-1011", "qty": 1, "name": "...", "price": 85, "image": "...", "size": "M", "color": "Black" }],
  "subtotal": 85,
  "shipping": 9,
  "total": 94
}
```

`status` is one of `new · confirmed · shipped · delivered · cancelled`, moved
along by the owner from the dashboard.

## Customer accounts & device data

- Accounts are **Google sign-ins** (NextAuth JWT sessions) — nothing stored
  server-side; the session carries `{ name, email, image, since }`.
- `reet-wishlist:{email}` — saved product ids for that account (localStorage).
- `reet-viewed` — recently-viewed product ids (device-level, localStorage).
- `reet-cart` — the shopping bag (device-level, localStorage).
