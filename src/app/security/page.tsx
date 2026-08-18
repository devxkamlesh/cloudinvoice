import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, CreditCard, Database, KeyRound, LockKeyhole, ServerCog, ShieldCheck, UsersRound } from "lucide-react";
import { InlineLink, JsonLd, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Security",
  description: "Learn how CloudInvoice approaches tenant isolation, payment verification, authentication, and secure production operations.",
  path: "/security",
  keywords: ["CloudInvoice security", "invoice software security", "tenant isolation", "Stripe webhook security"]
});

const safeguards = [
  {
    icon: UsersRound,
    title: "Workspace boundaries",
    text: "Authenticated application reads and changes resolve the current membership first, then scope business records to that organization. This reduces the chance of one workspace seeing another workspace’s invoices or clients."
  },
  {
    icon: KeyRound,
    title: "Account sessions",
    text: "CloudInvoice uses Auth.js with email-and-password credentials and JWT-backed sessions. Password reset links are time-limited and single-use."
  },
  {
    icon: CreditCard,
    title: "Hosted card checkout",
    text: "Card payments are initiated through Stripe Checkout. CloudInvoice records payment outcome and Stripe payment identifiers; it does not build a card-entry form or retain card numbers in its application database."
  },
  {
    icon: ShieldCheck,
    title: "Verified payment updates",
    text: "A payment is recorded only after the Stripe webhook signature has been checked. The webhook handler also prevents a payment identifier from being recorded more than once."
  },
  {
    icon: LockKeyhole,
    title: "Private invoice access",
    text: "Client invoice pages use an unguessable public token rather than a sequential invoice ID. The link should still be treated as confidential by the sender and recipient."
  },
  {
    icon: Database,
    title: "Purposeful data storage",
    text: "The application stores the account, workspace, client, invoice, and payment records required to deliver invoicing. CloudInvoice does not describe this as a certification, audit, or guarantee of compliance."
  }
];

export default function SecurityPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Security" }];
  return <TrustPage
    eyebrow="Trust center"
    title={<>Security is a product practice, not a badge.</>}
    description={<p>CloudInvoice is built to make the most sensitive parts of invoicing—workspace access, client details, payment status, and production configuration—deliberate. Here is what the product does today, and where its security boundary ends.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Security", href: "/security" }])} />
    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="Business verification" title="Registered in India. Built for accountable business.">
      <Panel className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/[.09] text-emerald-200">
          <BadgeCheck className="size-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-200">MSME Registered</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Ministry of MSME, Government of India</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-400">Udyam Registration No: <span className="font-medium text-zinc-200">UDYAM-RJ-17-0675217</span></p>
        </div>
      </Panel>
    </Section>

    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="Current safeguards" title="Designed around the data that matters most">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {safeguards.map(({ icon: Icon, title, text }) => <Panel key={title} className="p-6">
          <span className="grid size-10 place-items-center rounded-xl border border-indigo-300/15 bg-indigo-300/[.09] text-indigo-200"><Icon className="size-5" aria-hidden="true" /></span>
          <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </Panel>)}
      </div>
    </Section>

    <Section eyebrow="Operational model" title="A practical production baseline">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">Deployment choices are part of the security model.</h3>
          <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-400">
            <p>CloudInvoice’s deployment documentation is designed for a private PostgreSQL database, secrets held outside source control, container-based releases, and narrowly scoped network access. Those controls must be configured by the production operator; they are not enabled merely by cloning this repository.</p>
            <p>The production baseline keeps the application behind HTTPS, limits database access to the application network, stores uploaded assets privately, and exposes only the traffic required to operate the service.</p>
            <p>Read the <InlineLink href="/privacy">Privacy Policy</InlineLink> for how product data is handled, and review the deployment runbook before connecting a production database or payment account.</p>
          </div>
        </Panel>
        <div className="space-y-4">
          <Notice title="No unverified assurance claims" tone="amber">
            CloudInvoice does not claim SOC 2, ISO 27001, PCI DSS certification, HIPAA compliance, a penetration test, or a specific uptime commitment on this page. Any future assurance must be published only after it is independently supportable.
          </Notice>
          <Notice title="Shared responsibility" tone="indigo">
            Account owners remain responsible for choosing strong passwords, limiting access to their workspace, keeping invoice links confidential, configuring payment credentials correctly, and reviewing their tax and legal obligations.
          </Notice>
        </div>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="Engineering controls" title="What changes payment state">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["01", "A client opens an invoice link", "The public page is addressed with an opaque invoice token. The sender controls where that link is shared."],
          ["02", "Stripe processes card checkout", "The card collection experience is hosted by Stripe Checkout after the application creates a checkout session for the invoice."],
          ["03", "A verified webhook records the result", "CloudInvoice checks the Stripe signature, looks for a successful paid session, and creates an idempotent payment record before updating the balance."],
        ].map(([number, title, text]) => <Panel key={number} className="p-6">
          <span className="font-mono text-sm text-indigo-200">{number}</span>
          <h3 className="mt-7 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </Panel>)}
      </div>
    </Section>

    <Section eyebrow="Security reporting" title="Responsible disclosure belongs in the launch plan.">
      <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <ServerCog className="size-6 text-indigo-200" aria-hidden="true" />
          <h3 className="mt-5 text-xl font-semibold text-white">Before public launch</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">The service operator should publish a dedicated security-reporting address, an incident contact, a data-processing contact, and the legal entity responsible for CloudInvoice. Those details are intentionally not invented in this codebase.</p>
          <p className="mt-4 text-sm leading-7 text-zinc-400">If you operate this deployment, add a monitored contact channel before inviting customers and document your incident triage, backup, retention, and access-review procedures.</p>
        </Panel>
        <Notice title="Security issue guidance" tone="rose">
          Do not include passwords, full payment information, or client personal data in an issue report. Include the affected URL, a safe reproduction path, the time observed, and the lowest-impact evidence needed to understand the issue.
        </Notice>
      </div>
      <p className="mt-8 text-sm text-zinc-500">Looking for product availability? See <Link href="/status" className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white">service status</Link>. Legal terms and responsibility boundaries are available in the <Link href="/terms" className="text-zinc-300 underline decoration-zinc-600 underline-offset-4 hover:text-white">Terms of Service</Link>.</p>
    </Section>

    <PageCta title="Build the invoice experience your clients can trust." description="Create a workspace, keep your business records organized, and use payment flows that only record verified card outcomes." />
  </TrustPage>;
}
