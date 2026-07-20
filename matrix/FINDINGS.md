# Findings

Evidence log. Promote methods only per `docs/RUBRIC.md`.

## 2026-07-19 Ã¢â‚¬â€ Bootstrap

Lab scaffolded. First cell queued: **A01 Ãƒâ€” P-smoke-001**.

## 2026-07-20 Ã¢â‚¬â€ A01 Ãƒâ€” P-smoke-001 (pass)

Thin PRD Ã¢â€ â€™ impl. Oracle 4/4. Controller merged locally (`gh` CLI missing). Interventions: 0.

## 2026-07-20 Ã¢â‚¬â€ A02 Ãƒâ€” P-smoke-001 (pass)

PRD+ERD before code. Small ceremony; better ownership/API artifact. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-smoke-001 (pass)

RedÃ¢â€ â€™green commits. Strongest process evidence on smoke. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A04 Ãƒâ€” P-smoke-001 (pass)

Plan accepted before code; zero deviations. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A05 Ãƒâ€” P-smoke-001 (pass)

Distinct adversarial reviewer; plaintext password + rate-limit waived explicitly. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A06 Ãƒâ€” P-smoke-001 (pass)

Auth slice then todos slice (Ã¢â€°Â¥2 merges). Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A07 Ãƒâ€” P-smoke-001 (pass)

Spec kit + derived tasks. Heavier docs; same correctness. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A08 Ãƒâ€” P-smoke-001 (pass)

Research merged first (bearer/http/memory decision). Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A09 Ãƒâ€” P-smoke-001 (pass)

Role log + integrator merge. High overhead when roles are simulated in one agent. Oracle 4/4.

## 2026-07-20 Ã¢â‚¬â€ A10 Ãƒâ€” P-smoke-001 (pass)

Checklist: authz, no-migration, `/health` + structured logs, threats. Oracle 4/4 + health.

## 2026-07-20 Ã¢â‚¬â€ Wave-1 smoke complete

All A01Ã¢â‚¬â€œA10 Ãƒâ€” P-smoke-001 scored **pass**. No approach failed correctness on smoke.

**Queue next (top-5 Ãƒâ€” P-crud-001):** A03, A10, A05, A02, A08 Ã¢â‚¬â€ then same five Ãƒâ€” P-workflow-001.

**Autonomy note:** Merge policy locked (`agent_merges_own_prs`). Sandbox PRs are local merge trails until `gh` is available for remote PRs. Hourly Automation draft opened in Glass for unattended continuation.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-crud-001 (pass)

- Test-first RBAC + SQLite migrations (001Ã¢â€ â€™002 priority). Oracle 3/3 including negatives.
- Confirms A03 remains top signal when schema/permissions appear.

## 2026-07-20 Ã¢â‚¬â€ Wave-2 CRUD top-5 complete

A10, A05, A02, A08 Ãƒâ€” P-crud-001 all **pass**. No correctness failures.

**Queue next:** same top-5 Ãƒâ€” P-workflow-001 (approvals state machine).

## 2026-07-20 Ã¢â‚¬â€ Wave-3 workflow top-5 complete

A03, A10, A05, A02, A08 Ãƒâ€” P-workflow-001 all **pass** (legal/illegal transitions, audit, concurrency).

## 2026-07-20 Ã¢â‚¬â€ Available matrix columns complete

Smoke (all 10) + top-5 on crud + workflow are scored. Authored P-integrate + P-scale briefs to continue ladder.

## 2026-07-20 Ã¢â‚¬â€ Waves 4Ã¢â‚¬â€œ5 complete (integrate + scale)

Finalists A03, A10, A05, A02, A08 passed P-integrate-001 and P-scale-001. Controller idle Ã¢â‚¬â€ backlog empty pending team-size sims or promote decisions. Still `mode: autonomous` (not hard_stop).

## 2026-07-20 Ã¢â‚¬â€ Wave-6 queued (team-size sims)

Ladder columns complete. **Research decision:** team-size sims use **scripted role prompts** (ROLE_LOG + ownership handoffs), not real multi-agent runtimes Ã¢â‚¬â€ matches A09 sim pattern and keeps oracles comparable.

**Queue:** finalists A03Ã¢â€ â€™A10Ã¢â€ â€™A05Ã¢â€ â€™A02Ã¢â€ â€™A08 Ãƒâ€” P-workflow-001 Ãƒâ€” `team_size_sim` 2, 3, 5 (15 cells). Size 1 already covered.

Promote deferred until team-fit friction is scored (rubric primary metric). Notify sent: decide whether to promote early on size-1 evidence or wait for wave-6.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-workflow-001 Ãƒâ€” ts2 (pass)

Scripted size-2: Product locked AC; Eng wrote failing tests then FSM. Oracle 4/4. Interventions 0. Handoff friction low (natural fit for A03 team notes).

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-workflow-001 Ãƒâ€” ts3 (pass)

