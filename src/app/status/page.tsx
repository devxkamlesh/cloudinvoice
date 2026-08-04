import type { Metadata } from "next";
import { BanknoteArrowUp, CheckCircle2, CreditCard, Database, Globe2, KeyRound, LockKeyhole, Mail, QrCode, ReceiptText, ServerCog, UsersRound } from "lucide-react";
import { InlineLink, JsonLd, Notice, PageCta, Panel, Section, TrustPage, breadcrumbSchema, marketingMetadata } from "@/components/marketing/owned-trust-pages/shared";

export const metadata: Metadata = marketingMetadata({
  title: "Service status",
  description: "The current availability of each CloudInvoice component, which capabilities are not yet configured, and how this status page is maintained.",
  path: "/status",
  keywords: ["CloudInvoice status", "service status", "invoicing uptime", "component availability"]
});

// Status is maintained by hand. There is no automated uptime monitoring in this
// deployment, so this page must never imply live instrumentation. Keep the three
// states below narrow and factual: something either works today, is deliberately
// unconfigured, or is waiting on an external dependency.
//
// Deliberately absent: the 90-day uptime bars and response-time sparklines that
// hosted status pages show. Those require recorded history. Drawing them from
// nothing would be the exact dishonesty this page is built to avoid.
type State = "operational" | "not-configured" | "pending";

const states: Record<State, { label: string; dot: string; ring: string; pill: string; hint: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-400",
    ring: "bg-emerald-400/25",
    pill: "border-emerald-400/25 bg-emerald-400/[.08] text-emerald-200",
    hint: "Available to use today"
  },
  "not-configured": {
    label: "Not configured",
    dot: "bg-zinc-400",
    ring: "bg-zinc-400/20",
    pill: "border-zinc-400/20 bg-zinc-400/[.07] text-zinc-300",
    hint: "Built, but no credentials in this deployment"
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    ring: "bg-amber-400/25",
    pill: "border-amber-400/25 bg-amber-400/[.08] text-amber-200",
    hint: "Waiting on an external dependency"
  }
};

type Component = { icon: typeof ServerCog; name: string; state: State; detail: string };

const groups: { group: string; items: Component[] }[] = [
  {
    group: "Core platform",
    items: [
      {
        icon: ServerCog,
        name: "Web application",
        state: "operational",
        detail: "The application container is running and its health endpoint responds successfully."
      },
      {
        icon: Database,
        name: "Database",
        state: "operational",
        detail: "PostgreSQL is reachable from the application and bound to loopback only on the host."
      },
      {
        icon: KeyRound,
        name: "Password reset",
        state: "not-configured",
        detail: "Requesting a reset link and setting a new password are implemented, using one-time tokens that expire after an hour. Delivery depends on the email provider below, so a link cannot reach an inbox until that is configured."
      }
    ]
  },
  {
    group: "Invoicing",
    items: [
      {
        icon: ReceiptText,
        name: "Invoice creation and editing",
        state: "operational",
        detail: "GST calculation for intra-state and inter-state supply, and sequential invoice numbering. A draft can be edited or deleted; once sent, an invoice can be voided so the record and its number are kept rather than removed."
      },
      {
        icon: UsersRound,
        name: "Client records",
        state: "operational",
        detail: "Adding clients and reusing their billing details on later invoices is available."
      },

      {
        icon: Globe2,
        name: "Client payment pages",
        state: "operational",
        detail: "Private invoice links open for recipients and show the invoice, totals, and amount due."
      }
    ]
  },
  {
    group: "Payments and delivery",
    items: [
      {
        icon: QrCode,
        name: "UPI QR codes",
        state: "operational",
        detail: "A QR code is generated for the amount due once a UPI ID is saved in workspace settings. The payment reaches your UPI ID directly, so you mark it received using Record payment on the invoice."
      },
      {
        icon: BanknoteArrowUp,
        name: "Manual payment recording",
        state: "operational",
        detail: "UPI, bank transfer, cash, and other payments can be recorded against an invoice with an amount, date, and reference. The invoice balance and status update from the payment records, and an entry can be removed if it was logged in error."
      },
      {
        icon: CreditCard,
        name: "Card payments",
        state: "not-configured",
        detail: "Stripe Checkout is implemented, but no payment credentials are set in this deployment, so card checkout returns an unavailable response instead of failing silently."
      },
      {
        icon: Mail,
        name: "Email invoice delivery",
        state: "not-configured",
        detail: "Sending an invoice by email is implemented, but no email provider credentials are set in this deployment."
      }
    ]
  },
  {
    group: "Network",
    items: [
      {
        icon: LockKeyhole,
        name: "HTTPS on the custom domain",
        state: "pending",
        detail: "The web server configuration is in place and waiting on domain registration to complete before a certificate can be issued."
      }
    ]
  }
];

