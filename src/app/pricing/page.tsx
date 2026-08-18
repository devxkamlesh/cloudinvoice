import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, IndianRupee, ShieldCheck } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Free Invoice App and Early Access Pricing",
  description: "Use CloudInvoice free during early access. Create GST invoices, manage clients, choose three invoice templates, download PDFs, and share private invoice links.",
  alternates: { canonical: "/pricing" },
  openGraph: { type: "website", url: "/pricing", title: "Free Invoice App and Early Access Pricing", description: "Use the current CloudInvoice invoicing workspace free during early access." },
};

const included = ["GST-ready invoice creation", "CGST, SGST, and IGST calculation", "Reusable client records", "Classic, Modern, and Midnight templates", "Browser print and PDF download", "Private client invoice links", "Revenue and outstanding balance overview", "Configured Stripe, Razorpay, and UPI payment paths"];

const faqs = [
  { question: "Can I use CloudInvoice for free?", answer: "Yes. The current early-access workspace is free. You can create invoices, save clients, use the available templates, and review revenue without entering subscription card details." },
  { question: "Will CloudInvoice charge me automatically later?", answer: "No. There is no subscription checkout in the product today. Any future paid plan would require a separate, explicit agreement and payment step." },
  { question: "Are payment processor fees included?", answer: "No fee is added by CloudInvoice today. Stripe or Razorpay may charge their own processing fees under the terms of your connected gateway account." },
  { question: "Are there plan limits?", answer: "The current release does not enforce paid tiers or feature entitlements. Fair-use and commercial plan details will be published before paid subscriptions become available." },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <main id="main-content">
        <section className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl"><p className="marketing-kicker">Pricing</p><h1 className="marketing-title mt-4">A free invoice app during early access.</h1><p className="marketing-copy mt-6 max-w-3xl">CloudInvoice does not run paid subscription checkout today. The current invoicing workspace is free to use, and the product will not start a paid plan without a clear agreement and payment step.</p></div>

            <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <article className="marketing-card rounded-xl p-6 sm:p-9">
                <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="marketing-kicker">Early access workspace</p><h2 className="mt-3 text-3xl font-semibold">CloudInvoice Free</h2><p className="mt-2 text-muted-foreground">For freelancers, agencies, consultants, and small businesses testing the current workflow.</p></div><div className="text-end"><span className="text-5xl font-semibold tracking-[-.06em]">₹0</span><p className="mt-1 text-xs text-muted-foreground">No subscription checkout</p></div></div>
                <Link href="/sign-in" className="marketing-button-primary mt-8">Create an invoice free <ArrowRight className="size-4" /></Link>
                <ul className="mt-8 grid gap-3 border-t pt-7 sm:grid-cols-2">{included.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-6"><Check className="mt-1 size-4 shrink-0 text-primary" />{item}</li>)}</ul>
              </article>
              <div className="grid gap-5">
                <article className="rounded-xl border bg-card p-6"><IndianRupee className="size-6 text-primary" /><h2 className="mt-5 text-xl font-semibold">What the free price means</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">CloudInvoice does not charge a workspace subscription today. Payment gateways remain separate services, so their account requirements and processing fees still apply.</p></article>
                <article className="rounded-xl border bg-card p-6"><ShieldCheck className="size-6 text-primary" /><h2 className="mt-5 text-xl font-semibold">What happens before paid plans</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Plan scope, taxes, renewal terms, cancellation, refunds, and support terms will be published before CloudInvoice accepts a subscription payment.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section border-y bg-card">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
            <div><p className="marketing-kicker">Pricing questions</p><h2 className="marketing-title mt-4">No paid plan hidden in the fine print.</h2><p className="marketing-copy mt-6">These answers describe the current release, not a proposed pricing table.</p></div>
            <div className="divide-y border-y">{faqs.map((faq) => <details key={faq.question} className="group py-5"><summary className="cursor-pointer list-none font-semibold">{faq.question}<span className="float-end text-xl font-normal text-primary transition-transform duration-150 group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p></details>)}</div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
