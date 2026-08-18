import type { Metadata } from "next";
import { BadgeCheck, Brush, ShieldCheck, Trash2 } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Verified changes currently present in the CloudInvoice product.",
  alternates: { canonical: "/changelog" },
};

const currentChanges = [
  { icon: Brush, title: "A unified light and dark interface", text: "The public website and authenticated workspace now share a restrained type-led design system with responsive navigation and persistent theme selection." },
  { icon: BadgeCheck, title: "MSME registration published", text: "The footer and trust center now display Udyam Registration Number UDYAM-RJ-17-0675217." },
  { icon: Trash2, title: "Legacy AI and infrastructure material removed", text: "Unused invoice-generation code and obsolete provider-specific deployment documentation were removed from the active project." },
  { icon: ShieldCheck, title: "Public claims tightened", text: "Status, customer, integration, and product copy now distinguish current functionality from configuration requirements and future direction." },
];

export default function ChangelogPage() {
  return (
    <MarketingShell>
      <main id="main-content">
        <section className="marketing-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl"><p className="marketing-kicker">Changelog</p><h1 className="marketing-title mt-4">Changes that can be verified in the current product.</h1><p className="marketing-copy mt-6">CloudInvoice does not publish invented version history or performance percentages. This page lists meaningful changes present in the running build.</p></div>

            <div className="mt-14 divide-y border-y">
              {currentChanges.map(({ icon: Icon, title, text }) => <article key={title} className="grid gap-5 py-7 sm:grid-cols-[3rem_1fr]"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div></article>)}
            </div>

            <section className="mt-16 rounded-2xl border bg-card p-6 sm:p-9">
              <p className="marketing-kicker">Product direction</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-.045em]">Planned, without a promised quarter.</h2>
              <p className="mt-5 max-w-3xl leading-8 text-muted-foreground">Recurring invoices, payment reminders, team invitations, bulk exports, and a supported public API remain product directions. They are not presented as available features and do not have a committed public delivery date.</p>
            </section>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
