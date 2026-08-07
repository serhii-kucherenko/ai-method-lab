---
phase: 05-sustain-bar
plan: 01
subsystem: testing
tags: [sustain, features, try-html, app-up, next-build]
requires:
  - phase: 04-renewals-commercial-platform
    provides: Commercial routes, platform APIs, domain IA
provides:
  - "≥29 feature IDs via GET /api/features (locked shipped-surface IDs)"
  - "sustain + app-up smoke (72 tests green)"
  - "try.html offline dual-claim digest with in-app links"
  - "Product README pitch (screenshots deferred to 05-02)"
affects: [05-02, ship]
actuals:
  tokens: 14000
  tasks: 3
  commits: 8
tech-stack:
  added: []
  patterns: [node-test-app-up-spawn, public-try-html-mirror, locked-feature-id-aliases]
key-files:
  created:
    - projects/commitment-coverage-studio/test/sustain.test.ts
    - projects/commitment-coverage-studio/test/app-up.test.ts
    - projects/commitment-coverage-studio/try.html
    - projects/commitment-coverage-studio/public/try.html
  modified:
    - projects/commitment-coverage-studio/src/app/api/features/route.ts
    - projects/commitment-coverage-studio/src/app/honesty/page.tsx
    - projects/commitment-coverage-studio/src/app/demo/page.tsx
    - projects/commitment-coverage-studio/README.md
    - projects/commitment-coverage-studio/package.json
key-decisions:
  - "Expanded features with honest shipped domain/platform IDs only (D-01)"
  - "Domain feature IDs locked to route nouns: commitments, coverage, gaps, renewals, imports, compare, scoreboard"
  - "try.html at root + public/ mirror so Next serves /try.html (D-04)"
  - "App-up builds then starts next on a free localhost port (D-02)"
patterns-established:
  - "Sustain suite asserts feature count + locked aliases + page files without HTTP for SUS-01"
requirements-completed: [SUS-01, SUS-02, SUS-04]
coverage:
  - id: D1
    description: Feature inventory ≥25 and ≥11 pages with locked surface IDs
    requirement: SUS-01
    verification:
      - kind: unit
        ref: test/sustain.test.ts#features inventory lists ≥25
        status: pass
      - kind: unit
        ref: test/sustain.test.ts#locks shipped-surface feature ID strings
        status: pass
    human_judgment: false
  - id: D2
    description: Live next build + app-up GET /
    requirement: SUS-02
    verification:
      - kind: e2e
        ref: test/app-up.test.ts#next build succeeds and next start serves the landing
        status: pass
    human_judgment: false
  - id: D3
    description: Offline try.html dual-claim + in-app guide link
    requirement: SUS-04
    verification:
      - kind: unit
        ref: test/sustain.test.ts#try.html dual-claim
        status: pass
    human_judgment: false
duration: 30min
completed: 2026-08-07
status: complete
---

# Phase 5 Plan 01: Feature bar, try.html, app-up Summary

Feature inventory at 29 locked shipped-surface IDs, offline dual-claim try.html linked from honesty/demo, production build + live GET / smoke green (72 tests).

## Performance

- **Duration:** ~30 min
- **Started:** 2026-08-07T09:45:00Z
- **Completed:** 2026-08-07T09:54:00Z
- **Tasks:** 3/3
- **Files modified:** 10

## Accomplishments

- Expanded `FEATURES` to 29 shipped capabilities with route-aligned IDs (SUS-01)
- Offline `try.html` A vs B digest + `/try.html` served from `public/`
- `npm run build` + app-up smoke assert Commitment Coverage Studio on GET /
- Product README pitch (screenshot embeds deferred to 05-02)

## Task Commits

1. **Task 1 RED** - `260e759d` (test)
2. **Task 1 GREEN** - `14c5c27c` (feat)
3. **Task 2 RED** - `ea060d0d` (test)
4. **Task 2 GREEN** - `f333e3c8` (feat)
5. **Task 3** - `0d536ca3` (feat)
6. **Locked surface IDs RED** - `bc72afb2` (test)
7. **Locked surface IDs GREEN** - `d2d34cc0` (feat)
8. **App-up typecheck cleanup** - `7c4e8e27` (chore)

**Plan metadata:** `779d9aed` (docs) + follow-up SUMMARY refresh

## Files Created/Modified

- `test/sustain.test.ts` - feature/page bar + try.html asserts
- `test/app-up.test.ts` - build + live GET / smoke
- `try.html` / `public/try.html` - offline dual-claim digest
- `src/app/api/features/route.ts` - ≥25 locked feature IDs
- `src/app/honesty/page.tsx`, `src/app/demo/page.tsx` - in-app try.html links
- `README.md` - product pitch (screenshots placeholder for 05-02)
- `package.json` - sustain + app-up in npm test

## Decisions Made

- Honest shipped IDs only; rename domain IDs to match user-visible routes
- Root + public try.html mirror for offline vs served paths
- Free-port next start for app-up (Windows-safe kill tree)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2] Mirror try.html into public/**
- **Found during:** Task 2
- **Issue:** Next.js only serves static `/try.html` from `public/`
- **Fix:** Keep root `try.html` for offline + copy to `public/try.html`
- **Commit:** `f333e3c8`

**2. [Rule 1] app-up claim import extension**
- **Found during:** Task 3 build typecheck
- **Issue:** `../src/lib/claim.ts` failed TS5097 under next build
- **Fix:** Import `../src/lib/claim` without extension
- **Commit:** `7c4e8e27`

**3. [Rule 2] Locked shipped-surface feature aliases**
- **Found during:** Plan tighten mid-execution
- **Issue:** Revised plan required concrete domain/commercial/platform ID strings
- **Fix:** Rename inventory IDs + alias assert in sustain.test
- **Commits:** `bc72afb2`, `d2d34cc0`

## Self-Check: PASSED

- FOUND: try.html, public/try.html, sustain.test.ts, app-up.test.ts, README.md
- FOUND commits: 260e759d, 14c5c27c, ea060d0d, f333e3c8, 0d536ca3, bc72afb2, d2d34cc0, 7c4e8e27
- VERIFIED: `npm test` 72/72 pass; `npm run build` green
