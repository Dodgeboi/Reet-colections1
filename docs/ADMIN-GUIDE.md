# Admin guide — running the shop

*A plain-English guide to managing Reet Collections. No coding needed.*

## Signing in

1. Go to **your-site.com/admin** (works on your phone too).
2. Enter your **email and password** and click **Sign in** — or, once Google
   sign-in is set up, just press **Sign in with Google** and pick your own
   Google account. No password needed that way.
3. You'll land on the dashboard. You stay signed in for 30 days.

To leave, click **Sign out** (top right).

## The dashboard at a glance

The dashboard has two tabs:

- **Inventory** — your products: add, edit, price, photograph, save.
- **Orders** — customer orders and the "we're live" email blast.

At the top you'll see quick numbers:
- **In stock** — items available to buy
- **Low stock** — items running low
- **Sold** — items that have sold out
- **Stock value** — the total retail value of what's in stock

## Changing any photo on the site

While you're signed in, browse the shop like a customer — an **Edit photos**
button floats at the bottom-left of every page.

1. Tap **Edit photos**. Everything you can change gets an outline — photos
   in gold, text in rose. That covers the home page hero, the heritage
   picture, your About-page portrait, every product photo, the live-replay
   thumbnails, the category tiles — and the headlines and paragraphs on the
   home, shop, live, and about pages.
2. **Photos:** tap one → pick a picture → drag and zoom to crop (or tap
   **Use full photo**) → **Save photo**.
3. **Text:** tap it → type your new wording → **Save text**.
4. Everything is live the moment you save. Tap **Done editing** when finished.

> Product names and prices are edited on the **Inventory** tab, since they're
> part of the product itself.

## Adding a new item

1. Click **+ Add product**.
2. Fill in the name, category, price, and quantity.
3. Press **Upload photo** and pick a picture from your phone or computer.
4. New items automatically get a **"New"** badge on the website.
5. Click **Save changes** at the bottom — *nothing is saved until you do this.*

> **Faster option:** **+ Add from photo (AI)** lets you upload a product photo and have the
> details filled in for you. Review them, then save.

## Editing an item

Right on the list you can change:
- **Name, category, price**
- **Sale price** — type a lower number to put an item on sale (the site shows the discount
  and a "% off" badge). Clear it to end the sale.
- **Quantity**
- **Status** — Available / Claimed / Sold
- **The photo** — click **Change photo** under any product's picture to upload a new one

Always click **Save changes** when you're done.

## Orders

When a customer checks out, their order appears at the top of the dashboard in the
**Orders** box, marked **New**. Stock goes down automatically, and an item flips to
**Sold** when it runs out.

For each order you can:
1. **Tap it** to see the customer's details, address, and the pieces they chose.
2. **Email them** (their address is a link) to confirm the total and arrange payment —
   just like on the lives.
3. Move the status along as you go: **New → Confirmed → Shipped → Delivered**
   (or **Cancelled**). The customer sees the status on their account page.

You can also mark pieces sold by hand any time (set status to **Sold**).

## Telling customers you're live (the email blast)

People can sign up on the website to be notified when you go live. On the dashboard:

1. The **Live announcements** box shows how many subscribers are waiting.
2. Click **View list** to see their emails.
3. When you start a live, click **📣 Email everyone — We're Live!**
   This opens your email app with all subscribers added and a ready-to-send "we're live"
   message. Just hit send.

## Important things to know

- **Always click "Save changes"** — inventory edits don't save on their own.
- On the live website, saving needs the **Blob storage** connected once in Vercel
  (see the [Deployment guide](./DEPLOYMENT.md), Step 3). The dashboard will remind
  you with a notice if it isn't connected yet.
- Keep the **password private**. Changing it takes one minute — see
  [Security](./SECURITY.md).
