# depositgap — interest window / day-count lock (seed paper)

**State:** seed only. Closes “Still open #6” on `depositgap-STATUTE-CITATIONS.md`.  
**Not ACE parity.** Digests must not claim CBP calculator replacement.

## Two different interest regimes (do not conflate)

| Regime | Cite | Window |
|--------|------|--------|
| **§ 1677g interest** (AD/CVD deposit true-up) | 19 U.S.C. § 1677g | From **publication of the AD/CVD order** (or 1921 finding) through **liquidation / reliquidation** of the entry. Rate = IRC § 6621 for the period. |
| **Delinquency interest** | 19 U.S.C. § 1505(d); 19 CFR § 24.3a | **After** liquidation — unpaid liquidated bill past the late-payment date (~30 days). Separate from § 1677g. |

CIT explanations treat § 1677g as pre-liquidation interest on under/over-deposited AD/CVD, stopping at liquidation; § 1505(d) starts afterward if the bill is unpaid (e.g. Hilex Poly line of cases).

General underpayment interest example in **19 CFR § 24.3a(b)(2)** (deposit-required date → liquidation) is the **ordinary** supplemental-duty interest pattern — useful analogy for “accrues until liquidation,” but AD/CVD cash-deposit true-ups are governed by **§ 1677g’s order-publication start**, not that example alone.

Primary text: https://www.law.cornell.edu/uscode/text/19/1677g · https://www.law.cornell.edu/cfr/text/19/24.3a

## What v0 fixtures encode

| Field | Maps to |
|-------|---------|
| `order_published_on` | § 1677g start (order publication) |
| `liquidated_on` | liquidation / forecast end |
| `days` | calendar-day difference (v0 toy) |
| `interest_annual_rate` | single § 6621 stand-in for the window (not a full rate series) |

**Not in v0:** exact CBP day-count (30/360 vs actual/365), mid-window § 6621 rate changes, or post-liquidation delinquency.

## Honesty for digests / PRODUCT

1. Say **forecast** of § 1677g-shaped interest — not ACE bill printout.  
2. Do not call delinquency interest “the deposit gap.”  
3. Kill A: brokers/CBP still liquidate.

## Framing implication

Keep v0 simple day-count until a versioned dual suite locks a CBP-facing day-count cite. Closing this note is **enough to frame** with an explicit “simple 365 toy” fence — not enough to claim OIS/ACE parity.
