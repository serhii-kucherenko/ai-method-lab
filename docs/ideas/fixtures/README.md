# lotblast golden fixtures (JSON)

Machine-checkable paper oracles for blast cardinalities. Still **research only** — not product tests.

| File | Covers |
|------|--------|
| `lotblast-A-shared-ingredient.json` | Shared vs control ingredient expansion |
| `lotblast-B-diamond.json` | Diamond DAG unique finished TLC |
| `lotblast-C-partial-ship.json` | In-channel = produced − shipped |
| `lotblast-D-scrap-membership.json` | Scrap/yield loss does not shrink blast membership |
| `lotblast-E-finished-as-input.json` | Finished lot used as input still pulls further finished lots |
| `lotblast-F-concurrent-overconsume.json` | Second full consume of same input must reject |

Narrative: `docs/ideas/lotblast-fixtures.md`.

When (and only when) approaching `ready_to_build`, these become the first RED oracle inputs — not before.
