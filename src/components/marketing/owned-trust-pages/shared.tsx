import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { MarketingShell } from "@/components/marketing/site-shell";
import { cn } from "@/lib/utils";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type Crumb = {
  label: string;
  href?: string;
};

export function marketingMetadata(input: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: input.path },
    openGraph: {
      type: "website",
      url: input.path,
      siteName: "CloudInvoice",
      title: `${input.title} | CloudInvoice`,
      description: input.description
    },
    twitter: {
      card: "summary_large_image",
      title: `${input.title} | CloudInvoice`,
      description: input.description
    }
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function breadcrumbSchema(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? new URL(item.href, appUrl).toString() : undefined
    }))
  };
}

export function PageBreadcrumbs({ items }: { items: Crumb[] }) {
  return <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
    {items.map((item, index) => <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
      {index > 0 && <ChevronRight aria-hidden="true" className="size-3.5 text-zinc-700" />}
      {item.href ? <Link href={item.href} className="transition hover:text-zinc-200">{item.label}</Link> : <span className="text-zinc-300">{item.label}</span>}
    </span>)}
  </nav>;
}

export function TrustPage({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  className
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  crumbs: Crumb[];
  children: React.ReactNode;
  className?: string;
}) {
  return <MarketingShell>
    <main id="main-content" className={cn("relative isolate overflow-hidden bg-background text-foreground", className)}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[46rem] bg-[radial-gradient(ellipse_70%_45%_at_50%_-5%,rgba(100,102,255,.20),transparent_72%),radial-gradient(ellipse_38%_30%_at_87%_16%,rgba(159,103,255,.12),transparent_80%)]" />
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pt-20">
        <PageBreadcrumbs items={crumbs} />
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-.055em] text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
          <div className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</div>
        </div>
      </section>
      {children}
    </main>
  </MarketingShell>;
}

export function Section({
  eyebrow,
  title,
  children,
  className,
  id
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return <section id={id} className={cn("mx-auto max-w-7xl px-5 py-14 sm:py-20", className)}>
    {(eyebrow || title) && <div className="mb-9 max-w-3xl">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">{eyebrow}</p>}
      {title && <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-foreground sm:text-3xl">{title}</h2>}
    </div>}
    {children}
  </section>;
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("marketing-card rounded-xl", className)}>{children}</div>;
}

export function Notice({
  title,
  children,
  tone = "indigo"
}: {
  title: string;
  children: React.ReactNode;
  tone?: "indigo" | "amber" | "rose" | "emerald";
}) {
  const tones = {
    indigo: "border-indigo-300/20 bg-indigo-400/[.08] text-indigo-100",
    amber: "border-amber-300/20 bg-amber-300/[.08] text-amber-50",
    rose: "border-rose-300/20 bg-rose-300/[.08] text-rose-50",
    emerald: "border-emerald-300/20 bg-emerald-300/[.08] text-emerald-50"
  };
  return <aside className={cn("rounded-2xl border p-5", tones[tone])} aria-label={title}>
    <h2 className="text-sm font-semibold">{title}</h2>
    <div className="mt-2 text-sm leading-6 text-zinc-300">{children}</div>
  </aside>;
}

export function PageCta({
  title,
  description,
  href = "/sign-in",
  label = "Get started"
}: {
  title: string;
  description: string;
  href?: string;
  label?: string;
}) {
  return <section className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:pb-28">
    <div className="relative overflow-hidden rounded-3xl border border-white/[.1] bg-[linear-gradient(125deg,rgba(109,107,255,.20),rgba(255,255,255,.055)_48%,rgba(166,103,255,.15))] p-7 sm:p-10">
      <div aria-hidden="true" className="absolute -right-16 -top-20 size-72 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="relative max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-[-.035em] text-foreground sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-xl leading-7 text-muted-foreground">{description}</p>
        <Link href={href} className="marketing-button-primary mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          {label} <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  </section>;
}

export function LegalMeta({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-6 text-zinc-500">{children}</p>;
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="text-indigo-200 underline decoration-indigo-200/35 underline-offset-4 transition hover:text-white hover:decoration-white">{children}</Link>;
}
