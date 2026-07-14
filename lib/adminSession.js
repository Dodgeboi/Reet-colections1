// Signed, expiring admin session tokens ("expiry.signature"), verified with
// Web Crypto so the same code runs in middleware (edge) and Node API routes.
const encoder = new TextEncoder();

export const ADMIN_COOKIE = "reet_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

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
