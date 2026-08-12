import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { AIInvoiceGeneratorWrapper } from "@/components/invoices/ai-invoice-generator-wrapper";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

export default async function NewInvoicePage() {
  const organization = await requireOrganization();
  const clients = await prisma.client.findMany({
    where: { organizationId: organization.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto w-full max-w-7xl p-5 sm:p-7">
      <Link
        href="/invoices"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Invoices
      </Link>

      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">NEW BILLING</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Create invoice
        </h1>
      </div>

      <div className="mt-7 space-y-6">
        {/* AI Invoice Generator */}
        <AIInvoiceGeneratorWrapper />

        {/* Traditional Form */}
        <InvoiceForm clients={clients} defaultTaxMode="INTRA_STATE" />
      </div>
    </main>
  );
}
