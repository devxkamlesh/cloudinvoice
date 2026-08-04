# CloudInvoice — Page and Feature Status

| | |
|---|---|
| **Commit** | `453079c` (`main`, matches VPS deployment) |
| **Date** | 2026-08-05 |
| **Live at** | `http://161.118.176.26:3002` |
| **Companion doc** | [`CODE_AUDIT.md`](./CODE_AUDIT.md) — issue detail and fixes |

## How status was determined

- **Route inventory** — filesystem enumeration of every `page.tsx` and `route.ts` under `src/app`
- **Renders?** — every page file confirmed to have a default export, and `npx tsc --noEmit` **passes clean**, so all imports resolve and all 24 pages compile and render
- **Works?** — read the code path and checked whether it does what the UI claims
- **Credentials** — from the `.env` audit: `DATABASE_URL`, `BETTER_AUTH_SECRET`, and Cloudinary are real; Stripe and Resend are placeholders; Upstash is empty

## Legend

| | Meaning |
|---|---|
| **OK** | Renders and does its job |
| **DEFECT** | Renders, but has a bug that produces wrong output or dead UI |
| **BLOCKED** | Code is complete and correct, waiting on a credential or the domain |
| **MISSING** | No implementation exists |
| **404** | Not a route at all |

---

# Pages

**Totals: 34 pages, all render. 5 API routes. 0 dead link targets.**

