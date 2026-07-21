# bondstrip — idea dossier

**State:** `framed`  
**Framing:** method stress (not GTM vs Bloomberg/Yield Book)  
**Opened:** 2026-07-21 after settlecut sustain

## Problem (G1 draft)

Fixed-income desks must strip a coupon bond into principal + coupon cashflows with day-count conventions (ACT/ACT, 30/360) and settle accrued interest correctly across period boundaries.

## Unique claim (G2 candidate)

**If we remove day-count + accrued + cashflow-strip math, the remaining product is a generic calendar FSM.**

## Decision

**`framed`** — research only. No product until `ready_to_build`.
