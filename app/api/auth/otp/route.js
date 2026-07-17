import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { readJson, writeJson } from "@/lib/store";
import { sendEmail, emailEnabled } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CODE_TTL_MS = 10 * 60 * 1000;
const hash = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");

// Best-effort per-instance throttle: 3 codes per email per 10 minutes.
const recent = new Map();

// Step 1 of the Reet sign-in: email a 6-digit code.
export async function POST(req) {
  try {
    if (!emailEnabled()) {
      return NextResponse.json({ error: "Email sign-in isn't set up yet." }, { status: 503 });
    }
    const { email } = await req.json();
    const addr = String(email || "").trim().toLowerCase();
    if (!EMAIL.test(addr)) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });

    const hits = (recent.get(addr) || []).filter((t) => Date.now() - t < CODE_TTL_MS);
    if (hits.length >= 3) return NextResponse.json({ error: "Too many codes requested — please wait a few minutes." }, { status: 429 });
    recent.set(addr, [...hits, Date.now()]);

    const code = String(crypto.randomInt(100000, 1000000));
    const store = await readJson("otp.json", {});
    // prune expired entries while we're here
    for (const [k, v] of Object.entries(store)) if (!v || v.exp < Date.now()) delete store[k];
    store[addr] = { hash: hash(code), exp: Date.now() + CODE_TTL_MS, tries: 0 };
    await writeJson("otp.json", store);

    const sent = await sendEmail({
      to: addr,
      subject: `${code} is your Reet Collections sign-in code`,
      html: `<p>Here's your sign-in code:</p>
        <p style="font-size:32px;letter-spacing:0.3em;text-align:center;margin:18px 0;"><strong>${code}</strong></p>
        <p>It works for the next 10 minutes. If you didn't request it, you can ignore this email.</p>`,
    });
    if (!sent) return NextResponse.json({ error: "Couldn't send the email — please try again." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Something went wrong." }, { status: 500 });
  }
}
