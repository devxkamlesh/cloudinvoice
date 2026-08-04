import { NextResponse } from "next/server";
import { InvoiceStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  let event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, process.env.STRIPE_WEBHOOK_SECRET); } catch { return NextResponse.json({ error: "Invalid signature." }, { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const invoiceId = session.metadata?.invoiceId;
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
    if (invoiceId && paymentIntentId && session.payment_status === "paid") {
      await prisma.$transaction(async (tx) => {
        const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
        if (!invoice) return;
        const existing = await tx.payment.findUnique({ where: { stripePaymentId: paymentIntentId } });
        if (existing) return;
        const amount = new Prisma.Decimal((session.amount_total ?? 0) / 100);
        await tx.payment.create({ data: { invoiceId, amount, currency: (session.currency ?? invoice.currency).toUpperCase(), status: PaymentStatus.SUCCEEDED, method: PaymentMethod.STRIPE, stripePaymentId: paymentIntentId, paidAt: new Date() } });
        const paid = new Prisma.Decimal(invoice.amountPaid).plus(amount);
        await tx.invoice.update({ where: { id: invoice.id }, data: { amountPaid: paid, status: paid.greaterThanOrEqualTo(invoice.total) ? InvoiceStatus.PAID : InvoiceStatus.PARTIALLY_PAID } });
      });
    }
  }
  return NextResponse.json({ received: true });
}
