import Link from "next/link";
import { PaymentStatus, PlatformRole } from "@prisma/client";
import { ArrowUpRight, Building2, FileText, ShieldCheck, UserMinus, UsersRound, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { formatDate, money } from "@/lib/utils";

export default async function AdminOverviewPage() {
  // Re-checked here, not inherited from the layout.
  await requireAdmin();

  const [users, suspended, admins, organizations, invoices, billed, collected, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { suspendedAt: { not: null } } }),
    prisma.user.count({ where: { platformRole: PlatformRole.ADMIN } }),
    prisma.organization.count(),
    prisma.invoice.count(),
    // Aggregate in the database rather than pulling rows and summing in JS, which
    // would stop working the moment the platform has real volume.
    prisma.invoice.aggregate({ _sum: { total: true } }),
    prisma.payment.aggregate({ where: { status: PaymentStatus.SUCCEEDED }, _sum: { amount: true } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true, platformRole: true, suspendedAt: true },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  const cards = [
    { label: "Users", value: String(users), hint: `${admins} admin${admins === 1 ? "" : "s"}`, icon: UsersRound },
    { label: "Suspended", value: String(suspended), hint: suspended === 0 ? "None" : "Access paused", icon: UserMinus },
    { label: "Workspaces", value: String(organizations), hint: "Across all users", icon: Building2 },
    { label: "Invoices", value: String(invoices), hint: "All statuses", icon: FileText },
    { label: "Total billed", value: money(billed._sum.total?.toString() ?? 0), hint: "Sum of invoice totals", icon: FileText },
    { label: "Total collected", value: money(collected._sum.amount?.toString() ?? 0), hint: "Confirmed payments only", icon: Wallet }
  ];

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-muted-foreground">PLATFORM</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Administration</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Figures cover every workspace on this deployment. Amounts are summed across currencies without conversion, so treat them as volume rather than a consolidated total.
        </p>
      </div>

      <section aria-label="Platform totals" className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, hint, icon: Icon }) => (
          <article key={label} className="surface rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <Icon className="size-5 text-primary" aria-hidden="true" />
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </article>
        ))}
      </section>

      <section className="surface mt-7 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <div>
            <h2 className="font-semibold">Newest accounts</h2>
            <p className="mt-1 text-sm text-muted-foreground">The eight most recent signups.</p>
          </div>
          <Link href="/admin/users" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            All users <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {recentUsers.length === 0 ? (
          <p className="border-t px-5 py-12 text-center text-sm text-muted-foreground">No accounts yet.</p>
        ) : (
          <div className="overflow-x-auto border-t">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Most recently created accounts</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Name</th>
                  <th scope="col" className="px-5 py-3 font-medium">Email</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-t">
                    <th scope="row" className="px-5 py-4 text-left font-medium">{user.name}</th>
                    <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-4">
                      {user.suspendedAt ? (
                        <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">Suspended</span>
                      ) : user.platformRole === PlatformRole.ADMIN ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          <ShieldCheck className="size-3" aria-hidden="true" />Admin
                        </span>
                      ) : (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">Active</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
