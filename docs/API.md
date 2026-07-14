# API reference

All endpoints live under `app/api/`. They run on the Next.js server (Node runtime).
Base URL is your site root (e.g. `https://reetcollections.com`).

## Products

### `GET /api/products` — *public*
Returns the full catalog as a JSON array of product objects.
Used by the storefront, search, and account pages.

### `POST /api/products` — *admin only*
Saves the entire catalog. Body: a JSON array of products.
Requires a valid admin session cookie; returns **401 Unauthorized** otherwise.
Used by the admin dashboard's "Save changes" button.

## Purchases

### `POST /api/purchase` — *public*
Body: `[{ "id": "RC-1011", "qty": 1 }, ...]`
Decrements stock for each item; when an item's quantity hits zero, its status becomes
`"sold"`. Called automatically at checkout so the admin reflects real sales.

## Subscribers (live-notify list)

### `GET /api/subscribers`
Returns the list of subscriber emails. *(See the note in [Security](./SECURITY.md) —
this should be locked to admin in Phase 2.)*

### `POST /api/subscribers` — *public*
Body: `{ "email": "person@example.com" }`. Adds the email (de-duplicated).
Used by the footer newsletter signup.

## Admin authentication

### `POST /api/admin/login`
Body: `{ "password": "..." }`. If it matches `ADMIN_PASSWORD`, sets a signed httpOnly
cookie (`reet_admin`) and returns `{ ok: true }`. Wrong password → **401**.

### `DELETE /api/admin/login`
Clears the session cookie (sign out).

## AI photo import — *admin only*

### `POST /api/import/extract`
Sends an uploaded photo to Claude to extract product details. Requires an Anthropic API key
configured server-side. Admin-gated.

### `POST /api/import/approve`
Saves an extracted/approved product into the catalog. Admin-gated.

---

### Authentication summary

| Endpoint | Method | Who |
|---|---|---|
| `/api/products` | GET | Public |
| `/api/products` | POST | Admin |
| `/api/purchase` | POST | Public (checkout) |
| `/api/subscribers` | GET | Public *(harden in Phase 2)* |
| `/api/subscribers` | POST | Public |
| `/api/admin/login` | POST/DELETE | Public (it *is* the login) |
| `/api/import/*` | POST | Admin |
