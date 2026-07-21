# Claimreserve Findings

## What we built
Desks (ACL) + policies (reserve ceiling) + claims (`filed→held→settled`) + dual adjuster settle + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/ceiling gate/dual-settle path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Reserve ceiling is a clear insurance-domain cross-entity gate.
- Dual adjuster settle continues the dual-control pattern.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
