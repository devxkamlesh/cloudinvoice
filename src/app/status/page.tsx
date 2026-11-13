import type { Metadata } from "next";
import { SystemStatus } from "@prisma/client";
import { Activity, CheckCircle2, Clock3, Database, Server } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Service status",
  description: "A live application and database reachability check for CloudInvoice.",
  alternates: { canonical: "/status" },
};

export const dynamic = "force-dynamic";

const DATABASE_CHECK_TIMEOUT_MS = 4_000;
const SNAPSHOT_REFRESH_MS = 5 * 60 * 1_000;
const LIVE_SIGNAL_BARS = 48;

const snapshotComponents = [
  {
    name: "Web Application",
    slug: "web-app",
    description: "CloudInvoice web interface and dashboard",
    icon: "Server",
    order: 1,
  },
  {
    name: "Database",
    slug: "database",
    description: "PostgreSQL database services",
    icon: "Database",
    order: 3,
  },
] as const;

// Keep the public page responsive when no database is configured or the host cannot
// be reached. Prisma does not expose an AbortSignal for this query, so the timeout
// bounds the page wait while the underlying connection attempt settles separately.
async function checkDatabaseReachability() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Database check timed out")), DATABASE_CHECK_TIMEOUT_MS);
      }),
    ]);
    return true;
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// The existing SystemComponent table is a bounded latest-state snapshot, not uptime
// history. Rows are self-created and refreshed at most every five minutes (or when a
// state changes), so public visits cannot grow the database without limit.
async function persistOperationalSnapshot(checkedAt: Date) {
  const staleBefore = new Date(checkedAt.getTime() - SNAPSHOT_REFRESH_MS);

  try {
    await prisma.$transaction([
      prisma.systemComponent.createMany({
        data: snapshotComponents.map((component) => ({
          ...component,
          status: SystemStatus.OPERATIONAL,
        })),
        skipDuplicates: true,
      }),
      ...snapshotComponents.map((component) =>
        prisma.systemComponent.updateMany({
          where: {
            slug: component.slug,
            OR: [
              { status: { not: SystemStatus.OPERATIONAL } },
              { updatedAt: { lte: staleBefore } },
            ],
          },
          data: { status: SystemStatus.OPERATIONAL },
        }),
      ),
    ]);
  } catch {
    // Snapshot persistence must never turn a successful live check into a failed page.
    // Prisma already emits the underlying error through the configured server logger.
  }
}

function StatusPill({ healthy, label }: { healthy: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[.65rem] font-bold uppercase tracking-[.08em] ${healthy ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"}`}>
      <span className={`size-1.5 rounded-full ${healthy ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function LiveSignal({ healthy, name }: { healthy: boolean; name: string }) {
  return (
    <div className="mt-6" aria-label={`${name} current live probe: ${healthy ? "reachable" : "unavailable"}`}>
      <div className="flex h-9 items-stretch gap-[3px] overflow-hidden" aria-hidden="true">
        {Array.from({ length: LIVE_SIGNAL_BARS }, (_, index) => (
          <span
            key={index}
            className={`status-signal-bar min-w-[3px] flex-1 rounded-[2px] ${healthy ? "bg-emerald-500" : "bg-amber-500"}`}
            style={{ animationDelay: `${index * 45 - 1_600}ms` }}
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-4 font-mono text-[.65rem] font-medium uppercase tracking-[.08em] text-muted-foreground">
        <span>Live probe</span>
        <span className="h-px bg-border" aria-hidden="true" />
        <span>Now</span>
      </div>
    </div>
  );
}

export default async function StatusPage() {
  const checkedAt = new Date();
  const databaseHealthy = await checkDatabaseReachability();

  if (databaseHealthy) {
    await persistOperationalSnapshot(checkedAt);
  }

  const checks = [
    {
      icon: Server,
      name: "Web application",
      detail: "This page was rendered successfully by the CloudInvoice application.",
      healthy: true,
    },
    {
      icon: Database,
      name: "Primary database",
      detail: databaseHealthy
        ? "The application completed a live database query."
        : "The application could not complete its database reachability check.",
      healthy: databaseHealthy,
    },
  ];
  const passingChecks = checks.filter((check) => check.healthy).length;
  const checksNeedingAttention = checks.length - passingChecks;
  const healthy = checksNeedingAttention === 0;
  const checkedAtLabel = checkedAt.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "medium",
  });

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

            <section aria-label="Current checks" className="surface mt-12 overflow-hidden rounded-2xl">
              <div className={`h-1.5 ${healthy ? "bg-emerald-500" : "bg-amber-500"}`} aria-hidden="true" />

              <header className="relative isolate overflow-hidden border-b bg-muted/35 px-6 py-7 sm:px-8 sm:py-8">
                <div className="marketing-grid pointer-events-none absolute inset-0 -z-10 opacity-30" aria-hidden="true" />
                <div className="marketing-halo pointer-events-none absolute -right-24 -top-28 -z-10 size-72 rounded-full blur-2xl" aria-hidden="true" />

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <span className={`relative grid size-12 shrink-0 place-items-center rounded-xl shadow-sm ${healthy ? "bg-emerald-500 text-white" : "bg-amber-500 text-slate-950"}`}>
                      {healthy ? <CheckCircle2 className="size-6" /> : <Activity className="size-6" />}
                      <span className="absolute -right-1 -top-1 flex size-3" aria-hidden="true">
                        <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-70 motion-reduce:animate-none ${healthy ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span className={`relative inline-flex size-3 rounded-full border-2 border-card ${healthy ? "bg-emerald-500" : "bg-amber-500"}`} />
                      </span>
                    </span>
                    <div>
                      <p className="font-mono text-[.68rem] font-bold uppercase tracking-[.15em] text-primary">Live system checks</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em] text-foreground sm:text-3xl">
                        {healthy ? "All systems operational" : `${checksNeedingAttention} check needs attention`}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">{passingChecks} of {checks.length} checks passing · Checked {checkedAtLabel} IST</p>
                    </div>
                  </div>
                  <StatusPill healthy={healthy} label={healthy ? "Operational" : "Degraded"} />
                </div>
              </header>

              <ul className="divide-y">
                {checks.map(({ icon: Icon, name, detail, healthy: checkHealthy }) => (
                  <li key={name} className="px-6 py-7 sm:px-8 sm:py-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
                        <div className="min-w-0">
                          <h3 className="font-semibold tracking-[-.01em] text-foreground">{name}</h3>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</p>
                        </div>
                      </div>
                      <div className="shrink-0 sm:ms-5">
                        <StatusPill healthy={checkHealthy} label={checkHealthy ? "Reachable" : "Unavailable"} />
                      </div>
                    </div>
                    <LiveSignal healthy={checkHealthy} name={name} />
                  </li>
                ))}
              </ul>

              <footer className="grid gap-3 border-t bg-muted/35 px-6 py-5 sm:grid-cols-[auto_1fr] sm:px-8">
                <span className="grid size-9 place-items-center rounded-lg bg-card text-primary shadow-sm"><Clock3 className="size-4" /></span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Live activity, not synthetic history</p>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">The animated bars represent this request&apos;s live probe, not a claimed uptime period. Current snapshots are stored when the database is available; historical bars will appear only after independent monitoring is connected.</p>
                </div>
              </footer>
            </section>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
