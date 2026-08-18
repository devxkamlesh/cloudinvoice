import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileDown, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Customer commitment",
  description: "A transparent account of the safeguards and product boundaries CloudInvoice can support today.",
  alternates: { canonical: "/customers" },
};

const commitments = [
  { icon: ShieldCheck, title: "Payment state is verified", text: "Stripe and Razorpay payment outcomes are recorded only after the application checks the relevant webhook or signature. A browser redirect is not treated as proof of payment." },
  { icon: UsersRound, title: "Workspace data is scoped", text: "Authenticated client and invoice queries resolve the current organization and are intended to limit records to that workspace." },
  { icon: LockKeyhole, title: "Client links are opaque", text: "Public invoice pages use high-entropy tokens rather than sequential invoice IDs. The sender and recipient should still treat every payment link as confidential." },
  { icon: FileDown, title: "Invoice documents stay portable", text: "Individual invoices can be printed or saved as PDF through the browser. Bulk data export and self-service account deletion are not available yet." },
];

export default function CustomersPage() {
  return (
    <MarketingShell>
      <main id="main-content">
        <section className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <p className="marketing-kicker">Customer commitment</p>
              <h1 className="marketing-title mt-4">Trust should be earned before it becomes a testimonial.</h1>
              <p className="marketing-copy mt-6 max-w-3xl">CloudInvoice does not publish invented logos, customer counts, or case studies. Customer stories will appear here only with permission. Until then, the useful thing to publish is what the product does and where its current boundary sits.</p>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-2">
              {commitments.map(({ icon: Icon, title, text }) => <article key={title} className="marketing-card rounded-xl p-6 sm:p-8"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><h2 className="mt-7 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}
            </div>

            <section className="mt-16 grid gap-8 rounded-2xl border bg-card p-6 sm:p-9 lg:grid-cols-[.8fr_1.2fr]">
              <div><p className="marketing-kicker">Current boundaries</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em]">What CloudInvoice does not claim.</h2></div>
              <ul className="space-y-4 text-sm leading-7 text-muted-foreground">
                <li>There is no published customer testimonial until a customer approves one.</li>
                <li>There is no self-service bulk export or account-deletion workflow today.</li>
                <li>There is no published backup-retention or historical uptime commitment.</li>
                <li>There is no claim of SOC 2, ISO 27001, PCI DSS certification, or an independent security audit.</li>
              </ul>
            </section>

            <div className="mt-14 flex flex-wrap gap-3"><Link href="/security" className="marketing-button-primary">Review the trust center <ArrowRight className="size-4" /></Link><Link href="/privacy" className="marketing-button-secondary">Read the privacy policy</Link></div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
