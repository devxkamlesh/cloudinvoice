import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Braces, Database, KeyRound, LockKeyhole, Webhook } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { marketingMetadata, PageJsonLd } from "@/components/marketing/owned-resource-pages/seo";
import { Breadcrumbs, CardLink, CodeWindow, CtaLink, DotList, GlowCard, IconBadge, MarketingPage, PageHero, Section, SectionHeading, TextLink } from "@/components/marketing/owned-resource-pages/ui";

export const metadata: Metadata = marketingMetadata({
  title: "CloudInvoice API | Developer platform preview",
  description: "Explore the planned CloudInvoice API model for invoice workflows, payment events, and organization-safe integrations.",
  path: "/api",
  keywords: ["invoice API", "GST invoice API", "payment webhook API", "CloudInvoice developers"]
});

const integrationPrinciples = [
  {
    icon: Database,
    title: "A resource model that mirrors the work",
    text: "The API contract is being designed around the records teams already use: organizations, clients, invoices, line items, and payment events."
  },
  {
    icon: LockKeyhole,
    title: "Tenant boundaries are part of the contract",
    text: "Planned credentials will be scoped to a workspace. Integrations should never need to infer which organization owns a record."
  },
  {
    icon: Webhook,
    title: "Payment changes deserve events",
    text: "The planned event model centers on meaningful changes such as an invoice becoming paid, rather than asking teams to poll blindly."
  }
];

export default function ApiPage() {
  return <MarketingShell>
    <MarketingPage>
      <PageJsonLd title="CloudInvoice API" description="A transparent preview of the planned CloudInvoice developer API." path="/api" type="TechArticle" />
      <PageHero
        breadcrumbs={<Breadcrumbs current="API" />}
        eyebrow="Developer platform"
        title={<>Build for the invoice moment, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-sky-200">not around it.</span></>}
        description={<>CloudInvoice is shaping a developer API for teams that want invoicing to fit into their own workflow. The dashboard remains the supported way to work today; public API credentials are not generally available yet. This preview is intentionally clear about the direction and the boundary.</>}
        actions={[{ href: "/docs", label: "Read product docs" }, { href: "/contact", label: "Discuss an integration", secondary: true }]}
        visual={<CodeWindow title="illustrative request shape">{`GET /v1/invoices/inv_01J9...\nAuthorization: Bearer ci_live_••••\n\n{\n  "status": "sent",\n  "currency": "INR",\n  "amount_due": 56640,\n  "payment_url": "https://…"\n}`}</CodeWindow>}
      />

      <Section>
        <SectionHeading eyebrow="Why a preview" title="Honest integration planning starts with the present state." description={<>We would rather show what is ready, what is being designed, and where to ask a question than promise endpoints a team cannot use. You can use CloudInvoice’s web app today, while we validate the right public API surface.</>} />
        <div className="mt-10 grid gap-4 md:grid-cols-3">{integrationPrinciples.map(({ icon, title, text }) => <GlowCard key={title}><IconBadge icon={icon} /><h3 className="mt-6 text-lg font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></GlowCard>)}</div>
      </Section>

      <Section className="border-y border-white/[.08] bg-white/[.018]">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start"><div><SectionHeading eyebrow="The expected flow" title="A simple shape for a complex financial handoff." description="The public contract will focus on the facts an integration needs to know, with clear state transitions and a durable audit trail." /><div className="mt-8"><CtaLink href="/contact" label="Share your use case" secondary /></div></div><ol className="space-y-0 rounded-2xl border border-white/[.10] bg-[#0a0a0b] px-5 sm:px-7">{[
          ["01", "Identify the workspace", "An integration begins with an explicit organization context rather than a hidden default."],
          ["02", "Create or reference the client", "Use a stable client record so billing history stays connected to the right relationship."],
          ["03", "Prepare the invoice", "Pass line items, tax treatment, dates, and terms in a format that can be reviewed before it is sent."],
          ["04", "Listen for a real outcome", "Receive an event when a verified payment changes the invoice state."]
        ].map(([number, title, text]) => <li key={number} className="grid gap-4 border-b border-white/[.08] py-6 last:border-b-0 sm:grid-cols-[3.75rem_1fr]"><span className="font-mono text-sm text-violet-200">{number}</span><div><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p></div></li>)}</ol></div>
      </Section>

      <Section>
        <div className="grid gap-5 lg:grid-cols-[1fr_.82fr]"><GlowCard className="p-7 sm:p-8"><div className="flex items-center gap-3"><IconBadge icon={KeyRound} /><div><p className="text-xs font-bold uppercase tracking-[.15em] text-violet-200">Availability</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-white">No public key issuance in this release.</h2></div></div><p className="mt-6 max-w-2xl leading-7 text-zinc-400">If your team is evaluating CloudInvoice for a future integration, tell us what system owns the source data and what needs to happen after payment. That feedback guides the first supported API access.</p><div className="mt-7 flex flex-wrap gap-4 text-sm"><TextLink href="/contact">Talk through an integration</TextLink><TextLink href="/changelog">Follow product updates</TextLink></div></GlowCard><div className="rounded-2xl border border-violet-300/15 bg-gradient-to-br from-violet-300/10 via-transparent to-sky-300/10 p-7"><Braces className="size-6 text-violet-200" /><h2 className="mt-5 text-xl font-semibold text-white">Building in the open enough to be useful.</h2><DotList className="mt-5" items={["No invented endpoint availability or artificial API examples presented as live.", "No sensitive keys in documentation or browser-delivered configuration.", "A product-led rollout that lets support and auditability mature with the surface area."]} /></div></div>
      </Section>

      <section className="border-t border-white/[.08] bg-[#080808]"><div className="mx-auto max-w-7xl px-5 py-12"><div className="flex flex-col gap-5 rounded-2xl border border-white/[.09] bg-white/[.025] p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-lg font-semibold text-white">Need a workflow the API should support?</p><p className="mt-1 text-sm text-zinc-400">Share the outcome you need, not just the endpoint you expect.</p></div><Link href="/contact" className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-violet-200 hover:text-white">Contact the product team <BookOpen className="size-4" /></Link></div></div></section>
    </MarketingPage>
  </MarketingShell>;
}
