# Razorpay Integration Guide

Complete guide to integrate Razorpay payment gateway into CloudInvoice for Indian customers.

---

## Why Razorpay?

**Perfect for Indian SaaS:**
- ✅ UPI, Credit/Debit Cards, NetBanking, Wallets
- ✅ Automatic INR conversion
- ✅ Lower fees than Stripe for Indian cards (2% vs 2.9%)
- ✅ Instant settlements
- ✅ Built-in payment links
- ✅ No setup fees

**Pricing:**
- Cards/NetBanking: 2% per transaction
- UPI/RuPay: 0% for up to ₹2,000, then 2%
- International cards: 3% + ₹3

---

## Part 1: Create Razorpay Account

### Step 1: Sign Up

1. Go to https://dashboard.razorpay.com/signup
2. Enter business details:
   - Business Name: CloudInvoice
   - Your Name: Your name
   - Email: your@email.com
   - Mobile: Your Indian mobile number
3. Click **Get Started**
4. Verify your email and mobile

### Step 2: Complete KYC

To receive live payments, you must complete KYC:

1. **Dashboard** → **Settings** → **Configuration**
2. Click **Activate Account**
3. Submit documents:
   - **Business Type:** Partnership/Private Limited/Proprietorship
   - **PAN Card**
   - **GST Certificate** (if registered)
   - **Bank Account Details**
   - **Business Proof:** Certificate of Incorporation or Partnership Deed
4. Click **Submit for Review**

**Approval time:** 24-48 hours

---

## Part 2: Get API Keys

### Test Mode Keys (Immediate)

1. Go to **Settings** → **API Keys**
2. Click **Generate Test Key**
3. Copy both:
   - **Key ID:** `rzp_test_xxxxxxxxxxxx`
   - **Key Secret:** `xxxxxxxxxxxxxxxxxxxx` (click to reveal)

### Live Mode Keys (After KYC)

Once KYC is approved:

1. **Settings** → **API Keys**
2. Click **Generate Live Key**
3. Copy both:
   - **Key ID:** `rzp_live_xxxxxxxxxxxx`
   - **Key Secret:** `xxxxxxxxxxxxxxxxxxxx`

**Important:** Keep the secret safe! Never commit to GitHub.

---

## Part 3: Install Razorpay SDK

SSH to your AWS instance:

```bash
ssh -i "C:\Users\kamle\Downloads\cloudinvoice-prod.pem" ubuntu@54.151.245.180
cd /home/ubuntu/cloudinvoice
```

Install Razorpay Node.js SDK:

```bash
npm install razorpay
```

---

## Part 4: Create Razorpay Utilities

Create a new file for Razorpay helper functions:

```bash
nano src/lib/razorpay.ts
```

Paste this:

```typescript
import Razorpay from 'razorpay';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Create a Razorpay order
export async function createRazorpayOrder({
  amount, // Amount in INR (not paise)
  currency = 'INR',
  receipt,
  notes = {},
}: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  // Razorpay expects amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt,
    notes,
  });

  return order;
}

// Verify Razorpay signature (to prevent tampering)
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const crypto = require('crypto');
  const secret = process.env.RAZORPAY_KEY_SECRET!;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}

// Get payment details
export async function getRazorpayPayment(paymentId: string) {
  return razorpay.payments.fetch(paymentId);
}

// Create payment link (alternative to checkout)
export async function createRazorpayPaymentLink({
  amount,
  description,
  customer,
  callback_url,
  reference_id,
}: {
  amount: number; // in INR
  description: string;
  customer: {
    name: string;
    email: string;
    contact?: string;
  };
  callback_url: string;
  reference_id: string;
}) {
  const amountInPaise = Math.round(amount * 100);

  const paymentLink = await razorpay.paymentLink.create({
    amount: amountInPaise,
    currency: 'INR',
    description,
    customer,
    callback_url,
    callback_method: 'get',
    reference_id,
    notify: {
      sms: true,
      email: true,
    },
  });

  return paymentLink;
}
```

Save: `Ctrl+X`, `Y`, `Enter`

---

## Part 5: Update Environment Variables

```bash
nano .env
```

Add these lines:

```bash
# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_secret_key_here"

# For frontend
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
```

**Important:**
- Use `rzp_test_` keys for testing
- Switch to `rzp_live_` keys when going live
- Only the Key ID goes in `NEXT_PUBLIC_*` (secret stays server-side only)

Save: `Ctrl+X`, `Y`, `Enter`

---

## Part 6: Create Payment API Routes

### Create Razorpay Order Endpoint

