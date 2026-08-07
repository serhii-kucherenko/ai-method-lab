---
phase: 04-renewals-commercial-platform
plan: 03
subsystem: platform
tags: [org, members, audit, settings, bearer, soft-sim]

requires:
  - phase: 04-renewals-commercial-platform
    provides: audit_entries helper from 04-01
  - phase: 02-coverage-engine
    provides: SQLite migrate + demo org
provides:
  - GET/PATCH /api/org with masked webhook secret
  - GET/POST /api/members with seed demo admin
  - GET /api/audit under settings (not primary nav)
  - /settings org + members + audit panel
affects:
  - 04-04 webhook secret + export audit
  - PLT-01 PLT-04 verification

actuals:
  tokens: 14000
  tasks: 3
  commits: 4

tech-stack:
  added: []
  patterns:
    - Org webhook secret set-only; GET returns webhookSecretMasked only
    - Settings footer utility link; seven primary domain routes unchanged
    - Audit append on org.patch and members.create

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
  - "D-07: Bearer org/members APIs; soft-sim single DEMO_ORG_ID"
  - "D-10: Audit under /settings only - no primary /audit nav"
  - "T-04-09: Never return raw webhookSecret on GET"

patterns-established:
  - "toOrgPublic masks secrets; PATCH set-only for webhookSecret"
  - "StudioShell footer Settings link keeps primary IA at seven routes"

requirements-completed: [PLT-01, PLT-04]

coverage:
  - id: D1
    description: "Org GET/PATCH and members GET/POST with Bearer"
    requirement: PLT-01
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#domain-api: org settings + members (PLT-01)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Audit list under settings for org/member mutations"
    requirement: PLT-04
    verification:
      - kind: unit
        ref: "test/domain-api.test.ts#domain-api: audit trail (PLT-04)"
        status: pass
      - kind: unit
        ref: "test/smoke-ui.test.ts#settings page wires org/members and audit"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-07
status: complete
---

# Phase 4 Plan 03: Org, members, audit Summary

**Bearer-protected org/members APIs and an audit panel under `/settings` — not an eighth primary domain nav item.**

## Performance

- **Duration:** ~25 min
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Migrated orgs with seat_tier / webhook_secret and members table; seed demo admin
- `/settings` loads/saves org, adds members, lists audit via `/api/audit`
- Features inventory includes commercial + org/members/audit; smoke-ui asserts footer-only settings

## Task Commits

1. **Task 1: Tracer — org/members** - `cd78127a` (test) + `85333c88` / related feat commits
2. **Task 2: Audit API + panel** - `647913dc` / `85333c88`
3. **Task 3: Smoke + features** - `a5f30f89`

## Deviations from Plan

None - plan executed as written (parallel wave commits coalesced).

## Self-Check: PASSED

- FOUND: org/members/audit routes, settings page, smoke-ui settings assertions
