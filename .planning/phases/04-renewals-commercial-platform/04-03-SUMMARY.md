---
phase: 04-renewals-commercial-platform
plan: 03
subsystem: platform
tags: [org, members, settings, audit, bearer, soft-sim]

requires:
  - phase: 04-renewals-commercial-platform
    provides: audit_entries helper (appendAudit/listAudit) from 04-01
provides:
  - GET/PATCH /api/org with masked webhook secret
  - GET/POST /api/members with seeded demo admin
  - GET /api/audit + audit writes on org/member mutations
  - /settings org + members + audit panel (footer utility link)
affects:
  - 04-04 webhooks (org webhook_secret)
  - PLT-01 / PLT-04 verification

actuals:
  tokens: 19585
  tasks: 3
  commits: 6

tech-stack:
  added: []
  patterns:
    - Org webhook secret set-only; GET returns webhookSecretMasked only
    - Audit under /settings, never primary StudioShell nav
    - Settings linked from StudioShell footer utility

key-files:
  created:
    - projects/commitment-coverage-studio/src/services/org.ts
    - projects/commitment-coverage-studio/src/services/members.ts
    - projects/commitment-coverage-studio/src/app/api/org/route.ts
    - projects/commitment-coverage-studio/src/app/api/members/route.ts
    - projects/commitment-coverage-studio/src/app/api/audit/route.ts
    - projects/commitment-coverage-studio/src/app/settings/page.tsx
  modified:
    - projects/commitment-coverage-studio/src/lib/db.ts
    - projects/commitment-coverage-studio/src/components/studio-shell.tsx
    - projects/commitment-coverage-studio/src/app/api/features/route.ts
    - projects/commitment-coverage-studio/test/domain-api.test.ts
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "D-07: Bearer-required org GET/PATCH and members GET/POST under /settings"
  - "D-10: Audit panel under settings; no primary /audit nav"
  - "T-04-09: webhook secret masked on GET; PATCH set-only"
  - "D-12: Settings footer utility; primary nav stays seven domain routes"
  - "D-13: No new npm packages; ALTER org columns + members table"

patterns-established:
  - "soft-sim:{bearer-token} actor on org.patch and members.create audits"
  - "Seed member-demo-admin when members empty"

requirements-completed: [PLT-01, PLT-04]

coverage:
  - id: D1
    description: "Org admin loads/patches org and manages members via Bearer APIs"
    requirement: PLT-01
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#with Bearer: GET org, PATCH name/tier, GET/POST members"
        status: pass
      - kind: unit
        ref: "test/smoke-ui.test.ts#settings page wires org/members and audit under settings"
        status: pass
    human_judgment: false
  - id: D2
    description: "Audit trail of mutations visible under settings (not primary IA)"
    requirement: PLT-04
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#org PATCH and member POST write audit; GET /api/audit lists them"
        status: pass
      - kind: unit
        ref: "test/smoke-ui.test.ts#studio-shell keeps settings as footer utility, not eighth primary nav"
        status: pass
    human_judgment: false
  - id: D3
    description: "Features inventory + full test/build green for platform settings"
    verification:
      - kind: unit
        ref: "npm test && npm run build"
        status: pass
    human_judgment: false

duration: 18min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 03: Org settings, members, audit Summary

**`/settings` ships org GET/PATCH, members list/add, and audit trail with Bearer APIs — webhook secret masked, audit not in primary nav.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-08-07T09:18:36Z
- **Completed:** 2026-08-07T09:36:00Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Org settings columns + members table; Bearer `/api/org` and `/api/members`
- Audit GET API; org/member mutations write `audit_entries`; panel on `/settings`
- Footer Settings link; seven primary domain routes unchanged; features + smoke + build green

## Task Commits

1. **Task 1: Tracer — org/members (RED)** - `cd78127a` (test)
2. **Task 1: Tracer — org/members (GREEN)** - `049f6bf2` (feat; landed under parallel 04-02 message — deviation)
3. **Task 2: Audit API + panel** - `85333c88` (feat)
4. **Task 2: Deduplicate settings audit panel** - `647913dc` (feat)
5. **Task 3: Smoke + features** - `a5f30f89` (feat)
6. **Plan metadata** - `9936073c` (docs)

## Files Created/Modified

- `src/services/org.ts` - get/update org + secret masking
- `src/services/members.ts` - list/create members
- `src/lib/db.ts` - seat_tier, webhook_secret, members, seed admin
- `src/app/api/org/route.ts` - GET/PATCH + audit on PATCH
- `src/app/api/members/route.ts` - GET/POST + audit on POST
- `src/app/api/audit/route.ts` - GET recent entries
- `src/app/settings/page.tsx` - org form, members, audit panel
- `src/components/studio-shell.tsx` - footer Settings utility link
- `src/app/api/features/route.ts` - org-settings, members, audit (+ commercial inventory)
- `test/domain-api.test.ts` - org/members/audit Bearer coverage
- `test/smoke-ui.test.ts` - settings + anti-desk primary IA

## Decisions Made

Honored D-07, D-10, D-12, D-13, D-14 and threat mitigations T-04-08 / T-04-09 / T-04-11. Reused 04-01 `appendAudit` / `listAudit`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Parallel wave file ownership**
- **Found during:** Task 1–2
- **Issue:** Parallel 04-02 executor committed org/members/settings under `feat(04-02):…` (`049f6bf2`); later duplicate audit panel from concurrent writes
- **Fix:** Kept working implementation; removed duplicate audit section (`647913dc`); documented mis-tagged commit
- **Files modified:** `src/app/settings/page.tsx`
- **Commit:** `647913dc`

## Issues Encountered

None blocking. Parallel 04-04 files (`export`/`webhooks`/`rate-limit`) appeared untracked during close-out — left untouched for that plan.

## User Setup Required

None - soft-sim Bearer `ccs-demo-token` unchanged.

## Next Phase Readiness

PLT-01 and PLT-04 done. Next: 04-04 webhook HMAC + export JSON/CSV (uses org webhook_secret).

## Verification Results

- `npx tsx --test test/domain-api.test.ts` — 25/25 pass
- `npm test` — 59/59 pass
- `npm run build` — success (includes `/settings`, `/api/org`, `/api/members`, `/api/audit`)

## Self-Check: PASSED

- FOUND: `src/app/api/org/route.ts`, `src/app/api/members/route.ts`, `src/app/api/audit/route.ts`, `src/app/settings/page.tsx`, `04-03-SUMMARY.md`
- FOUND commits: `cd78127a`, `049f6bf2`, `85333c88`, `647913dc`, `a5f30f89`, `9936073c`