```bash
nano src/app/api/payments/razorpay/create-order/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await request.json();

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount: invoice.total,
      receipt: `inv_${invoice.invoiceNumber}`,
      notes: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.client.name,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      invoice: {
        id: invoice.id,
        number: invoice.invoiceNumber,
        total: invoice.total,
      },
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
```

Save and create verification endpoint:

```bash
nano src/app/api/payments/razorpay/verify/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature, getRazorpayPayment } from '@/lib/razorpay';
import { sendPaymentConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
    } = await request.json();

    // Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get payment details from Razorpay
    const payment = await getRazorpayPayment(razorpay_payment_id);

    // Update invoice in database
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        paymentMethod: payment.method, // 'card', 'upi', 'netbanking', etc.
        paymentGateway: 'RAZORPAY',
        paymentId: razorpay_payment_id,
      },
      include: {
        client: true,
        user: true,
      },
    });

    // Send confirmation email
    await sendPaymentConfirmation({
      to: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total,
      paidAt: invoice.paidAt!,
    });

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        status: invoice.status,
        paidAt: invoice.paidAt,
      },
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
```

---

## Part 7: Create Payment Page Component

```bash
nano src/components/invoices/razorpay-checkout.tsx
```

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  invoiceId: string;
  amount: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
}

export function RazorpayCheckout({
  invoiceId,
  amount,
  invoiceNumber,
  clientName,
  clientEmail,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create Razorpay order
      const response = await fetch('/api/payments/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      });

      const { orderId, amount: orderAmount, currency } = await response.json();

      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderAmount,
          currency: currency,
          name: 'CloudInvoice',
          description: `Payment for Invoice #${invoiceNumber}`,
          order_id: orderId,
          prefill: {
            name: clientName,
            email: clientEmail,
          },
          theme: {
            color: '#3b82f6',
          },
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch(
              '/api/payments/razorpay/verify',
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  invoiceId,
                }),
              }
            );

            if (verifyResponse.ok) {
              toast({
                title: 'Payment successful!',
                description: 'Your invoice has been marked as paid.',
              });
              window.location.href = `/invoices/${invoiceId}`;
            } else {
              toast({
                title: 'Payment verification failed',
                description: 'Please contact support.',
                variant: 'destructive',
              });
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              toast({
                title: 'Payment cancelled',
                description: 'You can try again anytime.',
              });
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        setLoading(false);
      };

      script.onerror = () => {
        setLoading(false);
        toast({
          title: 'Failed to load payment gateway',
          description: 'Please try again.',
          variant: 'destructive',
        });
      };
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Payment failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      size="lg"
      className="w-full"
    >
      {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
    </Button>
  );
}
```

---

## Part 8: Update Invoice Payment Page

Edit the public payment page:

```bash
nano src/app/pay/[token]/page.tsx
```

Add this import at the top:

```typescript
import { RazorpayCheckout } from '@/components/invoices/razorpay-checkout';
```

Replace the existing Stripe checkout button with:

```typescript
{invoice.status === 'PENDING' && (
  <div className="mt-6">
    <RazorpayCheckout
      invoiceId={invoice.id}
      amount={invoice.total}
      invoiceNumber={invoice.invoiceNumber}
      clientName={invoice.client.name}
      clientEmail={invoice.client.email}
    />
  </div>
)}
```

---

## Part 9: Update Database Schema

Add Razorpay fields to Invoice model:

```bash
nano prisma/schema.prisma
```

Find the `Invoice` model and add these fields:

```prisma
model Invoice {
  // ... existing fields ...
  
  paymentMethod   String?  // 'card', 'upi', 'netbanking', 'wallet'
  paymentGateway  String?  // 'STRIPE', 'RAZORPAY'
  paymentId       String?  // Razorpay payment ID
  
  // ... rest of model ...
}
```

Create and apply migration:

```bash
docker compose exec app npx prisma migrate dev --name add_razorpay_fields
```

---

## Part 10: Build and Deploy

```bash
# Rebuild the app with Razorpay integration
docker compose build app

# Restart containers
docker compose up -d

# Check logs
docker logs -f cloudinvoice-app
```

---

## Part 11: Testing

### Test Mode Testing

1. Visit your invoice payment page: `http://54.151.245.180:3002/pay/[token]`
2. Click **Pay ₹XXX** button
3. Razorpay checkout should open
4. Use test card details:

**Test Cards:**

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | 123 | Any future date | Success |
| 4012 0010 3714 1112 | 123 | Any future date | Failed |
| 5200 0000 0000 1096 | 123 | Any future date | Success (Mastercard) |

