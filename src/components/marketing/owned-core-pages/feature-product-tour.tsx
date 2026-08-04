"use client";

import { AnimatePresence, motion } from "motion/react";
import { BarChart3, CheckCircle2, CreditCard, FileText, QrCode, ShieldCheck } from "lucide-react";
import { useId, useState } from "react";

const tours = [
  {
    id: "invoice",
    label: "Invoice builder",
    icon: FileText,
    kicker: "FROM BRIEF TO BILL",
    title: "The details that matter, already in reach.",
    text: "Build a GST-aware invoice from a calm workspace. Client records, line items, due dates, templates, notes, and tax treatment stay together instead of across tabs.",
    highlights: ["CGST + SGST or IGST calculation", "GSTIN, HSN, SAC, and state-code fields", "Classic, Modern, and Midnight invoice styles"]
  },
  {
    id: "payment",
    label: "Payment experience",
    icon: CreditCard,
    kicker: "LESS FOLLOW-UP",
    title: "Make it obvious how to pay.",
    text: "Every sent invoice gets a private payment page. Your client can see the amount due, pay by card through Stripe Checkout, or scan a UPI QR code where you have configured UPI.",
    highlights: ["Unique, unguessable payment links", "Stripe signatures verified before status changes", "UPI QR generated for the exact balance due"]
  },
  {
    id: "clarity",
    label: "Revenue clarity",
    icon: BarChart3,
    kicker: "THE OPERATING VIEW",
    title: "Know what has been billed—and what arrived.",
    text: "Separate revenue collected from outstanding invoices. The dashboard keeps your latest client activity and current balances visible, without turning a small business into an accounting project.",
    highlights: ["Paid, open, and overdue context", "Monthly billed versus collected totals", "Client history in the same workspace"]
  }
] as const;

function InvoicePreview() {
  return <div className="grid min-h-[20rem] place-items-center p-5 sm:p-8"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111217] p-5 shadow-[0_28px_80px_rgba(0,0,0,.45)]"><div className="flex items-start justify-between border-b border-white/10 pb-4"><div><div className="size-8 rounded-lg bg-gradient-to-br from-violet-300 to-indigo-400" /><p className="mt-3 text-sm font-semibold text-white">Ash &amp; Co. Studio</p><p className="mt-1 text-xs text-zinc-500">INV-2026-0148</p></div><span className="rounded-full border border-amber-200/15 bg-amber-200/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200">Due Aug 12</span></div><div className="mt-5 space-y-3 text-xs"><div className="flex justify-between"><span className="text-zinc-200">Brand strategy retainer</span><span className="text-zinc-400">₹48,000</span></div><div className="flex justify-between"><span className="text-zinc-500">GST · 18%</span><span className="text-zinc-500">₹8,640</span></div></div><div className="mt-5 rounded-xl border border-violet-300/15 bg-violet-300/[.07] p-4"><div className="flex items-end justify-between"><div><p className="text-[10px] font-semibold tracking-[.12em] text-zinc-500">AMOUNT DUE</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">₹56,640</p></div><FileText className="size-5 text-violet-200" /></div><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-violet-300 to-indigo-300" /></div></div></div></div>;
}

function PaymentPreview() {
  return <div className="grid min-h-[20rem] place-items-center p-5 sm:p-8"><div className="grid w-full max-w-md gap-3 sm:grid-cols-[1.22fr_.78fr]"><div className="rounded-2xl border border-white/10 bg-[#111217] p-5 shadow-[0_28px_80px_rgba(0,0,0,.45)]"><div className="flex items-center justify-between"><p className="text-xs font-medium text-zinc-400">Invoice INV-0148</p><ShieldCheck className="size-4 text-emerald-300" /></div><p className="mt-6 text-[10px] font-semibold tracking-[.12em] text-zinc-500">TOTAL TO PAY</p><p className="mt-1 text-3xl font-semibold tracking-tight text-white">₹56,640</p><button type="button" className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-xs font-semibold text-zinc-950">Pay securely <CreditCard className="size-3.5" /></button><p className="mt-3 text-center text-[10px] text-zinc-500">Powered by Stripe Checkout</p></div><div className="rounded-2xl border border-violet-200/15 bg-violet-300/[.08] p-4"><p className="text-xs font-medium text-violet-100">Or pay by UPI</p><div className="mt-4 grid aspect-square place-items-center rounded-xl bg-white p-3"><QrCode className="size-full text-zinc-900" strokeWidth={1.5} /></div><p className="mt-3 text-center text-[10px] leading-4 text-violet-100/65">Scan in any UPI app</p></div></div></div>;
}

