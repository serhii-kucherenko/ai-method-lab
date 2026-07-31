/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Egress Spill Studio

## Brand
**Egress Spill Studio** — “Catch the transfer spill before the invoice.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Egress Spill Studio  
- Headline: Catch egress spill in dollars before invoice week  
- Supporting: Match data-transfer usage to the planned budget - then open invoice week with a spill pack, not a Cost Explorer dump.  
- CTA primary → `/budgets` · secondary → `/demo`  
- Atmosphere: full-bleed cool traffic field with faint route-map grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: FinOps traffic daylight - precise, slightly cool, route-aware - not neon cyberpunk  
- Tokens:
  - `--color-ink`: deep navy ink  
  - `--color-paper`: cool sky-white with faint route-map grain  
  - `--color-accent`: sky teal for on-budget  
  - `--color-gap`: coral for spill (sparingly)  
  - `--color-rule`: soft slate for interactive tables  
- Display: **"Syne"** · Body: **"Work Sans"** · Mono (figures): **"IBM Plex Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy Commitment Coverage Fraunces teal or Contract Rate Literata forest

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open invoice case)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/spills` `/egress` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Spill $ bar fill when match completes on `/spills`  
3. A/B compare row tint when budget-aware vs ignore-egress toggles

## shadcn theme
- Radius: `sm`  
- Map `--primary` → sky teal; `--destructive` → coral spill; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/budgets` `/egress` `/spills` `/invoices` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell $ egress spill | Open budgets | — |
| `/pricing` | Seats + sync usage | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/budgets` | Budget CRUD | Add / import budget | Empty budgets |
| `/egress` | Transfer usage | Import usage | No slices |
| `/spills` | Spill findings | Open invoice case | No spill in window |
| `/invoices` | Invoice cases | Create case | None open |
| `/imports` | Import batches | Upload | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Account rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
