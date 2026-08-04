import type { Metadata } from "next";
import { BookOpen, Activity, CreditCard, LifeBuoy, PlugZap, ShieldAlert } from "lucide-react";
import { InlineLink, JsonLd, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";
import { SECURITY_EMAIL, SUPPORT_EMAIL, mailto } from "@/lib/contact";

export const metadata: Metadata = marketingMetadata({
  title: "Contact",
  description: "How to reach CloudInvoice about product support, billing questions, security reports, and integration requests.",
  path: "/contact",
  keywords: ["contact CloudInvoice", "CloudInvoice support", "invoicing software support", "report a security issue"]
});

const channels = [
  {
    icon: LifeBuoy,
    title: "Product support",
    address: SUPPORT_EMAIL,
    subject: "CloudInvoice support request",
    text: "Something not behaving the way you expect, a question about GST handling, or help getting a workspace set up.",
    include: "Your workspace name, the invoice number if it relates to one, what you expected, and what happened instead."
  },
  {
    icon: CreditCard,
    title: "Billing and plans",
    address: SUPPORT_EMAIL,
    subject: "CloudInvoice billing question",
    text: "Questions about pricing, what a plan includes, or when paid plans become available. Nothing is charged automatically today.",
    include: "Which plan you are asking about and the workspace it would apply to."
  },
  {
    icon: PlugZap,
    title: "Integrations and API",
    address: SUPPORT_EMAIL,
    subject: "CloudInvoice integration request",
    text: "A payment method, accounting tool, or workflow you need CloudInvoice to connect to. Public API access is not open yet.",
    include: "Which system holds the source data, and what should happen after a payment is confirmed."
  },
  {
    icon: ShieldAlert,
    title: "Security reports",
    address: SECURITY_EMAIL,
    subject: "CloudInvoice security report",
    text: "A suspected vulnerability or a way the product exposes data it should not. Reports are welcome and will not be treated as hostile.",
    include: "The affected URL, a safe reproduction path, and the time you observed it. Never include passwords, payment details, or client personal data."
  }
];

export default function ContactPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Contact" }];

  return <TrustPage
    eyebrow="Contact"
    title={<>Talk to the people building it.</>}
    description={<p>CloudInvoice is a small operation, which means a message reaches someone who can actually change the product. Below is where to send what, and what to include so the first reply is useful rather than a request for more detail.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }])} />

    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="Where to write" title="Pick the channel that matches your question">
      <div className="grid gap-4 md:grid-cols-2">
        {channels.map(({ icon: Icon, title, address, subject, text, include }) => <Panel key={title} className="flex flex-col p-6">
          <span className="grid size-10 place-items-center rounded-xl border border-indigo-300/15 bg-indigo-300/[.09] text-indigo-200"><Icon className="size-5" aria-hidden="true" /></span>
          <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
          <p className="mt-4 text-sm leading-6 text-zinc-500"><span className="font-semibold text-zinc-300">Please include:</span> {include}</p>
          <div className="mt-6 pt-1">
            <a href={mailto(address, subject)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/[.12] bg-white/[.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">{address}</a>
          </div>
        </Panel>)}
      </div>
    </Section>

    <Section eyebrow="What to expect" title="Honest expectations beat a promised response time">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">No support SLA, and no pretending there is one.</h3>
          <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-400">
            <p>CloudInvoice does not publish a guaranteed response time, because a guarantee it cannot keep is worth less than an honest description. Messages are read and answered by the people who build the product, in the order they arrive.</p>
            <p>If your question is about whether something is broken on our side or configured on yours, check the <InlineLink href="/status">status page</InlineLink> first. It lists which components are operational and which are deliberately not configured yet, which resolves a good share of questions without waiting for a reply.</p>
            <p>For anything touching how data is handled, the <InlineLink href="/privacy">Privacy Policy</InlineLink> and <InlineLink href="/security">Security</InlineLink> pages are more precise than an email summary would be.</p>
          </div>
        </Panel>
        <div className="space-y-4">
          <Notice title="Before you send client data" tone="rose">
            Do not paste a client&rsquo;s full billing details, a payment reference, or an invoice PDF into a first message. Describe the shape of the problem and reference the invoice number instead. If more is needed to reproduce it, we will ask for the minimum.
          </Notice>
          <Notice title="Not a channel for account recovery" tone="indigo">
            Password reset is not available in the product yet. If you cannot access a workspace, say so explicitly and describe how it was created, rather than sending credentials.
          </Notice>
        </div>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="Answer it yourself, faster" title="Three places that resolve most questions">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { icon: BookOpen, title: "Frequently asked questions", text: "How GST is calculated, how payment links work, what a private invoice page shows, and what is and is not included today.", href: "/faq", label: "Read the FAQ" },
          { icon: Activity, title: "Service status", text: "Which components are operational right now, and which are built but not configured in this deployment.", href: "/status", label: "Check status" },
          { icon: BookOpen, title: "Changelog", text: "What has shipped, what changed recently, and what is on the roadmap with honest timelines.", href: "/changelog", label: "See what changed" }
        ].map(({ icon: Icon, title, text, href, label }) => <Panel key={title} className="p-6">
          <Icon className="size-5 text-indigo-200" aria-hidden="true" />
          <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
          <p className="mt-5"><InlineLink href={href}>{label}</InlineLink></p>
        </Panel>)}
      </div>
    </Section>

    <PageCta title="Or skip the question and try it." description="A workspace is free to create, and the invoicing workflow is available immediately. Most questions answer themselves after one real invoice." />
  </TrustPage>;
}
