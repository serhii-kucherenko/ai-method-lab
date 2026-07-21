# depositgap — algorithm paper (seed draft)

**State:** seed only. htsroute owns the active slot.  
**Not an oracle. No product folder.**

## Goal

Forecast **cash true-up** at AD/CVD liquidation:

`duty_delta = (assessed_rate − deposit_rate) × entered_value`  
then apply **19 U.S.C. § 1677g** interest from order publication date through liquidation (rates per IRC § 6621 as used by CBP for these underpayments/overpayments — exact rate table is an input, not invented).

Sign convention: positive `duty_delta` → importer owes; negative → refund path (interest rules still apply per statute/CFR — v0 may label direction only).

## Required facts

| Field | Meaning |
|-------|---------|
| `order_type` | `AD` \| `CVD` |
| `deposit_rate` | cash deposit rate used at entry (decimal, e.g. 0.10) |
| `assessed_rate` | final importer-specific assessment rate (decimal) |
| `rate_class` | `exporter_specific` \| `all_others` \| `other` |
| `entered_value` | customs value for the line (USD) |
| `order_published_on` | date interest window starts (order publication) |
| `liquidated_on` | liquidation date (window end) |
| `interest_annual_rate` | applicable § 6621-derived annual rate for the window (input) |

## Procedure (v0)

1. Reject if `entered_value` ≤ 0 or rates missing / negative.  
2. `duty_delta = (assessed_rate − deposit_rate) × entered_value`.  
3. `days =` calendar days from `order_published_on` to `liquidated_on` (exclude or include per locked convention — **document in fixtures**; default: exclude publication day, include liquidation day, matching common “from/to” trade worksheets unless primary cite says otherwise).  
4. Simple interest toy (v0): `interest = duty_delta × interest_annual_rate × (days / 365)`.  
   Compounding / exact CBP day-count may replace this in later research — do not claim ACE parity in digests.  
5. `true_up = duty_delta + interest`.  
6. Reject “deposit_rate as final” shortcuts: if caller sets `assessed_rate = deposit_rate` **and** marks `skip_interest=true` while dates differ → reject (honesty gate).

## Worked toy (statute-shaped, not a live liquidation)

| Input | Value |
|-------|-------|
| deposit_rate | 10% |
| assessed_rate | 25% |
| entered_value | $1,000,000 |
| duty_delta | **$150,000** owed |
| days | 365 |
| interest_annual_rate | 0.08 (illustrative § 6621 stand-in) |
| interest | $12,000 |
| true_up | **$162,000** |

Use non-leap windows in toys (e.g. 2023-01-01 → 2024-01-01) so day count stays 365. Checker: `node docs/ideas/check-depositgap-fixtures.mjs` (A–J green; seed only). Case map: `depositgap-G5-cases.md`.

Cite trail: `depositgap-STATUTE-CITATIONS.md` (§ 1677g, 19 CFR 351.212).

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Status FSM + dual signer | Dual-gate clone |
| Day-count only with no deposit vs assessed | ≅ bondstrip costume |
| Claiming ACE liquidation replacement | Kill A theater |

## Next (after htsroute day-boundary)

Fixtures for deposit/assessed/interest cases — not while same-day htsroute hold owns the build gate.
