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

## 2026-07-20 — A03 × P-crud-001 (pass)

- Test-first RBAC + SQLite migrations (001→002 priority). Oracle 3/3 including negatives.
- Confirms A03 remains top signal when schema/permissions appear.

## 2026-07-20 — Wave-2 CRUD top-5 complete

A10, A05, A02, A08 × P-crud-001 all **pass**. No correctness failures.

**Queue next:** same top-5 × P-workflow-001 (approvals state machine).

## 2026-07-20 — Wave-3 workflow top-5 complete

A03, A10, A05, A02, A08 × P-workflow-001 all **pass** (legal/illegal transitions, audit, concurrency).

## 2026-07-20 — Available matrix columns complete

Smoke (all 10) + top-5 on crud + workflow are scored. Authored P-integrate + P-scale briefs to continue ladder.

## 2026-07-20 — Waves 4–5 complete (integrate + scale)

Finalists A03, A10, A05, A02, A08 passed P-integrate-001 and P-scale-001. Controller idle — backlog empty pending team-size sims or promote decisions. Still `mode: autonomous` (not hard_stop).

## 2026-07-20 — Wave-6 queued (team-size sims)

Ladder columns complete. **Research decision:** team-size sims use **scripted role prompts** (ROLE_LOG + ownership handoffs), not real multi-agent runtimes — matches A09 sim pattern and keeps oracles comparable.

**Queue:** finalists A03→A10→A05→A02→A08 × P-workflow-001 × `team_size_sim` 2, 3, 5 (15 cells). Size 1 already covered.

Promote deferred until team-fit friction is scored (rubric primary metric). Notify sent: decide whether to promote early on size-1 evidence or wait for wave-6.

## 2026-07-20 — A03 × P-workflow-001 × ts2 (pass)

Scripted size-2: Product locked AC; Eng wrote failing tests then FSM. Oracle 4/4. Interventions 0. Handoff friction low (natural fit for A03 team notes).

## 2026-07-20 — A03 × P-workflow-001 × ts3 (pass)

Intake → Eng lead AC → Builder red→green. Oracle 4/4. Extra ceremony vs ts2; no correctness cost.

## 2026-07-20 — A03 × P-workflow-001 × ts5 (pass)

Five-lane ROLE_LOG (intake/design/lead/2 builders/QA). Oracle 4/4. WIP limit (sequential B1→B2) kept friction manageable. **A03 viable at 1/2/3/5 on workflow tier.**



