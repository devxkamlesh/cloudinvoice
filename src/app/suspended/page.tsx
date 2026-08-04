import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SUPPORT_EMAIL, mailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Account suspended",
  // Not a page that should ever surface in search results.
  robots: { index: false, follow: false }
};

export default function SuspendedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted p-6">
      <section className="surface w-full max-w-lg rounded-2xl p-7 sm:p-10">
        <Logo />

        <span className="mt-9 grid size-12 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <ShieldAlert className="size-6" aria-hidden="true" />
        </span>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight">This account is suspended</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Access to your workspace is paused, so invoices and client records cannot be opened or changed right now.
        </p>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Nothing has been deleted. Your workspace, invoices, clients, and payment history are all intact, and access can be restored.
        </p>

        <div className="mt-7 rounded-xl border bg-card p-4">
          <p className="text-sm font-medium">Think this is a mistake?</p>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Reply from the email address on the account and mention the business name so it can be found quickly.
          </p>
          <a
            href={mailto(SUPPORT_EMAIL, "Suspended CloudInvoice account")}
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>

        <Link href="/" className="mt-7 inline-flex text-sm text-muted-foreground hover:text-foreground">
          Back to cloudinvoice.co.in
        </Link>
      </section>
    </main>
  );
}
