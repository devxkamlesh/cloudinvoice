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
    <main id="main-content" className="relative isolate overflow-hidden bg-background text-foreground">
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
      className={`marketing-button-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      {children} <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}

export function SecondaryLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`marketing-button-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
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
      <h2 id={titleId} className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">{description}</p> : null}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3" role="list">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-foreground">
          <span aria-hidden="true" className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] text-primary">✓</span>
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
