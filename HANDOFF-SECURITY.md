# Security hardening handoff — read this before touching auth/admin/env code

**Status:** investigation done, implementation NOT started yet. Written by Claude
(Claude Code) on 2026-08-14, pending a few decisions from the repo owner before
any code changes land. If you (Codex, or a future Claude session) are reading
this, **check the "Claim your lane" section at the bottom before editing any
file this doc mentions**, so we don't step on each other.

## Repo / branch
`Dodgeboi/Reet-colections1`, branch `claude/website-copy-admin-features-roefdh`.
Next.js 14 storefront + owner ("admin") dashboard for a real, live e-commerce
business. Deployed on Vercel, custom domain via GoDaddy.

## What was asked
The owner wants, in plain terms: 2FA on the admin login, the admin dashboard
locked down so it can't be casually reached by an attacker, and confirmation
that no secrets/env vars are exposed on GitHub. This doc is the map of current
state + the plan, written *before* any of it is implemented.

## Current state (verified by reading the code, not assumed)

**Admin auth today** (`middleware.js`, `lib/adminAuth.js`, `lib/adminSession.js`,
`lib/adminEmails.js`, `app/api/admin/login/route.js`):
- Two ways in: (1) email + password, checked against `ADMIN_EMAILS` and a
  SHA-256 hash (`ADMIN_PASSWORD_HASH`) with constant-time comparison, or
  (2) Google sign-in (NextAuth) where the signed-in email is in `ADMIN_EMAILS`.
- Session = signed, expiring HMAC token in an httpOnly cookie, 30-day expiry.
- Login throttling: 5 bad attempts per IP → 15 min lockout, **in-memory only**
  (resets on redeploy/cold start, not shared across serverless instances).
- No 2FA/MFA of any kind currently.
- `middleware.js` gates every `/admin/*` route; the API routes also call
  `isAdmin()` server-side, so it's not just a client-side gate.

**Env vars / secrets:**
- `.gitignore` already excludes `.env`, `.env*.local` — verified real env
  files are **not** tracked.
- Full git history was searched (`git log --all --diff-filter=A --name-only`)
  for any committed `.env*` file — only `.env.example` (placeholders only,
  no real values) has ever been committed. **No secret leak found in this
  repo's history as of this writing.**
- Searched all tracked files for hardcoded API-key-shaped strings
  (`sk-...`, `AIza...`, inline `password =`, etc.) — none found.
- No CI/CD workflow files (`.github/workflows`) exist yet, so no secrets are
  exposed there either.
- Production secrets currently live in Vercel's Environment Variables UI
  (per `docs/SECURITY.md`), not in the repo. This is already the correct
  pattern — nothing to "remove from GitHub" was actually found there.
- So the real remaining work here is *hardening/verification tooling*
  (secret-scanning in CI, pre-commit hook, GitHub push protection), not an
  emergency git-history purge — unless the owner tells us a specific secret
  did leak somewhere, in which case that secret needs rotating regardless of
  what git shows.

**Deployment model:** README explicitly says the owner wants to reach
`/admin` **from a phone, remotely, without a computer**, once deployed. This
directly conflicts with a literal reading of "make admin only run local"
(i.e., block `/admin` unless the request originates from `localhost`) — that
would lock the owner out of the dashboard from their phone. Flagged to the
owner; not implementing a literal localhost-only block until confirmed.

## Plan (pending owner confirmation — see open questions)

Likely shape, once confirmed:
1. **2FA** — add TOTP (or email one-time code, reusing the existing Resend
   integration in `lib/email.js`) as a required second factor after
   password/Google login, before the admin session cookie is issued.
   Touches: `lib/adminAuth.js`, `lib/adminSession.js`,
   `app/api/admin/login/route.js`, `app/admin/login/`, possibly a new
   `lib/adminMfa.js` and `data/` field for TOTP secret / recovery codes.
2. **Admin access restriction** — replace "localhost only" with something
   that doesn't break remote/phone access: stronger session policy (shorter
   expiry + step-up 2FA), optional IP allowlist as a defense-in-depth layer
   (not the sole gate), and/or moving login throttling to something
   persistent instead of in-memory. Exact shape depends on the owner's
   answer below.
3. **Env var / secret hygiene** — since nothing is currently leaked: add a
   secret-scanning safeguard (e.g. gitleaks in a pre-commit hook and/or a
   GitHub Action) so this stays true, double-check `.env.example` never
   grows real values, and document secret rotation in `docs/SECURITY.md`.
   Will also verify GitHub's push protection / secret scanning is enabled on
   the repo settings (that's a GitHub repo setting, not a code change — will
   ask before touching repo settings since that's account-level, not just
   code).
4. Update `docs/SECURITY.md` to reflect whatever actually ships.

## Open questions asked to the owner (answers will update this doc)
- Does "admin only run local" mean literal localhost-only (breaks the
  phone/remote use case described in the README), or something else
  (IP allowlist, VPN, or just "make it much harder to reach than it is now")?
- 2FA method: TOTP authenticator app, email one-time code (infra already
  exists via Resend), or both?
- Env vars: just verify + add ongoing safeguards (current finding: nothing
  is actually leaked), or is there a specific secret/incident that needs
  rotating?
- Where the owner's local working copy of this repo lives, so file changes
  land in the right place relative to what Codex is working on.

## Claim your lane (for whoever reads this — Codex or another Claude session)
Files this work will touch once it starts: `middleware.js`, `lib/adminAuth.js`,
`lib/adminSession.js`, `lib/adminEmails.js`, `app/api/admin/login/route.js`,
`app/admin/login/*`, `docs/SECURITY.md`, `.env.example`, and possibly a new
`lib/adminMfa.js`. **If you're working on anything else in this repo, you're
clear — no overlap expected.** If you need to touch any of the files above
before this work lands, leave a note in this file (or ping the owner) first
so we don't produce conflicting edits to the same auth code.

This file should be deleted or archived once the hardening work is merged —
it's a coordination doc, not permanent documentation (that's `docs/SECURITY.md`'s job).
