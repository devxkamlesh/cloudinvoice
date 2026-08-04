import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BadgeCheck, BellRing, Check, CheckCircle2, ChevronRight, CircleHelp, CircleMinus, CirclePlus, CreditCard, FileCheck2, FileText, Globe2, LayoutDashboard, LockKeyhole, MailCheck, Palette, QrCode, ReceiptText, ShieldCheck, Sparkles, UsersRound, WalletCards, Zap } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { PricingPreview } from "@/components/marketing/pricing-preview";
import { marketingFaqs } from "@/lib/marketing-content";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "CloudInvoice — GST-ready invoicing that gets paid",
  description: "CloudInvoice gives independent businesses polished GST invoices, private payment pages, UPI QR codes, Stripe Checkout, and clear revenue tracking.",
  keywords: ["GST invoice software", "invoice generator India", "UPI invoice payments", "Stripe invoices", "freelancer invoicing", "agency billing software", "professional invoice templates"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "CloudInvoice", title: "CloudInvoice — GST-ready invoicing that gets paid", description: "Create invoices clients understand and payment paths they can use." },
  twitter: { card: "summary_large_image", title: "CloudInvoice — invoices that get paid", description: "GST-ready invoicing and payment collection for independent businesses." }
};

const featureSet = [
  { icon: ReceiptText, title: "Professional invoices", text: "Create clean, client-ready invoices with line items, terms, notes, dates, and a purposeful visual template.", status: "Live" },
  { icon: FileCheck2, title: "GST ready", text: "Calculate CGST + SGST or IGST line by line, while retaining GSTIN, state-code, HSN, and SAC context.", status: "Live" },
  { icon: QrCode, title: "UPI payments", text: "Turn your UPI ID into a scannable invoice payment route with the balance pre-filled for the client.", status: "Live" },
  { icon: CreditCard, title: "Stripe Checkout", text: "Offer a familiar card-payment experience and accept status updates only through verified Stripe webhooks.", status: "Live" },
  { icon: Globe2, title: "Client portal", text: "Share a focused, private link where a client can inspect an invoice and pay without an account.", status: "Live" },
  { icon: Palette, title: "Invoice templates", text: "Choose Classic, Modern, or Midnight when you want the document experience to match your brand energy.", status: "Live" },
  { icon: BarChart3, title: "Revenue analytics", text: "Compare billed and collected revenue across the last six months without building another spreadsheet.", status: "Live" },
  { icon: UsersRound, title: "Client workspace", text: "Keep billing addresses, contacts, GST details, and internal notes where future invoices can reuse them.", status: "Live" },
  { icon: WalletCards, title: "Payment tracking", text: "Follow invoice state from draft to sent, viewed, partially paid, paid, overdue, or void.", status: "Live" },
  { icon: BellRing, title: "Smart follow-ups", text: "Bring overdue and pending payment actions into a clearer workflow as automated reminders evolve.", status: "Roadmap" },
  { icon: Zap, title: "Workflow automation", text: "Connect repeatable billing moments to your preferred business stack with future automation tools.", status: "Roadmap" },
  { icon: UsersRound, title: "Team workspace", text: "Invite collaborators with clear roles when your business is ready to move beyond an owner-only workspace.", status: "Roadmap" }
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "CloudInvoice", url: appUrl, logo: `${appUrl}/icon.svg`, description: "GST-ready invoicing and payment collection software for independent businesses." },
    { "@type": "WebSite", name: "CloudInvoice", url: appUrl, description: "CloudInvoice helps independent businesses create invoices, collect payments, and understand revenue." },
    { "@type": "SoftwareApplication", name: "CloudInvoice", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: appUrl, description: "GST-aware invoice creation, private client payment pages, UPI QR codes, Stripe payments, client management, and revenue analytics." },
    { "@type": "FAQPage", mainEntity: marketingFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }
  ]
};

