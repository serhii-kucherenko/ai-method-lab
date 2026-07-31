# Schema Drift Studio — ARS brief

Release-ops / data-platform wedge (software-native).  
Related: `docs/ideas/schema-drift-studio-RELATED-WORKS.json` (schema drift / migration neighbors).

## Job to be done

Platform and data leads need **evidence that live schema matches the last approved migration pack** before a release gate - not another migration-tool admin UI.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| Online Diff Studio | OT PLC online↔offline - not DB schema |
| Stale Flag Studio | Feature-flag debt - not schema |
| Change Freeze Studio | OT/change holds - not migration packs |
| Download Gate Studio | Download interlocks - not schema drift |

**Claim:** If we remove **approved migration pack ↔ live schema diff → release evidence**, the remainder is a Flyway/Liquibase console.

## Buyer / money
- Buyer: Platform / data eng leads who already gate releases on migrations  
- Money: org seats + drift-run usage  
- Software-solvable: yes (SQL dump / manifest soft-sim; refuse live prod write claims)

## Falsifiers
1. Teams only use expand/contract with zero drift incidents → weak wedge  
2. No approved “golden” pack exists → product stuck in inventory  
3. Shipping only vendor migration UI → kill

## Recommendation
Score under biz-rubric-v2. Queue behind five pack-ready climbs unless score clears A and a human arms it earlier.
