import { NextResponse } from 'next/server';
import { InvoiceStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createRazorpayOrder, razorpay } from '@/lib/razorpay';

export async function POST(request: Request) {
  // Check if Razorpay is configured
  if (!razorpay) {
    return NextResponse.json(
      { error: 'Razorpay payments are not configured.' },
      { status: 503 }
    );
  }

  try {
    // Parse request body
    const body = (await request.json().catch(() => null)) as { token?: string } | null;

    if (!body?.token || typeof body.token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid payment request.' },
        { status: 400 }
      );
    }

    // Find invoice by public token
    const invoice = await prisma.invoice.findUnique({
      where: { publicToken: body.token },
      include: {
        organization: true,
        client: true,
      },
    });

    // Validate invoice exists and is payable
    if (
      !invoice ||
      invoice.status === InvoiceStatus.VOID ||
      invoice.status === InvoiceStatus.PAID
    ) {
      return NextResponse.json(
        { error: 'This invoice is no longer payable.' },
        { status: 404 }
      );
    }

    // Calculate balance
    const balance = Number(invoice.total) - Number(invoice.amountPaid);

    if (balance <= 0) {
      return NextResponse.json(
        { error: 'This invoice has been paid.' },
        { status: 409 }
      );
    }

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount: balance,
      currency: invoice.currency,
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
        organizationName: invoice.organization.name,
        clientName: invoice.client.name,
        clientEmail: invoice.client.email,
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
