/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Delegation Expiry Studio

## Brand
**Delegation Expiry Studio** — “Grants that end on time.”

Brand is the hero signal on `/`. Headline supports; never replaces the name.

## Landing brief (first viewport)
- Brand: Delegation Expiry Studio  
- Headline: Time-box agent tool grants before blast radius grows  
- Supporting: Issue a delegation, watch the clock, expire it into the ledger - rehearse least privilege without permanent scopes.  
- CTA primary → `/grants` · secondary → `/demo`  
- Atmosphere: full-bleed pale stone field with a single horizontal clock-rule motif - no inset cards, no overlays, no stats in viewport one

Below fold: Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: security ops daylight - stone, forest ink, copper clock - not neon zero-trust poster  
- Tokens:
  - `--color-ink`: forest charcoal  
  - `--color-paper`: warm stone (not cream cliché - cooler stone grey)  
  - `--color-accent`: copper for active grant / countdown  
  - `--color-expired`: muted sage for expired state  
  - `--color-rule`: soft graphite  
- Display: **"Source Serif 4"** · Body: **"DM Sans"** · Mono: **"JetBrains Mono"**  
- Anti-looks: no purple AI glow, no cream+terracotta, no broadsheet, no teal FinOps clone, no amber OT clone, no dark-mode-by-default

## Layout rules
- One composition first viewport; one job per section  
- Cards only for grant create / expire actions  
- Grant tables and countdown rows are the work surface  
- No fake terminal chrome or shield stickers on the hero

## Motion (2–3)
1. Brand fade-in  
2. Countdown tick on active grant rows  
3. Expire flash → ledger append

## shadcn theme
- Radius: `md`  
- `--primary` → copper; `--muted` → expired sage; `--background` → stone  
- Components: Button, Table, Tabs, Dialog, Badge, Input, Select, Switch

## Domain IA
Primary: `/agents` `/grants` `/expiries` `/policies` `/audit` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Sell TTL grants | Open grants | — |
| `/pricing` | Fleet seats + grant events | Start demo | — |
| `/demo` | Grant → expire → audit | Next | Step blocked |
| `/onboarding` | Checklist | Mark done | Incomplete |
| `/flows` | ≥5 journeys | Start | — |
| `/agents` | Registry | Add agent | Empty fleet |
| `/grants` | Active TTL grants | New grant | No grants |
| `/expiries` | Queue / history | Expire now | Empty |
| `/policies` | TTL templates | Save policy | — |
| `/audit` | Grant ledger | Export | Empty ledger |
| `/compare` | A vs B | Run compare | Need both |
| `/scoreboard` | Fleet rollup | Filter | Empty |
| `/honesty` | Soft-sim fence | Back | — |
| `/settings` | Org / webhook | Save | Validation |

## Honesty
Method-lab soft-sim of grant state. Not a live agent kernel. Not Tool Scope, Bypass Audit, or Selective Trust.

## Sources
`delegation-expiry-studio-ARS-BRIEF.md` + RELATED-WORKS JSON.
