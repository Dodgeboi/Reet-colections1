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
| Inquiries | `data/inquiries.json` → Blob | ✅ with Blob connected |
| Customer accounts | `data/accounts.json` → Blob (sessions stay JWT) | ✅ with Blob connected |
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
{
  "hero": "https://…/upload-123.jpg",
  "heritage": "/images/heritage-mustard.jpg",
  "about": "/images/hero-anarkali.jpg",
  "liveThumbs": { "live-2026-06-16": "https://…/upload-124.jpg" },
  "categoryTiles": { "kurtis": "https://…/upload-125.jpg" }
}
```

Only what the owner has changed is stored; anything missing falls back to the
built-in defaults (`lib/siteSettings.js`). All of it is edited in place on
the storefront (owner-only "Edit photos" mode), never by hand.

## Subscriber object (`data/subscribers.json`)

```json
{ "email": "person@example.com", "at": "2026-06-21T08:00:00.000Z" }
```

## Inquiry object (`data/inquiries.json`)

Created by `POST /api/inquiries` from the Inquiries page (`/inquiry`).

```json
{
  "ref": "INQ-874374",
  "at": "2026-06-21T09:12:00.000Z",
  "status": "new",
  "name": "Buyer Name",
  "email": "buyer@example.com",
  "phone": "+1 555 0100",
  "topic": "An order",
  "orderNo": "RC-845210",
  "message": "Where is my order?"
}
```

`status` is one of `new · answered · closed`, moved along by the owner from
the Inquiries tab. `topic` is one of the choices on the form; `orderNo` is
filled in automatically when the visitor arrives from an order on their
account page.

## Account object (`data/accounts.json`)

One row per person who has ever signed in, written by the NextAuth `signIn`
callback (`lib/accounts.js`). Sessions themselves stay JWT-only — this file
exists so the dashboard can count and list customers.

```json
{
  "email": "buyer@example.com",
  "name": "Buyer Name",
  "image": "https://…/photo.jpg",
  "provider": "google",
  "at": "2026-06-01T18:00:00.000Z",
  "lastSignInAt": "2026-06-21T20:00:00.000Z",
  "signIns": 4
}
```

`at` is the first sign-in (the "account created" date the dashboard counts);
`provider` is `google`, `facebook` or `reet-code`. Writes are best-effort —
a storage problem never blocks someone from signing in.

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

- Sign-in is **NextAuth with JWT sessions** (Google, Facebook, or an emailed
  code) — the session carries `{ name, email, image, since }`, and each
  sign-in is also recorded in `data/accounts.json` (above) for the dashboard
  counter.
- `reet-wishlist:{email}` — saved product ids for that account (localStorage).
- `reet-viewed` — recently-viewed product ids (device-level, localStorage).
- `reet-cart` — the shopping bag (device-level, localStorage).
