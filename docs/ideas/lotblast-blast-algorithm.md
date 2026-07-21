# lotblast blast algorithm (paper)

Deterministic rules any future impl must match. Fixtures A/B/C are the acceptance oracles for this doc.

## Graph model

- **Node:** lot identified by immutable `tlc`
- **Edge (consume):** transformation uses `from_tlc` quantity → produces `to_tlc`
- **Shipment:** attaches to a finished (or any) `tlc` with `qty` and `partner`
- Graph must be a **DAG** on consume edges (cycle ⇒ reject write)

## Forward blast(suspect)

```
visited := empty set
queue := [suspect]
while queue not empty:
  tlc := pop
  if tlc in visited: continue
  add tlc to visited
  for each consume edge where from_tlc == tlc:
    enqueue to_tlc
finished := { t in visited | t has no outgoing consume OR marked finished_good }
shipments := all shipments whose tlc ∈ visited
notify := unique partners of those shipments
units_in_channel(t) := produced_qty(t) - sum(ship_qty for shipments of t)
units_in_channel_total := sum units_in_channel(t) for t in finished
```

### Required properties

1. **Determinism:** same graph ⇒ same finished set, shipment set, notify set, channel units
2. **Idempotent membership:** each finished TLC appears once (Fixture B)
3. **Shared expansion:** one input used in N transforms reaches all N downstream finished lots (Fixture A)
4. **Isolation:** unrelated ingredient trees never enter blast (Fixture A control)
5. **Channel math:** partial ships reduce in-channel; never use produced qty as channel (Fixture C)
6. **No status FSM substitute:** blast ignores lot “status” enums; only edges + shipments matter

## Backward trace(finished)

```
visited := empty
queue := [finished]
while queue not empty:
  tlc := pop
  if tlc in visited: continue
  add tlc to visited
  for each consume edge where to_tlc == tlc:
    enqueue from_tlc
return visited \ {finished}  // inputs
```

## Mock recall

1. Compute forward blast(suspect)
2. Persist snapshot of visited + shipments + export sheets
3. **Lock:** reject CTE writes that mutate any lot in visited (or any edge touching them)
4. Export must include every CTE row whose TLC ∈ visited (test #30)

## Mass vs membership (Kill D)

Blast **membership** (which TLCs are reachable) is independent of **mass balance**.

- Optional `scrap` / `yield_loss` qty on a transform may explain why input kg ≠ output kg.
- Forward blast still follows edges even when mass does not conserve.
- **Forbidden:** inferring “not affected” because quantities don’t add up; **forbidden:** requiring perfect mass balance to compute blast.

Fixture note: A/B/C currently ignore scrap; a future Fixture D should include scrap on one edge without changing finished membership.


| Impl shortcut | Broken property |
|---------------|-----------------|
| `lot.parent_id` single parent only | Fixture A multi-consume / B diamond inputs |
| BFS without visited set | Fixture B duplicates |
| “all lots in plant” | Fixture A control |
| Status field `recalled=true` cascade | ignores real edges |
| Dual-approve before blast | irrelevant to genealogy correctness |

## Status

Paper algorithm. Pair with golden JSON fixtures. Still no product code.
