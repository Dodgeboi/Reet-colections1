# Development guide

## Prerequisites

- **Node.js 18+** (includes npm). Check with `node -v`.
- A code editor (VS Code recommended).

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Create your secrets file
#    Copy .env.example to .env.local and fill it in (see the table below).

# 3. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

Defined in **`.env.local`** (never commit this file — it's git-ignored).
A template lives in `.env.example`.

| Variable | Purpose |
|---|---|
| `ADMIN_EMAILS` | Owner emails, comma-separated — each works for `/admin` login (password or their own Google account), both followed by an emailed 2FA code |
| `ADMIN_PASSWORD_HASH` | SHA-256 hash of the owner password (never the password itself) |
| `ADMIN_SESSION_SECRET` | Long random secret that signs the owner session cookie and the 2FA pending-cookie |
| `NEXTAUTH_SECRET` | Long random secret for NextAuth (Google sign-in) sessions |
| `NEXTAUTH_URL` | The site's URL — `http://localhost:3000` in dev |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials ([Deployment](./DEPLOYMENT.md) Step 4) |
| `RESEND_API_KEY` | Free key from [resend.com](https://resend.com) — powers customer sign-in codes, order/subscribe emails, **and admin 2FA**. Without it, admin login is single-factor (see [Security](./SECURITY.md)) |
| `ADMIN_IP_ALLOWLIST` | Optional — comma-separated IPs allowed to reach `/admin` at all. Leave unset to keep remote access working |
| `ANTHROPIC_API_KEY` | Optional — enables the admin AI photo importer |
| `BLOB_READ_WRITE_TOKEN` | Injected by Vercel in production; leave empty locally |

> Hash a password with
> `node -e "console.log(require('crypto').createHash('sha256').update('YOUR-PASSWORD').digest('hex'))"`
> and generate secrets with
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Production build (run this to catch errors before deploying) |
| `npm start` | Serve the production build locally |
| `npm run lint` | Run the linter |

## Viewing on your phone

- **Same Wi-Fi:** `npm run dev -- -H 0.0.0.0`, then open the printed
  `http://192.168.x.x:3000` on your phone (same network).
- **Anywhere:** deploy a preview to Vercel — see [Deployment](./DEPLOYMENT.md).

## The efficient workflow (recommended)

Re-downloading a zip and running localhost for every change is slow. Instead:

1. Put the project on **GitHub** (one-time).
2. Connect it to **Vercel** — you get a live URL that auto-updates on every change.
3. Use **Claude Code** for edits — it changes files directly with small diffs instead of
   regenerating whole files.

This is how the project will be maintained from here on.

## Code conventions

- **Server components** (in `app/`) fetch data; **client components** (marked `"use client"`)
  handle interactivity. Don't call `localStorage` or browser APIs in server components.
- Keep product data **data-driven** — read from `data/products.json` via `lib/catalog.js`,
  never hard-code product lists.
- Reuse the **design tokens** (Tailwind theme colors, the `.btn-gold`/`.btn-rose` classes,
  the `MotifDivider` ornament) rather than inventing new styles — see [Brand Guide](./BRAND-GUIDE.md).
- Run `npm run build` before every deploy; a clean build = no broken pages.
