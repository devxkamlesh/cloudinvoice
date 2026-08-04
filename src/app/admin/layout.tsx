import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/authz";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | CloudInvoice admin" },
  robots: { index: false, follow: false }
};

/**
 * Admin shell.
 *
 * The guard here is a backstop, not the protection. Each page and each action calls
 * requireAdmin() for itself, because a layout does not run for server action requests
 * and Next.js does not guarantee layouts re-render on every navigation.
 *
 * requireAdmin responds 404 for a non-admin, so this area does not confirm it exists.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-4">
            <Link href="/admin" aria-label="CloudInvoice admin home"><Logo /></Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-800">
              <ShieldCheck className="size-3.5" aria-hidden="true" />Admin
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{admin.email}</span>
            <Link href="/dashboard" className="font-semibold text-primary hover:underline">Exit to app</Link>
          </div>
        </div>
        <AdminNav />
      </header>

      {children}
    </div>
  );
}
