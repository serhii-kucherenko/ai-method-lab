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

## 2026-07-20 — Integrate phase (pass)

- Oracle: outbound payment map, HMAC accept/reject, duplicate webhook safe, dependency 5xx/timeout → 502 — 5/5
- Migration `004_integrate` (payments + webhook_events)
- Regression: 15/15
- Interventions: 0
- Next: scale (pagination + rate limits)

## 2026-07-20 — Scale phase (pass)

- Oracle: walk 250 requests without gaps/dupes; limit capped; 429 + Retry-After — 2/2
- Keyset pagination + SCALE.md; regression 17/17
- Interventions: 0
- Next: sustain (minimal UI + production-shaped path)

## 2026-07-20 — Sustain phase (pass) — product sustained

- Minimal UI at `/` for login → create → submit → approve
- Structured JSON logs on health/UI; THREATS + MIGRATIONS rollback notes; README run/deploy
- Production-shaped path test green; full suite 19/19
- Interventions: 0

### Promote / reuse notes

- **Reuse A03+A10** for the next portfolio product (ledgerlite): test-first slices + enterprise gates (health, threats, migrations) from day one
- **Carry forward:** SQLite file migrations, keyset pagination, HMAC webhook pattern, optimistic versioning
- **Watch outs:** plaintext passwords still lab-only; hash before any real deploy; rate limits are in-memory (per process)
