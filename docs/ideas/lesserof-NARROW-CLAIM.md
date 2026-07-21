# lesserof — narrow unique-claim draft (pre-frame)

**State:** seed hygiene. Not framed. Not active.  
**Why:** plain “compute lesser-of” is already explained by incumbents → Kill A stands. Need a **narrower** claim or stay parked forever.

## Candidate unique claim (v0 draft)

**If we remove stacked refund caps + basket substitution eligibility, the remaining product is a generic drawback calculator isomorphic to broker worksheets / vendor explainers.**

Unique rule bundle (all required for differentiation):

1. **TFTEA substitution lesser-of** (19 U.S.C. § 1313(l)) on § 1313(b) / § 1313(j)(2) lines.  
2. **Direct-ID exemption** — § 1313(a) / § 1313(j)(1) must **not** apply lesser-of.  
3. **USMCA export lesser-of** (19 U.S.C. § 4534 / 19 CFR Part 182 Subpart E) when export destination is Canada/Mexico — can drive recoverable duty to **zero** even when U.S. duty was paid.  
4. **Basket “other” substitution trap** (19 U.S.C. § 1313(j)(5)): if the 8-digit description begins with “other,” substitution needs matching **10-digit** statistical reporting that also does not begin with “other” — else **reject / ineligible**, not a silent 8-digit match.

A shallow dual-gate or “99% of paid” product fails (1)–(4). A vendor blog that explains (1) alone does not encode (3)+(4) as **executable reject invariants** with golden cards.

## Kill pre-register (honest)

| Kill | Likely outcome |
|------|----------------|
| A — incumbents | **Stands commercially** for full ACE filing. Survive as **workflow experiment** proving stacked-cap math + eligibility rejects. Digests must say so. |
| B — niche | ICP is drawback program owners at exporting manufacturers — real but narrow. Frequency = claim cycles, not daily SKU churn. |
| C — offline | Manufacturing rulings, BOM audits, CBP claim review remain offline. Software holds **calc + eligibility gate** only. |

## Falsifiers (draft)

1. Domain experts say stacked USMCA + TFTEA on one line is wrong in ≥2 real scenarios → abandon.  
2. After any future smoke, finance still forecasts with a single “99% of paid” cell for substitution lanes → abandon (software didn’t change the critical path).  
3. Golden “other”-basket reject contradicts CBP practice → abandon.

## G5 progress (paper fixtures — seed only)

Encoded A–P (16) via `check-lesserof-fixtures.mjs` / dual — still seed, not framed:

- ✅ Happy: substitution lesser-of binds (A)  
- ✅ Happy: substitution lesser-of does not bind (E)  
- ✅ Happy: direct-ID recovers 99% of paid (B)  
- ✅ Negative: apply lesser-of to direct-ID → reject (H)  
- ✅ Negative: skip lesser-of on substitution → reject (I)  
- ✅ Boundary: equal columns (F)  
- ✅ USMCA: partner duty-free → recoverable **0** (C)  
- ✅ USMCA: partner duty ≥ U.S. TFTEA base → U.S. side survives (G)  
- ✅ USMCA: partner mid-cap binds (M)  
- ✅ Basket: 8-digit “other” without match → ineligible (D)  
- ✅ Basket: matching 10-digit non-other → eligible (J)  
- ✅ Expert cheat: relabel claim type to dodge lesser-of (K)  
- ✅ Concurrent: two lines independent caps (L)  
- ✅ Hygiene: negative duties / unknown type / zero duties (N/O/P)  

Still toward ≥25 before any frame. No product while htsroute owns the slot.

## Decision

Keep as **seed**. Prefer this narrow bundle over activating a plain lesser-of clone. Activate framing only after htsroute day-boundary clears **or** htsroute parks/kills — and only with Kill A answered as workflow experiment.
