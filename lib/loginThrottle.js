// Best-effort per-IP throttle shared by every step of the owner login (password
// check and 2FA code check both count against the same limit, so guessing a
// password and guessing a code cost from the same budget). In-memory, so it
// resets on redeploy/cold start — documented as a known gap in docs/SECURITY.md.
const attempts = new Map();
const MAX_TRIES = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function requestIp(req) {
  return (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
}

export function tooManyTries(key) {
  const a = attempts.get(key);
  if (!a) return false;
  if (Date.now() - a.first > WINDOW_MS) { attempts.delete(key); return false; }
  return a.count >= MAX_TRIES;
}

export function recordMiss(key) {
  const a = attempts.get(key);
  if (!a || Date.now() - a.first > WINDOW_MS) attempts.set(key, { first: Date.now(), count: 1 });
  else a.count += 1;
}

export function clearTries(key) {
  attempts.delete(key);
}
