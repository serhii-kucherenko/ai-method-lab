# Phase 1 Context: Smoke & trust

**Mode:** Auto-generated (discuss skipped via workflow.skip_discuss)  
**Phase:** 1 — Smoke & trust  
**Requirements:** MKT-01, MKT-02, MKT-03

## Goal

Strangers see a brand-first soft-sim that sells dollar coverage gap before renewal, with an explicit honesty fence.

## Locked decisions

| Decision | Choice | Source |
|----------|--------|--------|
| Product location | `projects/commitment-coverage-studio/` | Lab convention |
| Brand | Commitment Coverage Studio — “See the gap before you renew.” | DESIGN.md |
| Landing hero | Brand + headline “See commitment waste in dollars before renewal” + one supporting sentence + CTAs to `/commitments` and `/demo`; full-bleed cool ledger atmosphere; no stats/overlays/cards in viewport one | DESIGN.md |
| Honesty | `/honesty` soft-sim fence: not billing SOR; not Idle Seat / True Up; Sources footer | DESIGN + PRD |
| Tokens | ink/paper/teal covered/rust gap; Fraunces / Source Sans 3 / IBM Plex Mono; radius sm | DESIGN.md |
| Stack | Next.js App Router + Tailwind + shadcn + TS + SQLite; no Python | research/STACK.md |
| Anti-looks | No purple AI glow, cream+terracotta, broadsheet, dark-mode-by-default | DESIGN.md |

## Discretion

All remaining implementation choices are at the implementer’s discretion. Use ROADMAP success criteria, DESIGN.md, and sibling studio patterns under `projects/` without isomorphic desk clones.

## Codebase notes

Greenfield product folder — create Next app scaffold in this phase enough for `/` and `/honesty` with DESIGN tokens. Deeper domain routes come in later phases (stubs OK only if they do not fake a desk shell).

## Out of scope this phase

- Dual scorers, imports, commitments CRUD
- Commercial `/pricing` `/demo` `/onboarding` `/flows` (Phase 4)
- Sustain screenshots (Phase 5)

---
*Generated 2026-08-07 for gsd-autonomous / skip_discuss*
