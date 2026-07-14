# Reet Collections

A premium storefront for **Reet Collections** — handpicked Indian ethnic & fusion wear,
revealed live on Facebook every evening.

> *"Selected with love & care, just for you."*

Built with Next.js 14, this is a real e-commerce site with a customer storefront, a
password-protected owner dashboard, a wishlist & accounts system, and a culturally rich,
hand-crafted design.

---

## 📚 Documentation index

Everything you need is in the [`docs/`](./docs) folder:

| Document | What it covers |
|---|---|
| [Architecture](./docs/ARCHITECTURE.md) | Tech stack, folder structure, how the pieces fit together |
| [Development](./docs/DEVELOPMENT.md) | Run it locally, environment variables, scripts, conventions |
| [Deployment](./docs/DEPLOYMENT.md) | Going live on Vercel, connecting the GoDaddy domain |
| [API Reference](./docs/API.md) | Every backend endpoint, what it does, and who can call it |
| [Data Model](./docs/DATA-MODEL.md) | Product, order, subscriber & account data shapes |
| [Security](./docs/SECURITY.md) | Admin login, what's protected, password handling, known gaps |
| [Testing](./docs/TESTING.md) | How the site is verified before each release |
| [**Admin Guide**](./docs/ADMIN-GUIDE.md) | **Plain-English guide for running the shop (for Mom)** |
| [Content Guide](./docs/CONTENT-GUIDE.md) | Product photography & copy standards |
| [Brand Guide](./docs/BRAND-GUIDE.md) | Colors, fonts, logo, voice, cultural elements |
| [Roadmap](./docs/ROADMAP.md) | What's done and what's next (Supabase, Stripe, launch) |
| [Changelog](./docs/CHANGELOG.md) | Version history |
| [Legal templates](./docs/legal) | Privacy Policy, Terms, Shipping & Returns (drafts) |

---

## ⚡ Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The owner dashboard is at `/admin`
(default password is in `.env.local` — **change it**).

See [Development](./docs/DEVELOPMENT.md) for the full setup and the recommended
"don't-use-localhost-every-time" workflow.

---

## 🏗️ Status

**Phase 1 — complete.** Full storefront, brand, admin tools, accounts & wishlist.
**Phase 2 — next.** Database (Supabase), real payments (Stripe), transactional email,
legal pages, and production launch. See the [Roadmap](./docs/ROADMAP.md).
