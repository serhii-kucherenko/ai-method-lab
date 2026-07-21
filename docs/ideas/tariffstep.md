# tariffstep — idea dossier

**State:** cleared research → **ready to build** (workflow experiment)  
**Framing:** workflow experiment — not a commercial pitch against utility billing vendors  
**Opened:** 2026-07-21 after bondstrip finished

## Start here (short guide)

1. Read the algorithm: `tariffstep-algorithm.md`  
2. See how rules map to published language: `tariffstep-tariff-mapping.md`  
3. Run the 25 scenarios:

```text
node docs/ideas/check-tariffstep-fixtures.mjs
```

4. Decision memo: `tariffstep-G6-summary.md`  
5. Scorecard: `tariffstep-GATE-SCORECARD.md`

## Problem

Utility billing ops walk metered kilowatt-hours through **stepped rate blocks** and apply a **demand ratchet** (billed demand = the larger of this month’s peak and a percentage of a past peak). Spreadsheet walks drift from tariff sheets.

**Who:** rate analyst / billing-system config tester  
**How often:** every bill cycle and every tariff change  

Evidence: `tariffstep-G1-evidence.md`

## Unique claim

**If we remove stepped block walk + demand ratchet, the remaining product is a generic meter-reading workflow.**

Distinct from settlecut (single-interval imbalance) and bondstrip (coupon day-count).

## Challenges (three rounds)

1. Commercial systems already exist → stands for go-to-market; workflow experiment still OK  
2. Niche tooling → soft; bill-cycle frequency helps  
3. Offline legal tariff books → partly true; math core still checkable  

## Progress

- Algorithm + 25 scenarios A–Y green  
- Challenges A/B/C + evidence + tariff mapping  
- Scorecard → ready to build  

## Decision

**Ready to build.** Open `projects/tariffstep/`. Status emails must use plain language and must not claim vendor replacement.
