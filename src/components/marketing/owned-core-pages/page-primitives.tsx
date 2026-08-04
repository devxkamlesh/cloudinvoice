import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MarketingJsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PageBackdrop({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="relative isolate overflow-hidden bg-[#050505] text-zinc-100">
      <div aria-hidden="true" className="marketing-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[48rem] opacity-60" />
      <div aria-hidden="true" className="marketing-halo pointer-events-none absolute -top-56 left-1/2 -z-10 h-[36rem] w-[54rem] -translate-x-1/2 opacity-90" />
      {children}
    </main>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="marketing-eyebrow">{children}</p>;
}

export function PrimaryLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${className}`}
    >
      {children} <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export function SecondaryLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/[.14] bg-white/[.035] px-5 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-white/[.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] ${className}`}
    >
      {children}
    </Link>
  );
}

// `titleId` exists so a section using aria-labelledby can point at this real <h2>.
// Without it, callers were forced to hang the id off an unrelated element, which
// made the section announce the wrong name.
export function SectionHeading({ eyebrow, title, description, align = "left", titleId }: { eyebrow: string; title: ReactNode; description?: ReactNode; align?: "left" | "center"; titleId?: string }) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={titleId} className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-8 text-zinc-400 sm:text-lg">{description}</p> : null}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3" role="list">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-300">
          <span aria-hidden="true" className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-violet-300/15 text-[10px] text-violet-200">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BreadcrumbJsonLd({ name, path }: { name: string; path: string }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return (
    <MarketingJsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
          { "@type": "ListItem", position: 2, name, item: `${appUrl}${path}` }
        ]
      }}
    />
  );
}
