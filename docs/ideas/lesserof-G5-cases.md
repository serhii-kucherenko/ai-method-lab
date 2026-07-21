# lesserof — G5 case map (seed paper)

**State:** seed only. Encoded fixtures: A–W (`check-lesserof-fixtures.mjs` + dual).  
**Not framed. Not `current_idea`. No product.**

Unique claim under test: **stacked** TFTEA substitution lesser-of + optional **USMCA** export lesser-of + **direct-ID exemption** + **basket “other”** reject. Fail any case that collapses to “99% of paid” or dual-signer status.

## Encoded (A–W)

| ID | Teaches |
|----|---------|
| A | Substitution lesser-of binds |
| B | Direct-ID recovers 99% of paid (no lesser-of) |
| C | USMCA partner duty-free → recoverable 0 |
| D | Basket “other” ineligible → reject |
| E | Substitution lesser-of does not bind (paid lower) |
| F | Equal columns boundary |
| G | USMCA partner duty ≥ U.S. base → U.S. side survives |
| H | Force lesser-of on direct-ID → reject |
| I | Skip lesser-of on substitution → reject |
| J | Basket eligible via matching 10-digit |
| K | Relabel substitution as direct-ID → reject |
| L | Two lines independent caps; totals sum |
| M | USMCA mid-cap (partner binds between 0 and TFTEA) |
| N | Negative duties → reject |
| O | Unknown claim type → reject |
| P | Zero duties → ok refund 0 |
| Q | USMCA flagged without partner duty → reject |
| R | Negative substitute basis → reject |
| S | Tiny line sub-dollar precision |
| T | Multi-line: one basket reject fails whole run |
| U | Zero substitute basis → refund 0 |
| V | USMCA flag on direct-ID → reject (conflicting mode) |
| W | Extremely large duties — cents stay exact |

## Product-phase notes (count toward ≥25 bar)

| ID | Intent | Why deferred |
|----|--------|--------------|
| X | Auditor-only mutation | Needs product role surface — paper: mutation without auditor role rejects |
| Y | Org-scoped isolation | Needs multi-tenant persistence — paper: org A totals must not leak into org B |

## Pass bar for later G5 score

- ≥25 goldens (or **23 encoded + 2 product-phase notes**) ← **met**
- Dual-impl agree on all  
- At least 5 rejects protecting stacked-cap honesty  

## Explicit non-actions

Do not activate while `htsroute` holds the slot. Prefer **depositgap** next after htsroute clears (`depositgap-G6-summary.md`).
