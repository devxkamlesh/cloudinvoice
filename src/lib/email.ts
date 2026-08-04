import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.EMAIL_FROM ?? "CloudInvoice <onboarding@resend.dev>";

/**
 * Resend resolves with `{ data, error }` instead of rejecting on an API failure.
 * Returning that object unchecked is how an invoice ended up marked SENT while no
 * email was ever delivered, so every send in this module goes through here and turns
 * a failure into a thrown error the caller cannot ignore by accident.
 */
async function deliver(payload: { to: string; subject: string; html: string }) {
  if (!resend) throw new Error("Email delivery is not configured. Set RESEND_API_KEY.");

  const { data, error } = await resend.emails.send({ from, ...payload });

  if (error) {
    // Log the provider detail server-side; surface something a user can act on.
    console.error("Email delivery failed:", error);
    throw new Error(error.message || "The email provider rejected this message.");
  }
  if (!data?.id) throw new Error("The email provider did not confirm delivery.");

  return data;
}

/** Escape interpolated values so a client or business name cannot inject markup. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendInvoiceEmail(input: { to: string; invoiceNumber: string; link: string; organizationName: string; total: string }) {
  const org = escapeHtml(input.organizationName);
  const number = escapeHtml(input.invoiceNumber);
  const total = escapeHtml(input.total);

  return deliver({
    to: input.to,
    subject: `${input.organizationName} sent invoice ${input.invoiceNumber}`,
    html: `<p>Hello,</p><p>${org} sent you invoice <strong>${number}</strong> for <strong>${total}</strong>.</p><p><a href="${encodeURI(input.link)}">Review and pay invoice</a></p>`
  });
}

export async function sendPasswordResetEmail(input: { to: string; link: string; name?: string }) {
  const greeting = input.name ? `Hello ${escapeHtml(input.name)},` : "Hello,";

  return deliver({
    to: input.to,
    subject: "Reset your CloudInvoice password",
    html: [
      `<p>${greeting}</p>`,
      `<p>Use the link below to choose a new password for your CloudInvoice account. It expires in one hour and can only be used once.</p>`,
      `<p><a href="${encodeURI(input.link)}">Set a new password</a></p>`,
      `<p>If you did not ask to reset your password, you can ignore this email. Your current password stays active and nothing has changed.</p>`
    ].join("")
  });
}

/** Lets callers tell "not configured" apart from "configured but failed". */
export const emailIsConfigured = Boolean(resend);
