# My experiment and evaluation plan

**Ayo Ahmed — Independent concept**

> Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

I separate two questions: whether the implementation follows its safety and measurement contracts, and whether an intervention changes a real commercial outcome. The executable checks answer the first question within a synthetic scope. This proof cannot answer the second.

## Implemented synthetic comparison

I freeze the twelve seeded account IDs before any simulated exposure. A stable FNV-1a hash assigns each account to treatment or holdout; hash modulo four gives a nominal 25% holdout. Small fixture counts need not reproduce that percentage exactly. This deterministic assignment is a reproducible demo mechanism, not proof of a randomised production experiment.

My fixed simulation starts at **2026-10-13 12:00 UTC** and has a seven-day outcome window ending **2026-10-20 12:00 UTC**, including both endpoints. Advancing the explicit simulation clock changes observation completeness; wall-clock time does not secretly advance account outcomes.

| Field | Implemented meaning |
| --- | --- |
| Unit | One seeded synthetic company account, not a member, message, or order |
| Denominator | Every fixed cohort account assigned to that arm, irrespective of current readiness, opt-out, exposure, failed action or activation |
| Numerator | Fixed cohort accounts with a qualifying first completed synthetic order timestamp inside the seven-day window |
| Rate | Numerator / denominator for the arm |
| Displayed difference | Treatment rate minus holdout rate, in percentage points; a descriptive synthetic comparison |
| Exposure | Account has a recorded synthetic outbox exposure or explicit manual synthetic exposure |
| Contamination | Holdout account has any recorded exposure; it remains in its original arm |
| Imported accounts | Visible operationally, but excluded from the already frozen cohort with an explicit reason |
| Incomplete observation | The simulation clock is before the end of the window; early rates are provisional |
| Missing/invalid denominator | Missing cohort IDs or duplicate cohort IDs flag an invalid denominator; an empty arm flags missing. Rates and the percentage-point comparison are withheld as `null` rather than shown as a misleading zero |
| TTFO summary | Mean/median hours from fixed enrollment among observed converters only, with observed and censored counts; not an estimate for all enrolled accounts |

I use intention-to-treat (ITT): I keep each account in its original group, including accounts that are unready, suppressed, never exposed, or contaminated. I report exposure separately and do not silently switch to an exposed-only denominator. “Queued” records a simulated intent to expose, not real delivery, a human read, or engagement. No provider exists. The aggregate view does not estimate significance, causal lift, incremental revenue, or monetary savings.

My order rules reject future timestamps, timestamps outside the outcome window, unready accounts, and orders preceding the recorded readiness time. A replay with the same event key and payload does not count a second outcome. A valid earlier order arriving after a later one can replace the stored first-order timestamp; it still contributes at most one activated account. I would additionally validate event arrival delay and warehouse reconciliation in production.

## Observation and censoring

I explicitly mark the seven-day window complete or incomplete. Before completion, accounts without an outcome are still under observation. At completion, accounts without a qualifying order remain non-converters for the fixed-window activation metric. I do not remove them or invent an order timestamp.

The demo reports mean and median time-to-first-order only among observed converters, with the observed count and the remaining account count labelled censored. This summary can look faster when slow or non-converting accounts are absent; it is not a population TTFO estimate or causal speed improvement. For a future time-to-first-order analysis, I would retain all enrolled accounts: an account with no observed qualifying order is right-censored at the agreed observation cutoff. I would report event and censor counts and use a suitable survival analysis if the design warrants it. This demo does not implement a survival estimator.

## Future authorised pilot protocol

Before exposure, I would agree eligibility, company-pay scope, market/service support, account-level identity, consent/permissions, intervention, assignment unit, exposure event, outcomes, window, analysis and stop rules. I would freeze a cohort and analysis plan, reconcile baseline data, and test treatment leakage. If cross-account operator behaviour creates spillover, I would consider team or market-level assignment and account for clustering, accepting its larger sample needs.

I would choose a primary outcome such as seven-day first-order activation, with time-to-first-order and later retention as secondary outcomes. Guardrails would include action correctness, review backlog, opt-out handling, operator burden, duplicate effects, privacy incidents, and service errors. I would perform a power/minimum-detectable-effect calculation using actual baseline rates and sample constraints before deciding whether a holdout can answer the question. I have no production baseline here, so I do not fabricate sample-size certainty.

I would compare original assignment groups using ITT, report counts and uncertainty, include all prespecified exclusions before exposure, and explain incomplete windows, contamination, missing data, and changed operations. I would keep market/segment analysis prespecified or label it exploratory. I would not interpret a before/after difference as causal lift without a defensible comparison. If holdouts are not feasible, I would report the limits of the observational design and avoid an unsupported causal claim.

## Extraction and reliability evaluation

I treat recorded extraction as an untrusted candidate, not a verified fact or command. The implemented validator accepts only a strict synthetic schema, an allowlisted account/fixture pair, matching synthetic business-use/consent/language facts, company-pay ride scope, canonical timestamps, bounded confidence metadata, and exact allowlisted public capability excerpts. Confidence is metadata, not an automatic truth threshold. Public capability evidence does not verify a synthetic account's billing or member state.

I require cases covering malformed fields, invented or forged evidence, hostile instructions, unsupported scope, stale/future evidence, unknown facts, readiness gates, timestamps, replay conflicts, suppression, atomic import, contamination, and cohort integrity. The deliberately broken evaluation replaces the extraction validator with one that accepts everything. Existing expected rejections must turn RED; I do not change expected answers to make the regression pass. [The runbook](runbook.md) records actual executed results separately from these requirements.

For a future production LLM, I would version the prompt, model, schema, source snapshot and rule configuration. I would build authorised representative examples across process and language variants; hold a sealed evaluation set separate from development examples; measure field accuracy, evidence support, hallucination, abstention and downstream action correctness; and compare failures by segment. I would include adversarial documents and unknown/contradictory facts rather than evaluate only easy successful examples.

My deployment gate would require approved data use, a representative pass threshold agreed with domain owners, reliable structured output, red-team failures understood, bounded permissions, latency/cost limits, and a reviewed fallback. I would shadow first, then canary with a kill switch and human review for uncertain cases. Monitoring would capture schema failures, unsupported claims, drift, review outcomes and downstream action reconciliation. Model outage, timeout or quality regression would fall back to explicit review and deterministic safe routing. This is a proposed reliability design; no live model inference or production integration is implemented here.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
