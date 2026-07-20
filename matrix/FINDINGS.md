# Findings

Evidence log. Promote methods only per `docs/RUBRIC.md`.

## 2026-07-19 — Bootstrap

Lab scaffolded. First cell queued: **A01 × P-smoke-001**.

## 2026-07-20 — A01 × P-smoke-001 (pass)

Thin PRD → impl. Oracle 4/4. Controller merged locally (`gh` CLI missing). Interventions: 0.

## 2026-07-20 — A02 × P-smoke-001 (pass)

PRD+ERD before code. Small ceremony; better ownership/API artifact. Oracle 4/4.

## 2026-07-20 — A03 × P-smoke-001 (pass)

Red→green commits. Strongest process evidence on smoke. Oracle 4/4.

## 2026-07-20 — A04 × P-smoke-001 (pass)

Plan accepted before code; zero deviations. Oracle 4/4.

## 2026-07-20 — A05 × P-smoke-001 (pass)

Distinct adversarial reviewer; plaintext password + rate-limit waived explicitly. Oracle 4/4.

## 2026-07-20 — A06 × P-smoke-001 (pass)

Auth slice then todos slice (≥2 merges). Oracle 4/4.

## 2026-07-20 — A07 × P-smoke-001 (pass)

Spec kit + derived tasks. Heavier docs; same correctness. Oracle 4/4.

## 2026-07-20 — A08 × P-smoke-001 (pass)

Research merged first (bearer/http/memory decision). Oracle 4/4.

## 2026-07-20 — A09 × P-smoke-001 (pass)

Role log + integrator merge. High overhead when roles are simulated in one agent. Oracle 4/4.

## 2026-07-20 — A10 × P-smoke-001 (pass)

Checklist: authz, no-migration, `/health` + structured logs, threats. Oracle 4/4 + health.

## 2026-07-20 — Wave-1 smoke complete

All A01–A10 × P-smoke-001 scored **pass**. No approach failed correctness on smoke.

**Queue next (top-5 × P-crud-001):** A03, A10, A05, A02, A08 — then same five × P-workflow-001.

**Autonomy note:** Merge policy locked (`agent_merges_own_prs`). Sandbox PRs are local merge trails until `gh` is available for remote PRs. Hourly Automation draft opened in Glass for unattended continuation.
