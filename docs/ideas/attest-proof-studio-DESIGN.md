# Design — Attest Proof Studio

## Brand

**Attest Proof Studio** — hero-level on landing. Tagline: *Tool-attested answers. Checkable proof chains.*

## Landing brief

- **Headline:** Empirical answers you can attest — not fluent fiction.
- **Support:** Register claims, attach tool attestations, walk soft-sim kernel proofs, and compare attested vs fluent-only before you ship.
- **Primary CTA:** Open claims → `/claims`
- **Secondary:** Guided demo → `/demo` · Pricing → `/pricing` · Onboarding → `/onboarding`
- **Selling points:** Tool-attested claim registry · Soft-sim proof walker · Evidence ledger · Attested vs fluent compare · Honesty fence
- **Sources:** https://arxiv.org/abs/2607.12650v1 · authors’ code: none

## Visual direction

- **Palette:** Ink navy `#0f1c2e`, proof teal `#1a7a6d`, attestation amber `#c4892a`, paper wash `#eef3f7`, panel `#f7fafc` — not purple-AI, not cream+terracotta, not broadsheet.
- **Type:** Display **Fraunces**; body **Source Sans 3** (Google fonts).
- **Atmosphere:** Full-bleed navy→teal wash hero with soft grid (proof lattice); desk chrome uses light wash + teal accents.
- **Motion:** Hero fade-up; nav active underline; compare score bar width transition.

## Layout rules

One composition first viewport (brand, headline, support, CTA). Cards only for interactive forms. One job per section.

## shadcn

Radius `0.55rem`; primary = proof teal; components: button, input, label, card, badge, table, tabs, select, textarea, separator.

## Page map

| Page | Purpose | Empty / error |
|------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Hypothetical SaaS tiers (seats / usage / site) | Honesty: no live checkout |
| `/demo` | Numbered guided happy path | API error toast |
| `/onboarding` | First-run checklist + progress bar | Seed claim fail |
| `/claims` | Registry | Empty-state checklist tip |
| `/attestations` | Tool attestations | Prompt to pick claim |
| `/proofs` | Proof chains | Link to claims |
| `/kernel` | Step walker | Select proof |
| `/ledger` | Evidence entries | Seed demo |
| `/compare` | A vs B | Need claim + scores |
| `/settings` | Org ops | Rate-limit toast |
| `/honesty` | Fence + Sources | — |

## Anti-looks

No purple-on-white, no warm-cream serif terracotta, no newspaper columns, no dark-mode-by-default, no pill-stat clutter in hero.
