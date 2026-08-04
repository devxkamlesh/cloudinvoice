# CloudInvoice — Code Audit

| | |
|---|---|
| **Commit audited** | `453079c` (`main`, matches VPS deployment) |
| **Repo** | `github.com/devxkamlesh/cloudinvoice` |
| **Date** | 2026-08-05 |
| **Scope** | Full `src/`, `prisma/`, Docker and env config. Marketing surface reviewed via delegated sweep. |
| **Status** | Analysis only. No code changed. |

## How this was verified

| Check | Result |
|---|---|
| `npx tsc --noEmit` | **Passes clean, exit 0.** No type errors. |
| `npx eslint .` | Exit 1 — but see [TOOL-1](#tool-1--npm-run-lint-is-not-a-working-gate). 99.4% of output is build artifacts. |
| Targeted greps | Used to confirm dead code, unreachable enum states, and unset headers. Noted per issue. |
| Production build output | **Could not verify.** Local `.next/` is not a full production build (2 JS files in `server/app`). One issue ([OPS-4](#ops-4--next_public_app_url-may-bake-into-static-metadata)) remains unconfirmed as a result. |

The type system is healthy. Every issue below is behavioural, authorization-related, or content integrity — none of it is the kind of thing a compiler catches.

## Index by severity

**P0 — Security**
- [SEC-1](#sec-1--apiupload-has-no-authentication) `/api/upload` has no authentication
- [SEC-2](#sec-2--no-rate-limiting-anywhere) No rate limiting anywhere
- [SEC-3](#sec-3--session-cookies-in-plaintext) Session cookies in plaintext *(known, blocked on domain)*

**P1 — Bugs producing wrong state**
- [BUG-1](#bug-1--invoices-marked-sent-when-the-email-failed) ~~Invoices marked SENT when the email failed~~ — **RESOLVED**
- [BUG-2](#bug-2--unvalidated-currency-can-hard-crash-a-workspace) ~~Unvalidated currency can hard-crash a workspace~~ — **RESOLVED**
- [BUG-3](#bug-3--dashboard-kpis-computed-from-six-rows) ~~Dashboard KPIs computed from six rows~~ — **RESOLVED**
- [BUG-4](#bug-4--sidebar-active-state-can-never-highlight) ~~Sidebar active state can never highlight~~ — **RESOLVED**
- [BUG-5](#bug-5--checkout-redirect-urls-break-behind-nginx) Checkout redirect URLs break behind nginx
- [BUG-6](#bug-6--html-entity-renders-literally-on-sign-in) ~~HTML entity renders literally on sign-in~~ — **RESOLVED**
- [BUG-7](#bug-7--draft-invoices-are-publicly-payable) DRAFT invoices are publicly payable
- [BUG-8](#bug-8--overdue-and-void-are-unreachable-states) OVERDUE and VOID are unreachable states — **PARTIAL**: VOID now reachable, overdue now derived

**P2 — Missing product surface**
- [GAP-1](#gap-1--no-invoice-edit-void-or-delete) ~~No invoice edit, void, or delete~~ — **RESOLVED**
- [GAP-2](#gap-2--no-manual-payment-recording-upi-cannot-be-reconciled) ~~No manual payment recording, UPI cannot be reconciled~~ — **RESOLVED**
- [GAP-3](#gap-3--no-client-edit-or-delete) No client edit or delete
- [GAP-4](#gap-4--invoicediscountamount-is-a-dead-column) `Invoice.discountAmount` is a dead column
- [GAP-5](#gap-5--money-math-runs-through-floats) Money math runs through floats — **PARTIAL**: new payment and dashboard paths use Decimal; `calculateInvoice` still floats
- [GAP-6](#gap-6--no-rbac-and-no-org-switching) No RBAC and no org switching — **PARTIAL**: roles now enforced, no org switcher
- **NEW** No password reset — **RESOLVED**

**P3 — Tooling and hygiene**
- [TOOL-1](#tool-1--npm-run-lint-is-not-a-working-gate) `npm run lint` is not a working gate
- [TOOL-2](#tool-2--envexample-is-stale-and-incomplete) ~~`.env.example` is stale and incomplete~~ — **RESOLVED 2026-08-05**
- [TOOL-3](#tool-3--prismats-still-targets-aws-lambda) `prisma.ts` still targets AWS Lambda
- [TOOL-4](#tool-4--confirmed-dead-code) Confirmed dead code
- [TOOL-5](#tool-5--empty-route-directories) ~~Empty route directories~~ — **RESOLVED 2026-08-05**

**P4 — Marketing and content integrity**
- [WEB-1](#web-1--seven-broken-internal-links) ~~Seven broken internal links~~ — **RESOLVED 2026-08-05**
- [WEB-2](#web-2--404-page-strands-marketing-visitors) 404 page strands marketing visitors
- [WEB-3](#web-3--sitemap-lists-only-the-homepage) ~~Sitemap lists only the homepage~~ — **RESOLVED 2026-08-05**
- [WEB-4](#web-4--three-conflicting-pricing-tables) Three conflicting pricing tables
- [WEB-5](#web-5--claims-the-codebase-cannot-back) Claims the codebase cannot back
- [WEB-6](#web-6--hardcoded-support-email-violates-the-projects-own-rule) ~~Hardcoded support email violates the project's own rule~~ — **RESOLVED 2026-08-05**
- [A11Y-1](#a11y-1--navigation-disappears-between-640px-and-1280px) ~~Navigation disappears between 640px and 1280px~~ — **RESOLVED**
- [A11Y-2](#a11y-2--remaining-accessibility-defects) Remaining accessibility defects — **PARTIAL**

**Operational**
- [OPS-1](#ops-1--rotate-the-postgres-password) Rotate the Postgres password
- [OPS-2](#ops-2--tls-blocked-on-godaddy-client-hold) TLS blocked on GoDaddy client hold
- [OPS-3](#ops-3--old-history-bundle-still-on-desktop) Old history bundle still on Desktop
- [OPS-4](#ops-4--next_public_app_url-may-bake-into-static-metadata) `NEXT_PUBLIC_APP_URL` may bake into static metadata

---

# P0 — Security

## SEC-1 — `/api/upload` has no authentication

**File** `src/app/api/upload/route.ts`

The route accepts `formData`, base64-encodes the file, and uploads to your live Cloudinary account with `resource_type: "auto"`. There is no session check, no file-type allowlist, and no size cap.

Why it matters:

- Cloudinary is one of only three credential sets that are **real** in production. This hands anonymous callers an arbitrary-file CDN on your account and quota.
- `resource_type: "auto"` accepts any file type, so it can host executables or malware under your CDN domain.
- `src/app/robots.ts` allows `/` and does not disallow `/api/`, so crawlers reach it.
- Nothing in the application calls this route.

**Fix.** Simplest correct move is deletion, since no caller exists. If it is meant to back organization logo upload (`Organization.logoUrl` is unused), gate it behind `requireOrganization()`, allowlist image MIME types, cap the size, and scope the Cloudinary folder per organization.

## SEC-2 — No rate limiting anywhere

**Files** `src/lib/auth.ts`, `.env`, all API routes

`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are declared in env and read by **zero files** (grep confirmed). No throttling exists on:

- sign-in / sign-up (`src/app/api/auth/[...all]/route.ts`)
- `POST /api/payments/checkout`
- `POST /api/upload`

Compounding it, `src/lib/auth.ts` sets `emailAndPassword: { enabled: true, requireEmailVerification: false }`, so sign-up is open and unverified. The `Verification` model exists but is unused for this purpose.

**Fix.** Either wire the Upstash vars into a rate limiter on auth and payment routes, or remove the env vars so they stop implying a control that does not exist.

## SEC-3 — Session cookies in plaintext

Known and already tracked. The app is served on `http://161.118.176.26:3002` with `0.0.0.0` binding, so Better Auth session cookies cross the network in cleartext, and visitors can bypass the Cloudflare allowlist in `/etc/nginx/cf-allow.conf` by hitting the port directly.

`docker-compose.yml` already carries the TODO to switch to `127.0.0.1:3002:3000`. Blocked on [OPS-2](#ops-2--tls-blocked-on-godaddy-client-hold).

Note for cutover: once `BETTER_AUTH_URL` becomes `https://`, confirm Better Auth is issuing `Secure` cookies, and add HSTS. `src/middleware.ts` currently sets no HSTS and no CSP.

---

# P1 — Bugs producing wrong state

## BUG-1 — Invoices marked SENT when the email failed

**File** `src/app/(dashboard)/invoices/actions.ts`, `sendInvoice`

```ts
await sendInvoiceEmail({ to: invoice.client.email, ... });
await prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.SENT, sentAt: new Date() } });
```

The return value of `sendInvoiceEmail` is discarded. Resend's SDK resolves with `{ data, error }` rather than throwing on API failure, so with the current placeholder `RESEND_API_KEY` the 401 is swallowed and the next statement unconditionally marks the invoice delivered.

Result: an invoice that reads SENT with a `sentAt` timestamp, and no email. The user has no signal anything went wrong.

**Fix.** Have `sendInvoiceEmail` in `src/lib/email.ts` inspect the returned `error` and throw or return it, then only update status on confirmed success. Return the failure to the caller so `InvoiceActions` can surface it.

## BUG-2 — Unvalidated currency can hard-crash a workspace

**Files** `src/app/onboarding/actions.ts`, `src/lib/utils.ts`

```ts
const currency = String(formData.get("currency") ?? "INR");   // no allowlist
```

`createWorkspace` validates `name` but passes `currency` straight through to `Organization.currency`. The only constraint is the client-side `<select>` in `src/app/onboarding/page.tsx`.

`money()` then does:

```ts
new Intl.NumberFormat("en-IN", { style: "currency", currency, ... })
```

`Intl.NumberFormat` throws `RangeError` on an invalid currency code. The value is copied onto every invoice at creation time (`createInvoice` sets `currency: organization.currency`), so a single crafted signup POST permanently breaks:

- `/dashboard` (KPI cards)
- `/invoices` and `/invoices/[id]`
- `/analytics`
- every public `/pay/[token]` page for that org

**Fix.** Validate against a Zod enum of the four currencies the UI offers. Worth adding a defensive fallback in `money()` too, since bad data may already exist.

Related: `money()` hardcodes the `en-IN` locale for all currencies, and the UPI deep link in `src/app/pay/[token]/page.tsx` sets `cu=${invoice.currency}` — a non-INR org produces an invalid UPI URI.

## BUG-3 — Dashboard KPIs computed from six rows

**File** `src/app/(dashboard)/dashboard/page.tsx`

```ts
prisma.invoice.findMany({ ..., orderBy: { createdAt: "desc" }, take: 6 })
```

That same six-row slice is then reduced into both headline figures:

- **"Paid revenue"** — hint says "From recent invoices", which partly hedges it
- **"Outstanding" / "Awaiting collection"** — not hedged, and simply wrong past six invoices

**Fix.** Use separate `aggregate` queries scoped to `organizationId` for the totals, and keep `take: 6` only for the recent-invoices table.

## BUG-4 — Sidebar active state can never highlight

**File** `src/components/dashboard/shell.tsx`

```ts
const pathname = headerList.get("x-pathname") ?? "";
```

Grep across the repo confirms `x-pathname` is **read here and set nowhere**. `src/middleware.ts` sets only `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options`. So `pathname` is always `""` and the `pathname === href` comparison in `src/components/dashboard/sidebar.tsx` never matches.

**Fix.** Either set the header in middleware from `request.nextUrl.pathname`, or make `Sidebar` a client component using `usePathname()`. The client-component route is simpler and removes the `headers()` call from the shell.

## BUG-5 — Checkout redirect URLs break behind nginx

**File** `src/app/api/payments/checkout/route.ts`

```ts
const origin = new URL(request.url).origin;
// ...
success_url: `${origin}/pay/${invoice.publicToken}?payment=success`,
cancel_url:  `${origin}/pay/${invoice.publicToken}?payment=cancelled`
```

Two problems. Once the nginx vhost fronts the app on loopback, this origin resolves to the internal address and the post-payment redirect sends customers nowhere. And because the value derives from the request, it is Host-header influenced.

**Fix.** Build both URLs from `process.env.NEXT_PUBLIC_APP_URL`, and fail the request with a clear error if it is unset — the same pattern `sendInvoice` already uses.

## BUG-6 — HTML entity renders literally on sign-in

**File** `src/app/(auth)/sign-in/page.tsx:192`

```tsx
{mode === "signin" ? "Don&apos;t have an account?" : "Already have an account?"}
```

`&apos;` sits inside a JavaScript string literal, not JSX text, so no entity decoding happens. The sign-in screen literally displays `Don&apos;t have an account?`.

**Fix.** Use `"Don't have an account?"` with a real apostrophe, or `{"Don\u2019t have an account?"}`.

Also in this file: the `<form>` carries both `action={submit}` and an `onSubmit` that calls `preventDefault()` then invokes `submit` manually. It works, but the redundancy is fragile — pick one.

And `authSignUpSchema` / `authSignInSchema` in `src/lib/validations.ts` exist with stronger rules (uppercase, lowercase, digit) but this page hand-rolls weaker validation and never imports them. See [TOOL-4](#tool-4--confirmed-dead-code).

## BUG-7 — DRAFT invoices are publicly payable

**File** `src/app/pay/[token]/page.tsx`

The page looks up by `publicToken` and renders with **no status gate**. A DRAFT invoice you have not sent, and may still be editing, is publicly viewable and chargeable the moment the record exists. `publicToken` is generated at creation (`@default(cuid())`), not at send time.

Note the checkout route *does* gate on status (`VOID`, `PAID`), so the two paths disagree about what is payable.

Second issue in the same file: the page performs a database write during render.

```ts
if (!invoice.viewedAt && invoice.status === "SENT")
  await prisma.invoice.update({ ..., data: { status: "VIEWED", viewedAt: new Date() } });
```

Any link prefetch, email security scanner, or bot marks the invoice VIEWED. `viewedAt` is not trustworthy as an audit signal.

**Fix.** Gate the page on `status !== DRAFT` (return `notFound()` otherwise). Move the VIEWED transition out of render into an explicit action or a route handler that is not triggered by passive fetches.

## BUG-8 — OVERDUE and VOID are unreachable states

**Files** `prisma/schema.prisma`, all of `src/`

Grep confirms neither value is ever **assigned**:

- `OVERDUE` — read in filters in `dashboard/page.tsx` and `analytics/page.tsx`. No sweep job, cron, or action sets it.
- `VOID` — read once in `api/payments/checkout/route.ts`. Nothing sets it.

So overdue invoices never appear overdue, and nothing can be voided. Meanwhile `src/app/page.tsx:29` advertises the complete lifecycle — "draft to sent, viewed, partially paid, paid, overdue, or void" — tagged `"Live"`.

**Fix.** OVERDUE can be derived at query time from `dueDate < now() AND status IN (SENT, VIEWED, PARTIALLY_PAID)`, which avoids needing a scheduler. VOID needs a real action, covered in [GAP-1](#gap-1--no-invoice-edit-void-or-delete).

---

# P2 — Missing product surface

The complete write surface of the application is **five server actions**:

| Action | File |
|---|---|
| `createInvoice` | `src/app/(dashboard)/invoices/actions.ts` |
| `sendInvoice` | `src/app/(dashboard)/invoices/actions.ts` |
| `createClient` | `src/app/(dashboard)/clients/actions.ts` |
| `updateOrganization` | `src/app/(dashboard)/settings/actions.ts` |
| `createWorkspace` | `src/app/onboarding/actions.ts` |

Plus the Stripe webhook. Everything below follows from that list.

Credit where due: `createInvoice` allocates its invoice number inside a `Serializable` transaction, which correctly prevents duplicate numbers under concurrency. The Stripe webhook verifies signatures and is properly idempotent on `stripePaymentId`. Both are well built.

## GAP-1 — No invoice edit, void, or delete

An invoice is immutable from the moment it is created. A typo in an amount, a wrong client, or a wrong date is permanent, and there is no way to void or cancel. For an invoicing product this is the largest functional hole.

**Fix.** Add `updateInvoice` (restricted to DRAFT, recalculating totals through `calculateInvoice`), `voidInvoice` (sets `VOID`, allowed when no successful payment exists), and `deleteInvoice` (DRAFT only). All must scope on `organizationId` the way existing queries do.

## GAP-2 — No manual payment recording, UPI cannot be reconciled

`PaymentMethod` declares `UPI`, `BANK_TRANSFER`, `CASH`, and `OTHER`. Grep confirms **none are ever written** — only the Stripe webhook creates a `Payment` row, always with `method: STRIPE`.

So the UPI QR code on `/pay/[token]` collects real money into the merchant's UPI ID, and the invoice stays unpaid forever with no way to mark it settled. Same for a bank transfer or cash.

Meanwhile `src/app/integrations/page.tsx:33` lists **"Instant confirmation"** among UPI features, under a green `ACTIVE` badge. This is the sharpest gap between what the marketing claims and what the code does.

**Fix.** Add a `recordPayment` action: amount, method, reference, paid date. Reuse the webhook's balance logic to update `amountPaid` and derive `PAID` / `PARTIALLY_PAID`. This single action is what makes UPI a real payment path rather than a decorative QR code.

## GAP-3 — No client edit or delete

`createClient` exists alone. A client's GSTIN, address, or email cannot be corrected after creation, which matters because those values are printed on GST invoices.

## GAP-4 — `Invoice.discountAmount` is a dead column

Grep for `discountAmount` across `src/` returns **zero matches**. The schema declares it as `Decimal @default(0)` and nothing ever writes it.

Line-level discounts are handled instead inside `calculateInvoice` (`src/lib/invoice.ts`), which subtracts each discount before computing `base`. So discounts are folded silently into `subtotal` and the invoice-level column stays 0 forever. Neither the invoice detail page nor the pay page shows a discount line.

**Fix.** Either populate it as the sum of line discounts and display it, or drop the column. Leaving it is a trap for whoever writes reporting later.

## GAP-5 — Money math runs through floats

`calculateInvoice` in `src/lib/invoice.ts` does all arithmetic in JS numbers, then `createInvoice` converts via `new Prisma.Decimal(x.toFixed(2))`. Balance checks in the checkout route and pay page do `Number(invoice.total) - Number(invoice.amountPaid)`, and Stripe receives `Math.round(balance * 100)`.

Fine at current volume. Worth knowing before it isn't, particularly for tax rounding across many line items where per-line rounding can drift from the invoice total.

**Fix, when it matters.** Move `calculateInvoice` to `Prisma.Decimal` end to end, and decide explicitly whether GST rounds per line or per invoice.

## GAP-6 — No RBAC and no org switching

`Membership.role` is a free-form `String` defaulting to `"owner"`. It is written once in `createWorkspace` and **never read**. Any member of an organization can call `updateOrganization`.

Separately, `getCurrentMembership` in `src/lib/organization.ts` does:

```ts
prisma.membership.findFirst({ where: { userId }, orderBy: { createdAt: "asc" } })
```

It always resolves to the oldest membership, so a user belonging to two organizations can only ever reach the first. There is no org switcher.

Both are latent while workspaces stay single-member, but the schema invites multi-member use. Note `src/app/page.tsx:32` correctly labels team workspaces as `"Roadmap"`.

---

# P3 — Tooling and hygiene

## TOOL-1 — `npm run lint` is not a working gate

`eslint.config.mjs` declares no `ignores`, so `eslint .` walks the `.next/` build output. Measured breakdown:

| Scope | Files with problems | Errors | Warnings |
|---|---|---|---|
| **`.next/` build output** | 25 | **169** | **3133** |
| **Real source** | 7 | **1** | 8 |

The single "real" error is in `next-env.d.ts`, a Next.js-generated file (`@typescript-eslint/triple-slash-reference`).

So the command always exits 1 no matter how clean your code is. It cannot be used in CI, a pre-commit hook, or a Kiro hook, and it buries the eight genuine warnings under three thousand meaningless ones.

**Fix.** Add an `ignores` entry for `.next/**`, `node_modules/**`, and `next-env.d.ts`. This is the cheapest high-leverage fix in this document, and it should land before any broad refactor so the gate actually reports something.

The eight real warnings are all unused imports: `src/app/api/page.tsx` (`CardLink`), `src/app/page.tsx` (`Check`, `CircleHelp`, `LayoutDashboard`), `src/app/privacy/page.tsx` (`Link`), `src/app/terms/page.tsx` (`AlertTriangle`), plus two anonymous-default-export warnings in config files.

## TOOL-2 — `.env.example` is stale and incomplete

Contains leftovers from the deleted AWS stack:

```
AWS_REGION="ap-south-1"
S3_BUCKET="cloudinvoice-uploads"
```

Neither is read by any code. Missing, despite being required or consumed by `docker-compose.yml`:

| Variable | Consequence if absent |
|---|---|
| `POSTGRES_PASSWORD` | **Compose refuses to start** — the `:?` guard. This is exactly what bit the VPS migration. |
| `CLOUDINARY_CLOUD_NAME` | Upload path silently misconfigured |
| `CLOUDINARY_API_KEY` | as above |
| `CLOUDINARY_API_SECRET` | as above |
| `CLOUDINARY_URL` | as above |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Footer support link silently omitted |

`.env.example` is the only onboarding document for a fresh clone. Right now it guarantees a failed first start.

## TOOL-3 — `prisma.ts` still targets AWS Lambda

**File** `src/lib/prisma.ts`

Comments still describe "Serverless-optimized", "For Lambda, we don't want to disconnect on every invocation", and "Lambda freezes the execution context". Beyond being misleading after the AWS removal, the handler is dead:

```ts
process.on("beforeExit", async () => { await prisma.$disconnect(); });
```

Node's `beforeExit` does not fire when the process is terminated by a signal. `docker stop` sends SIGTERM through dumb-init, so this never runs.

**Fix.** Remove the handler and the Lambda comments. The explicit `datasources.db.url` override is also redundant — Prisma reads `DATABASE_URL` from env by default.

## TOOL-4 — Confirmed dead code

All verified unreferenced by grep:

| Item | File | Note |
|---|---|---|
| `uploadToCloudinary`, `deleteFromCloudinary` | `src/lib/cloudinary.ts` | Entire module unused. `api/upload/route.ts` reimplements the logic inline instead of importing it. |
| `authSignUpSchema`, `authSignInSchema` | `src/lib/validations.ts` | Sign-in page hand-rolls weaker validation and drops the uppercase/lowercase/digit rules these enforce. |
| `PricingContent`, `pricingTiers`, `pricingFaqs` | `src/components/marketing/owned-core-pages/pricing-content.tsx` | See [WEB-4](#web-4--three-conflicting-pricing-tables). The better version is the unreachable one. |
| `LandingHero` | `src/components/marketing/landing-hero.tsx` | `src/app/page.tsx` imports only `ProductShowcase` and `PricingPreview`. |
| `Organization.logoUrl` | `prisma/schema.prisma` | Never written or read. Likely the intended purpose of [SEC-1](#sec-1--apiupload-has-no-authentication). |
| `Organization.stripeAccountId` | `prisma/schema.prisma` | Never written or read. Implies Stripe Connect, which is not implemented. |

## TOOL-5 — Empty route directories

> **RESOLVED 2026-08-05.** All four deleted after confirming each contained zero files. Note they were never tracked by git, since git does not track empty directories — they existed only in the local working tree, never in the deployed clone. Original finding preserved below.

`src/app/blog/`, `src/app/docs/`, `src/app/help/`, `src/app/resources/` all still exist and contain zero files.

They produce no routes (App Router needs a `page.tsx` or `route.ts`), so they are harmless to the build — but they are the direct cause of four of the seven broken links in [WEB-1](#web-1--seven-broken-internal-links). Delete them or repopulate them; leaving them makes the links look intentional.

---

# P4 — Marketing and content integrity

## WEB-1 — Seven broken internal links

> **RESOLVED 2026-08-05.** All seven fixed. `/status` was created as a real page; the other six targets were repointed or their sections rewritten. Verified by grepping `src/**/*.{ts,tsx}`: `"/docs"`, `"/help"`, `"/blog"`, `"/resources"`, `"/contact"` all return **0 hits**. `npx tsc --noEmit` exits 0. Full change record in [`STATUS.md`](./STATUS.md#fixed-2026-08-05). Original finding preserved below.

Every one verified against the actual route tree.

| Target | Source | Note |
|---|---|---|
| `/docs` | `src/app/api/page.tsx:42` | dir empty |
| `/contact` | `src/app/api/page.tsx:42` | no such route |
| `/contact` | `src/app/api/page.tsx:52` | same |
| `/contact` | `src/app/api/page.tsx:64` | same |
| `/resources` | `src/app/changelog/page.tsx:139` | dir empty |
| `/help` | `src/app/integrations/page.tsx:274` | dir empty. **Labelled "Contact support"** — the page's only support CTA. |
| `/status` | `src/app/security/page.tsx:112` | no such route. The same page explicitly disclaims uptime commitments, then links to a status page. |
| `/resources` | `src/components/marketing/owned-resource-pages/ui.tsx:15` | `parentHref = "/resources"` default prop — any caller omitting it renders a 404 breadcrumb |

All header and footer links in `src/components/marketing/site-shell.tsx` resolve correctly. The `#product` anchor on the homepage resolves.

One unverified item: `src/app/features/page.tsx:74` has a skip link to `#main-content`, but that page wraps content in `PageBackdrop` rather than `TrustPage`. Only `TrustPage` is confirmed to set that id. Needs a one-line check.

## WEB-2 — 404 page strands marketing visitors

**File** `src/app/not-found.tsx`

The 404 is dashboard-themed (`text-primary`, `text-muted-foreground`), is not wrapped in `MarketingShell`, and its only action is:

```tsx
<Link href="/dashboard">Back to dashboard</Link>
```

So a marketing visitor who clicks any of the seven links above lands on an off-brand page whose sole escape route is auth-gated and bounces them to `/sign-in`.

Given [WEB-1](#web-1--seven-broken-internal-links), this is the highest-leverage single fix on the public surface.

## WEB-3 — Sitemap lists only the homepage

**File** `src/app/sitemap.ts`

```ts
return [{ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
```

Twelve live indexable routes are omitted: `/features`, `/pricing`, `/templates`, `/customers`, `/changelog`, `/integrations`, `/faq`, `/security`, `/privacy`, `/terms`, `/cookies`, `/api`.

Every trust and conversion page is invisible to crawlers via sitemap, despite per-page canonical and OG tags being set carefully throughout (`marketingMetadata()` in `owned-trust-pages/shared.tsx`).

On the positive side it lists no stale routes, so nothing needs removing — only adding.

Related, `src/app/robots.ts` correctly disallows the app routes but does not disallow `/api/`, leaving the real endpoints crawlable. That cannot be fixed with a blanket `/api` disallow without delisting the `/api` marketing page — which is the actual cost of putting a marketing page on that path segment.

## WEB-4 — Three conflicting pricing tables

| Source | Tiers | Rendered? |
|---|---|---|
| `src/app/pricing/page.tsx` (`plans`, `comparison`) | 3 | **Yes** |
| `src/components/marketing/owned-core-pages/pricing-content.tsx` (`pricingTiers`) | 4 | **No — imported by nothing** |
| `src/components/marketing/pricing-preview.tsx` (`plans`) | 3 | Yes (homepage) |

`pricing/page.tsx:13` carries the comment *"Figures mirror src/components/marketing/pricing-preview.tsx. Keep both in sync."* — it acknowledges two of the three copies and never mentions the third.

Direct contradictions between the rendered page and the dead one:

| Claim | `pricing/page.tsx` | `pricing-content.tsx` |
|---|---|---|
| Starter templates | "Classic invoice template" (one) | "3 invoice styles" |
| Starter analytics | `false` in comparison | "Revenue overview" listed |
| Tier count | 3 | 4 (adds Enterprise) |
| Paid-tier CTA | `/sign-in`, "Start free" | `mailto:`, "Register interest" |
| Business features | Advanced controls, priority support, batch export, custom fields | Priority support, advanced reporting, team planning, custom onboarding |

The dead file is the better one: richer copy, four tiers, and five purpose-written pricing FAQs. The live page instead renders `marketingFaqs.slice(0, 5)` — five generic product FAQs — while `pricingFaqs` sits unreachable.

There is no billing implementation behind any of it. Grep for `plan|tier|subscription` in `prisma/schema.prisma` returns zero matches, so tier gating cannot be enforced anywhere.

**Credit:** the "paid-plan checkout is not enabled yet" disclosure appears on all three surfaces and is genuinely honest. The problem is the per-tier feature lists, not the pricing disclosure.

**Fix.** Pick one source of truth, delete the other two, and cut any feature line with no code behind it.

## WEB-5 — Claims the codebase cannot back

| Claim | Location | Reality |
|---|---|---|
| UPI **"Instant confirmation"** | `integrations/page.tsx:33`, under a green ACTIVE badge | Nothing confirms a UPI payment. See [GAP-2](#gap-2--no-manual-payment-recording-upi-cannot-be-reconciled). Most misleading line on the site. |
| **"OAuth 2.0"** in payment integrations | `integrations/page.tsx` ~229 | Not used anywhere. Stripe Checkout plus a signed webhook is not OAuth. Webhook verification *is* real. |
| APIs **"are documented, versioned"** | `integrations/page.tsx` ~236 | Same file lists REST API and Webhooks as **Q1 2027** roadmap items, and `api/page.tsx:41` says credentials are "not generally available yet". Present tense on a future item. |
| **"Email invoice delivery"** as a Studio feature | `pricing-content.tsx:29` | Contradicts `src/lib/marketing-content.ts` and `page.tsx:311`, which both describe copy-a-link sharing. The feature exists in code (`sendInvoice`) but is broken per [BUG-1](#bug-1--invoices-marked-sent-when-the-email-failed) and unconfigured. |
| Full status lifecycle, tagged "Live" | `page.tsx:29` | OVERDUE and VOID are unreachable. See [BUG-8](#bug-8--overdue-and-void-are-unreachable-states). |
| Hardcoded roadmap dates | `integrations/page.tsx` ~41-84 | "Q3 2026 / Q4 2026 / Q1 2027" will rot silently. The page's own "Honest timelines" card says dates are estimates, which helps. |
| Hardcoded domain | `src/app/opengraph-image.tsx` | `cloudinvoice.app`, not `cloudinvoice.co.in` |

**`src/app/security/page.tsx` is the model to copy, not a problem.** It explicitly refuses SOC 2, ISO 27001, PCI DSS, HIPAA, penetration-test, and uptime claims, and every safeguard listed maps to something real in the code. There is no SLA or uptime claim anywhere on the site. Its only defect is the `/status` link.

## WEB-6 — Hardcoded support email violates the project's own rule

`src/components/marketing/site-shell.tsx:5-8` documents a deliberate policy:

> Set `NEXT_PUBLIC_SUPPORT_EMAIL` once the production domain is live; until then the footer renders no mailto link rather than advertising an address that bounces.

The footer correctly gates on it. But `pricing-content.tsx` hardcodes `mailto:hello@cloudinvoice.app` **three times** as the Studio, Business, and Enterprise CTAs — a domain you do not control, on an address that bounces. Currently masked only by that file being dead code.

## A11Y-1 — Navigation disappears between 640px and 1280px

**File** `src/components/marketing/site-shell.tsx:26`

```
desktop nav    → hidden ... xl:flex     (appears at 1280px)
auth buttons   → hidden ... sm:flex     (appears at 640px)
hamburger      → sm:hidden              (disappears at 640px)
```

Between 640px and 1280px there is **no navigation affordance at all**. The desktop nav has not appeared and the mobile trigger is already gone. Every iPad and small laptop loses every nav link.

**Fix.** Change the `<details>` trigger to `xl:hidden`. One word.

## A11Y-2 — Remaining accessibility defects

**ARIA on generic elements (silently ignored by assistive tech)**

- `src/app/pricing/page.tsx:76-80`, `Cell()` — `aria-label="Included"` on a bare lucide SVG with no `role="img"`, and `aria-label="Not included"` on a bare `<span>`. Both comparison states are effectively unlabelled. The dead `pricing-content.tsx` does this correctly with `<span className="sr-only">`; copy that pattern.
- `pricing-content.tsx` billing toggle — `aria-label="Billing interval"` on a `<div>` with no `role`. Needs `role="group"`. The `aria-pressed` usage is correct.

**Contrast failures** (AA needs 4.5:1 for body text)

| Class | Approx ratio | Location |
|---|---|---|
| `text-zinc-700` on `#050505` | **~2.2:1** | `pricing-content.tsx` comparison "—" cells |
| `text-zinc-600` on `#070707` | ~3.0:1 | `site-shell.tsx:26` footer legal row |
| `text-zinc-600` | ~3.0:1 | `pricing/page.tsx:78`; `integrations/page.tsx` roadmap `eta` and `category` labels |
| `text-zinc-500` | ~4.6:1 | Widespread body copy — borderline, no margin |

**Structure**

- `src/app/page.tsx:310` renders a three-column comparison entirely from `<div className="grid grid-cols-[1.1fr_1fr_1fr]">` with no `<table>`, `<th>`, or header association. Screen readers get twelve orphan strings. Notably `pricing/page.tsx` does its own table properly with `<caption className="sr-only">`, `scope="col"`, and `scope="row"` — the good pattern already exists in the codebase.
- `Notice` in `owned-trust-pages/shared.tsx` renders its title as `<h2>`, so a sidebar callout emits an `h2` sibling inside an `h3` region (visible on `/security`). It also sets `aria-label={title}` on the `<aside>` while rendering the same string as a heading, causing duplicate announcement.
- Footer emits four sibling `<h2>` column titles competing with page section headings.

**Interaction**

- The `<details>`-based mobile menu has no `aria-expanded`, no Escape-to-dismiss, and no focus return. The `<span className="sr-only">Open site menu</span>` inside `<summary>` is correct and worth keeping.
- `integrations/page.tsx` ~118 — decorative `animate-pulse` dot is not `aria-hidden`, and no `prefers-reduced-motion` guard exists for it or the widespread `hover:scale-105` / `transition-all duration-300` treatments.

**Also**

- `ThemeToggle` (`src/components/theme-toggle.tsx`) reads `localStorage` inside `useEffect`, so there is a flash of the wrong theme on every load. `suppressHydrationWarning` on `<html>` masks the symptom. Needs a blocking inline script in `<head>` to set the class before paint.

No missing `alt` text was found — marketing visuals are all inline SVG or CSS gradients, and `opengraph-image.tsx` exports a proper `alt`. No missing form labels on marketing pages, since no marketing forms exist. Dashboard forms use wrapping `<label>` correctly throughout.

---

# Operational

## OPS-1 — Rotate the Postgres password

The current password is weak, guessable, and existed in local git history. It is out of the public repo now, and port 5434 is loopback-bound and firewalled, so urgency is low — but it should be done before real customers exist.

Three steps on the server:

1. `ALTER USER` inside the Postgres container
2. Update `POSTGRES_PASSWORD` **and** the password inside `DATABASE_URL` in the VPS `.env` — both, or the app cannot connect
3. Restart the app container

Verify with `docker compose config` before restarting, the same way the migration was validated.

## OPS-2 — TLS blocked on GoDaddy client hold

`cloudinvoice.co.in` is on client hold during addPeriod, which on a same-day registration is almost always an unclicked registrant verification email. Until it lifts: no DNS, no certificate, no cutover.

The nginx vhost is installed and waiting. Blocks [SEC-3](#sec-3--session-cookies-in-plaintext) and the `docker-compose.yml` TODO to move the app to `127.0.0.1:3002:3000`.

## OPS-3 — Old history bundle still on Desktop

`cloudinvoice-old-history-*.bundle` contains the old password. Keep it off GitHub, and delete it once you are confident you do not need the 37 removed AWS files.

Same applies to `cloudinvoice-src.tar.gz` and `pre-cloudpanel-backup-20260804.tar.gz` in the workspace root — both predate the credential cleanup.

## OPS-4 — `NEXT_PUBLIC_APP_URL` may bake into static metadata

**Unverified.** `src/app/layout.tsx` sets `metadataBase` from `process.env.NEXT_PUBLIC_APP_URL`, and the `Dockerfile` passes no `NEXT_PUBLIC_*` build `ARG`. For statically prerendered marketing pages, Next may evaluate that at build time, which would bake `localhost:3000` into canonical and OG URLs in production.

The comment in `docker-compose.yml` asserting that `NEXT_PUBLIC_*` is fine as a runtime variable is true for Server Components but **not** for client components or build-time-evaluated metadata. `src/lib/auth-client.ts` is a client component reading `NEXT_PUBLIC_APP_URL`; it currently works only because Better Auth falls back to the current origin when `baseURL` is undefined.

Local `.next/` is not a full production build, so this could not be confirmed. **To verify:** after the next container build, check a prerendered marketing page for `<link rel="canonical">` and `og:url` values. If they point at localhost, add `ARG NEXT_PUBLIC_APP_URL` / `ENV NEXT_PUBLIC_APP_URL` to the builder stage and pass it in `docker-compose.yml` under `build.args`.

---

# Suggested work order

Ordered by harm-per-unit-effort, not by severity label.

**1. Stop active harm** — small, independent, all P0/P1
- [SEC-1](#sec-1--apiupload-has-no-authentication) lock or delete `/api/upload`
- [BUG-1](#bug-1--invoices-marked-sent-when-the-email-failed) check the Resend error before marking SENT
- [BUG-2](#bug-2--unvalidated-currency-can-hard-crash-a-workspace) allowlist currency

**2. Restore the quality gate** — do this before any broad change
- [TOOL-1](#tool-1--npm-run-lint-is-not-a-working-gate) add ESLint `ignores`
- [TOOL-2](#tool-2--envexample-is-stale-and-incomplete) fix `.env.example` so a fresh clone starts

**3. Correctness pass**
- [BUG-3](#bug-3--dashboard-kpis-computed-from-six-rows) [BUG-4](#bug-4--sidebar-active-state-can-never-highlight) [BUG-5](#bug-5--checkout-redirect-urls-break-behind-nginx) [BUG-6](#bug-6--html-entity-renders-literally-on-sign-in) [BUG-7](#bug-7--draft-invoices-are-publicly-payable) [BUG-8](#bug-8--overdue-and-void-are-unreachable-states)

**4. Public surface** — cheap, high visibility
- ~~[WEB-1](#web-1--seven-broken-internal-links) broken links~~ **done**
- ~~[TOOL-5](#tool-5--empty-route-directories) delete the empty dirs~~ **done**
- [WEB-2](#web-2--404-page-strands-marketing-visitors) the 404 page still points at an auth-gated route
- [A11Y-1](#a11y-1--navigation-disappears-between-640px-and-1280px) one-word breakpoint fix, nav is invisible on tablets
- [WEB-3](#web-3--sitemap-lists-only-the-homepage) sitemap — now also omits the new `/status`
- [WEB-4](#web-4--three-conflicting-pricing-tables) [WEB-5](#web-5--claims-the-codebase-cannot-back) pricing and unbacked claims

**5. Close the product gap** — the real feature work
- [GAP-2](#gap-2--no-manual-payment-recording-upi-cannot-be-reconciled) `recordPayment` — this is what makes UPI real
- [GAP-1](#gap-1--no-invoice-edit-void-or-delete) invoice edit and void
- [GAP-3](#gap-3--no-client-edit-or-delete) client edit

**6. Hardening, gated on the domain**
- [OPS-2](#ops-2--tls-blocked-on-godaddy-client-hold) → then [SEC-3](#sec-3--session-cookies-in-plaintext), loopback binding, HSTS, secure cookies
- [OPS-1](#ops-1--rotate-the-postgres-password) [SEC-2](#sec-2--no-rate-limiting-anywhere) [OPS-4](#ops-4--next_public_app_url-may-bake-into-static-metadata)

---

# Not reviewed

Read in full: all of `src/lib/`, `src/middleware.ts`, all server actions, all API routes, all `(dashboard)` and `(auth)` pages, `pay/[token]`, `onboarding`, all dashboard and form components, `layout.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `Dockerfile`, `docker-compose.yml`, `init-db.sh`, `.env.example`, `.dockerignore`, `eslint.config.mjs`, `next.config.ts`, `package.json`.

Read in full on the marketing side: `page.tsx` (partial), `pricing/`, `integrations/`, `security/`, `site-shell.tsx`, `pricing-preview.tsx`, `pricing-content.tsx`, `marketing-content.ts`, `owned-trust-pages/shared.tsx`.

**Not read:** `src/app/templates/`, `customers/`, `faq/`, `privacy/`, `terms/`, `cookies/` page files; `changelog/page.tsx` and `api/page.tsx` (grep only); `landing-hero.tsx`, `product-showcase.tsx`, `page-primitives.tsx`, `feature-product-tour.tsx`, `owned-resource-pages/seo.tsx` and `ui.tsx` (grep only); `src/app/globals.css`; `prisma/migrations/`.

The broken-link list is still definitive — link targets were grepped workspace-wide. Contrast and heading-structure findings in the unread files are unassessed.

**One correction to an earlier note in this audit's research:** `src/app/(dashboard)/loading.tsx` exists and was not reviewed for content, though its presence means route-level loading states are handled.

---

# Session record — 2026-08-05, feature build

Nine sequential tasks. Verified after each: `npx tsc --noEmit` produced **zero output lines**, `npx eslint src` reported **0 errors, 0 warnings** across 96 files.

Route surface grew from 23 to **34 pages** plus 5 API routes.

## Resolved

| ID | What changed |
|---|---|
| **BUG-1** | `src/lib/email.ts` rewritten around a private `deliver()` helper that inspects Resend's `{data, error}` result and throws. `sendInvoice` now wraps delivery in try/catch and only writes `status: SENT` after confirmed delivery. Also added HTML escaping on every interpolated value. |
| **BUG-2** | `createWorkspace` validates currency against a Zod enum of the four supported codes. An arbitrary string could previously reach `Intl.NumberFormat`, throw `RangeError`, and permanently break that workspace's pages. |
| **BUG-3** | Dashboard totals now come from `prisma.payment.aggregate` and `prisma.invoice.aggregate` instead of reducing a six-row slice. Collected is derived from confirmed payment rows rather than summing PAID invoice totals, so partial payments count correctly. |
| **BUG-4** | Sidebar is now part of a client component using `usePathname`. The `x-pathname` header read is gone. |
| **BUG-6** | `Don&apos;t` → `Don\u2019t`. The entity sat in a JS string, not JSX, so it rendered literally. |
| **GAP-1** | `updateInvoice` (DRAFT only), `voidInvoice` (refused when a successful payment exists), `deleteInvoice` (DRAFT only), plus `/invoices/[id]/edit`. |
| **GAP-2** | `recordPayment` and `deletePayment`, with payment history now rendered on the invoice detail page — data that was already being fetched and discarded. |
| **A11Y-1** | Nav breakpoints paired: desktop `lg:flex`, mobile trigger `lg:hidden`. Mobile menus in both shells now have Escape, focus return, scroll lock, and close-on-navigation. |
| **Password reset** | Better Auth `sendResetPassword` wired, plus `/forgot-password` and `/reset-password`. Same confirmation shown whether or not the account exists, to avoid account enumeration. |

## Partially resolved

| ID | Done | Remaining |
|---|---|---|
| **BUG-8** | VOID is reachable via `voidInvoice`. Overdue is now derived from `dueDate < now` and surfaced on the dashboard with a banner. | `InvoiceStatus.OVERDUE` is still never written. The derived approach makes it work without a scheduler; the enum value stays vestigial. |
| **GAP-5** | Payment recording, balance sync, and dashboard totals are `Prisma.Decimal` end to end. | `calculateInvoice` still computes in JS floats before rounding to 2dp. |
| **GAP-6** | `MemberRole` is a typed enum and enforced: `updateOrganization` now requires OWNER. `PlatformRole` added with `requireAdmin`. | No organization switcher — `getCurrentMembership` still resolves the oldest membership. No invite flow. |
| **A11Y-2** | Footer headings `h2` → `h3`. Reduced-motion support on the product tour. Keyboard navigation on the tablist. Decorative icons hidden. Fake notification bell removed. | Contrast failures (`text-zinc-700` / `zinc-600` on near-black), `Notice` emitting `h2` inside an `h3` region, `page.tsx` comparison grid built from divs, ThemeToggle flash of wrong theme. |

## Added — authorization and administration

**New `src/lib/authz.ts`** is now the single authorization module. `getAuthenticatedUser()` re-reads the user from the database rather than trusting the session, so a role change or suspension takes effect on the next request instead of waiting out a fourteen-day session. Suspension is enforced at that one chokepoint, which also closed a hole where a suspended account would still have reached every dashboard route.

`requireAdmin()` responds **404, not 403**, so a non-admin gets no confirmation the admin area exists. It uses `notFound()` deliberately: `forbidden()` requires the experimental `authInterrupts` flag, and an authorization guard is the wrong place to depend on an experimental API.

**Admin panel** at `/admin`, `/admin/users`, `/admin/organizations`, `/admin/invoices`. `requireAdmin()` is called at **8 independent points** — the layout, all four pages, and all three actions. A layout guard does not protect server actions, since those are independently addressable HTTP endpoints.

Guards on the admin actions:

- An admin cannot suspend or demote **themselves**
- The **last remaining admin** cannot be demoted; the count is taken inside a transaction so two concurrent demotions cannot both pass
- Suspending another admin is refused — demote first, so the intent is two explicit steps
- **Nothing deletes** a user, organization, or invoice. Suspension is reversible; deleting a tenant's financial records is not, and no support task justifies that being one click away

## Migration required before deploy

`prisma/migrations/20260805090000_platform_roles/` is hand-written rather than generated, so nothing ran against a live database. It is additive and reversible: both new columns carry defaults, and the `Membership.role` text-to-enum conversion maps unrecognised values to the **lower-privilege** `MEMBER` rather than failing open to `OWNER`.

```
cd /home/ubuntu/cloudinvoice && git pull
npm run db:deploy
docker compose up -d --build
```

Running the app before the migration will error on the missing columns.

## Bootstrapping the first admin

Promotion is deliberately unreachable from any request path, so there is no way to make yourself an admin through the UI. That is the point — it means no bug in request handling can grant platform access. The first admin must be set directly:

```
docker exec -it cloudinvoice-postgres psql -U cloudinvoice -d cloudinvoice \
  -c "UPDATE \"User\" SET \"platformRole\" = 'ADMIN' WHERE email = 'you@example.com';"
```

After that, further admins can be promoted from `/admin/users`.

## Still open, verified by grep just now

**`SEC-1` is the most important one and is not fixed.** `src/app/api/upload/route.ts` still contains **zero** references to any auth guard. It remains unauthenticated, with no file-type allowlist and no size cap, on real Cloudinary credentials, and no code calls it. This is still the highest-severity item in this document.

Also confirmed still open:

| ID | Verified state |
|---|---|
| `SEC-2` | No rate limiting. `UPSTASH_*` read by zero files. |
| `SEC-3` | Blocked on the domain. |
| `BUG-5` | Checkout still derives `success_url` from `request.url`. |
| `BUG-7` | DRAFT invoices still publicly payable; `/pay/[token]` still writes on GET. |
| `GAP-3` | No client edit or delete. |
| `GAP-4` | `discountAmount` — **0 references** in `src`. Still a dead column. |
| `TOOL-1` | `eslint.config.mjs` still has no `ignores`, so `npm run lint` still lints `.next` and always exits 1. Note the clean results above come from `npx eslint src`, which scopes it correctly. |
| `TOOL-3` | `prisma.ts` still carries the Lambda comments and the dead `beforeExit` handler. |
| `TOOL-4` | `uploadToCloudinary`, `LandingHero`, `PricingContent` each have exactly 1 reference — their own definition. Still dead. The auth schemas are now genuinely used. |
| `WEB-2`, `WEB-4` | Unchanged. |
| `WEB-5` | Partial: UPI "Instant confirmation" and the overdue claim were corrected. "OAuth 2.0" and "APIs are documented, versioned" remain. |
| `OPS-1` … `OPS-4` | Unchanged. |
