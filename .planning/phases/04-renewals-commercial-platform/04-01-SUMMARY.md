---
phase: 04-renewals-commercial-platform
plan: 01
subsystem: renewals
tags: [renewals, sqlite, soft-sim, audit, buy-reduce-hold]

requires:
  - phase: 03-studio-ui
    provides: Seven domain routes, thin GET /api/renewals, gaps + coverage APIs
provides:
  - RenewalCase packs with buy/reduce/hold from gaps + lock_end
  - POST pack-build and GET cases on /api/renewals
  - PATCH act/dismiss with audit_entries
  - /renewals UI Build pack, Export, Act, Dismiss
affects:
  - 04-02 commercial surfaces
  - 04-03 platform org/export/webhooks (audit reuse)
  - UI-01 verification

actuals:
  tokens: 8569
  tasks: 3
  commits: 5

tech-stack:
  added: []
  patterns:
    - RenewalPacker spill→buy / unused→reduce / near-zero|balanced→hold
    - Soft-sim audit append via audit_entries (no primary nav)
    - Client-side JSON export for tracer (full /api/export in later plan)

key-files:
  created:
    - projects/commitment-coverage-studio/src/services/renewals.ts
    - projects/commitment-coverage-studio/src/services/audit.ts
    - projects/commitment-coverage-studio/src/app/api/renewals/[id]/route.ts
  modified:
    - projects/commitment-coverage-studio/src/lib/db.ts
    - projects/commitment-coverage-studio/src/app/api/renewals/route.ts
    - projects/commitment-coverage-studio/src/app/renewals/page.tsx
    - projects/commitment-coverage-studio/src/app/api/features/route.ts
    - projects/commitment-coverage-studio/test/domain-api.test.ts
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "D-01: Pack recommendations from gap dominance (spill buy, unused reduce, hold otherwise)"
  - "D-02: Persist renewal_cases; GET/POST/PATCH softSim Bearer APIs"
  - "D-10 partial: Audit on act/dismiss only; no primary StudioShell audit nav"
  - "D-13: No new npm packages; extend better-sqlite3 migrate SCHEMA"
  - "Tracer export downloads client-side JSON until PLT-03 /api/export"

patterns-established:
  - "Packer rebuilds open cases; acted/dismissed retained across re-pack"
  - "Audit actor labeled soft-sim:{bearer-token}"

requirements-completed: [UI-01]

coverage:
  - id: D1
    description: "/renewals shows buy/reduce/hold RenewalCase packs tied to gap $"
    requirement: UI-01
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#POST pack returns cases with recommendedAction buy|reduce|hold tied to gap $"
        status: pass
      - kind: unit
        ref: "test/smoke-ui.test.ts#renewals page uses StudioShell, pack recommendations, and /api/renewals"
        status: pass
    human_judgment: false
  - id: D2
    description: "POST pack-build and PATCH act/dismiss with audit_entries"
    requirement: UI-01
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#PATCH act/dismiss updates status and writes audit entry"
        status: pass
    human_judgment: false
  - id: D3
    description: "Features inventory lists renewal-cases and renewal-recommendations; build green"
    verification:
      - kind: unit
        ref: "npm test && npm run build"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 01: RenewalCase packs Summary

**Renewal packs end-to-end: buy/reduce/hold from gaps + lock_end, Act/Dismiss with audit, soft-sim APIs and /renewals UI.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-08-07T09:05:00Z
- **Completed:** 2026-08-07T09:20:00Z
- **Tasks:** 3
- **Files modified:** 9

## Accomplishments

- RenewalPacker persists `renewal_cases` with recommendedAction buy|reduce|hold tied to gap $
- Bearer GET/POST `/api/renewals` and PATCH `/api/renewals/:id` with softSim + audit on act/dismiss
- `/renewals` Build pack / Export / Act / Dismiss; features + smoke + full test/build green

## Task Commits

1. **Task 1: Tracer — pack path (RED)** - `69be8982` (test)
2. **Task 1: Tracer — pack path (GREEN)** - `de4648bf` (feat)
3. **Task 2: PATCH act/dismiss (RED)** - `c8fa1caf` (test)
4. **Task 2: PATCH act/dismiss (GREEN)** - `34eb7814` (feat)
5. **Task 3: Features + smoke** - `b6f67ce9` (feat)

**Plan metadata:** `65bdb49c` (docs: complete plan)

## Files Created/Modified

- `src/services/renewals.ts` - RenewalPacker + list/update case helpers
- `src/services/audit.ts` - appendAudit / listAudit
- `src/lib/db.ts` - renewal_cases + audit_entries tables
- `src/app/api/renewals/route.ts` - GET cases + POST pack
- `src/app/api/renewals/[id]/route.ts` - PATCH acted|dismissed + audit
- `src/app/renewals/page.tsx` - pack UI with recommendations and actions
- `src/app/api/features/route.ts` - renewal-cases, renewal-recommendations
- `test/domain-api.test.ts` - pack + PATCH audit coverage
- `test/smoke-ui.test.ts` - renewals pack assertions

## Decisions Made

Honored locked D-01, D-02, D-10 (partial), D-13, D-14. Client-side JSON export for tracer until export API in a later plan.

## Deviations from Plan

None - plan executed as written (TDD RED/GREEN per task).

## Issues Encountered

None blocking. Parallel wave agents coordinated on the same plan commits without conflict after reconcile.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

UI-01 wave-1 renewals path ready. Next: 04-02 commercial surfaces (pricing/demo/onboarding/flows) without changing dual scorers.

## Verification Results

- `npx tsx --test test/domain-api.test.ts` — 18/18 pass
- `npm test` — 45/45 pass
- `npm run build` — success (includes `/api/renewals` and `/api/renewals/[id]`)

## Self-Check: PASSED

- FOUND: `src/services/renewals.ts`, `src/services/audit.ts`, `src/app/api/renewals/[id]/route.ts`, `04-01-SUMMARY.md`
- FOUND commits: `69be8982`, `de4648bf`, `c8fa1caf`, `34eb7814`, `b6f67ce9`
