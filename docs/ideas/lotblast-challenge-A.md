# Adversarial challenge — Fixture A

Challenger role ≠ author. Goal: break expected cardinalities or expose underspecification before code.

Fixture: `docs/ideas/fixtures/lotblast-A-shared-ingredient.json`

## Manual walk — suspect ING-A

| Step | Queue / action | Visited |
|------|----------------|---------|
| 0 | start ING-A | {ING-A} |
| 1 | edges ING-A→BAT-1, ING-A→BAT-2 | {ING-A, BAT-1, BAT-2} |
| 2 | BAT-1→FG-1, BAT-2→FG-2 | {ING-A, BAT-1, BAT-2, FG-1, FG-2} |
| 3 | FG-1/FG-2 no outgoing consume | done |

Shipments with tlc ∈ visited: S-P1, S-P2. Notify: P1, P2.  
**Matches expect.** Control ING-B → {ING-B, BAT-3, FG-3} / S-P3 / P3. **Matches.**

## Attacks

### A1 — Leftover unused ingredient mass

ING-A has qty 200; only 100 kg consumed (50+50). Attack: “unused 100 kg means blast incomplete / should include warehouse hold as finished.”

**Ruling:** Unused remainder is **not** a finished TLC and **not** a shipment. Blast membership follows edges only. Remaining ING-A inventory may appear in export as the suspect lot row, but does not add partners.  
**Spec fix:** Algorithm must state leftovers never invent nodes.

### A2 — Intermediate as “finished”

Attack: BAT-1 has no ship; treat intermediates with no outgoing consume as finished → expect would need BAT-1, BAT-2 in finished_tlcs.

**Ruling:** Fixture marks `kind: finished` explicitly. Algorithm’s “no outgoing consume OR marked finished_good” is **ambiguous** and would fail A if BAT nodes were leaf without kind.

**Spec fix:** Prefer explicit `kind == finished` (or equivalent flag). “No outgoing consume” alone is insufficient when intermediates can sit unused.

### A3 — Commingled shared equipment (no edge)

Attack: BAT-3 ran on same line after BAT-1; practitioner expands blast by sanitation/campaign, not genealogy.

**Ruling:** Out of graph scope for v1. Document as **known non-goal**. If we later model campaign/line contamination, that is a new edge type — not silent expansion. Kill C adjacent: offline judgment starts from genealogy pack, may widen manually.

### A4 — Partial consume of FG into another transform

Not in Fixture A. Noted for Fixture E later: finished used as input must leave finished set for forward blast from upstream? Actually if FG-1 feeds FG-X, forward from ING-A should include FG-X. Current A has no such edge — OK.

### A5 — Partner notify on zero qty ship

Not in A. Skip.

## Outcome

| Attack | Breaks expect? | Action |
|--------|----------------|--------|
| A1 leftover mass | No | Clarify leftovers |
| A2 finished definition | **Would** if kinds ignored | Tighten finished = explicit kind |
| A3 line contamination | N/A (non-goal) | Record non-goal |
| A4/A5 | N/A | Future fixtures |

**Verdict:** Fixture A cardinalities hold under clarified algorithm. Idea remains **do not build** — challenge raises spec debt, not green light.

## Remaining before ready_to_build

1. Apply finished-kind clarification to algorithm (this tick)
2. Optional Fixture E: finished lot consumed into further transform
3. Still no product code
