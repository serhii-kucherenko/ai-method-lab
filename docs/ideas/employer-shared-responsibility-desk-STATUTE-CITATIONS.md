# Employer Shared Responsibility Desk — statute citations (paper)

**Display name:** Employer Shared Responsibility Desk  
**Slug:** `employer-shared-responsibility-desk`  
**State:** research / framing — **not** `ready_to_build`  
**Docs only.** Citations for the paper algorithm in `employer-shared-responsibility-desk-algorithm.md`. Digests and UI titles use the mature display name — **never** brand `esrp4980h` or `§4980H`. Statute cites may appear in footnotes and this file.

---

## Honesty first — amounts index every year

The statute’s base dollars (**$2,000** for the (a)/(c)(1) applicable payment amount and **$3,000** for the (b)(1) amount) are **increased for calendar years after 2014** by the premium adjustment percentage, then **rounded down to the next lowest multiple of $10** (§ 4980H(c)(5)).

**Paper and any future fixtures must pin a calendar year and cite that year’s revenue procedure (or successor).** Do not hard-code one year’s dollars as if they were permanent statute text. When the year rolls, refresh the citation table — wrong-year indexing is an explicit reject in the algorithm doc.

---

## Primary — Internal Revenue Code

| Cite | Role for this desk |
|------|--------------------|
| **[26 U.S.C. § 4980H](https://www.law.cornell.edu/uscode/text/26/4980H)** | Employer shared-responsibility assessable payments |
| **§ 4980H(a)** | Assessable payment when ALE fails to offer MEC to substantially all FT employees (and dependents) and at least one FT employee receives a PTC for Exchange coverage — formula uses FT count **minus 30** (floored at 0) times 1/12 of the (c)(1) applicable payment amount |
| **§ 4980H(b)(1)** | Assessable payment when coverage is offered but a FT employee receives a PTC because the offer is unaffordable or does not provide minimum value — count of such employees × 1/12 of the (b)(1) applicable payment amount (base $3,000, indexed) |
| **§ 4980H(b)(2)** | **Monthly cap:** (b) payment for a month shall not exceed the (a) payment that would apply for that month |
| **§ 4980H(c)(1)** | Applicable payment amount for (a) — base **$2,000**, indexed |
| **§ 4980H(c)(2)** | Definitions / FT employee concepts (paper takes monthly FT count as input; lookback fenced) |
| **§ 4980H(c)(4)** | Applicable large employer — paper takes `is_ale` as input after a simplified FTE-threshold fence |
| **§ 4980H(c)(5)** | **Indexing** of the $2,000 / $3,000 amounts by premium adjustment percentage; round down to next lowest $10 |

Plain text portal: https://www.law.cornell.edu/uscode/text/26/4980H

---

## Indexed amounts — IRS revenue procedures (known recent)

IRS publishes calendar-year adjustments (typically as a **Revenue Procedure**). HHS publishes the premium adjustment percentage used in the math.

| Calendar year | Instrument | (a) / (c)(1) adjusted $2,000 | (b)(1) adjusted $3,000 | Notes |
|---------------|------------|------------------------------|------------------------|-------|
| **2026** | **Rev. Proc. 2025-26** | **$3,340** | **$5,010** | Premium adjustment percentage **1.6726771319**; effective for taxable years and plan years beginning after Dec 31, 2025. PDF: https://www.irs.gov/pub/irs-drop/rp-25-26.pdf — also IRB 2025-33 |
| Prior years | Prior Rev. Procs / Notices | *(pin when writing year-specific toys)* | *(pin when writing year-specific toys)* | Always cite the year-matched instrument; do not backfill from memory without the PDF |

**Fixture rule:** a toy labeled `calendar_year: 2026` must use 2026 APAs (or reject `wrong_month_indexing`). A multi-year walk needs an explicit per-month (or per-year) APA map.

---

## Regulations / definitions (context — mostly fenced from v0 math)

| Cite | Use |
|------|-----|
| Treas. Reg. **§ 54.4980H-1** through **-5** (and related) | Definitions: ALE, full-time employee, minimum essential coverage, affordability, minimum value, assessable payment mechanics |
| Affordability safe harbors (reg / guidance) | W-2, rate-of-pay, federal poverty line — **fenced** from v0; paper takes “unaffordable / no MV → in `ft_for_b`” as resolved input |

v0 does **not** re-implement the full regulatory ALE lookback or hours-of-service measurement periods.

---

## Form 1094-C / 1095-C context (reporting — not the desk’s output)

| Item | Role |
|------|------|
| **Form 1094-C** | Transmittal of ALE Information Returns — employer-level offer / ALE certification context that accompanies employee statements |
| **Form 1095-C** | Employer-Provided Health Insurance Offer and Coverage — per-employee monthly offer / coverage codes |
| **IRS Letter 226-J** | Proposed ESRP assessment correspondence — **offline / legal**; this desk forecasts dollars, it does not replace notice defense |

**Honesty:** Employer Shared Responsibility Desk may *use* the same monthly offer / FT concepts that appear on 1094-C / 1095-C workpapers, but it is **not** a substitute for ACA information reporting, e-filing, or responding to Letter 226-J.

---

## What v0 paper encodes vs fence

| Encoded in algorithm doc | Fence (cite only) |
|--------------------------|-------------------|
| Month walk; (a) vs (b) branch; offer gate; PTC trigger; (b)(2) cap; year-pinned APA ÷ 12 | Full ALE lookback / aggregation |
| `is_ale` boolean | Controlled group / predecessor employer assembly |
| Monthly FT count input | Measurement / administrative / stability periods |
| `offers_mec` / `ft_for_b` inputs | Computing affordability safe harbors from payroll |
| Reject flat annual / stack both / wrong index | Letter 226-J workflow, abatement, payment agreements |

---

## Explicit non-actions

- No `projects/employer-shared-responsibility-desk/`
- Not `ready_to_build`
- Do not claim Form 1094-C / 1095-C filing parity or IRS assessment parity in digests
- Do not treat any single year’s $3,340 / $5,010 (or any other indexed pair) as frozen statute
