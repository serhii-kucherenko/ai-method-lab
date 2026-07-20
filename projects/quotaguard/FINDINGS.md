# Quotaguard Findings

## What we built
Orgs (ACL) + quotas (ceiling) + charges (`requested→held→released`) + dual finance release + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/ceiling gate/dual-release path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Ceiling is a clear cross-entity money constraint (quota cap vs outstanding charges).
- Dual finance release reuses dual-control without a noun-swap FSM.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
