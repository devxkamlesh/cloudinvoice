import type { Metadata } from "next";
import { Activity, CheckCircle2, Clock3, Database, Server } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Service status",
  description: "A live application and database reachability check for CloudInvoice.",
  alternates: { canonical: "/status" },
};

export const dynamic = "force-dynamic";

export default async function StatusPage() {
  const checkedAt = new Date();
  let databaseHealthy = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseHealthy = true;
  } catch {
    databaseHealthy = false;
  }

  const checks = [
    { icon: Server, name: "Web application", detail: "This page was rendered successfully by the CloudInvoice application.", healthy: true },
    { icon: Database, name: "Primary database", detail: databaseHealthy ? "The application completed a live database query." : "The application could not complete its database reachability check.", healthy: databaseHealthy },
  ];
  const healthy = checks.every((check) => check.healthy);

  return (
    <MarketingShell>
      <main id="main-content" className="min-h-[70vh]">
        <section className="marketing-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="marketing-kicker">Service status</p>
              <h1 className="marketing-title mt-4">A small, verifiable health check.</h1>
              <p className="marketing-copy mt-6">CloudInvoice does not currently publish historical uptime percentages. This page reports only checks performed while the page is requested.</p>
            </div>

            <div className={`mt-12 rounded-2xl border p-6 sm:p-8 ${healthy ? "border-emerald-500/25 bg-emerald-500/[.07]" : "border-amber-500/30 bg-amber-500/[.08]"}`}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${healthy ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"}`}>
                  {healthy ? <CheckCircle2 className="size-6" /> : <Activity className="size-6" />}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-[-.035em]">{healthy ? "Live checks passed" : "A live check needs attention"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Checked at {checkedAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "medium" })} IST</p>
                </div>
              </div>
            </div>

            <section aria-label="Current checks" className="mt-6 grid gap-4 sm:grid-cols-2">
              {checks.map(({ icon: Icon, name, detail, healthy: checkHealthy }) => (
                <article key={name} className="marketing-card rounded-xl p-6">
                  <div className="flex items-start justify-between gap-5">
                    <span className="grid size-10 place-items-center rounded-lg bg-muted text-foreground"><Icon className="size-5" /></span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${checkHealthy ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-800 dark:text-amber-300"}`}>{checkHealthy ? "Reachable" : "Unavailable"}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{name}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{detail}</p>
                </article>
              ))}
            </section>

            <div className="mt-10 flex gap-3 rounded-xl bg-muted p-5 text-sm leading-7 text-muted-foreground">
              <Clock3 className="mt-1 size-5 shrink-0 text-primary" />
              <p>No synthetic 90-day history is shown. Incident history, external probes, and measured availability will be added only after they are backed by an independent monitoring source.</p>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
