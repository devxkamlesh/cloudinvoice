import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Braces, Check, Clock3, Database, KeyRound, LockKeyhole, Webhook } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { PageJsonLd } from "@/components/marketing/owned-resource-pages/seo";

export const metadata: Metadata = {
  title: "Invoice API Roadmap",
  description: "CloudInvoice is working on a workspace-scoped invoice API for clients, invoices, GST line items, and verified payment events. Public API keys are not available yet.",
  alternates: { canonical: "/api" },
};

const resources = [
  { icon: Database, title: "Clients and invoices", text: "Create or reference clients, prepare invoice drafts, and read invoice state within one explicit workspace." },
  { icon: Braces, title: "GST-aware line items", text: "Represent quantities, prices, discounts, HSN or SAC codes, and intra-state or inter-state tax treatment." },
  { icon: Webhook, title: "Verified payment events", text: "Receive an event after a supported gateway payment has been verified and recorded against an invoice." },
  { icon: LockKeyhole, title: "Scoped credentials", text: "Restrict every future credential to a workspace and a documented set of permissions." },
];

export default function ApiPage() {
  return (
    <MarketingShell>
      <PageJsonLd title="CloudInvoice API roadmap" description="A transparent roadmap for the planned CloudInvoice invoice API." path="/api" type="TechArticle" />
      <main id="main-content">
        <section className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_.82fr] lg:items-center">
              <div><span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground"><Clock3 className="size-3.5 text-primary" />In development</span><h1 className="marketing-title mt-7">We are working on a public invoice API.</h1><p className="marketing-copy mt-6 max-w-3xl">CloudInvoice does not issue public API keys today. We are designing a workspace-scoped API for clients, GST-ready invoices, and verified payment events before opening access to external applications.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="marketing-button-primary">Discuss an integration <ArrowRight className="size-4" /></Link><Link href="/integrations" className="marketing-button-secondary">Current integrations</Link></div></div>
              <div className="overflow-hidden rounded-xl border bg-[#0b1024] font-mono text-slate-200 shadow-[0_30px_70px_-45px_rgba(0,0,0,.8)]"><div className="flex items-center gap-2 border-b border-white/10 px-4 py-3"><i className="size-2 rounded-full bg-red-400" /><i className="size-2 rounded-full bg-amber-300" /><i className="size-2 rounded-full bg-emerald-400" /><span className="ms-2 text-[10px] text-slate-500">planned request shape</span></div><pre className="overflow-x-auto p-5 text-xs leading-6 sm:p-6 sm:text-sm"><code>{`POST /v1/invoices\nAuthorization: Bearer workspace_key\n\n{\n  "client_id": "client_...",\n  "currency": "INR",\n  "tax_mode": "INTRA_STATE",\n  "items": [...]\n}`}</code></pre></div>
            </div>
          </div>
        </section>

        <section className="marketing-section border-y bg-card"><div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="marketing-kicker">Planned scope</p><h2 className="marketing-title mt-4">A small API around the billing workflow.</h2><p className="marketing-copy mt-6">The first release will focus on records and events already supported by the web application rather than exposing every internal endpoint.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2">{resources.map(({ icon: Icon, title, text }) => <article key={title} className="marketing-card rounded-xl p-6"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-6 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{text}</p></article>)}</div></div></section>

        <section className="marketing-section"><div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><div><p className="marketing-kicker">Before access opens</p><h2 className="marketing-title mt-4">The contract has to be safer than a copied internal route.</h2></div><ol className="space-y-7">{[["01","Define stable resources","Document client, invoice, line-item, payment, and error shapes."],["02","Scope every credential","Bind keys to one workspace and explicit permissions."],["03","Add idempotency","Make create and payment-event operations safe to retry."],["04","Publish versioned documentation","Open access only after examples, limits, and change policy are available."]].map(([number,title,text]) => <li key={number} className="grid gap-4 sm:grid-cols-[3rem_1fr]"><span className="font-mono text-xs font-semibold text-primary">{number}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></div></li>)}</ol></div></section>

        <section className="border-t bg-card"><div className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">Current availability</p><p className="mt-1 text-sm text-muted-foreground">No public keys, SDK, API SLA, or production endpoints are offered yet.</p></div><div className="flex items-center gap-2 text-sm text-muted-foreground"><KeyRound className="size-4 text-primary" />Access will be announced in the changelog.</div></div><div className="mt-6 flex flex-wrap gap-5 text-sm"><Link href="/changelog" className="inline-flex items-center gap-2 font-semibold text-primary">Follow updates <ArrowRight className="size-4" /></Link><span className="inline-flex items-center gap-2 text-muted-foreground"><Check className="size-4 text-primary" />The web app remains the supported product.</span></div></div></section>
      </main>
    </MarketingShell>
  );
}
