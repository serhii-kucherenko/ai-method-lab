# tariffstep — G5 depth test outline (guide)

Goal: prove block-walk + demand-ratchet behavior is correct, reject malformed tariff inputs, and resist spreadsheet-style shortcuts.

## How to run

1. Add/edit fixture JSON in `docs/ideas/fixtures/tariffstep-*.json`
2. Run:

```text
node docs/ideas/check-tariffstep-fixtures.mjs
```

3. Confirm green count and inspect failures for math drift.

## Case map (A–Y, 25 total)

### 1) Happy-path tariff math

- A base 3-block walk
- H exact first breakpoint
- I exact second breakpoint
- J tail usage into open-ended block
- N custom two-block tariff
- O decimal rates / decimal usage
- Y very large usage stress

### 2) Ratchet behavior

- B ratchet binds over current peak
- K ratchet equals current peak
- L ratchet at 100%
- M tiny ratchet with large prior peak
- W high demand-rate sensitivity
- X low demand-rate sensitivity

### 3) Boundaries

- G zero-kWh / zero-peak
- C crossing into top block

### 4) Reject paths (data hygiene / safety)

- D empty block schedule
- E unsorted breakpoints
- F ratchet above 1.0
- P negative usage
- Q negative peak
- R zero ratchet
- S ratchet > 1
- T negative block rate
- U duplicate breakpoint
- V open-ended block placed before later finite block (reject unsorted model)

## Expert-judged cheat scenarios

- Flat-average-rate shortcut should diverge from stepped block walk (C/J/Y)
- Ignoring prior-peak ratchet should diverge from billed demand (B/L)

## Gate note

G5 threshold met: 25 named cases. Keep expanding only if a new invariant appears.
