// The owner login's second factor: a 6-digit code emailed via Resend, same
// shape as the customer "Reet sign-in" code in lib/auth.js but stored
// separately (data/admin-otp.json) since it guards the owner dashboard, not
// a customer account.
import crypto from "node:crypto";
import { readJson, writeJson } from "@/lib/store";
import { sendEmail, emailEnabled } from "@/lib/email";

const FILE = "admin-otp.json";
const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_CODE_TRIES = 5;

const hash = (s) => crypto.createHash("sha256").update(String(s), "utf8").digest("hex");

export function adminTwoFactorEnabled() {
  return emailEnabled();
}

// Generates a fresh code, stores its hash, and emails it. Callers must check
// adminTwoFactorEnabled() first — this never leaks the code back to the
// caller, so it's only meaningful when email delivery actually works.
export async function issueCode(email) {
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const store = await readJson(FILE, {});
  store[email] = { hash: hash(code), exp: Date.now() + CODE_TTL_MS, tries: 0 };
  await writeJson(FILE, store);

  await sendEmail({
    to: email,
    subject: "Your Reet Collections owner sign-in code",
    html: `
      <p>Someone is signing in to the Reet Collections owner dashboard.</p>
      <p style="font-size:28px;letter-spacing:0.2em;font-weight:bold;margin:18px 0;">${code}</p>
      <p>This code expires in 10 minutes. If this wasn't you, change the admin
      password right away (see docs/SECURITY.md).</p>`,
  });
  return { sent: true };
}

// Checks a submitted code. On success the code is consumed (one-time use).
export async function checkCode(email, code) {
  if (!email || !/^\d{6}$/.test(String(code || ""))) return false;
  const store = await readJson(FILE, {});
  const entry = store[email];
  if (!entry || entry.exp < Date.now()) return false;
  if ((entry.tries || 0) >= MAX_CODE_TRIES) {
    delete store[email];
    await writeJson(FILE, store);
    return false;
  }
  if (entry.hash !== hash(code)) {
    entry.tries = (entry.tries || 0) + 1;
    await writeJson(FILE, store);
    return false;
  }
  delete store[email];
  await writeJson(FILE, store);
  return true;
}
