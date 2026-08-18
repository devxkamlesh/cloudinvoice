import Link from "next/link";
import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ArrowLeft, BarChart3, CheckCircle2, TrendingUp, WalletCards } from "lucide-react";
import { money } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { requireOrganization } from "@/lib/organization";

export default async function AnalyticsPage() {
  const organization = await requireOrganization();
  const now = new Date();
  const since = startOfMonth(subMonths(now, 5));
  const invoices = await prisma.invoice.findMany({ where: { organizationId: organization.id, issueDate: { gte: since }, status: { in: ["PAID", "PARTIALLY_PAID", "SENT", "VIEWED", "OVERDUE"] } }, select: { issueDate: true, total: true, amountPaid: true } });
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = subMonths(now, 5 - index);
    const rows = invoices.filter((invoice) => invoice.issueDate >= startOfMonth(date) && invoice.issueDate <= endOfMonth(date));
    const billed = rows.reduce((sum, invoice) => sum + Number(invoice.total), 0);
    const collected = rows.reduce((sum, invoice) => sum + Number(invoice.amountPaid), 0);
    return { label: format(date, "MMMM"), short: format(date, "MMM"), billed, collected, rate: billed ? Math.min(100, collected / billed * 100) : 0 };
  });
  const totalCollected = months.reduce((sum, month) => sum + month.collected, 0);
  const totalBilled = months.reduce((sum, month) => sum + month.billed, 0);
  const outstanding = Math.max(0, totalBilled - totalCollected);
  const collectionRate = totalBilled ? Math.min(100, totalCollected / totalBilled * 100) : 0;
  const max = Math.max(...months.flatMap((month) => [month.billed, month.collected]), 1);

  return (
    <main className="mx-auto max-w-[92rem] p-4 sm:p-6 lg:p-8">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Dashboard</Link>
      <div className="mt-5"><p className="app-eyebrow">Reporting</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Revenue analytics</h1><p className="mt-2 text-sm text-muted-foreground">Invoice value and confirmed collections over the last six months.</p></div>

      <section className="mt-8 grid gap-3 sm:grid-cols-3">
        {[{ label: "Billed", value: money(totalBilled, organization.currency), detail: "Issued invoice value", icon: BarChart3 }, { label: "Collected", value: money(totalCollected, organization.currency), detail: "Confirmed payments", icon: CheckCircle2 }, { label: "Outstanding", value: money(outstanding, organization.currency), detail: `${collectionRate.toFixed(0)}% collection rate`, icon: WalletCards }].map(({ label, value, detail, icon: Icon }) => <article key={label} className="app-stat p-5"><div className="flex items-start justify-between"><p className="text-sm text-muted-foreground">{label}</p><span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span></div><p className="mt-6 text-2xl font-semibold tabular-nums tracking-[-.035em]">{value}</p><p className="mt-2 text-xs text-muted-foreground">{detail}</p></article>)}
      </section>

      <section className="app-panel mt-5 overflow-hidden">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6"><div><p className="app-eyebrow">Six-month trend</p><h2 className="mt-2 text-xl font-semibold">Billed versus collected</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><TrendingUp className="size-3.5" />{collectionRate.toFixed(0)}% collected</span></div>
        <div className="border-t px-5 pb-6 pt-8 sm:px-6"><div className="flex h-72 items-end gap-3 sm:gap-7">{months.map((month) => <div key={month.label} className="flex h-full flex-1 flex-col justify-end"><div className="flex min-h-0 flex-1 items-end justify-center gap-1"><span className="w-2/5 rounded-t-sm bg-muted-foreground/22" style={{ height: `${Math.max(month.billed / max * 100, month.billed ? 3 : 0)}%` }} /><span className="w-2/5 rounded-t-sm bg-primary" style={{ height: `${Math.max(month.collected / max * 100, month.collected ? 3 : 0)}%` }} /></div><span className="mt-3 text-center text-xs text-muted-foreground">{month.short}</span></div>)}</div><div className="mt-5 flex gap-5 text-xs text-muted-foreground"><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-muted-foreground/22" />Billed</span><span className="flex items-center gap-2"><i className="size-2.5 rounded-sm bg-primary" />Collected</span></div></div>
      </section>

      <section className="app-panel mt-5 overflow-hidden"><div className="px-5 py-5 sm:px-6"><h2 className="font-semibold">Monthly detail</h2><p className="mt-1 text-sm text-muted-foreground">How much invoice value converted into confirmed payment.</p></div><div className="overflow-x-auto border-t"><table className="w-full min-w-[620px] text-sm"><thead className="bg-muted/45 text-left text-xs text-muted-foreground"><tr><th className="px-5 py-3 font-medium sm:px-6">Month</th><th className="px-5 py-3 text-end font-medium">Billed</th><th className="px-5 py-3 text-end font-medium">Collected</th><th className="px-5 py-3 text-end font-medium sm:px-6">Rate</th></tr></thead><tbody>{months.map((month) => <tr key={month.label} className="border-t"><th className="px-5 py-4 text-left font-medium sm:px-6">{month.label}</th><td className="px-5 py-4 text-end tabular-nums">{money(month.billed, organization.currency)}</td><td className="px-5 py-4 text-end tabular-nums text-primary">{money(month.collected, organization.currency)}</td><td className="px-5 py-4 text-end font-medium tabular-nums sm:px-6">{month.rate.toFixed(0)}%</td></tr>)}</tbody></table></div></section>
    </main>
  );
}
