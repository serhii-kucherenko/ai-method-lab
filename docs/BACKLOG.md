# Experiment backlog

Prioritized candidates for the matrix. Promote into `matrix/EXPERIMENT_PLAN.md` only when ready to run.

## Queued (autonomous)

| Priority | Product idea | Method | Notes |
| --- | --- | --- | --- |
| 1 | **releasetrain** | A03 + A10 | Software release train: planned→staging→prod; dual approval; rollback; deploy webhooks. |
| 2 | tentcamp | A03 + A10 | Tent pitches (deferred clone-tier; only after comprehensive wave). |

## Recently completed (portfolio)

| Product | Method | Outcome |
| --- | --- | --- |
| claimdesk | A03 + A10 | P-sustain — 17/17; multi-party claims + payout rules |
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
