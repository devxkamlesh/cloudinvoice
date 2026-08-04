import type { Metadata } from "next";
import { Prisma, PlatformRole } from "@prisma/client";
import { Search, ShieldCheck } from "lucide-react";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Users" };

const PAGE_SIZE = 25;

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}) {
  const admin = await requireAdmin();
  const params = await searchParams;

  const query = (params.q ?? "").trim();
  const filter = params.filter === "suspended" || params.filter === "admins" ? params.filter : "all";
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  // Prisma builds a parameterised query from this, so the search term is never
  // interpolated into SQL.
  const where: Prisma.UserWhereInput = {
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(filter === "suspended" ? { suspendedAt: { not: null } } : {}),
    ...(filter === "admins" ? { platformRole: PlatformRole.ADMIN } : {})
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        platformRole: true,
        suspendedAt: true,
        createdAt: true,
        _count: { select: { memberships: true, sessions: true } }
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    })
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const tab = (value: string, label: string) => {
    const active = filter === value;
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (value !== "all") search.set("filter", value);
    const href = `/admin/users${search.toString() ? `?${search}` : ""}`;
    return (
      <Button key={value} asChild variant={active ? "secondary" : "ghost"} size="sm">
        <a href={href} aria-current={active ? "page" : undefined}>{label}</a>
      </Button>
    );
  };

  return (
    <main className="mx-auto max-w-7xl p-5 sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">PLATFORM</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {total} account{total === 1 ? "" : "s"} matching this view. Suspension pauses access without deleting anything.
          </p>
        </div>
      </div>

      {/* GET form so the search term lives in the URL and stays shareable. */}
      <form method="get" action="/admin/users" className="mt-6 flex flex-wrap items-center gap-2">
        {filter !== "all" && <input type="hidden" name="filter" value={filter} />}
        <label htmlFor="q" className="sr-only">Search users by name or email</label>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input id="q" name="q" defaultValue={query} placeholder="Name or email" className="pl-9" />
        </div>
        <Button type="submit" variant="outline">Search</Button>
        <span className="ml-auto flex gap-1">{[tab("all", "All"), tab("admins", "Admins"), tab("suspended", "Suspended")]}</span>
      </form>

      <section className="surface mt-6 overflow-hidden rounded-2xl">
        {users.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-muted-foreground">No accounts match this view.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <caption className="sr-only">Platform users with role, status, and available actions</caption>
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Account</th>
                  <th scope="col" className="px-5 py-3 font-medium">Role</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">Workspaces</th>
                  <th scope="col" className="px-5 py-3 font-medium">Joined</th>
                  <th scope="col" className="px-5 py-3 font-medium"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === admin.id;
                  return (
                    <tr key={user.id} className="border-t align-middle">
                      <th scope="row" className="px-5 py-4 text-left font-normal">
                        <span className="font-medium">{user.name}</span>
                        {isSelf && <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs font-medium">You</span>}
                        <span className="mt-0.5 block text-xs text-muted-foreground">{user.email}</span>
                      </th>
                      <td className="px-5 py-4">
                        {user.platformRole === PlatformRole.ADMIN ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            <ShieldCheck className="size-3" aria-hidden="true" />Admin
                          </span>
                        ) : (
                          <span className="text-muted-foreground">User</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {user.suspendedAt ? (
                          <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                            Suspended {formatDate(user.suspendedAt)}
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Active</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">{user._count.memberships}</td>
                      <td className="px-5 py-4 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        <UserRowActions
                          userId={user.id}
                          name={user.name}
                          isSelf={isSelf}
                          isAdmin={user.platformRole === PlatformRole.ADMIN}
                          isSuspended={Boolean(user.suspendedAt)}
                        />
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
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <a href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }), ...(filter !== "all" && { filter }), page: String(page - 1) })}`}>Previous</a>
              </Button>
            )}
            {page < pages && (
              <Button asChild variant="outline" size="sm">
                <a href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }), ...(filter !== "all" && { filter }), page: String(page + 1) })}`}>Next</a>
              </Button>
            )}
          </span>
        </nav>
      )}
    </main>
  );
}
