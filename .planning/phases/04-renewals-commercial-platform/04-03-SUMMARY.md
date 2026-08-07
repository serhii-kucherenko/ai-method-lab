---
phase: 04-renewals-commercial-platform
plan: 03
subsystem: platform
tags: [settings, org, members, audit, bearer]

requires:
  - phase: 04-renewals-commercial-platform
    provides: audit_entries table + renewals audit writes (04-01)
provides:
  - GET/PATCH /api/org with Bearer and masked webhook_secret
  - GET/POST /api/members with Bearer
  - GET /api/audit audit trail list
  - /settings org + members + audit panel (not primary IA)
affects:
  - 04-04 webhook HMAC (org webhook_secret)
  - 04-05 rate-limit (mutating org/members routes)

actuals:
  tokens: 18000
  tasks: 3
  commits: 4

tech-stack:
  added: []
  patterns:
    - Settings under StudioShell as utility/footer link, not eighth primary domain nav
    - Org webhook_secret set-only on PATCH; GET returns masked
    - Audit panel lists audit_entries for demo org

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
    - projects/commitment-coverage-studio/src/services/audit.ts
    - projects/commitment-coverage-studio/src/components/studio-shell.tsx
    - projects/commitment-coverage-studio/src/app/api/features/route.ts
    - projects/commitment-coverage-studio/test/domain-api.test.ts
    - projects/commitment-coverage-studio/test/smoke-ui.test.ts

key-decisions:
  - "D-07: Bearer org/members APIs; /settings admin surface"
  - "D-10: Audit under settings panel, not primary StudioShell nav"
  - "D-12: Settings is utility link; seven domain routes stay primary"
  - "D-13: Schema via migrate; no new npm packages"
  - "D-14: domain-api + smoke-ui cover org/members/audit"

patterns-established:
  - "Platform chrome is /settings with secondary audit section"
  - "Features inventory updated for org-settings, members, audit + commercial ids from 04-02"

requirements-completed: [PLT-01, PLT-04]

coverage:
  - id: D1
    description: Org GET/PATCH and members GET/POST with Bearer
    requirement: PLT-01
    verification:
      - kind: unit
        ref: test/domain-api.test.ts
        status: pass
    human_judgment: false
  - id: D2
    description: Audit trail under settings (non-primary IA)
    requirement: PLT-04
    verification:
      - kind: unit
        ref: test/smoke-ui.test.ts#settings page wires org/members and audit
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 04 Plan 03: Org settings, members, audit

**PLT-01 and PLT-04 shipped:** `/settings` manages org + members with Bearer APIs; audit trail is listed under settings, not as a primary desk nav.

## Accomplishments

- Org settings columns + members table in SQLite migrate
- `GET/PATCH /api/org`, `GET/POST /api/members`, `GET /api/audit`
- `/settings` UI with audit panel; StudioShell utility link only
- Features inventory includes org-settings, members, audit (+ commercial ids)
- Smoke + domain-api coverage for settings wiring

## Deviations

Background executor stalled before SUMMARY; closed from commits already on `main` (`cd78127a`…`a5f30f89`). Wave-3 webhook/export WIP left uncommitted for 04-04.

## Self-Check: PASSED

Org/members/audit routes and settings smoke present; ROADMAP checkbox updated with this close-out.
