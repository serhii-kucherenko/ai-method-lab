# lesserof — try-demo audit (research tick 5)

Research only. Hours hold still open (~0.5h of 4h at write). No product folder.

## Question

Does `demos/lesserof-try/try.html` match the paper oracle (`check-lesserof-fixtures.mjs`) on the honesty surfaces we care about?

## Checks

| Surface | Demo | Fixture oracle | Result |
|---------|------|----------------|--------|
| Substitution bind $10k / $4k → $3,960 | Default submit | A | **Match** |
| Naive overclaim +$5,940 | Shown as overclaim_if_naive | VALUE-STAKES | **Match** |
| Direct-ID → 99% of paid (no lesser-of) | claim_type direct_id | B | **Match** |
| Force lesser-of on direct-ID | Cheat checkbox → reject | H | **Match** |
| Skip lesser-of on substitution | Cheat checkbox → reject | I | **Match** |
| Basket other → reject | Checkbox → reject | D | **Match** |
| USMCA on direct-ID → reject | apply_usmca + direct_id | V | **Match** |
| USMCA partner 0 wipe after TFTEA | apply_usmca + partner 0 → $0 | C | **Match** |
| Kill A copy | Disclaimer present | PRODUCT-FRAMING | **Match** |
| Same-condition out of scope | Disclaimer cites SAME-CONDITION-FENCE | fence doc | **Match** (tick 11) |

## Algorithm paper drift (fixed this tick)

`lesserof-algorithm.md` had recoverable = raw `usmca_cap` without stating the **×0.99** step. Fixtures and demo both do `0.99 * base` then optional `min(..., 0.99 * partner)`. Paper updated to match the oracle.

## Decision

Try demo is honest enough for digests during the hours hold. Still **not** a product; still **not** `ready_to_build`.

## Explicit non-actions

No `projects/lesserof/`. Do not treat demo green as market proof.
