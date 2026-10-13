# Source context and evidence boundary

Reviewed **2026-10-13 (UTC)** before implementation. This is an independent concept by Ayo Ahmed. All demo accounts, events, decisions, orders, and measured outcomes are synthetic. Public source statements establish product context; they do not establish private customer data, internal implementation, applicant experience, or real commercial impact.

## Verification method

All six URLs below returned HTTP 200 through the environment's inherited proxy. Each was also opened in live Chromium. The role's first server-rendered response exposed headings but not the visible description; the complete description appeared after hydration, was read in the live body, and was captured. The complete role includes the About Bolt, Why join, role, responsibilities, candidate requirements, benefits, AI expectation, and equal-opportunity sections. No application form was submitted.

Raw HTML, body text, and full-page source screenshots are private working evidence outside the repository in `/workspace/work/evidence`. They are not public deliverables and must not be committed. Browser trust was scoped to the inherited environment proxy CA's public-key pin; no blanket TLS-error bypass was used. No login, CRM, support ticket, consultation form, invitation, payment, or booking was made.

The live careers page rendered with its CSS. Business, support, and brand pages delivered complete readable text, but the homepage asset origin `assets.homepage.bolt.eu` is outside the configured network allowlist, leaving their screenshots partially unstyled. Their CSS URLs included `https://assets.homepage.bolt.eu/1.23.2/_next/static/css/6857b03738f5f103.css`. Those screenshots establish textual source content, not exact visual treatment. We did not bypass the blocked origin. The concept uses original styling informed by the official brand's written direction and the fully styled careers reading layout. The user also supplied a visual requirement of a dark-green hero, pale-green treatment, heavy Inter, generous spacing, and pill controls; it is a user reference rather than an observation established by the partially unstyled business screenshot.

## Source register

| ID | Official source | Verified scope |
| --- | --- | --- |
| `bolt-role-b4b` | https://bolt.eu/en/careers/positions/871aaddd-4293-46a0-8f22-bd2d476659ab/ | Full live Lead GTM Engineer, B4B description |
| `bolt-business` | https://bolt.eu/en/business/ | Company travel/meals offer; onboarding and reporting |
| `bolt-support-45861` | https://bolt.eu/en/support/articles/45861/ | Managing accounts; member status/payment differences |
| `bolt-support-62851` | https://bolt.eu/en/support/articles/62851/ | Business portal capabilities and food availability |
| `bolt-support-32674` | https://bolt.eu/en-lt/support/articles/32674/ | Groups and policies; Ride Booker exception |
| `bolt-brand` | https://bolt.eu/en/company/brand/ | Written permission, ownership, prominence, type and colour guidance |

The `en-lt` policy article delivered English text. That locale path is not evidence of Lithuanian product coverage or language support. Any demo language/market selections are synthetic configuration examples unless separately sourced.

## Role: complete reading and relevance

The role header identifies Sales & Account Management; London, United Kingdom; hybrid; full time. The body permits London, Lisbon, or Tallinn and reporting to the VP of Bolt for Business. It describes B4B servicing SMB, Enterprise, and Strategic Partner accounts across 25+ markets in Europe, Africa, and elsewhere. It states that portions of the funnel are automated but coverage differs across markets and manual rep effort remains. This public role wording is the only basis for that observation; the proof does not invent customer failures or quantify their cost.

The engineer-first mandate is to extend working automation across the funnel while remaining personally technical and leading an existing team. Responsibilities cover:

- AI and automation from lead generation/enrichment through qualification/closing, onboarding, lifecycle management, and retention; auditing what to retain, rebuild, or retire and sequencing a 12–18 month roadmap.
- Commercial outcome measures including pipeline per rep, cost per SQL, time-to-first-order, activation, and retention.
- Production agentic workflows, LLM pipelines, evaluation harnesses, and integrations across Salesforce, enrichment/sales-engagement tools, Looker, and Databricks.
- Developing and retaining the existing engineering/analytics team, hiring as the scope grows, and setting standards for architecture, evaluation, monitoring, and deployment.
- Working with market sales leads and reps on adoption, enablement, change management, process redesign, instrumentation, holdouts, and A/B tests where feasible; reporting negative results honestly.
- Translating commercial needs into technical specifications; ownership of data quality, GDPR outbound/enrichment compliance, EU AI Act readiness, vendors, and build-versus-buy decisions.

Candidate requirements include hands-on Python/API/SQL/orchestration/cloud engineering; shipping dependable production LLM systems, agents, tool use, RAG, and structured extraction; systematic evaluation and regression monitoring; real-world CRM/warehouse/API integration; adapting to markets with different data/language/regulatory/process conditions; graceful degradation and inherited-system improvement; GTM/revenue system ownership or demonstrated rapid commercial learning; engineering management and strong English. MLOps, causal inference, related industry backgrounds, additional relevant languages, and named commercial tooling are described as advantages. These are job requirements, **not claims about Ayo Ahmed's background**.

The remaining sections describe Bolt's mobility mission, small-team ownership, learning and career opportunities, salary and stock options without a numeric band, wellness benefits, a five-year sabbatical, events, and hybrid work including at least 12 monthly office days. Perks may differ by location and role. Daily AI use is stated as an expectation with responsibility retained for output quality. The source welcomes applicants who do not meet every requirement and describes inclusive hiring and reasonable accommodations. The concept makes no salary, experience, or hiring-outcome claims.

