// Signed, expiring admin session tokens ("expiry.signature"), verified with
// Web Crypto so the same code runs in middleware (edge) and Node API routes.
const encoder = new TextEncoder();

export const ADMIN_COOKIE = "reet_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days — shortened as part of 2FA hardening

// A short-lived, httpOnly cookie that records "this browser passed the first
// factor (password or Google) for this email" while it waits on the emailed
// code. It never grants /admin access by itself — only checkCode() + this
// token together let /api/admin/login/verify issue the real ADMIN_COOKIE.
export const PENDING_COOKIE = "reet_admin_pending";
export const PENDING_MAX_AGE = 10 * 60; // 10 minutes, matches the emailed code's TTL

async function sign(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createSessionToken(secret) {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  return `${exp}.${await sign(secret, String(exp))}`;
}

export async function verifySessionToken(secret, token) {
  if (!secret || !token) return false;
  const [exp, sig] = String(token).split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await sign(secret, exp);
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

// Pending-2FA token: "base64(email).exp.sig". Same HMAC scheme as the admin
// session token, keyed by the same ADMIN_SESSION_SECRET (no extra config).
export async function createPendingToken(secret, email) {
  const exp = Date.now() + PENDING_MAX_AGE * 1000;
  const emailB64 = Buffer.from(String(email), "utf8").toString("base64url");
  const payload = `${emailB64}.${exp}`;
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifyPendingToken(secret, token) {
  if (!secret || !token) return null;
  const [emailB64, exp, sig] = String(token).split(".");
  if (!emailB64 || !exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return null;
  const payload = `${emailB64}.${exp}`;
  const expected = await sign(secret, payload);
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;
  try {
    return Buffer.from(emailB64, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
