# Bondrail PRD

## Problem
Bond facilities need draw requests that respect a collateral floor and require two treasurers before funds release.

## Scope
- Workspaces with ACL (treasurer / clerk / viewer)
- Bonds with collateral + floor
- Draws: requested → held → released
- Gate: create draw only within available headroom
- Gate: release only after ≥2 distinct treasurer approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
KYC, bank rails, interest accrual.
