# depositgap — § 6621 mid-window rate fence (seed)

Research only. Closes a digests/honesty gap called out in `depositgap-VALUE-STAKES.md` and `depositgap-DAY-COUNT.md`.

## What v0 does

Single `interest_annual_rate` for the whole publication→liquidation window. Interest toy:

`duty_delta × rate × (days / 365)`

## What real liquidations can do

IRC § 6621 underpayment / overpayment rates can **change mid-window**. CBP may apply different rates to different segments of the same entry’s § 1677g accrual. v0 **does not** segment.

## Fence (must hold in digests / PRODUCT / try page)

1. Call the rate a **stand-in**, not “the” § 6621 series for the POR.  
2. Never claim ACE / OIS parity while this fence is open.  
3. Mid-window rate changes are a **later version** dual-suite item — not a reason to invent more depositgap fixtures tonight.  
4. Try demo must say single-rate toy (see `demos/depositgap-try/try.html` honesty).

## Decision impact

Enough to activate as a **forecast method experiment**. Not enough to sell “prints the bill.” Activation still waits on htsroute park/clear + `depositgap-POST-HTSROUTE-RUN.md`.
