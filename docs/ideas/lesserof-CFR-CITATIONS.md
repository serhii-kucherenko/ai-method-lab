# lesserof — primary CFR citations (seed)

**State:** seed only. Parallel deepen while `current_idea` stays **htsroute**.  
**Fetched:** 2026-07-21 via Cornell LII e-CFR mirrors (ecfr.gov CAPTCHA-blocked this tick).  
**Purpose:** put TFTEA calc regs + USMCA Subpart E lesser-of on paper with primary quotes — not vendor blogs.

## 19 CFR § 190.22 — substitution manufacturing (TFTEA calc)

Source: https://www.law.cornell.edu/cfr/text/19/190.22  
Implements 19 U.S.C. § 1313(b) / § 1313(l) lesser-of for manufacturing substitution.

> **(ii) Allowable refund—(A) Exportation.** In the case of an article that is exported, the amount of drawback allowable will not exceed **99 percent of the lesser of**:  
> **(1)** The amount of duties, taxes, and fees paid with respect to the imported merchandise; or  
> **(2)** The amount of duties, taxes, and fees that would apply to the substituted merchandise if the substituted merchandise were imported.

Destruction branch (same section) repeats the same “99 percent of the lesser of” pattern after recovery-value reductions under 19 U.S.C. § 1313(x).

## 19 CFR § 190.32 — substitution unused merchandise (TFTEA calc)

Source: https://www.law.cornell.edu/cfr/text/19/190.32  
Implements 19 U.S.C. § 1313(j)(2) / § 1313(l) lesser-of for unused substitution.

> **(b) Allowable refund—(1) Exportation.** In the case of an article that is exported, subject to paragraph (b)(3) of this section, the total amount of drawback allowable will not exceed **99 percent of the lesser of**:  
> **(i)** The amount of duties, taxes, and fees paid with respect to the imported merchandise; or  
> **(ii)** The amount of duties, taxes, and fees that would apply to the exported article if the exported article were imported.

Wine alternative standard under § 190.32(d)(2) is an explicit **exception** to that lesser-of: refund may be 99% of duties paid on the imported merchandise “without regard to the limitations in paragraph (b)(1) or (b)(2).”

## 19 CFR Part 182 Subpart E — USMCA drawback lesser-of

### § 182.44 Calculation of drawback (core lesser-of)

Source: https://www.law.cornell.edu/cfr/text/19/182.44

> **(a) General.** Except in the case of goods specified in § 182.45, drawback of the duties previously paid upon importation of a good into the United States may be granted by the United States, upon presentation of a USMCA drawback claim under this subpart, **on the lower amount of**:  
> **(1)** The total duties paid or owed on the good in the United States; or  
> **(2)** The total amount of duties paid on the exported good upon subsequent importation into Canada or Mexico.

Direct-ID manufacturing under USMCA (§ 182.44(c)) restates the same “lesser amount … to the United States or to Canada or Mexico,” with refund “may not exceed 99 percent of the duty paid … into the United States.”

Substitution manufacturing under USMCA (§ 182.44(d)) ties payable amount to that US/Canada/Mexico lesser amount, then states drawback is “the same as that which would have been allowed had the substituted merchandise used in manufacture been itself imported.”

### § 182.45 — full-drawback exceptions (same-condition carve-out)

Source: https://www.law.cornell.edu/cfr/text/19/182.45

> **(b) Claims under 19 U.S.C 1313(j)(1) for goods in same condition.** A good imported into the United States and subsequently exported to Canada or Mexico **in the same condition** is eligible for drawback under 19 U.S.C. § 1313(j)(1) **without regard to the limitation on drawback set forth in § 182.44**.

This is why future goldens must split same-condition unused (j)(1) from manufactured / substituted USMCA lines — otherwise the suite lies.

## How these bind the seed claim

| Cap | Primary home | Effect on toy finance model |
|-----|--------------|-----------------------------|
| TFTEA substitution lesser-of | §§ 190.22 / 190.32 | Caps at 99% × min(paid, substitute/export basis) |
| USMCA export lesser-of | § 182.44(a) | Further caps at min(U.S. side, CA/MX duties paid) — often **$0** if partner duty-free |
| Same-condition exception | § 182.45(b) | (j)(1) same-condition to CA/MX escapes § 182.44 |

Basket “other” trap is statutory (§ 1313(j)(5)), not in these calc sections — see `lesserof-BASKET-OTHER.md`.

## Cite gaps still open

1. Direct fetch of **ecfr.gov** HTML failed (bot wall); quotes are LII e-CFR mirrors — re-pull from ecfr.gov / govinfo when access works.  
2. Full primary text of **19 U.S.C. § 4534** (USMCA statute twin of Subpart E) not pasted this tick.  
3. Contrast cite for **direct-ID unused** (§ 190.31) — no lesser-of — not quoted here (only implied by statute + seed worked example).  
4. One **CBP primary** operational publication or HQ ruling that walks a lesser-of dollar calc end-to-end — still preferred for G1/G6.  
5. Confirm whether any Part 190 text restates § 1313(j)(5) “other” basket (statute may be the only primary for that trap).
