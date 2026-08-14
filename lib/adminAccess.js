// Optional, opt-in defense-in-depth layer: if ADMIN_IP_ALLOWLIST is set
// (comma-separated IPs), only those IPs may even reach the /admin pages —
// on top of the password/Google + 2FA login, not instead of it. Unset by
// default so remote/phone access keeps working out of the box.
export function ipAllowlist() {
  return (process.env.ADMIN_IP_ALLOWLIST || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
}

export function ipAllowed(ip) {
  const list = ipAllowlist();
  if (!list.length) return true; // not configured — no extra restriction
  return list.includes(ip);
}
