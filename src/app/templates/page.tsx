import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Sparkles, Palette, Moon, Layers } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";

export const metadata: Metadata = {
  title: "Invoice Templates — CloudInvoice",
  description: "Choose from Classic, Modern, or Midnight invoice templates. Each template is designed to match your brand energy while keeping client information clear.",
  alternates: { canonical: "/templates" }
};

const templates = [
  {
    id: "classic",
    name: "Classic",
    icon: Layers,
    tagline: "Professional clarity",
    description: "A clean, traditional layout that puts line items and totals front and center. Ideal for established businesses that value timeless professionalism.",
    features: [
      "Left-aligned business details",
      "Tabular line items with clear spacing",
      "Prominent total and payment terms",
      "High-contrast black text on white",
      "PDF-friendly printing layout"
    ],
    preview: {
      bg: "bg-white",
      border: "border-zinc-200",
      headerBg: "bg-zinc-50",
      textPrimary: "text-zinc-900",
      textSecondary: "text-zinc-600"
    },
    bestFor: "Legal, consulting, accounting, established agencies"
  },
  {
    id: "modern",
    name: "Modern",
    icon: Sparkles,
    tagline: "Contemporary confidence",
    description: "A balanced design with subtle visual hierarchy and generous whitespace. For businesses that want to feel current without sacrificing readability.",
    features: [
      "Centered business name with accent border",
      "Card-style line item presentation",
      "Color-coded payment status indicators",
      "Modern typography and spacing",
      "Optimized for screen viewing"
    ],
    preview: {
      bg: "bg-zinc-50",
      border: "border-zinc-300",
      headerBg: "bg-white",
      textPrimary: "text-zinc-900",
      textSecondary: "text-zinc-600"
    },
    bestFor: "Design studios, tech consultancies, creative agencies"
  },
  {
    id: "midnight",
    name: "Midnight",
    icon: Moon,
    tagline: "Bold and memorable",
    description: "A dark theme that makes invoices feel intentional and distinct. For businesses whose brand identity already leans modern and confident.",
    features: [
      "Dark background with high contrast text",
      "Accent colors for key financial data",
      "Minimalist borders and dividers",
      "Screen-first design philosophy",
      "Eye-catching for digital delivery"
    ],
    preview: {
      bg: "bg-zinc-900",
      border: "border-zinc-700",
      headerBg: "bg-zinc-800",
      textPrimary: "text-white",
      textSecondary: "text-zinc-400"
    },
    bestFor: "Digital agencies, SaaS consultants, modern studios"
  }
];

const customizationOptions = [
  {
    title: "Your logo",
    description: "Upload your business logo to appear on every invoice. Supports PNG, JPG, and SVG formats."
  },
  {
    title: "Brand colors",
    description: "Customize accent colors to match your brand identity while maintaining readability."
  },
  {
    title: "Custom fields",
    description: "Add purchase order numbers, project codes, or other business-specific fields."
  },
  {
    title: "Payment terms",
    description: "Set default terms, late fees, and payment instructions that appear on every invoice."
  }
];

function TemplatePreviewCard({ template }: { template: typeof templates[0] }) {
  return (
    <article className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800">
      {/* Icon and Name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 transition-all duration-300 group-hover:scale-110">
            <template.icon className="size-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{template.name}</h3>
            <p className="text-sm text-zinc-500">{template.tagline}</p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800">
        <div className={`${template.preview.bg} p-6`}>
          {/* Header */}
          <div className={`${template.preview.headerBg} rounded-lg border ${template.preview.border} p-4`}>
            <div className={`text-xs font-semibold uppercase tracking-wide ${template.preview.textSecondary}`}>
              Your Business Name
            </div>
            <div className={`mt-2 text-lg font-bold ${template.preview.textPrimary}`}>
              INV-00042
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-4 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className={`flex items-center justify-between rounded border ${template.preview.border} p-3`}>
                <div className={`text-xs ${template.preview.textPrimary}`}>Service Item {i}</div>
                <div className={`text-xs font-semibold ${template.preview.textPrimary}`}>₹{i * 10000}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className={`mt-4 rounded-lg border ${template.preview.border} p-3`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm font-bold ${template.preview.textPrimary}`}>Total</div>
              <div className={`text-sm font-bold ${template.preview.textPrimary}`}>₹30,000</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-6 leading-7 text-zinc-400">{template.description}</p>

      {/* Features */}
      <div className="mt-6 space-y-2">
        {template.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2 text-sm text-zinc-400">
            <Check className="mt-0.5 size-4 shrink-0 text-zinc-500" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Best For */}
      <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Best for</p>
        <p className="mt-2 text-sm text-zinc-400">{template.bestFor}</p>
      </div>
    </article>
  );
}

export default function TemplatesPage() {
  return (
    <MarketingShell>
      {/* Header */}
      <section className="relative border-b border-zinc-800 bg-[#0a0a0a] py-20 sm:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-all duration-300 hover:text-white hover:gap-3"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to home
          </Link>

          <div className="mt-8 max-w-3xl">
            <div className="flex items-center gap-3">
              <Palette className="size-8 text-white" />
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Invoice templates
              </h1>
            </div>
            <p className="mt-6 text-xl leading-8 text-zinc-400">
              Choose the template that matches your brand energy. Each design keeps client information clear while expressing your business identity.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplatePreviewCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="border-b border-zinc-800 bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              MAKE IT YOURS
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Customization options
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Every template can be customized to reflect your business identity without compromising clarity or professionalism.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2">
            {customizationOptions.map((option) => (
              <div
                key={option.title}
                className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                <h3 className="text-lg font-semibold text-white">{option.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Philosophy */}
      <section className="border-b border-zinc-800 bg-black py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              OUR DESIGN PHILOSOPHY
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Templates designed for trust
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-8 text-zinc-400">
              <p>
                Invoice templates aren&apos;t about decoration. They&apos;re about making the financial details of your work immediately clear to the person reading them.
              </p>
              <p>
                Each CloudInvoice template is designed with hierarchy, contrast, and whitespace that guide the eye to what matters: what was delivered, what it costs, and how to pay.
              </p>
              <p>
                Whether you choose Classic for its timeless reliability, Modern for its contemporary balance, or Midnight for its bold confidence, the core structure remains the same—clear line items, visible totals, and payment terms that can&apos;t be missed.
              </p>
            </div>

            <div className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-semibold text-white">What you won&apos;t find</h3>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>No decorative elements that distract from the financial information</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>No hidden terms buried in footnotes or fine print</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>No aggressive branding that overshadows the invoice purpose</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                  <span>No cluttered layouts that make line items hard to parse</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0a0a0a] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Try all three templates
            </h2>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Create a workspace and test each template with your actual business details. Switch between templates anytime—no additional cost, no migration needed.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/sign-in"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-black transition-all duration-300 hover:bg-zinc-100 hover:scale-105"
              >
                Create your first invoice
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/features"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-6 text-sm font-semibold text-white transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-800"
              >
                See all features
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
