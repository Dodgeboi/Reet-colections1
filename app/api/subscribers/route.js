import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import { readJson, writeJson } from "@/lib/store";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await readJson("subscribers.json", []));
}

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    }
    const list = await readJson("subscribers.json", []);
    if (!list.find((s) => s.email.toLowerCase() === email.toLowerCase())) {
      list.unshift({ email, at: new Date().toISOString() });
      await writeJson("subscribers.json", list);
      // best-effort welcome note — the signup succeeds either way
      sendEmail({
        to: email,
        subject: "You're on the list — Reet Collections",
        html: `<p>You're subscribed!</p>
          <p>From now on we'll email you the moment we go live on Facebook —
          new pieces are revealed one by one every evening at 8 PM, and the
          best ones go fast.</p>
          <p><a href="https://www.facebook.com/Reetcollections068/" style="color:#A85563;">Follow us on Facebook</a>
          so you never miss a drop.</p>
          <p>With love,<br/>Reet Collections</p>`,
      });
    }
    return NextResponse.json({ ok: true, count: list.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
