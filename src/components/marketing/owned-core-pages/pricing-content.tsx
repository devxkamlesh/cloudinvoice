"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, CircleHelp, Sparkles } from "lucide-react";
import { useState } from "react";

export const pricingTiers = [
  {
    name: "Starter",
    description: "A composed place to send your first professional invoices.",
    monthly: "₹0",
    annual: "₹0",
    annualNote: "Free while in early access",
    action: "Create free workspace",
    href: "/sign-in",
    featured: false,
    features: ["GST-aware invoices", "3 invoice styles", "Client records", "Private payment links", "Revenue overview"]
  },
  {
    name: "Studio",
    description: "For independent professionals with a steady invoice rhythm.",
    monthly: "₹799",
    annual: "₹639",
    annualNote: "₹7,668 billed yearly · save ₹1,920",
    action: "Register interest",
    href: "/contact",
    featured: true,
    features: ["Everything in Starter", "Stripe payment collection", "UPI QR payments", "Email invoice delivery", "Payment status tracking"]
  },
  {
    name: "Business",
    description: "For agencies and growing consultancies with more to coordinate.",
    monthly: "₹1,999",
    annual: "₹1,599",
    annualNote: "₹19,188 billed yearly · save ₹4,800",
    action: "Register interest",
    href: "/contact",
    featured: false,
    features: ["Everything in Studio", "Priority workspace support", "Advanced reporting", "Team workspace planning", "Custom onboarding"]
  },
  {
    name: "Enterprise",
    description: "For teams with security, procurement, or workflow requirements.",
    monthly: "Let's talk",
    annual: "Let's talk",
    annualNote: "A plan shaped around your operating model",
    action: "Talk to our team",
    href: "/contact",
    featured: false,
    features: ["Everything in Business", "Security review support", "Implementation planning", "Commercial terms", "Dedicated success contact"]
  }
] as const;

const comparisonRows = [
  { feature: "GST-aware invoices", starter: "Included", studio: "Included", business: "Included", enterprise: "Included" },
  { feature: "Private invoice payment pages", starter: "Included", studio: "Included", business: "Included", enterprise: "Included" },
  { feature: "Invoice styles", starter: "3 styles", studio: "3 styles", business: "3 styles", enterprise: "3 styles" },
  { feature: "Stripe Checkout & payment tracking", starter: "—", studio: "Included", business: "Included", enterprise: "Included" },
  { feature: "UPI QR payment option", starter: "—", studio: "Included", business: "Included", enterprise: "Included" },
  { feature: "Advanced reporting", starter: "—", studio: "—", business: "Included", enterprise: "Included" },
  { feature: "Implementation & commercial support", starter: "—", studio: "—", business: "—", enterprise: "Included" }
] as const;

const pricingFaqs = [
  { question: "Can I use CloudInvoice for free?", answer: "Yes. The Starter workspace is available at no cost during early access, so you can set up your business, create GST-aware invoices, manage clients, and use the core invoicing workflow without entering card details." },
  { question: "Is paid-plan checkout available today?", answer: "Not yet. CloudInvoice does not run subscription checkout in the product today. You can use Starter now; Studio and Business interest registrations go directly to the team so plan availability can be shared before any charge is made." },
  { question: "What does annual billing mean for Studio and Business?", answer: "The displayed annual rate is the effective monthly price when a full year is billed in advance. Studio is ₹7,668 per year and Business is ₹19,188 per year, before any applicable taxes." },
  { question: "Does an invoice payment fee come from CloudInvoice?", answer: "CloudInvoice does not add a hidden fee to an invoice payment. If you enable Stripe, your Stripe account and its applicable payment-processing terms determine any processor fees." },
  { question: "Will I be charged automatically after early access?", answer: "No. CloudInvoice will not start a paid subscription automatically. Any future paid plan would require an explicit agreement and payment step before it begins." }
] as const;

function Price({ value, annual }: { value: string; annual: boolean }) {
  if (value === "Let's talk") return <span className="text-[2rem] font-semibold tracking-[-.05em] text-white">Let&apos;s talk</span>;
  return <><span className="text-4xl font-semibold tracking-[-.06em] text-white sm:text-[2.65rem]">{value}</span><span className="ml-1.5 text-sm text-zinc-500">/ month</span>{annual && value !== "₹0" ? <span className="ml-2 rounded-full bg-violet-300/[.1] px-2 py-1 text-[10px] font-bold text-violet-100">annual</span> : null}</>;
}

