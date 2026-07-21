# bondstrip — G6 research summary

1. **Problem:** FI middle-office must compute accrued interest under day-count conventions and strip remaining coupon cashflows; wrong convention → wrong dirty price / wrong strip schedule.

2. **Why prior products don’t cover it:** lotblast=DAG recall; amendwin=visit windows; crewleg=FAR tables; ndcswap=TE/DAW; settlecut=loss-once imbalance; dual-gate=ceiling+signer. None encode 30/360 vs ACT/ACT accrued.

3. **Unique claim:** `periodic × (days_elapsed / days_in_period)` with convention-specific day math + remaining coupon strip (+ face at maturity); reject unknown DC, bad freq, settle after maturity.

4. **Kill rounds:** Kill A (Bloomberg/Yield Book) stands commercially — method stress only. Kill B/C soft or answered (math still checkable in software).

5. **Falsifiers:** Practitioner rejects v0 30/360 rule as wrong vs NASD/ICMA in ≥2 live scenarios; desks still rebuild accrued in spreadsheet for the happy path after smoke.

6. **Depth:** G5 25 cases; fixtures A–Y + checker green; Challenge A held.

7. **Decision:** **`ready_to_build`** as method-stress product. Open `projects/bondstrip/` under A03+A10. Unique claim first.
