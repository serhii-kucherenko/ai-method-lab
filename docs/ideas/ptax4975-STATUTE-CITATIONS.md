# ptax4975 — statute citations (seed)

**State:** framed research (`current_idea`). Closes the “quote amount-involved / taxable period” gap.

## Primary — 26 U.S.C. § 4975

| Subsection | Rule |
|------------|------|
| **(a)** | Initial tax = **15%** of the amount involved for **each year (or part thereof)** in the taxable period |
| **(b)** | If not corrected within the taxable period → additional tax = **100%** of the amount involved |
| **(f)(2)** | Taxable period = from PT date to earliest of deficiency notice, first-tier assessment, or correction |
| **(f)(4)** | **Amount involved** = greater of money/FMV given or money/FMV received; services (certain (d)(2)/(10) cases) = **excess compensation only**. FMV for (a) = date of PT; for (b) = **highest FMV during the taxable period** |
| **(f)(5)** | Correction = undo to the extent possible; plan no worse than highest fiduciary standard |

Plain text: https://www.law.cornell.edu/uscode/text/26/4975

## Regulations / guidance

| Cite | Use |
|------|-----|
| Temp. Treas. Reg. **§ 141.4975-13** | Points amount-involved / correction terms to foundation regs to the extent shared with § 4941 |
| Treas. Reg. **§ 53.4941(e)-1** | Controlling descriptions for shared “amount involved” concepts (use-of-money period measures, etc.) |
| Rev. Rul. **2006-38** | Worked discussion of amount involved / taxable period interplay (IRS) — https://www.irs.gov/pub/irs-drop/rr-06-38.pdf |

## What v0 fixtures encode vs fence

| Encoded | Fence (not yet) |
|---------|-----------------|
| Greater-of two FMV inputs (`fmv_a`/`fmv_b`) | Highest FMV **during** taxable period for second tier only — see `ptax4975-FMV-FENCE.md` |
| 15% × year_parts + 100% if uncorrected | Full taxable-period end-date machinery (notice / assessment / correction dates) — `ptax4975-TAXABLE-PERIOD-FENCE.md` |
| Excess-compensation path | Not a separate enum — `ptax4975-EXCESS-COMP-FENCE.md` |

Digests must not claim Form 5330 / IRS parity.

## Explicit non-actions

No `projects/ptax4975/` until `FLIP_PATH_READY`.
