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

## 2026-07-20 — A10 × P-workflow-001 × ts2/ts3/ts5 (pass)

Enterprise checklist as merge gate at every size. Oracle 4/4 + /health. Security-minded reviewer role maps cleanly to Eng lead / QA lane. **A10 viable at 1/2/3/5.**

## 2026-07-20 — A05 × P-workflow-001 × ts2/ts3/ts5 (pass)

Adversarial review artifact required at each size; cross-review at ts2, dedicated QA at ts5. Oracle 4/4. **A05 viable at 1/2/3/5.**

## 2026-07-20 — A02 × P-workflow-001 × ts2/ts3/ts5 (pass)

PRD/ERD ownership splits cleanly across Product/Design lanes. Oracle 4/4. **A02 viable at 1/2/3/5.**

## 2026-07-20 — A08 × P-workflow-001 × ts2/ts3/ts5 (pass)

Research-gate before code; higher ceremony at ts5 but still green. Oracle 4/4. **A08 viable at 1/2/3/5.**

## 2026-07-20 — Wave-6 team-size complete

All finalists (A03, A10, A05, A02, A08) passed P-workflow-001 at team sizes 2/3/5 (size 1 prior). No team-fit failures. Ceremony increases with size; correctness holds.

**Scored auto-promote applied.** Product workflow: `docs/DEVELOPMENT_WORKFLOW.md`. Lab operators: `docs/USAGE_GUIDE.md`.

## 2026-07-20 — Portfolio model + clearpath smoke (pass)

**Reframe:** Experiments = build real products under `projects/`. Climb phases to sustain. Repeat.

- First product: **clearpath** (approvals/requests) under A03+A10
- Smoke phase oracle 5/5 (auth, CRUD, isolation, health)
- Work surface: `projects/clearpath` (committed), not sandbox
- Next: clearpath crud → workflow → integrate → scale → sustain; then ledgerlite, signalboard

## PROMOTE — A03 (primary default)


- **Use for:** schema-heavy APIs, RBAC, migrations, workflow logic, default backend work
- **Evidence:** strongest process signal (red→green); passed smoke → crud → workflow → integrate → scale; viable team sizes 1/2/3/5
- **Failure modes:** ceremony on tiny spikes (use A01); test drift if CI contracts neglected

## PROMOTE — A10 (enterprise alternate)

- **Use for:** security-sensitive, compliance, prod observability/migration gates from slice 1
- **Evidence:** checklist gate scales with review/QA lane; all tiers + team sizes pass
- **Failure modes:** friction on throwaway prototypes

## Documented finalists (not auto-default)

A02 (ERD-first), A05 (adversarial), A08 (research-gate) — viable all tiers; pick per project shape.

## Deprioritized

A09 swarm sim (solo agent overhead). A01/A04/A06 smoke-only or partial ladder. A07 partial ladder.

## 2026-07-20 — Post-ladder process complete

Failure tags standardized (`docs/FAIL_TAGS.md`). Replication default: **promoted-only** (A03 + A10 × P-smoke-001, 3 runs each). GitHub CLI verified for remote PR trails.

## 2026-07-20 — A03 × P-smoke-001 × r2 (pass)

Replication run 2 of promoted primary. Test-first RED→GREEN; oracle 4/4. Matches r1 signal.

## 2026-07-20 — clearpath × P-crud-001 (pass)

Projects/tasks/comments with owner/member/viewer RBAC; SQLite + 2 migrations; smoke regression green. Oracle 3/3 + negatives. Next: workflow state machine on clearpath.

## 2026-07-20 — clearpath × P-workflow-001 (pass)

Approval state machine with audit + optimistic locking. Oracle 4/4; regression 12/12. Next: integrate.

## 2026-07-20 — clearpath × P-integrate-001 (pass)

Outbound mock payment + HMAC webhooks with idempotency. Oracle green; 502 on dependency failure. Next: scale.

## 2026-07-20 — clearpath × P-scale-001 (pass)

Keyset pagination + rate limits on request lists. Oracle green; 17/17 regression. Next: sustain.

## 2026-07-20 — clearpath sustained

Minimal UI + production path + migration rollback notes. Full suite 19/19. Next product: ledgerlite.

## 2026-07-20 — ledgerlite × P-smoke-001 (pass)

Second portfolio product. Entry CRUD + isolation; Clearpath patterns reused cleanly. Next: crud.

## 2026-07-20 — ledgerlite × P-crud-001 (pass)

Shared ledgers with RBAC + notes migration. Oracle 3/3; smoke regression green. Next: workflow.

## 2026-07-20 — ledgerlite × P-workflow-001 (pass)

Entry approval state machine + audit + optimistic locking. Next: integrate.

## 2026-07-20 — ledgerlite sustained

Integrate + scale + sustain green (19/19). Next product: signalboard (A03+A05).

## 2026-07-20 — signalboard × P-smoke-001 (pass)

A03+A05. Status CRUD + adversarial review artifact. Next: crud.

## 2026-07-20 — signalboard × P-crud-001 (pass)

Shared boards with RBAC + severity migration. Next: workflow.

## 2026-07-20 — signalboard sustained

Finish pack green (19/19) with A05 overlay. Portfolio products clearpath, ledgerlite, signalboard all sustained.

## 2026-07-20 — A03 × P-smoke-001 r3 (replication pass)

Independent sandbox rebuild; oracle 4/4. A03 triple-test complete (r1–r3 all pass). Next: A10 smoke r2.

## 2026-07-20 — A10 × P-smoke-001 r2 + r3 (replication pass)

Enterprise lite replications both green (oracle + health + checklist artifacts). A10 triple-test 3/3. Promoted defaults confirmed; replication wave complete.

## 2026-07-20 — kitcheck × P-smoke-001 (pass)

Fourth portfolio product (equipment loans). A03+A10. Oracle + health green. Next: crud (kits RBAC).

## 2026-07-20 — kitcheck × P-crud-001 (pass)

Shared kits RBAC + notes migration. Next: workflow.

## 2026-07-20 — kitcheck sustained

Finish pack green (19/19). Equipment checkout domain sustained. Next product: meetslot.

## 2026-07-20 — meetslot × P-smoke-001 (pass)

Fifth portfolio product (room bookings). Next: crud.

## 2026-07-20 — meetslot sustained

Finish pack green (19/19). Next: briefpad.

## 2026-07-20 — briefpad sustained

Sixth portfolio product. Notes + pads + publish workflow. 19/19.

## 2026-07-20 — clipvault sustained

Seventh portfolio product. Clips + vaults + publish workflow. 19/19. Next: formqueue.

## 2026-07-20 — formqueue sustained

Eighth portfolio product. Forms + queues + submit/review/close. 19/19. Next: tasklane.

## 2026-07-20 — tasklane sustained

Ninth portfolio product. Cards + lanes + todo/doing/done. 19/19. Next: invoicelink.

## 2026-07-20 — invoicelink sustained

Tenth portfolio product. Invoices + books + draft/sent/paid. 19/19. Next: guestpass.

## 2026-07-20 — guestpass sustained

Eleventh portfolio product. Passes + sites + request/approve/check-in. 19/19. Next: waitlist.
















## 2026-07-20 � waitlist sustained

Twelfth portfolio product. Entries + lists + waiting/invited/joined. 19/19. Next: tipjar.

