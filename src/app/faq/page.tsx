import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CircleMinus, CirclePlus } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { marketingFaqs } from "@/lib/marketing-content";

export const metadata: Metadata = {
  title: "Online Invoice Generator FAQ",
  description: "Answers about creating invoices online for free, GST calculation, invoice templates, PDF downloads, private client links, UPI, Stripe, and Razorpay.",
  alternates: { canonical: "/faq" },
};

const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: marketingFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };

export default function FaqPage() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <main id="main-content" className="marketing-noise">
        <section className="marketing-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="marketing-kicker">Online invoice generator FAQ</p>
            <h1 className="marketing-title mt-4 max-w-4xl">Answers about creating invoices, bills, GST totals, and payment links.</h1>
            <p className="marketing-copy mt-6 max-w-3xl">CloudInvoice is a free early-access invoice app for creating GST-ready invoices online. The answers below describe the current product, including its account, download, payment, and template limits.</p>
            <div className="mt-14 divide-y border-y">
              {marketingFaqs.map((faq, index) => <details key={faq.question} className="group py-5"><summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-semibold"><span><span className="me-3 font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>{faq.question}</span><span className="grid size-7 shrink-0 place-items-center rounded-full border text-muted-foreground"><CirclePlus className="size-4 group-open:hidden" /><CircleMinus className="hidden size-4 group-open:block" /></span></summary><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:ps-8">{faq.answer}</p></details>)}
            </div>
            <div className="mt-14 rounded-xl border bg-card p-7 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><h2 className="text-xl font-semibold">Ready to create an invoice?</h2><p className="mt-2 text-sm text-muted-foreground">Set up a free workspace, add one client, and build the first invoice online.</p></div><Link href="/sign-in" className="marketing-button-primary mt-5 sm:mt-0">Create an invoice free <ArrowRight className="size-4" /></Link></div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