function AnalyticsPreview() {
  const bars = [36, 49, 32, 64, 53, 80, 70];
  return <div className="grid min-h-[20rem] place-items-center p-5 sm:p-8"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111217] p-5 shadow-[0_28px_80px_rgba(0,0,0,.45)]"><div className="flex items-start justify-between"><div><p className="text-xs text-zinc-500">Collected this month</p><p className="mt-1 text-2xl font-semibold tracking-tight text-white">₹2,84,500</p></div><span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">+18.4%</span></div><div className="mt-7 flex h-28 items-end justify-between gap-2 border-b border-white/10 pb-2">{bars.map((height, index) => <div key={index} className="group flex h-full flex-1 items-end"><div style={{ height: `${height}%` }} className={`w-full rounded-t-md ${index === bars.length - 1 ? "bg-gradient-to-t from-violet-400 to-violet-200" : "bg-white/10"}`} /></div>)}</div><div className="mt-4 grid grid-cols-3 gap-3 text-[10px]"><div><p className="text-zinc-500">Open</p><p className="mt-1 text-sm font-semibold text-white">₹92,100</p></div><div><p className="text-zinc-500">Paid</p><p className="mt-1 text-sm font-semibold text-white">18</p></div><div><p className="text-zinc-500">Clients</p><p className="mt-1 text-sm font-semibold text-white">12</p></div></div></div></div>;
}

export function FeatureProductTour() {
  const [activeId, setActiveId] = useState<(typeof tours)[number]["id"]>("invoice");
  const groupId = useId();
  const active = tours.find((tour) => tour.id === activeId) ?? tours[0];
  const Preview = active.id === "invoice" ? InvoicePreview : active.id === "payment" ? PaymentPreview : AnalyticsPreview;

  return <section className="mx-auto max-w-7xl px-5 py-24 sm:py-32" aria-labelledby="product-tour-title"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="marketing-eyebrow">A CONNECTED WORKFLOW</p><h2 id="product-tour-title" className="mt-4 text-3xl font-semibold tracking-[-.045em] text-white sm:text-4xl">One quiet system for the work behind getting paid.</h2><div className="mt-8 grid gap-2" role="tablist" aria-label="CloudInvoice product capabilities">{tours.map((tour) => { const Icon = tour.icon; const selected = active.id === tour.id; return <button key={tour.id} id={`${groupId}-${tour.id}`} type="button" role="tab" aria-selected={selected} aria-controls={`${groupId}-panel`} onClick={() => setActiveId(tour.id)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${selected ? "bg-white/[.08] text-white" : "text-zinc-500 hover:bg-white/[.04] hover:text-zinc-200"}`}><span className={`grid size-8 place-items-center rounded-lg ${selected ? "bg-violet-300/15 text-violet-200" : "bg-white/[.04] text-zinc-500"}`}><Icon className="size-4" /></span><span className="text-sm font-semibold">{tour.label}</span><span className={`ml-auto size-1.5 rounded-full ${selected ? "bg-violet-200" : "bg-zinc-700"}`} /></button>; })}</div></div><div id={`${groupId}-panel`} role="tabpanel" aria-labelledby={`${groupId}-${active.id}`} className="marketing-card overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_88%_5%,rgba(139,124,255,.18),transparent_32%),#0b0c10]"><div className="border-b border-white/[.08] px-5 py-4 sm:px-6"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#ff6b63]" /><span className="size-2 rounded-full bg-[#f6c64f]" /><span className="size-2 rounded-full bg-[#62d26f]" /><span className="ml-3 h-5 w-32 rounded-md bg-white/[.05]" /></div></div><div className="grid lg:grid-cols-[1fr_.82fr]"><div className="relative border-b border-white/[.08] lg:border-b-0 lg:border-r"><AnimatePresence mode="wait"><motion.div key={active.id} initial={{ opacity: 0, y: 10, filter: "blur(5px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(4px)" }} transition={{ duration: 0.28 }}><Preview /></motion.div></AnimatePresence></div><AnimatePresence mode="wait"><motion.div key={active.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }} className="p-6 sm:p-8"><p className="text-[10px] font-bold tracking-[.15em] text-violet-200">{active.kicker}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.04em] text-white">{active.title}</h3><p className="mt-4 text-sm leading-7 text-zinc-400">{active.text}</p><ul className="mt-6 space-y-3">{active.highlights.map((highlight) => <li key={highlight} className="flex gap-2 text-sm leading-6 text-zinc-300"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet-200" />{highlight}</li>)}</ul></motion.div></AnimatePresence></div></div></div></section>;
}
