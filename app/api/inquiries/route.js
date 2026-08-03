import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";
import { sendEmail } from "@/lib/email";
import { adminEmails } from "@/lib/adminEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const INQUIRY_STATUSES = ["new", "answered", "closed"];
export const INQUIRY_TOPICS = ["An order", "Sizing & fit", "A product", "Shipping & returns", "Something else"];

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Anyone can send an inquiry — it's saved on the dashboard and emailed to the
// owner, so nothing depends on the visitor's own mail app.
export async function POST(req) {
  try {
    const body = await req.json();
    const inquiry = {
      ref: "INQ-" + Math.floor(100000 + Math.random() * 900000),
      at: new Date().toISOString(),
      status: "new",
      name: String(body?.name || "").trim().slice(0, 120),
      email: String(body?.email || "").trim().toLowerCase().slice(0, 200),
      phone: String(body?.phone || "").trim().slice(0, 40),
      topic: INQUIRY_TOPICS.includes(body?.topic) ? body.topic : INQUIRY_TOPICS[INQUIRY_TOPICS.length - 1],
      orderNo: String(body?.orderNo || "").trim().slice(0, 40),
      message: String(body?.message || "").trim().slice(0, 2000),
    };
    if (!inquiry.name || !EMAIL.test(inquiry.email) || !inquiry.message) {
      return NextResponse.json({ error: "Please add your name, a valid email, and your question." }, { status: 400 });
    }

    const list = await readJson("inquiries.json", []);
    list.unshift(inquiry);
    await writeJson("inquiries.json", list.slice(0, 500));

    // best-effort emails — the inquiry is saved either way
    const details = `<p><strong>${escapeHtml(inquiry.name)}</strong> (${escapeHtml(inquiry.email)}${inquiry.phone ? `, ${escapeHtml(inquiry.phone)}` : ""})
      sent an inquiry about <strong>${escapeHtml(inquiry.topic)}</strong>${inquiry.orderNo ? ` — order ${escapeHtml(inquiry.orderNo)}` : ""}.</p>
      <blockquote style="margin:12px 0;padding-left:12px;border-left:2px solid #E6C66E;">${escapeHtml(inquiry.message).replace(/\n/g, "<br/>")}</blockquote>
      <p>Reference <strong>${inquiry.ref}</strong> · open the Inquiries tab on your dashboard to reply.</p>`;
    for (const ownerEmail of adminEmails()) {
      sendEmail({ to: ownerEmail, subject: `New inquiry ${inquiry.ref} from ${inquiry.name}`, html: details });
    }
    sendEmail({
      to: inquiry.email,
      subject: `We received your inquiry ${inquiry.ref} — Reet Collections`,
      html: `<p>Thank you, ${escapeHtml(inquiry.name.split(" ")[0])}!</p>
        <p>Your inquiry has reached us and a real person will reply — usually within a day.</p>
        <p>Reference <strong>${inquiry.ref}</strong> · Topic: ${escapeHtml(inquiry.topic)}</p>
        <blockquote style="margin:12px 0;padding-left:12px;border-left:2px solid #E6C66E;">${escapeHtml(inquiry.message).replace(/\n/g, "<br/>")}</blockquote>
        <p>With love,<br/>Reet Collections</p>`,
    });

    return NextResponse.json({ ok: true, ref: inquiry.ref });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Couldn't send your inquiry — please try again." }, { status: 500 });
  }
}

// Owner only — the inbox behind the Inquiries tab.
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readJson("inquiries.json", []));
}

// Owner marks an inquiry answered or closed.
export async function PATCH(req) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { ref, status } = await req.json();
    if (!INQUIRY_STATUSES.includes(status)) return NextResponse.json({ error: "Unknown status." }, { status: 400 });
    const list = await readJson("inquiries.json", []);
    const found = list.find((i) => i.ref === ref);
    if (!found) return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    found.status = status;
    await writeJson("inquiries.json", list);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
