---
phase: 01-smoke-trust
plan: 02
subsystem: ui
tags: [nextjs, marketing, honesty, soft-sim, smoke-mkt, tdd]

requires:
  - phase: 01-smoke-trust
    provides: Brand-first / scaffold, DESIGN tokens, smoke-mkt baseline
provides:
  - "Full landing below-fold story with honesty link and Sources"
  - "/honesty soft-sim fence with Idle Seat / True Up disambiguation"
  - "Minimal /commitments and /demo CTA placeholders"
  - "Extended smoke-mkt for honesty + anti-desk IA"
affects: [01-smoke-trust, claim-engine, commercial-pages]

actuals:
  tokens: 4863
  tasks: 3
  commits: 5

tech-stack:
  added: []
  patterns: [claim.ts shared honesty copy, below-fold section variety, placeholder CTA routes]

key-files:
  created:
    - projects/commitment-coverage-studio/src/components/landing/below-fold.tsx
    - projects/commitment-coverage-studio/src/components/landing/section-heading.tsx
    - projects/commitment-coverage-studio/src/app/honesty/page.tsx
    - projects/commitment-coverage-studio/src/app/commitments/page.tsx
    - projects/commitment-coverage-studio/src/app/demo/page.tsx
  modified:
    - projects/commitment-coverage-studio/src/app/page.tsx
    - projects/commitment-coverage-studio/src/lib/claim.ts
    - projects/commitment-coverage-studio/test/smoke-mkt.test.ts

key-decisions:
  - "Below-fold lives in landing/BelowFold so hero page.tsx stays first-viewport-only"
  - "Honesty and Sources copy centralized in claim.ts for landing + /honesty"
  - "CTA placeholders are single-purpose stubs with home link only - no desk chrome"

patterns-established:
  - "smoke-mkt scans page + claim + landing components for marketing contracts"
  - "Anti-desk negative check forbids /jobs /lifecycle /scenario /batch hrefs in marketing routes"

requirements-completed: [MKT-01, MKT-02, MKT-03]

coverage:
  - id: D1
    description: Full landing below-fold story with Problem, Product, Honesty tease and /honesty link
    requirement: MKT-01
    verification:
      - kind: unit
        ref: test/smoke-mkt.test.ts#landing below-fold includes Problem, Product, Honesty tease and links to /honesty
        status: pass
      - kind: unit
        ref: test/smoke-mkt.test.ts#first viewport has no invented numeric KPI strip
        status: pass
    human_judgment: false
  - id: D2
    description: /honesty soft-sim fence with Idle Seat / True Up disambiguation and Sources
    requirement: MKT-02
    verification:
      - kind: unit
        ref: test/smoke-mkt.test.ts#honesty page states soft-sim fence, not Idle Seat or True Up, with Sources
        status: pass
    human_judgment: false
  - id: D3
    description: CTA placeholders resolve without isomorphic desk primary IA
    requirement: MKT-03
    verification:
      - kind: unit
        ref: test/smoke-mkt.test.ts#CTA placeholders exist for /commitments and /demo
        status: pass
      - kind: unit
        ref: test/smoke-mkt.test.ts#primary marketing routes avoid isomorphic desk IA links
        status: pass
      - kind: other
        ref: npm run build
        status: pass
    human_judgment: false

duration: 18min
completed: 2026-08-07
status: complete
---

# Phase 01 Plan 02: Marketing trust surface Summary

**Full landing story, live `/honesty` soft-sim fence with Sources, and CTA placeholders that resolve without desk-clone IA.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-08-07T07:37:29Z
- **Completed:** 2026-08-07T07:55:00Z
- **Tasks:** 3/3
- **Files modified:** 8

## Accomplishments

- Expanded `/` below the fold (Problem → Product → Selling points → Features → How it works → Pricing tease → Honesty → Sources → Footer CTA)
- Shipped `/honesty` with soft-sim fence, Idle Seat / True Up disambiguation, and Sources
- Added minimal `/commitments` and `/demo` placeholders; anti-desk smoke + `npm run build` green

## Task Commits

1. **Task 1 RED: Below-fold smoke** - `7bd13dfa` (test)
2. **Task 1 GREEN: Landing expansion** - `4f625c38` (feat)
3. **Task 2 RED: Honesty smoke** - `d683e2e8` (test)
4. **Task 2 GREEN: Honesty page** - `417b21d5` (feat)
5. **Task 3: Placeholders + anti-desk + build** - `4045376c` (feat)

## Files Created/Modified

- `src/components/landing/below-fold.tsx` - Below-fold marketing sections
- `src/components/landing/section-heading.tsx` - Shared section title
- `src/app/page.tsx` - Composes hero + BelowFold
- `src/lib/claim.ts` - Shared landing and honesty copy
- `src/app/honesty/page.tsx` - Soft-sim fence + Sources
- `src/app/commitments/page.tsx` - CTA placeholder
- `src/app/demo/page.tsx` - CTA placeholder
- `test/smoke-mkt.test.ts` - Honesty, below-fold, anti-desk assertions

## Decisions Made

- Kept first viewport composition unchanged; all story sections live in `BelowFold`
- Centralized honesty/Sources strings in `claim.ts` so landing tease and `/honesty` stay aligned
- Placeholders state later-phase scope explicitly - no inventory CRUD or guided demo body

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Smoke scanned landing components for /honesty link**
- **Found during:** Task 1 (GREEN)
- **Issue:** Honesty `href` lives in `below-fold.tsx`, not `page.tsx`; page-only assertion would stay red after correct implementation
- **Fix:** Smoke blob includes `below-fold.tsx` alongside page and claim
- **Files modified:** `test/smoke-mkt.test.ts`
- **Verification:** `npx tsx --test test/smoke-mkt.test.ts` pass
- **Committed in:** `4f625c38`

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Correctness for component-split landing; no scope creep

## Issues Encountered

- Pre-existing dirty tree (`.planning/config.json`, paper-picks shortlist) blocked `git pull --rebase` - left untouched

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 marketing trust surface complete (MKT-01/02/03 observable)
- Domain claim engine, imports, and commercial page bodies remain later phases

## Self-Check: PASSED

- FOUND: below-fold.tsx, honesty/page.tsx, commitments/page.tsx, demo/page.tsx, claim.ts, smoke-mkt.test.ts
- FOUND commits: 7bd13dfa, 4f625c38, d683e2e8, 417b21d5, 4045376c

---
*Phase: 01-smoke-trust*
*Completed: 2026-08-07*
