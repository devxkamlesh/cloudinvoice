# Professional Email Setup Guide

Complete guide to set up professional email addresses like `support@yourdomain.com`, `billing@yourdomain.com`, etc. using AWS SES or Resend.

---

## Email Addresses You'll Need

For a professional SaaS:
- `billing@yourdomain.com` — Invoice emails (already in `.env` as EMAIL_FROM)
- `support@yourdomain.com` — Customer support (already in `.env` as NEXT_PUBLIC_SUPPORT_EMAIL)
- `security@yourdomain.com` — Security reports (already in `.env` as NEXT_PUBLIC_SECURITY_EMAIL)
- `noreply@yourdomain.com` — Automated emails (password resets, etc.)
- `hello@yourdomain.com` — General inquiries (optional)

---

## Option 1: Resend (Recommended - Easiest)

**Why Resend:**
- ✅ Free tier: 3,000 emails/month, 100 emails/day
- ✅ No credit card needed for free tier
- ✅ Simple API, built for developers
- ✅ Excellent deliverability
- ✅ Custom domain support
- ✅ Already integrated in CloudInvoice

**Cost:**
- Free: 3,000 emails/month
- Pro ($20/month): 50,000 emails/month
- Scale ($85/month): 100,000 emails/month

### Step 1: Sign Up for Resend

1. Go to https://resend.com/
2. Click **Sign Up**
3. Use your GitHub account or email
4. Verify your email

### Step 2: Get Your API Key

1. Go to https://resend.com/api-keys
2. Click **Create API Key**
3. Name: `CloudInvoice Production`
4. Permission: **Sending access**
5. Click **Add**
6. **Copy the API key** (starts with `re_`)

### Step 3: Add Your Domain

1. Go to https://resend.com/domains
2. Click **Add Domain**
3. Enter your domain: `yourdomain.com` (without www)
4. Click **Add**

### Step 4: Configure DNS Records

Resend will show you DNS records to add. Go to your Cloudflare dashboard:

1. **Cloudflare** → **DNS** → **Records**
2. Add these records (exact values from Resend):

**SPF Record:**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| TXT | @ | `v=spf1 include:resend.com ~all` | DNS only |

**DKIM Records (3 records):**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `resend._domainkey` | `resend._domainkey.yourdomain.com` | DNS only |
| CNAME | `resend2._domainkey` | (from Resend) | DNS only |
| CNAME | `resend3._domainkey` | (from Resend) | DNS only |

**DMARC Record:**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:security@yourdomain.com` | DNS only |

**Important:** Set all email DNS records to **DNS only** (gray cloud), not Proxied.

### Step 5: Verify Domain

1. Wait 5-10 minutes for DNS propagation
2. In Resend dashboard, click **Verify** next to your domain
3. Status should change to **Verified** ✅

### Step 6: Update CloudInvoice Environment

SSH to your AWS instance:

```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
cd /home/ubuntu/cloudinvoice
nano .env
```

Update these lines:

```bash
# From Step 2
RESEND_API_KEY="re_your_actual_api_key_here"

# Use your domain
EMAIL_FROM="CloudInvoice <billing@yourdomain.com>"
NEXT_PUBLIC_SUPPORT_EMAIL="support@yourdomain.com"
NEXT_PUBLIC_SECURITY_EMAIL="security@yourdomain.com"
```

Save: `Ctrl+X`, `Y`, `Enter`

**Rebuild app:**

```bash
docker compose build app
docker compose up -d
```

### Step 7: Test Sending

Create a test file:

```bash
nano test-email.js
```

Paste this:

```javascript
const fetch = require('node-fetch');

fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer re_your_api_key_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    from: 'CloudInvoice <billing@yourdomain.com>',
    to: 'your@personal-email.com',
    subject: 'Test Email from CloudInvoice',
    html: '<h1>Success!</h1><p>Your email setup is working perfectly.</p>'
  })
})
.then(res => res.json())
.then(data => console.log('Email sent:', data))
.catch(err => console.error('Error:', err));
```

Run:

```bash
node test-email.js
```

Check your personal email — you should receive the test email!

---

## Option 2: AWS SES (Simple Email Service)

**Why AWS SES:**
- ✅ Extremely cheap: $0.10 per 1,000 emails
- ✅ High sending limits
- ✅ Already on AWS infrastructure
- ✅ Tight AWS integration

**Cons:**
- Starts in sandbox mode (must request production access)
- More complex setup than Resend
- Takes 24-48 hours to get approved for production

**Cost:**
- $0.10 per 1,000 emails sent
- $0 per 1,000 emails received (first 1,000/month)
- Example: 10,000 emails/month = $1.00

### Step 1: Verify Your Domain in SES

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. **Important:** Make sure you're in a region that supports SES (us-east-1, us-west-2, eu-west-1)
3. Click **Verified identities** → **Create identity**
4. Choose **Domain**
5. Enter: `yourdomain.com`
6. Enable DKIM signing: ✅ Checked
7. Click **Create identity**

### Step 2: Add DNS Records

AWS will show you DNS records. Go to Cloudflare:

Add these records (exact values from AWS):

**DKIM Records (3 CNAME records):**
| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `abc123._domainkey` | (from AWS) | DNS only |
| CNAME | `def456._domainkey` | (from AWS) | DNS only |
| CNAME | `ghi789._domainkey` | (from AWS) | DNS only |

**MX Record (for receiving emails, optional):**
| Type | Name | Content | Priority | Proxy |
|------|------|---------|----------|-------|
| MX | @ | `inbound-smtp.us-east-1.amazonaws.com` | 10 | DNS only |

Wait 10-15 minutes, then check status in AWS SES — should show **Verified**.

### Step 3: Request Production Access

By default, SES is in **Sandbox mode** (can only send to verified emails).

1. In SES console, click **Account dashboard**
2. Click **Request production access**
3. Fill out form:
   - **Mail type:** Transactional
   - **Website URL:** https://yourdomain.com
   - **Use case description:**
     ```
     CloudInvoice is an invoicing SaaS application. We send transactional emails:
     - Invoice delivery to clients
     - Payment confirmations
     - Password reset links
     - Account notifications
     
     We do NOT send marketing emails or newsletters.
     Expected volume: 1,000-5,000 emails/month.
     ```
   - **Bounce/complaint handling:** We monitor bounce rates and remove invalid emails
4. Click **Submit request**

**Wait 24-48 hours** for approval. AWS will email you.

### Step 4: Create SMTP Credentials

1. **SES Console** → **SMTP settings**
2. Click **Create SMTP credentials**
3. Username: `cloudinvoice-smtp`
4. Click **Create**
5. **Download credentials** — save the CSV file

You'll get:
- SMTP username: `AKIAXXXXXXXXXXXX`
- SMTP password: `BPxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 5: Install Nodemailer

SSH to AWS instance:

```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
cd /home/ubuntu/cloudinvoice
```

Update `package.json` (if not already installed):

```bash
npm install nodemailer
```

### Step 6: Update CloudInvoice for SES

Create a new email utility file:

```bash
nano src/lib/email-ses.ts
```

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com', // Change region if needed
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.AWS_SES_SMTP_USERNAME!,
    pass: process.env.AWS_SES_SMTP_PASSWORD!,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}
```

**Update `.env`:**

```bash
nano .env
```

Add:

```bash
AWS_SES_SMTP_USERNAME="AKIAXXXXXXXXXXXX"
AWS_SES_SMTP_PASSWORD="BPxxxxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="CloudInvoice <billing@yourdomain.com>"
```

**Rebuild:**

```bash
docker compose build app
docker compose up -d
```

### Step 7: Test SES

```bash
node
```

In Node REPL:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: 'YOUR_SMTP_USERNAME',
    pass: 'YOUR_SMTP_PASSWORD',
  },
});

transporter.sendMail({
  from: 'billing@yourdomain.com',
  to: 'your@personal-email.com',
  subject: 'Test from AWS SES',
  html: '<h1>It works!</h1>',
}, (err, info) => {
  if (err) console.error(err);
  else console.log('Email sent:', info);
});
```

---

## Option 3: Google Workspace (Professional Inbox)

If you want actual inboxes (to receive and reply to emails, not just send):

**Cost:** $6/user/month

**What you get:**
- Real email inbox (like Gmail)
- Can receive emails at support@, billing@, etc.
- 30 GB storage per user
- Google Calendar, Drive, Meet included

### Setup

1. Go to https://workspace.google.com/
2. Sign up with your domain
3. Follow Google's DNS setup (add MX records to Cloudflare)
4. Create mailboxes: `support@`, `billing@`, `security@`
5. Still use Resend/SES for *sending* transactional emails
6. Use Google Workspace for *receiving* and manual replies

---

## Email Aliases and Forwarding (Free with Cloudflare)

If you just want emails to forward to your personal inbox:

1. **Cloudflare** → **Email** → **Email Routing**
2. Click **Get started**
3. Add destination: Your personal email
4. Add aliases:
   - `support@yourdomain.com` → your@gmail.com
   - `billing@yourdomain.com` → your@gmail.com
   - `security@yourdomain.com` → your@gmail.com

