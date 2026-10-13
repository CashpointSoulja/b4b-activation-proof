# Ayo Ahmed — Independent concept: visual and brand guide

Evidence reviewed on 13 October 2026 before implementation: [Bolt brand guidance](https://bolt.eu/en/company/brand/), [Bolt for Business](https://bolt.eu/en/business/), [full Lead GTM Engineer, B4B role](https://bolt.eu/en/careers/positions/871aaddd-4293-46a0-8f22-bd2d476659ab/), and support articles [45861](https://bolt.eu/en/support/articles/45861/), [62851](https://bolt.eu/en/support/articles/62851/), [32674](https://bolt.eu/en-lt/support/articles/32674/). Official references are evidence, not project assets.

## Ownership and permission

The brand page says: “Before publishing any assets in the link below, you must have written permission from Bolt.” Written permission has not been established. Do not publish official media, logos, wordmarks, product screenshots, illustrations, photography, or downloaded brand fonts. Do not draw a substitute Bolt logo or alter its wordmark. No official assets are included in this repository.

The page also says: “If you mention Bolt, your own branding must appear more prominently.” The most prominent identity is **Ayo Ahmed — Independent concept**, at top left on every desktop and mobile view. **Independent concept for Bolt for Business** is secondary explanatory text, never a logo lockup. The layout must not imply employment, endorsement, partnership, or official product status.

Include this exact trademark notice in the footer and documentation:

> The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.

Display this exact disclaimer prominently before interactive content:

> Unofficial concept. All accounts/events are synthetic. No live CRM, outreach, payments or rides.

Do not add authorship-tool or model attribution to public artifacts. State the human-owned independent concept identity, scope, and evidence limits.

## Verified observations and original translation

The live careers page uses a light neutral reading surface, near-black body copy, green accents, a left metadata card, a wider right content column, clear headings, a restrained radius, and a dark footer. The full role description was visibly rendered and privately captured with a live browser; the initial server HTML exposed only role headings.

The official brand text describes one green palette across products and a dark green chosen for readable contrast. It says Bolt changed from Euclid to **Inter**, described as open source. Inter is an appropriate independently licensed interface font; source it from an open-source package with its license, not Bolt's CDN. Use `Inter, ui-sans-serif, system-ui, sans-serif`. A generic system fallback is required when the font is unavailable.

The business page's copy emphasizes control of company travel and meals, group spending rules, bulk employee onboarding, invitation emails, and order reporting. Its body was verified live. In this environment the `assets.homepage.bolt.eu` stylesheet origin is outside the allowlist, so the business capture is partially unstyled: do not claim its captured layout establishes exact official spacing, font metrics, or colours. Brand direction and the fully styled careers reference establish the observations above. The concept itself is an original application layout, not a clone.

## Original colour tokens

These are selected for this concept and are not sampled or represented as exact Bolt brand values.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#12372A` | Main titles, dark text, focus outlines |
| `--green` | `#176B45` | Primary button and active navigation |
| `--green-bright` | `#69D59A` | Decorative flow markers; not white-text buttons |
| `--green-soft` | `#EAF5EF` | Status backgrounds and light callouts |
| `--canvas` | `#F5F7F4` | App background |
| `--surface` | `#FFFFFF` | Cards and workbench |
| `--muted` | `#52665B` | Secondary text |
| `--line` | `#D5E0D8` | Borders |
| `--amber` | `#885311` | Review-needed text, paired with `#FFF3DE` |
| `--red` | `#A83C3C` | Invalid or blocked text, paired with `#FCEDED` |

Use deep green on pale mint for readable labels. Colour must never be the only state indicator: pair it with text and an original geometric icon. Disabled controls need legible text and a reason. Visible keyboard focus uses a 3px deep-green outline with 3px offset.

## Layout and type

Use a generous desktop canvas with maximum content width around 1280px, 32px gutters, and a compact navigation rail or horizontal tabs. Separate the account list, account detail, and evidence/decision panel. The entry view should answer what this concept proves, which synthetic cohort it uses, and what action is available. Avoid a wall of undifferentiated metrics.

Use 8px spacing increments; 12–16px card radius; thin borders; minimal shadow. Main heading 36–44px/1.1, section heading 20–24px/1.25, body 14–16px/1.5, labels 12–13px/1.4. Keep meaningful text no smaller than 12px. Avoid a fake official Bolt header.

At narrow widths, place the independent identity first, stack panels, retain the full scope disclaimer, and use actual buttons for tabs. Tables may scroll within their container but the page itself must not overflow. All interactions must support keyboard operation, clear labels, and appropriately announced status changes.

## Copy, data, and product boundaries

Use direct operational language: “Invited”, “Active”, “Invite expired”, “Evidence”, “Review required”, “Synthetic order completed”. Distinguish member status from simulated account activation. A first completed synthetic order is this concept's activation definition; it is not an official Bolt account status.

Company-pay and employee-pay have different readiness conditions. In company-pay, a member becomes Active when onboarding is complete; do not require a personal payment card. “No payment method” belongs only to employee-pay. Policies apply to employee groups but do not apply to Ride Booker trips. Food availability varies by country, so the proof should default to work rides and explicitly defer other services.

No unsupported claims about internal failures, applicant employment or experience, salary bands, real savings, real incrementality, or production integration. Mark all account/event data synthetic and show simulated metric denominators. Do not send real invitations, contact companies, open a live Bolt account, take payment, or book rides.

## Original reference

[Original visual reference](design/activation-workbench-reference.svg) uses only authored SVG shapes and text. It illustrates visual hierarchy and the safety/scope markers; numbers are labelled synthetic. It includes no imported image, copied logo, official screenshot, or embedded font. It is a directional reference, not a claim that Bolt uses this interface.

The Bolt name and logo are trademarks of Bolt Technology OÜ or its affiliates. All rights reserved.
