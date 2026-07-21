# Captable Findings

## What we built
Firms (ACL) + rounds (authorized) + allocations (`proposed→held→closed`) + dual counsel close + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/oversubscribe gate/dual-close path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Authorized-share headroom is a clear equity-domain cross-entity gate.
- Dual counsel close continues the dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
