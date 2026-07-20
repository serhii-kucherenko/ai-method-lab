# Riskhold Findings

## What we built
Books (ACL) + positions + risk-limit breach hold + dual risk officer clear + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/breach gate/dual-clear path/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Breach gate is a clear cross-field constraint (exposure vs risk limit).
- Dual officer clear continues the dual-control pattern in a risk domain.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
