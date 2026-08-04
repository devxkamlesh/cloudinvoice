import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { Button } from "@/components/ui/button";
import { formatDate, money } from "@/lib/utils";

export const metadata: Metadata = { title: "Workspaces" };

const PAGE_SIZE = 25;

export default async function AdminOrganizationsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const [total, organizations] = await Promise.all([
    prisma.organization.count(),
    prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        currency: true,
        gstin: true,
        createdAt: true,
        _count: { select: { memberships: true, clients: true, invoices: true } },
        // Owner contact, for support requests that arrive without a workspace name.
        memberships: {
          select: { user: { select: { email: true } } },
          orderBy: { createdAt: "asc" },
          take: 1
        }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  // Billed totals per workspace in one grouped query rather than a query per row.
  const billed = await prisma.invoice.groupBy({
    by: ["organizationId"],
    where: { organizationId: { in: organizations.map((organization) => organization.id) } },
    _sum: { total: true }
  });
  const billedBy = new Map(billed.map((row) => [row.organizationId, row._sum.total]));

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-7">
      <div>
        <p className="text-sm font-medium text-muted-foreground">PLATFORM</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Workspaces</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {total} workspace{total === 1 ? "" : "s"}. This view is read-only — a workspace holds a tenant&rsquo;s financial records, so removal is not a one-click operation.
        </p>
      </div>

      <section className="surface mt-6 overflow-hidden rounded-2xl">
        {organizations.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-primary">
              <Building2 className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">No workspaces have been created yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <caption className="sr-only">All workspaces with member, client, and invoice counts</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Workspace</th>
                  <th scope="col" className="px-5 py-3 font-medium">Owner</th>
                  <th scope="col" className="px-5 py-3 font-medium">GSTIN</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Members</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Clients</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Invoices</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Billed</th>
                  <th scope="col" className="px-5 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((organization) => (
                  <tr key={organization.id} className="border-t">
                    <th scope="row" className="px-5 py-4 text-left font-normal">
                      <span className="font-medium">{organization.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-muted-foreground">{organization.slug}</span>
                    </th>
                    <td className="px-5 py-4 text-muted-foreground">{organization.memberships[0]?.user.email ?? "—"}</td>
                    <td className="px-5 py-4 font-mono text-xs">{organization.gstin ?? "—"}</td>
                    <td className="px-5 py-4 text-right">{organization._count.memberships}</td>
                    <td className="px-5 py-4 text-right">{organization._count.clients}</td>
                    <td className="px-5 py-4 text-right">{organization._count.invoices}</td>
                    <td className="px-5 py-4 text-right font-medium">
                      {money(billedBy.get(organization.id)?.toString() ?? 0, organization.currency)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{formatDate(organization.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground">Page {page} of {pages}</p>
          <span className="flex gap-2">
            {page > 1 && <Button asChild variant="outline" size="sm"><a href={`/admin/organizations?page=${page - 1}`}>Previous</a></Button>}
            {page < pages && <Button asChild variant="outline" size="sm"><a href={`/admin/organizations?page=${page + 1}`}>Next</a></Button>}
          </span>
        </nav>
      )}
    </main>
  );
}
