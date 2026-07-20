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

## 2026-07-20 — A04 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Plan → execute — Plan accepted before code; deviation log empty.
- **Next:** A05 on P-smoke-001

## 2026-07-20 — A05 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Adversarial review — Separate adversarial review artifact with waivers noted.
- **Next:** A06 on P-smoke-001

## 2026-07-20 — A06 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Small-slice trunk — Two mergeable slices documented; kept under soft LOC cap.
- **Next:** A07 on P-smoke-001

## 2026-07-20 — A07 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Spec kit / SDD — Full spec kit + derived task list linked.
- **Next:** A08 on P-smoke-001

## 2026-07-20 — A08 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Research-gated build — Research decision merged before code.
- **Next:** A09 on P-smoke-001

## 2026-07-20 — A09 × P-smoke-001 (r1)

- **Result:** pass (oracle 4/4)
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Multi-agent swarm — Named roles + conflict rule + integration verify.
- **Next:** A10 on P-smoke-001

## 2026-07-20 — A10 × P-smoke-001 (r1)

- **Result:** pass (oracle 5/5 incl health)
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Enterprise gates lite — Security+migration+observability checklist complete.
- **Next:** smoke column complete