Intake Ã¢â€ â€™ Eng lead AC Ã¢â€ â€™ Builder redÃ¢â€ â€™green. Oracle 4/4. Extra ceremony vs ts2; no correctness cost.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-workflow-001 Ãƒâ€” ts5 (pass)

Five-lane ROLE_LOG (intake/design/lead/2 builders/QA). Oracle 4/4. WIP limit (sequential B1Ã¢â€ â€™B2) kept friction manageable. **A03 viable at 1/2/3/5 on workflow tier.**

## 2026-07-20 Ã¢â‚¬â€ A10 Ãƒâ€” P-workflow-001 Ãƒâ€” ts2/ts3/ts5 (pass)

Enterprise checklist as merge gate at every size. Oracle 4/4 + /health. Security-minded reviewer role maps cleanly to Eng lead / QA lane. **A10 viable at 1/2/3/5.**

## 2026-07-20 Ã¢â‚¬â€ A05 Ãƒâ€” P-workflow-001 Ãƒâ€” ts2/ts3/ts5 (pass)

Adversarial review artifact required at each size; cross-review at ts2, dedicated QA at ts5. Oracle 4/4. **A05 viable at 1/2/3/5.**

## 2026-07-20 Ã¢â‚¬â€ A02 Ãƒâ€” P-workflow-001 Ãƒâ€” ts2/ts3/ts5 (pass)

PRD/ERD ownership splits cleanly across Product/Design lanes. Oracle 4/4. **A02 viable at 1/2/3/5.**

## 2026-07-20 Ã¢â‚¬â€ A08 Ãƒâ€” P-workflow-001 Ãƒâ€” ts2/ts3/ts5 (pass)

Research-gate before code; higher ceremony at ts5 but still green. Oracle 4/4. **A08 viable at 1/2/3/5.**

## 2026-07-20 Ã¢â‚¬â€ Wave-6 team-size complete

All finalists (A03, A10, A05, A02, A08) passed P-workflow-001 at team sizes 2/3/5 (size 1 prior). No team-fit failures. Ceremony increases with size; correctness holds.

**Scored auto-promote applied.** Product workflow: `docs/DEVELOPMENT_WORKFLOW.md`. Lab operators: `docs/USAGE_GUIDE.md`.

## 2026-07-20 Ã¢â‚¬â€ Portfolio model + clearpath smoke (pass)

**Reframe:** Experiments = build real products under `projects/`. Climb phases to sustain. Repeat.

- First product: **clearpath** (approvals/requests) under A03+A10
- Smoke phase oracle 5/5 (auth, CRUD, isolation, health)
- Work surface: `projects/clearpath` (committed), not sandbox
- Next: clearpath crud Ã¢â€ â€™ workflow Ã¢â€ â€™ integrate Ã¢â€ â€™ scale Ã¢â€ â€™ sustain; then ledgerlite, signalboard

## PROMOTE Ã¢â‚¬â€ A03 (primary default)


- **Use for:** schema-heavy APIs, RBAC, migrations, workflow logic, default backend work
- **Evidence:** strongest process signal (redÃ¢â€ â€™green); passed smoke Ã¢â€ â€™ crud Ã¢â€ â€™ workflow Ã¢â€ â€™ integrate Ã¢â€ â€™ scale; viable team sizes 1/2/3/5
- **Failure modes:** ceremony on tiny spikes (use A01); test drift if CI contracts neglected

## PROMOTE Ã¢â‚¬â€ A10 (enterprise alternate)

- **Use for:** security-sensitive, compliance, prod observability/migration gates from slice 1
- **Evidence:** checklist gate scales with review/QA lane; all tiers + team sizes pass
- **Failure modes:** friction on throwaway prototypes

## Documented finalists (not auto-default)

A02 (ERD-first), A05 (adversarial), A08 (research-gate) Ã¢â‚¬â€ viable all tiers; pick per project shape.

## Deprioritized

A09 swarm sim (solo agent overhead). A01/A04/A06 smoke-only or partial ladder. A07 partial ladder.

## 2026-07-20 Ã¢â‚¬â€ Post-ladder process complete

Failure tags standardized (`docs/FAIL_TAGS.md`). Replication default: **promoted-only** (A03 + A10 Ãƒâ€” P-smoke-001, 3 runs each). GitHub CLI verified for remote PR trails.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-smoke-001 Ãƒâ€” r2 (pass)

Replication run 2 of promoted primary. Test-first REDÃ¢â€ â€™GREEN; oracle 4/4. Matches r1 signal.

## 2026-07-20 Ã¢â‚¬â€ clearpath Ãƒâ€” P-crud-001 (pass)

