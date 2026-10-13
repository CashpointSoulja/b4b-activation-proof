# Public walkthrough: recording plan and narration

**Ayo Ahmed — Independent concept**

Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

## Current delivery status

The requested 105-second portrait walkthrough has **not been recorded**. It awaits an approved public HTTPS deployment with a working UI and backend. No localhost footage, slideshow, invented live URL, or fabricated final cut is supplied in its place.

The recording and composition sources below are ready for an approved public deployment. A local speech preview, if generated, is **narration draft only**. It does not establish a public deployment or a completed walkthrough. There has been no full-cut watch or listen because no cut exists.

## 105-second storyboard and complete narration

The whole frame is the actual public interface at 720 × 1280, with a visible cursor. There are no title slides. Identity and the synthetic-data disclaimer must be visible in the opening scene. Scroll the relevant control and its result into the portrait viewport during each scene. This table is the recording plan; it is not a claim that these actions have been recorded.

<!-- NARRATION_JSON_START -->
```json
[
  {"id":"account","start":0,"duration":10,"narration":"This is B4B Activation Proof, an independent concept by Ayo Ahmed. Accounts and orders are synthetic. No external service is connected."},
  {"id":"blocker","start":10,"duration":12,"narration":"Open Lumen's recorded evidence. Billing is the remaining readiness gate. The next action identifies the owner and what to resolve, while provenance records the synthetic source and timestamp."},
  {"id":"routing","start":22,"duration":12,"narration":"Check qualification routing. Deterministic server rules validate recorded synthetic extractions. Missing facts abstain; conflicts escalate. The interface explains each decision and owner. No external service is connected."},
  {"id":"ready","start":34,"duration":12,"narration":"Resolve the billing gate. The account becomes ready. Activation requires a first valid order at or after readiness. The ledger separates these decisions and preserves their evidence."},
  {"id":"first-order","start":46,"duration":12,"narration":"Record the first synthetic order. The qualifying event changes activation exactly once. Its identifier and event time remain in the evidence, so the result can be checked against the readiness decision."},
  {"id":"deduplication","start":58,"duration":12,"narration":"Replay that identifier, then send an earlier event. The duplicate is ignored and the earlier event cannot inflate activation. Both decisions stay visible, alongside the reason each event was excluded."},
  {"id":"evaluations","start":70,"duration":12,"narration":"Run the server evaluations, then inject a broken evaluator. A passing baseline cannot cover this failure. The run reports failed checks and turns the health report red for the negative control."},
  {"id":"holdout","start":82,"duration":12,"narration":"Open the holdout report. Eligibility, assignment, exclusions, and both denominators are visible. These synthetic results are descriptive. This demonstration does not establish causal lift or statistical significance."},
  {"id":"exports","start":94,"duration":11,"narration":"Export JSON with the synthetic audit, cohort, and receipts. Export CSV with recorded transitions. These preserve reviewable state from Ayo Ahmed's independent concept. No external service is connected."}
]
```
<!-- NARRATION_JSON_END -->

| Time | Public UI action and required visible evidence |
| --- | --- |
| 0–10 s | Reset the synthetic demo through its actual UI. Show the independent identity and exact disclaimer, then select `uk-lumen`. |
| 10–22 s | Open the billing blocker. Keep the gate, owner, action, and provenance in frame. |
| 22–34 s | Open qualification routing; show the recorded extraction's source validation, abstain/escalate rules, and deterministic server decision. No external integration is implemented. |
| 34–46 s | Resolve the billing prerequisite through `ready-check`; show ready status separately from activation. |
| 46–58 s | Click the first-order control and show the qualifying activation result. |
| 58–70 s | Click duplicate-order, then out-of-order; show the exclusions and unchanged qualifying activation count. |
| 70–82 s | Execute baseline server evals, enable injected failure (which executes a new server run), and expand an actual failing case with expected and actual results. |
| 82–94 s | Open the holdout report; show eligibility, assignments, exclusions, denominators, and limits. |
| 94–105 s | Click both export controls, wait for real downloads, and show the results. JSON contains actual synthetic state, audit, cohort, and receipts; CSV contains recorded audit transitions. Evaluation results are reviewed separately. |

## Reproduce the public-only capture

Prerequisites: Node 22 or later, Python 3, Bash/Linux utilities, Playwright with Chromium, and FFmpeg/FFprobe built with the local speech filter. Run `npm ci` to install the pinned development dependencies, then run `npx playwright install chromium`. Alternatively, set `CHROMIUM_PATH=/usr/bin/chromium` when using an existing Chromium binary. The host must already have an authorized deployment with the complete UI and backend, and must be publicly reachable without authentication bypasses.

```sh
PUBLIC_URL='https://REPLACE-WITH-YOUR-APPROVED-PUBLIC-HOST'
node scripts/record-public.mjs --check-url "$PUBLIC_URL"
node scripts/record-public.mjs "$PUBLIC_URL" work/walkthrough/capture
bash scripts/compose-walkthrough.sh work/walkthrough/capture output/walkthrough.mp4
```

The recorder refuses HTTP, localhost, private/reserved addresses, private DNS destinations, credentials in URLs, and redirects outside the approved origin. Requests are confined to that public HTTPS origin. It interacts through the visible UI; it does not replace responses, generate mock browser frames, mutate backend state through a hidden API, or capture a local application. It writes the raw browser video, scene checkpoint screenshots, download files, and a provenance manifest. An incomplete run cannot be composed.


For a voice-only draft while public hosting is blocked:

```sh
bash scripts/compose-walkthrough.sh --narration-only output/narration-draft.wav
```

Speech is synthesized locally using the free voice already available in FFmpeg. No paid voice API is called. The script checks each take length, fits it within its scene, and preserves the scene's silence margin. The public video is labelled as an independent concept.

The composer first normalizes the **complete raw capture** to constant 30 fps using its timestamps. Only then does it trim the complete narrative interval and align it with the nine narration scenes. This ordering handles sparse browser-video timestamps; it must never trim sparse frames first and assume the resulting duration represents elapsed UI time. The output is H.264/AAC, 720 × 1280, 30 fps, exactly 105 seconds. Review frames for each scene and both sides of every boundary, plus a review-required manifest with the cut's checksum, are written under the capture directory's `review/` folder.

## Review before sharing

After an actual public capture, inspect every scene and both sides of every boundary. Check text readability, cursor visibility, actions and resulting state within the portrait crop, download completion, and the failure result. Check the public capture manifest against the URL and screenshots. Then **Ayo must watch and listen to the complete 105-second cut** before any sharing. Record who reviewed it, when, the file checksum, and any corrections in a review note. Automated probes and extracted frames do not constitute a full watch and listen. No outreach or sharing is authorized by these scripts.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
