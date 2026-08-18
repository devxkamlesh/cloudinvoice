import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SiteNav } from "@/components/marketing/site-nav";
import { SUPPORT_EMAIL } from "@/lib/contact";

// The support address itself lives in src/lib/contact.ts so every surface that shows
// it stays in agreement. Note it only receives mail once the domain's MX records are
// in place.
//
// The header lives in site-nav.tsx because it needs client state for the mobile sheet
// (Escape to dismiss, focus return, scroll lock) and usePathname for active links.
// The footer stays here since it is static.

const footerColumns = [
  { title: "Product", links: [{ href: "/", label: "Online invoice generator" }, { href: "/features", label: "Invoice builder features" }, { href: "/templates", label: "Invoice templates" }, { href: "/pricing", label: "Free app pricing" }] },
  { title: "Resources", links: [{ href: "/changelog", label: "Changelog" }, { href: "/api", label: "API" }, { href: "/status", label: "Service status" }] },
  { title: "Company", links: [{ href: "/mission", label: "Mission" }, { href: "/customers", label: "Customers" }, { href: "/faq", label: "FAQ" }, { href: "/contact", label: "Contact" }] },
  { title: "Trust", links: [{ href: "/security", label: "Security" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/cookies", label: "Cookie policy" }] }
];

export function MarketingShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return <div className="marketing min-h-screen overflow-x-clip">
    <SiteNav />
    {children}
    {!compact && <footer className="border-t bg-card dark:bg-[#151613]">
      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">GST-ready invoicing, payment links, and cash-flow visibility for independent Indian businesses.</p>
            <Link href="/sign-in" className="marketing-link mt-5 inline-flex items-center gap-2 text-sm font-semibold">Start invoicing <ArrowRight className="size-3.5" aria-hidden="true" /></Link>
            <p className="mt-5 text-sm text-muted-foreground">Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-foreground transition-colors duration-150 hover:text-primary">{SUPPORT_EMAIL}</a></p>
          </div>
          {/* h3, not h2: these sit below page content whose sections are h2, so h2 here
              would compete with real page headings in the document outline. */}
          {footerColumns.map((column) => <div key={column.title}>
            <h3 className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">{column.title}</h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground">{link.label}</Link></li>)}
            </ul>
          </div>)}
        </div>
        <div className="mt-14 border-t pt-6 text-xs text-muted-foreground">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} CloudInvoice. Built for work that matters.</p>
            <p>Independent by design. Secure by default.</p>
          </div>
          <p className="mt-3 max-w-4xl leading-5 text-muted-foreground">
            CloudInvoice is a registered MSME under the Ministry of MSME, Government of India — Udyam Registration No: UDYAM-RJ-17-0675217
          </p>
        </div>
      </div>
    </footer>}
  </div>;
}
