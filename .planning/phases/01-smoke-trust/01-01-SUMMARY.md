---
phase: 01-smoke-trust
plan: 01
subsystem: ui
tags: [nextjs, tailwind, shadcn, design-tokens, marketing, tdd]

requires: []
provides:
  - "Runnable Next.js 16 app under projects/commitment-coverage-studio/"
  - "DESIGN.md product token source of truth (Fraunces / ink-paper-teal-gap)"
  - "Brand-first / landing with locked headline and CTAs"
  - "smoke-mkt automated assertions for tokens and fonts"
affects: [01-smoke-trust, honesty-surface, commercial-pages]

actuals:
  tokens: 115822
  tasks: 3
  commits: 3

tech-stack:
  added: [next@16.3.0, react@19.2.8, tailwindcss@4, shadcn@4.16.2, radix-ui, tsx]
  patterns: [claim constants, DESIGN CSS tokens, shadcn theme map, tsx --test smoke]

key-files:
  created:
    - projects/commitment-coverage-studio/DESIGN.md
    - projects/commitment-coverage-studio/src/lib/claim.ts
    - projects/commitment-coverage-studio/src/app/page.tsx
    - projects/commitment-coverage-studio/src/app/globals.css
    - projects/commitment-coverage-studio/src/components/ui/button.tsx
    - projects/commitment-coverage-studio/test/smoke-mkt.test.ts
  modified:
    - projects/commitment-coverage-studio/src/app/layout.tsx
    - projects/commitment-coverage-studio/package.json

key-decisions:
  - "Kept create-next-app scaffold then layered DESIGN tokens (no parallel button system)"
  - "Mapped shadcn --primary/--destructive/--background/--radius to teal/gap/paper/sm"
  - "Restored Source_Sans_3 after shadcn init injected Geist (D-05)"

patterns-established:
  - "smoke-mkt.ts reads source files for token/copy/font contracts"
  - "Landing first viewport: brand hero + one headline + support + two Button CTAs only"

requirements-completed: [MKT-01, MKT-03]

coverage:
  - id: D1
    description: Brand-first / with Commitment Coverage Studio and locked headline
    requirement: MKT-01
    verification:
      - kind: unit
        ref: test/smoke-mkt.test.ts#landing copy includes display name and locked headline
        status: pass
    human_judgment: false
  - id: D2
    description: DESIGN tokens ink/paper/accent/gap and Fraunces/Source Sans 3/IBM Plex Mono
    requirement: MKT-03
    verification:
      - kind: unit
        ref: test/smoke-mkt.test.ts#DESIGN.md and globals.css expose ink/paper/accent/gap tokens
        status: pass
      - kind: unit
        ref: test/smoke-mkt.test.ts#layout loads Fraunces, Source Sans 3, and IBM Plex Mono via next/font/google
        status: pass
    human_judgment: false
  - id: D3
    description: Production next build succeeds for tokenized landing scaffold
    requirement: MKT-01
    verification:
      - kind: other
        ref: npm run build
        status: pass
    human_judgment: false

duration: 13min
completed: 2026-08-07
status: complete
---

# Phase 01 Plan 01: Brand scaffold & DESIGN tokens Summary

**Greenfield Commitment Coverage Studio app with cool ledger `/` hero, DESIGN tokens, shadcn Button CTAs, and passing smoke-mkt.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-08-07T07:22:47Z
- **Completed:** 2026-08-07T07:35:00Z
- **Tasks:** 3/3
- **Files modified:** 25 (product tree)

## Accomplishments

- Scaffolded Next.js 16 App Router product at `projects/commitment-coverage-studio/`
- Locked Fraunces / Source Sans 3 / IBM Plex Mono and ink/paper/teal/gap tokens in DESIGN + globals
- Brand-first landing CTAs via shadcn Button; `npm run build` and smoke-mkt green

## Task Commits

1. **Task 1 RED: Tracer smoke-mkt** - `7cc58782` (test)
2. **Task 1 GREEN: Brand landing + tokens** - `e7dd43cd` (feat)
3. **Task 2: shadcn Button + theme map** - `da5b6fda` (feat)
4. **Task 3: Production build** - verify-only (no code changes; `npm run build` exit 0)

## Files Created/Modified

- `projects/commitment-coverage-studio/DESIGN.md` - Product token SoT
- `projects/commitment-coverage-studio/src/lib/claim.ts` - DISPLAY_NAME / headline / tagline
- `projects/commitment-coverage-studio/src/app/layout.tsx` - Fonts + metadata
- `projects/commitment-coverage-studio/src/app/globals.css` - Ledger tokens + shadcn theme map
- `projects/commitment-coverage-studio/src/app/page.tsx` - Brand-first first viewport
- `projects/commitment-coverage-studio/src/components/ui/button.tsx` - shadcn Button
- `projects/commitment-coverage-studio/test/smoke-mkt.test.ts` - Marketing smoke

## Decisions Made

- Followed plan stack pins (Next 16.3 / Tailwind 4 / shadcn radix)
- Daylight paper ledger atmosphere; no dark-default class on html
- Landing links to `/commitments` and `/demo` without building desk shells

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Restored Source_Sans_3 after shadcn init replaced it with Geist**
- **Found during:** Task 2
- **Issue:** `npx shadcn@latest init` rewrote `layout.tsx` to load Geist as `--font-sans`, which would fail smoke-mkt (D-05)
- **Fix:** Reinstated Fraunces + Source_Sans_3 + IBM_Plex_Mono; remapped shadcn CSS vars to DESIGN teal/gap/paper/radius sm
- **Files modified:** `src/app/layout.tsx`, `src/app/globals.css`
- **Verification:** `npx tsx --test test/smoke-mkt.test.ts` pass
- **Committed in:** `da5b6fda`

**Total deviations:** 1 auto-fixed (Rule 1)
**Impact on plan:** Necessary for D-05 correctness; no scope creep

## Issues Encountered

- Pre-existing dirty tree blocked `git pull --rebase` (`.planning/STATE.md`, `.planning/config.json`, untracked paper-picks shortlist) - left untouched and continued
- Task 3 needed no package.json edits once build was already green

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Ready for plan 01-02 honesty / trust expansion on the same scaffold
- Domain CRUD, SQLite, and commercial page bodies remain out of scope until later phases

## Self-Check: PASSED

- FOUND: DESIGN.md, page.tsx, globals.css, smoke-mkt.test.ts, button.tsx
- FOUND commits: 7cc58782, e7dd43cd, da5b6fda

---
*Phase: 01-smoke-trust*
*Completed: 2026-08-07*
