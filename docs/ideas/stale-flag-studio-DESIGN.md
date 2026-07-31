/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Stale Flag Studio

## Brand
**Stale Flag Studio** — “Clean the flags before you freeze.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Stale Flag Studio  
- Headline: Clear flag debt before the freeze window  
- Supporting: Find expired, stuck-true, and unused flags with owners and blast radius - then enter freeze with a cleanup pack, not a console dump.  
- CTA primary → `/flags` · secondary → `/demo`  
- Atmosphere: full-bleed cool steel release board with faint toggle-grid grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: release-ops daylight steel - precise, slightly cool, workboard - not neon cyberpunk  
- Tokens:
  - `--color-ink`: deep steel ink  
  - `--color-paper`: cool gray-white with faint toggle-grid grain  
  - `--color-accent`: cobalt for healthy / cleaned  
  - `--color-gap`: brick for stale debt (sparingly)  
  - `--color-rule`: soft steel for interactive tables  
- Display: **"Sora"** · Body: **"Manrope"** · Mono (keys): **"JetBrains Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy FinOps teal/forest ledgers

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open cleanup)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/debt` `/flags` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Debt row severity tint when classification completes on `/debt`  
3. A/B compare row highlight when debt-aware vs ignore-stale toggles

## shadcn theme
- Radius: `sm`  
- Map `--primary` → cobalt; `--destructive` → brick debt; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/flags` `/debt` `/owners` `/freezes` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell flag debt queue | Open flags | — |
| `/pricing` | Seats + sync usage | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/flags` | Inventory CRUD | Add / import flag | Empty inventory |
| `/debt` | Debt findings | Open cleanup | No debt in window |
| `/owners` | Owner mapping | Assign owner | Unmapped flags |
| `/freezes` | Freeze + cleanup cases | Create freeze | None scheduled |
| `/imports` | Sync batches | Upload / sync | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Project rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
