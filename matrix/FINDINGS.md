# Findings

Evidence log. Promote methods only per `docs/RUBRIC.md`.

## 2026-07-19 — Bootstrap

Lab scaffolded. First cell queued: **A01 × P-smoke-001**.

## 2026-07-20 — A01 × P-smoke-001 (pass)

- **Cell:** `A01__P-smoke-001__r1`
- **Result:** pass (oracle green, 0 interventions)
- **Approach fit:** Thin one-paragraph PRD with AC was enough for smoke-tier Todo+auth.
- **Fail locus:** none

## 2026-07-20 — A02–A10 × P-smoke-001 (all pass)

| Cell | Result | Approach signal |
|------|--------|-----------------|
| A02 | pass | ERD/API contract before code; no schema drift |
| A03 | pass | Oracle tests + OpenAPI snippet first; red→green noted |
| A04 | pass | PLAN.md with DoD/deviations before impl |
| A05 | pass | Distinct adversarial review; smoke waivers documented |
| A06 | pass | Two small slices logged under soft LOC cap |
| A07 | pass | Spec kit + derived task list mapped to AC |
| A08 | pass | Research options/decision before application code |
| A09 | pass | Named roles + integrator conflict rule |
| A10 | pass | Security/migration/observability checklist from slice 1 |

All ten approaches cleared P-smoke with **0 interventions**. Smoke correctness alone does **not** discriminate methods.

## 2026-07-20 — wave-1 smoke complete

Smoke column A01–A10 × P-smoke-001 finished. Ladder next: top approaches on harder tiers.

### Top-5 for P-crud / P-workflow (stress fit)

1. **A02** — PRD+ERD first (schema/RBAC stress)
2. **A03** — test/contract first (negative permission contracts)
3. **A10** — enterprise gates lite (migrations + authz + observability)
4. **A05** — adversarial review (security findings on RBAC/IDOR)
5. **A07** — spec kit / SDD (permission matrix as AC source)

## 2026-07-20 — Top-5 × P-crud-001 (all pass)

| Cell | Result | Notes |
|------|--------|-------|
| A02 | pass | ERD + permission matrix before impl; SQL migrations 001→002 |
| A03 | pass | Negative RBAC contracts first |
| A10 | pass | Security/migration/health checklist |
| A05 | pass | Adversarial RBAC review |
| A07 | pass | Spec kit + derived tasks |

Stack: Node+TS, `node:sqlite`, bearer auth, owner/member/viewer matrix. Viewer mutate and member-invite negatives held.

## 2026-07-20 — Top-5 × P-workflow-001 (all pass)

| Cell | Result | Notes |
|------|--------|-------|
| A02 | pass | State contract + `expectedVersion` before impl |
| A03 | pass | Transition/concurrency tests first |
| A10 | pass | Audit observability + explicit no-migration |
| A05 | pass | Adversarial race/illegal-jump review |
| A07 | pass | Spec→tasks for approval loop |

Illegal transitions → 400; version conflicts → 409; audit has actor/from/to/timestamp.

## 2026-07-20 — Ladder status / idle

- **wave-1 smoke complete**
- Top-5 cleared three tiers (smoke/crud/workflow) with 0 interventions
- Rubric item 1 (correctness on ≥2 tiers): **eligible** for A02, A03, A10, A05, A07
- **Not promoted:** still need explicit promote decision, intervention budgets, and harder briefs
- Controller idle: no `P-integrate` / `P-scale` briefs in repo yet
- Next human/process work: add harder briefs or record promote/no-promote decisions