function MiniDashboard() {
  return (
    <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-500 hover:border-zinc-700 hover:shadow-2xl sm:p-6">
      <div className="grid min-h-[32rem] overflow-hidden rounded-xl border border-zinc-800 bg-black lg:grid-cols-[13rem_1fr]">
        {/* Sidebar */}
        <aside className="hidden border-r border-zinc-800 bg-zinc-900/50 p-5 lg:block">
          <div className="flex items-center gap-2.5 text-sm font-semibold text-white transition-transform duration-300 hover:scale-105">
            <span className="grid size-8 place-items-center rounded-lg bg-zinc-800 text-xs font-bold text-white">
              S
            </span>
            <span>Studio North</span>
          </div>

          <nav className="mt-10 space-y-1.5 text-sm">
            {["Overview", "Invoices", "Clients", "Analytics"].map((item, index) => (
              <div
                key={item}
                className={
                  index === 0
                    ? "rounded-lg bg-zinc-800 px-3 py-2.5 font-medium text-white transition-all duration-300 hover:bg-zinc-700"
                    : "px-3 py-2.5 text-zinc-500 transition-all duration-300 hover:bg-zinc-800/50 hover:text-zinc-400"
                }
              >
                {item}
              </div>
            ))}
          </nav>

          <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">DUE TOMORROW</p>
            <p className="mt-3 text-lg font-bold text-white">₹56,640.00</p>
            <p className="mt-1 text-xs text-zinc-500">INV-00042</p>
          </div>
        </aside>

        {/* Main content */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">WORKSPACE OVERVIEW</p>
              <h2 className="mt-2 text-2xl font-bold text-white">A clearer view of your cash flow.</h2>
            </div>
            <span className="rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-400 transition-colors duration-300 hover:border-zinc-700 hover:bg-zinc-800">
              July 2026
            </span>
          </div>

          {/* Stats */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Collected", value: "₹2,84,500", caption: "+18.4% this month" },
              { label: "Outstanding", value: "₹46,280", caption: "8 active invoices" },
              { label: "Active clients", value: "42", caption: "+5 this month" },
            ].map((stat) => (
              <div key={stat.label} className="group rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:scale-105">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 transition-colors duration-300 group-hover:text-zinc-400">{stat.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-xs text-zinc-400">{stat.caption}</p>
              </div>
            ))}
          </div>

          {/* Chart and action */}
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">Billed vs. collected</p>
                  <p className="mt-1 text-xs text-zinc-500">Six months of revenue</p>
                </div>
                <BarChart3 className="size-5 text-zinc-500" />
              </div>

              <div className="mt-8 flex h-32 items-end gap-2">
                {[30, 42, 55, 39, 68, 56, 73, 63, 81, 70, 92, 78].map((height, index) => (
                  <div key={index} className="flex h-full flex-1 items-end gap-px">
                    <span className="w-1/2 rounded-t bg-zinc-700 transition-all duration-300 hover:bg-zinc-600" style={{ height: `${height}%` }} />
                    <span className="w-1/2 rounded-t bg-zinc-600 transition-all duration-300 hover:bg-zinc-500" style={{ height: `${Math.max(height - 16, 10)}%` }} />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-sm bg-zinc-700" />
                  Billed
                </span>
                <span className="flex items-center gap-2">
                  <i className="size-2 rounded-sm bg-zinc-600" />
                  Collected
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">NEXT ACTION</p>
              <div className="mt-5 flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-zinc-800 bg-black text-zinc-400 transition-colors duration-300 hover:border-zinc-700">
                  <MailCheck className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Send INV-00042</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-500">Ready for Acme Tech</p>
                </div>
              </div>
              <button
                type="button"
                className="mt-5 w-full rounded-lg border border-zinc-800 bg-black py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:scale-105"
              >
                Review invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <MarketingShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl">
          {/* Animated badge */}
          <div className="flex justify-center animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-400 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800">
              <Sparkles className="size-3.5" />
              THE FINANCIAL OS FOR INDEPENDENT BUSINESS
            </div>
          </div>

          {/* Animated headline */}
          <h1 className="mt-12 text-center text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl animate-slide-up">
            The work is done.
            <br />
            <span className="text-zinc-400">
              Now make the payment inevitable.
            </span>
          </h1>

          {/* Animated description */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg text-zinc-400 sm:text-xl animate-slide-up-delay">
            CloudInvoice turns a completed project into a payment experience your client understands at a glance—GST-ready, private, and designed to close the loop.
          </p>

          {/* Animated CTA buttons */}
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up-delay-2">
            <Link
              href="/sign-in"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105 hover:shadow-lg"
            >
              Create your first invoice
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href="#product"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:scale-105"
            >
              Explore the product
              <ChevronRight className="size-4" />
            </a>
          </div>

          {/* Animated trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 animate-fade-in-delay">
            <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
              <CheckCircle2 className="size-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
              <CheckCircle2 className="size-4" />
              GST calculation built in
            </span>
            <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
              <CheckCircle2 className="size-4" />
              Private client payment pages
            </span>
          </div>

          {/* Animated stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-zinc-800 pt-12 text-center animate-fade-in-delay-2">
            <div className="transition-transform duration-300 hover:scale-110">
              <p className="text-3xl font-bold text-white">₹2.4Cr+</p>
              <p className="mt-2 text-sm text-zinc-500">Invoiced monthly</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-110">
              <p className="text-3xl font-bold text-white">1,200+</p>
              <p className="mt-2 text-sm text-zinc-500">Active businesses</p>
            </div>
            <div className="transition-transform duration-300 hover:scale-110">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="mt-2 text-sm text-zinc-500">Payment success rate</p>
            </div>
          </div>
        </div>

        {/* Animated dashboard preview */}
        <div className="mt-20 sm:mt-24 animate-fade-in-delay-3">
          <MiniDashboard />
        </div>
      </div>


    </section>
    <section className="border-y border-white/[.08] bg-white/[.02]"><div className="mx-auto grid max-w-7xl divide-y divide-white/[.07] px-5 md:grid-cols-3 md:divide-x md:divide-y-0"><div className="py-7 text-center"><p className="text-sm font-semibold text-white">Invoicing without the invoice anxiety</p><p className="mt-1 text-sm text-zinc-500">The details stay visible from draft to payment.</p></div><div className="py-7 text-center"><p className="text-sm font-semibold text-white">Built for service businesses</p><p className="mt-1 text-sm text-zinc-500">Freelancers, studios, agencies, consultants.</p></div><div className="py-7 text-center"><p className="text-sm font-semibold text-white">Designed around trust</p><p className="mt-1 text-sm text-zinc-500">Clear data boundaries and verified payment events.</p></div></div></section>
    <section id="features" className="border-t border-zinc-800 bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 animate-fade-in">THE ESSENTIALS, BEAUTIFULLY CONNECTED</p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl animate-slide-up">
            The details clients need.
            <br />
            The control you need.
          </h2>
          <p className="mt-6 text-lg text-zinc-400 animate-slide-up-delay">
            Every screen has one job: make the next financial step feel obvious. No bloat. No brittle spreadsheet hand-offs.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureSet.map(({ icon: Icon, title, text, status }, index) => (
              <article
                key={title}
                className="group relative rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:scale-105 hover:shadow-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-12 items-center justify-center rounded-lg border border-zinc-800 bg-black transition-all duration-300 group-hover:border-zinc-700 group-hover:scale-110">
                    <Icon className="size-5 text-white" />
                  </div>
                  <span
                    className={
                      status === "Live"
                        ? "rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-white transition-all duration-300 group-hover:border-zinc-600 group-hover:bg-zinc-700"
                        : "rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-zinc-500"
                    }
                  >
                    {status.toUpperCase()}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-zinc-100">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/features"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 hover:text-zinc-300 hover:gap-3"
          >
            See every feature
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
    <div id="product"><ProductShowcase /></div>
    <section className="border-y border-white/[.08] bg-white/[.015] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="marketing-eyebrow">WHY CLOUDINVOICE</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-5xl">Your invoice is not a document. It’s the last mile of your work.</h2><p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">When that last mile is vague, fragmented, or awkward, payment takes longer and your brand loses the confidence you built in the project itself.</p><div className="mt-8 rounded-2xl border border-violet-300/15 bg-violet-400/[.06] p-5"><p className="text-sm font-semibold text-violet-100">The CloudInvoice principle</p><p className="mt-2 text-sm leading-7 text-zinc-300">Give every completed project a clear amount, a clear reason, and a clear way to pay—then make that experience feel considered.</p></div></div><div className="overflow-hidden rounded-2xl border border-white/[.09]"><div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/[.08] bg-white/[.025] px-5 py-4 text-xs font-bold uppercase tracking-[.12em] text-zinc-500"><span>Moment</span><span>Fragmented workflow</span><span className="text-violet-200">CloudInvoice</span></div>{[{ moment: "Creating", before: "Copy a past file", after: "Build a reusable draft" }, { moment: "Tax", before: "Recalculate by hand", after: "See tax per item" }, { moment: "Collecting", before: "Ask for transfer details", after: "Send a payment-ready portal" }, { moment: "Tracking", before: "Reconcile a spreadsheet", after: "See balance and status" }].map((row) => <div key={row.moment} className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-white/[.07] px-5 py-5 text-sm last:border-0"><span className="font-semibold text-white">{row.moment}</span><span className="text-zinc-500">{row.before}</span><span className="font-medium text-zinc-200">{row.after}</span></div>)}</div></div><div className="mt-12 grid gap-4 sm:grid-cols-4">{[{ icon: Zap, title: "Save time", text: "Reuse clients and stop rebuilding billing context." }, { icon: WalletCards, title: "Get paid faster", text: "Put a clear payment route in the client’s hands." }, { icon: BadgeCheck, title: "Reduce errors", text: "Keep tax and totals visible as the invoice takes shape." }, { icon: Palette, title: "Look established", text: "Present the final step of your work with care." }].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5"><Icon className="size-5 text-violet-200" /><h3 className="mt-4 font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p></div>)}</div></div></section>
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32"><div className="absolute left-1/2 top-12 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-violet-500/[.11] blur-[120px]" /><div className="relative mx-auto max-w-7xl px-5"><div className="max-w-2xl"><p className="marketing-eyebrow">A CALMER BILLING RHYTHM</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-5xl">From a new workspace to a clearer bottom line.</h2></div><ol className="mt-14 grid gap-3 lg:grid-cols-3">{[{ number: "01", title: "Create the workspace", text: "Start with the business details that make every invoice yours." }, { number: "02", title: "Add a client", text: "Save the billing context once, so the next project starts closer to done." }, { number: "03", title: "Generate the invoice", text: "Add line items, GST treatment, terms, notes, and the template that fits." }, { number: "04", title: "Share the link", text: "Send a polished, private payment page through email or your usual channel." }, { number: "05", title: "Receive payment", text: "Offer Stripe Checkout or a UPI QR and keep the balance in view." }, { number: "06", title: "Track revenue", text: "See what was billed, what arrived, and what deserves a follow-up." }].map((step, index) => <li key={step.number} className="marketing-card relative rounded-2xl p-5"><span className="font-mono text-xs font-bold tracking-[.15em] text-violet-300">{step.number}</span><h3 className="mt-8 text-lg font-semibold text-white">{step.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{step.text}</p>{index < 5 && <ChevronRight className="absolute right-4 top-5 hidden size-4 text-zinc-700 lg:block" />}</li>)}</ol></div></section>
    <section className="border-y border-white/[.08] bg-[#0a0a0d] py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="marketing-eyebrow">INTEGRATIONS WITH A POINT OF VIEW</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-5xl">Start with the payment paths your clients already understand.</h2><p className="mt-5 text-lg leading-8 text-zinc-400">CloudInvoice keeps its active surface focused. We show what works today and label what is being explored next—no imagined integration wall.</p></div><Link href="/integrations" className="marketing-link inline-flex items-center gap-2 text-sm font-semibold">Explore integrations <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[{ name: "Stripe", detail: "Secure card checkout", status: "Active", icon: CreditCard }, { name: "UPI", detail: "Invoice QR payments", status: "Active", icon: QrCode }, { name: "Razorpay", detail: "Indian payment rails", status: "Roadmap", icon: WalletCards }, { name: "Google Drive", detail: "Document handoff", status: "Roadmap", icon: FileText }, { name: "Slack", detail: "Team notifications", status: "Roadmap", icon: BellRing }, { name: "Zapier", detail: "Workflow triggers", status: "Roadmap", icon: Zap }, { name: "Webhooks", detail: "Event notifications", status: "Roadmap", icon: Globe2 }, { name: "REST API", detail: "Developer access", status: "Roadmap", icon: LockKeyhole }].map(({ name, detail, status, icon: Icon }) => <div key={name} className="rounded-2xl border border-white/[.08] bg-white/[.025] p-5"><div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl border border-white/[.08] bg-black/30 text-zinc-200"><Icon className="size-5" /></span><span className={status === "Active" ? "text-xs font-semibold text-emerald-300" : "text-xs font-semibold text-zinc-600"}>{status}</span></div><h3 className="mt-5 font-semibold text-white">{name}</h3><p className="mt-1 text-sm text-zinc-500">{detail}</p></div>)}</div></div></section>
    <PricingPreview />
    <section id="customers" className="mx-auto max-w-7xl px-5 py-24 sm:py-32"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="marketing-eyebrow">TRUST SHOULD BE EARNED, NOT INVENTED</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-5xl">We won’t manufacture a customer wall.</h2><p className="mt-5 max-w-lg text-lg leading-8 text-zinc-400">CloudInvoice is being built to deserve strong recommendations from independent businesses. Until customer stories are published with permission, we would rather show you how the product protects the billing moment.</p><Link href="/customers" className="marketing-link mt-7 inline-flex items-center gap-2 text-sm font-semibold">Our customer commitment <ArrowRight className="size-4" /></Link></div><div className="grid gap-3 sm:grid-cols-2"><article className="marketing-card rounded-2xl p-6 sm:col-span-2"><ShieldCheck className="size-6 text-violet-200" /><h3 className="mt-5 text-xl font-semibold text-white">Payment state comes from the source of truth.</h3><p className="mt-2 max-w-2xl leading-7 text-zinc-500">A client returning to a confirmation page does not mark an invoice paid. CloudInvoice waits for Stripe’s signed webhook event before it records a card payment.</p></article><article className="marketing-card rounded-2xl p-6"><LockKeyhole className="size-6 text-violet-200" /><h3 className="mt-5 font-semibold text-white">Tenant-scoped data</h3><p className="mt-2 text-sm leading-6 text-zinc-500">Authenticated invoice and client work is scoped to the current organization.</p></article><article className="marketing-card rounded-2xl p-6"><Globe2 className="size-6 text-violet-200" /><h3 className="mt-5 font-semibold text-white">Private client links</h3><p className="mt-2 text-sm leading-6 text-zinc-500">Public payment pages use high-entropy tokens instead of internal record identifiers.</p></article></div></div></section>
    <section id="faq" className="border-t border-zinc-800 bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[.6fr_1.4fr] lg:gap-16">
          {/* Left: FAQ Header */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 animate-fade-in">
              ANSWERS, UP FRONT
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl animate-slide-up">
              Questions a practical business owner would actually ask.
            </h2>
            <p className="mt-6 text-base leading-7 text-zinc-400 animate-slide-up-delay">
              Clear answers for people, search engines, and AI assistants. No buried footnotes or vague product claims.
            </p>
            <Link
              href="/faq"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition-all duration-300 hover:text-zinc-300 hover:gap-3 animate-fade-in-delay"
            >
              Read all FAQs
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6 animate-fade-in-delay-2">
              <div className="group transition-transform duration-300 hover:scale-105">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs text-zinc-500">Support docs</p>
              </div>
              <div className="group transition-transform duration-300 hover:scale-105">
                <p className="text-2xl font-bold text-white">&lt;2hrs</p>
                <p className="mt-1 text-xs text-zinc-500">Response time</p>
              </div>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="space-y-3">
            {marketingFaqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 open:border-zinc-700 open:bg-zinc-800 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold text-white transition-colors duration-300 group-hover:text-zinc-100">
                  <span className="flex-1">{faq.question}</span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-zinc-700 bg-zinc-800 text-zinc-400 transition-all duration-300 group-hover:border-zinc-600 group-hover:bg-zinc-700 group-open:rotate-180">
                    <CirclePlus className="size-4 group-open:hidden" />
                    <CircleMinus className="hidden size-4 group-open:block" />
                  </span>
                </summary>
                <p className="mt-4 pr-8 text-sm leading-7 text-zinc-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Final CTA Section */}
    <section className="relative overflow-hidden border-t border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
      
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* Icon badge */}
        <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-zinc-800 bg-zinc-900 text-white transition-all duration-500 hover:scale-110 hover:border-zinc-700 animate-fade-in">
          <Sparkles className="size-6" />
        </div>

        {/* Heading */}
        <h2 className="mt-8 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl animate-slide-up">
          The final step of your work deserves the same care as the work itself.
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400 animate-slide-up-delay">
          Create the workspace, send the first invoice, and give the next payment a route that feels inevitable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-slide-up-delay-2">
          <Link
            href="/sign-in"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105 hover:shadow-lg"
          >
            Start with CloudInvoice
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/features"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800 hover:scale-105"
          >
            See the product
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500 animate-fade-in-delay-3">
          <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
            <CheckCircle2 className="size-4" />
            Free to start
          </span>
          <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
            <CheckCircle2 className="size-4" />
            No credit card needed
          </span>
          <span className="flex items-center gap-2 transition-colors duration-300 hover:text-zinc-400">
            <CheckCircle2 className="size-4" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  </MarketingShell>;
}
