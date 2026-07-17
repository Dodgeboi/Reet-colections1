# Deployment guide — put the site on the internet

Follow this once and the site gets a real `https://` address that works on
**any phone, anywhere** — no laptop, no localhost. About 20 minutes total.

The site is built for **Vercel** (the platform made by the creators of
Next.js). The free tier is plenty: automatic HTTPS, auto-deploy on every
GitHub push.

---

## Step 1 — Deploy from GitHub (5 min)

1. Go to <https://vercel.com> → **Sign up** → choose **Continue with GitHub**.
2. Click **Add New… → Project** → import the `Reet-colections1` repository.
3. Leave every setting as-is and press **Deploy**.
4. When it finishes you'll get an address like `reet-colections1.vercel.app`.
   **This URL already works on your phone.**

The storefront is now live. The next two steps switch on the owner login and
saving.

## Step 2 — Environment variables (5 min)

In **Vercel → your project → Settings → Environment Variables**, add these
(Name / Value), then **Redeploy** (Deployments → ⋯ → Redeploy):

| Name | Value |
|---|---|
| `ADMIN_EMAILS` | `reetunaren@gmail.com,namanupadhyay27@gmail.com` |
| `ADMIN_PASSWORD_HASH` | `17c031e15b647c4534e0f0bebf2ff793fc035cf88af47d737b9635c714fe2da5` |
| `ADMIN_SESSION_SECRET` | any long random string — see below |
| `NEXTAUTH_SECRET` | another long random string — see below |
| `NEXTAUTH_URL` | your site address, e.g. `https://reet-colections1.vercel.app` |

- The password hash above is the SHA-256 of the owner password you chose.
  To use a **different** password later, make a new hash with:
  `node -e "console.log(require('crypto').createHash('sha256').update('NEW-PASSWORD').digest('hex'))"`
- For the two random secrets, generate each with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  (or just type 40+ random characters). Use **different** values for each,
  and don't reuse the ones from your local `.env.local`.

> ⚠️ Keep this repository **private**. If it ever becomes public, change the
> admin password and both secrets.

## Step 3 — Connect storage so saving works (2 min)

Vercel's servers can't write files, so the shop's data (products, orders,
subscribers) lives in **Vercel Blob** storage in production:

1. In your Vercel project open the **Storage** tab.
2. **Create Database → Blob** → accept the defaults → **Connect**.
3. Redeploy once more.

That's it — the dashboard will stop showing the "storage isn't connected"
notice, and everything the admin saves persists. (Until you do this, the
site works read-only from the built-in catalog.)

## Step 4 — Connect Google sign-in (8 min)

This powers **Sign in with Google** for customers — and for the owners:
signing in with any Google account listed in `ADMIN_EMAILS` opens the owner
dashboard directly, no password needed.

1. Go to <https://console.cloud.google.com> and sign in with the shop's
   Google account.
2. Top bar → project picker → **New Project** → name it `Reet Collections`.
3. **APIs & Services → OAuth consent screen**:
   - User type **External** → Create.
   - App name `Reet Collections`, support email = your email → Save through
     the remaining screens (no scopes needed).
   - Under **Audience / Publishing status** press **Publish app** so anyone
     can sign in (not just test users).
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**, name `Reet Collections Web`.
   - **Authorized JavaScript origins** — add both:
     - `https://YOUR-SITE.vercel.app` (your real Vercel address)
     - `http://localhost:3000` (for testing on your computer)
   - **Authorized redirect URIs** — add both:
     - `https://YOUR-SITE.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
   - Create → copy the **Client ID** and **Client secret**.
5. Back in **Vercel → Settings → Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `GOOGLE_CLIENT_ID` | the Client ID (ends in `.apps.googleusercontent.com`) |
   | `GOOGLE_CLIENT_SECRET` | the Client secret |

6. Redeploy. "Continue with Google" now appears on the Account and Owner
   Login pages.

To test locally too, put the same two values into `.env.local`.

## Step 5 — Emails & the "Reet sign-in" (5 min, optional but recommended)

One free key powers three things: the **email-code sign-in** (customers get a
6-digit code by email — no Google needed), the **"you're subscribed"**
welcome email, and **order confirmation emails** (customer gets a receipt,
you get a heads-up for every order).

1. Create a free account at <https://resend.com> → **API Keys** → create one.
2. In Vercel → Environment Variables add `RESEND_API_KEY` with that key → Redeploy.
3. (Later, optional) Verify your domain in Resend and set `EMAIL_FROM` to
   e.g. `Reet Collections <hello@reetcollections.com>` so emails come from
   your own address.

## Optional — Facebook sign-in

Since your customers live on Facebook: create an app at
<https://developers.facebook.com> (type **Consumer**, add **Facebook Login**),
set the OAuth redirect URI to
`https://YOUR-SITE.vercel.app/api/auth/callback/facebook`, then add
`FACEBOOK_CLIENT_ID` and `FACEBOOK_CLIENT_SECRET` in Vercel and redeploy.
"Continue with Facebook" appears automatically.

## Optional — the AI photo importer

Add `ANTHROPIC_API_KEY` (from <https://console.anthropic.com>) as an
environment variable to enable **Admin → Add from photo (AI)**. Without it,
the importer still works — you just fill in the details yourself.

---

## Using it on your phone

- Open your Vercel URL (or your domain) in the phone's browser — done.
  Nothing to install, no localhost, works on any network.
- **Make it feel like an app:** in Safari/Chrome choose **Share → Add to
  Home Screen**. The site ships a web-app manifest, so it opens full-screen
  with the Reet logo as its icon.
- The owner dashboard works great on the phone too: go to `/admin`, sign in
  once (or use Google), and the session lasts 30 days.

## Connecting the GoDaddy domain

You don't need to touch the domain until you're ready to launch.

1. In **Vercel → Project → Settings → Domains**, add your domain
   (e.g. `reetcollections.com`, or `test.reetcollections.com` for staging).
2. Vercel shows you the DNS records to add.
3. In **GoDaddy → My Products → your domain → DNS / Manage DNS**, add them:
   - **Subdomain** (e.g. `test`): a **CNAME** to `cname.vercel-dns.com`.
   - **Root domain**: an **A** record (`@`) to the IP Vercel gives, plus a
     **CNAME** for `www`.
4. Wait a few minutes for DNS; HTTPS certificates are issued automatically.
5. After the domain works, update `NEXTAUTH_URL` to the new address and add
   it to the Google OAuth origins + redirect URIs (Step 4.4), then redeploy.

## Checklist

- [ ] Site deployed and opens on your phone
- [ ] Env vars set (Step 2) and `/admin` login works with your email + password
- [ ] Blob storage connected — saving products persists
- [ ] Google sign-in works for customers, and your Google account opens `/admin`
- [ ] (Later) Domain connected, `NEXTAUTH_URL` + Google URIs updated
