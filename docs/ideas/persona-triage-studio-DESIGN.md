# Design — Persona Triage Studio

## Brand
**Persona Triage Studio** — clinical AI eval soft-sim. Hero must read as patient communication diversity vs idealized triage, not a generic lab desk. Never brand as the source paper’s product name.

## Landing brief
- **Headline:** Triage that survives how patients actually talk.
- **Support:** Persona packs and style axes for urgency evaluation — compare style-aware triage against idealized-patient baselines before you lock an eval pack.
- **Primary CTA:** Open personae → `/personae`
- **Secondary:** See demo → `/demo`
- Selling points: persona packs, conversation cases, style axes, dual compare, disparity scoreboard
- Honesty: soft-sim only; not clinical advice; not FDA; not authors’ deployed chatbot
- Sources: arXiv 2607.08625 · authors’ code: none published

## Visual direction
- **Palette:** deep clinic ink + coral urgency accent + soft mint calm (not purple, not cream-terracotta, not broadsheet)
  - `--pt-ink: #1a2433`, `--pt-coral: #c45c4a`, `--pt-mint: #3d8f7a`, `--pt-mist: #eef3f1`, `--pt-panel: #ffffff`
- **Typography:** Literata (display) + DM Sans (body) via Google fonts — not Inter/Roboto/Arial
- **Atmosphere:** soft vertical clinic mist gradient + faint dialogue-line pattern (CSS), full-bleed hero

## Layout rules
One composition first viewport; brand-first; one job per section; cards only for interactive work surfaces; no hero overlays or pill clusters.

## Motion
1. Hero mist fade-in
2. CTA underline draw
3. Persona row highlight on focus

## shadcn theme
Radius `0.5rem`; map primary to mint; secondary coral accents; components: button, card, input, label, badge, table, tabs, select, textarea, separator.

## Page map

| Route | Purpose | Empty / error |
|-------|---------|---------------|
| `/` | Sell outcome | — |
| `/pricing` | Seats + packs tiers | — |
| `/demo` | Guided steps | Step blocked until prior done |
| `/onboarding` | Progress checklist | Incomplete items listed |
| `/flows` | ≥5 flows + CTAs | — |
| `/personae` | Persona registry | Empty → create first persona |
| `/conversations` | Conversation cases | Need pack selected |
| `/styles` | Style-axis workspace | No axes defined |
| `/urgency` | Urgency assessment runs | Need case + persona |
| `/compare` | A vs B | Need run + baseline |
| `/scoreboard` | Disparity winners | No compares yet |
| `/settings` | Org/members/webhook/export | Auth fail |
| `/honesty` | Fence | — |

## Commercial surfaces
`/pricing`, `/demo`, `/onboarding`, `/flows` required before sustain.
