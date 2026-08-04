import type { Metadata } from "next";
import { BadgeCheck, Boxes, FileCheck2, Landmark, LockKeyhole, ScrollText } from "lucide-react";
import { InlineLink, JsonLd, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Mission",
  description: "Why CloudInvoice exists: GST-correct invoicing for independent Indian businesses, payment state that is verified rather than assumed, and a refusal to claim capabilities the product does not have.",
  path: "/mission",
  keywords: ["CloudInvoice mission", "GST invoicing India", "invoicing for freelancers", "honest software"]
});

// Every principle below maps to something that exists in the codebase. Nothing here
// describes a founding story, a team, or a legal entity, because none of that is
// verifiable from the product and inventing it would undercut the whole page.
const principles = [
  {
    icon: FileCheck2,
    title: "Tax treatment is not an afterthought",
    text: "GST is calculated per line item, with CGST and SGST for intra-state supply and IGST for inter-state. Client GSTIN, state code, and HSN or SAC fields are part of the invoice record, not a note you attach afterwards.",
    evidence: "Implemented in the invoice calculation and validation layer."
  },
  {
    icon: BadgeCheck,
    title: "Payment state has to be earned",
    text: "A browser landing on a success page proves nothing. A card payment is recorded only after the payment processor's signed webhook has been verified, and the same payment identifier can never be recorded twice.",
    evidence: "Signature verification and idempotency in the webhook handler."
  },
  {
    icon: LockKeyhole,
    title: "One workspace should never see another",
    text: "Every read and every change resolves the current membership first, then scopes the query to that organization. A client list, an invoice, a payment record: all of it is bounded by the workspace that owns it.",
    evidence: "Organization scoping on every authenticated query."
  },
  {
    icon: ScrollText,
    title: "Say what the product does, not what it might",
    text: "The security page refuses to claim certifications that have not happened. The status page publishes no uptime figure because none is measured. Pricing states plainly that paid checkout is not enabled yet. Where the product falls short, the site says so.",
    evidence: "Visible across the security, status, and pricing pages."
  },
  {
    icon: Landmark,
    title: "Nothing gets charged by surprise",
    text: "There is no subscription mechanism in the product today, which means no workspace can be moved onto a paid plan quietly. Any future paid plan will require an explicit action before it begins.",
    evidence: "No billing or subscription implementation exists."
  },
  {
    icon: Boxes,
    title: "Small on purpose",
    text: "An independent business does not need an accounting suite to bill a client. CloudInvoice stays deliberately compact so the workflow can be learned in one sitting, rather than growing features to fill a comparison chart.",
    evidence: "A focused route surface and data model."
  }
];

export default function MissionPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Mission" }];

  return <TrustPage
    eyebrow="Mission"
    title={<>Getting paid should be the easy part.</>}
    description={<p>Independent businesses in India do the work, then lose evenings to the billing. Tax treatment that has to be right, a client who needs an obvious way to pay, and a running question of what has actually arrived. CloudInvoice exists to make that part boring, in the good sense.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Mission", href: "/mission" }])} />

    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="The problem" title="Billing is where good work goes quiet">
      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <Panel className="p-6 sm:p-8">
          <div className="space-y-5 text-sm leading-7 text-zinc-400">
            <p>For a freelancer, a studio, or a two-person consultancy, an invoice is not paperwork. It is the moment a client decides how seriously to take you, and the moment your own cash flow is settled or deferred by a month.</p>
            <p>The tools available tend to sit at two extremes. Either a spreadsheet and a manually typed GST figure, which works until it quietly does not. Or a full accounting platform built for a finance team, priced for one, and carrying a hundred features to navigate around.</p>
            <p>CloudInvoice takes the narrow middle: get the tax right, give the client an unambiguous way to pay, and show the owner what has been billed against what has actually been collected. Nothing else has to be in the product for those three to be worth using.</p>
          </div>
        </Panel>
        <div className="space-y-4">
          <Notice title="Who this is for" tone="indigo">
            Independent professionals and small studios billing in India who need GST-correct invoices and a payment page they are not embarrassed to send. If you have a finance department, this is not the right tool and we would rather say so.
          </Notice>
          <Notice title="Who it is not for yet" tone="amber">
            Teams needing multi-user workspaces with distinct roles, recurring billing, or programmatic access. Those are real gaps, tracked openly on the <InlineLink href="/status">status page</InlineLink> and the <InlineLink href="/changelog">changelog</InlineLink> rather than implied to exist.
          </Notice>
        </div>
      </div>
    </Section>

    <Section eyebrow="Principles" title="Six positions the product actually holds">
      <p className="mb-9 max-w-3xl text-base leading-8 text-zinc-400">A principle that is not visible in the software is just copy. Each of these describes something already built, and each one is checkable by reading the product rather than trusting this page.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {principles.map(({ icon: Icon, title, text, evidence }) => <Panel key={title} className="flex flex-col p-6">
          <span className="grid size-10 place-items-center rounded-xl border border-indigo-300/15 bg-indigo-300/[.09] text-indigo-200"><Icon className="size-5" aria-hidden="true" /></span>
          <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">{text}</p>
          <p className="mt-5 border-t border-white/[.08] pt-4 text-xs leading-5 text-zinc-500">{evidence}</p>
        </Panel>)}
      </div>
    </Section>

    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="Commitments" title="Things we would rather not do, stated in advance">
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          ["Not claim a certification we do not hold", "No SOC 2, ISO 27001, PCI DSS, or HIPAA language will appear until an assessment has actually happened and can be produced on request."],
          ["Not publish an uptime number we do not measure", "A status page with invented availability bars is worse than no status page. Ours shows component state and says plainly that it is maintained by hand."],
          ["Not treat a redirect as a payment", "Confirming money moved is the one thing an invoicing tool cannot get wrong. Verified processor events only, and for methods we cannot verify we say the confirmation step is yours."],
          ["Not sell the roadmap as the product", "Planned work is labelled as planned, with dates presented as estimates. If something is not built, the site should not imply that it is."]
        ].map(([title, text]) => <Panel key={title} className="p-6">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </Panel>)}
      </div>
    </Section>

    <Section eyebrow="Honesty about the present" title="What this mission has not delivered yet">
      <div className="grid gap-5 lg:grid-cols-[1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <div className="space-y-5 text-sm leading-7 text-zinc-400">
            <p>A mission page is easy to write and easy to fall short of. So here is the honest position: CloudInvoice does the core well and has real gaps around it.</p>
            <p>Invoices are created accurately and shared cleanly. Payment collection through a card processor is implemented and verified properly. Revenue and outstanding balances are visible. That much works.</p>
            <p>What is still missing is documented rather than hidden. The <InlineLink href="/status">status page</InlineLink> lists which components are operational and which are built but not configured. The <InlineLink href="/changelog">changelog</InlineLink> covers what shipped and what is planned. If something here reads as a promise the product does not keep, that is a defect worth reporting through <InlineLink href="/contact">contact</InlineLink>.</p>
          </div>
        </Panel>
        <Notice title="Judge it by the product" tone="emerald">
          The most useful thing you can do with this page is close it and create one real invoice. A workspace is free, no card is required, and one accurate invoice tells you more about whether this belongs in your workflow than any mission statement can.
        </Notice>
      </div>
    </Section>

    <PageCta title="Send one invoice and decide for yourself." description="Create a workspace, add a client, and produce a GST-correct invoice with a private payment page. That is the whole promise, and it takes a few minutes to test." />
  </TrustPage>;
}
