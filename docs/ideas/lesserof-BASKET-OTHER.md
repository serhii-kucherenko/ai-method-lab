# lesserof — basket “other” 8-digit trap (seed toy)

**State:** seed only. Complements `lesserof-NARROW-CLAIM.md` item (4).  
**Primary statute:** 19 U.S.C. § 1313(j)(5) (House uscode, fetched 2026-07-21).

## Primary quote

> **(5)(A)** For purposes of paragraph (2) and except as provided in subparagraph (B), merchandise may **not** be substituted for imported merchandise for drawback purposes based on the 8-digit HTS subheading number if the article description for the 8-digit HTS subheading number under which the imported merchandise is classified **begins with the term “other”**.  
> **(B)** In cases described in subparagraph (A), merchandise may be substituted … if—  
> **(i)** the other merchandise and such imported merchandise are classifiable under the **same 10-digit** HTS statistical reporting number; and  
> **(ii)** the article description for that 10-digit HTS statistical reporting number **does not begin with the term “other”**.

Source: https://uscode.house.gov/view.xhtml?req=(title:19%20section:1313%20edition:prelim)

## Toy numeric example (illustrative — not a filed claim)

Assume unused **substitution** under § 1313(j)(2). Finance already knows TFTEA lesser-of. Both lines sit under the same residual 8-digit basket:

| Field | Import (designated) | Export (substituted) |
|-------|---------------------|----------------------|
| 8-digit HTS | **3926.90.99** — description begins **“Other”** | **3926.90.99** — same 8-digit “Other” |
| 10-digit statistical | **3926.90.9985** — “Other” | **3926.90.9990** — “Other” (different SRN) |
| U.S. duty paid (line) | **$8,000** | — |
| Duty if substitute were imported | **$5,000** | — |

### What a naive 8-digit matcher does

1. Sees matching 8-digit → marks **eligible**.  
2. Applies TFTEA lesser-of: 99% × min(8000, 5000) = **$4,950**.  
3. Books **$4,950** as forecasted refund.

### Correct under § 1313(j)(5)

| Check | Result |
|-------|--------|
| 8-digit description begins with “other”? | **Yes** → 8-digit substitution alone is **blocked** |
| Same 10-digit SRN? | **No** (9985 vs 9990) |
| 10-digit description non-“other”? | Irrelevant — (B)(i) already fails |

**Outcome:** claim line is **ineligible** for substitution unused drawback. Recoverable duty = **$0** (reject), not $4,950.

| Model | Forecast | Correct | Error |
|-------|----------|---------|-------|
| 8-digit match + TFTEA lesser-of | $4,950 | **$0 (ineligible)** | **+$4,950 fantasy cash** |
| Naive 99% of paid | $7,920 | **$0** | **+$7,920** |

### Contrast — trap satisfied (still seed paper only)

Same 8-digit “Other” basket, but both sides share **3926.90.9910** whose article description does **not** begin with “other” (toy label: “Gaskets of plastics”). Then § 1313(j)(5)(B) opens the gate; refund math falls back to TFTEA lesser-of → **$4,950** (before any USMCA stack).

**Unique software invariant:** basket “other” is an **eligibility reject**, not a silent 8-digit pass into lesser-of.

## Explicit non-actions

No fixtures. No product. Do not activate while htsroute holds `current_idea`.
