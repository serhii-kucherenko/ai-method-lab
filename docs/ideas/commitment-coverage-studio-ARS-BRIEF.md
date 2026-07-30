# Commitment Coverage Studio — ARS brief

Idea-first FinOps wedge (BACKLOG prefer: literal-dollar / FinOps).  
Related: `docs/ideas/commitment-coverage-studio-RELATED-WORKS.json` (OpenAlex/arXiv; no Anthropic).  
Protocol: `protocols/ARS_PAPER_RESEARCH.md`.

## Job to be done

Cloud FinOps leads need to see **where committed discounts (Savings Plans / RIs / CUDs) are under-covered or wasted** versus on-demand spill - in dollars - before the monthly bill lands.

## Unique claim (vs prior lab products)

| Prior | Why different |
|-------|----------------|
| Idle Seat Studio | SaaS seat waste, not cloud commit coverage |
| True Up Studio | Vendor license true-up, not SP/RI coverage |
| Eval Budget / Prompt Cache | LLM spend, not infra commitment inventory |
| Service Credit | SLA credits outbound, not commit utilization |

**Claim:** If we remove **commitment inventory ↔ usage matching → $ coverage gap**, the remainder is a generic cost dashboard (isomorphic to every FinOps chart).

## Related landscape (grounded)

FinOps / cloud cost optimization papers and case studies in RELATED-WORKS JSON (e.g. FinOps framework case study; usage-based workload segmentation; data-cost FinOps). Use those URLs only - no invented vendors-as-papers.

## Buyer / money

- **Buyer:** Cloud FinOps / platform leads at mid-market+ AWS/GCP/Azure shops  
- **Money:** seats on coverage console + connected-account usage  
- **PMF signal:** finance already owns commitment renewals; gap reports change buy/renew decisions

## Software-solvable gate

Yes - ingest billing/CUR-like exports + commitment inventory; compute coverage; no devices/clinical/wet-lab.

## Falsifiers

1. Buyers stay in native cloud consoles and never import commitments here  
2. Coverage math disagrees with finance’s spreadsheet in ≥2 real accounts → trust death

## Recommendation

Score under biz-rubric-v2 before any climb. Prefer as **next A/B candidate** while Rubric Compiler remains complete. Do not noun-swap Idle Seat.
