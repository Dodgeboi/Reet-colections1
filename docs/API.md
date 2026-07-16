# API reference

All endpoints live under `app/api/`. They run on the Next.js server (Node runtime).
Base URL is your site root (e.g. `https://reetcollections.com`).

## Products

### `GET /api/products` — *public*
Returns the full catalog as a JSON array of product objects.
Used by the storefront, search, and account pages.

### `POST /api/products` — *admin only*
Saves the entire catalog. Body: a JSON array of products.
Requires an owner session; returns **401 Unauthorized** otherwise.
Used by the admin dashboard's "Save changes" button.

### `PATCH /api/products` — *admin only*
Body: `{ "id": "RC-1001", "image": "<url>" }`. Replaces one product's photo —
used by in-place photo editing on the storefront.

## Orders

### `POST /api/orders` — *public (checkout)*
Body: `{ "customer": { name, email, phone, address, city, zip, country, note }, "items": [{ id, qty, size }] }`.
Validates the items against the live catalog, computes prices/shipping
**server-side**, decrements stock (an item hitting zero becomes `"sold"`),
stores the order, and returns `{ ok, no, total }`. If a requested piece has
already sold, returns **409** with a friendly message.

### `GET /api/orders`
- **Owner session:** returns every order.
- **Signed-in customer (Google):** returns only orders whose email matches
  their session email.
- Otherwise **401**.

### `PATCH /api/orders` — *admin only*
Body: `{ "no": "RC-123456", "status": "confirmed" }`.
Statuses: `new → confirmed → shipped → delivered`, or `cancelled`.

## Subscribers (live-notify list)

### `GET /api/subscribers` — *admin only*
Returns the list of subscriber emails. **401** without an owner session.

### `POST /api/subscribers` — *public*
Body: `{ "email": "person@example.com" }`. Adds the email (de-duplicated).
Used by the footer newsletter signup.

## Authentication

### `POST /api/admin/login`
Body: `{ "email": "...", "password": "..." }`. If they match `ADMIN_EMAIL` /
`ADMIN_PASSWORD_HASH`, sets a signed, expiring httpOnly cookie (`reet_admin`)
and returns `{ ok: true }`. Wrong credentials → **401**; five misses from one
IP → **429** for 15 minutes.

### `DELETE /api/admin/login`
Clears the owner session cookie (sign out).

### `GET/POST /api/auth/*` — NextAuth
Google sign-in endpoints managed by NextAuth (`signIn`, `callback`,
`session`, `signOut`…). Configured in `lib/auth.js`.

### `GET /api/admin/status` — *admin only*
Dashboard health check: `{ writable, google, aiImport }` — whether saves
persist (Blob connected / local disk), whether Google sign-in is configured,
and whether the AI importer has an API key.

## Site photos & uploads

### `GET /api/site` — *public*
The editable site imagery: `{ hero, heritage, about, liveThumbs, categoryTiles }`.
Defaults are built in; the owner's choices override them.

### `POST /api/site` — *admin only*
Body: any of `{ hero, heritage, about }` as image URLs, and/or the maps
`{ liveThumbs: { <liveId>: url } }` and `{ categoryTiles: { <slug>: url } }`
(merged into what's stored). Saved immediately.

### `POST /api/upload` — *admin only*
Multipart form with a `file` image (max 8 MB). Stores it (Vercel Blob in
production, a local folder in dev) and returns `{ url }` for use as a product
or site photo.

### `GET /api/uploads/[name]` — *public*
Serves locally-uploaded photos in development (`next start` doesn't serve
files added to `/public` after a build). Production photos live on Blob and
never hit this route.

## AI photo import — *admin only*

### `POST /api/import/extract`
Multipart form (`images[]`, `caption`). Saves the photos (Vercel Blob in
production, `public/images/imports` locally) and asks Claude to extract
product details. Falls back to editable blanks when no `ANTHROPIC_API_KEY`
is configured.

### `POST /api/import/approve`
Body: `{ products: [...] }` from the extract step, cleaned up by the owner.
Appends them to the catalog.

---

### Authentication summary

| Endpoint | Method | Who |
|---|---|---|
| `/api/products` | GET | Public |
| `/api/products` | POST | Owner |
| `/api/orders` | POST | Public (checkout) |
| `/api/orders` | GET | Owner (all) / customer (own) |
| `/api/orders` | PATCH | Owner |
| `/api/subscribers` | GET | Owner |
| `/api/subscribers` | POST | Public |
| `/api/admin/login` | POST/DELETE | Public endpoint, guarded by credentials |
| `/api/admin/status` | GET | Owner |
| `/api/auth/*` | GET/POST | NextAuth (Google) |
| `/api/site` | GET | Public |
| `/api/site` | POST | Owner |
| `/api/upload` | POST | Owner |
| `/api/import/*` | POST | Owner |
