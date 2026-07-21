# lotblast paper fixtures (adversarial)

Expected blast cardinalities before any code. If a future implementation disagrees, the idea or the impl is wrong — do not “fix” the fixture silently.

## Fixture A — Shared ingredient expands blast

```text
ING-A ──transform──► BAT-1 ──pack/transform──► FG-1 ──ship──► Partner-P1
       └─transform──► BAT-2 ──pack/transform──► FG-2 ──ship──► Partner-P2

ING-B ──transform──► BAT-3 ──pack/transform──► FG-3 ──ship──► Partner-P3
```

Suspect: `ING-A`

| Metric | Expected |
|--------|----------|
| finished TLCs in blast | `{FG-1, FG-2}` (not FG-3) |
| shipments | 2 (to P1, P2) |
| notify partners | `{P1, P2}` |
| transformation rows in export mentioning ING-A | ≥2 |

Control: suspect `ING-B` → only `{FG-3}`, partner `{P3}`.

## Fixture B — Diamond DAG (visit once)

```text
        ┌──► MID-1 ──┐
ROOT-X ─┤            ├──► FG-D ──ship──► Partner-Q
        └──► MID-2 ──┘
```

Suspect: `ROOT-X`

| Metric | Expected |
|--------|----------|
| finished TLCs | `{FG-D}` once (no duplicate) |
| path count in traversal log (optional) | 2 paths, 1 unique FG |
| notify partners | `{Q}` |

Fail if export lists `FG-D` twice as two blast members.

## Fixture C — Partial ship / units in channel

```text
FG-C qty produced = 100 cases
  ship S1: 40 → Partner-R1
  ship S2: 25 → Partner-R2
  remaining in warehouse = 35
```

Suspect: upstream ingredient that reaches only `FG-C`

| Metric | Expected |
|--------|----------|
| finished TLCs | `{FG-C}` |
| shipments in blast | `{S1, S2}` |
| `units_in_channel` | **35** (not 100, not 65) |
| notify partners | `{R1, R2}` |

Fail if blast uses produced qty instead of unshipped remainder for in-channel.

## How these kill shallow impls

| Shortcut | Broken fixture |
|----------|----------------|
| Status FSM + dual approve, no graph | A/B/C all |
| Single `parent_id` without multi-consume | A (shared), B (diamond) |
| Blast = “all lots in plant” | A control |
| In-channel = produced qty | C |

## Status

Paper + golden JSON under `docs/ideas/fixtures/`. Next: draft product brief outline OR expert kill on Fixture A cardinalities — still no `projects/lotblast/`.
