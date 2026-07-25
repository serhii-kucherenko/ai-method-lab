# Design — Feature Sufficiency Studio

## Brand
**Feature Sufficiency Studio** — clinical ML eval soft-sim. Hero must read as partial-observation sufficiency vs full-feature capability, not a generic lab desk. Never brand as FSA.

## Landing brief
- **Headline:** Know when partial data is enough.
- **Support:** Feature packs and observation masks for sufficiency checks — compare partial-feature performance against full-feature baselines before you lock an eval pack.
- **Primary CTA:** Open features → `/features`
- **Secondary:** See demo → `/demo`
- Selling points: feature packs, observation masks, sufficiency runs, dual compare, delta scoreboard
- Honesty: soft-sim only; not clinical advice; not FDA; not authors’ system
- Sources: arXiv 2607.09165 · authors’ code: none published

## Visual direction
- **Palette:** deep slate ink + electric teal sufficiency accent + soft sand panel (not purple, not cream-terracotta, not broadsheet)
  - `--fs-ink: #15202b`, `--fs-teal: #1f8a7a`, `--fs-sand: #f3efe6`, `--fs-line: #c9d5cf`, `--fs-warn: #b85c38`
- **Typography:** Fraunces (display) + Manrope (body) via Google fonts — not Inter/Roboto/Arial
- **Atmosphere:** soft diagonal sand mist + faint feature-grid pattern (CSS), full-bleed hero

## Layout rules
One composition first viewport; brand-first; one job per section; cards only for interactive work surfaces; no hero overlays or pill clusters.

## Motion
1. Hero mist fade-in
2. CTA underline draw
3. Feature-mask row highlight on focus

## shadcn theme
Radius `0.5rem`; map primary to teal; secondary warn accents; components: button, card, input, label, badge, table, tabs, select, textarea, separator.

## Page map

| Route | Purpose | Empty / error |
|-------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Seats + packs tiers | — |
| `/demo` | Guided steps | Step blocked until prior done |
| `/onboarding` | Progress checklist | Incomplete items listed |
| `/flows` | ≥5 flows + CTAs | — |
| `/features` | Feature pack registry | Empty → create first pack |
| `/masks` | Observation masks | Need pack selected |
| `/cohorts` | Cohort / case workspace | No cases |
| `/sufficiency` | Sufficiency runs | Need mask + cohort |
| `/compare` | Partial vs full A/B | Need run |
| `/scoreboard` | Delta winners | No compares yet |
| `/settings` | Org/members/webhook/export | Auth fail |
| `/honesty` | Fence | — |

## Commercial surfaces
`/pricing`, `/demo`, `/onboarding`, `/flows` required before sustain.