**Test UPI:**
- UPI ID: `success@razorpay`
- Enter any 6-digit UPI PIN → Success

**Test NetBanking:**
- Select any bank
- Username: `test`
- Password: `test`

### Live Mode Testing

Once KYC is approved:

1. Update `.env` with live keys:
   ```bash
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
   RAZORPAY_KEY_SECRET="your_live_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
   ```

2. Rebuild: `docker compose build app && docker compose up -d`

3. Test with real ₹1 payment

---

## Part 12: Webhook Setup (Recommended)

Webhooks notify you when payments succeed, fail, or refunds happen.

### Create Webhook in Razorpay

1. **Dashboard** → **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Secret: Generate a strong secret (save it)
5. Select events:
   - ✅ `payment.authorized`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
   - ✅ `refund.created`
6. Click **Create Webhook**

### Create Webhook Handler

```bash
nano src/app/api/webhooks/razorpay/route.ts
```

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different events
    switch (event.event) {
      case 'payment.captured':
        const paymentId = event.payload.payment.entity.id;
        const orderId = event.payload.payment.entity.order_id;
        
        // Find invoice by order ID
        const invoice = await prisma.invoice.findFirst({
          where: {
            paymentId: orderId,
          },
        });

        if (invoice && invoice.status !== 'PAID') {
          await prisma.invoice.update({
            where: { id: invoice.id },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              paymentId: paymentId,
            },
          });
        }
        break;

      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity);
        break;

      case 'refund.created':
        console.log('Refund created:', event.payload.refund.entity);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
```

Update `.env`:

```bash
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_here"
```

---

## Part 13: Support Both Stripe and Razorpay

To offer both payment gateways:

### Update Payment Page

```typescript
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RazorpayCheckout } from '@/components/invoices/razorpay-checkout';
import { StripeCheckout } from '@/components/invoices/stripe-checkout';

export function PaymentOptions({ invoice }: { invoice: Invoice }) {
  return (
    <Tabs defaultValue="razorpay" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="razorpay">
          UPI / Cards / NetBanking
        </TabsTrigger>
        <TabsTrigger value="stripe">
          International Cards
        </TabsTrigger>
      </TabsList>

      <TabsContent value="razorpay">
        <RazorpayCheckout
          invoiceId={invoice.id}
          amount={invoice.total}
          invoiceNumber={invoice.invoiceNumber}
          clientName={invoice.client.name}
          clientEmail={invoice.client.email}
        />
      </TabsContent>

      <TabsContent value="stripe">
        <StripeCheckout invoice={invoice} />
      </TabsContent>
    </Tabs>
  );
}
```

---

## Razorpay vs Stripe Comparison

| Feature | Razorpay | Stripe |
|---------|----------|--------|
| Indian cards/UPI | ✅ Best | ⚠️ Works but higher fees |
| International cards | ⚠️ Works | ✅ Best |
| Pricing (Indian) | 2% | 2.9% + ₹3 |
| Pricing (International) | 3% + ₹3 | 2.9% + ₹3 |
| UPI | ✅ Free (up to ₹2,000) | ❌ No |
| Settlement | T+2 days | T+7 days |
| Setup | Easy | Easy |
| KYC Required | ✅ Yes | ✅ Yes |

**Recommendation:**
- Indian customers → Use Razorpay (lower fees, UPI support)
- International customers → Use Stripe (better for global cards)
- Best: Offer both and auto-detect based on currency

---

## Security Checklist

- [ ] Razorpay Key Secret is in `.env` (never in code)
- [ ] Webhook secret is strong and secure
- [ ] Signature verification enabled for webhooks
- [ ] HTTPS enabled (required for Razorpay)
- [ ] Amount calculated server-side (never trust client)
- [ ] Payment status verified before marking invoice as paid
- [ ] Refund policy documented
- [ ] Customer support email configured

---

## Go Live Checklist

- [ ] KYC approved by Razorpay
- [ ] Live API keys generated
- [ ] Test payment with real ₹1 transaction
- [ ] Webhook URL updated to live domain
- [ ] Terms & Conditions page live
- [ ] Refund policy page live
- [ ] Privacy policy includes payment processing
- [ ] Email receipts working
- [ ] Customer support email monitored
- [ ] Settlement bank account verified

---

## Next Steps

1. Complete Razorpay KYC
2. Set up webhook for production
3. Add payment retry logic for failed payments
4. Implement refund functionality
5. Add payment analytics dashboard
6. Send automated payment reminders for overdue invoices

---

**Last updated:** August 2026  
**Razorpay SDK Version:** Latest  
**Estimated integration time:** 2-3 hours
