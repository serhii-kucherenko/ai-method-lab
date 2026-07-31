/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Canary Budget Studio

## Brand
**Canary Budget Studio** — “Know the budget before you promote.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Canary Budget Studio  
- Headline: Know remaining canary budget before you promote  
- Supporting: Match SLO burn to the rollout window - then open the gate with a promote/hold pack, not a rollout console dump.  
- CTA primary → `/rollouts` · secondary → `/demo`  
- Atmosphere: full-bleed cool runway field with faint progress-rail grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: SRE release daylight runway - precise, slightly cool, progress-aware - not neon cyberpunk  
- Tokens:
  - `--color-ink`: deep charcoal ink  
  - `--color-paper`: cool chalk-white with faint progress-rail grain  
  - `--color-accent`: chartreuse for budget remaining  
  - `--color-gap`: rust for burn / hold (sparingly)  
  - `--color-rule`: soft graphite for interactive tables  
- Display: **"Cabinet Grotesk"** · Body: **"Figtree"** · Mono (metrics): **"IBM Plex Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy Eval Budget or Stale Flag cobalt steel

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open decision)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/budgets` `/signals` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Budget remaining bar drain when signals update on `/budgets`  
3. A/B compare row tint when budget-aware vs ship-anyway toggles

## shadcn theme
- Radius: `sm`  
- Map `--primary` → chartreuse; `--destructive` → rust burn; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/rollouts` `/budgets` `/signals` `/decisions` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell remaining budget | Open rollouts | — |
| `/pricing` | Seats + window sync | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/rollouts` | Canary inventory | Add / import | Empty list |
| `/budgets` | Remaining budget | Open decision | No active window |
| `/signals` | SLO signals | Import signals | No samples |
| `/decisions` | Promote/hold cases | Create decision | None open |
| `/imports` | Sync batches | Upload | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Service rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
