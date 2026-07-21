# ptax4975 — G1 evidence pack (seed deepen)

Research only. Not framed. Last in the activation queue after oshamult.

## Named user + frequency

| Who | How often | Pain today |
|-----|-----------|------------|
| Plan counsel / tax ops modeling prohibited-transaction excise | Per transaction / taxable period | Spreadsheets take a flat 15% once, skip the 100% additional tax when uncorrected, or understate amount involved vs greater-of FMV |

## Primary stakes

| Cite | What it forces |
|------|----------------|
| 26 U.S.C. § 4975(a) | Initial tax = **15%** of amount involved × each year/part in the taxable period |
| 26 U.S.C. § 4975(b) | Additional tax = **100%** of amount involved if not corrected |
| 26 U.S.C. § 4975(f)(4) | Amount involved = greater of money/FMV given or received; (b) uses highest FMV during period |

Paper: `ptax4975-STATUTE-CITATIONS.md`, `ptax4975-FMV-FENCE.md`, `ptax4975-algorithm.md`

## Worked dollar toys

| Facts | Result |
|-------|--------|
| $10,000 × 2 year-parts, corrected | Initial **$3,000**, total **$3,000** |
| Same, uncorrected | Initial **$3,000** + additional **$10,000** = **$13,000** |
| Flat “15% once” cheat | Shows **$1,500** — understates corrected path by **$1,500** |

## Honest residuals

1. Kill A stands — counsel and tax software already compute § 4975.  
2. v0 does not fully encode highest-FMV-during-period for the second tier.  
3. Dual-approver costumes are rejects.  
4. Not activated while earlier seeds hold the queue.

## Decision impact

Survive as excise-shape forecast experiment only. Research demo: `demos/ptax4975-try/try.html`.
