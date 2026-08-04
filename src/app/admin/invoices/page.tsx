import type { Metadata } from "next";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { formatDate, money } from "@/lib/utils";

export const metadata: Metadata = { title: "Invoices" };

const PAGE_SIZE = 30;
const STATUSES = Object.values(InvoiceStatus);

export default async function AdminInvoicesPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  // Only accept a value that is actually a member of the enum, so an arbitrary query
  // string cannot reach the database filter.
  const status = STATUSES.find((value) => value === params.status);
  const where: Prisma.InvoiceWhereInput = status ? { status } : {};

  const [total, invoices] = await Promise.all([
    prisma.invoice.count({ where }),
    prisma.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceNumber: true,
        status: true,
        total: true,
        amountPaid: true,
        currency: true,
        issueDate: true,
        dueDate: true,
        organization: { select: { name: true } },
        client: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const link = (next: Record<string, string>) => `/admin/invoices?${new URLSearchParams({ ...(status && { status }), ...next })}`;

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-muted-foreground">PLATFORM</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total} invoice{total === 1 ? "" : "s"} across every workspace. Read-only: an invoice belongs to the workspace that issued it, and only they can change it.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        <Button asChild variant={status ? "ghost" : "secondary"} size="sm">
          <a href="/admin/invoices" aria-current={status ? undefined : "page"}>All</a>
        </Button>
        {STATUSES.map((value) => (
          <Button key={value} asChild variant={status === value ? "secondary" : "ghost"} size="sm">
            <a href={`/admin/invoices?status=${value}`} aria-current={status === value ? "page" : undefined} className="capitalize">
              {value.toLowerCase().replaceAll("_", " ")}
            </a>
          </Button>
        ))}
      </div>

      <section className="surface mt-6 overflow-hidden rounded-2xl">
        {invoices.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-primary">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">No invoices match this view.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <caption className="sr-only">All invoices across every workspace</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Invoice</th>
                  <th scope="col" className="px-5 py-3 font-medium">Workspace</th>
                  <th scope="col" className="px-5 py-3 font-medium">Client</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Due</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Outstanding</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const outstanding = invoice.total.minus(invoice.amountPaid);
                  return (
                    <tr key={invoice.id} className="border-t">
                      <th scope="row" className="px-5 py-4 text-left font-medium">{invoice.invoiceNumber}</th>
                      <td className="px-5 py-4">{invoice.organization.name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{invoice.client.name}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                          {invoice.status.toLowerCase().replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(invoice.dueDate)}</td>
                      <td className="px-5 py-4 text-right font-medium">{money(invoice.total.toString(), invoice.currency)}</td>
                      <td className="px-5 py-4 text-right">
                        {outstanding.greaterThan(0)
                          ? money(outstanding.toString(), invoice.currency)
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">Page {page} of {pages}</p>
          <span className="flex gap-2">
            {page > 1 && <Button asChild variant="outline" size="sm"><a href={link({ page: String(page - 1) })}>Previous</a></Button>}
            {page < pages && <Button asChild variant="outline" size="sm"><a href={link({ page: String(page + 1) })}>Next</a></Button>}
          </span>
        </nav>
      )}
    </main>
  );
}
