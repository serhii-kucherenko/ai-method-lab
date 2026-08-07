---
phase: 04-renewals-commercial-platform
plan: 04
subsystem: platform
tags: [webhook, hmac, export, csv, soft-sim]

requires:
  - phase: 04-renewals-commercial-platform
    provides: Org webhook_secret + audit helper (04-03)
provides:
  - POST /api/webhooks/test HMAC-SHA256 + Idempotency-Key 409
  - GET /api/export kind gaps|renewals|compares format json|csv
  - Renewals and settings export UX via /api/export
affects:
  - 04-05 rate-limit on mutating webhooks
  - PLT-02 PLT-03 verification

actuals:
  tokens: 11000
  tasks: 3
  commits: 2

tech-stack:
  added: []
  patterns:
    - node:crypto createHmac + timingSafeEqual
    - webhook_deliveries unique (org_id, idempotency_key)
    - Export audit action export.action

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

key-decisions:
  - "D-08: X-CCS-Signature HMAC of raw body; Idempotency-Key → 409"
  - "D-09: Bearer export JSON/CSV for gaps/renewals/compares"
  - "D-13: No new npm packages"

requirements-completed: [PLT-02, PLT-03]

coverage:
  - id: D1
    description: "HMAC webhook accept/reject/replay"
    requirement: PLT-02
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#domain-api: webhook HMAC + export"
        status: pass
    human_judgment: false
  - id: D2
    description: "Export JSON/CSV for gaps renewals compares"
    requirement: PLT-03
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#GET /api/export returns JSON and CSV"
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 04: Webhook HMAC + export Summary

**Soft-sim webhook ingress verifies HMAC and blocks idempotent replays; export packs download as JSON or CSV.**

## Accomplishments

- `POST /api/webhooks/test` with raw-body HMAC and Idempotency-Key 409
- `GET /api/export` Bearer-gated JSON/CSV for gaps, renewals, compares
- Renewals Export and settings export buttons call the export API

## Deviations from Plan

None - plan executed as written.

## Self-Check: PASSED
