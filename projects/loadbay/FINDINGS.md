# Loadbay Findings

## What we built
Bays (ACL) + docks (capacity) + loads (`staged→sealed→departed`) + dual checker seals + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/capacity gate/dual-seal path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Capacity gate is a clear cross-entity constraint (dock max vs load weight).
- Dual seal reuses the dual-control pattern from policyforge/fleetledger.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
