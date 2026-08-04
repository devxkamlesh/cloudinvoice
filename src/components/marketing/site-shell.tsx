import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";

// Single source of truth for the public support address. Set NEXT_PUBLIC_SUPPORT_EMAIL
// once the production domain is live; until then the footer renders no mailto link
// rather than advertising an address that bounces.
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

const primaryLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/templates", label: "Templates" },
  { href: "/customers", label: "Customers" },
  { href: "/changelog", label: "Changelog" }
];

const footerColumns = [
  { title: "Product", links: [{ href: "/features", label: "Features" }, { href: "/pricing", label: "Pricing" }, { href: "/templates", label: "Templates" }, { href: "/integrations", label: "Integrations" }] },
  { title: "Resources", links: [{ href: "/changelog", label: "Changelog" }, { href: "/api", label: "API" }] },
  { title: "Company", links: [{ href: "/customers", label: "Customers" }, { href: "/faq", label: "FAQ" }] },
  { title: "Trust", links: [{ href: "/security", label: "Security" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/cookies", label: "Cookie policy" }] }
];

export function MarketingShell({ children, compact = false }: { children: React.ReactNode; compact?: boolean }) {
  return <div className="marketing min-h-screen overflow-x-clip"><header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#050505]/80 backdrop-blur-xl"><div className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between px-5"><Link href="/" aria-label="CloudInvoice home"><Logo className="text-white" /></Link><nav className="hidden items-center gap-6 xl:flex" aria-label="Primary navigation">{primaryLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm font-medium text-zinc-400 transition hover:text-white">{link.label}</Link>)}<Link href="/faq" className="text-sm font-medium text-zinc-400 transition hover:text-white">FAQ</Link></nav><div className="hidden items-center gap-3 sm:flex"><Link href="/sign-in" className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:text-white">Sign in</Link><Link href="/sign-in" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">Get started <ArrowRight className="size-3.5" /></Link></div><details className="group relative sm:hidden"><summary className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-white/10 text-zinc-200"><Menu className="size-5 group-open:hidden" /><X className="hidden size-5 group-open:block" /><span className="sr-only">Open site menu</span></summary><div className="marketing-glass absolute right-0 top-12 w-64 rounded-2xl p-3"><nav className="grid gap-1" aria-label="Mobile navigation">{[...primaryLinks, { href: "/faq", label: "FAQ" }, { href: "/sign-in", label: "Sign in" }].map((link) => <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white">{link.label}</Link>)}<Link href="/sign-in" className="mt-2 rounded-xl bg-white px-3 py-2.5 text-center text-sm font-semibold text-zinc-950">Get started</Link></nav></div></details></div></header>{children}{!compact && <footer className="border-t border-white/[.09] bg-[#070707]"><div className="mx-auto max-w-7xl px-5 py-14"><div className="grid gap-12 md:grid-cols-[1.25fr_repeat(4,1fr)]"><div><Logo className="text-white" /><p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500">The calm, reliable financial operating system for independent businesses.</p><Link href="/sign-in" className="marketing-link mt-5 inline-flex items-center gap-2 text-sm font-semibold">Start invoicing <ArrowRight className="size-3.5" /></Link>{supportEmail && <p className="mt-5 text-sm text-zinc-500">Support: <a href={`mailto:${supportEmail}`} className="text-zinc-400 transition hover:text-white">{supportEmail}</a></p>}</div>{footerColumns.map((column) => <div key={column.title}><h2 className="text-xs font-bold uppercase tracking-[.15em] text-zinc-500">{column.title}</h2><ul className="mt-4 space-y-3">{column.links.map((link) => <li key={link.href}><Link href={link.href} className="text-sm text-zinc-400 transition hover:text-white">{link.label}</Link></li>)}</ul></div>)}</div><div className="mt-14 flex flex-col gap-4 border-t border-white/[.08] pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} CloudInvoice. Built for work that matters.</p><p>Independent by design. Secure by default.</p></div></div></footer>}</div>;
}
