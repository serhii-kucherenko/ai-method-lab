# ptax4975

## Unique claim

Forecast IRC § 4975 prohibited-transaction excise as **15% × year-parts** (first tier) then **100%** additional tax if uncorrected, with optional greater-of fair-value amount resolution — against golden fixtures.

## Kill A honesty

Tax counsel and existing software already handle prohibited-transaction excise. This product is a **forecast / method experiment**, not a Form 5330 filing system or IRS / DOL replacement.

## Forecast shape

API returns `initial_tax`, `additional_tax`, and `total` (never a single flat-excise field as the happy path).

## Forbidden claims

1. Files Form 5330 / replaces IRS / DOL / counsel
2. Flat “15% once” as the happy path
3. Silent highest-FMV-during-period parity (`ptax4975-FMV-FENCE.md`)
4. Silent automatic taxable-period end dates (`ptax4975-TAXABLE-PERIOD-FENCE.md`)
5. Silent automatic excess-compensation narrowing (`ptax4975-EXCESS-COMP-FENCE.md`)
6. Fixture pass counts as market proof
7. Dual-approval gates as the unique domain rule

## Worked toys (illustrative)

| Story | Result |
|-------|--------|
| $10k × 2 year-parts, corrected | initial **$3,000**, additional $0 |
| Same facts, uncorrected | total **$13,000** |
| Flat “15% once” | **$1,500** — understates the corrected two-year path |

Label as forecast toys in digests — never as filed returns.

## Method experiment

Standard build workflow ladder under `projects/ptax4975/`. Consultants still win commercially.
