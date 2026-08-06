# Send Invoice to Client Feature

## Overview
The "Send Invoice via Email" feature is **already fully implemented** in CloudInvoice. This document explains how it works and how to use it.

## How It Works

### User Interface
- **Location**: Invoice detail page (`/invoices/[id]`)
- **Button**: "Send invoice" button with Mail icon in the InvoiceActions component
- **States**: 
  - Default: "Send invoice"
  - Loading: "Sending…"
  - Success: "Invoice emailed"
  - Error: Shows specific error message

### Backend Flow

1. **User clicks "Send invoice" button**
2. **Validation checks**:
   - Client must have an email address
   - Invoice cannot be VOID status
   - NEXT_PUBLIC_APP_URL must be configured

3. **Email is sent** using Resend API:
   - To: Client's email address
   - Subject: `{OrganizationName} sent invoice {InvoiceNumber}`
   - Body: Invoice details with payment link
   - Link: `{APP_URL}/pay/{publicToken}`

4. **Status update** (only after successful delivery):
   - Invoice status → SENT
   - sentAt → current timestamp
   - Page revalidated to show updated status

### Key Files

1. **`src/components/invoices/invoice-actions.tsx`**
   - UI component with "Send invoice" button
   - Handles loading states and error messages

2. **`src/app/(dashboard)/invoices/actions.ts`**
   - `sendInvoice(id)` server action
   - Validates invoice and client
   - Calls email service
   - Updates invoice status

3. **`src/lib/email.ts`**
   - `sendInvoiceEmail()` function
   - Sends email via Resend API
   - Handles HTML escaping for security
   - Error handling with proper exceptions

## Configuration

### Required Environment Variables

```env
# Resend API Key (required)
RESEND_API_KEY="re_..."

# Email sender (must be verified domain with Resend)
EMAIL_FROM="CloudInvoice <billing@cloudinvoice.co.in>"

# App URL for payment links (required for production)
NEXT_PUBLIC_APP_URL="https://cloudinvoice.co.in"
```

### Production Setup

On your production server (`ubuntu@54.151.245.180`), ensure `.env` has:

```env
NEXT_PUBLIC_APP_URL="https://cloudinvoice.co.in"
RESEND_API_KEY="re_your_api_key_here"
EMAIL_FROM="CloudInvoice <billing@cloudinvoice.co.in>"
```

**Important**: The domain `cloudinvoice.co.in` must be verified with Resend, otherwise emails will be rejected.

## Email Template

The email sent to clients includes:

- **Greeting**: "Hello,"
- **Message**: "{OrganizationName} sent you invoice {InvoiceNumber} for {Total}"
- **Call-to-action**: "Review and pay invoice" link
- **Link destination**: Payment portal at `/pay/{publicToken}`

### Security Features

1. **HTML Escaping**: All user-provided values (organization name, invoice number, total) are HTML-escaped to prevent XSS
2. **URL Encoding**: Payment link is properly encoded
3. **Error Handling**: Failed sends throw exceptions and don't mark invoice as SENT

## Testing

### Manual Testing Steps

1. **Create a test invoice**:
   - Go to `/invoices/new`
   - Select a client with a valid email address
   - Add line items and save

2. **Send the invoice**:
   - Click "Send invoice" button
   - Wait for "Invoice emailed" confirmation
   - Check invoice status changes to "SENT"

3. **Verify email delivery**:
   - Check client's inbox
   - Verify email contains correct invoice details
   - Test payment link opens payment portal

### Error Cases

The system handles these errors gracefully:

1. **No client email**: "This client has no email address."
2. **Void invoice**: "This invoice is void and cannot be sent."
3. **No APP_URL**: "Set NEXT_PUBLIC_APP_URL before sending invoices."
4. **Email service error**: Shows Resend's error message
5. **Not configured**: "Email delivery is not configured. Set RESEND_API_KEY."

## Features

### What Works

✅ Send invoice to client email
✅ Generate payment link automatically
✅ Update invoice status to SENT
✅ HTML escaping for security
✅ Error handling with user-friendly messages
✅ Loading states during send
✅ Prevents sending VOID invoices
✅ Validates client has email before sending
✅ Only marks as SENT after confirmed delivery

### Limitations

- Cannot send if client has no email (must add email first)
- Cannot resend same invoice (status stays SENT, but can click button again)
- No email tracking (open rates, click tracking)
- No CC/BCC options
- Fixed email template (no customization in UI)

## Deployment

The feature is already deployed in the codebase. To ensure it works in production:

1. **Update environment variable on server**:
```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
cd /home/ubuntu/cloudinvoice
nano .env
```

2. **Add/update this line**:
```env
NEXT_PUBLIC_APP_URL="https://cloudinvoice.co.in"
```

3. **Restart the application**:
```bash
bash deploy.sh
```

## Support

If emails are not sending:

1. **Check Resend dashboard**: Verify domain is verified
2. **Check environment variables**: Ensure RESEND_API_KEY and EMAIL_FROM are set
3. **Check logs**: Look for email delivery errors in application logs
4. **Test Resend API**: Use Resend dashboard to send test email

## Summary

✅ **Feature Status**: Fully implemented and ready to use
✅ **Configuration**: Email credentials already in .env
⚠️ **Action Required**: Update NEXT_PUBLIC_APP_URL in production .env
✅ **Testing**: Can be tested immediately after environment update
