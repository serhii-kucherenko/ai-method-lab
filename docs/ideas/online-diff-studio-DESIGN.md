/* Hallmark · pre-emit critique: P4 H4 E4 S4 R4 V4 */
# DESIGN — Online Diff Studio

## Brand
**Online Diff Studio** — “Prove what is running.”

Brand dominates `/`. Headline supports; never replaces the name.

## Landing brief (first viewport)
- Brand: Online Diff Studio  
- Headline: Attach online vs approved program evidence to MOC  
- Supporting: Import the last approved offline copy and the online snapshot - walk into the window with a diff pack, not a guess.  
- CTA primary → `/programs` · secondary → `/demo`  
- Atmosphere: full-bleed plant-floor schematic wash (cool steel + signal amber), edge-to-edge - no inset media card, no overlays, no stats in viewport one

Below fold: Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA. No invented metrics.

## Visual direction
- Mood: OT control room daylight - steel, concrete, amber signal - not cyber-green terminal cosplay  
- Tokens:
  - `--color-ink`: charcoal steel  
  - `--color-paper`: pale concrete grey  
  - `--color-accent`: signal amber (approved / pack ready)  
  - `--color-drift`: electric blue for changed hunks (sparingly)  
  - `--color-rule`: industrial rule lines for diff panes  
- Display: **"Libre Baskerville"** · Body: **"IBM Plex Sans"** · Mono: **"IBM Plex Mono"**  
- Anti-looks: no purple AI, no cream+terracotta, no broadsheet, no teal-ledger clone of Commitment Coverage, no dark-mode-by-default

## Layout rules
- One composition first viewport; one job per section  
- Cards only for interactive MOC pack / import actions  
- Diff panes are the work surface on `/diffs` - not decorative cards  
- No hero stickers or fake PLC chrome

## Motion (2–3)
1. Brand fade-in  
2. Diff hunk slide-in when a run completes  
3. MOC pack seal pulse on export

## shadcn theme
- Radius: `sm`  
- `--primary` → amber; `--secondary` → drift blue; `--background` → concrete paper  
- Components: Button, Table, Tabs, Dialog, Badge, Textarea, Select

## Domain IA
Primary: `/programs` `/online` `/diffs` `/moc-packs` `/imports` `/compare` `/scoreboard`  
Commercial: `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`

## Page map
| Route | Purpose | Primary CTA | Empty / error |
|-------|---------|-------------|----------------|
| `/` | Sell MOC evidence | Open programs | — |
| `/pricing` | Plant seats + diff usage | Start demo | — |
| `/demo` | Guided import→diff→pack | Next | Step blocked |
| `/onboarding` | Checklist | Mark done | Incomplete |
| `/flows` | ≥5 journeys | Start flow | — |
| `/programs` | Approved offline revisions | Add revision | Import first |
| `/online` | Online snapshots | Capture/import | Need artifact |
| `/diffs` | Runs + hunks | Open MOC pack | No pair selected |
| `/moc-packs` | Evidence packs | Export | Empty packs |
| `/imports` | Batches | Upload | Failed batch |
| `/compare` | A vs B | Run compare | Need both paths |
| `/scoreboard` | Drift rollup | Filter area | Empty plant |
| `/honesty` | Soft-sim fence | Back | — |
| `/settings` | Org / webhook | Save | Validation |

## Honesty
Method-lab soft-sim. Not a live PLC programmer. Not Ladder Bomb, Change Freeze, or Download Gate.

## Sources
Idea-first OT research (`online-diff-studio-ARS-BRIEF.md`). Related-works thin - do not fake citations.
