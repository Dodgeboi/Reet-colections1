# Security

## Admin dashboard protection

The owner dashboard (`/admin`) is protected by a password login.

**How it works**
1. `middleware.js` intercepts every `/admin/*` request. If there's no valid session cookie,
   it redirects to `/admin/login`.
2. The login page posts the password to `POST /api/admin/login`, which compares it to the
   `ADMIN_PASSWORD` environment variable.
3. On success it sets a signed, **httpOnly** cookie (`reet_admin`) — JavaScript on the page
   cannot read it, which protects against theft via cross-site scripting.
4. The cookie value is the secret `ADMIN_TOKEN`. Middleware and the protected API routes
   compare the cookie to this token on every request.

**What's protected**
- The `/admin` pages (via middleware).
- `POST /api/products` (saving inventory) — returns **401** without a valid cookie, so the
  API can't be abused directly.
- `POST /api/import/*` (AI import) — admin only.

**Sign out** clears the cookie (`DELETE /api/admin/login`).

## Password handling rules

- The password lives only in `.env.local` (never committed to git).
- **Change the default** (`reet-admin-2026`) before launch; pick something long and unique.
- Set `ADMIN_PASSWORD` and `ADMIN_TOKEN` in Vercel's environment settings for production.
- Never paste secrets into code, screenshots, or chat.

## Customer accounts

Customer sign-in is **device-local** (stored in the browser) for now — there is no password,
just a name + email, kept in `localStorage`. This is intentional for Phase 1. Phase 2
(Supabase Auth) adds real, cross-device logins with proper credentials.

## Known gaps to close before/at launch

These are tracked in the [Roadmap](./ROADMAP.md):

1. **`GET /api/subscribers` is currently public** — it returns the email list to anyone.
   It should be gated to admin (same `isAdmin()` check as the other protected routes)
   before real subscribers are collected. *(Priority: high, quick fix.)*
2. **Payments must use a processor.** When checkout takes real money, card details must be
   handled by **Stripe** (hosted) — never collected in our own form. The current card
   fields are a mock and will be replaced. See [Roadmap](./ROADMAP.md).
3. **Legal pages** (Privacy, Terms) are required once you collect data and take payment —
   see [`docs/legal`](./legal).
4. **Rate limiting / abuse protection** on public POST endpoints (subscribe) is worth adding
   when live.

## Data privacy

- Collect only what you need (email for notifications; name/email/address at checkout).
- Don't log or expose customer data. Don't put personal data in URLs.
- A published **Privacy Policy** is required — a template is provided in `docs/legal`.
