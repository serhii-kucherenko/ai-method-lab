# Design — Retro Route Studio

## Brand
**Retro Route Studio** — synthesis-planning soft-sim. Hero must read as chem route memory, not a generic lab desk. Never brand as RetroAgent.

## Landing brief
- **Headline:** Remember every branch you already tried.
- **Support:** Structured search memory for multi-step retrosynthesis — compare agentic memory planning against greedy local search before you lock a route pack.
- **Primary CTA:** Open packs → `/packs`
- **Secondary:** See demo → `/demo`
- Selling points: route packs, memory board, intermediates, dual compare, scoreboard
- Honesty: soft-sim only; not wet-lab; not certification; not authors’ system
- Sources: arXiv 2607.14512 · authors’ code: none published

## Visual direction
- **Palette:** cool slate lab glass + teal route ink + amber memory highlight (not purple, not cream-terracotta, not broadsheet)
  - `--rr-ink: #0f2a2e`, `--rr-teal: #1a7a6d`, `--rr-amber: #c47a1a`, `--rr-mist: #e8f1ef`, `--rr-glass: #f4faf8`
- **Typography:** Fraunces (display) + Source Sans 3 (body) via Google fonts — not Inter/Roboto/Arial
- **Atmosphere:** soft diagonal mist gradient + faint molecular grid pattern (CSS), full-bleed hero

## Layout rules
One composition first viewport; brand-first; one job per section; cards only for interactive work surfaces; no hero overlays or pill clusters.

## Motion
1. Hero mist fade-in
2. CTA underline draw
3. Memory board row highlight on focus

## shadcn theme
Radius `0.5rem`; map primary to teal; secondary amber accents; components: button, card, input, label, badge, table, tabs, select, textarea, separator.

## Page map

| Route | Purpose | Empty / error |
|-------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Seats + packs tiers | — |
| `/demo` | Guided steps | Step blocked until prior done |
| `/onboarding` | Progress checklist | Incomplete items listed |
| `/flows` | ≥5 flows + CTAs | — |
| `/packs` | Pack registry | Empty → create first pack |
| `/routes` | Candidate routes | Need pack selected |
| `/memory` | Search memory board | Empty tried paths |
| `/intermediates` | Property workspace | No intermediates |
| `/compare` | A vs B | Need route + memory |
| `/scoreboard` | Winners | No compares yet |
| `/settings` | Org/members/webhook/export | Auth fail |
| `/honesty` | Fence | — |

## Commercial surfaces
Pricing: Solo Planner / Bench Team / Site Packs. Demo: numbered interactive steps. Onboarding: visible progress %.

## Multi-flow + platform
Named flows match blueprint. Category: chem-planning eval — packs, dual compare, scoreboard, audit, export, org, search, webhook, honesty.

## Anti-looks
Refuse purple-on-white, cream+terracotta, broadsheet hairlines, dark-mode-by-default, glow stacks, emoji clutter.
