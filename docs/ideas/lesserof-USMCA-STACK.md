# lesserof — USMCA stacked cap toy example (seed)

**State:** seed only. Extends `lesserof-WORKED-EXAMPLE.md` + `lesserof-NARROW-CLAIM.md`.

## Setup

Same substitution claim as before, plus export to **Canada** at **zero** Canadian duty on the good:

| Column | Amount |
|--------|--------|
| U.S. duty paid on designated import | $10,000 |
| Duty that would apply if substitute were imported into the U.S. | $4,000 |
| Duty paid to Canada on the exported good | **$0** |

## Caps applied in order (illustrative)

1. **TFTEA substitution lesser-of** (§ 1313(l)): base = min(10000, 4000) = **$4,000** → 99% = **$3,960** before USMCA.  
2. **USMCA drawback lesser-of** (§ 4534 / 19 CFR Part 182 Subpart E): refund cannot exceed lesser of U.S. import duties vs duties paid to the USMCA country. With Canada duty **$0**, recoverable customs duty → **$0**.

| Model | Forecasted refund | Correct under stacked caps | Error |
|-------|-------------------|----------------------------|-------|
| Naive 99% of U.S. paid | $9,900 | **$0** | **+$9,900 fantasy cash** |
| TFTEA lesser-of only (forgot USMCA) | $3,960 | **$0** | **+$3,960** still wrong |
| Stacked TFTEA + USMCA | $0 | **$0** | $0 |

## Why this matters for uniqueness

Vendor blogs often explain TFTEA lesser-of alone. The **stacked** miss (finance books $3,960 after learning lesser-of, then Canada lane zeros it) is the narrower experiment worth encoding later — not plain min(paid, substitute).

Same-condition unused exports to USMCA partners may be excepted — any future goldens must split “same condition” vs manufactured/substituted carefully or the suite lies.

## Explicit non-actions

No fixtures. No product. No activation while htsroute holds the slot.
