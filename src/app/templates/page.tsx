import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, FileDown, Layers3, Moon, Sparkles } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Free Invoice Templates for Professional GST Billing",
  description: "Use Classic, Modern, or Midnight invoice templates online. Add GST details, notes, terms, and line items, then print or download the invoice as a PDF.",
  alternates: { canonical: "/templates" },
  openGraph: { type: "website", url: "/templates", title: "Free Invoice Templates for Professional GST Billing", description: "Create a professional invoice with three distinct online templates and download it as a PDF." },
  twitter: { card: "summary_large_image", title: "Free Invoice Templates for GST Billing", description: "Use Classic, Modern, or Midnight invoice templates online." },
};

const templates = [
  { id: "classic", name: "Classic", icon: Layers3, tagline: "Clear and traditional", description: "A white invoice with a familiar document structure, direct line-item table, visible totals, notes, and payment terms.", bestFor: "Consultants, contractors, accountants, and established service businesses", preview: "bg-white text-slate-950", accent: "bg-slate-950", line: "border-slate-200" },
  { id: "modern", name: "Modern", icon: Sparkles, tagline: "Clean and current", description: "A lighter presentation with more spacing and grouped financial details for clients who read invoices primarily on screen.", bestFor: "Studios, agencies, freelancers, and technology consultants", preview: "bg-slate-50 text-slate-950", accent: "bg-blue-700", line: "border-blue-100" },
  { id: "midnight", name: "Midnight", icon: Moon, tagline: "Dark and distinctive", description: "A dark client-facing invoice treatment with high-contrast amounts and restrained accents for digital delivery.", bestFor: "Digital agencies, creative studios, and modern service brands", preview: "bg-slate-950 text-white", accent: "bg-indigo-400", line: "border-slate-700" },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: appUrl }, { "@type": "ListItem", position: 2, name: "Invoice Templates", item: `${appUrl}/templates` }] },
    { "@type": "ItemList", name: "CloudInvoice invoice templates", numberOfItems: templates.length, itemListElement: templates.map((template, index) => ({ "@type": "ListItem", position: index + 1, name: `${template.name} invoice template`, description: template.description, url: `${appUrl}/templates#${template.id}` })) },
  ],
};

function Preview({ template }: { template: (typeof templates)[number] }) {
  const Icon = template.icon;
  return (
    <article id={template.id} className="marketing-card rounded-xl p-5 sm:p-6">
      <div className="flex items-start gap-3"><span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span><div><h2 className="text-xl font-semibold">{template.name}</h2><p className="mt-1 text-sm text-muted-foreground">{template.tagline}</p></div></div>
      <div className={`mt-6 rounded-lg p-4 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 ${template.preview}`}>
        <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] opacity-55">Studio North</p><p className="mt-2 text-lg font-bold">Invoice</p></div><div className="text-end"><p className="text-xs font-semibold">INV-0042</p><p className="mt-1 text-[10px] opacity-55">Due 31 Aug 2026</p></div></div>
        <div className={`my-5 h-px ${template.accent}`} />
        <div className="space-y-2 text-xs"><div className={`grid grid-cols-[1fr_auto] gap-4 border-b pb-2 ${template.line}`}><span>Brand strategy</span><span>₹40,000</span></div><div className={`grid grid-cols-[1fr_auto] gap-4 border-b pb-2 ${template.line}`}><span>GST (18%)</span><span>₹7,200</span></div><div className="grid grid-cols-[1fr_auto] gap-4 pt-1 text-sm font-bold"><span>Total</span><span>₹47,200</span></div></div>
      </div>
      <p className="mt-6 text-sm leading-7 text-muted-foreground">{template.description}</p>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[.12em] text-primary">Best for</p><p className="mt-2 text-sm text-muted-foreground">{template.bestFor}</p>
    </article>
  );
}

export default function TemplatesPage() {
  return (
    <MarketingShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <main id="main-content">
        <section className="marketing-section">
          <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl"><p className="marketing-kicker">Invoice templates</p><h1 className="marketing-title mt-4">Free invoice templates for professional GST billing.</h1><p className="marketing-copy mt-6 max-w-3xl">CloudInvoice includes three distinct invoice templates: Classic, Modern, and Midnight. Choose a style while creating the invoice, add your client and GST details, then print or download the finished document as a PDF.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/sign-in" className="marketing-button-primary">Create an invoice free <ArrowRight className="size-4" /></Link><Link href="/features" className="marketing-button-secondary">See invoice features</Link></div></div>
            <div className="mt-14 grid gap-4 lg:grid-cols-3">{templates.map((template) => <Preview key={template.id} template={template} />)}</div>
          </div>
        </section>

        <section className="marketing-section border-y bg-card">
          <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:px-8">
            <div><p className="marketing-kicker">How to use a template</p><h2 className="marketing-title mt-4">Choose the layout after the invoice details are right.</h2><p className="marketing-copy mt-6">A template changes presentation, not the commercial facts. Review the client, dates, tax mode, line items, notes, and terms before sending or downloading the invoice.</p></div>
            <ol className="grid gap-8 sm:grid-cols-2">
              {[['01','Create the invoice','Select a saved client and enter issue and due dates.'],['02','Add work and GST','Enter line items, HSN or SAC details, discounts, and the correct tax treatment.'],['03','Choose a template','Select Classic, Modern, or Midnight before saving the invoice.'],['04','Download or share','Use the browser print flow to save a PDF, or send the private invoice link.']].map(([number,title,text]) => <li key={number}><span className="font-mono text-xs font-semibold text-primary">{number}</span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{text}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="marketing-section">
          <div className="mx-auto grid max-w-[90rem] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="marketing-card rounded-xl p-6 sm:p-8"><FileDown className="size-6 text-primary" /><h2 className="mt-6 text-2xl font-semibold">Can I download an invoice template?</h2><p className="mt-4 leading-8 text-muted-foreground">CloudInvoice generates the completed invoice in your browser. Open an invoice and use Export PDF or the browser print dialog to save a PDF. The product does not currently provide blank DOCX, XLSX, or standalone template files.</p></div>
            <div className="marketing-card rounded-xl p-6 sm:p-8"><Check className="size-6 text-primary" /><h2 className="mt-6 text-2xl font-semibold">What can I customize?</h2><p className="mt-4 leading-8 text-muted-foreground">You can choose the template and set business details, client details, line items, tax mode, HSN or SAC codes, notes, terms, dates, and currency. Custom brand colors, arbitrary custom fields, invoice photography, and automatic late fees are not available today.</p></div>
          </div>
        </section>
      </main>
    </MarketingShell>
  );
}
