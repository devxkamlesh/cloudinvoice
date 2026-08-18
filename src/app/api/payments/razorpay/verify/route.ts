import { NextResponse } from 'next/server';
import { InvoiceStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature, getRazorpayPayment } from '@/lib/razorpay';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id?: string;
      razorpay_payment_id?: string;
      razorpay_signature?: string;
      invoiceId?: string;
    };

    // Validate required fields
    if (
      !body.razorpay_order_id ||
      !body.razorpay_payment_id ||
      !body.razorpay_signature ||
      !body.invoiceId
    ) {
      return NextResponse.json(
        { error: 'Missing required payment verification fields' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get payment details from Razorpay
    const payment = await getRazorpayPayment(body.razorpay_payment_id);

    // Check payment status
    if (payment.status !== 'captured' && payment.status !== 'authorized') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    if (payment.order_id !== body.razorpay_order_id) {
      return NextResponse.json({ error: 'Payment order mismatch' }, { status: 400 });
    }

    // Get invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: body.invoiceId },
      include: {
        client: true,
        organization: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Calculate amount paid (convert paise to currency units)
    const amountPaid = Number(payment.amount) / 100;
    const balance = Number(invoice.total) - Number(invoice.amountPaid);
    if (payment.currency !== invoice.currency || Math.abs(amountPaid - balance) > 0.009) {
      return NextResponse.json({ error: 'Payment amount or currency mismatch' }, { status: 400 });
    }

    // Record payment and update invoice in transaction
    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // Check if payment already exists
      const existingPayment = await tx.payment.findFirst({
        where: {
          invoiceId: body.invoiceId,
          razorpayPaymentId: body.razorpay_payment_id,
        },
      });

      if (existingPayment) return invoice;

      await tx.payment.create({
        data: {
          invoiceId: body.invoiceId!,
          amount: amountPaid,
          currency: invoice.currency,
          status: 'SUCCEEDED',
          method: 'RAZORPAY',
          razorpayPaymentId: body.razorpay_payment_id,
          razorpayOrderId: body.razorpay_order_id,
          paidAt: new Date(),
        },
      });

      return tx.invoice.update({
        where: { id: body.invoiceId },
        data: {
          status: InvoiceStatus.PAID,
          amountPaid: { increment: amountPaid },
        },
      });
    });

    // TODO: Send payment confirmation email
    // await sendPaymentConfirmation({
    //   to: invoice.client.email,
    //   invoiceNumber: invoice.invoiceNumber,
    //   amount: amountPaid,
    //   paidAt: new Date(),
    // });

    return NextResponse.json({
      success: true,
      invoice: {
        id: updatedInvoice.id,
        status: updatedInvoice.status,
        amountPaid: updatedInvoice.amountPaid,
      },
      payment: {
        id: payment.id,
        method: payment.method,
        amount: amountPaid,
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
