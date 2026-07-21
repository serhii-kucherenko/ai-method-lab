# tariffstep — research summary (decision memo)

## 1. Problem

Utility rate analysts and billing testers must re-check stepped energy charges and demand-ratchet floors after every tariff change. Spreadsheets drift at block edges and ratchet ties.

## 2. Why earlier lab products do not cover it

- settlecut: one-interval loss and imbalance pricing  
- bondstrip: coupon day-count accrued interest  
- Earlier products: status workflows and dual approvals  

None encode a stepped rate ladder plus prior-peak demand floor.

## 3. Unique claim

Energy charge = walk usage through ordered blocks.  
Billing demand = max(this month’s peak, prior peak × ratchet %).  
Bad schedules and illegal percentages must reject.

## 4. Challenges

1. Commercial billing systems already do this → stands; we only run a workflow experiment.  
2. Niche audience → softened by recurring bill-cycle / tariff-change frequency.  
3. Legal tariff PDFs dominate → partly true; we still isolate a checkable math core (see tariff mapping).

## 5. Falsifiers

- Two practitioners say our v0 rules miss material tariff clauses.  
- After a first working slice, the happy path still lives only in spreadsheets.

## 6. Depth tests

25 named scenarios (A–Y) green in the research checker: happy path, ratchet binds, boundaries, large volume, and rejects.

## 7. Decision

**Ready to build** as a workflow experiment. Open `projects/tariffstep/`. Digests must not claim we replace commercial billing systems.
