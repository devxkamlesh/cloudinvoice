import type { Metadata } from "next";
import { CheckCircle2, Cookie, MonitorCog, ShieldCheck } from "lucide-react";
import { InlineLink, JsonLd, LegalMeta, Notice, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Cookie Policy",
  description: "See which essential cookies and browser storage CloudInvoice uses, and how to control them.",
  path: "/cookies",
  keywords: ["CloudInvoice cookies", "cookie policy", "invoice app cookie policy"]
});

export default function CookiesPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Cookie Policy" }];
  return <TrustPage
    eyebrow="Legal & privacy"
    title={<>A small, honest cookie policy.</>}
    description={<p>CloudInvoice uses essential browser storage to keep a signed-in session working and remembers a display preference when you choose one. This page describes the behavior present in the application, not a generic tracking-policy template.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Cookie Policy", href: "/cookies" }])} />
    <Section className="border-y border-white/[.08] bg-white/[.02]">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-300">Summary</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] text-white sm:text-3xl">No advertising cookie is required to use CloudInvoice.</h2>
          <LegalMeta><span className="text-zinc-300">Last updated:</span> August 1, 2026. Revisit this policy before enabling analytics, advertising, or any new embedded third-party tool.</LegalMeta>
        </div>
        <Notice title="Current implementation" tone="emerald">
          The codebase does not include a dedicated advertising, retargeting, or product-analytics SDK. If an operator adds one later, consent requirements and this policy must be updated before it is enabled for visitors.
        </Notice>
      </div>
    </Section>

    <Section eyebrow="What we use" title="Essential session support and a local theme preference">
      <div className="overflow-hidden rounded-2xl border border-white/[.09]">
        <div className="grid gap-0 border-b border-white/[.09] bg-white/[.045] p-5 text-xs font-bold uppercase tracking-[.14em] text-zinc-500 md:grid-cols-[1.1fr_1.2fr_.8fr_1fr] md:gap-5">
          <span>Type</span><span>Purpose</span><span>Essential?</span><span>Typical duration</span>
        </div>
        <div className="divide-y divide-white/[.08]">
          <div className="grid gap-3 p-5 text-sm leading-6 text-zinc-400 md:grid-cols-[1.1fr_1.2fr_.8fr_1fr] md:gap-5">
            <div><p className="font-semibold text-zinc-200">Authentication session cookie</p><p className="mt-1 text-xs text-zinc-600">Set by the authentication flow</p></div>
            <p>Lets the application recognize a signed-in user and keep the account session available across requests.</p>
            <p className="inline-flex items-start gap-2 text-zinc-300"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />Yes</p>
            <p>Session lifetime follows the Auth.js configuration used by the deployment. Browser behavior can vary with security settings, cookie controls, and sign-out activity.</p>
          </div>
          <div className="grid gap-3 p-5 text-sm leading-6 text-zinc-400 md:grid-cols-[1.1fr_1.2fr_.8fr_1fr] md:gap-5">
            <div><p className="font-semibold text-zinc-200">Theme preference</p><p className="mt-1 text-xs text-zinc-600">Browser local storage, not a cookie</p></div>
            <p>Stores whether you selected the light or dark interface so the dashboard can preserve that preference on your device.</p>
            <p className="inline-flex items-start gap-2 text-zinc-300"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />Yes, for preference</p>
            <p>Until you clear browser storage, change the theme, or use browser controls that remove it.</p>
          </div>
        </div>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="What happens outside CloudInvoice" title="Payment and browser controls">
      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="p-6"><Cookie className="size-5 text-indigo-200" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">Stripe Checkout</h3><p className="mt-3 text-sm leading-7 text-zinc-400">A card-paying client may be taken to a Stripe-hosted checkout experience. Stripe can use cookies or similar technologies under its own notice and browser controls. CloudInvoice does not control Stripe’s domain-level settings.</p></Panel>
        <Panel className="p-6"><ShieldCheck className="size-5 text-indigo-200" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">Blocking essential storage</h3><p className="mt-3 text-sm leading-7 text-zinc-400">You can block or clear cookies in browser settings, but doing so may prevent sign-in from working or sign you out. Clearing site storage resets your saved display preference.</p></Panel>
        <Panel className="p-6"><MonitorCog className="size-5 text-indigo-200" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold text-white">Future changes</h3><p className="mt-3 text-sm leading-7 text-zinc-400">New analytics, fraud prevention, chat, advertising, or embedded tools can introduce additional storage. The operator must assess consent requirements and update this page before making those tools live.</p></Panel>
      </div>
    </Section>

    <Section eyebrow="Your choices" title="How to manage cookies and local storage">
      <div className="max-w-4xl space-y-5 text-sm leading-7 text-zinc-400">
        <p>Use your browser’s site-data controls to inspect, block, or remove CloudInvoice cookies and local storage. You can generally control cookies per site, use a private-browsing window, or clear stored data when ending a session on a shared device.</p>
        <p>Signing out ends the active product session. For account, invoice, or privacy questions, use the contact process published by the service operator before public launch. See the <InlineLink href="/privacy">Privacy Policy</InlineLink> for the broader description of data processing and the <InlineLink href="/security">Security overview</InlineLink> for product-level safeguards.</p>
      </div>
    </Section>
  </TrustPage>;
}
