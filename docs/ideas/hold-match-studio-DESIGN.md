# Design — Hold Match Studio

## Brand

**Hold Match Studio** — hero-level on landing. Tagline: *Hold for experience — or lock the first feasible?*

## Landing brief

- **Headline:** Matching that waits for better passenger–driver experience needs a hold studio.
- **Support:** Register driver–order candidates, assign experience hold tiers, score passenger and driver lanes, walk timelines, and compare against first-feasible baselines.
- **Primary CTA:** Open holds → `/holds`
- **Secondary:** Guided demo → `/demo` · Pricing → `/pricing` · Onboarding → `/onboarding`
- **Selling points:** Hold decision board · Experience lanes · Match timelines · Experience-aware vs first-feasible compare · Honesty fence
- **Sources:** https://arxiv.org/abs/2607.09090v1 · authors’ code: none

## Visual direction

- **Palette:** Dispatch slate `#1e2a36`, hold amber `#c47a2c`, lane teal `#1f7a6c`, mist `#eef2f4`, panel `#f7f9fa` — not purple-AI, not cream+terracotta, not broadsheet, not Video Track coral, not Attest Proof teal-navy clone.
- **Type:** Display **Fraunces**; body **Source Sans 3** (Google fonts).
- **Atmosphere:** Full-bleed slate→amber city-grid wash hero with subtle route-line geometry; desk chrome uses mist wash + amber accents.
- **Motion:** Hero fade-up; nav active underline; compare score bar width transition.

## Layout rules

One composition first viewport (brand, headline, support, CTA). Cards only for interactive forms. One job per section.

## shadcn

Radius `0.5rem`; primary = hold amber; components: button, input, label, card, badge, table, tabs, select, textarea, separator.

## Page map

| Page | Purpose | Empty / error |
|------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Hypothetical SaaS tiers | Honesty: no live checkout |
| `/demo` | Numbered guided happy path | API error toast |
| `/onboarding` | First-run checklist + progress bar | Seed match fail |
| `/matches` | Candidate registry | Empty-state tip |
| `/holds` | Hold decision board | Prompt to pick match |
| `/lanes` | Passenger/driver lanes | Link to matches |
| `/timelines` | Hold/release events | Select match |
| `/compare` | A vs B | Need hold + scores |
| `/settings` | Org ops | Rate-limit toast |
| `/honesty` | Fence + Sources | — |

## Anti-looks

No purple-on-white, no warm-cream serif terracotta, no newspaper columns, no dark-mode-by-default, no pill-stat clutter in hero, no Video Track coral clone, no Attest Proof teal clone.
