# Clearpath findings

Product-level evidence log. Phase scores also land in `matrix/cells/` and `matrix/FINDINGS.md`.

## 2026-07-20 — Experiment started

Portfolio model: products live under `projects/`. Clearpath is first product under A03+A10.

## 2026-07-20 — Smoke phase (pass)

- Oracle: register/login, request CRUD, IDOR blocked, `/health` — 5/5
- Artifacts: PRD, RED_GREEN, THREATS (A10)
- Interventions: 0
## 2026-07-20 — Crud phase (pass)

- Oracle: RBAC owner/member/viewer on project/task/comment; 2 migrations; negative tests — 3/3
- SQLite via node:sqlite; smoke regression green (8 tests)
- Interventions: 0
- Next: workflow (approval state machine)

## 2026-07-20 — Workflow phase (pass)

- Oracle: legal/illegal transitions, audit log, concurrent version conflict, revise loop — 4/4
- Migration `003_request_workflow` (version + request_audit)
- Regression: smoke + crud still green (12 tests total)
- Interventions: 0
- Next: integrate (webhooks + idempotency)