Projects/tasks/comments with owner/member/viewer RBAC; SQLite + 2 migrations; smoke regression green. Oracle 3/3 + negatives. Next: workflow state machine on clearpath.

## 2026-07-20 Ã¢â‚¬â€ clearpath Ãƒâ€” P-workflow-001 (pass)

Approval state machine with audit + optimistic locking. Oracle 4/4; regression 12/12. Next: integrate.

## 2026-07-20 Ã¢â‚¬â€ clearpath Ãƒâ€” P-integrate-001 (pass)

Outbound mock payment + HMAC webhooks with idempotency. Oracle green; 502 on dependency failure. Next: scale.

## 2026-07-20 Ã¢â‚¬â€ clearpath Ãƒâ€” P-scale-001 (pass)

Keyset pagination + rate limits on request lists. Oracle green; 17/17 regression. Next: sustain.

## 2026-07-20 Ã¢â‚¬â€ clearpath sustained

Minimal UI + production path + migration rollback notes. Full suite 19/19. Next product: ledgerlite.

## 2026-07-20 Ã¢â‚¬â€ ledgerlite Ãƒâ€” P-smoke-001 (pass)

Second portfolio product. Entry CRUD + isolation; Clearpath patterns reused cleanly. Next: crud.

## 2026-07-20 Ã¢â‚¬â€ ledgerlite Ãƒâ€” P-crud-001 (pass)

Shared ledgers with RBAC + notes migration. Oracle 3/3; smoke regression green. Next: workflow.

## 2026-07-20 Ã¢â‚¬â€ ledgerlite Ãƒâ€” P-workflow-001 (pass)

Entry approval state machine + audit + optimistic locking. Next: integrate.

## 2026-07-20 Ã¢â‚¬â€ ledgerlite sustained

Integrate + scale + sustain green (19/19). Next product: signalboard (A03+A05).

## 2026-07-20 Ã¢â‚¬â€ signalboard Ãƒâ€” P-smoke-001 (pass)

A03+A05. Status CRUD + adversarial review artifact. Next: crud.

## 2026-07-20 Ã¢â‚¬â€ signalboard Ãƒâ€” P-crud-001 (pass)

Shared boards with RBAC + severity migration. Next: workflow.

## 2026-07-20 Ã¢â‚¬â€ signalboard sustained

Finish pack green (19/19) with A05 overlay. Portfolio products clearpath, ledgerlite, signalboard all sustained.

## 2026-07-20 Ã¢â‚¬â€ A03 Ãƒâ€” P-smoke-001 r3 (replication pass)

Independent sandbox rebuild; oracle 4/4. A03 triple-test complete (r1Ã¢â‚¬â€œr3 all pass). Next: A10 smoke r2.

## 2026-07-20 Ã¢â‚¬â€ A10 Ãƒâ€” P-smoke-001 r2 + r3 (replication pass)

Enterprise lite replications both green (oracle + health + checklist artifacts). A10 triple-test 3/3. Promoted defaults confirmed; replication wave complete.

## 2026-07-20 Ã¢â‚¬â€ kitcheck Ãƒâ€” P-smoke-001 (pass)

Fourth portfolio product (equipment loans). A03+A10. Oracle + health green. Next: crud (kits RBAC).

## 2026-07-20 Ã¢â‚¬â€ kitcheck Ãƒâ€” P-crud-001 (pass)

Shared kits RBAC + notes migration. Next: workflow.

## 2026-07-20 Ã¢â‚¬â€ kitcheck sustained

Finish pack green (19/19). Equipment checkout domain sustained. Next product: meetslot.

## 2026-07-20 Ã¢â‚¬â€ meetslot Ãƒâ€” P-smoke-001 (pass)

Fifth portfolio product (room bookings). Next: crud.

## 2026-07-20 Ã¢â‚¬â€ meetslot sustained

Finish pack green (19/19). Next: briefpad.

## 2026-07-20 Ã¢â‚¬â€ briefpad sustained

Sixth portfolio product. Notes + pads + publish workflow. 19/19.

## 2026-07-20 Ã¢â‚¬â€ clipvault sustained

Seventh portfolio product. Clips + vaults + publish workflow. 19/19. Next: formqueue.

## 2026-07-20 Ã¢â‚¬â€ formqueue sustained

Eighth portfolio product. Forms + queues + submit/review/close. 19/19. Next: tasklane.

## 2026-07-20 Ã¢â‚¬â€ tasklane sustained

Ninth portfolio product. Cards + lanes + todo/doing/done. 19/19. Next: invoicelink.

## 2026-07-20 Ã¢â‚¬â€ invoicelink sustained

Tenth portfolio product. Invoices + books + draft/sent/paid. 19/19. Next: guestpass.

## 2026-07-20 Ã¢â‚¬â€ guestpass sustained

