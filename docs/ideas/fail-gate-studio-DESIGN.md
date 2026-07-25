# Design — Fail Gate Studio

## Brand
**Fail Gate Studio** — eval / safety release-gate bench. Hero-level product name; never MedFailBench.

## Landing brief
- **Headline:** Gate releases on why it failed — not only if it looked right.
- **Support:** Fail-gate taxonomy diagnosis beats correctness-only benches before medical LLMs ship.
- **Primary CTA:** Open fail cases → `/cases`
- **Secondary:** Guided demo → `/demo`
- Selling points: fail-case registry, severity + gate taxonomy, boundary inspection, A/B dual score, scoreboard + packs
- Honesty: soft-sim method-lab product; not clinical decision support; not MedFailBench; not hospital deployment
- Sources: arXiv 2607.15166v1; authors’ code: none

## Visual direction
- **Palette:** Clinical slate / signal red restraint — paper `#F2F4F7`, ink `#1A2332`, gate signal `#B42318`, calm teal `#1F6F78`, mist `#C5D0DB`
- **Typography:** Newsreader (display) + IBM Plex Sans (body) — not Inter/Roboto
- **Atmosphere:** Soft vertical “gate bar” wash + paper grain; not flat fill
- **Anti-looks:** No purple-indigo AI default; no cream+terracotta cliché; no broadsheet newspaper; not dark-mode-by-default

## Layout rules
- First viewport: one composition — brand, one headline, one sentence, CTA group, full-bleed gate atmosphere
- Cards only for interactive work surfaces (case forms, compare panel)
- One job per section

## Motion
1. Hero gate-bar wipe-in
2. Brand underline draws under Fail Gate Studio
3. Compare row hover lift (subtle)

## shadcn theme
- Radius: 0.35rem
- Primary: gate signal `#B42318`
- Background: paper `#F2F4F7`
- Foreground: ink `#1A2332`
- Components: button, card, input, label, select, table, tabs, badge, separator, textarea

## Page map

| Page | Purpose | Empty/error |
|------|---------|-------------|
| `/` | Sell outcome | — |
| `/pricing` | Bench / Team / Pack tiers | Honesty: no live checkout |
| `/demo` | Numbered guided path | Missing case → seed CTA |
| `/onboarding` | Checklist + progress | Incomplete steps stay open |
| `/flows` | ≥5 flow cards + CTAs | — |
| `/cases` | Fail-case registry | Empty → create first case |
| `/gates` | Gate taxonomy board | Need case first |
| `/boundaries` | Boundary inspections | Need case + taxonomy |
| `/compare` | A vs B score | Need inspection |
| `/scoreboard` | Ranked compares | Empty → run compare |
| `/packs` | Private case packs | Empty → create pack |
| `/settings` | Org / members / export / audit | Auth fail → 401 |
| `/honesty` | Soft-sim fence + Sources | — |

## Commercial surfaces
- Pricing copy matches bench seats + private fail-case packs money hook
- Demo is interactive step walkthrough
- Onboarding checklist with visible progress bar
