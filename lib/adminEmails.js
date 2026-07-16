// The owner list. ADMIN_EMAILS is comma-separated; ADMIN_EMAIL (single) still
// works for older deployments. Edge-safe — used by middleware too.
export function adminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email) {
  return !!email && adminEmails().includes(String(email).trim().toLowerCase());
}
