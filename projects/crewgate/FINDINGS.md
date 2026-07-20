# Crewgate Findings

## What we built
Sites (ACL + overtime limit) + crews + shifts (`open→active→closed`) + dual supervisor approval for overtime closes + HMAC webhooks + pagination + rate limits + UI.

## What we tested
Rules + health/ACL/overtime dual-close path/non-OT close/pagination/HMAC/rate-limit/UI + stale 409.

## What worked
- Overtime is a clear cross-entity gate (site limit vs shift hours).
- Dual supervisor close reuses dual-control from loadbay/policyforge without becoming a noun-swap FSM.

## What failed / was brittle
Nothing blocking sustain.

## Framework recommendation
Continue multi-aggregate + cross-entity gates (`docs/FRAMEWORKS.md`).
