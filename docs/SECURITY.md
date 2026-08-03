# Security

## Owner (admin) login

The dashboard (`/admin`) accepts two ways in — both land on the same pages:

1. **Email + password.** The login page posts to `POST /api/admin/login`.
   The server checks the email against the `ADMIN_EMAILS` list (comma-
   separated; `ADMIN_EMAIL` still works) and the SHA-256 hash of the
   submitted password against `ADMIN_PASSWORD_HASH` using a constant-time
   comparison. The plaintext password is never stored anywhere.
2. **Google.** If the visitor is signed in with Google (NextAuth) and their
   email is in `ADMIN_EMAILS`, middleware lets them straight in.

**Sessions.** On password login the server sets a signed, expiring token
(`expiry.HMAC-SHA256(expiry)`, keyed by `ADMIN_SESSION_SECRET`) in an
**httpOnly** cookie: pages can't read it from JavaScript, it can't be forged
without the secret, and it expires after 30 days. Sign-out clears it.

**Throttling.** Five wrong password attempts from one IP pause logins from
that IP for 15 minutes (best-effort, in-memory).

**What's protected**
- `/admin/*` pages — `middleware.js` checks every request.
- `POST /api/products`, `GET /api/subscribers`, `POST /api/import/*`,
  `GET/PATCH /api/orders` (full list), `GET/PATCH /api/inquiries`,
  `GET /api/accounts`, `GET /api/admin/status` — all return **401** without a
  valid owner session (or owner Google session).

## Customer accounts

Customer sign-in goes through NextAuth (JWT sessions, no database): Google,
Facebook, or a single-use code emailed to the visitor. We receive only name,
email, and profile photo. There are no site-managed passwords to leak. A
signed-in customer can read **only their own** orders (`GET /api/orders`
filters by session email).

Each sign-in also writes a row to `data/accounts.json` (email, name, provider,
dates) so the dashboard can count customers. That file is owner-only over the
API, and inquiries (`data/inquiries.json`) hold customer contact details too —
both deserve the same care as orders.

## Secrets

- `.env.local` is git-ignored; nothing secret is committed.
- Production values live in Vercel's Environment Variables.
- Rotating a secret (`ADMIN_SESSION_SECRET`, `NEXTAUTH_SECRET`) signs
  everyone out but breaks nothing else.
- To change the admin password: hash the new one
  (`node -e "console.log(require('crypto').createHash('sha256').update('NEW').digest('hex'))"`)
  and update `ADMIN_PASSWORD_HASH`.

## Data storage notes

In production, shop data (products, orders, subscribers, inquiries, accounts)
is stored in Vercel
Blob. Blob URLs are public-but-unguessable; order data includes customer
contact details, so **don't share those URLs**. Moving to a proper database
(with row-level access) is on the roadmap and recommended as order volume
grows.

## Known gaps (tracked on the Roadmap)

- No online payments yet — payment is arranged personally, so no card data
  ever touches the site.
- Blob storage is last-write-wins; two admins saving at the exact same
  moment could overwrite each other. Fine for one owner, not for a team.
- Login throttling is per-server-instance (in-memory), not global.
