---
phase: 05-sustain-bar
plan: 02
subsystem: docs
tags: [screenshots, readme, sustain, playwright]
requires:
  - phase: 05-sustain-bar
    provides: Build + app-up + try.html from 05-01
provides:
  - "5 live PNG screenshots under screenshots/"
  - "README Screenshots section with relative embeds"
  - "Windows-safe capture script (product playwright + /commitments)"
affects: [ship, garbage-collector]
actuals:
  tokens: 8000
  tasks: 2
  commits: 2
tech-stack:
  added: [playwright@1.55.0]
  patterns: [lab-capture-script-product-local-pw]
key-files:
  created:
    - projects/commitment-coverage-studio/screenshots/01-landing.png
    - projects/commitment-coverage-studio/screenshots/02-commitments.png
    - projects/commitment-coverage-studio/screenshots/03-pricing.png
    - projects/commitment-coverage-studio/screenshots/04-demo.png
    - projects/commitment-coverage-studio/screenshots/05-onboarding.png
  modified:
    - projects/commitment-coverage-studio/README.md
    - projects/commitment-coverage-studio/package.json
    - scripts/capture-product-screenshots.mjs
key-decisions:
  - "Primary workspace path /commitments for capture (D-03)"
  - "Playwright as product devDependency for Windows capture (Rule 3)"
patterns-established:
  - "Capture script resolves playwright from product node_modules when repo has no package.json"
requirements-completed: [SUS-03]
coverage:
  - id: D1
    description: Five live screenshots embedded in README
    requirement: SUS-03
    verification:
      - kind: automated_ui
        ref: scripts/capture-product-screenshots.mjs --paths /,/commitments,/pricing,/demo,/onboarding
        status: pass
    human_judgment: false
duration: 20min
completed: 2026-08-07
status: complete
---

# Phase 5 Plan 02: Live screenshots Summary

README embeds five live soft-sim captures (landing, commitments, pricing, demo, onboarding) from next start.

## Performance

- **Duration:** ~20 min
- **Tasks:** 2/2
- **Files modified:** 8

## Accomplishments

- Captured live UI PNGs via lab capture script
- Screenshots section near top of product README
- Hardened capture for Windows (product-local Playwright, commitments workspace candidate)

## Task Commits

1. **Task 1: capture** - `a72128cc` (feat)
2. **Task 2: embed + capture script** - `a2c39443` (feat)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3] Capture spawn EINVAL on Windows**
- **Found during:** Task 1
- **Issue:** `npm.cmd` spawn without shell failed; repo root has no package.json (npm prefix C:\)
- **Fix:** Install playwright in product; teach capture script to require product node_modules + shell on win32; prefer bundled Chromium over channel chrome
- **Files:** `scripts/capture-product-screenshots.mjs`, `package.json`

## Self-Check: PASSED

- FOUND: screenshots/01-landing.png … 05-onboarding.png (incl. 02-commitments.png)
- FOUND: README ## Screenshots embeds all five relative paths including commitments
- FOUND commits: a72128cc, a2c39443, 154d67a5
- RE-VERIFIED: `node scripts/capture-product-screenshots.mjs … --paths /,/commitments,/pricing,/demo,/onboarding` wrote 5 live PNGs; `npm test` 72/72; `npm run build` green
