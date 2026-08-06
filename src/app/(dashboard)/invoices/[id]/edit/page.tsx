import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { InvoiceStatus } from "@prisma/client";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const organization = await requireOrganization();

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: organization.id },
    include: { items: { orderBy: { id: "asc" } } }
  });
  if (!invoice) notFound();

  // Guard the route as well as the action. Landing on an edit form for a sent invoice
  // and only being refused on submit would waste the user's work.
  if (invoice.status !== InvoiceStatus.DRAFT) redirect(`/invoices/${invoice.id}`);

  const clients = await prisma.client.findMany({
    where: { organizationId: organization.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });

  // Decimal and Date cannot cross into a client component, so everything is converted
  // to the primitives the form inputs expect.
  const existing = {
    id: invoice.id,
    clientId: invoice.clientId,
    issueDate: invoice.issueDate.toISOString().slice(0, 10),
    dueDate: invoice.dueDate.toISOString().slice(0, 10),
    taxMode: invoice.taxMode,
    template: (["classic", "modern", "midnight", "minimal", "corporate", "creative"] as const).includes(invoice.template as "classic")
      ? (invoice.template as "classic" | "modern" | "midnight" | "minimal" | "corporate" | "creative")
      : "classic",
    notes: invoice.notes ?? "",
    terms: invoice.terms ?? "",
    items: invoice.items.map((item) => ({
      description: item.description,
      hsnSac: item.hsnSac ?? undefined,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      taxRate: Number(item.taxRate)
    }))
  };

  return <main className="mx-auto max-w-7xl p-5 sm:p-7">
    <Link href={`/invoices/${invoice.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ChevronLeft className="size-4" aria-hidden="true" />{invoice.invoiceNumber}
    </Link>
    <div className="mt-4">
      <p className="text-sm font-medium text-muted-foreground">EDITING DRAFT</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">{invoice.invoiceNumber}</h1>
      <p className="mt-2 text-sm text-muted-foreground">The invoice number stays the same. Totals are recalculated when you save.</p>
    </div>
    <div className="mt-7">
      <InvoiceForm clients={clients} defaultTaxMode={invoice.taxMode} existing={existing} />
    </div>
  </main>;
}
