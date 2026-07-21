# oshamult — algorithm paper (seed draft)

**State:** seed only. Behind depositgap / lesserof. Not framed. Not `current_idea`.  
**Not an oracle. No product folder.**

## Goal

Forecast an OSHA **proposed civil penalty** from a **gravity-based penalty (GBP)** by applying FOM Ch. 6 **serial** reduction factors — not a flat “statutory maximum” accrual.

Primary: OSHA Field Operations Manual Chapter 6 (Penalties and Debt Collection); 29 U.S.C. § 666; 29 CFR § 1903.15.  
Cite: https://www.osha.gov/fom/chapter-6

## Inputs (v0)

| Field | Meaning |
|-------|---------|
| `classification` | `serious` \| `other` \| `willful` \| `repeat` \| `fta` |
| `gravity_tier` | `low` \| `moderate` \| `high` (serious gravity; informational for Quick Fix gate) |
| `gbp` | Gravity-based penalty dollars (input — do not invent GBP table in v0) |
| `employees` | Max employees nationwide prior 12 months (size bucket) |
| `good_faith_pct` | 0–0.25 (FOM max 25% for eligible classifications) |
| `history_pct` | 0–0.20 (FOM history reduction; post-2025 guidance up to 20%) |
| `quick_fix_pct` | 0–0.15 (Quick Fix; ineligible for high-gravity serious / willful / repeat / FTA) |
| `additive_cheat` | if true → reject (must not sum percentages then apply once) |

## Size reduction (v0 table — Jul 2025 FOM update shape)

| Employees | Size reduction |
|----------:|---------------:|
| 1–25 | 70% |
| 26–100 | 30% |
| 101–250 | 10% |
| 251+ | 0% |

Exact bucket edges can be re-locked against the live FOM table; digests must not claim OIS parity.

## Procedure (v0)

1. Reject if `gbp` ≤ 0 or `employees` < 1.  
2. Reject if `additive_cheat === true`.  
3. Classification gates:  
   - If `classification` ∈ {`willful`, `repeat`, `fta`}: `good_faith_pct` must be **0** (else reject). FOM: no good-faith reduction for willful; willful on inspection blocks good faith.  
   - If `classification` ∈ {`willful`, `repeat`, `fta`} **or** (`classification === serious` && `gravity_tier === high`): `quick_fix_pct` must be **0** (else reject).  
4. Look up `size_pct` from employees table.  
5. Apply **serially** to GBP (order locked to current FOM prose): **Size → Good Faith → History → Quick Fix**:  
   `p = gbp`  
   `p *= (1 - size_pct)`  
   `p *= (1 - good_faith_pct)`  
   `p *= (1 - history_pct)`  
   `p *= (1 - quick_fix_pct)`  
6. Return `{ status: "ok", proposed: p, size_pct, steps: [...] }`.

## Worked toy (illustrative — not a live citation)

| Input | Value |
|-------|-------|
| classification | serious |
| gravity_tier | moderate |
| gbp | $7,000 |
| employees | 20 → size 70% |
| good_faith_pct | 25% |
| history_pct | 20% |
| quick_fix_pct | 15% |

Serial: 7000 → 2100 → 1575 → 1260 → **$1,071** proposed.  
Additive cheat (70+25+20+15=130%) would be nonsense / reject.

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Accrue at statutory max only | Misses GBP + serial reductions |
| Sum % then apply once | Not FOM serial math |
| Dual-approver status board | Dual-gate clone |
| Size cut on willful + good faith | Classification gate fail |

## Explicit non-actions

No fixtures activation as `current_idea`. Prefer depositgap after htsroute. Checker: `check-oshamult-fixtures.mjs` (seed paper only).
