# ptax4975 — value / stakes honesty

Research only. `current_idea` under hours hold. Fixture count is not value.

## What we can cite as primary

| Rule | Cite | Stakes shape |
|------|------|--------------|
| Initial tax | 26 U.S.C. § 4975(a) | 15% of amount involved × each year/part in taxable period |
| Additional tax | § 4975(b) | 100% of amount involved if not corrected |
| Amount involved | § 4975(f)(4) | Greater of money/FMV given or received; (b) uses highest FMV during period |

See `ptax4975-STATUTE-CITATIONS.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-TAXABLE-PERIOD-FENCE.md`.

## Worked dollar story (illustrative)

| Input | Value |
|------:|------:|
| Amount involved | $10,000 |
| Year-parts | 2 |
| Corrected | true |
| Initial tax | **$3,000** |
| Additional | $0 |
| Total | **$3,000** |

Same facts, uncorrected → additional **$10,000**, total **$13,000**.

Flat “15% once” would show **$1,500** — a **$1,500** understatement vs corrected two-year path alone.

## Hard finding (do not bury)

1. **Kill A stands.** Counsel and tax software already compute § 4975.
2. **v0 does not encode highest-FMV-during-period** for the second tier — fence in `ptax4975-FMV-FENCE.md`.
3. Taxable-period end dates (notice / assessment / correction) are caller-supplied year-parts in v0 — `ptax4975-TAXABLE-PERIOD-FENCE.md`.

## Decision impact

Survive only as **excise-shape forecast experiment**. Flip only after hour-status `FLIP_PATH_READY`.
