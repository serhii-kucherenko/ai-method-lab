# Canary Budget Studio — ARS brief

Release / SRE wedge (software-native).  
Related: `docs/ideas/canary-budget-studio-RELATED-WORKS.json` (canary / progressive delivery neighbors).

## Job to be done

Release leads need a **remaining canary error-budget view that drives promote vs hold** before full rollout - not another progressive-delivery console and not LLM eval budgets.

## Unique claim vs prior lab products

| Prior | Difference |
|-------|------------|
| Eval Budget Studio | LLM evaluation spend budgets - not canary SLO burn |
| Stale Flag Studio | Feature-flag debt - not progressive delivery |
| Change Freeze Studio | OT/change holds - not canary promote |
| Schema Drift Studio | Migration pack drift - not canary budget |

**Claim:** If we remove **canary error budget remaining → promote/hold + blast radius**, the remainder is a Flagger/Argo Rollouts UI.

## Buyer / money
- Buyer: Platform / SRE / release eng leads running progressive delivery  
- Money: org seats + canary-window sync usage  
- Software-solvable: yes (metrics CSV soft-sim; refuse live cluster control claims)

## Falsifiers
1. Teams only do all-or-nothing deploys → weak wedge  
2. No SLO / error budget definition → theater  
3. Shipping only vendor rollout UI → kill

## Recommendation
Score under biz-rubric-v2. Queue behind eight pack-ready climbs unless score clears A and a human arms it earlier.
