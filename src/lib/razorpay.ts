import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
export const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

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
  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }

  // Razorpay expects amount in paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amount * 100);

  // Minimum amount check (100 paise = 1 INR)
  if (amountInPaise < 100) {
    throw new Error('Amount must be at least 100 paise (1 INR)');
  }

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt,
    notes,
  });

  return order;
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay key secret is not configured');
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Constant-time comparison to prevent timing side-channel attacks.
  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    );
  } catch {
    // If the signature is not valid hex or lengths differ, Buffer.from throws.
    return false;
  }
}

// Get payment details
export async function getRazorpayPayment(paymentId: string) {
  if (!razorpay) {
    throw new Error('Razorpay is not configured');
  }
  return razorpay.payments.fetch(paymentId);
}
