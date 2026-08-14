# Security

## Owner (admin) login

The dashboard (`/admin`) accepts two first factors — both then require a
second factor before either grants access:

1. **Email + password.** The login page posts to `POST /api/admin/login`.
   The server checks the email against the `ADMIN_EMAILS` list (comma-
   separated; `ADMIN_EMAIL` still works) and the SHA-256 hash of the
   submitted password against `ADMIN_PASSWORD_HASH` using a constant-time
   comparison. The plaintext password is never stored anywhere.
2. **Google.** If the visitor is signed in with Google (NextAuth) and their
   email is in `ADMIN_EMAILS`, the login page offers to email them a code
   (`POST /api/admin/login/google`) — Google sign-in alone no longer grants
   `/admin` access; it's only the first factor.

**Two-factor (2FA).** When `RESEND_API_KEY` is configured, passing either
first factor above emails a 6-digit, one-time code (10-minute expiry, 5 tries
before it's invalidated) to the owner's address. `POST
/api/admin/login/verify` checks it against a hash stored in
`data/admin-otp.json` and, only then, issues the real session. The browser
holds a short-lived, signed **pending** cookie (`reet_admin_pending`, 10 min)
between the two steps — it proves *which* first factor was already passed,
but by itself grants nothing.
If `RESEND_API_KEY` is **not** set (e.g. local dev without it configured),
login falls back to single-factor (password or Google alone), same as
before — set `RESEND_API_KEY` in production so 2FA is actually enforced.

**Sessions.** On successful login the server sets a signed, expiring token
(`expiry.HMAC-SHA256(expiry)`, keyed by `ADMIN_SESSION_SECRET`) in an
**httpOnly** cookie (`reet_admin`): pages can't read it from JavaScript, it
can't be forged without the secret, and it expires after 14 days (shortened
from 30 as part of 2FA hardening). Sign-out clears it.

**Throttling.** Five wrong attempts from one IP — on the password step *or*
the code step — pause further attempts from that IP on that step for 15
minutes (best-effort, in-memory; resets on redeploy, not shared across
serverless instances). Guessing a password and guessing a code draw from
separate budgets, so a leaked/guessed password alone still isn't enough.

**Optional: IP allowlist.** Setting `ADMIN_IP_ALLOWLIST` (comma-separated
IPs) makes `middleware.js` return a plain 404 for *all* `/admin/*` requests
(including `/admin/login`) from any other IP — a defense-in-depth layer on
top of login + 2FA, not a replacement for them. Left unset by default so the
dashboard stays reachable from a phone/anywhere, per how this shop is
actually run.

**What's protected**
- `/admin/*` pages — `middleware.js` checks every request; only a verified
  `reet_admin` session cookie (i.e., a completed 2FA) passes.
- `POST /api/products`, `GET /api/subscribers`, `POST /api/import/*`,
  `GET/PATCH /api/orders` (full list), `GET/PATCH /api/inquiries`,
  `GET /api/accounts`, `GET /api/admin/status` — all return **401** without a
  valid owner session (`lib/adminAuth.js`'s `isAdmin()`, same single source
  of truth as middleware — there is no separate Google-session bypass here
  either).

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

- `.env.local` is git-ignored; nothing secret is committed. (Verified: the
  full git history has only ever tracked `.env.example`, which holds
  placeholders, never a real `.env*` file or hardcoded key.)
- Production values live in Vercel's Environment Variables.
- Rotating a secret (`ADMIN_SESSION_SECRET`, `NEXTAUTH_SECRET`) signs
  everyone out but breaks nothing else.
- To change the admin password: hash the new one
  (`node -e "console.log(require('crypto').createHash('sha256').update('NEW').digest('hex'))"`)
  and update `ADMIN_PASSWORD_HASH`.
- **Automated secret scanning:** `.github/workflows/secret-scan.yml` runs
  [gitleaks](https://github.com/gitleaks/gitleaks) on every push and PR,
  so an accidentally committed key gets caught in CI even before review.
- **GitHub push protection** (recommended, one-time, done in the GitHub UI —
  not a code change): repo **Settings → Code security → Secret scanning →
  Push protection**. Turn it on so GitHub itself rejects a push that contains
  a recognizable secret pattern, before it ever lands in history.
- If a real secret is ever suspected leaked (not just theoretically
  possible): rotate it immediately in Vercel/the provider — a leaked-then-
  rotated secret needs no git history surgery, since the exposed value is
  dead either way.

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
- Login and 2FA-code throttling are per-server-instance (in-memory), not
  global — a determined attacker distributed across many serverless
  instances could exceed the intended 5-per-15-minutes rate. Low risk given
  2FA is also required, but a real rate limiter (e.g. Upstash) would close
  this properly if it ever matters.
- 2FA silently falls back to single-factor if `RESEND_API_KEY` isn't set.
  Make sure it's set in the production Vercel environment.
