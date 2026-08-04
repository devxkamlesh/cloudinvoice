import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BarChart3, CheckCircle2, CreditCard, FileCheck2, LockKeyhole, Mail, QrCode, ReceiptText, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { FeatureProductTour } from "@/components/marketing/owned-core-pages/feature-product-tour";
import { CheckList, MarketingJsonLd, PageBackdrop, PrimaryLink, SecondaryLink, SectionHeading } from "@/components/marketing/owned-core-pages/page-primitives";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Features | GST Invoicing, Payments & Revenue Clarity",
  description: "Explore CloudInvoice features: GST-aware invoices, client records, secure payment pages, UPI QR, Stripe Checkout, payment tracking, and revenue analytics.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "CloudInvoice features for work that deserves to be paid",
    description: "GST invoices, private payment pages, UPI QR, Stripe Checkout, and revenue clarity in one composed workspace.",
    url: "/features",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudInvoice features",
    description: "A composed invoicing workflow for independent businesses."
  }
};

const capabilities = [
  { icon: ReceiptText, title: "Professional invoices", text: "Turn completed work into a polished document with a real invoice number, payment terms, line items, and a clear total." },
  { icon: FileCheck2, title: "GST-aware calculation", text: "Choose intra-state or inter-state treatment and calculate CGST + SGST or IGST from the individual line items." },
  { icon: UsersRound, title: "Client records that carry context", text: "Keep billing contacts, GSTIN, state details, notes, and invoice history in the same place as the work." },
  { icon: CreditCard, title: "Stripe Checkout", text: "Give clients a trusted card-payment flow. Payment status updates only after a verified Stripe webhook is received." },
  { icon: QrCode, title: "UPI QR for the exact balance", text: "When your UPI ID is configured, CloudInvoice generates a scannable QR code tied to the invoice amount due." },
  { icon: BarChart3, title: "Revenue without the spreadsheet maze", text: "Separate money billed from money collected, keep an eye on outstanding balances, and understand the month at a glance." }
];

const featureFaqs = [
  { question: "Does CloudInvoice support GST invoices in India?", answer: "Yes. CloudInvoice supports intra-state invoices with CGST and SGST, and inter-state invoices with IGST. You can capture client GSTIN and state-code details, plus HSN or SAC information for line items." },
  { question: "How does CloudInvoice track payments?", answer: "For Stripe card payments, CloudInvoice verifies the signed Stripe webhook before recording a payment and updating the invoice balance. This prevents a browser redirect from being mistaken for a confirmed payment." },
  { question: "Can clients pay using UPI?", answer: "Yes, when your workspace has a UPI ID configured. The private invoice payment page displays a UPI QR code for the outstanding amount, which clients can scan in a compatible UPI app. The payment goes directly to your UPI ID, so CloudInvoice does not see it arrive — marking a UPI invoice as paid is a step you take yourself. Card payments through Stripe are confirmed automatically by a verified webhook." },
  { question: "Do clients need a CloudInvoice account to pay?", answer: "No. Clients use the private invoice link you share. They see their invoice and available payment options without needing to create a CloudInvoice account." }
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
        { "@type": "ListItem", position: 2, name: "Features", item: `${appUrl}/features` }
      ]
    },
    {
      "@type": "SoftwareApplication",
      name: "CloudInvoice",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: `${appUrl}/features`,
      featureList: capabilities.map((capability) => capability.title),
      description: "GST-aware invoicing, private client payment pages, UPI QR, Stripe Checkout, and revenue tracking for independent businesses."
    },
    {
      "@type": "FAQPage",
      mainEntity: featureFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } }))
    }
  ]
};

