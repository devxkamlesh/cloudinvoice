import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { marketingFaqs } from "@/lib/marketing-content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Free Online Invoice Generator for GST Invoices",
  description: "Create a professional GST invoice online for free. Add clients and line items, calculate CGST, SGST, or IGST, then download or share a private invoice link.",
  keywords: ["online invoice generator", "create invoice free", "free invoice maker", "GST invoice generator", "invoice generator India"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "CloudInvoice",
    title: "Free Online Invoice Generator for GST Invoices",
    description: "Create GST-ready invoices online, save client details, and share a private payment page.",
  },
  twitter: { card: "summary_large_image", title: "Free Online Invoice Generator for GST Invoices", description: "Create GST-ready invoices online and share a private payment page." },
};

const workflow = [
  { number: "01", title: "Set up the business", text: "Add the legal, GST, payment, and contact details that belong on every invoice." },
  { number: "02", title: "Create the invoice", text: "Choose a client, add line items, select GST treatment, and review the exact total." },
  { number: "03", title: "Download or share", text: "Save the invoice through your browser's PDF workflow or give the client its private link." },
  { number: "04", title: "Reconcile the result", text: "Track confirmed payments, outstanding balances, and overdue work from the dashboard." },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${appUrl}/#organization`, name: "CloudInvoice", url: appUrl, logo: `${appUrl}/logos/logo-512.png`, identifier: { "@type": "PropertyValue", propertyID: "Udyam Registration Number", value: "UDYAM-RJ-17-0675217" }, contactPoint: [{ "@type": "ContactPoint", contactType: "customer support", email: "support@cloudinvoice.co.in" }, { "@type": "ContactPoint", contactType: "security", email: "security@cloudinvoice.co.in" }], description: "MSME-registered online invoicing software for independent Indian businesses." },
    { "@type": "SoftwareApplication", "@id": `${appUrl}/#software`, name: "CloudInvoice", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: appUrl, offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "Free early-access workspace" }, audience: { "@type": "BusinessAudience", audienceType: "Freelancers, agencies, consultants, and small businesses" }, featureList: ["GST-ready invoice creation", "CGST, SGST, and IGST calculation", "Private client invoice links", "Browser print and PDF download", "Client records", "Payment tracking"], description: "A free online invoice generator for creating GST-ready invoices, storing client details, and sharing private payment pages." },
    { "@type": "FAQPage", mainEntity: marketingFaqs.slice(0, 6).map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
    { "@type": "HowTo", name: "How to create an invoice online with CloudInvoice", description: "Create, review, download, and share a GST-ready invoice online.", totalTime: "PT5M", step: workflow.map((step, index) => ({ "@type": "HowToStep", position: index + 1, name: step.title, text: step.text, url: `${appUrl}/#workflow` })) },
  ],
};

const capabilities = [
  { icon: FileCheck2, title: "GST-aware invoices", text: "Calculate CGST and SGST for intra-state work or IGST for inter-state work, with GSTIN, state code, HSN, and SAC context." },
  { icon: UsersRound, title: "Reusable client records", text: "Keep billing contacts, addresses, GST details, and notes ready for the next invoice instead of rebuilding context." },
  { icon: LockKeyhole, title: "Private invoice links", text: "Share an opaque client link rather than exposing an internal invoice identifier or requiring a client account." },
  { icon: CreditCard, title: "Configured payment options", text: "Support Stripe, Razorpay, and UPI payment paths when the service operator and workspace have supplied the required credentials." },
  { icon: ShieldCheck, title: "Verified payment events", text: "Card payment state changes only after the relevant gateway signature or webhook has been checked." },
  { icon: BarChart3, title: "Revenue context", text: "Separate issued value, confirmed collections, and outstanding balances without maintaining a second spreadsheet." },
];