const allComponents = groups.flatMap((entry) => entry.items);
const counts = {
  operational: allComponents.filter((component) => component.state === "operational").length,
  "not-configured": allComponents.filter((component) => component.state === "not-configured").length,
  pending: allComponents.filter((component) => component.state === "pending").length
};

// A dot plus a text label, never colour alone.
function StatusDot({ state, className }: { state: State; className?: string }) {
  const { dot, ring } = states[state];
  return <span className={`relative grid size-3 shrink-0 place-items-center ${className ?? ""}`}>
    <span aria-hidden="true" className={`absolute inset-0 rounded-full ${ring}`} />
    <span aria-hidden="true" className={`size-1.5 rounded-full ${dot}`} />
  </span>;
}

function StatusPill({ state }: { state: State }) {
  const { label, pill } = states[state];
  return <span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${pill}`}>
    <StatusDot state={state} />{label}
  </span>;
}

export default function StatusPage() {
  const crumbs = [{ label: "Home", href: "/" }, { label: "Service status" }];

  return <TrustPage
    eyebrow="Service status"
    title={<>Current availability, stated plainly.</>}
    description={<p>This page lists what works in CloudInvoice right now, what is deliberately not configured yet, and what is waiting on something outside the product. {counts.operational} of {allComponents.length} components are operational. It is maintained by hand rather than by an automated monitor, and it says so rather than implying otherwise.</p>}
    crumbs={crumbs}
  >
    <JsonLd data={breadcrumbSchema([{ label: "Home", href: "/" }, { label: "Service status", href: "/status" }])} />

    <Section className="border-y border-white/[.08] bg-white/[.02]" eyebrow="Components" title="Every part of the product, and where it stands">
      {/* Aggregate banner. Says "core invoicing" rather than "all systems" because two
          components are deliberately unconfigured — claiming all-clear would be false. */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-400/20 bg-[linear-gradient(115deg,rgba(16,185,129,.13),rgba(255,255,255,.03)_46%,rgba(255,255,255,.015))] p-6 sm:p-7">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-400/[.1]">
              <CheckCircle2 className="size-5 text-emerald-300" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-[-.02em] text-white sm:text-2xl">Core invoicing is operational</h3>
              <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                Everything needed to create an invoice and get it in front of a client is working. Card payments and email delivery are not configured in this deployment.
              </p>
            </div>
          </div>
          <dl className="grid shrink-0 grid-cols-3 gap-3 sm:gap-4">
            {(Object.keys(counts) as State[]).map((state) => <div key={state} className="rounded-xl border border-white/[.08] bg-black/25 px-3 py-2.5 text-center">
              <dt className="sr-only">{states[state].label}</dt>
              <dd>
                <span className="block text-xl font-semibold tabular-nums text-white">{counts[state]}</span>
                <span className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[.1em] text-zinc-500">
                  <StatusDot state={state} />
                  {state === "not-configured" ? "Unconfig" : states[state].label}
                </span>
              </dd>
            </div>)}
          </dl>
        </div>
      </div>

      {/* Grouped list, not a table. Each row is an item with a state, not a cell in a
          cross-referenced grid, so a list is the honest semantic choice here. */}
      <div className="mt-9 space-y-8">
        {groups.map(({ group, items }) => <section key={group} aria-labelledby={`group-${group.replace(/\s+/g, "-").toLowerCase()}`}>
          <div className="mb-3 flex items-baseline justify-between gap-4 px-1">
            <h3 id={`group-${group.replace(/\s+/g, "-").toLowerCase()}`} className="text-xs font-bold uppercase tracking-[.16em] text-indigo-300">{group}</h3>
            <span className="text-xs text-zinc-600">{items.length} {items.length === 1 ? "component" : "components"}</span>
          </div>
          <Panel className="overflow-hidden">
            <ul role="list" className="divide-y divide-white/[.07]">
              {items.map(({ icon: Icon, name, state, detail }) => <li key={name} className="group/row flex flex-col gap-3 p-5 transition-colors hover:bg-white/[.022] sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/[.09] bg-white/[.04] text-zinc-300 transition-colors group-hover/row:border-indigo-300/25 group-hover/row:bg-indigo-300/[.09] group-hover/row:text-indigo-200">
                  <Icon className="size-[1.15rem]" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-6 text-white">{name}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{detail}</p>
                </div>
                <div className="shrink-0 sm:pt-0.5"><StatusPill state={state} /></div>
              </li>)}
            </ul>
          </Panel>
        </section>)}
      </div>

      {/* Legend. Explains what each state actually means, since "not configured" is
          not a word users can infer the meaning of. */}
      <div className="mt-9 rounded-2xl border border-white/[.08] bg-white/[.02] p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-zinc-500">What each state means</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          {(Object.keys(states) as State[]).map((state) => <div key={state}>
            <dt><StatusPill state={state} /></dt>
            <dd className="mt-2 text-sm leading-6 text-zinc-400">{states[state].hint}</dd>
          </div>)}
        </dl>
      </div>
    </Section>

    <Section eyebrow="How to read this page" title="What this status page does and does not tell you">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Panel className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-white">Maintained by hand, on purpose.</h3>
          <div className="mt-6 space-y-5 text-sm leading-7 text-zinc-400">
            <p>CloudInvoice does not yet run automated uptime monitoring, synthetic checks, or an incident history feed. Rather than publish a dashboard that looks instrumented but is not, this page is updated by the operator when something changes.</p>
            <p>This page is also served by the same infrastructure as the rest of the product. If the application is unreachable, this page will most likely be unreachable too. A status page hosted alongside the service it reports on cannot be a reliable outage signal, and treating it as one would be misleading.</p>
            <p>&ldquo;Not configured&rdquo; describes this deployment, not a missing feature. The code path exists and is exercised; it returns a clear unavailable response until credentials are supplied. See <InlineLink href="/security">Security</InlineLink> for how payment state is verified and <InlineLink href="/changelog">Changelog</InlineLink> for what has shipped.</p>
          </div>
        </Panel>
        <div className="space-y-4">
          <Notice title="No uptime commitment" tone="amber">
            CloudInvoice does not publish an uptime percentage, a service level agreement, or historical availability data on this page, because none is currently measured. Any such figure must only appear once it is genuinely instrumented.
          </Notice>
          <Notice title="Before you rely on this" tone="indigo">
            If you operate this deployment, add external monitoring that runs independently of the application host, and publish a monitored incident contact before inviting customers.
          </Notice>
        </div>
      </div>
    </Section>

    <Section className="border-t border-white/[.08]" eyebrow="Planned" title="What would make this page trustworthy">
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          ["01", "Independent monitoring", "An external check that runs off the application host, so an outage can be detected and reported rather than silently taking this page down with it."],
          ["02", "A recorded incident history", "Dated entries describing what happened, how long it lasted, and what changed afterwards, kept even when the answer is unflattering."],
          ["03", "A monitored contact channel", "A published address that a customer can reach during an incident, and that someone is responsible for reading."]
        ].map(([number, title, text]) => <Panel key={number} className="p-6">
          <span className="font-mono text-sm text-indigo-200">{number}</span>
          <h3 className="mt-7 text-lg font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
        </Panel>)}
      </div>
    </Section>

    <PageCta title="The parts that are ready are ready to use." description="Create a workspace, add a client, and send a GST-correct invoice with a private payment page. The components marked operational above are all you need for that." />
  </TrustPage>;
}