export default function FeaturesPage() {
  return (
    <MarketingShell>
      <MarketingJsonLd data={schema} />
      <PageBackdrop>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950">Skip to content</a>
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:pt-36">
          <div className="grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <p className="marketing-eyebrow inline-flex items-center gap-2"><Sparkles className="size-3.5" /> BUILT AROUND THE MOMENT YOU GET PAID</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">The invoice is just the beginning.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">CloudInvoice puts the client, tax treatment, payment experience, and revenue picture in one deliberate flow—so your back office feels as considered as your work.</p>
              <div className="mt-8 flex flex-wrap gap-3"><PrimaryLink href="/sign-in">Create your workspace</PrimaryLink><SecondaryLink href="#workflow">See the workflow</SecondaryLink></div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-400"><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-violet-200" />GST-aware by design</span><span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-violet-200" />Secure payment confirmation</span></div>
            </div>
            <div aria-label="CloudInvoice invoice workflow preview" className="relative mx-auto w-full max-w-xl"><div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-full bg-violet-500/15 blur-3xl" /><div className="marketing-card overflow-hidden rounded-[1.6rem] bg-[#0b0c10] shadow-[0_40px_100px_rgba(0,0,0,.48)]"><div className="flex items-center justify-between border-b border-white/[.08] px-5 py-4"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#ff6b63]" /><span className="size-2 rounded-full bg-[#f6c64f]" /><span className="size-2 rounded-full bg-[#62d26f]" /></div><span className="text-[10px] font-semibold tracking-[.13em] text-zinc-600">CLOUDINVOICE</span></div><div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_.9fr] sm:p-6"><div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-white">June revenue</p><p className="mt-2 text-2xl font-semibold tracking-tight text-white">₹2,84,500</p></div><span className="rounded-full bg-emerald-300/10 px-2 py-1 text-[10px] font-semibold text-emerald-200">+18.4%</span></div><div className="mt-7 flex h-16 items-end gap-1.5">{[28, 42, 34, 58, 46, 72, 64].map((height, index) => <span key={index} style={{ height: `${height}%` }} className={`flex-1 rounded-t-sm ${index === 5 ? "bg-violet-200" : "bg-white/10"}`} />)}</div></div><div className="rounded-xl border border-violet-300/15 bg-violet-300/[.07] p-4"><p className="text-[10px] font-semibold tracking-[.12em] text-violet-100/70">INVOICE DUE</p><p className="mt-2 text-xl font-semibold tracking-tight text-white">₹56,640</p><div className="mt-5 flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-white text-zinc-950"><CreditCard className="size-3.5" /></span><span className="text-xs text-zinc-300">Payment ready</span></div></div><div className="rounded-xl border border-white/[.08] bg-white/[.025] p-4 sm:col-span-2"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-white">New invoice</p><p className="mt-1 text-xs text-zinc-500">Studio North · Product design retainer</p></div><span className="rounded-full border border-amber-200/15 bg-amber-200/10 px-2.5 py-1 text-[10px] font-semibold text-amber-100">Draft</span></div><div className="mt-4 grid grid-cols-3 gap-2"><span className="h-1.5 rounded-full bg-violet-200" /><span className="h-1.5 rounded-full bg-white/10" /><span className="h-1.5 rounded-full bg-white/10" /></div></div></div></div></div>
          </div>
        </section>

        <section aria-label="CloudInvoice feature summary" className="border-y border-white/[.08] bg-white/[.018]"><div className="mx-auto grid max-w-7xl divide-y divide-white/[.08] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0"><div className="py-6 sm:pr-6"><p className="text-2xl font-semibold tracking-tight text-white">One link</p><p className="mt-1 text-sm text-zinc-500">for the invoice and payment experience</p></div><div className="py-6 sm:px-6"><p className="text-2xl font-semibold tracking-tight text-white">Two ways</p><p className="mt-1 text-sm text-zinc-500">to collect: card through Stripe or UPI</p></div><div className="py-6 sm:pl-6"><p className="text-2xl font-semibold tracking-tight text-white">Three styles</p><p className="mt-1 text-sm text-zinc-500">to make every invoice recognizably yours</p></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32" aria-labelledby="feature-grid-title"><SectionHeading titleId="feature-grid-title" eyebrow="THE ESSENTIALS, WELL COMPOSED" title={<>Less invoice admin. More confidence in every send.</>} description="CloudInvoice concentrates on the parts of invoicing that affect client trust, payment momentum, and your own visibility." /><div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{capabilities.map((capability) => { const Icon = capability.icon; return <article key={capability.title} className="marketing-card rounded-2xl p-6"><span className="grid size-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/[.08] text-violet-100"><Icon className="size-5" aria-hidden="true" /></span><h3 className="mt-7 text-lg font-semibold tracking-tight text-white">{capability.title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{capability.text}</p></article>; })}</div></section>

        <div id="workflow"><FeatureProductTour /></div>

        <section className="border-y border-white/[.08] bg-[#09090b] py-24 sm:py-32"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.84fr_1.16fr] lg:items-center"><div><p className="marketing-eyebrow">DETAILS THAT PROTECT THE WORK</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">The payment status is earned—not assumed.</h2><p className="mt-5 max-w-xl text-lg leading-8 text-zinc-400">A polished payment link matters. So does the discipline underneath it. CloudInvoice treats card payment confirmation as a verified event, not a hopeful redirect.</p><SecondaryLink href="/integrations" className="mt-8">Explore payment integrations <ArrowUpRight className="size-4" /></SecondaryLink></div><div className="grid gap-4 sm:grid-cols-2"><article className="marketing-card rounded-2xl p-6"><ShieldCheck className="size-6 text-violet-200" /><h3 className="mt-6 font-semibold text-white">Verified webhooks</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Stripe webhook signatures are verified before a payment updates an invoice record.</p></article><article className="marketing-card rounded-2xl p-6"><LockKeyhole className="size-6 text-violet-200" /><h3 className="mt-6 font-semibold text-white">Private links</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Client payment pages use a unique public token, rather than an exposed invoice ID.</p></article><article className="marketing-card rounded-2xl p-6"><Mail className="size-6 text-violet-200" /><h3 className="mt-6 font-semibold text-white">A simple sending path</h3><p className="mt-3 text-sm leading-7 text-zinc-400">Send a client-ready invoice email or copy its private payment link when you are ready.</p></article><article className="marketing-card rounded-2xl p-6"><BarChart3 className="size-6 text-violet-200" /><h3 className="mt-6 font-semibold text-white">Clear financial context</h3><p className="mt-3 text-sm leading-7 text-zinc-400">See what is outstanding alongside the revenue you have actually collected.</p></article></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32"><div className="marketing-card grid overflow-hidden rounded-[1.75rem] lg:grid-cols-[.94fr_1.06fr]"><div className="border-b border-white/[.08] bg-[radial-gradient(circle_at_10%_0%,rgba(139,124,255,.22),transparent_45%),#0d0d12] p-7 sm:p-10 lg:border-b-0 lg:border-r"><p className="marketing-eyebrow">CALM BY DEFAULT</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">Serious business tools do not need to feel heavy.</h2><p className="mt-5 text-base leading-8 text-zinc-400">CloudInvoice gives independent businesses the confidence of a considered payment process, without introducing an accounting suite they have to learn around.</p><PrimaryLink href="/sign-in" className="mt-8">Start with your first client</PrimaryLink></div><div className="p-7 sm:p-10"><p className="text-sm font-semibold text-white">What stays in the flow</p><div className="mt-6"><CheckList items={["Client details stay attached to future invoices.", "Tax settings travel with the invoice, not a separate calculation sheet.", "The payment page makes the next action clear to your client.", "Payment and revenue status return to your dashboard."]} /></div><Link href="/templates" className="marketing-link mt-8 inline-flex items-center gap-2 text-sm font-semibold">See the invoice styles <ArrowUpRight className="size-4" /></Link></div></div></section>

        <section className="border-t border-white/[.08] bg-white/[.018] py-24 sm:py-32" aria-labelledby="features-faq-title"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr]"><div><p className="marketing-eyebrow">FEATURES, EXPLAINED</p><h2 id="features-faq-title" className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">Questions before you send your first invoice.</h2><p className="mt-5 text-base leading-8 text-zinc-400">Straight answers for business owners evaluating a modern invoicing workflow.</p></div><div className="space-y-3">{featureFaqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-white/[.09] bg-white/[.025] p-5 open:bg-white/[.04]"><summary className="cursor-pointer list-none pr-8 text-base font-semibold text-white marker:hidden">{faq.question}<span aria-hidden="true" className="float-right -mr-7 text-xl font-normal text-violet-200 transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">{faq.answer}</p></details>)}</div></div></section>

        <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:py-32"><p className="marketing-eyebrow">READY WHEN THE WORK IS</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Turn the next finished project into a better client experience.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">Set up your workspace, add a client, and send a payment-ready invoice from one calm place.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><PrimaryLink href="/sign-in">Create your workspace</PrimaryLink><SecondaryLink href="/pricing">Review plans</SecondaryLink></div></section>
      </PageBackdrop>
    </MarketingShell>
  );
}
