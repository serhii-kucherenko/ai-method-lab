# Phase 1 UI-SPEC: Smoke & trust

**Phase:** 01-smoke-trust  
**Source:** `docs/ideas/commitment-coverage-studio-DESIGN.md` + CONTEXT D-02–D-07  
**Scope:** `/` and `/honesty` only

## Visual tokens

| Token | Role | Value guidance |
|-------|------|----------------|
| `--color-ink` | Text | Deep slate ink |
| `--color-paper` | Background | Cool off-white with faint ledger grain |
| `--color-accent` | Covered / primary | Sharp teal |
| `--color-gap` | Under-cover / spill | Restrained rust (sparse) |
| `--color-rule` | Table rules later | Hairline graphite |
| Display font | Brand / section titles | Fraunces |
| Body font | Prose | Source Sans 3 |
| Mono font | Figures (later) | IBM Plex Mono |
| Radius | shadcn | `sm` |

Anti-looks: no purple AI glow, cream+terracotta, broadsheet newspaper, dark-mode-by-default.

## Landing `/` — first viewport

- Brand as hero-level signal: **Commitment Coverage Studio**
- Headline: See commitment waste in dollars before renewal
- Supporting: Match Savings Plans, RIs, and CUDs to real usage - then walk into renewals with a gap pack, not a chart dump.
- CTA primary → `/commitments` · secondary → `/demo`
- Atmosphere: full-bleed cool ledger field (edge-to-edge); no inset hero card; no overlays; no stats in viewport one
- Motion: brand fade-in (DESIGN motion #1)

## Landing — below fold (same page)

One job per section: Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty tease → Sources → Footer CTA. No invented metrics.

## `/honesty`

- Soft-sim fence: not cloud billing system of record; not financial advice
- Explicit: not Idle Seat; not True Up
- Sources footer (idea-first FinOps / ARS brief; no fake paper brand)
- CTA back to app (`/` or `/commitments`)

## Components

- Prefer shadcn `Button` for CTAs; cards only if wrapping an interaction (none required on honesty)
- Sparse icons; no pill clusters

## UI Considerations

| ID | Consideration | Disposition |
|----|---------------|-------------|
| U-01 | Brand readable as hero without nav | covered — first viewport brand treatment |
| U-02 | Daylight ledger (not dark cyber FinOps) | covered — paper/ink tokens |
| U-03 | Honesty fence + Sources reachable | covered — `/honesty` + landing link |
| U-04 | No isomorphic desk chrome in phase-1 nav | covered — no `/jobs` `/lifecycle` `/scenario` `/batch` primary links |
| U-05 | Placeholder `/commitments` `/demo` must not fake desk shells | backstop — minimal placeholder or 404-safe Link targets without desk IA |

---
*UI contract for Phase 1 planning*
