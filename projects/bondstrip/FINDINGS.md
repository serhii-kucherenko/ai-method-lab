# Bondstrip findings

## Status

**Sustained** through smoke → crud → workflow → integrate → scale under A03+A10 (31 tests).

## Framing

Method stress, not GTM. Kill A (Bloomberg/Yield Book exist) stands commercially.

## Unique claim held

- Accrued = `periodic × (days_elapsed / days_in_period)` under 30/360 or ACT/ACT
- Cashflow strip: remaining coupons + face at maturity
- Reject unknown day-count, bad freq, settle after maturity
- Rejected strips cannot be confirmed

## Method stress takeaway

A03+A10 can sustain a **day-count accrued + strip** product without dual-gate collapse.
