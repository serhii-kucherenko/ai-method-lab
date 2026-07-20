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

## 2026-07-20 — wave-1 smoke complete

All **A01–A10 × P-smoke-001** scored **pass**. Smoke does not discriminate correctness; all approaches cleared auth/CRUD/IDOR with 0 interventions on the default Node+TS stack.

**Ladder ranking for harder tiers (P-crud stress = ERD churn, RBAC, migration):**

1. **A02** — contracts/ERD before code (matches ERD churn stress)
2. **A03** — test/contract-first (fits negative permission suites)
3. **A10** — migrations + security/observability from slice 1
4. **A05** — adversarial review for permission gaps
5. **A07** — full spec kit for multi-entity scope

Queued those five on **P-crud-001**. Re-rank before P-workflow after P-crud scores. Not promoting any method yet (needs ≥2 tiers per rubric).

## 2026-07-20 — A02 × P-crud-001 (r1)

- **Result:** pass (RBAC + migration oracle)
- **Cycle:** ~0.0275h wall
- **Interventions:** 0
- **Approach fit:** ERD-first paid off — permission matrix and migration plan existed before code; no silent schema drift.
- **Next:** A03 × P-crud-001

## 2026-07-20 — A03 × P-crud-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Test / contract first — Tests/contracts first for RBAC negatives.
- **Next:** A10 × P-crud-001

## 2026-07-20 — A10 × P-crud-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Enterprise gates lite — Security+migration+health gates from slice 1.
- **Next:** A05 × P-crud-001

## 2026-07-20 — A05 × P-crud-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Adversarial review — Adversarial RBAC review attached.
- **Next:** A07 × P-crud-001

## 2026-07-20 — A07 × P-crud-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Spec kit / SDD — Spec kit + derived tasks for multi-entity scope.
- **Next:** P-crud top-5 column complete

## 2026-07-20 — P-crud top-5 column complete

All queued approaches (**A02, A03, A10, A05, A07**) passed P-crud-001 (RBAC + migration). Still no correctness discrimination vs smoke.

**Re-rank for P-workflow** (state machine, audit, concurrency stress): keep same top 5 — they now have two-tier passes and map well to edge-case discipline (A03 tests, A02 contracts, A10 gates, A05 adversarial, A07 spec).

Queued top 5 × **P-workflow-001**. Promotion still blocked until workflow scores + rubric checklist.

## 2026-07-20 — A02 × P-workflow-001 (r1)

- **Result:** pass
- **Cycle:** ~0.01h wall
- **Interventions:** 0
- **Approach fit:** Explicit transition table in ERD prevented illegal jumps; version field specified before code.
- **Next:** A03 × P-workflow-001

## 2026-07-20 — A03 × P-workflow-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Test / contract first — Failing transition tests first.
- **Next:** A10 × P-workflow-001

## 2026-07-20 — A10 × P-workflow-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0003h wall
- **Interventions:** 0
- **Approach fit:** Enterprise gates lite — Security/audit/conflict gates present.
- **Next:** A05 × P-workflow-001

## 2026-07-20 — A05 × P-workflow-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Adversarial review — Adversarial pass on transitions/races.
- **Next:** A07 × P-workflow-001

## 2026-07-20 — A07 × P-workflow-001 (r1)

- **Result:** pass
- **Cycle:** ~0.0006h wall
- **Interventions:** 0
- **Approach fit:** Spec kit / SDD — Spec kit maps AC to transition engine.
- **Next:** P-workflow top-5 complete

