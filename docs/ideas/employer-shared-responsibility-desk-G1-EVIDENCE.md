# Employer Shared Responsibility Desk — G1 evidence

**Slug:** `employer-shared-responsibility-desk`  
**State:** `framed` (provisional) — **not** `ready_to_build`  
**Display name only** — never brand the product with a statute-code id

## Named user

**Jordan Hale**, benefits finance controller at an applicable large employer (ALE) with ~420 full-time employees across two EIN members of a controlled group. Jordan owns the **year-ahead cash forecast** for employer shared-responsibility assessable payments and the **post–Letter 226-J** reconciliation against what Forms 1094-C / 1095-C already told the IRS — not the Marketplace enrollment desk, not every small employer under 50.

## Frequency

| Cadence | What happens |
|---------|----------------|
| **Monthly** | Full-time employee (FTE) headcount walk; offer-of-coverage % vs “substantially all” (~95%) gate; affordability / minimum-value flags for (b)-path months |
| **Annual (calendar year)** | Indexed applicable payment amounts change; Forms 1094-C / 1095-C filed; budget line for assessable payments locked for FP&A |
| **Episode** | IRS **Letter 226-J** proposes an assessable payment for a prior year; response packet (Forms **14764** / **14765**) due by the letter date (commonly 30 days historically; ≥90 days for many letters dated on/after late 2024 under Employer Reporting Improvement Act commentary) |

Not a daily ops board. Episode-driven cash risk with a **12-month** counting spine.

## Painful workaround today

1. **Flat “$X per employee × headcount”** annualized in a spreadsheet — ignores monthly FTE, the 30-employee reduction on the (a) path, and the (b)(2) monthly cap against what (a) would have been  
2. **Wrong branch:** treating every Marketplace subsidy month as (b) when the ALE failed the offer gate that month → should be (a)-shaped dollars  
3. **Annual dollars ÷ 12** on the wrong base (using the $3,000-indexed figure for an (a) month, or vice versa)  
4. **Stale index year** — 2024 amounts used for a 2025 forecast (or the reverse) after Rev. Proc. indexing  
5. **Letter 226-J reverse-engineering** by summing Form 14765 highlighted months without checking Line 14/16 offer codes on the filed 1095-C  
6. Mixing **reporting failure** penalties (separate Form 1094-C / 1095-C late/incorrect filing rules) into the same cell as the shared-responsibility assessable payment

## Public / regulatory evidence (cite, label)

### Primary (statute / IRS)

1. **26 U.S.C. § 4980H** — (a) no-offer path; (b) offer-but-unaffordable / no-MV / not-offered-to-that-FTE path; (b)(2) aggregate monthly cap; (c) definitions and indexed applicable dollar amounts — [House USC § 4980H](https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section4980H)  
2. **IRS — Employer shared responsibility provisions** — plain-language (a)/(b), 95% offer, monthly assessment, indexing narrative — [irs.gov/affordable-care-act/employers/employer-shared-responsibility-provisions](https://www.irs.gov/affordable-care-act/employers/employer-shared-responsibility-provisions)  
3. **IRS — Understanding your Letter 226-J** — proposed ESRP from Forms 1094-C / 1095-C matched to employee premium tax credits; not a final bill — [irs.gov/individuals/understanding-your-letter-226-j](https://www.irs.gov/individuals/understanding-your-letter-226-j)  
4. **Forms 1094-C / 1095-C** (ALE information returns) — monthly offer / coverage codes that drive IRS matching — IRS forms catalog (annual instructions)  
5. **Forms 14764 / 14765** — ESRP Response and Employee Premium Tax Credit Listing packed with Letter 226-J  
6. **Rev. Proc. 2024-14** — 2025 indexed applicable amounts: **$2,900** (adjusted $2,000) and **$4,350** (adjusted $3,000) — [irs.gov/pub/irs-drop/rp-24-14.pdf](https://www.irs.gov/pub/irs-drop/rp-24-14.pdf)  
7. **IRS ESRP page indexed table** — e.g. calendar year **2024**: **$2,970** / **$4,460** (same page as item 2)

### Secondary (industry / practitioner — demand color only, labeled)

8. **[Industry blog]** NFP — “2025 Employer Shared Responsibility Payments Indexed Amounts” — restates Rev. Proc. 2024-14 and monthly assessment reminder — [nfp.com/insights/…](https://www.nfp.com/insights/2025-employer-shared-responsibility-payments-indexed-amounts/)  
9. **[Industry FAQ PDF]** PPI Benefits — “ACA: FAQs on IRS Letter 226-J” — ALE ≥50 FTE+FTEs; Letter 226-J is preliminary; match to 1094/1095-C — practitioner color, not unique claim  
10. **[Law-firm explainer]** Anidjar / similar Letter 226-J guides — coding errors on 1095-C Lines 14/16 as common dispute fuel — **labeled blog/counsel marketing**, not statute

## Worked dollar pointer (toy — not a notice)

Illustrative **one month**, calendar year **2025** amounts from Rev. Proc. 2024-14:

| Path | Sketch |
|------|--------|
| (a)-month | Offer gate fails; ≥1 FTE with PTC → `(FTEs − 30) × ($2,900 / 12)` for that month (controlled-group allocation of the 30 omitted in toy) |
| (b)-month | Offer gate passes; 3 FTEs with PTC → `3 × ($4,350 / 12)`, **capped** at the (a)-month amount for the same FTE count |
| Naive wrong cash | `FTEs × $4,350` annualized with no month walk / no (b)(2) cap → invents budget dollars |

Paper scenarios that stress these shapes: `employer-shared-responsibility-desk-G5-cases.md`.

## Residuals (honest)

- No recorded interview with a named controller this tick (Jordan is a composite ICP from public ALE / Letter 226-J materials)  
- No redacted Letter 226-J matched line-by-line to a golden  
- **Kill A stands commercially:** IRS notices + ACA reporting vendors own production assessments  

## G1 status

**Provisional pass** — named user + frequency + painful workaround + primary IRS/statute cites + labeled industry color. **Not** enough alone for `ready_to_build` (hours hold + ticks + G4/G6 still open).
