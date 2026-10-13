# My runbook and verification record

**Ayo Ahmed — Independent concept**

> Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

I use this runbook to reproduce the synthetic proof, inspect failure behaviour and state what I actually verified. A passing local check does not establish production readiness or business impact.

## Run locally

I use Node.js 22 or later and the pinned dependency lockfile. From the repository root:

```sh
npm ci
npm run dev
```

The default local app is `http://localhost:8787`. I open it in a browser and load state before sending mutations. Local Wrangler provides a Worker, assets binding and SQLite-backed Durable Object; retained local persistence supports refresh and process-restart inspection. Local HTTP cookies omit Secure; HTTPS adds it.

I keep this browser session synthetic. I do not paste real employee/company records, supply service credentials, use a real upload, send a live invitation or trigger payment/ride providers. The code has no integration for those effects.

## Verify rules and runtime

```sh
npm test
npm run eval
```

To confirm that the existing expectations catch the deliberately broken validator:

```sh
node --input-type=module -e 'import {runEvaluations} from "./src/evaluation.js"; const r=runEvaluations({broken:true}); console.log(JSON.stringify(r,null,2)); process.exitCode=r.status==="RED" && r.failed>0 ? 0 : 1;'
```

This last command succeeds when it detects RED. RED is the expected negative-control result, not a passing extraction quality result. In a loaded session, `/api/evaluations` and `/api/evaluations?broken=1` expose the same harness through the Worker. Evaluation GETs count against visitor request quotas.

I inspect the normal and broken reports, replay safety, conflicting event keys, optimistic revisions, malformed requests, bounded import previews, suppression, fixed denominators, incomplete observation and session isolation. The runtime tests start a real local Wrangler process; they do not merely mock the storage API. The executed result record below is the authority for what passed.

With the local app running, I run the standalone browser acceptance script separately:

```sh
node scripts/verify-browser.cjs
```

It uses Chromium at `/usr/bin/chromium` by default; `B4B_BROWSER_PATH` selects another installed executable and `B4B_QA_URL` selects the local test address. It writes [the browser result record](browser-results.json) and screenshots. Its nine browser groups are separate from the 47 Node/runtime tests. These are local functional QA captures, not public walkthrough footage or proof of deployment.

`node scripts/verify-short-viewports.cjs` also passed six short-height checks: 320/390/540-pixel widths at 568 and 640 pixels high, with every modal control visible for both valid and invalid import previews. [The executed results](short-viewport-results.json) and short-height screenshots record this additional check.

## Review the demo journey

1. I read the independent identity and synthetic disclaimer before interacting.
2. I select a hypothetical market profile and inspect an account's evidence, qualification, prerequisites and owner.
3. I review a recorded synthetic extraction candidate and its public capability provenance; I inspect a rejection or abstention rather than infer missing facts.
4. I resolve a bounded synthetic prerequisite. Renewing an expired invitation leaves the member Invited; I separately complete member onboarding to Active.
5. I simulate an eligible first company-pay order and inspect the event trail. An unready or backdated-before-ready order must be rejected.
6. I inspect a synthetic outbox preview and a suppression reason; no real delivery occurs.
7. I preview and commit synthetic import rows; invalid previews commit nothing and imported accounts stay outside the fixed experiment denominator.
8. I inspect numerator/denominator, observation completeness, exposure, holdout contamination and observed-only TTFO. I can advance the explicit clock or record synthetic contamination to see the caveats change.
9. I run the GREEN evaluation and intentionally RED negative control; then reload and confirm state persistence.

## Operational diagnosis and reset

| Symptom | My response |
| --- | --- |
| Revision conflict (409) | Reload state, inspect the current revision and action, then retry deliberately; do not bypass the revision check |
| Duplicate event result | Use the stored result; do not count another effect |
| Idempotency conflict (409) | Keep the original key tied to its original payload; review the changed intent |
| Invalid/stale import | Fix synthetic rows or create a fresh preview; no partial commit is allowed |
| Unqualified, stale or ambiguous evidence | Use review/refresh of the allowlisted synthetic fixture; no recommendation should infer unknown facts |
| Message suppressed | Inspect reason (holdout, opt-out, qualification, invitation, activation, deduplication, cap or window); do not report delivery |
| Incomplete or invalid experiment result | Wait for the observation cutoff or repair the denominator contract; withhold an unsupported comparison |
| Request limit (429) | Wait for the minute window if applicable; the lifetime quota remains until expiry. Reset does not reset quotas |
| Session expiry (410) | Reload to start a new isolated demo; the old state is deleted and cookie cleared |
| Regression report RED | Inspect failed cases and rule version; block promotion and keep review fallback |

