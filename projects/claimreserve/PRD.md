# Claimreserve PRD

## Problem
Claims desks need to book reserves under a policy ceiling and require two adjusters before settle.

## Scope
- Desks with ACL (adjuster / clerk / viewer)
- Policies with reserve ceiling
- Claims: filed → held → settled
- Gate: create claim only within reserve headroom
- Gate: settle only after ≥2 distinct adjuster approvals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
FNOL intake, payment rails, reinsurance.
