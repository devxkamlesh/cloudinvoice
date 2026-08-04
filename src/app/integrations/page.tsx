import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, QrCode, WalletCards, FileText, BellRing, Zap, Globe2, LockKeyhole, Clock, Shield, Code } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Integrations — CloudInvoice",
  description: "Connect CloudInvoice with the payment methods and tools your business already uses. Built-in support for Stripe, UPI, and more coming soon.",
  alternates: { canonical: "/integrations" }
};

const activeIntegrations = [
  {
    name: "Stripe",
    icon: CreditCard,
    status: "Active",
    category: "Payment Gateway",
    description: "Accept card payments through Stripe Checkout with automatic payment confirmation via webhooks.",
    features: [
      "Secure card processing",
      "Automatic payment sync",
      "Webhook verification",
      "Multi-currency support"
    ]
  },
  {
    name: "UPI",
    icon: QrCode,
    status: "Active",
    category: "Payment Method",
    description: "Generate scannable UPI QR codes with pre-filled payment details. The payment goes straight to your UPI ID, so you confirm receipt yourself.",
    features: [
      "Auto-generated QR codes",
      "Pre-filled amounts",
      "All UPI apps supported",
      "Paid directly to your UPI ID"
    ]
  }
];

const roadmapIntegrations = [
  {
    name: "Razorpay",
    icon: WalletCards,
    category: "Payment Gateway",
    description: "Expand payment options with Razorpay's comprehensive Indian payment infrastructure.",
    eta: "Q3 2026"
  },
  {
    name: "Google Drive",
    icon: FileText,
    category: "File Storage",
    description: "Automatically backup invoice PDFs to your Google Drive workspace.",
    eta: "Q4 2026"
  },
  {
    name: "Slack",
    icon: BellRing,
    category: "Communication",
    description: "Receive real-time notifications for payment events and invoice status changes.",
    eta: "Q4 2026"
  },
  {
    name: "Zapier",
    icon: Zap,
    category: "Automation",
    description: "Connect CloudInvoice to thousands of apps with custom workflow automation.",
    eta: "Q1 2027"
  },
  {
    name: "Webhooks",
    icon: Globe2,
    category: "Developer Tools",
    description: "Build custom integrations with real-time event notifications to your endpoints.",
    eta: "Q1 2027"
  },
  {
    name: "REST API",
    icon: LockKeyhole,
    category: "Developer Tools",
    description: "Full programmatic access to create invoices, manage clients, and track payments.",
    eta: "Q1 2027"
  }
];

export default function IntegrationsPage() {
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
              Integrations with a point of view
            </h1>
            <p className="mt-6 text-xl leading-8 text-zinc-400">
              CloudInvoice connects with the payment methods your clients already understand. No imagined integration wall—just focused tools that work today, and transparency about what&apos;s next.
            </p>
          </div>
        </div>
      </section>

      {/* Active Integrations */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                ACTIVE INTEGRATIONS
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Working today
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              These payment methods are built in, tested, and ready to accept payments from your clients.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {activeIntegrations.map((integration) => (
              <article
                key={integration.name}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 transition-all duration-300 group-hover:border-zinc-600 group-hover:scale-110">
                    <integration.icon className="size-7 text-white" />
                  </div>
                  <span className="rounded-full border border-emerald-700 bg-emerald-900/50 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {integration.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {integration.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{integration.name}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{integration.description}</p>
                </div>

                <div className="mt-6 space-y-2">
                  {integration.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-zinc-400">
                      <CheckCircle2 className="size-4 shrink-0 text-zinc-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Integrations */}
      <section className="border-b border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-zinc-500" />
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                ON THE ROADMAP
              </p>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Coming soon
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              These integrations are being designed and built. Timeline estimates are transparent and will be updated as work progresses.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roadmapIntegrations.map((integration) => (
              <article
                key={integration.name}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg border border-zinc-800 bg-black transition-all duration-300 group-hover:border-zinc-700">
                    <integration.icon className="size-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-600">
                    {integration.eta}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    {integration.category}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{integration.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">{integration.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Philosophy */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Shield className="mx-auto size-12 text-white" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our integration philosophy
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              We build integrations that strengthen trust in the billing moment, not features that exist to fill a comparison chart. Every integration is evaluated against one question: does this make payment clearer or collection faster?
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <Shield className="size-6 text-white" />
              <h3 className="mt-4 font-semibold text-white">Security first</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Payment integrations use webhook verification and OAuth 2.0. Client data never leaves our infrastructure without your explicit action.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <Code className="size-6 text-white" />
              <h3 className="mt-4 font-semibold text-white">Developer ready</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                APIs and webhooks are documented, versioned, and designed to support custom workflows when the built-in features aren&apos;t enough.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <Clock className="size-6 text-white" />
              <h3 className="mt-4 font-semibold text-white">Honest timelines</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Roadmap dates are estimates, not promises. We update this page when priorities shift or timelines change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Need a specific integration?
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              We prioritize integrations based on real business needs. If you have a compelling use case, we&apos;d like to hear about it.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-in"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105"
              >
                Start using CloudInvoice
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