Eleventh portfolio product. Passes + sites + request/approve/check-in. 19/19. Next: waitlist.

## 2026-07-20 Ã¢â‚¬â€ waitlist sustained

Twelfth portfolio product. Entries + lists + waiting/invited/joined. 19/19. Next: tipjar.

## 2026-07-20 Ã¢â‚¬â€ tipjar sustained

Thirteenth portfolio product. Tips + jars + pledge/collect/thank. 19/19. Next: shiftboard.

## 2026-07-20 Ã¢â‚¬â€ shiftboard sustained

Fourteenth portfolio product. Shifts + crews + open/fill/complete. 19/19. Next: relaydesk.

## 2026-07-20 Ã¢â‚¬â€ relaydesk sustained

Fifteenth portfolio product. Tickets + desks + triage/start/resolve. 19/19. Next: lostfound.

## 2026-07-20 Ã¢â‚¬â€ lostfound sustained

Sixteenth portfolio product. Items + hubs + report/claim/reunite. 19/19. Next: pantrybox.

## 2026-07-20 Ã¢â‚¬â€ pantrybox sustained

Seventeenth portfolio product. Stocks + pantries + list/reserve/pickup. 19/19. Next: carpool.

## 2026-07-20 Ã¢â‚¬â€ carpool sustained

Eighteenth portfolio product. Rides + routes + offer/book/finish. 19/19. Next: petcare.

## 2026-07-20 Ã¢â‚¬â€ petcare sustained

Nineteenth portfolio product. Visits + kennels + schedule/admit/release. 19/19. Next: libraryloan.

## 2026-07-20 Ã¢â‚¬â€ libraryloan sustained

Twentieth portfolio product. Loans + branches + hold/checkout/checkin. 19/19. Next: classroster.

## 2026-07-20 Ã¢â‚¬â€ classroster sustained

Twenty-first portfolio product. Seats + cohorts + enroll/attend/graduate. 19/19. Next: homefix.

## 2026-07-20 Ã¢â‚¬â€ homefix sustained

Twenty-second portfolio product. Jobs + properties + request/schedule/finish. 19/19. Next: farmshare.

## 2026-07-20 Ã¢â‚¬â€ farmshare sustained

Twenty-third portfolio product. Shares + farms + list/claim/deliver. 19/19. Next: eventpass.

## 2026-07-20 Ã¢â‚¬â€ eventpass sustained

Twenty-fourth portfolio product. Tickets + events + reserve/issue/scan. 19/19. Next: blooddrive.

## 2026-07-20 Ã¢â‚¬â€ blooddrive sustained

Twenty-fifth portfolio product. Donations + drives + book/screen/donate. 19/19. Next: toolcrib.

## 2026-07-20 Ã¢â‚¬â€ toolcrib sustained

Twenty-sixth portfolio product. Tools + cribs + stock/checkout/checkin. 19/19. Next: mealplan.

## 2026-07-20 Ã¢â‚¬â€ mealplan sustained

Twenty-seventh portfolio product. Meals + kitchens + plan/prep/serve. 19/19. Next: bikehub.

## 2026-07-20 Ã¢â‚¬â€ bikehub sustained

Twenty-eighth portfolio product. Bikes + hubs + dock/rent/redock. 19/19. Next: plantcare.

## 2026-07-20 Ã¢â‚¬â€ plantcare sustained

Twenty-ninth portfolio product. Plants + gardens + seed/grow/harvest. 19/19. Next: coworkdesk.

## 2026-07-20 Ã¢â‚¬â€ coworkdesk sustained

Thirtieth portfolio product. Desks + spaces + open/occupy/clear. 19/19. Next: parceldrop.

## 2026-07-20 Ã¢â‚¬â€ parceldrop sustained

Thirty-first portfolio product. Parcels + lockers + arrive/notify/pickup. 19/19. Next: tutorbook.

## 2026-07-20 Ã¢â‚¬â€ tutorbook sustained

Thirty-second portfolio product. Lessons + studios + book/teach/review. 19/19. Next: laundryloop.

## 2026-07-20 Ã¢â‚¬â€ laundryloop sustained

Thirty-third portfolio product. Loads + rooms + queue/wash/dry. 19/19. Next: photobooth.

## 2026-07-20 Ã¢â‚¬â€ photobooth + keyfob sustained

Thirty-fourth and thirty-fifth portfolio products. Sessions + booths + ready/shoot/print; fobs + buildings + issue/activate/revoke. Both 19/19. Next: lockerbay.

## 2026-07-20 â€” dockslip + cafeorder sustained

Thirty-eighth and thirty-ninth portfolio products. Both 19/19. Next: rinkpass.

## 2026-07-20 — trailcamp + artloan sustained

Forty-second and forty-third portfolio products. Both 19/19. Next: fleetbay.
