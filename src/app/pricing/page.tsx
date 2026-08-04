import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { marketingFaqs } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Pricing — CloudInvoice",
  description: "Straightforward plans for independent businesses. Start free, upgrade when the work demands it. GST-ready invoicing with no pricing maze.",
  alternates: { canonical: "/pricing" }
};

// Figures mirror src/components/marketing/pricing-preview.tsx. Keep both in sync.
const plans = [
  {
    name: "Starter",
    monthly: "₹0",
    annual: "₹0",
    note: "For your first professional invoices",
    action: "Start free",
    href: "/sign-in",
    features: [
      "Core invoice creation",
      "GST calculation (CGST, SGST, IGST)",
      "Client directory",
      "Classic invoice template",
      "Private client payment pages"
    ]
  },
  {
    name: "Studio",
    monthly: "₹799",
    annual: "₹639",
    note: "For independent professionals building momentum",
    action: "Start free",
    href: "/sign-in",
    featured: true,
    features: [
      "Everything in Starter",
      "Payment collection via Stripe and UPI",
      "Revenue analytics",
      "All three invoice templates",
      "Payment status tracking"
    ]
  },
  {
    name: "Business",
    monthly: "₹1,999",
    annual: "₹1,599",
    note: "For a more connected billing operation",
    action: "Start free",
    href: "/sign-in",
    features: [
      "Everything in Studio",
      "Advanced invoice controls",
      "Priority support",
      "Batch invoice export",
      "Custom fields and branding"
    ]
  }
];

const comparison = [
  { feature: "Invoices per month", starter: "Unlimited", studio: "Unlimited", business: "Unlimited" },
  { feature: "GST calculation", starter: true, studio: true, business: true },
  { feature: "Client directory", starter: true, studio: true, business: true },
  { feature: "Private payment pages", starter: true, studio: true, business: true },
  { feature: "Stripe Checkout", starter: false, studio: true, business: true },
  { feature: "UPI QR payments", starter: false, studio: true, business: true },
  { feature: "Revenue analytics", starter: false, studio: true, business: true },
  { feature: "Invoice templates", starter: "Classic", studio: "All three", business: "All three" },
  { feature: "Batch export", starter: false, studio: false, business: true },
  { feature: "Priority support", starter: false, studio: false, business: true }
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="mx-auto size-4 text-white" aria-label="Included" />;
  if (value === false) return <span className="text-zinc-600" aria-label="Not included">—</span>;
  return <span className="text-zinc-300">{value}</span>;
}

export default function PricingPage() {
  return (
    <MarketingShell>
      {/* Header */}
      <section className="relative border-b border-zinc-800 bg-[#0a0a0a] py-20 sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-all duration-300 hover:gap-3 hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">PRICING</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Start with clarity. Upgrade when the work demands it.
            </h1>
            <p className="mt-6 text-xl leading-8 text-zinc-400">
              No pricing maze and no per-invoice surcharges. Pick the level of control that fits your business today.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={
                  plan.featured
                    ? "relative rounded-2xl border border-zinc-700 bg-zinc-800 p-8 transition-all duration-300 hover:border-zinc-600"
                    : "relative rounded-2xl border border-zinc-800 bg-zinc-900 p-8 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-400">{plan.note}</p>
                  </div>
                  {plan.featured && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-600 bg-zinc-700 px-2.5 py-1 text-xs font-semibold text-white">
                      <Sparkles className="size-3" />
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <span className="text-4xl font-bold tracking-tight text-white">{plan.monthly}</span>
                  {plan.monthly !== "₹0" && <span className="ml-1 text-sm text-zinc-500">/ month</span>}
                  {plan.monthly !== "₹0" && (
                    <p className="mt-2 text-xs text-zinc-500">{plan.annual} / month billed yearly, saving 20%</p>
                  )}
                </div>

                <Link
                  href={plan.href}
                  className={
                    plan.featured
                      ? "group mt-8 flex h-12 items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100"
                      : "group mt-8 flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-black text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900"
                  }
                >
                  {plan.action}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <ul className="mt-8 space-y-3 border-t border-zinc-800 pt-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-300">
                      <Check className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Paid-plan checkout is not enabled yet. Every workspace starts free today, and launch pricing is shown so you can plan ahead.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="border-b border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Compare plans</h2>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-zinc-800">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">Feature comparison across Starter, Studio, and Business plans</caption>
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  <th scope="col" className="px-5 py-4 text-left font-semibold text-white">Feature</th>
                  <th scope="col" className="px-5 py-4 text-center font-semibold text-white">Starter</th>
                  <th scope="col" className="px-5 py-4 text-center font-semibold text-white">Studio</th>
                  <th scope="col" className="px-5 py-4 text-center font-semibold text-white">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-zinc-800 last:border-0">
                    <th scope="row" className="px-5 py-4 text-left font-medium text-zinc-300">{row.feature}</th>
                    <td className="px-5 py-4 text-center"><Cell value={row.starter} /></td>
                    <td className="px-5 py-4 text-center"><Cell value={row.studio} /></td>
                    <td className="px-5 py-4 text-center"><Cell value={row.business} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Common questions</h2>
          <div className="mt-10 space-y-3">
            {marketingFaqs.slice(0, 5).map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700 open:border-zinc-700"
              >
                <summary className="cursor-pointer list-none font-semibold text-white">{faq.question}</summary>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/faq"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 hover:gap-3 hover:text-zinc-300"
            >
              Read all FAQs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Send your first invoice today</h2>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Create a free workspace, add a client, and share a payment-ready invoice in minutes.
          </p>
          <div className="mt-10">
            <Link
              href="/sign-in"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-zinc-100"
            >
              Start free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
