---
phase: 04-renewals-commercial-platform
plan: 02
subsystem: commercial
tags: [pricing, demo, onboarding, flows, soft-sim, smoke-mkt]

requires:
  - phase: 04-renewals-commercial-platform
    provides: RenewalCase packs on /renewals (04-01)
  - phase: 03-studio-ui
    provides: Live domain routes for demo/onboarding/flows CTAs
provides:
  - /pricing seats + connected-account tiers with no live checkout
  - Guided /demo Import → Match → Gap → Renew including A vs B
  - /onboarding checklist with localStorage progress
  - /flows ≥5 named journeys with Start CTAs
affects:
  - 04-03 platform settings (commercial chrome separate)
  - Phase 5 README screenshots of commercial routes

actuals:
  tokens: 12000
  tasks: 3
  commits: 7

tech-stack:
  added: []
  patterns:
    - Commercial pages use brand chrome without StudioShell primary domain nav
    - Data-driven step/journey lists with soft-sim honesty copy
    - Onboarding progress via localStorage (client-only)

key-files:
  created:
    - projects/commitment-coverage-studio/src/app/pricing/page.tsx
    - projects/commitment-coverage-studio/src/app/onboarding/page.tsx
    - projects/commitment-coverage-studio/src/app/flows/page.tsx
  modified:
    - projects/commitment-coverage-studio/src/app/demo/page.tsx
    - projects/commitment-coverage-studio/test/smoke-mkt.test.ts

key-decisions:
  - "D-03: Soft-sim seat + connected-account tiers; explicit no live card checkout"
  - "D-04: Numbered guided demo linking live /imports /commitments|/coverage /gaps /compare /renewals"
  - "D-05: Onboarding checklist progress in localStorage (not org API)"
  - "D-06: Five FEATURES F1–F5 journeys on /flows with Start CTAs"
  - "D-12: Commercial sources omit desk shells /jobs /lifecycle /scenario /batch"
  - "D-13: No new npm packages"

patterns-established:
  - "Commercial smoke helpers accept data-driven href: \"/path\" CTAs"
  - "Daylight ledger tokens on commercial surfaces (ink/paper/accent)"

requirements-completed: [COM-01, COM-02, COM-03, COM-04]

coverage:
  - id: D1
    description: "/pricing shows seat + connected-account tiers with no live checkout"
    requirement: COM-01
    verification:
      - kind: unit
        ref: "test/smoke-mkt.test.ts#/pricing shows seat + connected-account tiers and no live checkout (COM-01, D-03)"
        status: pass
    human_judgment: false
  - id: D2
    description: "/demo guides Import → Match → Gap → Renew with A vs B and live CTAs"
    requirement: COM-02
    verification:
      - kind: unit
        ref: "test/smoke-mkt.test.ts#/demo guides Import → Match → Gap → Renew with A vs B (COM-02, D-04)"
        status: pass
    human_judgment: false
  - id: D3
    description: "/onboarding checklist with localStorage progress"
    requirement: COM-03
    verification:
      - kind: unit
        ref: "test/smoke-mkt.test.ts#/onboarding checklist shows progress (COM-03, D-05)"
        status: pass
    human_judgment: false
  - id: D4
    description: "/flows lists ≥5 named journeys with CTAs including /renewals"
    requirement: COM-04
    verification:
      - kind: unit
        ref: "test/smoke-mkt.test.ts#/flows lists ≥5 named journeys with CTAs (COM-04, D-06)"
        status: pass
    human_judgment: false

duration: 13min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 02: Commercial Surfaces Summary

**Soft-sim commercial set: pricing tiers, guided Import→Match→Gap→Renew demo with A vs B, onboarding checklist progress, and five named flows — no live checkout.**

## Performance

- **Duration:** 13 min
- **Tasks:** 3/3
- **Commits:** 7 (incl. parallel twin commits for pricing/onboarding)

## Accomplishments

- `/pricing` — Evaluator / Platform+connected-account / Site license soft-sim tiers; Start demo CTA; honesty that there is no live card checkout
- `/demo` — Numbered walkthrough Import → Match → Gap → A vs B compare → Renew with CTAs into live domain routes
- `/onboarding` — Five-item checklist with percent progress persisted in `localStorage`
- `/flows` — Import & match, Multi-cloud rollup, Renewal pack, Dual compare, Export & review with Start CTAs
- `smoke-mkt` covers COM-01..04 + D-12 anti-desk on commercial sources

## Task Commits

| Task | Commit | Notes |
|------|--------|-------|
| 1 RED | `91448ca0` | Failing smoke for pricing + demo |
| 1 GREEN | `eaba148a` / `049f6bf2` | Pricing + guided demo (twin landings) |
| 2 RED | `d974b93c` | Failing smoke for onboarding |
| 2 GREEN | `5d8c6469` / `2ae40df8` | Onboarding page + smoke CTA hardening |
| 3 GREEN | `e566ed8c` | Flows index ≥5 journeys |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Smoke expected literal `href="/path"` but pages use data-driven `href: "/path"`**
- **Found during:** Task 1–3 verify
- **Issue:** CTA assertions failed despite routes present in step/journey arrays
- **Fix:** `hasRoute()` helper accepts both `href="..."` and quoted path strings
- **Files modified:** `test/smoke-mkt.test.ts`
- **Commit:** `2ae40df8`

**2. [Rule 3 - Blocking] Parallel executor twin commits on same plan**
- **Found during:** Task 1–3
- **Issue:** Concurrent agent also shipped pricing/demo/onboarding/flows
- **Fix:** Kept both valid surfaces; avoided redoing 04-01; committed only remaining smoke/docs
- **Files modified:** n/a (coordination)

## Auth Gates

None.

## Known Stubs

None — commercial pages are real soft-sim surfaces (no payment forms by design).

## Verification

- `npx tsx --test test/smoke-mkt.test.ts` — 13 pass
- `npm test` — 57 pass
- `npm run build` — green; routes include `/pricing` `/demo` `/onboarding` `/flows`

## Self-Check: PASSED

- FOUND: `projects/commitment-coverage-studio/src/app/pricing/page.tsx`
- FOUND: `projects/commitment-coverage-studio/src/app/demo/page.tsx`
- FOUND: `projects/commitment-coverage-studio/src/app/onboarding/page.tsx`
- FOUND: `projects/commitment-coverage-studio/src/app/flows/page.tsx`
- FOUND: commits `91448ca0`, `eaba148a`, `5d8c6469`, `e566ed8c`
