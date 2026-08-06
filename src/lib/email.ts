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

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice from ${org}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 16px;
      color: #475569;
      margin: 0 0 24px 0;
    }
    .invoice-card {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      border: 1px solid #e2e8f0;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .invoice-from {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .invoice-company {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .invoice-number {
      font-size: 28px;
      font-weight: 700;
      color: #3b82f6;
      margin: 0;
    }
    .invoice-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
      margin: 20px 0;
    }
    .invoice-amount-label {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 8px 0;
      font-weight: 500;
    }
    .invoice-amount {
      font-size: 32px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
      transition: all 0.2s;
    }
    .cta-button:hover {
      box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
      transform: translateY(-2px);
    }
    .info-box {
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-text {
      font-size: 14px;
      color: #0c4a6e;
      margin: 0;
      line-height: 1.6;
    }
    .footer {
      padding: 32px;
      text-align: center;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 13px;
      color: #64748b;
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer-brand {
      font-weight: 600;
      color: #3b82f6;
    }
    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #059669;
      background-color: #d1fae5;
      padding: 6px 12px;
      border-radius: 12px;
      margin-top: 16px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 32px 20px;
      }
      .invoice-card {
        padding: 20px;
      }
      .invoice-number {
        font-size: 24px;
      }
      .invoice-amount {
        font-size: 28px;
      }
      .cta-button {
        display: block;
        padding: 14px 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo">CloudInvoice</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <p class="greeting">Hello,</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        You have received a new invoice. Please review the details below:
      </p>

      <!-- Invoice Card -->
      <div class="invoice-card">
        <div class="invoice-header">
          <div>
            <p class="invoice-from">Invoice From</p>
            <h2 class="invoice-company">${org}</h2>
          </div>
          <div style="text-align: right;">
            <h3 class="invoice-number">${number}</h3>
          </div>
        </div>

        <div class="invoice-divider"></div>

        <div>
          <p class="invoice-amount-label">Amount Due</p>
          <p class="invoice-amount">${total}</p>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="${encodeURI(input.link)}" class="cta-button">
          View & Pay Invoice
        </a>
      </div>

      <!-- Info Box -->
      <div class="info-box">
        <p class="info-text">
          <strong>💡 Tip:</strong> Click the button above to view your invoice details and make a secure payment using UPI, cards, or net banking.
        </p>
      </div>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 24px 0 0 0;">
        If you have any questions about this invoice, please contact ${org} directly.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="security-badge">
        <span>🔒</span>
        <span>Secure Payment Processing</span>
      </div>
      
      <p class="footer-text">
        This invoice was sent via <span class="footer-brand">CloudInvoice</span><br>
        Professional invoicing for modern businesses
      </p>
      
      <p class="footer-text" style="font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} CloudInvoice. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return deliver({
    to: input.to,
    subject: `${input.organizationName} sent you invoice ${input.invoiceNumber}`,
    html: html.trim()
  });
}

export async function sendPasswordResetEmail(input: { to: string; link: string; name?: string }) {
  const greeting = input.name ? `Hello ${escapeHtml(input.name)},` : "Hello,";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 32px;
    }
    .greeting {
      font-size: 16px;
      color: #475569;
      margin: 0 0 24px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    }
    .warning-box {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .footer {
      padding: 32px;
      text-align: center;
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      font-size: 13px;
      color: #64748b;
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer-brand {
      font-weight: 600;
      color: #3b82f6;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 32px 20px;
      }
      .cta-button {
        display: block;
        padding: 14px 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="logo">CloudInvoice</h1>
    </div>

    <div class="content">
      <p class="greeting">${greeting}</p>
      
      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        We received a request to reset the password for your CloudInvoice account.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
        Click the button below to choose a new password:
      </p>

      <div style="text-align: center;">
        <a href="${encodeURI(input.link)}" class="cta-button">
          Set New Password
        </a>
      </div>

      <div class="warning-box">
        <p style="font-size: 14px; color: #92400e; margin: 0; line-height: 1.6;">
          <strong>⚠️ Important:</strong> This link expires in 10 minutes and can only be used once.
        </p>
      </div>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 24px 0 0 0;">
        If you did not request a password reset, you can safely ignore this email. Your current password will remain active and nothing has changed.
      </p>

      <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 16px 0 0 0;">
        For security reasons, never share this link with anyone.
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        <span class="footer-brand">CloudInvoice</span><br>
        Professional invoicing for modern businesses
      </p>
      
      <p class="footer-text" style="font-size: 12px; margin-top: 16px;">
        © ${new Date().getFullYear()} CloudInvoice. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  return deliver({
    to: input.to,
    subject: "Reset your CloudInvoice password",
    html: html.trim()
  });
}

/** Lets callers tell "not configured" apart from "configured but failed". */
export const emailIsConfigured = Boolean(resend);