The demo reset affects only the current visitor, re-seeds fixtures, increments generation/revision and clears synthetic history and receipt namespace. I treat it as a synthetic demonstration tool, not a production recovery or data-retention mechanism. Audit history is bounded and can be trimmed; it is not an immutable compliance log. I would establish independent observability, backup/recovery, incident ownership and durable external-effect reconciliation before a production pilot.

## Verification record — 13 October 2026

| Executed check | Observed result |
| --- | --- |
| `npm test` | Exit 0; **47/47 tests passed**: 40 deterministic matrix cases, 6 harness/domain checks, and 1 actual Wrangler runtime integration test |
| Normal evaluation runner | **GREEN, 40/40 cases passed**, 0 failed |
| Broken extraction validator | **RED, 33/40 passed, 7 failed**; the unchanged expectations caught malformed, hallucinated, injected-instruction, unsupported-market, invalid-confidence, unmarked-live and forged-evidence acceptance |
| Actual Worker runtime | Wrangler on local `127.0.0.1:8791` with fresh SQLite storage at `work/runtime-test`; separate A/B visitor cookies created and state isolation verified |
| Atomic failure and import checks | Full saved state remained unchanged after stale/invalid commands; invalid import preview was reviewable and commit returned `IMPORT_INVALID` without importing rows |
| Real process restart | Stopped and restarted Wrangler using the same SQLite persistence path; visitor A's full stored state survived and visitor B remained at its isolated initial seed |
| Worker evaluation routes | Normal report GREEN and `?broken=1` report RED through the running Worker |
| State and audit bounds | Ordinary event accumulation reached the 110 KiB serialised-state cap and rejected further growth atomically; latest-200 audit retention and oldest-entry trimmed count verified |
| Runtime request quota | The actual 30/minute cap returned 429 with Retry-After between 1 and 60 seconds; reset before the cap preserved quota, and reset after the cap also returned 429. The 240-request lifetime cap is implemented but was not directly exercised |
| Standalone browser acceptance | **9/9 groups PASS**, recorded in [browser-results.json](browser-results.json): desktop GREEN40 with no script errors; billing to first order with 24-hour observed TTFO; duplicate/pre-readiness rejection; actual handoff download containing audit, fixed cohort and two receipts; inspectable expected/actual values for seven deliberately RED failures; stale preview rejection and invalid import all-or-nothing behaviour |
| Extraction and DOM safety in browser | Hostile extraction left an unknown account abstained; the reviewed recorded fixture qualified it. A successfully imported HTML-like name rendered as literal text without execution; unknown evidence stayed abstained and fixed cohort stayed at twelve |
| Responsive and modal checks | At 320, 390 and 540 px widths, fresh visitors had isolated state and no horizontal page overflow; every modal action remained inside a 900 px-high viewport. Verified 3 px keyboard focus, Tab containment, Escape closure and focus return |
| Wrangler deployment dry run | Exit 0 using Wrangler 4.149; assets and SQLite Durable Object packaged. Packaging only, with no public deployment or service availability claim |

I ran the runtime integration with local loopback network permission in this managed environment. Wrangler's configuration directory was placed at `work/runtime-config`. The synthetic domain clock remained fixed at `2026-10-13T12:00:00.000Z`; seeded facts and simulation inputs were deterministic. These observations validate the exercised local paths. They do not measure production availability, real model quality, public traffic safety, regulatory compliance, business lift, or real customer outcomes.

I also inspected the captured [desktop entry](screenshots/desktop-entry.png), [desktop workspace](screenshots/desktop-workspace.png), [negative control](screenshots/negative-control.png), and mobile views at [320 px](screenshots/mobile-320.png), [390 px](screenshots/mobile-390.png) and [540 px](screenshots/mobile-540.png). Modal captures at [320 px](screenshots/import-320.png), [390 px](screenshots/import-390.png) and [540 px](screenshots/import-540.png) preserve the responsive inspection evidence.

## Public deployment blocker

Cloudflare authentication verification returned **HTTP 400, code 1001, “Missing Authorization header”**. I have no scoped Cloudflare authentication, approved account/destination or verified free-plan entitlement. Public deployment is therefore blocked; this record supplies no public demo URL. I do not infer a successful deployment from local execution.

Before an authorised deployment I would inspect the account, service plan and Durable Object eligibility, configure admission/issuance limits and spend controls, review retention and public traffic exposure, and then run the deployment and acceptance checks against the approved destination. New-session creation is not globally bounded in this proof: clearing a cookie can bypass per-session quotas by starting another session. No real services would be connected as part of publishing this synthetic slice.

Future application materials would link only a working Demo and Walkthrough. I have not sent outreach or contacted anyone from this repository.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
