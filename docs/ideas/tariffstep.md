# tariffstep — idea dossier

**State:** `framed`  
**Framing:** method stress (not GTM vs utility CIS / Lodestar)  
**Opened:** 2026-07-21 after bondstrip sustain

## Problem (G1)

Utility billing ops walk metered kWh through **stepped rate blocks** and apply a **demand ratchet** (billing demand = max(current peak, prior peak × ratchet %)). Spreadsheet block walks drift from tariff sheets.

**Named user:** utility rate analyst / CIS config tester.  
**Frequency:** every bill cycle / tariff change.

## Unique claim (G2)

**If we remove stepped block walk + demand ratchet, the remaining product is a generic meter reading FSM.**

Distinct from settlecut (single-interval loss×imbalance once) and bondstrip (coupon day-count).

## Kill rounds (G3) — draft

1. Kill A — CIS / Lodestar exist → stands for GTM; method stress OK  
2. Kill B — niche tariff QA — soft  
3. Kill C — regulatory tariff PDF offline — math still checkable  

## Decision

**`framed`** — research only. No `projects/tariffstep/` until `ready_to_build`.