**Limitations:**
- Can only receive (not send from these addresses)
- No dedicated inbox
- Good for low-volume support

---

## Recommended Setup for CloudInvoice

**For Startups (Best Value):**
- **Sending transactional emails:** Resend (free 3,000/month)
- **Receiving support emails:** Cloudflare Email Routing (free) → forwards to your Gmail
- **Reply to support:** Use Gmail with "Send as" feature (free)

**For Scaling SaaS:**
- **Sending transactional emails:** AWS SES ($0.10 per 1,000)
- **Receiving emails:** Google Workspace ($6/user/month)
- **Team inbox:** Shared support@ inbox in Google Workspace

**My Recommendation for You:**
Start with **Resend + Cloudflare Email Routing** (100% free). Upgrade to Google Workspace only when you have a support team.

---

## Configure Gmail "Send As" (Free)

To reply to support emails from `support@yourdomain.com` using your Gmail:

1. Open Gmail
2. **Settings** → **Accounts and Import**
3. **Send mail as:** → **Add another email address**
4. Name: `CloudInvoice Support`
5. Email: `support@yourdomain.com`
6. SMTP Server: `smtp.resend.com` (or `email-smtp.us-east-1.amazonaws.com` for SES)
7. Port: 587
8. Username: Your Resend API key (or SES SMTP username)
9. Password: Your Resend API key (or SES SMTP password)
10. Click **Add Account**
11. Verify via email

Now when you reply in Gmail, you can choose to send from `support@yourdomain.com`!

---

## Email Templates in CloudInvoice

CloudInvoice already has email templates in `src/lib/email.ts`. Current emails:

1. **Invoice sent to client** (`sendInvoiceEmail`)
2. **Payment confirmation** (`sendPaymentConfirmation`)
3. **Password reset** (Better Auth handles this)

### Customize Email Templates

Edit the templates:

```bash
nano src/lib/email.ts
```

Add your branding, footer, social links, etc.

---

## Monitoring Email Deliverability

### In Resend Dashboard

- **Emails** → View all sent emails
- **Logs** → See delivery status, bounces, opens
- **Analytics** → Delivery rate, open rate, click rate

### In AWS SES

- **Reputation dashboard** → Bounce rate, complaint rate
- **Sending statistics** → Sends, deliveries, bounces
- **Suppression list** → Emails that bounced

### Best Practices

✅ **Do:**
- Keep bounce rate < 5%
- Keep complaint rate < 0.1%
- Remove invalid emails immediately
- Use double opt-in for newsletters (if you add them)
- Include unsubscribe link in all marketing emails

❌ **Don't:**
- Buy email lists
- Send unsolicited emails
- Send from `noreply@` (use `support@` instead)
- Send without proper SPF/DKIM/DMARC

---

## Testing Checklist

- [ ] Can send invoice email from app
- [ ] Invoice arrives in client's inbox (not spam)
- [ ] Password reset email works
- [ ] Can receive emails at support@
- [ ] Can reply from support@ address
- [ ] SPF, DKIM, DMARC records verified
- [ ] Test email deliverability: https://www.mail-tester.com/
- [ ] All `.env` email variables updated
- [ ] App rebuilt and restarted after `.env` changes

---

## Troubleshooting

### Emails going to spam

**Fix:**
1. Verify SPF, DKIM, DMARC are set up correctly
2. Use https://www.mail-tester.com/ — aim for 10/10 score
3. Warm up your domain (start with 50 emails/day, increase gradually)
4. Don't use spam trigger words: "free", "click here", "limited time"
5. Include physical address in email footer
6. Add unsubscribe link (even for transactional emails)

### SES emails not sending

**Check:**
1. Are you still in Sandbox mode? (Can only send to verified emails)
2. Is your sending quota exceeded?
3. Are there any suppressed emails in the suppression list?
4. Check CloudWatch logs for errors

### Resend API key not working

**Check:**
1. API key has "Sending access" permission
2. Domain is verified in Resend
3. API key is in `.env` and app was rebuilt
4. `EMAIL_FROM` matches verified domain

---

## Next Steps

Once email is working:

1. Set up email templates with your branding
2. Add email signature to all transactional emails
3. Configure email notifications for users (invoice paid, payment failed, etc.)
4. Add support ticket system (optional: Zendesk, Intercom, or custom)
5. Set up email sequences for onboarding (optional: Loops, Resend Broadcasts)

---

**Last updated:** August 2026  
**Recommended:** Resend + Cloudflare Email Routing (100% free)
