/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Schema Drift Studio

## Brand
**Schema Drift Studio** — “Prove the pack before the gate.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Schema Drift Studio  
- Headline: Prove schema matches the pack before you gate  
- Supporting: Diff the last approved migration pack against live schema - then open the release gate with an evidence pack, not a console dump.  
- CTA primary → `/packs` · secondary → `/demo`  
- Atmosphere: full-bleed cool blueprint field with faint ER-grid grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: data-platform daylight blueprint - precise, slightly cool, diagrammatic - not neon cyberpunk  
- Tokens:
  - `--color-ink`: charcoal blueprint ink  
  - `--color-paper`: cool mint-white with faint ER-grid grain  
  - `--color-accent`: sea green for pack-matched  
  - `--color-gap`: vermillion for drift (sparingly)  
  - `--color-rule`: soft slate for interactive tables  
- Display: **"Bricolage Grotesque"** · Body: **"Schibsted Grotesk"** · Mono (DDL): **"Fragment Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy Stale Flag cobalt steel or FinOps ledgers

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open evidence)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/drifts` `/schemas` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Drift row expand when classification completes on `/drifts`  
3. A/B compare row tint when pack-matched vs live-as-is toggles

## shadcn theme
- Radius: `sm`  
- Map `--primary` → sea green; `--destructive` → vermillion drift; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/packs` `/schemas` `/drifts` `/gates` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell drift evidence | Open packs | — |
| `/pricing` | Seats + drift runs | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/packs` | Approved packs | Add / import pack | Empty packs |
| `/schemas` | Snapshots | Import snapshot | No snapshots |
| `/drifts` | Drift findings | Open evidence | No drift in window |
| `/gates` | Gates + evidence cases | Create gate | None scheduled |
| `/imports` | Import batches | Upload | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Service rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
