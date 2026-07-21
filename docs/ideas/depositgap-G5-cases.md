# depositgap — G5 case map (seed paper)

**State:** seed only. Encoded fixtures: A–J (`check-depositgap-fixtures.mjs` + dual).  
**Not framed. Not `current_idea`. No product.**

Unique claim under test: **cash deposit rate ≠ final assessed rate**, then **§ 1677g interest** over the publication→liquidation window. Fail any case that collapses to dual-signer status or day-count-only accrual.

## Encoded (A–J)

| ID | Teaches |
|----|---------|
| A | Classic underdeposit + interest (worked toy) |
| B | Overdeposit → signed refund path |
| C | Skip-interest cheat when rates match and days > 0 → reject |
| D | Zero / non-positive entered value → reject |
| E | CVD twin (`order_type: CVD`) same arithmetic |
| F | All-others rate class, different rates / value |
| G | Same-day window → duty delta, zero interest |
| H | Inverted dates → reject |
| I | Negative deposit rate → reject |
| J | Matched rates → zero true-up (honest) |

## Named, not yet encoded (K–Y) — target ≥25 before frame

| ID | Intent | Money / reject |
|----|--------|----------------|
| K | Leap-year window (366 days) with non-zero delta | Interest uses 366/365 |
| L | Multi-year POR (730 days) underdeposit | Interest scales with days |
| M | Tiny entered value ($1) underdeposit | Sub-dollar interest still computed |
| N | Assessed below deposit (large refund) + interest | Negative true_up |
| O | `rate_class: other` with explicit assessed | Must not invent all-others |
| P | Missing `interest_annual_rate` / NaN | Reject |
| Q | Negative assessed rate | Reject |
| R | `skip_interest=true` with **unequal** rates | Reject (honesty — interest required when delta ≠ 0) *or* document if v0 only gates equal-rate cheat |
| S | Zero interest rate input with underdeposit | duty_delta only, interest 0 |
| T | Fractional rates (0.1234 vs 0.2000) | Precise cents |
| U | AD then CVD same entry facts, different `order_type` | Same numbers, label differs |
| V | Publication = liquidation + one day | days = 1 |
| W | Extremely long window (10y) | Still simple interest toy — digests must not claim ACE |
| X | Auditor-only mutation attempt (product phase) | Offline: paper note until build |
| Y | Concurrent two-entry independence (product phase) | Offline: paper note until build |

## Pass bar for later G5 score

- ≥25 goldens green on single checker  
- Dual-impl agree on all  
- At least 5 rejects that protect money honesty  
- At least one CVD twin and one all-others assignment  

## Explicit non-actions

Do not activate while `htsroute` holds the slot. Do not open `projects/depositgap/`.