> **Updated 2026-08-05 (feature build)** — 11 new routes since the original audit: `/mission`, `/contact`, `/status`, `/suspended`, `/forgot-password`, `/reset-password`, `/invoices/[id]/edit`, and four `/admin` pages. Manual payment recording, invoice edit/void/delete, password reset, a platform role model, and an admin panel all shipped. See [Feature build](#feature-build--2026-08-05) at the end for the full record, and [`CODE_AUDIT.md`](./CODE_AUDIT.md) for what remains open. AWS Activate readiness is in [`AWS_ACTIVATE.md`](./AWS_ACTIVATE.md).
>
> **The single most important open item is unchanged:** `/api/upload` is still unauthenticated.

## Marketing pages — 15, public

| Route | Status | Notes |
|---|---|---|
| `/` | **DEFECT** | Renders fine. Homepage comparison grid is built from `<div>` instead of a table, so screen readers get orphan strings. Claims full status lifecycle incl. overdue/void as "Live" — both unreachable. 3 unused imports. |
| `/pricing` | **DEFECT** | Renders. Contradicts two other pricing sources on Starter templates and analytics. `Cell()` puts `aria-label` on a bare SVG and span, so both comparison states are unlabelled. Advertises batch export, custom fields, priority support — none implemented. |
| `/features` | **OK** | Skip link **verified working** — `PageBackdrop` does set `id="main-content"`. Section `aria-labelledby` bug fixed, and two inaccurate claims corrected. |
| `/templates` | **OK** | Not deeply reviewed. |
| `/customers` | **OK** | Not deeply reviewed. Claims payment state comes only from verified webhooks — accurate in code, but aspirational until a Stripe key exists. |
| `/changelog` | **OK** | Dead "Back to resources" link repointed to `/`. |
| `/integrations` | **DEFECT** | Dead "Contact support" link repointed to `/faq`. Still claims UPI "Instant confirmation", "OAuth 2.0", and "APIs are documented, versioned" — none true. |
| `/faq` | **OK** | |
| `/api` | **OK** | Previously had the highest broken-link density on the site — 4 dead CTAs. All repointed to real destinations, and the contact-driven copy rewritten to stop asking readers to write to a channel that does not exist. |
| `/status` | **OK** | **New.** Grouped component list with an aggregate banner. Reports 6 operational, 2 not configured, 1 pending across 9 components — counts are derived from the data, not hardcoded. Deliberately publishes no uptime percentage, no incident history, and no 90-day bars, because none is measured. States plainly that it is maintained by hand and co-hosted with the app. |
| `/contact` | **OK** | **New.** Four routed channels (support, billing, integrations, security), each stating what to include. Needs no backend — uses `mailto`, so nothing silently fails the way a fake form would. While `NEXT_PUBLIC_CONTACT_LIVE` is false it publishes the addresses but says mail is not reachable yet, instead of inviting a message that would bounce. |
| `/security` | **OK** | Best-written page on the site — explicitly refuses SOC 2, ISO, PCI, HIPAA, and uptime claims. Its `/status` link now resolves. |
| `/privacy` | **OK** | 1 unused import. |
| `/terms` | **OK** | 1 unused import. |
| `/cookies` | **OK** | |

## Auth page — 1, public

| Route | Status | Notes |
|---|---|---|
| `/sign-in` | **DEFECT** | Sign-in and sign-up both work. Displays `Don&apos;t have an account?` literally — the entity sits in a JS string, not JSX. No "Forgot password?" link, because password reset does not exist. Hand-rolled validation is weaker than the unused `authSignUpSchema`. |

## App pages — 8, auth-gated

All correctly scope queries by `organizationId`, and all redirect to `/sign-in` or `/onboarding` via `requireOrganization()`. Tenant isolation is sound throughout.

| Route | Status | Notes |
|---|---|---|
| `/onboarding` | **DEFECT** | Creates workspace + owner membership in a transaction. But `currency` is unvalidated server-side — a crafted POST stores an invalid code and permanently crashes every money-formatting page for that org. |
| `/dashboard` | **DEFECT** | Renders. **"Paid revenue" and "Outstanding" are computed from only the 6 most recent invoices** (`take: 6`), so both headline numbers are wrong past 6 invoices. Sidebar active-state highlight never works. |
| `/invoices` | **OK** | Full list, correct scoping. |
| `/invoices/new` | **OK** | Live GST totals, field array, correct empty state when no clients exist. |
| `/invoices/[id]` | **DEFECT** | Renders. **Fetches `payments: true` and never displays it** — there is no payment history UI. No edit, void, or delete action exists. |
| `/clients` | **DEFECT** | Lists clients with invoice counts. No edit or delete, so a wrong GSTIN or address is permanent. |
| `/analytics` | **DEFECT** | 6-month billed vs collected chart works. But "collected" is attributed to the invoice's **issue** month, not the payment month, so the collection curve is misleading. |
| `/settings` | **OK** | Business details, GSTIN, invoice prefix, UPI ID all persist correctly. |

## Public app page — 1

| Route | Status | Notes |
|---|---|---|
| `/pay/[token]` | **DEFECT** | Renders invoice, totals, UPI QR, and Stripe button. Correctly `noindex`. Two problems: **DRAFT invoices are publicly payable** (no status gate), and it **writes to the DB during render** to set VIEWED, so any prefetch or email scanner marks it viewed. |

## API routes — 5

| Route | Status | Notes |
|---|---|---|
| `GET /api/health` | **OK** | Returns 200. Container reports healthy since the `127.0.0.1` fix. |
| `/api/auth/[...all]` | **OK** | Better Auth handler. Sign-in, sign-up, sign-out, session all functional. |
| `POST /api/payments/checkout` | **BLOCKED** | Logic is correct — status gate, balance check, metadata on both session and payment intent. Blocked on placeholder `STRIPE_SECRET_KEY`; returns 503. Separately, `success_url`/`cancel_url` derive from request origin and **will break once nginx proxies to loopback**. |
| `POST /api/webhooks/stripe` | **BLOCKED** | Well built: verifies signature, idempotent on `stripePaymentId`, updates balance and derives PAID vs PARTIALLY_PAID inside a transaction. Blocked on placeholder `STRIPE_WEBHOOK_SECRET`; returns 503. Only handles `checkout.session.completed` — no refund or failure events. |
| `POST /api/upload` | **DEFECT** | Functional, Cloudinary credentials are real. **No authentication, no file-type allowlist, no size cap**, and `resource_type: "auto"`. Not called by any code. Also crawlable — `robots.ts` does not disallow `/api/`. |

## Dead link targets — 0, resolved

All six are gone. Verified by grepping `src/**/*.{ts,tsx}` for each target: `"/docs"`, `"/help"`, `"/blog"`, `"/resources"`, and `"/contact"` all return **0 hits**.

| Target | Was | Now |
|---|---|---|
| `/docs` | empty dir, linked from `/api` | link → `/integrations`; dir deleted |
| `/help` | empty dir, `/integrations` "Contact support" | link → `/faq`; dir deleted |
| `/resources` | empty dir, `/changelog` + a default prop | `/changelog` → `/`; default prop removed; dir deleted |
| `/blog` | empty dir, unlinked | dir deleted |
| `/contact` | never existed, `/api` ×3 | 2 repointed, 1 section rewritten |
| `/status` | never existed, `/security` | **page created** |

The four directories were empty, so git never tracked them — they existed only in the local working tree, never in the deployed clone.

**Still open:** `src/app/not-found.tsx` is dashboard-themed, not wrapped in `MarketingShell`, and its only action links to the auth-gated `/dashboard`. No longer reachable via a broken marketing link, but still the wrong destination for a mistyped URL. Tracked as `WEB-2` in [`CODE_AUDIT.md`](./CODE_AUDIT.md).

---

# Features

**Totals: 16 working, 6 working with a defect, 4 blocked on credentials, 21 missing.**

## Working

| Feature | Where | Note |
|---|---|---|
| Email + password sign-up | `lib/auth.ts`, `/sign-in` | Open registration |
| Email + password sign-in | same | |
| Sign-out | `dashboard/header.tsx` | Redirects to `/` |
| Session persistence | `lib/auth.ts` | 14-day expiry, 1-day refresh |
| Workspace creation | `onboarding/actions.ts` | Auto-slug with collision handling (`workspace-2`, `-3`…) |
| Owner membership | same | Created in a transaction with the org |
| Client creation | `clients/actions.ts` | GSTIN and state-code validated by regex |
| Invoice creation | `invoices/actions.ts` | |
| GST calculation | `lib/invoice.ts` | CGST+SGST split for intra-state, IGST for inter-state, per line item |
| Sequential invoice numbering | `invoices/actions.ts` | Prefix + zero-padded counter, allocated inside a **Serializable** transaction — correctly safe under concurrency |
| Invoice list and detail | `/invoices`, `/invoices/[id]` | |
| Public payment page | `/pay/[token]` | Unguessable cuid token, `noindex` |
| UPI QR generation | `/pay/[token]` | Correct `upi://pay` URI with payee, name, amount, note |
| Share payment link | `invoice-actions.tsx` | Clipboard copy |
| Export PDF | `print-invoice.tsx` | Browser print dialog, not server-rendered PDF |
| Org settings | `settings/actions.ts` | Business details, GSTIN, prefix, UPI ID |
| Health check | `/api/health` | |
| 3 invoice templates | schema + `/pay/[token]` | classic / modern / midnight, applied as CSS on the pay page |
| Dark mode | `theme-toggle.tsx` | Persists to localStorage |
| Multi-tenant isolation | `lib/organization.ts` | Every query scoped by `organizationId`. No leak found. |

## Working, with a defect

| Feature | Problem |
|---|---|
| Dashboard KPIs | "Paid revenue" and "Outstanding" computed from 6 rows only |
| Revenue analytics | Collected amounts attributed to issue month, not payment month |
| Invoice email | Marks invoice **SENT even when delivery fails** — Resend's error is never checked. Also blocked on credentials. |
| Sidebar navigation highlight | `x-pathname` header is read but never set, so nothing ever highlights |
| Invoice VIEWED tracking | Fires on any passive fetch, including link prefetch and email scanners |
| File upload | Works, but completely unauthenticated |
| Dark mode | Flash of wrong theme on load — no blocking script before paint |
| Line-item discounts | Applied to the math, but folded into `subtotal` and never shown as a discount anywhere |

## Blocked on credentials or domain

Code is complete. Nothing to build, just configuration.

| Feature | Blocked on |
|---|---|
| Stripe Checkout | `STRIPE_SECRET_KEY` is a placeholder |
| Stripe payment confirmation | `STRIPE_WEBHOOK_SECRET` is a placeholder |
| Invoice email delivery | `RESEND_API_KEY` is a placeholder (**and** BUG-1 above) |
| HTTPS / secure cookies | `cloudinvoice.co.in` on GoDaddy client hold. nginx vhost installed and waiting. |

## Missing — no implementation

### Invoice lifecycle
| Feature | Note |
|---|---|
| Edit an invoice | An invoice is **immutable from creation**. A typo is permanent. |
| Void or cancel an invoice | `VOID` status is read once, never assigned |
| Delete an invoice | |
| Overdue detection | `OVERDUE` never assigned. No scheduler. Can be derived from `dueDate` at query time. |
| Invoice-level discount | `Invoice.discountAmount` column exists, referenced by zero code |
| Payment history UI | `/invoices/[id]` fetches `payments` and discards it |
| Recurring invoices | |
| Batch export | Advertised on `/pricing` |

### Payments
| Feature | Note |
|---|---|
| **Record a manual payment** | Largest gap. `UPI`, `BANK_TRANSFER`, `CASH`, `OTHER` are all declared in `PaymentMethod` and **never written**. Only the Stripe webhook creates a payment row. |
| **UPI reconciliation** | Direct consequence: the QR collects real money and the invoice stays unpaid forever. `/integrations` advertises "Instant confirmation". |
| Refunds | `REFUNDED` status exists; no webhook handler, no action |
| Partial payment entry | Status exists and the webhook derives it, but nothing manual can trigger it |
| Stripe Connect | `Organization.stripeAccountId` unused — payments go to the platform account |

### Clients
| Feature |
|---|
| Edit a client |
| Delete a client |
| Client detail page / per-client history |

### Auth and accounts
| Feature | Note |
|---|---|
| **Password reset** | Not configured in Better Auth. A user who forgets their password is **permanently locked out**. No "Forgot password?" link exists. |
| Email verification | `requireEmailVerification: false`; `Verification` model unused for this |
| Social / OAuth sign-in | No `socialProviders` configured. `/integrations` claims "OAuth 2.0". |
| Rate limiting | `UPSTASH_*` vars declared, read by zero files. Sign-in is brute-forceable. |
| Team invitations | `Membership` supports it; no invite flow |
| Role enforcement | `Membership.role` written once, **never read**. Any member can change org settings. |
| Organization switching | `getCurrentMembership` always picks the oldest membership |

### Billing
| Feature | Note |
|---|---|
| Subscriptions / plan tiers | **No plan, tier, or subscription field exists in the schema.** Three priced tiers are advertised on top of nothing. Honestly disclosed as "not enabled yet". |
| Usage limits | Nothing to enforce, since no tiers exist |

### Other advertised but absent
| Feature | Advertised at |
|---|---|
| Customer-facing REST API | `/api`, `/integrations` — roadmap Q1 2027 |
| Customer-facing webhooks | `/integrations` — roadmap Q1 2027 |
| Payment reminders | `/changelog` — roadmap Q4 2026 |
| Organization logo | `Organization.logoUrl` unused. Likely the intended purpose of `/api/upload`. |
| Custom fields / branding | `/pricing` |
| Server-rendered PDF | Export is `window.print()`, not a generated PDF |
| Multi-currency | Selectable at onboarding, but `money()` hardcodes the `en-IN` locale and a non-INR org produces an invalid UPI URI |

---

# Summary

**What genuinely works end to end today:** sign up, create a workspace, add clients, create GST-correct invoices with sequential numbering, view them, and share a private payment page carrying a working UPI QR code. Multi-tenant isolation is solid, and invoice numbering is concurrency-safe.

**The three things that would most surprise a user:**

1. An invoice cannot be edited or voided after creation.
2. A UPI payment can be received with no way to mark the invoice paid.
3. A forgotten password locks the account permanently.

**Cheapest fixes with the largest effect:** authenticate `/api/upload`, check the Resend error before marking SENT, validate currency, fix the `not-found.tsx` exit link, and add ESLint `ignores` so the lint gate reports something real.

Full detail and fix sketches for every item: [`CODE_AUDIT.md`](./CODE_AUDIT.md).

---

# Fixed 2026-08-05

Dead links removed and a real `/status` page added. Verified with `npx tsc --noEmit` (exit 0) and `npx eslint src` (**0 errors**, 5 pre-existing warnings in files not touched).

## Added

**`src/app/status/page.tsx`** — a service status page built on the same `TrustPage` primitives as `/security`.

- Aggregate banner reading **"Core invoicing is operational"**, not "All systems operational", because two components are deliberately unconfigured and an all-clear would be false
- Components grouped into Core platform, Invoicing, Payments and delivery, and Network
- Three states: Operational, Not configured, Pending — each with a legend explaining what it means, since "not configured" is not something a user can infer
- Status shown as a **dot plus a text label**, never colour alone
- Rendered as a `<ul>` rather than a table: each row is an item with a state, not a cell in a cross-referenced grid, so a list is the honest semantic choice
- Static rings instead of `animate-pulse`, avoiding the reduced-motion problem flagged elsewhere in the audit

What the page deliberately does **not** show, and says so in a code comment so nobody adds it later:

- No uptime percentage or SLA
- No 90-day uptime bars or response-time sparklines — those need recorded history, and drawing them from nothing is exactly the dishonesty the page exists to avoid
- No incident feed

It also states plainly that it is maintained by hand and served by the same infrastructure as the app, so it cannot be a reliable outage signal. A "Planned" section lists what would make it trustworthy: independent monitoring, a recorded incident history, and a monitored contact channel.

## Changed

| File | Change |
|---|---|
| `src/app/api/page.tsx` | Hero CTAs `/docs` + `/contact` → `/integrations` + `/changelog`. Mid-page `/contact` → `/faq`. Availability card `/contact` link removed, copy rewritten to say there is no published integration contact yet rather than inviting one, and a `/status` link added. Bottom band repointed from `/contact` to `/sign-in` with matching copy. Removed the unused `CardLink` import. |
| `src/app/changelog/page.tsx` | "Back to resources" → "Back to home" (`/`), matching the pattern on `/pricing` and `/integrations`. |
| `src/app/integrations/page.tsx` | "Contact support" → "Read the FAQ" (`/faq`). |
| `src/components/marketing/owned-resource-pages/ui.tsx` | `Breadcrumbs` no longer defaults to a `Resources` parent at `/resources`. The middle segment is now opt-in — pass `parent` and `parentHref` together. Decorative chevrons marked `aria-hidden`. |
| `src/components/marketing/site-shell.tsx` | Added **Service status** to the footer Resources column, so the page has a real entry point rather than being reachable only from `/security`. |

## Deleted

`src/app/blog/`, `src/app/docs/`, `src/app/help/`, `src/app/resources/` — all confirmed empty before removal.

## Not done

**`/status` is not in the sitemap.** `src/app/sitemap.ts` still returns only the homepage, so the new page is invisible to crawlers via sitemap — as are 12 other live routes. Adding `/status` alone would be inconsistent; the sitemap needs fixing as a whole. Tracked as `WEB-3`.

---

# Fixed 2026-08-05 (second pass)

Support email moved onto the CloudInvoice domain, `/contact` added, sitemap completed. Verified: `npx tsc --noEmit` exit 0, `npx eslint src` **0 errors** (5 pre-existing warnings in untouched files), and **0 remaining references** to `cloudinvoice.app` or `dailyhabitos` anywhere in `src`.

## Email corrected

`.env` was pointing at an unrelated project's domain:

| Variable | Was | Now |
|---|---|---|
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `support@dailyhabitos.online` | `support@cloudinvoice.co.in` |
| `EMAIL_FROM` | `CloudInvoice <billing@dailyhabitos.online>` | `CloudInvoice <billing@cloudinvoice.co.in>` |

Also removed three hardcoded `hello@cloudinvoice.app` mailto links in `pricing-content.tsx` — a domain that is not owned — repointing them to `/contact`.

> **Tradeoff to be aware of.** The dailyhabitos address could actually receive mail. `cloudinvoice.co.in` cannot yet, because the domain is on registrar hold. Domain consistency was the right call, but it means these mailboxes are not deliverable until the hold clears and MX records exist. `NEXT_PUBLIC_CONTACT_LIVE` exists precisely so the site does not advertise a bouncing address in the meantime — leave it `false` until mail is actually arriving.
>
> `EMAIL_FROM` additionally requires the domain to be **verified with Resend** before invoice email will send. Until then `src/lib/email.ts` falls back to Resend's onboarding sender.

## Added

- **`src/lib/contact.ts`** — one source of truth for `SUPPORT_EMAIL` and `SECURITY_EMAIL`, with env overrides and correct hardcoded defaults. Deliberately not dependent on a build-time `NEXT_PUBLIC_*` var being present, which is the trap described in `OPS-4`.
- **`src/app/contact/page.tsx`** — see the table above.

## Changed

| File | Change |
|---|---|
| `src/app/sitemap.ts` | Rewritten. Was one homepage entry; now lists **all 15 public routes** with per-route priority and change frequency. Resolves `WEB-3`. |
| `src/app/opengraph-image.tsx` | Hardcoded `cloudinvoice.app` replaced with a host derived from `NEXT_PUBLIC_APP_URL`, falling back to `cloudinvoice.co.in`. Also dropped a stale OpenNext comment. |
| `src/components/marketing/site-shell.tsx` | Footer now sources the address from `lib/contact`, adds **Contact** to the Company column, and falls back to a `/contact` link when mail is not live. |
| `src/components/marketing/owned-core-pages/pricing-content.tsx` | Three unowned-domain mailtos → `/contact`. |
| `.env.example` | Rewritten. Was missing `POSTGRES_PASSWORD` (which `docker-compose.yml` requires via `${VAR:?}` and which broke the VPS migration), all four Cloudinary vars, and the contact vars. Now grouped, commented, and complete. Resolves `TOOL-2`. |
| `docker-compose.yml` | Passes `NEXT_PUBLIC_SECURITY_EMAIL` and `NEXT_PUBLIC_CONTACT_LIVE`. |

## Still open

`WEB-2` (404 dead-ends), `A11Y-1` (nav invisible 640–1280px), `WEB-4` (three conflicting pricing tables), `WEB-5` (unbacked claims). All four affect how credible the site looks and all four are small. See [`CODE_AUDIT.md`](./CODE_AUDIT.md) and the readiness assessment in [`AWS_ACTIVATE.md`](./AWS_ACTIVATE.md).

---

# Fixed 2026-08-05 (third pass)

Contact notice removed, `/features` accuracy and accessibility pass. `npx tsc --noEmit` exit 0, `npx eslint src` **0 errors**.

## Contact notice removed

The "Email is not reachable yet" banner is gone, and the `NEXT_PUBLIC_CONTACT_LIVE` gate behind it was removed rather than left as dead config. Addresses on `/contact` and in the footer now always render as working `mailto:` links.

Removed from `src/lib/contact.ts`, `src/app/contact/page.tsx`, `src/components/marketing/site-shell.tsx`, `.env.example`, and `docker-compose.yml`. Verified 0 remaining references.

> Still true, just no longer stated on the page: mail to `support@cloudinvoice.co.in` needs the domain's MX records before it arrives.

## `/features` — real defects fixed

**Section was announcing the wrong name.** The capabilities section had `aria-labelledby="feature-grid-title"`, but that id was conditionally attached to the **first capability card's `<h3>`**. So screen readers announced the section as "Professional invoices" instead of its actual heading. `SectionHeading` had no way to expose an id, which is why the id had been hung off an unrelated element.

Added a `titleId` prop to `SectionHeading` so the id sits on the real `<h2>`, and removed the conditional id from the card.

**Two claims the code does not support:**

| Claim | Where | Corrected to |
|---|---|---|
| "Paid, open, and **overdue** context" | `feature-product-tour.tsx` | "Draft, sent, viewed, partially paid, and paid states" — `OVERDUE` is never assigned by any code (`BUG-8`), so overdue context does not exist |
| UPI "**Instant confirmation**" | `integrations/page.tsx` | "Paid directly to your UPI ID" — nothing confirms a UPI payment (`GAP-2`). This was the most misleading line on the site, sitting under a green ACTIVE badge. |

Also strengthened the UPI FAQ answer on `/features` to state plainly that CloudInvoice does not see a UPI payment arrive and that marking it paid is a manual step, while Stripe card payments are confirmed automatically by a verified webhook.

**Accessibility on the product tour:**

- `role="tablist"` now behaves like one — arrow keys, Home, and End move between tabs, with `tabIndex={-1}` on inactive tabs per the ARIA tabs pattern. Previously the tabs were announced as tabs but had no keyboard navigation.
- Added `useReducedMotion()`. The panel previously blurred and slid on every tab change with no `prefers-reduced-motion` escape; it now cross-fades instead.
- Decorative icons and the selection dot marked `aria-hidden`.

**Verified, not a defect:** the `#main-content` skip link on `/features` works. `PageBackdrop` does set that id. This was flagged as unverified in the original audit.

## Still open on the marketing surface

`WEB-2` (404 dead-ends), `A11Y-1` (nav invisible 640–1280px), `WEB-4` (three conflicting pricing tables). `WEB-5` is now partially addressed — the UPI and overdue claims are fixed; "OAuth 2.0" and "APIs are documented, versioned" on `/integrations` remain.

---

# Feature build — 2026-08-05

Nine sequential tasks. `npx tsc --noEmit` produced zero output and `npx eslint src` reported 0 errors and 0 warnings across 96 files after every one.

## New routes — 11

| Route | Auth | What it is |
|---|---|---|
| `/mission` | public | Why the product exists. Every principle carries an `evidence` line tying it to real code. No invented founder story, team, or incorporation — and no data-portability claim, since export is not implemented. |
| `/contact` | public | Four routed channels (support, billing, integrations, security), each stating what to include. `mailto` based, so no backend and nothing silently fails the way a fake form would. |
| `/status` | public | Grouped component list with an aggregate banner. Publishes no uptime figure, no incident feed, and no 90-day bars, because none is measured. |
| `/suspended` | authed | Where a suspended account lands. States plainly that nothing was deleted and access can be restored. |
| `/forgot-password` | public | Requests a reset link. Shows the same confirmation whether or not the account exists, to avoid account enumeration. |
| `/reset-password` | public | Consumes the one-time token. Three states: missing token, form, success. |
| `/invoices/[id]/edit` | authed | DRAFT only. Redirects to the detail page for any other status, so the route is guarded as well as the action. |
| `/admin` | **admin** | Platform totals from database aggregates, plus newest accounts. |
| `/admin/users` | **admin** | Search, filter, paginate. Suspend, restore, promote, demote. |
| `/admin/organizations` | **admin** | Read-only workspace list with member, client, and invoice counts. |
| `/admin/invoices` | **admin** | Read-only, status-filtered, platform-wide. |

## Features that moved from missing to working

| Feature | Note |
|---|---|
| **Record a manual payment** | The largest gap in the original audit. `UPI`, `BANK_TRANSFER`, `CASH`, and `OTHER` were declared and never written, so a UPI payment could never be reconciled. Now recordable with amount, date, method, and reference. Overpayment is **refused** with a message naming the outstanding amount, because a mistyped extra digit would otherwise mark the invoice paid and corrupt revenue. |
| **Remove a payment** | Manual entries only. A Stripe payment cannot be deleted here — refunds belong in Stripe and flow back through the webhook. |
| **Payment history** | Was fetched by the detail page and thrown away. Now rendered, with Stripe rows labelled "Verified by webhook" instead of offering a delete button. |
| **Edit an invoice** | DRAFT only. A sent invoice is a document the client already holds, so correcting one is a void plus a replacement, which leaves a trail. The invoice number is never reassigned. |
| **Void an invoice** | Makes `VOID` reachable for the first time. Refused when a successful payment exists. |
| **Delete a draft** | DRAFT only, so the numbering sequence never develops unexplained gaps. |
| **Password reset** | A forgotten password previously meant permanent lockout with no recovery path. One-time tokens, one-hour expiry. Still needs `RESEND_API_KEY` to actually deliver. |
| **Overdue visibility** | Derived from `dueDate < now` rather than the `OVERDUE` status nothing ever assigns. Dashboard shows a count, an alert banner, and marks overdue rows. |
| **Role enforcement** | `Membership.role` was written once at signup and read by nothing, so every member held owner rights. Now a typed enum, and `updateOrganization` requires OWNER. |
| **Account suspension** | Reversible, enforced at a single chokepoint on every request. |
| **Admin panel** | See below. |

## Bugs fixed

| Was | Now |
|---|---|
| Invoice marked SENT even when the email failed | Delivery is confirmed first. Resend resolves `{data, error}` without throwing, and that error was being discarded. |
| Unvalidated currency could permanently break a workspace | Validated against a Zod enum. An arbitrary code reached `Intl.NumberFormat` and threw `RangeError` on every page that formats money. |
| Dashboard headline figures computed from 6 rows | Database aggregates. Collected now comes from confirmed payment rows, not from summing PAID invoice totals. |
| Sidebar highlight never worked | Was reading an `x-pathname` header nothing set. Now `usePathname`. |
| `Don&apos;t have an account?` rendered literally | The entity sat in a JS string, not JSX. |
| Nav invisible 640–1280px | Breakpoints paired at `lg`. |
| Notification bell did nothing | Removed. |

## Admin panel — how it is guarded

`requireAdmin()` runs at **8 independent points**: the layout, all four pages, and all three actions. A layout guard does not protect server actions, because those are independently addressable HTTP endpoints.

It responds **404 rather than 403**, so a non-admin gets no confirmation the area exists.

Deliberate limits:

- An admin cannot suspend or demote themselves
- The last remaining admin cannot be demoted — counted inside a transaction, so two concurrent demotions cannot both succeed
- Suspending a fellow admin is refused; demote first
- **Nothing deletes users, workspaces, or invoices.** Suspension is reversible; deleting a tenant's financial records is not

## Two things to do before this works on the VPS

**1. Run the migration.** New columns and enums; the app will error without them.

```
cd /home/ubuntu/cloudinvoice && git pull
npm run db:deploy
docker compose up -d --build
```

**2. Make yourself an admin.** Promotion is intentionally unreachable from any request path, so there is no UI for the first one. That is the design: no request-handling bug can grant platform access.

```
docker exec -it cloudinvoice-postgres psql -U cloudinvoice -d cloudinvoice \
  -c "UPDATE \"User\" SET \"platformRole\" = 'ADMIN' WHERE email = 'you@example.com';"
```

Then `/admin` appears in the dashboard sidebar and further admins can be promoted from the UI.

## Still open

Re-verified by grep, not assumed:

- **`/api/upload` is still unauthenticated** — zero auth references in the file. Highest-severity item in the audit and untouched by this build.
- No rate limiting anywhere; `UPSTASH_*` still read by zero files
- DRAFT invoices still publicly payable, and `/pay/[token]` still writes to the database on GET
- Checkout still derives its redirect URLs from `request.url`, which breaks behind the nginx proxy
- No client edit or delete
- `discountAmount` still has 0 references — a dead column
- `npm run lint` still lints `.next` and always exits 1; the clean results above come from `npx eslint src`
- `prisma.ts` still carries AWS Lambda comments and a `beforeExit` handler that never fires under Docker
- Three conflicting pricing tables; `/integrations` still claims OAuth 2.0 and a documented versioned API
- 404 page still sends marketing visitors to an auth-gated route
- Stripe and email remain unconfigured; TLS still blocked on the domain

Full detail for each in [`CODE_AUDIT.md`](./CODE_AUDIT.md).
