"use server";
import { InvoiceStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";
import { calculateInvoice } from "@/lib/invoice";
import { invoiceSchema, recordPaymentSchema, updateInvoiceSchema } from "@/lib/validations";
import { sendInvoiceEmail } from "@/lib/email";
import { money } from "@/lib/utils";

export async function createInvoice(input: unknown) {
  const data = invoiceSchema.parse(input);
  const organization = await requireOrganization();
  const client = await prisma.client.findFirst({ where: { id: data.clientId, organizationId: organization.id } });
  if (!client) throw new Error("Client not found in this workspace.");
  const totals = calculateInvoice(data.items, data.taxMode);
  const invoice = await prisma.$transaction(async (tx) => {
    const current = await tx.organization.findUniqueOrThrow({ where: { id: organization.id }, select: { invoicePrefix: true, nextInvoiceNo: true } });
    const invoiceNumber = `${current.invoicePrefix}-${String(current.nextInvoiceNo).padStart(5, "0")}`;
    await tx.organization.update({ where: { id: organization.id }, data: { nextInvoiceNo: { increment: 1 } } });
    return tx.invoice.create({ data: { organizationId: organization.id, clientId: client.id, invoiceNumber, issueDate: data.issueDate, dueDate: data.dueDate, taxMode: data.taxMode, template: data.template, currency: organization.currency, subtotal: new Prisma.Decimal(totals.subtotal.toFixed(2)), taxAmount: new Prisma.Decimal(totals.taxAmount.toFixed(2)), total: new Prisma.Decimal(totals.total.toFixed(2)), notes: data.notes || null, terms: data.terms || null, items: { create: totals.lines.map((line) => ({ description: line.description, hsnSac: line.hsnSac || null, quantity: new Prisma.Decimal(line.quantity), unitPrice: new Prisma.Decimal(line.unitPrice), discount: new Prisma.Decimal(line.discount ?? 0), taxRate: new Prisma.Decimal(line.taxRate), total: new Prisma.Decimal(line.total.toFixed(2)) })) } } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  redirect(`/invoices/${invoice.id}`);
}

export async function sendInvoice(id: string) {
  const organization = await requireOrganization();
  const invoice = await prisma.invoice.findFirst({ where: { id, organizationId: organization.id }, include: { client: true } });
  if (!invoice) throw new Error("Invoice not found.");
  if (!invoice.client.email) return { error: "This client has no email address." };
  if (invoice.status === InvoiceStatus.VOID) return { error: "This invoice is void and cannot be sent." };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return { error: "Set NEXT_PUBLIC_APP_URL before sending invoices." };

  // Deliver first, mark SENT only once delivery is confirmed. Previously the status
  // was written unconditionally, so a rejected send still produced an invoice that
  // claimed it had been emailed.
  try {
    await sendInvoiceEmail({
      to: invoice.client.email,
      invoiceNumber: invoice.invoiceNumber,
      link: `${appUrl}/pay/${invoice.publicToken}`,
      organizationName: organization.name,
      total: money(invoice.total.toString(), invoice.currency)
    });
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "Could not send this invoice." };
  }

  await prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.SENT, sentAt: new Date() } });
  revalidatePath(`/invoices/${id}`); revalidatePath("/invoices");
  return { success: true };
}

/**
 * Recompute an invoice's paid total and status from its SUCCEEDED payment rows.
 *
 * Deriving the total from the rows rather than incrementing a counter means the
 * invoice self-heals: a deleted or corrected payment leaves no drift, and a double
 * submit cannot inflate the balance. Must be called inside a transaction.
 *
 * When nothing is paid we reconstruct the pre-payment status from the invoice's own
 * timestamps rather than defaulting to DRAFT, which would wrongly un-send an invoice.
 */
async function syncInvoiceBalance(tx: Prisma.TransactionClient, invoiceId: string) {
  const invoice = await tx.invoice.findUniqueOrThrow({
    where: { id: invoiceId },
    select: { id: true, total: true, sentAt: true, viewedAt: true, status: true }
  });

  const aggregate = await tx.payment.aggregate({
    where: { invoiceId, status: PaymentStatus.SUCCEEDED },
    _sum: { amount: true }
  });

  const paid = aggregate._sum.amount ?? new Prisma.Decimal(0);

  // A voided invoice keeps its status. Voiding is a deliberate decision and a
  // payment record should not silently resurrect it.
  const status = invoice.status === InvoiceStatus.VOID
    ? InvoiceStatus.VOID
    : paid.greaterThanOrEqualTo(invoice.total) && paid.greaterThan(0)
      ? InvoiceStatus.PAID
      : paid.greaterThan(0)
        ? InvoiceStatus.PARTIALLY_PAID
        : invoice.viewedAt
          ? InvoiceStatus.VIEWED
          : invoice.sentAt
            ? InvoiceStatus.SENT
            : InvoiceStatus.DRAFT;

  await tx.invoice.update({ where: { id: invoiceId }, data: { amountPaid: paid, status } });
  return { paid, status };
}

/**
 * Record a payment that arrived outside Stripe: UPI, bank transfer, cash, or other.
 *
 * This is what makes UPI usable. The QR code on the public invoice page sends money
 * straight to the merchant's UPI ID, so nothing in the system observes it arriving —
 * without this action the invoice stays unpaid forever.
 *
 * STRIPE is not an accepted method here. Card payments may only be created by the
 * signature-verified webhook.
 */
export async function recordPayment(formData: FormData) {
  const parsed = recordPaymentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the payment details." };
  const data = parsed.data;

  const organization = await requireOrganization();
  const invoice = await prisma.invoice.findFirst({
    where: { id: data.invoiceId, organizationId: organization.id },
    select: { id: true, status: true, total: true, amountPaid: true, currency: true }
  });
  if (!invoice) return { error: "Invoice not found." };
  if (invoice.status === InvoiceStatus.VOID) return { error: "This invoice is void. Payments cannot be recorded against it." };

  const amount = new Prisma.Decimal(data.amount.toFixed(2));
  const balance = invoice.total.minus(invoice.amountPaid);
  if (balance.lessThanOrEqualTo(0)) return { error: "This invoice is already fully paid." };

  // Reject overpayment rather than accepting it. An extra digit typed by mistake
  // would otherwise mark the invoice paid and corrupt the revenue figures, and that
  // is far harder to notice than an error message.
  if (amount.greaterThan(balance)) {
    return { error: `That is more than the ${money(balance.toString(), invoice.currency)} outstanding. Record ${money(balance.toString(), invoice.currency)} or less.` };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.create({
      data: {
        invoiceId: invoice.id,
        amount,
        currency: invoice.currency,
        status: PaymentStatus.SUCCEEDED,
        method: data.method as PaymentMethod,
        reference: data.reference || null,
        paidAt: data.paidAt
      }
    });
    await syncInvoiceBalance(tx, invoice.id);
  });

  revalidatePath(`/invoices/${invoice.id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return { success: true };
}

/**
 * Remove a manually recorded payment and re-derive the invoice balance.
 *
 * Only manual entries can be removed. A Stripe payment is evidence of money actually
 * moving through the processor, so deleting it from here would let the application
 * disagree with Stripe — refunds belong in Stripe, and flow back through the webhook.
 */
export async function deletePayment(paymentId: string) {
  const organization = await requireOrganization();

  // Ownership is checked through the invoice relation so one workspace cannot delete
  // another workspace's payment by guessing an id.
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { organizationId: organization.id } },
    select: { id: true, invoiceId: true, method: true }
  });
  if (!payment) return { error: "Payment not found." };
  if (payment.method === PaymentMethod.STRIPE) {
    return { error: "A Stripe payment cannot be removed here. Refund it in Stripe and the webhook will update this invoice." };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.delete({ where: { id: payment.id } });
    await syncInvoiceBalance(tx, payment.invoiceId);
  });

  revalidatePath(`/invoices/${payment.invoiceId}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return { success: true };
}

/**
 * Edit a DRAFT invoice.
 *
 * Restricted to DRAFT on purpose. Once an invoice is sent, the client holds a document
 * and a public payment page exists for it; quietly changing the amounts underneath
 * would make our copy and their copy disagree. Correcting a sent invoice is a void
 * plus a fresh invoice, which leaves a trail.
 *
 * The invoice number is never reassigned — it stays with the record it was issued for.
 */
export async function updateInvoice(input: unknown) {
  const data = updateInvoiceSchema.parse(input);
  const organization = await requireOrganization();

  const existing = await prisma.invoice.findFirst({
    where: { id: data.id, organizationId: organization.id },
    select: { id: true, status: true }
  });
  if (!existing) throw new Error("Invoice not found.");
  if (existing.status !== InvoiceStatus.DRAFT) {
    throw new Error("Only a draft invoice can be edited. Void this invoice and create a replacement instead.");
  }

  // The client must belong to this workspace too, or an edit could reassign an invoice
  // to another workspace's client by supplying a foreign id.
  const client = await prisma.client.findFirst({ where: { id: data.clientId, organizationId: organization.id }, select: { id: true } });
  if (!client) throw new Error("Client not found in this workspace.");

  const totals = calculateInvoice(data.items, data.taxMode);

  await prisma.$transaction(async (tx) => {
    // Line items are replaced wholesale rather than diffed. Rows carry no external
    // references, so a clean replace avoids reconciling adds, edits and removes.
    await tx.invoiceItem.deleteMany({ where: { invoiceId: data.id } });
    await tx.invoice.update({
      where: { id: data.id },
      data: {
        clientId: client.id,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        taxMode: data.taxMode,
        template: data.template,
        subtotal: new Prisma.Decimal(totals.subtotal.toFixed(2)),
        taxAmount: new Prisma.Decimal(totals.taxAmount.toFixed(2)),
        total: new Prisma.Decimal(totals.total.toFixed(2)),
        notes: data.notes || null,
        terms: data.terms || null,
        items: {
          create: totals.lines.map((line) => ({
            description: line.description,
            hsnSac: line.hsnSac || null,
            quantity: new Prisma.Decimal(line.quantity),
            unitPrice: new Prisma.Decimal(line.unitPrice),
            discount: new Prisma.Decimal(line.discount ?? 0),
            taxRate: new Prisma.Decimal(line.taxRate),
            total: new Prisma.Decimal(line.total.toFixed(2))
          }))
        }
      }
    });
    // The total may have moved, so PAID/PARTIALLY_PAID has to be re-derived against it.
    await syncInvoiceBalance(tx, data.id);
  });

  revalidatePath(`/invoices/${data.id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  redirect(`/invoices/${data.id}`);
}

/**
 * Void an invoice, making the VOID status reachable for the first time.
 *
 * Refused when a successful payment exists: money has changed hands, and a voided
 * invoice claiming otherwise would misstate revenue. Refund in Stripe or remove the
 * manual payment record first, so the reversal is explicit.
 *
 * Voiding does not delete anything. The record and its number stay for the audit trail,
 * and the public payment page stops accepting payment.
 */
export async function voidInvoice(id: string) {
  const organization = await requireOrganization();

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: organization.id },
    select: { id: true, status: true, _count: { select: { payments: { where: { status: PaymentStatus.SUCCEEDED } } } } }
  });
  if (!invoice) return { error: "Invoice not found." };
  if (invoice.status === InvoiceStatus.VOID) return { error: "This invoice is already void." };
  if (invoice._count.payments > 0) {
    return { error: "This invoice has a recorded payment. Refund or remove the payment first, then void it." };
  }

  await prisma.invoice.update({ where: { id: invoice.id }, data: { status: InvoiceStatus.VOID } });

  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return { success: true };
}

/**
 * Permanently delete a DRAFT invoice.
 *
 * DRAFT only. Anything that has been sent stays in the ledger and is voided instead,
 * so the numbering sequence never develops unexplained gaps. Items cascade via the
 * schema relation.
 */
export async function deleteInvoice(id: string) {
  const organization = await requireOrganization();

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: organization.id },
    select: { id: true, status: true }
  });
  if (!invoice) return { error: "Invoice not found." };
  if (invoice.status !== InvoiceStatus.DRAFT) {
    return { error: "Only a draft can be deleted. Void this invoice instead so the record is kept." };
  }

  await prisma.invoice.delete({ where: { id: invoice.id } });

  revalidatePath("/invoices");
  revalidatePath("/dashboard");
  return { success: true };
}
