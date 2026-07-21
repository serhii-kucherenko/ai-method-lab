# tariffstep — idea dossier

**State:** `testable`  
**Framing:** method stress (not GTM vs utility CIS / Lodestar)  
**Opened:** 2026-07-21 after bondstrip sustain

## Problem (G1)

Utility billing ops walk metered kWh through **stepped rate blocks** and apply a **demand ratchet** (billing demand = max(current peak, prior peak × ratchet %)). Spreadsheet block walks drift from tariff sheets.

**Named user:** utility rate analyst / CIS config tester.  
**Frequency:** every bill cycle / tariff change.

## Unique claim (G2)

**If we remove stepped block walk + demand ratchet, the remaining product is a generic meter reading FSM.**

Distinct from settlecut (single-interval loss×imbalance once) and bondstrip (coupon day-count).

## Kill rounds (G3)

1. Kill A — CIS / Lodestar exist → stands for GTM; method stress OK  
2. Kill B — niche tariff QA — soft; partially reduced by recurring case map  
3. Kill C — regulatory tariff PDF offline — partially valid; math kernel still checkable  

## Progress

- Paper algorithm written (`tariffstep-algorithm.md`)
- Fixture suite expanded to A–Y (25) green via `check-tariffstep-fixtures.mjs`
- Challenges A/B/C recorded
- G5 and G6 docs drafted

## Decision

**`testable`** — research only. No `projects/tariffstep/` until `ready_to_build`.