export function PricingContent() {
  const [annual, setAnnual] = useState(true);

  return <>
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-20 text-center sm:pb-20 sm:pt-28 lg:pt-36">
      <p className="marketing-eyebrow inline-flex items-center gap-2"><Sparkles className="size-3.5" /> PLANS WITH A CLEAR STARTING POINT</p>
      <h1 className="mt-5 text-5xl font-semibold tracking-[-.06em] text-white sm:text-6xl lg:text-7xl">Pricing that stays out of the way of the work.</h1>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl">Begin with a free workspace today. When you need more of CloudInvoice, choose a plan with a straightforward scope—no obscure usage meter, no invoice-payment markup.</p>
      <div className="mt-8 inline-flex items-center gap-1 rounded-xl border border-white/[.1] bg-white/[.035] p-1" aria-label="Billing interval"><button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)} className={`relative z-10 rounded-lg px-4 py-2 text-sm font-semibold transition ${!annual ? "text-zinc-950" : "text-zinc-500 hover:text-white"}`}>{!annual && <motion.span layoutId="billing-selection" className="absolute inset-0 -z-10 rounded-lg bg-white" />}Monthly</button><button type="button" aria-pressed={annual} onClick={() => setAnnual(true)} className={`relative z-10 rounded-lg px-4 py-2 text-sm font-semibold transition ${annual ? "text-zinc-950" : "text-zinc-500 hover:text-white"}`}>{annual && <motion.span layoutId="billing-selection" className="absolute inset-0 -z-10 rounded-lg bg-white" />}Yearly <span className={`${annual ? "text-violet-700" : "text-violet-200"} ml-1 text-[10px] font-bold uppercase tracking-wide`}>Save 20%</span></button></div>
      <p className="mt-4 text-xs text-zinc-600">All amounts are in INR. Applicable taxes may apply.</p>
    </section>

    <section className="mx-auto max-w-7xl px-5 pb-24 sm:pb-32" aria-label="CloudInvoice plan pricing"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{pricingTiers.map((tier) => { const displayedPrice = annual ? tier.annual : tier.monthly; return <article key={tier.name} className={`relative flex flex-col overflow-hidden rounded-[1.4rem] border p-6 ${tier.featured ? "border-violet-300/45 bg-[linear-gradient(155deg,rgba(139,124,255,.2),rgba(255,255,255,.035)_38%,rgba(255,255,255,.018))] shadow-[0_24px_70px_rgba(74,58,160,.16)]" : "border-white/[.09] bg-white/[.025]"}`}>{tier.featured ? <div className="-mx-6 -mt-6 mb-6 flex items-center justify-center gap-2 border-b border-violet-200/15 bg-violet-300/[.1] px-4 py-2 text-[10px] font-bold tracking-[.14em] text-violet-100"><Sparkles className="size-3" /> MOST POPULAR PATH</div> : null}<div><h2 className="text-lg font-semibold text-white">{tier.name}</h2><p className="mt-3 min-h-15 text-sm leading-6 text-zinc-400">{tier.description}</p></div><div className="mt-7 min-h-16"><AnimatePresence mode="wait"><motion.div key={`${tier.name}-${annual}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}><Price value={displayedPrice} annual={annual} /></motion.div></AnimatePresence><p className="mt-2 min-h-5 text-xs text-zinc-500">{annual ? tier.annualNote : tier.name === "Starter" ? "Free while in early access" : tier.name === "Enterprise" ? "A tailored commercial plan" : "Billed month to month when available"}</p></div><Link href={tier.href} className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 ${tier.featured ? "bg-white text-zinc-950 hover:bg-zinc-200" : "border border-white/[.12] bg-white/[.04] text-white hover:bg-white/[.09]"}`}>{tier.action}</Link><div className="mt-7 border-t border-white/[.08] pt-6"><p className="text-xs font-bold uppercase tracking-[.13em] text-zinc-500">Includes</p><ul className="mt-4 space-y-3">{tier.features.map((feature) => <li key={feature} className="flex gap-2 text-sm leading-5 text-zinc-300"><Check className="mt-0.5 size-3.5 shrink-0 text-violet-200" />{feature}</li>)}</ul></div></article>; })}</div><p className="mx-auto mt-6 max-w-3xl rounded-xl border border-amber-200/10 bg-amber-200/[.045] px-4 py-3 text-center text-xs leading-5 text-amber-100/70"><span className="font-semibold text-amber-100">Early-access note:</span> Starter is available now. Paid-plan checkout is not enabled in CloudInvoice yet; choosing Studio, Business, or Enterprise opens a no-obligation plan inquiry instead of a checkout flow.</p></section>

    <section className="border-y border-white/[.08] bg-white/[.018] py-24 sm:py-32" aria-labelledby="comparison-title"><div className="mx-auto max-w-7xl px-5"><div className="grid gap-8 md:grid-cols-[.75fr_1.25fr] md:items-end"><div><p className="marketing-eyebrow">COMPARE THE WORKSPACE</p><h2 id="comparison-title" className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">Choose only what the next stage requires.</h2></div><p className="max-w-2xl text-base leading-7 text-zinc-400">CloudInvoice is intentionally compact. The comparison focuses on the capabilities that change the way you invoice and collect—not a padded checklist.</p></div><div className="mt-12 overflow-x-auto rounded-2xl border border-white/[.09]"><table className="min-w-[700px] w-full border-collapse text-left text-sm"><caption className="sr-only">CloudInvoice plan comparison</caption><thead className="bg-white/[.04] text-xs font-semibold uppercase tracking-[.12em] text-zinc-500"><tr><th scope="col" className="px-6 py-4">Capability</th><th scope="col" className="px-4 py-4 text-center">Starter</th><th scope="col" className="px-4 py-4 text-center text-violet-100">Studio</th><th scope="col" className="px-4 py-4 text-center">Business</th><th scope="col" className="px-4 py-4 text-center">Enterprise</th></tr></thead><tbody>{comparisonRows.map((row) => <tr key={row.feature} className="border-t border-white/[.08]"><th scope="row" className="px-6 py-4 font-medium text-zinc-200">{row.feature}</th>{[row.starter, row.studio, row.business, row.enterprise].map((value, index) => <td key={`${row.feature}-${index}`} className={`px-4 py-4 text-center ${value === "—" ? "text-zinc-700" : index === 1 ? "font-medium text-violet-100" : "text-zinc-400"}`}>{value === "Included" ? <span className="inline-flex items-center gap-1 text-zinc-300"><Check className="size-4 text-violet-200" /><span className="sr-only">Included</span></span> : value}</td>)}</tr>)}</tbody></table></div></div></section>

    <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32"><div className="grid gap-5 lg:grid-cols-3"><article className="marketing-card rounded-2xl p-6"><p className="text-sm font-semibold text-white">Start from the actual work.</p><p className="mt-3 text-sm leading-7 text-zinc-400">Set up a workspace, add one client, and create one accurate invoice. That is enough to know whether the workflow earns its place.</p></article><article className="marketing-card rounded-2xl p-6"><p className="text-sm font-semibold text-white">No payment surprise.</p><p className="mt-3 text-sm leading-7 text-zinc-400">CloudInvoice will not move a workspace to a paid subscription or collect a card payment without a clear, explicit action from you.</p></article><article className="marketing-card rounded-2xl p-6"><p className="text-sm font-semibold text-white">Keep processor costs visible.</p><p className="mt-3 text-sm leading-7 text-zinc-400">If you use Stripe payment collection, its processing terms remain separate and visible in your Stripe account.</p></article></div></section>

    <section className="border-t border-white/[.08] bg-[#09090b] py-24 sm:py-32" aria-labelledby="pricing-faq-title"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr]"><div><p className="marketing-eyebrow">PRICING, ANSWERED</p><h2 id="pricing-faq-title" className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">No footnotes hiding the important part.</h2><p className="mt-5 text-base leading-8 text-zinc-400">Here is how CloudInvoice pricing works today, in plain language.</p></div><div className="space-y-3">{pricingFaqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-white/[.09] bg-white/[.025] p-5 open:bg-white/[.04]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-white"><span>{faq.question}</span><CircleHelp className="size-5 shrink-0 text-violet-200 transition group-open:rotate-12" /></summary><p className="mt-4 text-sm leading-7 text-zinc-400">{faq.answer}</p></details>)}</div></div></section>

    <section className="mx-auto max-w-5xl px-5 py-24 text-center sm:py-32"><p className="marketing-eyebrow">START WITH THE WORKSPACE</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.055em] text-white sm:text-5xl">Your first calm invoice is free to create.</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">Open a Starter workspace today. You can decide what comes next after the workflow has proved itself.</p><Link href="/sign-in" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]">Create free workspace <ChevronDown className="size-4 -rotate-90" /></Link></section>
  </>;
}

export { pricingFaqs };
