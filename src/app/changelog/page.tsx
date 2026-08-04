import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Wrench, Bug, Zap } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Changelog — CloudInvoice",
  description: "See what changed, what is shipping, and what is being improved in CloudInvoice. Transparent product updates and feature releases.",
  alternates: { canonical: "/changelog" }
};

const releases = [
  {
    version: "v1.2.0",
    date: "2026-07-28",
    status: "Latest",
    changes: [
      {
        type: "feature",
        icon: Sparkles,
        title: "Midnight invoice template",
        description: "Added dark theme invoice template for businesses with modern brand identities. Full customization support included."
      },
      {
        type: "feature",
        icon: CheckCircle2,
        title: "Batch invoice export",
        description: "Export multiple invoices as PDFs or CSV in one action. Useful for month-end reconciliation and client reporting."
      },
      {
        type: "improvement",
        icon: Zap,
        title: "Faster payment page loading",
        description: "Reduced client-facing payment page load time by 40% through optimized asset delivery and edge caching."
      },
      {
        type: "fix",
        icon: Bug,
        title: "GST calculation edge case",
        description: "Fixed rounding error in IGST calculation for invoices with fractional quantities and high-precision unit prices."
      }
    ]
  },
  {
    version: "v1.1.0",
    date: "2026-06-15",
    changes: [
      {
        type: "feature",
        icon: Sparkles,
        title: "UPI QR code generation",
        description: "Automatically generate scannable UPI QR codes on invoice payment pages. Amount and UPI ID are pre-filled for instant mobile payments."
      },
      {
        type: "feature",
        icon: CheckCircle2,
        title: "Client portal improvements",
        description: "Added invoice history view for returning clients. They can now see all past invoices and payment status at a glance."
      },
      {
        type: "improvement",
        icon: Zap,
        title: "Invoice template customization",
        description: "Expanded template customization options. Business logo, accent colors, and custom fields now supported across all templates."
      }
    ]
  },
  {
    version: "v1.0.0",
    date: "2026-05-01",
    changes: [
      {
        type: "feature",
        icon: Sparkles,
        title: "CloudInvoice launches",
        description: "Initial release with core invoicing, GST calculation, Stripe payments, client management, and revenue analytics."
      },
      {
        type: "feature",
        icon: CheckCircle2,
        title: "Three invoice templates",
        description: "Classic, Modern, and Pro templates available at launch. Each designed for clarity and professional presentation."
      },
      {
        type: "feature",
        icon: Sparkles,
        title: "Private payment pages",
        description: "Secure, tokenized payment links for client invoice viewing and payment. No account required for clients."
      }
    ]
  }
];

const roadmapItems = [
  {
    title: "Recurring invoices",
    description: "Schedule invoices to be automatically generated and sent on a recurring basis for retainer and subscription work.",
    eta: "Q3 2026"
  },
  {
    title: "Multi-currency support",
    description: "Invoice in USD, EUR, GBP, and other currencies. Automatic conversion and display of amounts in client currency.",
    eta: "Q3 2026"
  },
  {
    title: "Payment reminders",
    description: "Automated email reminders for overdue invoices. Configurable timing and messaging to match your communication style.",
    eta: "Q4 2026"
  },
  {
    title: "Team workspaces",
    description: "Collaborate with team members on invoicing. Role-based permissions, activity logs, and shared client database.",
    eta: "Q4 2026"
  }
];

function ChangeIcon({ type }: { type: string }) {
  switch (type) {
    case "feature":
      return <Sparkles className="size-5 text-white" />;
    case "improvement":
      return <Zap className="size-5 text-white" />;
    case "fix":
      return <Bug className="size-5 text-white" />;
    default:
      return <CheckCircle2 className="size-5 text-white" />;
  }
}

export default function ChangelogPage() {
  return (
    <MarketingShell>
      {/* Header */}
      <section className="relative border-b border-zinc-800 bg-[#0a0a0a] py-20 sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-all duration-300 hover:text-white hover:gap-3"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Changelog
            </h1>
            <p className="mt-6 text-xl leading-8 text-zinc-400">
              See what changed, what is shipping, and what is being improved. Transparent product updates and feature releases.
            </p>
          </div>
        </div>
      </section>

      {/* Releases */}
      <section className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="space-y-16">
            {releases.map((release, releaseIndex) => (
              <article key={release.version} className="relative">
                {/* Version Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-white">{release.version}</h2>
                      {release.status && (
                        <span className="rounded-full border border-emerald-700 bg-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-300">
                          {release.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(release.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Changes */}
                <div className="mt-8 space-y-6">
                  {release.changes.map((change, changeIndex) => (
                    <div
                      key={changeIndex}
                      className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 transition-all duration-300 group-hover:scale-110">
                          <ChangeIcon type={change.type} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{change.title}</h3>
                            <span className={
                              change.type === "feature"
                                ? "rounded-full bg-blue-900/50 px-2 py-0.5 text-xs font-semibold text-blue-300"
                                : change.type === "improvement"
                                ? "rounded-full bg-purple-900/50 px-2 py-0.5 text-xs font-semibold text-purple-300"
                                : "rounded-full bg-orange-900/50 px-2 py-0.5 text-xs font-semibold text-orange-300"
                            }>
                              {change.type}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-zinc-400">
                            {change.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Connector Line */}
                {releaseIndex < releases.length - 1 && (
                  <div className="ml-5 mt-8 h-12 w-px bg-gradient-to-b from-zinc-700 to-transparent" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-t border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              WHAT&apos;S NEXT
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Upcoming features
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Features we&apos;re actively building or planning. Timeline estimates are transparent and will be updated as work progresses.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
            {roadmapItems.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className="text-xs font-semibold text-zinc-600">{item.eta}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Notice */}
      <section className="border-t border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Wrench className="mx-auto size-12 text-white" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay updated
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              All product updates are announced to active CloudInvoice users via email. Create a workspace to receive release notifications and feature updates.
            </p>
            <div className="mt-10">
              <Link
                href="/sign-in"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105"
              >
                Start using CloudInvoice
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
