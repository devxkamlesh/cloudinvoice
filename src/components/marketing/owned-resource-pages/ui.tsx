import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarketingPage({ children }: { children: ReactNode }) {
  return <main className="relative isolate overflow-hidden bg-[#050505] text-zinc-100">{children}</main>;
}

export function AmbientGlow({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("pointer-events-none absolute -z-10 rounded-full bg-violet-600/15 blur-[120px]", className)} />;
}

export function Breadcrumbs({ current, parent = "Resources", parentHref = "/resources" }: { current: string; parent?: string; parentHref?: string }) {
  return <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-zinc-500"><Link href="/" className="transition hover:text-zinc-200">Home</Link><ChevronRight className="size-3" /><Link href={parentHref} className="transition hover:text-zinc-200">{parent}</Link><ChevronRight className="size-3" /><span className="text-zinc-300" aria-current="page">{current}</span></nav>;
}

type Action = {
  href: string;
  label: string;
  secondary?: boolean;
  external?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  visual,
  breadcrumbs,
  className
}: {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  actions?: Action[];
  visual?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}) {
  return <section className={cn("relative overflow-hidden border-b border-white/[.08]", className)}><AmbientGlow className="-right-32 top-10 size-[32rem]" /><AmbientGlow className="-left-48 bottom-[-20rem] size-[32rem] bg-blue-600/10" /><div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-10 sm:pb-28 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,.78fr)] lg:items-center lg:gap-16"><div>{breadcrumbs}<p className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-violet-300"><Sparkles className="size-3.5" />{eyebrow}</p><h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-.055em] text-white sm:text-6xl lg:text-[4.25rem] lg:leading-[1.02]">{title}</h1><div className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">{description}</div>{actions && <div className="mt-9 flex flex-wrap gap-3">{actions.map((action) => <CtaLink key={action.href + action.label} {...action} />)}</div>}</div>{visual && <div className="relative mx-auto w-full max-w-xl lg:max-w-none">{visual}</div>}</div></section>;
}

export function CtaLink({ href, label, secondary = false, external = false }: Action) {
  const props = external ? { target: "_blank", rel: "noreferrer" } : {};
  return <Link href={href} {...props} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300", secondary ? "border border-white/15 bg-white/[.03] text-zinc-200 hover:border-white/25 hover:bg-white/[.08]" : "bg-white text-zinc-950 hover:bg-zinc-200")}>{label}{!secondary && <ArrowRight className="size-4" />}</Link>;
}

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return <section id={id} className={cn("relative mx-auto max-w-7xl px-5 py-20 sm:py-28", className)}>{children}</section>;
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow?: string; title: ReactNode; description?: ReactNode; align?: "left" | "center" }) {
  return <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
    {eyebrow && <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-300">{eyebrow}</p>}
    <h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">{title}</h2>
    {description && <div className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">{description}</div>}
  </div>;
}

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cn("group rounded-2xl border border-white/[.10] bg-white/[.025] p-5 shadow-[0_1px_0_rgba(255,255,255,.04)_inset] transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/[.045] hover:shadow-[0_18px_55px_rgba(0,0,0,.28)]", className)}>{children}</article>;
}

export function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <span className={cn("grid size-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-300/10 text-violet-200", className)}><Icon className="size-5" /></span>;
}

export function CardLink({ href, title, children, icon: Icon, label = "Explore" }: { href: string; title: string; children: ReactNode; icon?: LucideIcon; label?: string }) {
  return <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050505]"><GlowCard className="h-full"><div className="flex items-start justify-between gap-4">{Icon ? <IconBadge icon={Icon} /> : <span /> }<ArrowRight className="mt-1 size-4 text-zinc-500 transition group-hover:translate-x-1 group-hover:text-violet-200" /></div><h3 className="mt-6 text-lg font-semibold tracking-tight text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{children}</p><span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-violet-200">{label}<ArrowRight className="size-3.5" /></span></GlowCard></Link>;
}

export function CodeWindow({ title = "cloudinvoice", children, className }: { title?: string; children: string; className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl border border-white/[.12] bg-[#0b0b0d] shadow-[0_28px_75px_rgba(0,0,0,.42)]", className)}><div className="flex items-center gap-2 border-b border-white/[.08] bg-white/[.025] px-4 py-3"><span className="size-2 rounded-full bg-rose-400/70" /><span className="size-2 rounded-full bg-amber-300/70" /><span className="size-2 rounded-full bg-emerald-300/70" /><span className="ml-2 font-mono text-[10px] text-zinc-500">{title}</span></div><pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-zinc-300 sm:p-6 sm:text-sm"><code>{children}</code></pre></div>;
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-white/[.10] bg-white/[.035] px-3 py-1.5 text-xs font-semibold text-zinc-300">{children}</span>;
}

export function DotList({ items, className }: { items: string[]; className?: string }) {
  return <ul className={cn("space-y-3", className)}>{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-400"><span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-violet-300" />{item}</li>)}</ul>;
}

export function MutedRule() {
  return <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />;
}

export function TextLink({ children, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={cn("font-semibold text-violet-200 underline decoration-violet-300/35 underline-offset-4 transition hover:text-white hover:decoration-white", props.className)}>{children}</Link>;
}
