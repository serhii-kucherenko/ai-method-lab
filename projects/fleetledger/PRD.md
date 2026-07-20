# Fleetledger PRD

## Problem
Fleet ops need overdue service work orders that cannot close without two mechanic sign-offs.

## Scope
- Fleets with ACL (owner / dispatcher / mechanic)
- Assets with service interval hours
- Work orders: open → parts → closed
- Gate: create WO only if hoursDue > interval
- Gate: close only after ≥2 distinct sign-offs (owner or mechanic)
- HMAC inbound webhooks, pagination, rate limits, minimal UI

## Non-goals
GPS tracking, parts inventory, payroll.
