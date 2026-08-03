# Testing

Before each release the site is verified end-to-end so there are no broken pages or flows.

## What gets checked

**Build**
- `npm run build` must compile with no errors. A clean build means every page and import resolves.

**Automated UI checks (headless browser)**
Key user journeys are exercised on both desktop and mobile viewports:
- Home, collections, product, about, Help (FAQ), Inquiries, account, live all return 200,
  and `/contact` redirects to `/inquiry`.
- Shop filters (category, price, color, availability), sort, and the mobile filter drawer.
- Grid stays multi-column when filtering, opening a category, and pressing back.
- Search overlay returns results.
- Wishlist: signed-out hides it and prompts sign-in; sign-in shows it; it persists on reload;
  sign-out clears it; sign back in restores it.
- Product detail: rating, size-guide modal, breadcrumbs.
- Full checkout reaches the confirmation screen.
- Console is free of errors.

**API checks**
- Subscribe adds an email.
- Sending an inquiry stores it and returns a reference; the owner can list it and
  mark it answered.
- Signing in records the account once, and `GET /api/accounts` reports the count.
- Purchase marks an item **sold** and the admin reflects it.
- Admin is gated: `/admin` redirects without a cookie; `POST /api/products` returns 401
  without auth; correct password logs in; wrong password is rejected.

## Running checks yourself

- **Build:** `npm run build`
- **Manual smoke test:** `npm run dev`, then click through the flows above.

## Before you deploy — checklist

- [ ] `npm run build` is clean
- [ ] Admin login works with your real password
- [ ] No test data left in `data/products.json` (nothing wrongly marked sold/on-sale)
- [ ] `data/subscribers.json` is empty (or contains only real subscribers)
- [ ] `data/inquiries.json` and `data/accounts.json` hold no test entries
- [ ] Environment variables set in Vercel
- [ ] Looks right on a real phone
