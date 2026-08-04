# AWS Activate readiness

An honest assessment of what the program requires, what CloudInvoice has, and what is genuinely blocking an application.

**Sources.** [AWS Activate Credits](https://aws.amazon.com/startups/credits), [applying step-by-step](https://startups.aws.com/learn/applying-for-aws-activate-credits-a-step-by-step-guide), [Activate Credits explained](https://aws.amazon.com/startups/learn/everything-you-need-to-know-about-aws-activate-credits), [AWS Startups FAQ](https://aws.amazon.com/startups/faq), [promotional credit terms](https://aws.amazon.com/awscredits/). Content below is paraphrased and condensed for compliance with licensing restrictions; check the source pages before applying, since program terms change.

---

## Read this first: two things that change the plan

### 1. Credits only pay for AWS. CloudInvoice does not run on AWS.

Activate Credits offset charges for AWS services. CloudInvoice currently runs on a self-hosted VPS at `161.118.176.26` under Docker Compose, alongside four other unrelated projects. **Credits granted today could not be spent on this deployment.**

You also removed 37 files of AWS Lambda scaffolding earlier in this project, which was the right call for a container-based VPS deployment but moves you further from the platform the credits apply to.

So there is a real decision to make before applying:

| Option | Consequence |
|---|---|
| **Apply, then migrate to AWS** | Credits become usable. The app is already containerised and stateless apart from Postgres, so App Runner or ECS Fargate plus RDS is a realistic target. This is the coherent path if you want the credits. |
| **Apply and stay on the VPS** | Credits sit unused and expire. Not dishonest, just pointless. |
| **Do not apply yet** | Perfectly reasonable. The VPS is cheaper than AWS even with a small credit balance. Revisit when you actually need AWS-specific services. |

Worth being blunt: at the self-funded tier the realistic starting grant is **$1,000**. That is not a large enough incentive to justify an unplanned re-platform. The $200,000 tier is a different conversation, and it requires something you do not currently have — see below.

### 2. The domain is the critical path for almost everything.

`cloudinvoice.co.in` is on GoDaddy **client hold** during the add period, so it does not resolve. That single fact blocks:

- The **fully functioning company website** eligibility requirement — a reviewer sent to `http://161.118.176.26:3002` is not looking at a company website
- A **professional email address** for the AWS Builder ID, which the application process expects
- HTTPS and secure session cookies (`SEC-3`)
- Resend domain verification, and therefore any invoice email
- The `support@cloudinvoice.co.in` address now published on `/contact`

Clearing the hold is almost always a matter of clicking the registrant verification email GoDaddy sent. **Do that before anything else in this document.** It is the highest-leverage action available and it is free.

---

## Eligibility, as stated by AWS

For the **Activate Founders** tier (self-funded, apply directly):

| Requirement | CloudInvoice | Notes |
|---|---|---|
| Pre-Series B | ✅ Yes | Self-funded |
| Founded within the last 10 years | ✅ Yes | |
| AWS account on a paid tier plan | ❓ **Unknown** | You need an AWS account with a valid payment method attached, not free-tier-only |
| New to Activate Credits | ❓ **Only you know** | Or requesting more than previously received |
| Fully functioning company website | ⚠️ **Blocked by the domain** | The site itself is in good shape; the address it lives at is not |
| AWS Builder ID with professional email | ❌ **Blocked by the domain** | |

For the **Activate Portfolio** tier (up to $200,000), AWS requires an **Organization ID from an Activate Provider** — an accelerator, angel investor, or VC firm in their network. Named examples in their material include Y Combinator and Sequoia. Without a relationship with a participating provider, this tier is not accessible, regardless of how good the product is. Self-funded founders apply to the Founders tier.

The **AI startups tier** is invite-only for companies scaling past Activate Portfolio. Not applicable.

## Application steps, per AWS

1. Create an AWS Builder ID using a professional email, then complete the profile
2. Choose the credit tier — Founders if self-funded, Portfolio if you have a provider Org ID
3. Provide details about the product, funding stage, and company profile
4. Link the AWS account and submit

---

## Website readiness

The "fully functioning company website" bar is about demonstrating a real product and a real company, not visual polish. Here is where the site actually stands.

### Now in place

| Item | Where |
|---|---|
| Working product behind sign-up | 8 authenticated app pages, real multi-tenant data model |
| Clear product explanation | `/`, `/features`, `/templates` |
| Public pricing | `/pricing`, with paid checkout honestly disclosed as not yet enabled |
| **Contact route** | `/contact` — **added today**, four routed channels, no backend required |
| Legal pages | `/privacy`, `/terms`, `/cookies` |
| Security posture | `/security` — notably refuses to claim SOC 2, ISO 27001, PCI DSS, HIPAA, or uptime |
| **Service status** | `/status` — real component states, no invented uptime figures |
| Product history | `/changelog` |
| Social proof page | `/customers` |
| **Complete sitemap** | **fixed today** — 15 routes, was previously the homepage alone |
| Domain-consistent email | **fixed today** — `support@cloudinvoice.co.in`, was on an unrelated project's domain |

### Still missing for a credible company website

| Gap | Why it matters | Who can fix it |
|---|---|---|
| **No `/about` page** | The most common thing a reviewer or customer looks for. There is currently no page saying who is behind CloudInvoice, why it exists, or that a company stands behind it. This is the largest remaining website gap. | Needs facts only you have — see below |
| **No legal entity anywhere** | The footer says `© CloudInvoice`. No registered business name, no jurisdiction, no address. `/terms` and `/privacy` are strong documents with no identified counterparty, which weakens both. | You |
| **Domain not resolving** | Covered above. Blocks the requirement outright. | You, via GoDaddy |
| **No founder or team identity** | A one-person startup is fine and common. An anonymous one is harder to fund or trust. | You |
| **404 page dead-ends visitors** | `src/app/not-found.tsx` sends marketing visitors to the auth-gated `/dashboard`. Tracked as `WEB-2`. | Small code fix |
| **Nav invisible 640–1280px** | Every tablet and small laptop sees no navigation. Tracked as `A11Y-1`, one-word fix. | Small code fix |
| **Conflicting pricing tiers** | Three separate hardcoded pricing tables that disagree with each other. A reviewer comparing `/pricing` to the homepage sees inconsistency. Tracked as `WEB-4`. | Small code fix |
| **Unbacked feature claims** | `/integrations` claims UPI "Instant confirmation" and "OAuth 2.0"; neither exists. Tracked as `WEB-5`. | Small content fix |

## What I cannot write for you

An `/about` page is straightforward to build, but only with facts I will not invent. Inventing a founding date, a team, or a registered entity would be exactly the kind of unbacked claim this project's own `/security` page is careful to avoid, and it would be worse than having no page.

To build `/about` and add a proper legal footer, I need:

1. **Registered entity name**, if one exists — sole proprietorship, LLP, Private Limited, or none yet
2. **Jurisdiction and city** — e.g. "operated from Bengaluru, India"
3. **Founding date** — month and year is enough
4. **Founder name and a one-line background**, and whether you want it public
5. **Why you built it** — the actual reason, not marketing copy. This is the part reviewers and customers respond to.
6. **Team size** — "solo founder" is a perfectly good answer

Give me those six and I will write `/about` plus a proper footer identity block in one pass.

---

## Suggested order

1. **Clear the GoDaddy hold.** Free, fast, and unblocks the website requirement, HTTPS, professional email, and Resend verification simultaneously.
2. **Decide the AWS question honestly.** If you are not going to migrate, do not spend effort on the application. If you are, the containerised app plus RDS is a clean target and the credits become worth having.
3. **Send me the six facts** so `/about` and the legal footer can be written truthfully.
4. **Fix the four small website credibility items** — `WEB-2` 404, `A11Y-1` nav, `WEB-4` pricing conflicts, `WEB-5` unbacked claims. All are in [`CODE_AUDIT.md`](./CODE_AUDIT.md).
5. **Then the product gaps that a paying customer would notice** — password reset, invoice edit and void, and manual payment recording so UPI can actually be reconciled. These matter more for a real startup than anything on the marketing surface.

On that last point: a reviewer is more likely to be convinced by a product where an invoice can be corrected and a UPI payment can be marked paid than by a better About page. The website is now in decent shape. The product gaps in [`STATUS.md`](./STATUS.md) are the more honest priority.
