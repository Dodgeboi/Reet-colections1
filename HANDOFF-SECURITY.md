# Security hardening — handoff (DONE, this pass)

Written by Claude (Claude Code) on 2026-08-14. This work is **implemented,
tested locally, and pushed** to branch `claude/security-handoff` in
`Dodgeboi/Reet-colections1`. Not merged to `claude/website-copy-admin-features-roefdh`
or `main` — that's the owner's call. If you're Codex (or another Claude
session) picking this up: read this whole doc before touching any file it
lists, so we don't produce conflicting edits.

## What was asked, and the decisions made (confirmed with the owner)
- **2FA**: email one-time code (reuses the existing Resend integration —
  no new app/QR code for the owner to deal with).
- **"Admin only run local"**: the owner confirmed this should NOT mean
  literal localhost-only — the README explicitly wants `/admin` reachable
  from a phone, remotely. Implemented as "keep remote access, harden it"
  instead: 2FA + shorter sessions + an opt-in IP allowlist, not a hard
  localhost block.
- **Env vars**: git history and tracked files were searched — nothing secret
  was ever actually committed (`.env*` was already git-ignored; only
  `.env.example` placeholders are tracked). So this became "add ongoing
  safeguards," not an emergency history purge.

## What shipped (all on `claude/security-handoff`, pushed)

**2FA (email one-time code)**
- `lib/adminOtp.js` — issues/checks a 6-digit code (10 min TTL, 5 tries),
  stored hashed in `data/admin-otp.json`, emailed via the existing
  `lib/email.js`. `adminTwoFactorEnabled()` gates all of this on
  `RESEND_API_KEY` being set — unset it, and login falls back to today's
  single-factor behavior (never bricks login).
- `lib/adminSession.js` — added a short-lived signed "pending" cookie
  (`reet_admin_pending`, 10 min) that proves "this browser passed the first
  factor for this email," using the same HMAC scheme as the existing session
  token (no new secret needed — reuses `ADMIN_SESSION_SECRET`). Also
  shortened `SESSION_MAX_AGE` from 30 to 14 days.
- `app/api/admin/login/route.js` (password) and
  `app/api/admin/login/google/route.js` (new — Google-admin-session first
  factor) both now issue a code + pending cookie instead of an immediate
  session, when 2FA is enabled.
- `app/api/admin/login/verify/route.js` (new) — checks the code against the
  pending cookie's email and issues the real `reet_admin` session cookie.
- `components/AdminLoginForm.js` / `app/admin/login/page.js` — two-stage UI
  (password-or-Google → code entry). Server component detects an existing
  admin Google session and offers "email me a code" directly.
- **Removed the old direct bypass**: middleware.js and `lib/adminAuth.js`'s
  `isAdmin()` used to trust a Google-signed-in owner session on its own.
  Both now trust *only* the `reet_admin` cookie, which is never issued
  without completing 2FA (when enabled). Single source of truth everywhere.

**Access hardening**
- `lib/loginThrottle.js` — shared IP throttle (5 tries / 15 min), now scoped
  separately per step (`:password`, `:code`, `:google`) instead of one
  combined bucket.
- `lib/adminAccess.js` + `middleware.js` — optional `ADMIN_IP_ALLOWLIST` env
  var. Unset by default (remote access keeps working); if set, any other IP
  gets a plain 404 on all of `/admin/*`, including the login page itself.

**Secrets**
- `.github/workflows/secret-scan.yml` — gitleaks on every push/PR.
- `docs/SECURITY.md` rewritten to match reality; documents that GitHub's
  **push protection** (Settings → Code security → Secret scanning) should be
  turned on manually — that's a repo setting, not something a code change
  can do, and this session didn't touch repo settings.
- `.env.example`, `docs/DEVELOPMENT.md`, `README.md`, `docs/CHANGELOG.md`
  updated to match.

## Verified locally before pushing
Ran a full local smoke test (`npm install`, `npm run build`, `npm run dev`
with a throwaway `.env.local` that was deleted after — never committed):
- Wrong password → 401; 5x wrong → 429 lockout.
- Correct password → `stage:"code"`, pending cookie set, **no** `reet_admin`
  cookie yet (confirmed via cookie jar inspection).
- Wrong code → 401; correct code → `reet_admin` cookie issued.
- `/admin` without a session → 307 redirect to `/admin/login`.
- `/admin` with a valid `reet_admin` cookie → 200.
- `ADMIN_IP_ALLOWLIST` set to a non-matching IP → `/admin/login` returns 404,
  storefront (`/`) unaffected; unset → normal again.
- `npm run build` succeeds, middleware compiles clean for the Edge runtime
  (no Node-only APIs leaked into `middleware.js`, `lib/loginThrottle.js`, or
  `lib/adminAccess.js`).

## Not done / explicitly out of scope this pass
- Did **not** rewrite git history — nothing was found leaked, so there was
  nothing to purge. If a real secret is ever suspected leaked, rotate it in
  Vercel immediately; that alone neutralizes it.
- Did **not** enable GitHub's push-protection setting — that requires repo
  Settings UI access, which this session didn't have/use. Owner should
  enable it (documented in `docs/SECURITY.md`).
- Did **not** touch payments, database migration, or anything on the
  Roadmap unrelated to security.
- Did **not** merge `claude/security-handoff` anywhere. A PR is easy to open
  from that branch when the owner's ready to review the diff.

## Claim your lane
Files touched this pass: `middleware.js`, `lib/adminAuth.js`,
`lib/adminSession.js`, `lib/adminOtp.js` (new), `lib/loginThrottle.js` (new),
`lib/adminAccess.js` (new), `app/api/admin/login/*` (route.js + new
`verify/`, `google/`), `app/admin/login/page.js`,
`components/AdminLoginForm.js`, `data/admin-otp.json` (new seed),
`.env.example`, `.github/workflows/secret-scan.yml` (new),
`docs/SECURITY.md`, `docs/DEVELOPMENT.md`, `docs/CHANGELOG.md`, `README.md`.
**If your work touches any of these, coordinate first** (leave a note here or
ping the owner) — otherwise, no overlap expected, go ahead.

This file can be deleted once the branch is reviewed/merged — it's a
coordination doc, not permanent documentation.
