# Data model

## Where data lives today

| Data | Storage | Persists in production? |
|---|---|---|
| Products / inventory | `data/products.json` | ❌ Needs Supabase |
| Subscribers | `data/subscribers.json` | ❌ Needs Supabase |
| Customer accounts | Browser `localStorage` | Device-only |
| Wishlist | Browser `localStorage` | Device-only |
| Orders | Browser `localStorage` | Device-only |

In Phase 2 these move to a real database (Supabase) so they persist and sync across devices.

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

## Subscriber object (`data/subscribers.json`)

```json
{ "email": "person@example.com", "at": "2026-06-21T08:00:00.000Z" }
```

## Order record (localStorage key `reet-orders`)

```json
{
  "no": "RC-845210",
  "at": "2026-06-21T20:05:00.000Z",
  "email": "buyer@example.com",
  "items": [{ "id": "RC-1011", "qty": 1, "name": "...", "price": 85, "image": "...", "size": "M", "color": "Black" }],
  "total": 94
}
```

## Account object (localStorage)

- `reet-account` — the currently signed-in user: `{ name, email, since }`.
- `reet-accounts` — a map of `email → { name, since }` (so sign-in can restore your name).
- `reet-wishlist:{email}` — saved product ids for that account.
- `reet-viewed` — recently-viewed product ids (device-level).
