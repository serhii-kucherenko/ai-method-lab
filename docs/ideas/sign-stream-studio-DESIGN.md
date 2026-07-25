# Design — Sign Stream Studio

## Brand

**Sign Stream Studio** — hero-level on landing. Tagline: *Sentence streams in time — or wait for the batch?*

## Landing brief

- **Headline:** Real-time sentence-level sign translation needs a stream studio, not only an offline gloss dump.
- **Support:** Register sign streams, segment sentences, set latency budgets, curate glossary coverage, and compare real-time stream quality against offline-batch baselines.
- **Primary CTA:** Open streams → `/streams`
- **Secondary:** Guided demo → `/demo` · All flows → `/flows` · Pricing → `/pricing` · Onboarding → `/onboarding`
- **Selling points:** Stream registry · Sentence segments · Latency budgets · Glossary coverage · Real-time vs offline-batch compare · Honesty fence
- **Sources:** https://arxiv.org/abs/2607.09611v1 · authors’ code: none

## Visual direction

- **Palette:** Deep ink `#132a3a`, stream aqua `#1a9aaa`, signal lime `#6f9a3c`, mist `#e8f1f3`, panel `#f4fafb` — not purple-AI, not cream+terracotta, not broadsheet, not Hold Match amber/slate, not Tactile Chart chart chrome.
- **Type:** Display **Bricolage Grotesque**; body **Figtree** (Google fonts).
- **Atmosphere:** Full-bleed ink→aqua caption-wave wash hero with subtle waveform / caption-bar geometry; desk chrome uses mist wash + aqua accents.
- **Motion:** Hero fade-up; nav active underline; compare score bar width transition.

## Layout rules

One composition first viewport (brand, headline, support, CTA). Cards only for interactive forms. One job per section.

## shadcn

Radius `0.5rem`; primary = stream aqua; components: button, input, label, card, badge, table, tabs, select, textarea, separator.

## Page map

| Page | Purpose | Empty / error |
|------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Hypothetical SaaS tiers | Honesty: no live checkout |
| `/demo` | Numbered guided happy path | API error toast |
| `/onboarding` | First-run checklist + progress bar | Seed stream fail |
| `/flows` | Multi-flow index (≥5 journeys) | — |
| `/streams` | Stream registry | Empty-state tip |
| `/sentences` | Segment workspace | Prompt to pick stream |
| `/latency` | Latency budgets | Link to streams |
| `/glossary` | Glossary coverage | Select stream |
| `/compare` | A vs B | Need stream + scores |
| `/settings` | Org ops | Rate-limit toast |
| `/honesty` | Fence + Sources | — |

## Anti-looks

No purple-on-white, no warm-cream serif terracotta, no newspaper columns, no dark-mode-by-default, no pill-stat clutter in hero, no Hold Match amber clone, no Tactile Chart chart IA.
