# Design — Drive Horizon Studio

## Brand
**Drive Horizon Studio** — industrial AV simulation / world-model eval. Hero-level product name; never Orbis / Orbis 2.

## Landing brief
- **Headline:** Trust the horizon — coarse structure before pretty rollouts.
- **Support:** Hierarchical coarse+detail world-model scores beat flat single-level benches before planner packs lock.
- **Primary CTA:** Open scenario packs → `/packs`
- **Secondary:** Guided demo → `/demo`
- Selling points: scenario pack registry, coarse scene board, detail-generator workspace, A/B dual score, scoreboard + audit
- Honesty: soft-sim method-lab product; not live vehicle deployment; not certification; not Orbis
- Sources: arXiv 2607.15898v1; authors’ code: none

## Visual direction
- **Palette:** Road asphalt `#1C2430`, horizon amber `#D97706`, sky mist `#E8EEF4`, lane teal `#0F766E`, chalk `#F7F9FB`, ink `#121820`
- **Typography:** Fraunces (display) + Source Sans 3 (body) — not Inter/Roboto
- **Atmosphere:** Soft horizontal horizon wash + asphalt grain; not flat fill
- **Anti-looks:** No purple-indigo AI default; no cream+terracotta cliché; no broadsheet newspaper; not dark-mode-by-default

## Layout rules
- First viewport: one composition — brand, one headline, one sentence, CTA group, full-bleed horizon atmosphere
- Cards only for interactive work surfaces (pack forms, compare panel)
- One job per section

## Motion
1. Hero horizon line draws across
2. Brand underline draws under Drive Horizon Studio
3. Compare row hover lift (subtle)

## shadcn theme
- Radius: 0.4rem
- Primary: horizon amber `#D97706`
- Background: chalk `#F7F9FB`
- Foreground: ink `#121820`
- Components: button, card, input, label, select, table, tabs, badge, separator, textarea

## Page map

| Page | Purpose | Empty/error |
|------|---------|-------------|
| `/` | Sell outcome | — |
| `/pricing` | Bench / Team / Pack tiers | Honesty: no live checkout |
| `/demo` | Numbered guided path | Missing scene → seed CTA |
| `/onboarding` | Checklist + progress | Incomplete steps stay open |
| `/flows` | ≥5 flow cards + CTAs | — |
| `/packs` | Scenario pack registry | Empty → create first pack |
| `/scenes` | Coarse scene board | Need pack first |
| `/generators` | Detail generators | Need scene first |
| `/compare` | A vs B score | Need generator |
| `/scoreboard` | Ranked compares | Empty → run compare |
| `/settings` | Org / members / export / audit | Auth fail → 401 |
| `/honesty` | Soft-sim fence + Sources | — |

## Commercial surfaces
- Pricing copy matches bench seats + scenario packs money hook
- Demo is interactive step walkthrough
- Onboarding checklist with visible progress bar

## Multi-flow + platform
Named flows match blueprint. Category: industrial-sim / eval — versioned packs, dual compare, scoreboard, audit, export, org/settings, search.
