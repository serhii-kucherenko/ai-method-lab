# Bondrail Findings

## What we built
Workspaces (ACL) + bonds (collateral/floor) + draws (`requested→held→released`) + dual treasurer release + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/floor gate/dual-release path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Collateral floor headroom is a clear money-domain cross-entity gate.
- Dual treasurer release continues the dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
