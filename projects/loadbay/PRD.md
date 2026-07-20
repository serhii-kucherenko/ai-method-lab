# Loadbay PRD

## Problem
Loading docks need capacity enforcement and two-person seal before a load departs.

## Scope
- Bays with ACL (owner / dispatcher / checker)
- Docks with max weight capacity
- Loads: staged → sealed → departed
- Gate: create load only if weight ≤ capacity
- Gate: depart only after ≥2 distinct seals
- HMAC webhooks, pagination, rate limits, minimal UI

## Non-goals
Carrier EDI, yard GPS, billing.
