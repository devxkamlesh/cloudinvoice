"use server";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";
import { calculateInvoice } from "@/lib/invoice";
import { invoiceSchema } from "@/lib/validations";
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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) return { error: "Set NEXT_PUBLIC_APP_URL before sending invoices." };
  await sendInvoiceEmail({ to: invoice.client.email, invoiceNumber: invoice.invoiceNumber, link: `${appUrl}/pay/${invoice.publicToken}`, organizationName: organization.name, total: money(invoice.total.toString(), invoice.currency) });
  await prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.SENT, sentAt: new Date() } });
  revalidatePath(`/invoices/${id}`); revalidatePath("/invoices");
  return { success: true };
}
