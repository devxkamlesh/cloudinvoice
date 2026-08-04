import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck, LockKeyhole, Globe2, Eye, Database, UserCheck, Clock, CheckCircle2 } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Our Customer Commitment — CloudInvoice",
  description: "How CloudInvoice protects your data, respects your privacy, and earns trust through transparent security practices.",
  alternates: { canonical: "/customers" }
};

const securityPrinciples = [
  {
    icon: ShieldCheck,
    title: "Payment verification at the source",
    description: "CloudInvoice never marks an invoice paid based on a client visiting a confirmation page. Payment state changes only after receiving and verifying a signed webhook from Stripe. This prevents false positives and ensures your revenue data reflects reality."
  },
  {
    icon: LockKeyhole,
    title: "Tenant-scoped data isolation",
    description: "Your invoices, clients, and payment data are scoped to your organization. Database queries enforce tenant boundaries at the ORM level, preventing cross-workspace data leakage even in the presence of application bugs."
  },
  {
    icon: Globe2,
    title: "Private payment links",
    description: "Public invoice payment pages use high-entropy cryptographic tokens instead of sequential IDs or guessable patterns. Client payment pages cannot be enumerated or discovered without the unique link you share."
  },
  {
    icon: Eye,
    title: "Minimal data collection",
    description: "CloudInvoice collects only the data needed to generate invoices and process payments. We don&apos;t track client behavior, sell data to third parties, or use your business information for ad targeting."
  },
  {
    icon: Database,
    title: "Transparent data boundaries",
    description: "Your invoice and client data stays within our production database. Backups are encrypted at rest. We don&apos;t share customer data with analytics platforms or third-party tools unless explicitly documented."
  },
  {
    icon: UserCheck,
    title: "Authentication and access control",
    description: "CloudInvoice uses industry-standard OAuth 2.0 flows and secure session management. Multi-factor authentication and role-based permissions are on the roadmap for team workspaces."
  }
];

const commitments = [
  {
    title: "We won&apos;t manufacture social proof",
    description: "Customer testimonials and case studies will be published only with explicit written permission. Until we earn those stories, we&apos;d rather show you how we protect your data and respect your business."
  },
  {
    title: "We won&apos;t hide behind vague claims",
    description: "Security and privacy statements are concrete and specific. If we can&apos;t explain a practice clearly, we revisit the practice—not the explanation."
  },
  {
    title: "We won&apos;t lock you in",
    description: "You own your data. Export your invoices, client records, and payment history at any time. No restrictions, no expired access windows, no hostage fees."
  },
  {
    title: "We won&apos;t change terms retroactively",
    description: "Material changes to privacy or security practices are announced in advance. Existing users have time to review, export data, and decide whether to continue."
  }
];

export default function CustomersPage() {
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
              Trust should be earned, not invented
            </h1>
            <p className="mt-6 text-xl leading-8 text-zinc-400">
              CloudInvoice is being built to deserve strong recommendations from independent businesses. Until customer stories are published with permission, we would rather show you how the product protects the billing moment.
            </p>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              HOW WE PROTECT YOUR BUSINESS
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Security and privacy by design
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              These aren&apos;t marketing claims. They&apos;re architectural decisions that shape how CloudInvoice handles your data at every layer.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {securityPrinciples.map((principle) => (
              <article
                key={principle.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex size-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 transition-all duration-300 group-hover:border-zinc-600 group-hover:scale-110">
                  <principle.icon className="size-6 text-white" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-white">{principle.title}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="border-b border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              OUR COMMITMENTS TO YOU
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How we operate
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              CloudInvoice is built on principles that respect your business, your data, and your time. These commitments aren&apos;t negotiable.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {commitments.map((commitment, index) => (
              <article
                key={commitment.title}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{commitment.title}</h3>
                    <p className="mt-2 leading-7 text-zinc-400">{commitment.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Data Ownership */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                YOUR DATA, YOUR CONTROL
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Full data portability
              </h2>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                CloudInvoice never holds your data hostage. Export everything at any time, in standard formats that work with spreadsheets, accounting software, and your own backup systems.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-white" />
                  <div>
                    <p className="font-semibold text-white">Export all invoices</p>
                    <p className="mt-1 text-sm text-zinc-400">PDF and CSV formats, complete history</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-white" />
                  <div>
                    <p className="font-semibold text-white">Export client data</p>
                    <p className="mt-1 text-sm text-zinc-400">Names, addresses, GST details, payment history</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-white" />
                  <div>
                    <p className="font-semibold text-white">Export payment records</p>
                    <p className="mt-1 text-sm text-zinc-400">Transaction logs, timestamps, amounts, status</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 size-5 shrink-0 text-white" />
                  <div>
                    <p className="font-semibold text-white">Delete your account</p>
                    <p className="mt-1 text-sm text-zinc-400">Complete removal, no retention beyond legal requirements</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
              <Database className="size-10 text-white" />
              <h3 className="mt-6 text-xl font-bold text-white">Data retention policy</h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-400">
                <p>
                  <strong className="text-white">Active accounts:</strong> Your data is retained as long as your workspace is active. You control when and how it&apos;s deleted.
                </p>
                <p>
                  <strong className="text-white">Closed accounts:</strong> Data is permanently deleted within 30 days of account closure, except where legal or regulatory requirements mandate longer retention (tax records, payment logs).
                </p>
                <p>
                  <strong className="text-white">Backups:</strong> Encrypted backups are retained for 90 days for disaster recovery, then automatically purged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section className="border-b border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Clock className="mx-auto size-12 text-white" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Real customers, real stories
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              CloudInvoice is in active use by independent businesses today. As we grow and earn permission to share their experiences, this page will feature genuine case studies and testimonials. Until then, the product&apos;s security and design speak for themselves.
            </p>
            <p className="mt-6 text-sm text-zinc-500">
              If you&apos;re a CloudInvoice user and would like to share your experience, we&apos;d be honored. Reach out through your workspace settings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See how we protect your business
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Try CloudInvoice and experience the difference that security by design and honest communication make.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-in"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105"
              >
                Create your workspace
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/security"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                Read security details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
