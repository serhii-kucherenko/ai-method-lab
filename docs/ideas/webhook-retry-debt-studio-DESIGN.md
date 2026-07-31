/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Webhook Retry Debt Studio

## Brand
**Webhook Retry Debt Studio** — “Clear the backlog before the review.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Webhook Retry Debt Studio  
- Headline: Clear delivery debt before the incident review  
- Supporting: Queue failed and aging webhook deliveries by destination blast radius - then open the review with a cleanup pack, not a broker dump.  
- CTA primary → `/destinations` · secondary → `/demo`  
- Atmosphere: full-bleed cool signal field with faint pulse-grid grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: reliability-ops daylight signal board - precise, slightly cool, pulse-aware - not neon cyberpunk  
- Tokens:
  - `--color-ink`: deep graphite ink  
  - `--color-paper`: cool ash-white with faint pulse-grid grain  
  - `--color-accent`: signal cyan for healthy / cleared  
  - `--color-gap`: burnt orange for aged debt (sparingly)  
  - `--color-rule`: soft graphite for interactive tables  
- Display: **"Outfit"** · Body: **"Public Sans"** · Mono (ids): **"Roboto Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy Stale Flag cobalt, Schema Drift mint, or FinOps ledgers

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open cleanup)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/debt` `/deliveries` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Debt age bar fill when classification completes on `/debt`  
3. A/B compare row tint when debt-aware vs ignore-backlog toggles

## shadcn theme
- Radius: `sm`  
- Map `--primary` → signal cyan; `--destructive` → burnt orange debt; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/destinations` `/deliveries` `/debt` `/reviews` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell delivery debt queue | Open destinations | — |
| `/pricing` | Seats + debt sync | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/destinations` | Destination CRUD | Add / import | Empty list |
| `/deliveries` | Attempt inventory | Import deliveries | No attempts |
| `/debt` | Debt findings | Open cleanup | No debt in window |
| `/reviews` | Reviews + cases | Create review | None scheduled |
| `/imports` | Sync batches | Upload | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Destination rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
