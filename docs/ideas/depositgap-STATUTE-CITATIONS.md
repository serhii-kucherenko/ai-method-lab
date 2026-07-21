# depositgap — statute citations (seed deepen)

**State:** seed only. Not framed. Not `current_idea`.  
**Purpose:** primary quotes + worked dollars before any future frame.

## 19 U.S.C. § 1677g (interest)

LII / uscode (research tick 2026-07-21):

**(a) General rule** — Interest shall be payable on overpayments and underpayments of amounts deposited on merchandise entered, or withdrawn from warehouse, for consumption on and after—

1. the date of publication of a countervailing or antidumping duty order under this subtitle …, or  
2. the date of a finding under the Antidumping Act, 1921.

**(b) Rate** — The rate of interest payable under subsection (a) for any period of time is the rate of interest established under section 6621 of title 26 for such period.

Source: https://www.law.cornell.edu/uscode/text/19/1677g

## 19 CFR § 351.212(e) (operational interest window)

Under section 778 of the Act, the Secretary will instruct CBP to calculate interest for each entry on or after the publication of the order **from the date that a cash deposit is required** … **through the date of liquidation**.

Also: U.S. uses a **retrospective** assessment system — final liability determined after import (351.212 intro).

Source: https://www.law.cornell.edu/cfr/text/19/351.212

## 19 U.S.C. § 1673f — deposit vs final assessed (AD)

**(b)** If estimated AD deposited under § 1673e(a)(3) differs from the duty determined under the order, then for post-Commission-affirmative entries the difference shall be—

1. **collected**, to the extent the deposit is lower than the duty under the order, or  
2. **refunded**, to the extent the deposit is higher,

**together with interest as provided by section 1677g**.

(Pre-affirmative provisional deposits under § 1673f(a) have a different disregard/refund rule — goldens must not conflate (a) vs (b).)

Source: https://www.law.cornell.edu/uscode/text/19/1673f

## 19 U.S.C. § 1671f — deposit vs final assessed (CVD twin)

Same structure as § 1673f for **countervailing** duties: provisional (a) disregard/refund-or-release; post-affirmative (b) **collect** or **refund** the difference **together with interest as provided by section 1677g**.

Source: https://www.law.cornell.edu/uscode/text/19/1671f

Goldens must set `order_type` = `CVD` without changing the true-up arithmetic in v0 (rate inputs already abstract).

## Worked toy (illustrative — not a filed entry)

| Input | Value |
|-------|------:|
| Entered value | $1,000,000 |
| Cash deposit rate | 10% → **$100,000** deposited |
| Final assessed rate | 25% → **$250,000** assessed |
| Duty delta (underpayment) | **$150,000** |
| Interest | § 1677g / IRC § 6621 from deposit-required date → liquidation (not modeled numerically this tick — rate table TBD) |

**Unique fail:** forecasting landed cost at deposit rate alone, or computing delta **without** interest window, fails the claim.

## Interest toy (illustrative — not CBP liquidated amount)

Using IRS underpayment rate under IRC § 6621 for **2026 Q3 (Jul–Sep): 7%** (corporate and non-corporate underpayment; IRB 2026-22 / IRS quarterly rates page).

Assume the **$150,000** underpayment from the duty toy bears interest for a **full year** at a flat 7% (simplifying — real liquidations use day-count / CBP instructions; do not ship this as production math):

| Piece | Amount |
|-------|-------:|
| Duty underpayment | $150,000 |
| Illustrative interest @ 7% × 1 year | **$10,500** |
| Illustrative total surprise vs deposit-only forecast | **$160,500** |

Sources: https://www.irs.gov/payments/quarterly-interest-rates ; https://www.irs.gov/irb/2026-22_IRB

## Still open before framed

1. ~~Quote § 1673f~~ — done (b) collect/refund + 1677g  
2. ~~One worked interest number with a dated § 6621 rate~~ — done (illustrative; CBP day-count TBD)  
3. ~~Kill A/B/C answers on paper~~ — `depositgap-challenge-ABC.md`  
4. ~~CVD twin § 1671f quote~~ — done; fixture E  
5. Encode remaining G5 names K–Y (`depositgap-G5-cases.md`) toward ≥25 before any frame  
6. Lock CBP day-count convention cite (v0 remains simple 365 toy)

## Explicit non-actions

No product. No activation while htsroute holds the slot. Paper fixtures A–J only.
