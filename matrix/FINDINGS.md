# Findings

Evidence log. Promote methods only per `docs/RUBRIC.md`.

## 2026-07-19 — Bootstrap

Lab scaffolded. No cells scored yet. First cell queued: **A01 × P-smoke-001**.

## 2026-07-20 — A01 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.01h wall (smoke stack; not a human-day estimate)
- **Interventions:** 0
- **Approach fit:** Thin PRD → code works for P-smoke: one-paragraph AC was enough; no ERD needed for in-memory model.
- **Risks seen:** None material; auth boundary covered by tests.
- **Next:** Continue wave-1 smoke with A02 (PRD+ERD first).

## 2026-07-20 — A02 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0031h wall
- **Interventions:** 0
- **Approach fit:** PRD+ERD-first adds clear authz/API contract before code; low overhead on smoke tier.
- **Vs A01:** Slightly more artifact work; same oracle outcome.
- **Next:** A03 test/contract-first.

## 2026-07-20 — A03 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Test / contract first — Failing tests/contracts first; red→green log present.
- **Next:** A04 on P-smoke-001

