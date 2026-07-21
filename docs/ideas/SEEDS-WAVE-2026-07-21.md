# Parallel research seeds — wave 2026-07-21

**State:** seeds in the research log only.  
**Not** `current_idea`. **Not** framed. **No** products. **No** fixture farms.

Context: depth restart + Challenge D (Free/Free vanity). Prefer literal dollar / penalty / fee / non-zero duty mechanics. Kill capacity + dual-gate on sight (`lanehold-AUTOPSY.md`).

---

## 1. depositgap — strongest this wave

| Field | Content |
|-------|---------|
| **One-line itch** | Importers treat AD/CVD **cash deposit rates** as the final cost of goods, then get blindsided at liquidation when Commerce’s assessed rate differs — and **§ 1677g interest** compounds the cash surprise for years. |
| **Primary statute / reg** | 19 U.S.C. § 1673f (deposit vs final assessed AD duty); § 1671f (CVD twin); **§ 1677g** (interest on over/underpayments of deposits from order publication to liquidation, rate per 26 U.S.C. § 6621); 19 CFR § 351.212 (importer-specific assessment rates). |
| **Why $ stakes** | Every POR liquidation is a **bill or refund**: (assessed − deposited) × entered value, **plus statutory interest**. Not Free/Free chapter theater; not a modeling “99% of duty” story — CBP collects or refunds real cash. |
| **G2 kill risk** | Medium. Fail if reduced to “rate ceiling + dual approver” or a generic accrual timer. Must keep **deposit vs assessed rate assignment** (company-specific vs all-others / exporter) + **§ 1677g interest window** as the unique rule. |
| **Why not isomorphic** | **tariffstep** = utility stepped blocks + demand ratchet. **ndcswap** = Orange Book TE codes. **htsroute** = Ch 29 / 3003 / 3004 form gate (often Free MFN). **lesserof** = drawback substitution lesser-of-two **refund cap** under § 1313(l). **dual-gate / lanehold** = capacity ceiling + hold expiry. This is **deposit→liquidation delta + statutory interest**, a different cash path. |

Stub: `docs/ideas/depositgap-SEED.md`

---

## 2. oshamult

| Field | Content |
|-------|---------|
| **One-line itch** | EHS teams budget the **statutory maximum** per citation, while OSHA’s Field Operations Manual applies a **gravity-based penalty** then **serial** size / history / good-faith / quick-fix reductions — so accruals and settlement models are systematically wrong. |
| **Primary statute / reg** | 29 U.S.C. § 666 (civil penalties); **29 CFR § 1903.15** (proposed penalties); OSHA FOM Ch. 6 (GBP table + serial reduction factors); annual inflation adjustments under the Federal Civil Penalties Inflation Adjustment Act. |
| **Why $ stakes** | Published per-violation maxima (serious vs willful/repeat) are **dollar amounts**. Wrong serial reduction order or applying size cuts to willful/repeat invents or hides thousands per citation. |
| **G2 kill risk** | Medium–high. Looks like “tiered fee schedule” if we only store max amounts. Survive only if unique claim is **GBP × serial % reductions with classification-gated ineligibility** (willful/repeat), not a dual-signer status board. |
| **Why not isomorphic** | Not customs routing, not TE substitution, not utility demand ratchet, not drawback lesser-of, not capacity/hold. Labor-safety **penalty arithmetic** against an external FOM table. |

---

## 3. ptax4975

| Field | Content |
|-------|---------|
| **One-line itch** | Plan sponsors and parties-in-interest model a flat “excise hit,” but IRC **§ 4975** taxes **15% of the amount involved per year (or part year) in the taxable period**, then **100%** if uncorrected — and “amount involved” is a defined greater-of FMV rule (excess compensation only for certain services). |
| **Primary statute / reg** | **26 U.S.C. § 4975(a)/(b)/(f)(4)** (initial / additional tax; amount involved); parallel ERISA § 406 prohibited-transaction framework (scope fence: tax calc, not fiduciary litigation). |
| **Why $ stakes** | Excise tax is a **literal IRS dollar liability** on the disqualified person — 15% × years-in-period, then 100% second tier. Multi-year open PTs multiply cash. |
| **G2 kill risk** | Medium. Fail if “approval workflow for plan loans.” Unique rule must be **amount-involved definition + taxable-period year-parts + second-tier 100%**, not dual counsel + ceiling. |
| **Why not isomorphic** | Not HTS form, not AD deposit gap, not Orange Book, not utility blocks, not drawback lesser-of, not capacity. **ERISA/IRC excise math** with correction/taxable-period clocks (different from amendwin visit windows). |

---

## Explicit non-actions

- Do not set `matrix/CONTROLLER.json` `current_idea` to any of these.
- Do not open `projects/depositgap/`, `projects/oshamult/`, or `projects/ptax4975/`.
- Do not frame, fixture, or score until htsroute’s active slot clears **and** a separate depth tick chooses one seed.
- Prefer deepening **depositgap** first when a parallel slot opens; keep oshamult / ptax4975 as parked alternatives.
