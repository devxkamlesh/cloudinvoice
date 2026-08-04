import type { Metadata } from "next";
import { BadgeCheck, Ban, FileSignature, Landmark, Scale, WalletCards } from "lucide-react";
import { InlineLink, JsonLd, LegalMeta, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Terms of Service",
  description: "Understand the product boundaries, account responsibilities, payment flow, and launch requirements for CloudInvoice.",
  path: "/terms",
  keywords: ["CloudInvoice terms", "invoice software terms of service", "payment software terms"]
});

const terms = [
  {
    icon: FileSignature,
    number: "01",
    title: "The service",
    text: "CloudInvoice is software for creating invoices, maintaining client records, presenting invoice links, tracking payment records, and viewing invoice-related business data. It is not a bank, card issuer, payment processor, tax adviser, accountant, or law firm."
  },
  {
    icon: BadgeCheck,
    number: "02",
    title: "Your account and workspace",
    text: "You are responsible for the accuracy of information added to your workspace, the people you allow to access it, the security of your credentials, and activity performed through your account. Use a valid email address and do not share access outside your authorized team."
  },
  {
    icon: Landmark,
    number: "03",
    title: "Your invoices and legal obligations",
    text: "The workspace owner—not CloudInvoice—is responsible for the goods or services described on an invoice, the commercial agreement with the client, tax treatment, GST registration, GSTIN/HSN/SAC information, record retention, refunds, and required notices."
  },
  {
    icon: WalletCards,
    number: "04",
    title: "Payment services",
    text: "Card checkout is provided through Stripe when the operator has configured it. Your use of a payment method is also subject to the payment provider’s terms, verification, availability, fees, disputes, refunds, and compliance requirements."
  },
  {
    icon: Ban,
    number: "05",
    title: "Acceptable use",
    text: "Do not use CloudInvoice to deceive clients, generate false records, collect payments for illegal activity, interfere with the service, attempt unauthorized access, upload malicious code, or violate the rights or privacy of others."
  },
  {
    icon: Scale,
    number: "06",
    title: "Changes and availability",
    text: "The service may evolve, be maintained, or become unavailable. A production agreement should state the actual plan terms, support channel, service level commitments if any, governing law, dispute process, and the legal entity providing the service."
  }
];

export default function TermsPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Terms of Service" }];
  return <TrustPage
    eyebrow="Legal & privacy"
    title={<>Clear boundaries make better business software.</>}
    description={<p>These terms describe the intended relationship between the CloudInvoice product, a workspace owner, and the people who receive an invoice. They must be finalized by the service operator with legal counsel before a public commercial launch.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Terms of Service", href: "/terms" }])} />
    <Section className="border-y border-white/[.08] bg-white/[.02]">
      <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-300">Terms overview</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">The product helps document a transaction. It does not become a party to that transaction.</h2>
          <LegalMeta><span className="text-zinc-300">Last updated:</span> August 1, 2026. Intended for review during product setup and launch preparation.</LegalMeta>
        </div>
        <Notice title="Pre-launch legal requirement" tone="amber">
          A binding public version must identify the operating legal entity, registered address, commercial plans and fees, support process, governing law, dispute procedure, limitation of liability, and contact method. Those facts depend on the actual business and cannot be responsibly guessed here.
        </Notice>
      </div>
    </Section>

    <Section eyebrow="Working terms" title="What each side is responsible for">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {terms.map(({ icon: Icon, number, title, text }) => <Panel key={number} className="p-6">
          <div className="flex items-center justify-between"><Icon className="size-5 text-indigo-200" aria-hidden="true" /><span className="font-mono text-xs text-zinc-600">{number}</span></div>
          <h3 className="mt-6 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </Panel>)}
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="Invoice and payment boundaries" title="The sender owns the commercial relationship.">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">For workspace owners</h3>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <li>Make sure each invoice, total, tax choice, client detail, due date, and payment instruction is accurate before you share it.</li>
            <li>Only send invoice links to intended recipients, and respond to client questions, payment disputes, refunds, and fulfillment obligations directly.</li>
            <li>Follow the tax, accounting, consumer, privacy, and payment rules that apply to your business and your clients.</li>
          </ul>
        </Panel>
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">For invoice recipients</h3>
          <ul className="mt-5 space-y-4 text-sm leading-7 text-zinc-400">
            <li>Review the sender, amount, invoice details, and payment method before paying. A CloudInvoice payment page does not independently verify the commercial claim shown on an invoice.</li>
            <li>Direct questions about work delivered, taxes, invoices, refunds, or payment disputes to the business that issued the invoice.</li>
            <li>Card payments are processed by Stripe where configured; their checkout flow and payment policies also apply.</li>
          </ul>
        </Panel>
      </div>
    </Section>

    <Section eyebrow="Important limitations" title="Do not treat the interface as professional advice.">
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <Notice title="Tax, accounting, and legal disclaimer" tone="rose">
          CloudInvoice can calculate invoice line totals from the values you enter, including CGST, SGST, or IGST selection. That is not tax, accounting, or legal advice, and it is not a guarantee that an invoice meets every requirement that applies to your business. Obtain qualified advice when needed.
        </Notice>
        <div className="space-y-4 text-sm leading-7 text-zinc-400">
          <p>The service is provided as software functionality, subject to the final agreement issued by the responsible legal entity. Availability, support response times, data retention, backup recovery, and liability terms must be defined in that final agreement rather than implied by this website.</p>
          <p>We may suspend or limit access when reasonably necessary to protect the service, investigate suspected misuse, meet legal obligations, or address a security risk. A production policy should describe notice and appeal procedures where applicable.</p>
          <p>These terms work with the <InlineLink href="/privacy">Privacy Policy</InlineLink>, <InlineLink href="/cookies">Cookie Policy</InlineLink>, and <InlineLink href="/security">Security overview</InlineLink>. If a paid plan or separately signed agreement is offered, its express terms should control if they conflict with these website terms.</p>
        </div>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="Operator checklist" title="What must be completed before these terms are published as binding">
      <Panel className="p-6 sm:p-8">
        <ol className="grid gap-5 text-sm leading-7 text-zinc-400 md:grid-cols-2">
          {[
            "Name the legal entity that offers CloudInvoice and provide its registered contact details.",
            "Set the plan, price, billing, cancellation, refund, and renewal terms that actually apply.",
            "Select governing law, venue, mandatory consumer notices, and dispute resolution language with qualified counsel.",
            "Publish a monitored legal and privacy contact channel, then keep these policies matched to the deployed product.",
          ].map((item, index) => <li key={item} className="flex gap-4"><span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/10 text-xs font-semibold text-indigo-200">{index + 1}</span><span>{item}</span></li>)}
        </ol>
      </Panel>
    </Section>

    <PageCta title="Invoice with a clearer operating boundary." description="CloudInvoice gives independent businesses a focused system for invoices and payment tracking—while leaving the commercial and compliance decisions in your hands." />
  </TrustPage>;
}
