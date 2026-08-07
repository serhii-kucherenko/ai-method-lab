---
phase: 04-renewals-commercial-platform
plan: 04
subsystem: platform
tags: [webhook, hmac, export, csv, soft-sim, audit]

requires:
  - phase: 04-renewals-commercial-platform
    provides: Org webhook_secret + audit helper (04-03)
provides:
  - POST /api/webhooks/test HMAC-SHA256 + Idempotency-Key 409
  - GET /api/export kind gaps|renewals|compares format json|csv
  - Renewals and settings export UX via /api/export
  - webhook_deliveries SQLite table + export.action / webhook.accepted audit
affects:
  - 04-05 rate-limit on mutating webhooks
  - PLT-02 PLT-03 verification

actuals:
  tokens: 5657
  tasks: 3
  commits: 1

tech-stack:
  added: []
  patterns:
    - node:crypto createHmac + timingSafeEqual (D-08, D-13)
    - webhook_deliveries UNIQUE(org_id, idempotency_key) → 409 replay
    - Raw body text before JSON parse for HMAC
    - Export audit action export.action (D-10)

key-files:
  created:
    - projects/commitment-coverage-studio/src/lib/webhook.ts
    - projects/commitment-coverage-studio/src/services/export.ts
    - projects/commitment-coverage-studio/src/app/api/webhooks/test/route.ts
    - projects/commitment-coverage-studio/src/app/api/export/route.ts
  modified:
    - projects/commitment-coverage-studio/src/lib/db.ts
    - projects/commitment-coverage-studio/src/app/renewals/page.tsx
    - projects/commitment-coverage-studio/src/app/settings/page.tsx
    - projects/commitment-coverage-studio/test/domain-api.test.ts
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "D-08: X-CCS-Signature HMAC-SHA256 of raw body; Idempotency-Key → 409"
  - "D-09: Bearer GET /api/export kind gaps|renewals|compares format json|csv"
  - "D-10: Audit on webhook.accepted and export.action"
  - "D-13: No new npm packages — node:crypto only"
  - "D-14: domain-api covers valid/invalid/replay + JSON/CSV export"

patterns-established:
  - "Webhook soft-sim: resolve org secret or CCS_WEBHOOK_SECRET, verify hex/sha256= hex with timingSafeEqual"
  - "Export packs: SQLite rows → JSON envelope or CSV with quote escaping"

requirements-completed: [PLT-02, PLT-03]

coverage:
  - id: D1
    description: "HMAC webhook accept/reject/replay with Idempotency-Key"
    requirement: PLT-02
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#POST /api/webhooks/test rejects missing/invalid signature; accepts HMAC; replay 409"
        status: pass
    human_judgment: false
  - id: D2
    description: "Export JSON/CSV for gaps renewals compares with Bearer"
    requirement: PLT-03
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#GET /api/export returns JSON and CSV for gaps/renewals/compares with Bearer"
        status: pass
    human_judgment: false
  - id: D3
    description: "Renewals and settings wire export via /api/export"
    requirement: PLT-03
    verification:
      - kind: unit
        ref: "test/smoke-ui.test.ts#renewals and settings wire export via /api/export"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 04: Webhook HMAC + export Summary

**Soft-sim webhook ingress verifies HMAC and blocks idempotent replays; export packs download as JSON or CSV.**

## Performance

- **Duration:** ~25 min (finish uncommitted WIP + verify)
- **Started:** 2026-08-07T09:37:00Z
- **Completed:** 2026-08-07T09:42:00Z
- **Tasks:** 3/3
- **Files modified:** 9

## Accomplishments

- `POST /api/webhooks/test` verifies raw-body HMAC-SHA256 (`X-CCS-Signature`), requires `Idempotency-Key`, returns 401 on bad sig and 409 on replay (PLT-02, D-08)
- Accepted deliveries persist in `webhook_deliveries` and write `webhook.accepted` audit (D-10, D-13)
- `GET /api/export?kind=gaps|renewals|compares&format=json|csv` Bearer-gated with `export.action` audit (PLT-03, D-09, D-10)
- Renewals Export downloads renewals JSON via `/api/export`; settings offers gaps/compares JSON+CSV

## Task Commits

Each task shipped in one atomic feature commit (WIP already integrated):

1. **Tasks 1–3: HMAC webhook + export API + UX** - `e4383eaf` (feat)

**Plan metadata:** this SUMMARY commit (`docs(04-04)`)

## Files Created/Modified

- `src/lib/webhook.ts` - sign/verify helpers (createHmac + timingSafeEqual)
- `src/lib/db.ts` - `webhook_deliveries` table + unique idempotency key
- `src/app/api/webhooks/test/route.ts` - soft-sim HMAC ingress
- `src/services/export.ts` - gaps/renewals/compares JSON+CSV builder
- `src/app/api/export/route.ts` - Bearer export route + audit
- `src/app/renewals/page.tsx` - Export pack → `/api/export`
- `src/app/settings/page.tsx` - gaps/compares export controls
- `test/domain-api.test.ts` - HMAC + export coverage (D-14)
- `test/smoke-ui.test.ts` - export wire smoke

## Decisions Made

- Followed D-08/D-09/D-10/D-13/D-14 as locked in CONTEXT
- Rate-limit (PLT-05 / D-11) left to plan 04-05 — not committed here

## Deviations from Plan

### Auto-fixed Issues

None.

### Other Deviations

**1. Single feat commit instead of per-task TDD RED/GREEN commits**
- **Found during:** Finish of pre-existing WIP
- **Issue:** Plan marks tasks `tdd="true"` with separate commits; tree already had integrated webhook + export + tests uncommitted
- **Fix:** Verified behavior with domain-api + smoke + `npm test` / `npm run build`; committed as one `feat(04-04)` rather than rewriting history into fake RED commits
- **Files modified:** n/a (process)
- **Commit:** `e4383eaf`

**2. Renewals Export downloads JSON pack only**
- **Found during:** Task 3 review
- **Issue:** Plan says CSV or JSON; renewals button uses JSON via `apiJson`. CSV remains available on settings and via `format=csv` on the API
- **Fix:** Accepted — API and settings cover CSV; renewals pack is the JSON evidence pack
- **Commit:** `e4383eaf`

## Verification

- `npm test` — 63/63 pass (includes webhook HMAC + export + smoke export wire)
- `npm run build` — success; `/api/webhooks/test` and `/api/export` present

## Self-Check: PASSED

- FOUND: `src/lib/webhook.ts`, `src/services/export.ts`, `src/app/api/webhooks/test/route.ts`, `src/app/api/export/route.ts`
- FOUND: commit `e4383eaf`
- PLT-02 / PLT-03 marked complete in REQUIREMENTS.md
