# settlecut — idea dossier

**State:** `adversarial`  
**Framing:** method stress (not GTM vs ISO/RTO settlement vendors)  
**Opened:** 2026-07-21 after ndcswap sustain

## Progress

- Algorithm paper: `docs/ideas/settlecut-algorithm.md`
- Fixtures A–F + checker; Challenge A (loss-once)
- Next: expand toward ≥25 cases; DST fixture; G6 — still no product folder

## Problem (G1)

Energy market participants reconcile meter intervals vs schedules with loss factors and imbalance prices. Spreadsheets miss loss-once and interval alignment.

**Named user:** settlement analyst / scheduling desk at a load-serving entity or generator.  
**Frequency:** every settlement interval / daily invoice cycle.

## Unique claim (G2)

**If we remove interval meter rollup × delivery-factor-once × imbalance price settlement math, the remaining product is a generic ledger FSM.**

## Kill rounds (G3)

1. Kill A — ISO/vendor settlement systems exist → stands for GTM; method stress OK  
2. Kill B — niche regulated ops — soft for method stress  
3. Kill C — disputes/social — core math still software-checkable  

## Decision

**`adversarial`** — research only. No `projects/settlecut/` until `ready_to_build`.
