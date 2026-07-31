# Stale Flag Studio — ARS brief

Platform / release-ops wedge (software-native; not another FinOps desk).  
Related: `docs/ideas/stale-flag-studio-RELATED-WORKS.json` (feature-flag debt / technical debt neighbors).

## Job to be done

Platform and release leads need a **queue of flags that are past expiry, permanently true, or unused**, with owner and blast radius, before they freeze a release - not another flag-console CRUD skin.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| Change Freeze Studio | OT/change holds - not feature-flag debt |
| Download Gate Studio | Download interlocks - not flag hygiene |
| Tool Scope Studio | Agent tool bounds - not product flags |
| Delegation Expiry Studio | Agent grant TTL - not LaunchDarkly-style flags |

**Claim:** If we remove **stale/expired/unused flag → owner blast-radius queue before freeze**, the remainder is a generic flag admin desk.

## Buyer / money
- Buyer: Platform eng / release managers at product orgs with flag fleets  
- Money: org seats + flag-inventory sync usage  
- Software-solvable: yes (CSV/API soft-sim inventory; refuse “we replace your flag vendor” claims)

## Falsifiers
1. Teams already auto-delete flags in CI with zero pain → weak wedge  
2. Inventory cannot map owners → theater  
3. Shipping only a LaunchDarkly UI clone → kill

## Recommendation
Score under biz-rubric-v2. Queue after the four pack-ready climbs unless score clears A and a human arms it earlier.
