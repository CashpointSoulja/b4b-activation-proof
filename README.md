# B4B Activation Proof

**Ayo Ahmed - Independent concept**

Independent concept for Bolt for Business, focused on the Lead GTM Engineer, B4B role.

**Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.**

I chose one reviewable slice: synthetic account qualification → explicit company-pay setup gates → activation-ready → first eligible simulated employee business order → monitored activation decision. An inspectable handoff contains the actual session audit, idempotency receipts, fixed cohort, treatment exposure and observation-window evidence.

This is an engineering and evaluation concept, not evidence of Bolt's present failures, production model integrations, or commercial savings. Employee-pay, Ride Booker, real contact enrichment and external notifications are outside scope. Three market profiles are hypothetical language/setup/support configurations, not claims about local availability or regulation.

## Run and verify

```sh
npm ci
npm run dev
```

The local development UI is at `http://localhost:8787`. The Worker applies the same domain rules used by the evaluation harness; the browser has no fake success fallback. Each visitor gets an isolated persistent SQLite-backed Durable Object session.

```sh
npm test
npm run eval
npx wrangler deploy --dry-run --outdir work/build
```

With the local server running and Chromium installed, `npm run verify:browser` exercises the actual UI, hostile inputs, exports and keyboard controls at desktop and 320/390/540-pixel widths. `node scripts/verify-short-viewports.cjs` checks modal controls at 568/640-pixel heights.

A dry run validates packaging only. It does not establish a live deployment. Deployment requires an existing scoped Cloudflare identity, verified free account and approved destination for this new Worker. No existing resources should be changed or deleted.

## Inspect the concept

- [Brand evidence and original reference](docs/brand-guide.md)
- [Official source context and boundaries](docs/source-context.md)
- [PRD](docs/PRD.md), [30-second story, JTBD and 5 Whys](docs/story-and-discovery.md)
- [Architecture, API and abuse limits](docs/architecture.md)
- [Experiment and evaluation plan](docs/experiment-plan.md)
- [12–18 month roadmap and priorities](docs/roadmap-and-priorities.md)
- [Runbook and executed results](docs/runbook.md)
- [Browser checks](docs/browser-results.json), [original UI screenshots](docs/screenshots), [actual synthetic handoff export](docs/sample-handoff.json)
- [Executed baseline and injected-defect evaluation results](docs/evaluation-results.json)
- [105-second public-only walkthrough plan and capture sources](docs/walkthrough.md)

The PM package documents my product choices, experiment definitions, architecture, evaluation results, abuse limits and metric-driven roadmap. Public demo and walkthrough links will be listed only after actual deployment and recording; neither exists at the initial handoff. Future outreach materials should link Demo + Walkthrough. This task performs no outreach or application action.

## Publication boundary

The public brand guide was the first authored commit, before implementation. The only visual reference is an original SVG. Official screenshots, logos, photos and restricted media-pack fonts are absent. Inter is independently licensed from its open-source distribution, with its license retained.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
