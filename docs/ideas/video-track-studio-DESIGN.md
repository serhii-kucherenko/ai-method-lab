# Design — Video Track Studio

## Brand

**Video Track Studio** — hero-level on landing. Tagline: *Do they track the character — or just the bench?*

## Landing brief

- **Headline:** Long-form scores that claim “watching” need a character-track audit.
- **Support:** Register clips and cast, run name-swap track probes, diagnose failures, and compare track-aware quality against fluency-only baselines.
- **Primary CTA:** Open clips → `/clips`
- **Secondary:** Guided demo → `/demo` · Pricing → `/pricing` · Onboarding → `/onboarding`
- **Selling points:** Clip + cast registry · Track-probe workspace · Failure taxonomy · Track-aware vs fluency compare · Honesty fence
- **Sources:** https://arxiv.org/abs/2607.11078v1 · authors’ code: none

## Visual direction

- **Palette:** Frame charcoal `#1a2332`, track coral `#e85d4c`, signal cyan `#2a9fb5`, film wash `#f0f2f5`, panel `#fafbfc` — not purple-AI, not cream+terracotta, not broadsheet, not Attest Proof teal-navy.
- **Type:** Display **Libre Baskerville**; body **DM Sans** (Google fonts).
- **Atmosphere:** Full-bleed charcoal→cyan film-strip wash hero with subtle horizontal reel lines; desk chrome uses light wash + coral accents.
- **Motion:** Hero fade-up; nav active underline; compare score bar width transition.

## Layout rules

One composition first viewport (brand, headline, support, CTA). Cards only for interactive forms. One job per section.

## shadcn

Radius `0.5rem`; primary = track coral; components: button, input, label, card, badge, table, tabs, select, textarea, separator.

## Page map

| Page | Purpose | Empty / error |
|------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Hypothetical SaaS tiers | Honesty: no live checkout |
| `/demo` | Numbered guided happy path | API error toast |
| `/onboarding` | First-run checklist + progress bar | Seed clip fail |
| `/clips` | Registry | Empty-state tip |
| `/characters` | Cast on clips | Prompt to pick clip |
| `/probes` | Track probes | Link to characters |
| `/failures` | Diagnosis taxonomy | Select probe |
| `/compare` | A vs B | Need probe + scores |
| `/settings` | Org ops | Rate-limit toast |
| `/honesty` | Fence + Sources | — |

## Anti-looks

No purple-on-white, no warm-cream serif terracotta, no newspaper columns, no dark-mode-by-default, no pill-stat clutter in hero, no Attest Proof teal clone.
