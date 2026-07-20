# Fleetledger Findings

## What we built
Fleets (ACL) + assets (service interval) + work orders (`open→parts→closed`) + dual mechanic sign-off + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules unit tests + health/ACL/overdue gate/dual-signoff path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Overdue interval gate is a real cross-entity constraint (asset interval vs WO hours).
- Dual sign-off reuses the policyforge dual-approval pattern in an ops domain.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`). Dual-control remains a high-signal pattern.
