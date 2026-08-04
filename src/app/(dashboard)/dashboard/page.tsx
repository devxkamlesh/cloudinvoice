import Link from "next/link";
import { InvoiceStatus, PaymentStatus, Prisma } from "@prisma/client";
import { AlertTriangle, ArrowUpRight, FilePlus2, FileText, IndianRupee, UsersRound, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

// Statuses where money is still expected. VOID and DRAFT are excluded: one is cancelled,
// the other has not been issued, so neither belongs in an outstanding figure.
// Annotated as InvoiceStatus[] rather than left to inference, so .includes() accepts
// any status value instead of only the four in this list.
const OPEN_STATUSES: InvoiceStatus[] = [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE];

export default async function DashboardPage() {
  const org = await requireOrganization();
  const now = new Date();

  const [collected, open, draftCount, overdueCount, clientCount, invoiceCount, recent] = await Promise.all([
    // Collected comes from confirmed payment rows, not from summing the totals of
    // invoices marked PAID. A partially paid invoice contributes its real amount, and a
    // status that drifted from the payment records cannot inflate revenue.
    prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCEEDED, invoice: { organizationId: org.id } },
      _sum: { amount: true }
    }),
    // Outstanding is billed minus paid across every open invoice, aggregated in the
    // database. This previously reduced only the six most recent invoices, so both
    // headline figures were wrong for any workspace past its sixth invoice.
    prisma.invoice.aggregate({
      where: { organizationId: org.id, status: { in: OPEN_STATUSES } },
      _sum: { total: true, amountPaid: true }
    }),
    prisma.invoice.count({ where: { organizationId: org.id, status: InvoiceStatus.DRAFT } }),
    // Overdue is derived from the due date rather than read from a status. Nothing in
    // the product ever assigns InvoiceStatus.OVERDUE, so a stored value would always
    // be zero.
    prisma.invoice.count({
      where: { organizationId: org.id, status: { in: OPEN_STATUSES }, dueDate: { lt: now } }
    }),
    prisma.client.count({ where: { organizationId: org.id } }),
    prisma.invoice.count({ where: { organizationId: org.id } }),
    prisma.invoice.findMany({
      where: { organizationId: org.id },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  // Decimal throughout: these are money figures, so no float rounding gets introduced
  // on the way to the screen.
  const collectedTotal = collected._sum.amount ?? new Prisma.Decimal(0);
  const outstandingTotal = (open._sum.total ?? new Prisma.Decimal(0)).minus(open._sum.amountPaid ?? 0);

  const cards = [
    { label: "Collected", value: money(collectedTotal.toString(), org.currency), hint: "Confirmed payments, all time", icon: IndianRupee },
    { label: "Outstanding", value: money(outstandingTotal.toString(), org.currency), hint: `Across ${invoiceCount - draftCount} issued invoice${invoiceCount - draftCount === 1 ? "" : "s"}`, icon: WalletCards },
    { label: "Overdue", value: String(overdueCount), hint: overdueCount === 0 ? "Nothing past due" : "Past the due date", icon: AlertTriangle },
    { label: "Clients", value: String(clientCount), hint: draftCount > 0 ? `${draftCount} draft${draftCount === 1 ? "" : "s"} waiting` : "In your workspace", icon: UsersRound }
  ];

  return (
    <main className="mx-auto w-full max-w-7xl p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Good to see you</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your business at a glance</h1>
        </div>
        <Button asChild>
          <Link href="/invoices/new"><FilePlus2 className="size-4" aria-hidden="true" />New invoice</Link>
        </Button>
      </div>

      <section aria-label="Workspace summary" className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon }) => (
          <article key={label} className="surface rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className={`size-5 ${label === "Overdue" && overdueCount > 0 ? "text-amber-600" : "text-primary"}`} aria-hidden="true" />
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </article>
        ))}
      </section>

      {overdueCount > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <AlertTriangle className="size-5 shrink-0 text-amber-700" aria-hidden="true" />
          <p className="min-w-0 flex-1 text-sm text-amber-900">
            {overdueCount} invoice{overdueCount === 1 ? " is" : "s are"} past the due date and still unpaid.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/invoices">Review invoices</Link>
          </Button>
        </div>
      )}

      <section className="surface mt-7 overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5">
          <div>
            <h2 className="font-semibold">Recent invoices</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your six most recent, newest first.</p>
          </div>
          <Link href="/invoices" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            All invoices <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="border-t px-5 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-primary">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 font-medium">Your invoice list is ready when you are.</p>
            <p className="mt-1 text-sm text-muted-foreground">Create an invoice to start tracking revenue.</p>
            <Button className="mt-5" asChild><Link href="/invoices/new">Create invoice</Link></Button>
          </div>
        ) : (
          <div className="overflow-x-auto border-t">
            <table className="w-full min-w-[680px] text-left text-sm">
              <caption className="sr-only">Six most recently created invoices</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Invoice</th>
                  <th scope="col" className="px-5 py-3 font-medium">Client</th>
                  <th scope="col" className="px-5 py-3 font-medium">Due</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((invoice) => {
                  const isOverdue = OPEN_STATUSES.includes(invoice.status) && invoice.dueDate < now;
                  return (
                    <tr key={invoice.id} className="border-t">
                      <th scope="row" className="px-5 py-4 text-left font-medium">
                        <Link className="hover:text-primary" href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link>
                      </th>
                      <td className="px-5 py-4">{invoice.client.name}</td>
                      <td className={`px-5 py-4 ${isOverdue ? "font-medium text-amber-700" : "text-muted-foreground"}`}>
                        {formatDate(invoice.dueDate)}{isOverdue && <span className="ml-1.5 text-xs">overdue</span>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">
                          {invoice.status.replaceAll("_", " ").toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-medium">{money(invoice.total.toString(), invoice.currency)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
