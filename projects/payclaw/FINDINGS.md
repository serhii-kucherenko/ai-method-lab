# Payclaw Findings

## What we built
Firms (ACL) + payroll runs (owed/paid) + clawbacks (`requested→held→released`) + dual HR release + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/overpay gate/dual-release path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Overpay headroom is a clear payroll-domain cross-entity gate.
- Dual HR release continues the dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
