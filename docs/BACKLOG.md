# Experiment backlog

Prioritized candidates for the matrix. Promote into `matrix/EXPERIMENT_PLAN.md` only when ready to run.

## Queued (autonomous)

| Priority | Product idea | Method | Notes |
| --- | --- | --- | --- |
| 1 | claimdesk | A03 + A10 | Multi-party insurance claims: filed→review→settled; adjuster/claimant ACL; evidence attachments; audit. |
| 2 | releasetrain | A03 + A10 | Software release train: planned→staging→prod; change approvals; rollback; deploy webhooks. |
| 3 | tentcamp | A03 + A10 | Tent pitches (deferred clone-tier; only after comprehensive wave). |

## Harness / method meta (run between products when findings stall)

| Priority | Work | Notes |
| --- | --- | --- |
| H1 | Harness loop audit | `protocols/HARNESS_LOOP.md` — oracle immutability, cell schema, triple-test, flake budget |
| H2 | Frameworks publish | `docs/FRAMEWORKS.md` — proven patterns from portfolio |
| H3 | Replication spot-check | Triple-test A03 on P-smoke for screenlane after sustain |

## Recently completed (portfolio)

| Product | Method | Outcome |
| --- | --- | --- |
| screenlane | A03 + A10 | P-sustain — 18/18; multi-aggregate hiring boards |
| gardenplot | A03 + A10 | P-sustain — 19/19 |
| radiohour | A03 + A10 | P-sustain — 19/19 |
| chessclub | A03 + A10 | P-sustain — 19/19 |
| darkroom | A03 + A10 | P-sustain — 19/19 |
| surfboard | A03 + A10 | P-sustain — 19/19 |
| potterystudio | A03 + A10 | P-sustain — 19/19 |

See `projects/PORTFOLIO.md` for the full active set.

## Portfolio strategy (2026-07-20 pivot)

Stop optimizing for count of tiny state-machine clones. Prefer products that force:

1. **Multiple aggregates** (not one entity + 3 statuses)
2. **Cross-entity rules** (ACL + scorecards + workflow together)
3. **Production shape** (migrations, health, threats, webhooks, rate limits, UI)
4. **Repeatable harness evidence** (deterministic tests, cell schema, FINDINGS with frameworks)

Icebox clone deferred behind comprehensive wave.
