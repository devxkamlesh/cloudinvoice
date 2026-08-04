import type { Metadata } from "next";
import { BellRing, Database, Eye, FileText, Globe2, Scale, Share2 } from "lucide-react";
import { InlineLink, JsonLd, LegalMeta, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Privacy Policy",
  description: "Read how CloudInvoice handles account, workspace, invoice, client, payment, and technical data.",
  path: "/privacy",
  keywords: ["CloudInvoice privacy policy", "invoice data privacy", "client data", "payment data privacy"]
});

const dataGroups = [
  {
    icon: BellRing,
    title: "Account and session data",
    examples: "Name, email address, authentication records, session expiry, and technical session fields such as IP address or user agent when the authentication system records them.",
    purpose: "To create an account, authenticate a user, maintain a signed-in session, and protect the service from misuse."
  },
  {
    icon: Database,
    title: "Workspace and business data",
    examples: "Organization name, business contact details, address, logo reference, GSTIN, PAN, state code, invoice numbering preferences, and payment configuration references.",
    purpose: "To present and operate the workspace the account owner creates."
  },
  {
    icon: FileText,
    title: "Client and invoice data",
    examples: "Client contact and billing details, GSTIN and state code when entered, invoice line items, notes, tax settings, due dates, totals, and payment status.",
    purpose: "To create, send, display, and track invoices on behalf of the workspace."
  },
  {
    icon: Eye,
    title: "Payment and delivery data",
    examples: "Stripe payment identifiers, payment amount, currency, payment outcome, the date recorded, and invoice-delivery email address when email sending is configured.",
    purpose: "To associate a verified payment outcome with the correct invoice and deliver invoice communications."
  }
];

export default function PrivacyPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Privacy Policy" }];
  return <TrustPage
    eyebrow="Legal & privacy"
    title={<>Privacy should be readable before you trust the workflow.</>}
    description={<p>This policy explains the data CloudInvoice is designed to process when an account owner uses the invoicing product. It is written for transparency, not as a substitute for the service operator’s final, jurisdiction-specific legal notice.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Privacy Policy", href: "/privacy" }])} />
    <Section className="border-y border-white/[.08] bg-white/[.02]">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-300">At a glance</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">CloudInvoice processes the information needed to run your workspace and invoice your clients.</h2>
          <LegalMeta><span className="text-zinc-300">Last updated:</span> August 1, 2026. This policy applies to the CloudInvoice web application at the domain operated by the service provider.</LegalMeta>
        </div>
        <Notice title="Important launch requirement" tone="amber">
          Before collecting production customer data, the operator must publish the legal entity name, registered address, privacy contact, governing jurisdiction, and any regional disclosures that apply to the actual deployment. This repository does not invent those facts.
        </Notice>
      </div>
    </Section>

    <Section eyebrow="1. Information we process" title="The data stays tied to the work you ask the product to do.">
      <div className="grid gap-4 md:grid-cols-2">
        {dataGroups.map(({ icon: Icon, title, examples, purpose }) => <Panel key={title} className="p-6">
          <Icon className="size-5 text-indigo-200" aria-hidden="true" />
          <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400"><span className="font-medium text-zinc-300">Examples:</span> {examples}</p>
          <p className="mt-3 text-sm leading-7 text-zinc-400"><span className="font-medium text-zinc-300">Why:</span> {purpose}</p>
        </Panel>)}
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="2. How information moves" title="Limited to the services that deliver the product">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          [Share2, "Service providers", "The deployment may use PostgreSQL for application records, a transactional email provider for invoice emails, cloud infrastructure for hosting, and object storage for enabled file features. Each provider should be configured by the operator with appropriate credentials and access controls."],
          [Globe2, "Payment processing", "When a client chooses card payment, Stripe Checkout receives the information needed to process that payment. CloudInvoice receives the outcome necessary to reconcile the invoice rather than the client’s full card number."],
          [Scale, "Legal and operational needs", "Information may be disclosed when required by applicable law, to protect the service or people from harm, or as part of a legitimate business transfer. The operator should apply legal review before relying on any such disclosure."],
        ].map(([Icon, title, text]) => {
          const CardIcon = Icon as typeof Share2;
          return <Panel key={title as string} className="p-6"><CardIcon className="size-5 text-indigo-200" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">{title as string}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{text as string}</p></Panel>;
        })}
      </div>
      <p className="mt-7 max-w-4xl text-sm leading-7 text-zinc-400">CloudInvoice is not designed to sell client invoice data or turn it into an advertising audience. Its purpose is to provide invoicing and payment-tracking functionality to the workspace that supplied the data.</p>
    </Section>

    <Section eyebrow="3. Access, retention, and control" title="A policy must match the actual operator’s practices.">
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <Notice title="Retention is not hard-coded here" tone="rose">
          This implementation does not enforce a public retention schedule or automated deletion workflow. Records remain in the configured database until they are deleted through the product, an authorized administrative process, or the infrastructure lifecycle. Production operators must define and publish a retention and backup policy before launch.
        </Notice>
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">Your practical controls</h3>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <li><span className="font-medium text-zinc-200">Workspace access:</span> limit invitations and account access to people who need it.</li>
            <li><span className="font-medium text-zinc-200">Client records:</span> review and correct the invoice and client details you enter before sharing an invoice link.</li>
            <li><span className="font-medium text-zinc-200">Payment links:</span> treat a public invoice link as confidential because anyone who has it may see the invoice presentation it serves.</li>
            <li><span className="font-medium text-zinc-200">Privacy requests:</span> the service operator must supply a monitored privacy contact and a process to verify and respond to requests before public launch.</li>
          </ul>
        </Panel>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="4. Security and changes" title="Privacy depends on both product controls and responsible operation.">
      <div className="max-w-4xl space-y-5 text-sm leading-7 text-zinc-400">
        <p>CloudInvoice uses application-level workspace scoping, opaque invoice links, hosted Stripe Checkout, and signature-verified Stripe webhooks as part of its product security model. Learn more in the <InlineLink href="/security">Security overview</InlineLink>. No system can promise absolute security, so account owners and service operators must also protect credentials, infrastructure access, and exported data.</p>
        <p>The operator may update this policy when the product, vendors, or legal requirements change. A material update should include a new effective date and reasonable notice through the product or another appropriate channel. Continued use after an updated policy takes effect is subject to applicable law and any contract governing the account.</p>
        <p>This policy should be read alongside the <InlineLink href="/terms">Terms of Service</InlineLink> and <InlineLink href="/cookies">Cookie Policy</InlineLink>. Tax, accounting, and legal obligations remain the responsibility of each workspace owner.</p>
      </div>
    </Section>

    <PageCta title="Keep your invoice data organized—and intentional." description="Create a workspace with the details your client experience actually needs, then keep access limited to the people you trust." />
  </TrustPage>;
}
