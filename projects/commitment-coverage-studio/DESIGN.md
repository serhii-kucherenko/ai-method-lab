/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Commitment Coverage Studio

## Brand
**Commitment Coverage Studio** — “See the gap before you renew.”

Brand is the hero-level signal on `/`. Headline supports; never overpowers the name.

## Landing brief (first viewport)
- Brand: Commitment Coverage Studio  
- Headline: See commitment waste in dollars before renewal  
- Supporting: Match Savings Plans, RIs, and CUDs to real usage - then walk into renewals with a gap pack, not a chart dump.  
- CTA primary → `/commitments` · secondary → `/demo`  
- Atmosphere: full-bleed cool ledger field (no inset hero card, no overlays, no stats in viewport one)

Later sections (below fold): Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: financial ops ledger - precise, daylight, slightly cool - not neon FinOps cyberpunk  
- Tokens:
  - `--color-ink`: deep slate ink  
  - `--color-paper`: cool off-white with faint ledger grain  
  - `--color-accent`: sharp teal for “covered”  
  - `--color-gap`: restrained rust for under-cover / spill (use sparingly)  
  - `--color-rule`: hairline graphite for tables that are interactive  
- Display: **"Fraunces"** · Body: **"Source Sans 3"** · Mono (figures): **"IBM Plex Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet newspaper, no dark-mode-by-default

## Layout rules
- One job per section; one composition first viewport  
- Cards only when they wrap an interaction (import, renew action)  
- No hero overlays, pill clusters, or fake browser chrome  
- Tables OK on `/coverage` `/gaps` when they are the work surface

## Motion (2–3)
1. Brand fade-in on landing  
2. Coverage bar fill on `/coverage` (commit-matched)  
3. Gap row highlight when A/B compare toggles

## shadcn theme
- Radius: `sm` (tight ops feel)  
- Map `--primary` → teal accent; `--destructive` → gap rust; `--background` → paper  
- Prefer: Button, Input, Table, Tabs, Dialog, Badge, Checkbox, Select

## Domain IA
Primary: `/commitments` `/coverage` `/gaps` `/renewals` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map (purpose / CTA / empty)
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Sell outcome | Open commitments | — |
| `/pricing` | Seats + account usage tiers | Start demo | — |
| `/demo` | Guided import→gap→renew | Next step | Step blocked copy |
| `/onboarding` | Checklist + progress | Mark done | Incomplete list |
| `/flows` | ≥5 journey entry points | Start flow | — |
| `/commitments` | Inventory | Add commitment | “Import or add first commit” |
| `/coverage` | Coverage $ / % | Open gaps | “Need usage import” |
| `/gaps` | Findings list | Open renewal | “No gaps in window” |
| `/renewals` | Renewal cases | Export pack | “No renew-by dates” |
| `/imports` | Batches | Upload / paste | Failed batch detail |
| `/compare` | A vs B | Run compare | Need two paths |
| `/scoreboard` | Rollup | Filter account | Empty org |
| `/honesty` | Soft-sim fence | Back to app | — |
| `/settings` | Org / webhook / export | Save | Validation errors |

## Commercial copy hooks
- Pricing: Evaluator seats · Platform seats + connected accounts · Site license  
- Demo: numbered walkthrough of dual claim (commit-matched vs on-demand-blind)  
- Onboarding: connect/import → match → review gaps → draft renewal pack

## Honesty
Method-lab soft-sim. Not your cloud provider’s billing system of record. Not financial advice. Not Idle Seat or True Up.

## Sources
Idea-first FinOps research (`commitment-coverage-studio-ARS-BRIEF.md`); related works JSON - no fake paper brand.
