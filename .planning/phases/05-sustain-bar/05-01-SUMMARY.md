---
phase: 05-sustain-bar
plan: 01
subsystem: testing
tags: [sustain, features, try-html, app-up, next-build]
requires:
  - phase: 04-renewals-commercial-platform
    provides: Commercial routes, platform APIs, domain IA
provides:
  - "≥29 feature IDs via GET /api/features"
  - "sustain + app-up smoke (71 tests green)"
  - "try.html offline dual-claim digest with in-app links"
  - "Product README pitch (screenshots deferred to 05-02)"
affects: [05-02, ship]
actuals:
  tokens: 12000
  tasks: 3
  commits: 5
tech-stack:
  added: []
  patterns: [node-test-app-up-spawn, public-try-html-mirror]
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
  - "try.html at root + public/ mirror so Next serves /try.html (D-04)"
  - "App-up uses node:test spawn of next start on port 43167 (D-02)"
patterns-established:
  - "Sustain suite asserts feature count + page files without HTTP for SUS-01"
requirements-completed: [SUS-01, SUS-02, SUS-04]
coverage:
  - id: D1
    description: Feature inventory ≥25 and ≥11 pages
    requirement: SUS-01
    verification:
      - kind: unit
        ref: test/sustain.test.ts#features inventory lists ≥25
        status: pass
    human_judgment: false
  - id: D2
    description: Live next build + app-up GET /
    requirement: SUS-02
    verification:
      - kind: e2e
        ref: test/app-up.test.ts#serves the landing page
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
duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 5 Plan 01: Feature bar, try.html, app-up Summary

Feature inventory at 29 IDs, offline dual-claim try.html linked from honesty/demo, production build + live GET / smoke green (71 tests).

## Performance

- **Duration:** ~25 min
- **Tasks:** 3/3
- **Files modified:** 9

## Accomplishments

- Expanded `FEATURES` to 29 shipped capabilities (SUS-01)
- Offline `try.html` A vs B digest + `/try.html` served from `public/`
- `npm run build` + app-up smoke assert Commitment Coverage Studio on GET /

## Task Commits

1. **Task 1 RED** - `260e759d` (test)
2. **Task 1 GREEN** - `14c5c27c` (feat)
3. **Task 2 RED** - `ea060d0d` (test)
4. **Task 2 GREEN** - `f333e3c8` (feat)
5. **Task 3** - `0d536ca3` (feat)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2] Mirror try.html into public/**
- **Found during:** Task 2
- **Issue:** Next.js only serves static `/try.html` from `public/`
- **Fix:** Keep root `try.html` for offline + copy to `public/try.html`
- **Commit:** `f333e3c8`

**2. [Rule 1] app-up timeout API**
- **Found during:** Task 3 build typecheck
- **Issue:** Third-arg timeout rejected by @types/node TestOptions
- **Fix:** Use `{ timeout: 25000 }` options form
- **Commit:** `0d536ca3`

## Self-Check: PASSED

- FOUND: try.html, public/try.html, sustain.test.ts, app-up.test.ts
- FOUND commits: 260e759d, 14c5c27c, ea060d0d, f333e3c8, 0d536ca3