A narrow company-pay activation simulation is relevant because it can make **onboarding**, **time-to-first-order**, **evaluation**, **observability**, and **holdout design** reviewable. It does not demonstrate production integration or prove incremental revenue.

## Business offer and onboarding

The business page positions a single dashboard for work rides and food spend. It lists rides, food/groceries, carsharing, scooters/e-bikes, and coupons, and separately describes Ride Booker for guests. Scheduled rides are advertised up to 90 days ahead. These are source descriptions, not assumptions that every service or booking feature is available in every market.

The onboarding narrative is: join without upfront fees; access the company dashboard; set spending limits; bulk-upload employees and organise groups; employees download the app and receive an invitation to the company payment method; track orders and export reports. The page's company-payment description says employees need no personal payments or expense claims. Support status detail below is authoritative for the distinction between payment modes.

Referral, carbon-offsetting, large-company-count, insurance, and customer-testimonial marketing claims appear on the page but are not needed for this proof and are not reproduced as demonstrated outcomes. No source claim establishes this concept's savings or causal lift.

## Exact evidence excerpts used by validators

These excerpts are stored as source text and matched by source ID. They cannot be replaced by unsupported generated assertions.

### `bolt-support-45861` — `company_pay_member_active`

> No payment method — the member activated their account but hasn't added a payment card yet. This status only appears on employee-pay accounts — on a company-pay account, the member moves straight to Active once onboarding is complete.

Member status meanings in the source:

| Official member status | Meaning and simulation implication |
| --- | --- |
| Invited | Email invitation sent; activation link remains pending. Do not mark member ready. |
| No payment method | Employee-pay only; activated but personal payment card absent. Exclude from company-pay activation path. |
| Active | Setup complete; member can use the company payment method. Company-pay onboarding reaches this directly. |
| Deactivated | No access to company payment method. Do not reactivate without an explicit simulated action. |
| Invite expired | Activation link not used in time; replacement invitation needed. Simulation may prepare a preview, never send a real email. |

The article notes the Members list defaults to Active-only filtering, so a count based only on that view would omit invited and expired members. Adding/importing members requires matching their actual Bolt-account phone number and selecting the correct country prefix/group. The concept has no real phone numbers or Bolt accounts. Admins and Ride Booker agents are distinct roles; editing an admin email requires renewed verification.

### `bolt-support-32674` — `group_policy`

> Policies are rules set for a particular employee group(s) on how they can use the business payment method.

> Please note: Policies will not apply to Ride Booker trips.

Groups may have names, policies, descriptions, reviewers, and accounting IDs. People default to General. Only empty groups may be deleted and General cannot be deleted. Supported policy categories in the article are expense tracking, spending allowance, ride count, ride day/time, service type, and ride locations. The proof's policy checks concern employee rides, not guest bookings through Ride Booker.

### `bolt-support-62851` — `order_history`

> Check all orders made with the company’s payment method

The portal source additionally lists Ride Booker ordering/scheduling, adding/deactivating employees, groups and policies, order receipts, monthly statements/invoices, company admins, and payment methods. Service restrictions are group-level Policies settings. Food for Business availability is limited by country; enabled by default on eligible new accounts, manually enabled for existing accounts, and restrictable by group. The proof defaults to work rides and does not infer Food eligibility.

The source says portal language settings also affect marketing messages, with English fallback where a selected language is uncommon in a country. The simulation's language rendering is a demo behavior, not a claim of Bolt's exact supported language list.

## Concept decisions versus official facts

| Concept decision | Status |
| --- | --- |
| Focus on company-pay employee work rides | Original scope chosen to keep payment/readiness semantics explicit |
| “Activated” = first completed synthetic order in a defined observation window | Original analytics definition, not an official Bolt member status |
| Qualification, readiness, review, and simulated lifecycle states | Original workflow; public sources constrain product facts |
| Synthetic cohort, timestamps, orders, holdout labels, and computed metrics | Fabricated fixtures; no real accounts, outreach, bookings, or causal proof |
| Evidence-bound extraction with schema/claim validation | Proposed implementation, not Bolt's internal architecture |
| Default to review on unsupported/low-confidence output | Original design decision aligned with measurable evaluation and graceful degradation |

## Brand evidence and asset boundary

The brand page requires written permission before publishing its linked media. Permission is not established, so the project includes no official media. It describes a unified green palette with dark green for readable contrast and Inter as its open-source typeface. The original palette and original SVG are documented in [brand-guide.md](brand-guide.md); Inter must come from an independently licensed source with license retention.

The page requires the independent owner's branding to be more prominent when mentioning Bolt. The owner identity is **Ayo Ahmed — Independent concept**; **Independent concept for Bolt for Business** is secondary text. The trademark notice is exact:

> The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.

The public scope notice is exact:

> Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

No official logos, wordmarks, screenshots, photography, illustrations, or downloaded brand font files are included. Private evidence stays outside the repository. No authorship-tool/model attribution is added to public artifacts.
