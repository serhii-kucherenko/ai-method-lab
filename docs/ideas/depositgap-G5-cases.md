# depositgap — G5 case map (seed paper)

**State:** seed only. Encoded fixtures: A–S (`check-depositgap-fixtures.mjs` + dual).  
**Not framed. Not `current_idea`. No product.**

Unique claim under test: **cash deposit rate ≠ final assessed rate**, then **§ 1677g interest** over the publication→liquidation window. Fail any case that collapses to dual-signer status or day-count-only accrual.

## Encoded (A–S)

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
| K | Leap-year window (366 days) |
| L | Two-year POR (730 days) |
| M | Tiny entered value ($1) |
| N | Large refund (assessed << deposit) |
| O | `rate_class: other` with explicit assessed |
| P | Missing interest rate → reject |
| Q | Negative assessed rate → reject |
| R | Skip interest on underdeposit → reject |
| S | Zero interest rate → duty delta only |

## Named, not yet encoded (T–Y) — target ≥25 before frame

| ID | Intent | Money / reject |
|----|--------|----------------|
| T | Fractional rates (0.1234 vs 0.2000) | Precise cents |
| U | AD then CVD same entry facts, different `order_type` | Same numbers, label differs (E already covers twin; U locks parity) |
| V | Publication + one day | days = 1 |
| W | Extremely long window (10y) | Still simple interest toy — digests must not claim ACE |
| X | Auditor-only mutation attempt (product phase) | Offline: paper note until build |
| Y | Concurrent two-entry independence (product phase) | Offline: paper note until build |

## Pass bar for later G5 score

- ≥25 goldens green on single checker (or 23 paper + 2 product-phase notes documented)  
- Dual-impl agree on all  
- At least 5 rejects that protect money honesty  
- At least one CVD twin and one all-others assignment  

## Explicit non-actions

Do not activate while `htsroute` holds the slot. Do not open `projects/depositgap/`.
