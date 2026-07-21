# Escrowrail Findings

## What we built
Workspaces (ACL) + accounts (balance/floor) + disbursements (`requested→held→released`) + dual escrow officer release + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/floor gate/dual-release path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Balance-floor headroom is a clear money-domain cross-entity gate.
- Dual escrow officer release continues the dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
