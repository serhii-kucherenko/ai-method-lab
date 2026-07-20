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

Queued those five on P-crud-001 then P-workflow-001. No promotion yet (need ≥2 tiers + explicit promote decision).