function ProductPreview() {
  return (
    <div className="marketing-card overflow-hidden rounded-2xl" aria-label="CloudInvoice dashboard preview">
      <div className="flex items-center justify-between border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-red-400" />
          <span className="size-2 rounded-full bg-amber-400" />
          <span className="size-2 rounded-full bg-emerald-500" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">Workspace overview</span>
      </div>
      <div className="grid min-h-[31rem] lg:grid-cols-[12.5rem_1fr]">
        <aside className="hidden border-r bg-muted/45 p-4 lg:block">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-foreground text-xs font-bold text-background">SN</span>
            <div>
              <p className="text-sm font-semibold">Studio North</p>
              <p className="text-[11px] text-muted-foreground">Owner workspace</p>
            </div>
          </div>
          <div className="mt-8 space-y-1 text-sm">
            {[
              ["Overview", true], ["Invoices", false], ["Clients", false], ["Analytics", false],
            ].map(([label, active]) => <div key={String(label)} className={`rounded-lg px-3 py-2.5 ${active ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}>{label}</div>)}
          </div>
        </aside>
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="marketing-kicker">This month</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-.035em]">Cash flow, without the spreadsheet.</h2>
            </div>
            <span className="rounded-lg border bg-card px-3 py-2 text-xs text-muted-foreground">August 2026</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              ["Collected", "₹2,84,500", "Confirmed payments"],
              ["Outstanding", "₹46,280", "Across 8 invoices"],
              ["Clients", "42", "Saved records"],
            ].map(([label, value, hint]) => <div key={label} className="rounded-xl border bg-card p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-3 text-xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></div>)}
          </div>
          <div className="mt-3 grid gap-3 xl:grid-cols-[1.35fr_.65fr]">
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Billed and collected</p><p className="mt-1 text-xs text-muted-foreground">Six-month view</p></div><BarChart3 className="size-4 text-muted-foreground" /></div>
              <div className="mt-8 flex h-32 items-end gap-2">
                {[36, 58, 47, 72, 64, 88].map((height) => <div key={height} className="flex h-full flex-1 items-end gap-1"><span className="w-1/2 rounded-t-sm bg-muted" style={{ height: `${height}%` }} /><span className="w-1/2 rounded-t-sm bg-primary" style={{ height: `${Math.max(height - 13, 18)}%` }} /></div>)}
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <p className="text-xs font-medium text-muted-foreground">NEXT ACTION</p>
              <span className="mt-5 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><ReceiptText className="size-5" /></span>
              <p className="mt-4 text-sm font-semibold">Send INV-0042</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Reviewed and ready for Acme Studio.</p>
              <span className="mt-6 inline-flex rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background">Review invoice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <main id="main-content">
        <section className="marketing-noise relative overflow-hidden">
          <div aria-hidden="true" className="marketing-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44rem]" />
          <div className="mx-auto max-w-[90rem] px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8 lg:pt-36">
            <div className="max-w-6xl">
              <Link href="/security" className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-150 hover:text-foreground">
                <BadgeCheck className="size-3.5 text-primary" /> MSME registered in India <ArrowRight className="size-3" />
              </Link>
              <h1 className="marketing-display mt-8 max-w-6xl">Create a GST-ready invoice online for free.</h1>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.62fr] lg:items-end">
                <p className="marketing-copy max-w-2xl">CloudInvoice is an online invoice generator for freelancers, agencies, consultants, and small businesses. Enter client and line-item details, calculate GST, review the total, then download the invoice as a PDF or share its private link.</p>
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  <Link href="/sign-in" className="marketing-button-primary">Create an invoice free <ArrowRight className="size-4" /></Link>
                  <Link href="#workflow" className="marketing-button-secondary">See how it works</Link>
                </div>
              </div>
            </div>
            <div className="mt-14 sm:mt-20"><ProductPreview /></div>
          </div>
        </section>

        <section aria-label="Product principles" className="border-y bg-card">
          <div className="mx-auto grid max-w-[90rem] gap-6 px-4 py-7 sm:grid-cols-3 sm:px-6 lg:px-8">
            {["GST details stay in the invoice flow", "Clients pay from one private page", "Payment state comes from verified events"].map((item) => <p key={item} className="flex items-center gap-2 text-sm font-medium"><Check className="size-4 text-primary" />{item}</p>)}
          </div>
        </section>

        <section id="workflow" className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
              <div>
                <p className="marketing-kicker">How to create an invoice online</p>
                <h2 className="marketing-title mt-4">Create, review, download, and share your invoice.</h2>
                <p className="marketing-copy mt-6 max-w-xl">Create a free workspace, enter your business and client details, add the work and tax treatment, then review the invoice before you save it as a PDF or send its private link.</p>
                <Link href="/features" className="marketing-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">Explore every capability <ArrowRight className="size-4" /></Link>
              </div>
              <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
                {workflow.map((step) => <li key={step.number} className="max-w-md"><span className="font-mono text-xs font-semibold text-primary">{step.number}</span><h3 className="mt-5 text-xl font-semibold tracking-[-.025em]">{step.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{step.text}</p></li>)}
              </ol>
            </div>
          </div>
        </section>

        <section className="marketing-section border-y bg-card">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl"><p className="marketing-kicker">What is available</p><h2 className="marketing-title mt-4">The billing essentials, connected by design.</h2><p className="marketing-copy mt-6">Each capability below exists in the current product. Payment gateways still require valid deployment credentials before clients can use them.</p></div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, text }) => <article key={title} className="marketing-card rounded-xl p-6"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="marketing-section">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:items-center">
            <div>
              <p className="marketing-kicker">Built for Indian business</p>
              <h2 className="marketing-title mt-4">Business identity and trust should be visible.</h2>
              <p className="marketing-copy mt-6 max-w-xl">CloudInvoice is registered as a micro, small, and medium enterprise under the Ministry of MSME, Government of India. The product is designed around Indian GST and UPI workflows while still supporting international client billing.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/security" className="marketing-button-secondary">Visit the trust center</Link><Link href="/mission" className="marketing-button-secondary">Read our mission</Link></div>
            </div>
            <div className="marketing-card rounded-2xl p-6 sm:p-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><BadgeCheck className="size-6" /></span>
                <div><p className="marketing-kicker">MSME registered</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.035em]">Ministry of MSME, Government of India</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">Udyam Registration Number</p><p className="mt-1 font-mono text-base font-semibold">UDYAM-RJ-17-0675217</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section border-y bg-card">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
            <div><p className="marketing-kicker">Questions, answered</p><h2 className="marketing-title mt-4">Evaluate the product without a sales call.</h2><p className="marketing-copy mt-6">Straight answers about GST, payment confirmation, private links, and the current product boundary.</p><Link href="/faq" className="marketing-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">Read all FAQs <ArrowRight className="size-4" /></Link></div>
            <div className="divide-y border-y">
              {marketingFaqs.slice(0, 6).map((faq) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold"><span>{faq.question}</span><span className="text-xl font-normal text-primary transition-transform duration-150 group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>

        <section className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-foreground px-6 py-12 text-background sm:px-10 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:px-14">
              <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] opacity-60">Start with the real workflow</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] sm:text-5xl">Create the invoice. Share the link. Know what was paid.</h2><p className="mt-5 max-w-2xl leading-7 opacity-70">The current early-access workspace is free to use. No paid subscription starts automatically.</p></div>
              <Link href="/sign-in" className="mt-8 inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-background px-5 text-sm font-semibold text-foreground transition-[opacity,transform] duration-150 hover:opacity-85 active:scale-[.96] lg:mt-0">Create your workspace <ArrowRight className="size-4" /></Link>
            </div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
