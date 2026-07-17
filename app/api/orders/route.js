import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";
import { effectivePrice, FREE_SHIP, SHIP_FLAT } from "@/lib/products";
import { sendEmail } from "@/lib/email";
import { adminEmails } from "@/lib/adminEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"];
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Place an order. Prices and totals are computed server-side from the live
// catalog, and stock is decremented in the same pass.
export async function POST(req) {
  try {
    const body = await req.json();
    const customer = {
      name: String(body?.customer?.name || "").trim().slice(0, 120),
      email: String(body?.customer?.email || "").trim().toLowerCase().slice(0, 200),
      phone: String(body?.customer?.phone || "").trim().slice(0, 40),
      address: String(body?.customer?.address || "").trim().slice(0, 300),
      city: String(body?.customer?.city || "").trim().slice(0, 120),
      zip: String(body?.customer?.zip || "").trim().slice(0, 20),
      country: String(body?.customer?.country || "").trim().slice(0, 120),
      note: String(body?.customer?.note || "").trim().slice(0, 500),
    };
    const requested = Array.isArray(body?.items) ? body.items.slice(0, 40) : [];
    if (!customer.name || !EMAIL.test(customer.email) || !customer.address || !customer.city) {
      return NextResponse.json({ error: "Please fill in your name, email and delivery address." }, { status: 400 });
    }
    if (!requested.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

    const catalog = await readJson("products.json", []);
    const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));
    const lines = [];
    for (const item of requested) {
      const p = byId[item.id];
      const available = Number(p?.qty) || 0;
      if (!p || p.status === "sold" || available <= 0) {
        return NextResponse.json({ error: `Sorry — "${p?.name || item.id}" just sold out. Please remove it from your bag.` }, { status: 409 });
      }
      const wanted = Math.max(1, Math.min(20, Number(item.qty) || 1));
      if (wanted > available) {
        return NextResponse.json({ error: `Only ${available} of "${p.name}" ${available === 1 ? "is" : "are"} left — please adjust the quantity in your bag.` }, { status: 409 });
      }
      lines.push({ id: p.id, name: p.name, image: p.image, color: p.color || "", size: String(item.size || "").slice(0, 20), qty: wanted, price: effectivePrice(p) });
    }

    const subtotal = lines.reduce((a, l) => a + l.price * l.qty, 0);
    const shipping = subtotal >= FREE_SHIP ? 0 : SHIP_FLAT;
    const order = {
      no: "RC-" + Math.floor(100000 + Math.random() * 900000),
      at: new Date().toISOString(),
      status: "new",
      customer,
      items: lines,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };

    // decrement stock; a piece with no stock left is marked sold
    for (const l of lines) {
      const p = byId[l.id];
      p.qty = Math.max(0, (Number(p.qty) || 0) - l.qty);
      if (p.qty <= 0) { p.qty = 0; p.status = "sold"; }
    }

    const orders = await readJson("orders.json", []);
    orders.unshift(order);
    await writeJson("orders.json", orders);
    await writeJson("products.json", catalog);

    // best-effort emails — the order stands either way
    const itemsHtml = lines.map((l) => `<li>${l.qty}× ${l.name}${l.size ? ` (${l.size})` : ""} — $${l.price * l.qty}</li>`).join("");
    sendEmail({
      to: customer.email,
      subject: `Order ${order.no} received — Reet Collections`,
      html: `<p>Thank you, ${customer.name.split(" ")[0]}!</p>
        <p>We've received your order <strong>${order.no}</strong> and set your pieces aside:</p>
        <ul>${itemsHtml}</ul>
        <p>Subtotal $${subtotal} · Shipping ${shipping === 0 ? "free" : `$${shipping}`} · <strong>Total $${order.total}</strong></p>
        <p>We'll be in touch shortly to confirm everything and arrange payment — just like on our lives.</p>
        <p>With love,<br/>Reet Collections</p>`,
    });
    for (const ownerEmail of adminEmails()) {
      sendEmail({
        to: ownerEmail,
        subject: `New order ${order.no} — $${order.total} from ${customer.name}`,
        html: `<p><strong>${customer.name}</strong> (${customer.email}${customer.phone ? `, ${customer.phone}` : ""}) just placed order <strong>${order.no}</strong>.</p>
          <ul>${itemsHtml}</ul>
          <p>Total <strong>$${order.total}</strong> · ${customer.address}, ${customer.city} ${customer.zip}</p>
          <p>Confirm it from the Orders tab on your dashboard.</p>`,
      });
    }
    return NextResponse.json({ ok: true, no: order.no, total: order.total });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Couldn't place the order — please try again." }, { status: 500 });
  }
}

// Owner sees every order; a signed-in customer sees their own. ?mine=1
// forces the personal view even for owners (used by the account page).
export async function GET(req) {
  const orders = await readJson("orders.json", []);
  const mine = new URL(req.url).searchParams.get("mine") === "1";
  if (!mine && (await isAdmin())) return NextResponse.json(orders);
  try {
    const session = await getServerSession(authOptions);
    const email = (session?.user?.email || "").toLowerCase();
    if (email) return NextResponse.json(orders.filter((o) => o.customer?.email === email));
  } catch {}
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// Owner updates an order's status as it moves along.
export async function PATCH(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { no, status } = await req.json();
    if (!ORDER_STATUSES.includes(status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    const orders = await readJson("orders.json", []);
    const order = orders.find((o) => o.no === no);
    if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    order.status = status;
    await writeJson("orders.json", orders);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
