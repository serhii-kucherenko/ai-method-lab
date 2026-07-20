# Stockrail Findings

## What we built
Stores (ACL) + SKUs + adjustments (`drafted→staged→applied`) + no-negative stock gate + dual manager approval + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/no-negative/dual-approve path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Non-negative inventory is a clear cross-entity gate (SKU qty vs adjustment delta).
- Dual manager approval reuses dual-control without a noun-swap FSM.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
