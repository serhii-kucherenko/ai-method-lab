# Employer Shared Responsibility Desk — month-walk assessable payment algorithm (paper)

**Display name:** Employer Shared Responsibility Desk  
**Slug:** `employer-shared-responsibility-desk`  
**State:** research / framing — **not** `ready_to_build`  
**Docs only.** No `projects/` folder. Encodes the unique claim for paper toys / a future dual-impl checker. Not an IRS notice oracle. Not Form 1094-C / 1095-C filing software.

Statute may appear in citations and field notes. **Never** brand the product `esrp4980h` or `§4980H`.

Primary cite: [26 U.S.C. § 4980H](https://www.law.cornell.edu/uscode/text/26/4980H). Indexed dollar tables: see `employer-shared-responsibility-desk-STATUTE-CITATIONS.md`.

---

## Goal (v0 paper)

For one applicable large employer (ALE) and one calendar year, walk **each month** and forecast the **employer shared-responsibility assessable payment** under either:

- **Branch (a)** — failure to offer minimum essential coverage (MEC) to substantially all full-time employees (and their dependents), with at least one full-time employee receiving a premium tax credit (PTC) for Exchange coverage; or
- **Branch (b)** — MEC is offered, but at least one full-time employee receives a PTC because the offer is unaffordable or does not provide minimum value,

subject to the **(b)(2) monthly cap** (branch (b) dollars for a month cannot exceed what branch (a) would have been for that month).

Return monthly dollars + annual sum. Digests must say this is a **forecast**, not an assessed liability.

---

## Scope fences (explicit)

| In v0 paper math | Out of scope (fence — do not silently invent) |
|------------------|-----------------------------------------------|
| ALE yes/no as a **boolean / FTE-threshold input** | Full ALE determination lookback method, seasonal-worker exceptions, predecessor aggregation, controlled-group assembly (Treas. Reg. § 54.4980H-1 / -2) |
| Monthly full-time employee count as **input** | Measurement / administrative / stability periods; hours-of-service lookback; variable-hour reclassification mid-year |
| Offer-of-MEC gate as **boolean per month** (or year-constant flag applied each month) | 95% “substantially all” nuance, dependent-offer edge cases, limited non-assessment periods, transition relief |
| PTC-receiving FT employees count as **input** for (b) | Marketplace attestation, Form 1095-A reconciliation, affordability safe harbors (W-2 / rate-of-pay / FPL) computation |
| Indexed **annual** applicable payment amounts ÷ 12 | Multi-year mix without an explicit per-month calendar-year index table |
| (a) vs (b) exclusivity + (b)(2) cap | IRS Letter 226-J defense workflow, reasonable-cause abatement, payment plans |

If a future product needs a fenced item, open a named fence doc — do not fold it into the happy path silently.

---

## Inputs (v0)

| Field | Meaning |
|-------|---------|
| `is_ale` | `true` if employer is an applicable large employer for the year (paper: caller already applied the ≥50 FTE threshold; lookback complexity fenced) |
| `calendar_year` | Tax year whose indexed amounts apply (e.g. `2026`) |
| `apa_a_annual` | Indexed applicable payment amount used for branch (a) — statute base $2,000 under § 4980H(c)(1), indexed for `calendar_year` |
| `apa_b_annual` | Indexed applicable payment amount used for branch (b)(1) — statute base $3,000, indexed for `calendar_year` |
| `months[12]` | Per-month facts (index `0..11` = Jan..Dec of `calendar_year`) |

### Per-month record `months[m]`

| Field | Meaning |
|-------|---------|
| `ft_employee_count` | Full-time employees for the month (≥ 0 integer) |
| `offers_mec` | `true` if employer offers MEC to substantially all FT employees (and dependents) for that month — **offer gate** |
| `ft_with_ptc` | Count of FT employees who received a PTC for Exchange coverage for that month (triggers liability when > 0 under the applicable branch) |
| `ft_for_b` | Count of FT employees for whom branch (b) would assess (typically those with PTC because offer unaffordable / not minimum value). If omitted, paper toys may set `ft_for_b = ft_with_ptc` when `offers_mec` |

### Cheat / reject flags (must reject, never compute around)

| Flag | Meaning |
|------|---------|
| `flat_annual_cheat` | Caller asks for a single flat annual “penalty × headcount” instead of a month walk |
| `ignore_offer_gate` | Compute dollars while skipping whether MEC was offered |
| `stack_a_and_b_full` | Apply full (a) **and** full (b) for the same month without exclusivity / (b)(2) |
| `wrong_month_indexing` | Use a single year’s APA for months belonging to another calendar year, or mix years without a per-month index map |
| `dual_approver_cheat` | Dual-signer workflow costume (isomorphic dual-gate — reject) |

---

## Monthly rates

```
monthly_a = apa_a_annual / 12
monthly_b = apa_b_annual / 12
```

**Invariant:** rates are **month-of-calendar-year** indexed amounts, not a lifetime constant and not an employer-chosen “budget rate.”

---

## Month walk (step list a dual-impl checker can encode)

```
function assess(inputs) -> { status, months[], annual_total, rejects[] }

1. Reject if any cheat flag is true:
   - flat_annual_cheat        → reject("flat_annual_cheat")
   - ignore_offer_gate        → reject("ignore_offer_gate")
   - stack_a_and_b_full       → reject("stack_a_and_b_full")
   - wrong_month_indexing     → reject("wrong_month_indexing")
   - dual_approver_cheat      → reject("dual_approver_cheat")

2. Reject bad inputs:
   - apa_a_annual ≤ 0 or apa_b_annual ≤ 0 or not finite
   - months length ≠ 12
   - any ft_employee_count < 0 or ft_with_ptc < 0 or ft_for_b < 0
   - any ft_with_ptc > ft_employee_count (paper strictness)
   - any ft_for_b > ft_employee_count

3. If is_ale === false:
   - For every month: payment = 0, branch = "not_ale"
   - annual_total = 0
   - return ok (non-ALE → no assessable payment under this desk)

4. monthly_a = apa_a_annual / 12
   monthly_b = apa_b_annual / 12

5. For m in 0..11:
   let ft = months[m].ft_employee_count
   let offered = months[m].offers_mec
   let ptc = months[m].ft_with_ptc
   let ft_b = months[m].ft_for_b ?? (offered ? ptc : 0)

   // Trigger: at least one FT employee with PTC (statute requires this for assessment)
   if ptc <= 0:
       payment = 0
       branch = "no_ptc_trigger"
       continue

   if offered === false:
       // Branch (a): (FT employees − 30, floored at 0) × monthly_a
       // Fence: paper uses raw FT count; does not subtract FT in limited non-assessment periods
       a_heads = max(0, ft - 30)
       payment_a = a_heads * monthly_a
       payment = payment_a
       branch = "a"
       // Exclusivity: do NOT also add branch (b) for this month
   else:
       // Branch (b): ft_for_b × monthly_b
       payment_b_raw = ft_b * monthly_b

       // (b)(2) monthly cap = what (a) would have been this month
       a_heads_cap = max(0, ft - 30)
       payment_a_cap = a_heads_cap * monthly_a
       payment = min(payment_b_raw, payment_a_cap)
       branch = (payment < payment_b_raw) ? "b_capped" : "b"

   record months[m] = { payment, branch, payment_a_cap?, payment_b_raw? }

6. annual_total = sum(months[*].payment)

7. return { status: "ok", months, annual_total, monthly_a, monthly_b }
```

---

## Algorithm invariants (must hold on every ok toy)

1. **ALE gate** — Non-ALE → all months zero; no (a)/(b) dollars.
2. **PTC trigger** — If `ft_with_ptc == 0` for a month → that month’s payment is 0 (no assessable payment without the credit trigger).
3. **Offer gate exclusivity** — `offers_mec == false` → branch **(a) only**; `offers_mec == true` → branch **(b)** path only (never both full stacks).
4. **(a) thirty reduction** — Branch (a) uses `max(0, ft − 30)`, not raw headcount and not an annualized 30 once.
5. **(b)(2) cap** — Branch (b) payment for a month ≤ the (a) amount that would apply for that same month (same `ft`, same `monthly_a`).
6. **Month indexing** — `monthly_a` / `monthly_b` come from the **calendar year’s** indexed APAs ÷ 12; wrong-year APAs → reject (`wrong_month_indexing`).
7. **No flat annual cheat** — Annual total is the **sum of monthly** payments, never `12 × one rate × one headcount` invented outside the walk.
8. **Reject theater** — Cheat flags and dual-approver costume never produce `status: "ok"` dollars.

---

## Explicit rejects (anti-patterns)

| Anti-pattern | Why rejected |
|--------------|--------------|
| Flat annual cheat (“$X × FTEs × 12”) | Misses month walk, −30 per month, offer gate, and (b)(2) cap |
| Ignore offer gate | Collapses (a) vs (b); invents cash |
| Apply (a) + (b) both full | Statute treats failure-to-offer vs offer-but-unaffordable as separate regimes; (b)(2) caps (b) against (a), it does not stack both full |
| Wrong month indexing | APA indexes by calendar year; mixing 2025 rates into 2026 months (or vice versa) is wrong cash |
| Dual approver / status rename FSM | Isomorphic dual-gate — not this domain |

---

## Worked paper toys (illustrative; use cited-year APAs in fixtures)

Assume `is_ale = true`, calendar year **2026**, `apa_a_annual = 3340`, `apa_b_annual = 5010` (Rev. Proc. 2025-26 — see citations doc).  
`monthly_a = 3340/12`, `monthly_b = 5010/12`.

| Story | Month facts | Result shape |
|-------|-------------|--------------|
| Non-ALE | `is_ale=false`, any FT | All months **$0**, branch `not_ale` |
| No PTC | `ft=100`, `offers_mec=false`, `ptc=0` | **$0**, `no_ptc_trigger` |
| Branch (a) | `ft=100`, `offers_mec=false`, `ptc=1` | `(100−30) × monthly_a` |
| Branch (b) uncapped | `ft=100`, `offers_mec=true`, `ft_for_b=2`, `ptc=2` | `2 × monthly_b` if that is ≤ `(100−30)×monthly_a` |
| Branch (b) capped | `ft=40`, `offers_mec=true`, `ft_for_b=20`, `ptc=20` | `min(20×monthly_b, (40−30)×monthly_a)` → typically **cap binds** |
| Flat annual cheat | flag true | **reject** |
| Stack (a)+(b) | flag true | **reject** |

Exact dollar fixtures belong in a later `docs/ideas/fixtures/` pass — this file is the assessable algorithm, not the toy catalog.

---

## Dual-impl checker sketch (later — not this tick)

When research reaches testable toys:

- **Impl A:** month walk as above (reference).
- **Impl B:** closed form per toy shape (e.g. constant facts × 12; or single-month focus).
- Both must match expected `{ branch, payment }` on named fixtures; cheat flags must reject identically.

Suggested future names (docs only): `check-employer-shared-responsibility-desk-toys.mjs`, `check-employer-shared-responsibility-desk-dual.mjs`.

---

## Explicit non-actions

- No `projects/employer-shared-responsibility-desk/`
- Not `ready_to_build`
- Never brand `esrp4980h` or `§4980H` in product-facing titles
- Digests must not claim IRS Letter 226-J parity or Form 1094-C filing replacement
