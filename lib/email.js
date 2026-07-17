// Transactional email through Resend's REST API (free tier is plenty).
// Everything is gated on RESEND_API_KEY — without it the site simply
// doesn't send email, and the features that need it stay hidden.

export function emailEnabled() {
  return !!process.env.RESEND_API_KEY;
}

const FROM = () => process.env.EMAIL_FROM || "Reet Collections <onboarding@resend.dev>";

const shell = (body) => `
  <div style="background:#FBF6EF;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#1A130D;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid rgba(26,19,13,0.1);">
      <div style="background:#1A130D;padding:18px;text-align:center;">
        <span style="color:#E6C66E;font-size:18px;letter-spacing:0.18em;text-transform:uppercase;">Reet Collections</span>
      </div>
      <div style="padding:28px 26px;font-size:15px;line-height:1.65;">${body}</div>
      <div style="border-top:1px solid rgba(26,19,13,0.08);padding:14px;text-align:center;font-size:12px;color:rgba(26,19,13,0.5);">
        Selected with love &amp; care, just for you.
      </div>
    </div>
  </div>`;

// Best-effort: never throws — email failures must not break the shop.
export async function sendEmail({ to, subject, html }) {
  if (!emailEnabled() || !to) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM(), to: [to], subject, html: shell(html) }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
