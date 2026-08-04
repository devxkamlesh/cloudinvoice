import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendInvoiceEmail(input: { to: string; invoiceNumber: string; link: string; organizationName: string; total: string }) {
  if (!resend) throw new Error("Email delivery is not configured.");
  return resend.emails.send({
    from: process.env.EMAIL_FROM ?? "CloudInvoice <onboarding@resend.dev>", to: input.to,
    subject: `${input.organizationName} sent invoice ${input.invoiceNumber}`,
    html: `<p>Hello,</p><p>${input.organizationName} sent you invoice <strong>${input.invoiceNumber}</strong> for <strong>${input.total}</strong>.</p><p><a href="${input.link}">Review and pay invoice</a></p>`
  });
}
