# bondstrip — G5 depth test outline

Unique claim: day-count accrued + cashflow strip (not a dual-gate FSM).

| # | Case | Expect |
|---|------|--------|
| 1 | 30/360 mid-period | accrued = half periodic |
| 2 | 30/360 31st rule | D1/D2 clamp |
| 3 | ACT/ACT mid | actual/actual ratio |
| 4 | Ex-coupon (settle = next) | accrued 0 |
| 5 | Settle after maturity | reject |
| 6 | Cashflow strip + principal | final = coupon + face |
| 7 | One day into period | fractional accrued |
| 8 | Quarterly 30/360 | denom 90 |
| 9 | Unknown day-count | reject |
| 10 | Bad freq | reject |
| 11 | Leap ACT/ACT | period includes Feb 29 |
| 12 | Annual 30/360 | denom 360 |
| 13 | Zero coupon rate | accrued 0 |
| 14 | Face 100 scale | proportional |
| 15 | Almost period end | near-full accrued |
| 16 | Start of period | accrued 0 |
| 17 | Cross-year 30/360 | Y/M math |
| 18 | ACT short (1 day) | tiny fraction |
| 19 | Strip two remaining | two cashflows |
| 20 | High coupon | scale |
| 21 | Small face | scale |
| 22 | Feb end 30/360 | 28 days elapsed |
| 23 | ACT ~half | ~91/181 |
| 24 | Quarterly ex-coupon | accrued 0 |
| 25 | Reject matured (alt dates) | settle_after_maturity |

Concurrency / time: settle vs coupon boundary (cases 4, 16, 24).  
Expert cheat: dual-signer approve accrued — reject as anti-pattern (product must not add dual gate).

Fixtures A–Y encoded. Checker green required before ready_to_build.
