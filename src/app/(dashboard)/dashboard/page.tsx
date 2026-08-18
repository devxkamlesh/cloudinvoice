import Link from "next/link";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { InvoiceStatus, PaymentStatus, Prisma } from "@prisma/client";
import { AlertTriangle, ArrowRight, ArrowUpRight, CheckCircle2, Clock3, FilePlus2, FileText, IndianRupee, Landmark, UsersRound, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

const OPEN_STATUSES: InvoiceStatus[] = [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.PARTIALLY_PAID, InvoiceStatus.OVERDUE];

export default async function DashboardPage() {
  const org = await requireOrganization();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const chartStart = startOfMonth(subMonths(now, 5));

  const [collected, open, draftCount, overdueCount, clientCount, issuedCount, recent, chartInvoices, monthPayments, monthIssued] = await Promise.all([
    prisma.payment.aggregate({ where: { status: PaymentStatus.SUCCEEDED, invoice: { organizationId: org.id } }, _sum: { amount: true } }),
    prisma.invoice.aggregate({ where: { organizationId: org.id, status: { in: OPEN_STATUSES } }, _sum: { total: true, amountPaid: true } }),
    prisma.invoice.count({ where: { organizationId: org.id, status: InvoiceStatus.DRAFT } }),
    prisma.invoice.count({ where: { organizationId: org.id, status: { in: OPEN_STATUSES }, dueDate: { lt: now } } }),
    prisma.client.count({ where: { organizationId: org.id } }),
    prisma.invoice.count({ where: { organizationId: org.id, status: { notIn: [InvoiceStatus.DRAFT, InvoiceStatus.VOID] } } }),
    prisma.invoice.findMany({ where: { organizationId: org.id }, include: { client: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.invoice.findMany({ where: { organizationId: org.id, issueDate: { gte: chartStart }, status: { notIn: [InvoiceStatus.DRAFT, InvoiceStatus.VOID] } }, select: { issueDate: true, total: true, amountPaid: true } }),
    prisma.payment.aggregate({ where: { status: PaymentStatus.SUCCEEDED, paidAt: { gte: monthStart }, invoice: { organizationId: org.id } }, _sum: { amount: true } }),
    prisma.invoice.aggregate({ where: { organizationId: org.id, issueDate: { gte: monthStart }, status: { notIn: [InvoiceStatus.DRAFT, InvoiceStatus.VOID] } }, _sum: { total: true } }),
  ]);

  const collectedTotal = collected._sum.amount ?? new Prisma.Decimal(0);
  const outstandingTotal = (open._sum.total ?? new Prisma.Decimal(0)).minus(open._sum.amountPaid ?? 0);
  const monthCollected = Number(monthPayments._sum.amount ?? 0);
  const monthBilled = Number(monthIssued._sum.total ?? 0);
  const collectionRate = monthBilled > 0 ? Math.min(100, monthCollected / monthBilled * 100) : 0;
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(now, 5 - index);
    const rows = chartInvoices.filter((invoice) => invoice.issueDate >= startOfMonth(date) && invoice.issueDate <= endOfMonth(date));
    return { label: format(date, "MMM"), billed: rows.reduce((sum, row) => sum + Number(row.total), 0), collected: rows.reduce((sum, row) => sum + Number(row.amountPaid), 0) };
  });
  const chartMax = Math.max(...months.flatMap((month) => [month.billed, month.collected]), 1);
  const razorpayReady = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  const cards = [
    { label: "Collected", value: money(collectedTotal.toString(), org.currency), hint: "Confirmed payments, all time", icon: IndianRupee },
    { label: "Outstanding", value: money(outstandingTotal.toString(), org.currency), hint: `Across ${issuedCount} issued invoice${issuedCount === 1 ? "" : "s"}`, icon: WalletCards },
    { label: "Overdue", value: String(overdueCount), hint: overdueCount ? "Needs follow-up" : "Nothing past due", icon: AlertTriangle },
    { label: "Clients", value: String(clientCount), hint: `${draftCount} draft${draftCount === 1 ? "" : "s"} in progress`, icon: UsersRound },
  ];

  return (
    <main className="mx-auto max-w-[92rem] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="app-eyebrow">Workspace overview</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Good {now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening"}.</h1><p className="mt-2 text-sm text-muted-foreground">Here is what needs attention in {org.name}.</p></div>
        <Button asChild size="lg"><Link href="/invoices/new"><FilePlus2 className="size-4" />New invoice</Link></Button>
      </div>

      <section aria-label="Workspace summary" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, hint, icon: Icon }) => <article key={label} className="app-stat p-5"><div className="relative flex items-start justify-between gap-4"><p className="text-sm font-medium text-muted-foreground">{label}</p><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span></div><p className="relative mt-6 text-2xl font-semibold tracking-[-.035em] tabular-nums">{value}</p><p className="relative mt-2 text-xs text-muted-foreground">{hint}</p></article>)}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.55fr]">
        <section className="app-panel overflow-hidden">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"><div><p className="app-eyebrow">Cash flow</p><h2 className="mt-2 text-xl font-semibold tracking-[-.025em]">Billed and collected</h2><p className="mt-1 text-sm text-muted-foreground">Last six invoice months</p></div><div className="flex gap-5 text-xs"><span><strong className="block text-lg font-semibold tabular-nums text-foreground">{money(monthBilled, org.currency)}</strong><span className="text-muted-foreground">Billed this month</span></span><span><strong className="block text-lg font-semibold tabular-nums text-primary">{money(monthCollected, org.currency)}</strong><span className="text-muted-foreground">Collected</span></span></div></div>
          <div className="border-t px-5 pb-5 pt-7 sm:px-6">
            <div className="flex h-56 items-end gap-3 sm:gap-5">{months.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col justify-end"><div className="flex min-h-0 flex-1 items-end justify-center gap-1"><span className="w-2/5 rounded-t-sm bg-muted-foreground/22" style={{ height: `${Math.max(month.billed / chartMax * 100, month.billed ? 4 : 0)}%` }} title={`${month.label} billed ${money(month.billed, org.currency)}`} /><span className="w-2/5 rounded-t-sm bg-primary" style={{ height: `${Math.max(month.collected / chartMax * 100, month.collected ? 4 : 0)}%` }} title={`${month.label} collected ${money(month.collected, org.currency)}`} /></div><span className="mt-3 text-center text-xs text-muted-foreground">{month.label}</span></div>)}</div>
            <div className="mt-5 flex items-center gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-muted-foreground/22" />Billed</span><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-primary" />Collected</span><Link href="/analytics" className="ms-auto inline-flex items-center gap-1 font-semibold text-primary">Full analytics <ArrowUpRight className="size-3.5" /></Link></div>
          </div>
        </section>

        <div className="grid gap-5">
          <section className="app-panel p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="app-eyebrow">Collection health</p><h2 className="mt-2 text-lg font-semibold">This month</h2></div><span className="text-2xl font-semibold tabular-nums">{collectionRate.toFixed(0)}%</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${collectionRate}%` }} /></div><p className="mt-3 text-xs leading-5 text-muted-foreground">Confirmed payments divided by invoices issued this month.</p></section>
          <section className="app-panel p-5 sm:p-6"><div className="flex items-start justify-between"><div><p className="app-eyebrow">Payment gateway</p><h2 className="mt-2 text-lg font-semibold">Razorpay</h2></div><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${razorpayReady ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>{razorpayReady ? "Ready" : "Needs setup"}</span></div><div className="mt-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Landmark className="size-5" /></span><p className="text-sm leading-6 text-muted-foreground">UPI, Indian cards, and NetBanking through hosted Razorpay Checkout.</p></div><Link href="/settings" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">Payment settings <ArrowRight className="size-4" /></Link></section>
        </div>
      </div>

      <section className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link href="/invoices?status=draft" className="app-panel flex items-center gap-4 p-5 transition-[border-color,transform] duration-150 hover:border-primary/35 active:scale-[.96]"><span className="grid size-10 place-items-center rounded-lg bg-muted text-foreground"><FileText className="size-5" /></span><div><p className="font-semibold">{draftCount} draft{draftCount === 1 ? "" : "s"}</p><p className="mt-1 text-xs text-muted-foreground">Review before sending</p></div><ArrowRight className="ms-auto size-4 text-muted-foreground" /></Link>
        <Link href="/invoices" className="app-panel flex items-center gap-4 p-5 transition-[border-color,transform] duration-150 hover:border-primary/35 active:scale-[.96]"><span className="grid size-10 place-items-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300"><Clock3 className="size-5" /></span><div><p className="font-semibold">{overdueCount} overdue</p><p className="mt-1 text-xs text-muted-foreground">Invoices past due</p></div><ArrowRight className="ms-auto size-4 text-muted-foreground" /></Link>
        <Link href="/clients" className="app-panel flex items-center gap-4 p-5 transition-[border-color,transform] duration-150 hover:border-primary/35 active:scale-[.96]"><span className="grid size-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"><UsersRound className="size-5" /></span><div><p className="font-semibold">{clientCount} client{clientCount === 1 ? "" : "s"}</p><p className="mt-1 text-xs text-muted-foreground">Billing records on file</p></div><ArrowRight className="ms-auto size-4 text-muted-foreground" /></Link>
      </section>

      <section className="app-panel mt-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6"><div><h2 className="font-semibold">Recent invoices</h2><p className="mt-1 text-sm text-muted-foreground">Newest activity across this workspace.</p></div><Link href="/invoices" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">View all <ArrowUpRight className="size-4" /></Link></div>
        {recent.length === 0 ? <div className="border-t px-5 py-14 text-center"><span className="mx-auto grid size-11 place-items-center rounded-lg bg-muted text-primary"><FileText className="size-5" /></span><p className="mt-4 font-medium">No invoices yet</p><p className="mt-1 text-sm text-muted-foreground">Create one to begin tracking billed and collected value.</p></div> : <div className="overflow-x-auto border-t"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-muted/45 text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-medium sm:px-6">Invoice</th><th className="px-5 py-3 font-medium">Client</th><th className="px-5 py-3 font-medium">Due</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3 text-end font-medium sm:px-6">Total</th></tr></thead><tbody>{recent.map((invoice) => { const isOverdue = OPEN_STATUSES.includes(invoice.status) && invoice.dueDate < now; return <tr key={invoice.id} className="border-t"><th className="px-5 py-4 text-left font-medium sm:px-6"><Link className="text-primary hover:underline" href={`/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link></th><td className="px-5 py-4">{invoice.client.name}</td><td className={`px-5 py-4 ${isOverdue ? "text-amber-700 dark:text-amber-300" : "text-muted-foreground"}`}>{formatDate(invoice.dueDate)}</td><td className="px-5 py-4"><span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium capitalize">{invoice.status.replaceAll("_", " ").toLowerCase()}</span></td><td className="px-5 py-4 text-end font-medium tabular-nums sm:px-6">{money(invoice.total.toString(), invoice.currency)}</td></tr>; })}</tbody></table></div>}
      </section>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><CheckCircle2 className="size-4 text-primary" />Dashboard totals use confirmed payment records and workspace-scoped invoices.</p>
    </main>
  );
}
