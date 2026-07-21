# Adversarial challenge — Fixtures B & C

## Fixture B (diamond)

Manual: ROOT-X → MID-1, MID-2 → FG-D (two inputs). Visited unique; finished = {FG-D} once; notify {Q}.

| Attack | Ruling |
|--------|--------|
| Count FG-D twice (one per path) | Fail impl — cardinality must be 1 |
| MID-1/MID-2 as finished (no outgoing after… they have outgoing) | N/A |
| Require path_count in product API | Optional diagnostic only; not blast membership |

**Verdict:** Expect holds. No spec change.

## Fixture C (partial ship)

100 produced − 40 − 25 = **35** in channel. Notify {R1, R2}.

| Attack | Ruling |
|--------|--------|
| In-channel = produced (100) | Forbidden |
| In-channel = shipped sum (65) | Forbidden — that is left plant, not channel |
| Overship (> produced) | Future reject-on-write; not in C |

**Verdict:** Expect holds. No spec change.

## Reference checker

`docs/ideas/check-fixtures.mjs` executes the paper algorithm against all golden JSON fixtures. Research-only — not `projects/lotblast/`.

**Loop tick finding:** Fixture E failed first run — channel math omitted qty re-consumed as transform input. Algorithm + checker updated: `in_channel = produced − shipped − consumed_as_input`.
