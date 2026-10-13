# My 12–18 month roadmap and investment memo

**Ayo Ahmed — Independent concept**

> Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

I would begin with an inventory of inherited automations and measured funnel constraints. The sequence below is a proposed discovery-dependent roadmap, not a claim that Bolt needs each component or a promise of savings. I would share priorities with market leads, reps, engineering, analytics, Finance, product, privacy and security owners. I would not replace a working local process simply to make it uniform.

## Sequence and gates

| Period | My proposed work | Gate before expansion |
| --- | --- | --- |
| Months 0–2 | Map existing lead-to-retention workflows, owners, vendor costs, manual exceptions, data lineage, and permissions. Agree SQL, first-order, activation, retention and rep-time definitions. | Baselines reconciled; existing automations classified; privacy/security owners agree the proposed boundary |
| Months 2–4 | Validate the company-pay activation hypothesis with a few willing operators. Establish durable events, idempotency, review queue, eval fixtures, monitoring and kill switch. | Quality and reliability thresholds met; operators understand reasons and review path; no external effect without authorised controls |
| Months 4–6 | Run a small authorised market pilot with a fixed cohort and holdout where feasible. Collect operator burden and failure reasons alongside activation. | Prespecified observation window complete; denominator and contamination reconciled; decision based on uncertainty and guardrails |
| Months 6–9 | Expand only to supported workflows and markets. Implement approved CRM/warehouse contracts; localise guidance after local review. | Integration reconciliation and access audits pass; adoption and operational ownership established |
| Months 9–12 | Address the next evidenced constraint: qualification, closing, or lifecycle. Compare vendor, build and existing-system options. | Measured constraint and intervention rationale; representative evals; approved data basis and rollout plan |
| Months 12–18 | Expand a reliable portfolio across the funnel; revisit components that failed adoption or unit economics; mature incident response and retention measurement. | Sustainable commercial and operational evidence, not a count of deployed automations |

The first live release would need scoped authentication, approved account/destination, environment review, consent/data controls, and a production operating owner. This repository supplies a local synthetic proof; it does not complete those gates.

## Keep, rebuild, retire

| Decision | My evidence threshold | My action |
| --- | --- | --- |
| Keep | Existing component has an owner, reliable events, acceptable quality and cost, operator adoption, and a clear purpose | Integrate through a stable contract; add missing observability without disrupting working behaviour |
| Rebuild | Valuable task is demonstrated, but failure rate, inconsistent data, unsafe permissions, or unsupported dependencies prevent reliable operation | Replace incrementally behind a contract; shadow and compare; preserve rollback and local exceptions |
| Retire | Duplicate or unused workflow, no measurable purpose, unacceptable risk, or persistently poor quality/economics despite a fair evaluation | Agree the owner and migration plan; retain necessary audit data; remove credentials, spend and dependencies |

I would make each decision from an inventory and baseline. I cannot classify any existing Bolt system from public information.

## Metrics I would bring to leadership

| Metric | Definition I would agree | Why I use it |
| --- | --- | --- |
| Pipeline per rep | Qualified pipeline value created in a fixed period / eligible rep capacity, with currency and attribution rules agreed | Commercial productivity; not demonstrated by this proof |
| Cost per SQL | Agreed acquisition and qualification costs / sales-qualified leads under a stable SQL definition | Unit economics; requires cost ownership and deduplication |
| Time-to-first-order | Time from an agreed eligibility/start event to first qualifying completed order; non-converters remain censored | Activation speed without hiding accounts that never order |
| Activation | Accounts with a qualifying completed first order within a prespecified window / all fixed eligible accounts | Primary outcome for a future pilot |
| Retention | Activated accounts with qualifying repeat activity in an agreed later period / the corresponding activated cohort | Whether activation creates sustained usage |
| Operator burden | Active work time and unresolved review backlog, with measurement method stated | Avoid shifting invisible work into review queues |
| Quality/reliability | Valid extraction, action correctness, abstention quality, replay safety, reconciliation errors and service availability | Commercial growth cannot justify unreliable actions |

I would report counts and denominators alongside rates, segment views without post-hoc cherry-picking, uncertainty where estimable, and failed hypotheses. Synthetic results in this proof are descriptive examples. They do not measure these production outcomes or monetary savings.

## Impact/effort memo

I use qualitative relative effort, because I have neither internal capacity estimates nor audited volumes. “Potential impact” below is an assumption to test.

| Investment | Potential impact | Relative effort | My decision |
| --- | --- | --- | --- |
| Event definitions and fixed-cohort measurement | High: makes future decisions trustworthy | Medium | First; blocks honest impact reporting if absent |
| Readiness evidence and bounded next-action rules | Medium: may help operator prioritisation | Medium | Pilot one narrow company-pay slice |
| Evaluation, review fallback and monitoring | High: limits regression and unsafe progression | Medium | Required alongside any model use |
| Market operating profiles and enablement | Medium: may improve adoption across processes | Medium | Validate with local owners before expansion |
| Live CRM and warehouse integration | Potentially high, with reconciliation and privacy cost | High | Defer until pilot need and approved contracts are clear |
| Autonomous outreach/enrichment | Unknown; introduces data and external-effect obligations | High | Outside this proof; evaluate separately with approved basis |
| Broad multi-service/market rollout | Unknown before narrow results | High | Defer until evidence and operational capacity justify it |

## Build, buy, and people

I would keep domain state, permissions, event contracts, and evaluation ownership close to the business. I would compare bought extraction/orchestration capabilities on quality, abstention, privacy, observability, cost, portability and incident support. A favourable model benchmark alone would not justify a vendor choice. I would avoid migrating everything into a new platform before discovering which systems already work.

The role includes developing an existing team. My proposed operating model gives engineers and analytics clear ownership of domain contracts, evaluation and market adoption, with shared review of failures and regular prioritisation with commercial owners. This is my approach for the concept, not a claim of previous people-management experience.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
