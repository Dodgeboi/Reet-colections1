# Deployment guide

The site is built for **Vercel**, the platform made by the creators of Next.js.
Free tier, automatic HTTPS, deploys in minutes.

## Option A — GitHub + Vercel (recommended, auto-updates)

1. Create a free **GitHub** account and a new empty repository (e.g. `reet-collections`).
2. Upload the project folder to it (skip `node_modules` and `.next` — they're not needed).
3. Create a free **Vercel** account → **Add New… → Project** → pick the repo → **Deploy**.
4. You get a URL like `reet-collections.vercel.app`. Every push to GitHub re-deploys automatically.

## Option B — Vercel CLI (quick, no GitHub)

```bash
npm i -g vercel
vercel          # follow the prompts → preview URL
vercel --prod   # promote to production
```

## Environment variables in production

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `ADMIN_PASSWORD` | Your real (strong) admin password |
| `ADMIN_TOKEN` | Your long random secret |

Then redeploy. Without these, the storefront still works but `/admin` login won't.

## Connecting the GoDaddy domain

You don't need to touch the domain until you're ready to launch.

1. In **Vercel → Project → Settings → Domains**, add your domain
   (e.g. `reetcollections.com`, or a subdomain like `test.reetcollections.com` for staging).
2. Vercel shows you the DNS records to add.
3. In **GoDaddy → My Products → your domain → DNS / Manage DNS**, add those records:
   - **Subdomain** (e.g. `test`): a **CNAME** to `cname.vercel-dns.com`.
   - **Root domain**: an **A** record (`@`) to the IP Vercel gives, plus a **CNAME** for `www`.
4. Save and wait a few minutes for DNS to propagate. HTTPS is issued automatically.

> **Tip:** use a `test.` subdomain first to preview on your real domain without touching
> the main address. Switch the root domain over only when everything is perfect.

## ⚠️ Important: data persistence on Vercel

Vercel runs **serverless** (a read-only filesystem), so the JSON-file storage used today
**will not persist in production**:

- Admin **"Save changes"** won't stick.
- The **subscriber list** won't save.

These need a real database. **This is the #1 blocker for a real launch** and is the first
task in [Phase 2 (Supabase)](./ROADMAP.md). Everything else (browsing, cart, wishlist,
accounts, checkout, the admin login gate) works on Vercel as-is.
