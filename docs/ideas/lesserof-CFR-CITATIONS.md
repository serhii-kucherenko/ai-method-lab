# lesserof — primary CFR citations

**State:** active research (`current_idea`).  
**Fetched:** 2026-07-21 via Cornell LII e-CFR mirrors (ecfr.gov CAPTCHA-blocked that tick).  
**Purpose:** put TFTEA calc regs + USMCA Subpart E lesser-of on paper with primary quotes — not vendor blogs.  
**Related fence:** `lesserof-SAME-CONDITION-FENCE.md` (v0 does not silently apply § 182.45(b)).

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

## 19 CFR § 190.31 — direct identification unused (no TFTEA lesser-of)

Source: https://www.law.cornell.edu/cfr/text/19/190.31  
Implements 19 U.S.C. § 1313(j)(1).

> The total amount of drawback allowable will not exceed **99 percent of the amount of duties, taxes, and fees paid with respect to the imported merchandise.**

No “lesser of paid vs substitute/export basis” language. Applying § 190.22 / § 190.32 lesser-of math to a (j)(1) direct-ID unused claim is a **mode bug**.

## 19 U.S.C. § 4534 — USMCA drawback scope (statute twin)

Source: https://www.law.cornell.edu/uscode/text/19/4534  

Defines “good subject to USMCA drawback” and carve-outs. Operational **lesser-of dollar calc** for claims remains in **19 CFR § 182.44**; this statute sets who is in/out of that regime.

Notable carve-outs for goldens:

- **(a)(2)** — good exported to a USMCA country **in the same condition** as imported (with limited processes) — aligns with § 182.45(b) full-drawback path  
- **(d)** — nothing in this section authorizes refund/waiver/reduction of **AD/CVD** on an imported good  

## How these bind the seed claim

| Cap | Primary home | Effect on toy finance model |
|-----|--------------|-----------------------------|
| TFTEA substitution lesser-of | §§ 190.22 / 190.32 | Caps at 99% × min(paid, substitute/export basis) |
| Direct-ID unused (no lesser-of) | § 190.31 | 99% of duties **paid** only |
| USMCA export lesser-of | § 182.44(a) (+ § 4534 scope) | Further caps at min(U.S. side, CA/MX duties paid) — often **$0** if partner duty-free |
| Same-condition exception | § 182.45(b) / § 4534(a)(2) | (j)(1) same-condition to CA/MX escapes § 182.44 |

Basket “other” trap is statutory (§ 1313(j)(5)), not in these calc sections — see `lesserof-BASKET-OTHER.md`.

## Cite gaps still open

1. Direct fetch of **ecfr.gov** HTML failed (bot wall); quotes are LII e-CFR mirrors — re-pull from ecfr.gov / govinfo when access works.  
2. ~~§ 190.31~~ / ~~§ 4534~~ — closed prior tick (LII).  
3. ~~CBP primary lesser-of walkthrough~~ — **partially closed this tick:** CBP TFTEA-Drawback NPRM, **83 FR 37886** (2 Aug 2018), § “Lesser of” Rule for Substitution Claims + worked per-unit examples — see below. Final rule trail: 83 FR 64942 (18 Dec 2018). Still prefer an HQ ruling letter with a filed-claim dollar walk if located later.  
4. Confirm whether any Part 190 text restates § 1313(j)(5) “other” basket (statute may be the only primary for that trap).

## CBP Federal Register — lesser-of (primary agency prose)

**83 FR 37886** (Aug 2, 2018) — CBP NPRM implementing TFTEA-Drawback (govinfo PDF). Agency summary:

- TFTEA substitution claims are generally subject to a “lesser of” rule: refund = **99 percent of the lesser of** (1) duties/taxes/fees **paid** on the imported merchandise, or (2) duties/taxes/fees that **would apply** to the substituted merchandise if imported.
- Claimants must provide the comparative (“lesser of”) value as part of a substitution claim.
- Lesser-of **does not** apply to certain alternative standards (wine under 1313(j)(2); finished petroleum under 1313(p)) or NAFTA drawback (then).
- Per-unit averaging applies to substitution (b)/(j)(2) claims; NPRM Example 1 / Example 2 walk numeric lesser-of bases (import vs export/substitute unit values × rates).

Source: https://www.govinfo.gov/content/pkg/FR-2018-08-02/pdf/2018-16279.pdf
