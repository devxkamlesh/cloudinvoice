import { NextResponse } from "next/server";
import { InvoiceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe) return NextResponse.json({ error: "Online card payments are not configured." }, { status: 503 });
  const body = await request.json().catch(() => null) as { token?: string } | null;
  if (!body?.token || typeof body.token !== "string") return NextResponse.json({ error: "Invalid payment request." }, { status: 400 });
  const invoice = await prisma.invoice.findUnique({ where: { publicToken: body.token }, include: { organization: true, client: true } });
  if (!invoice || invoice.status === InvoiceStatus.VOID || invoice.status === InvoiceStatus.PAID) return NextResponse.json({ error: "This invoice is no longer payable." }, { status: 404 });
  const balance = Number(invoice.total) - Number(invoice.amountPaid);
  if (balance <= 0) return NextResponse.json({ error: "This invoice has been paid." }, { status: 409 });
  const origin = new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment", customer_email: invoice.client.email ?? undefined,
    client_reference_id: invoice.id,
    metadata: { invoiceId: invoice.id },
    payment_intent_data: { metadata: { invoiceId: invoice.id } },
    line_items: [{ price_data: { currency: invoice.currency.toLowerCase(), product_data: { name: `Invoice ${invoice.invoiceNumber}`, description: `Payment to ${invoice.organization.name}` }, unit_amount: Math.round(balance * 100) }, quantity: 1 }],
    success_url: `${origin}/pay/${invoice.publicToken}?payment=success`, cancel_url: `${origin}/pay/${invoice.publicToken}?payment=cancelled`
  });
  return NextResponse.json({ url: session.url });
}
