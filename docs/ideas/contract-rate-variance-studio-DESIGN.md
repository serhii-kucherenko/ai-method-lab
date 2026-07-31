/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Contract Rate Variance Studio

## Brand
**Contract Rate Variance Studio** — “Catch the rate before you pay.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Contract Rate Variance Studio  
- Headline: Catch invoice rate drift in dollars before payment  
- Supporting: Match contracted SKU rates to invoice lines - then open the payment run with a variance queue, not an OCR dump.  
- CTA primary → `/catalog` · secondary → `/demo`  
- Atmosphere: full-bleed daylight AP ledger field with faint rate-tape grain (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: accounts-payable daylight - crisp paper, ink numbers, restrained amber for variance - not neon FinOps cyberpunk  
- Tokens:
  - `--color-ink`: near-black indigo ink (not purple UI glow)  
  - `--color-paper`: cool paper white with faint horizontal rate-tape grain  
  - `--color-accent`: forest green for matched rates  
  - `--color-gap`: amber for unit-rate variance (sparingly)  
  - `--color-rule`: soft graphite for interactive tables  
- Display: **"Literata"** · Body: **"IBM Plex Sans"** · Mono (figures): **"IBM Plex Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default; do not copy Commitment Coverage teal ledger

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, open dispute)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/variances` `/invoices` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Variance $ count-up when a match completes on `/variances`  
3. A/B compare row tint when catalog-matched vs invoice-as-billed toggles

## shadcn theme
- Radius: `sm` (tight ops feel)  
- Map `--primary` → forest green; `--destructive` → amber variance; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/catalog` `/invoices` `/variances` `/disputes` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|---------------|
| `/` | Sell $ rate variance | Open catalog | — |
| `/pricing` | Seats + variance runs | Start demo | — |
| `/demo` | Guided dual claim | Next step | Honesty skip blocked |
| `/onboarding` | Checklist progress | Mark step done | Incomplete required |
| `/flows` | ≥5 journeys | Start flow | — |
| `/catalog` | Contract SKUs | Add / import SKU | Empty catalog |
| `/invoices` | Batches + lines | Import invoice | No batches |
| `/variances` | $ findings | Open dispute | No mismatches |
| `/disputes` | Cases + actions | Resolve / dismiss | None open |
| `/imports` | Import batches | Upload CSV | Failed batch detail |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Vendor rollups | Export | Empty org |
| `/settings` | Org / members / webhooks | Save | Validation |
| `/honesty` | Soft-sim fence | Back to work | — |
