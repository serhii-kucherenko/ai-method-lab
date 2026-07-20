# FINDINGS — Signalboard

## 2026-07-20 — Experiment started

Third portfolio product. Workflow A03+A05 (adversarial overlay).

## 2026-07-20 — Smoke phase (pass)

- Oracle: auth, status CRUD, IDOR, `/health` — 5/5
- A05: `ADVERSARIAL_REVIEW.md` (plaintext waived; owner-scoped statuses accepted)
- Interventions: 0
- Next: crud

## 2026-07-20 — CRUD phase (pass)

- Oracle: projects RBAC + severity migration + non-member 404 — 3/3
- A05 adversarial update; suite 8/8
- Interventions: 0
- Next: workflow
