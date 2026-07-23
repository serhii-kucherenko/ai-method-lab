# irc6651 — paper algorithm (research)

**Docs only.** Encodes the unique claim for paper toys / dual checkers. Not product code. Not mitigated abatement.

## Inputs

| Field | Meaning |
|-------|---------|
| `net_amount_due` | § 6651(b)(1) FTF base after payment due date (fixed for the return) |
| `unpaid_by_month` | Array of unpaid tax at **start** of each month (FTP bases) |
| `unfiled_months` | Count of months (incl. partial) the return is late for FTF accrual (cap at 5 months of accrual) |
| `ftp_months` | Length of `unpaid_by_month` (months FTP can accrue) |
| `levy_bump_after_month` | 0-based index: months with index ≥ this use 1% FTP; `null` = never |
| `min_floor` | Indexed >60-day minimum table amount (e.g. 510 for 2025); `0` if not >60 days |
| `apply_minimum` | true when >60 days late file |
| `flat_55_cheat` | reject if true |
| `dual_approver_cheat` | reject if true |
| `interest_as_penalty` | reject if true |
| `installment_025_silent` | reject if true (v0 must not silently use 0.25%) |

## Walk

1. Reject cheats / non-positive nonsense.
2. For each month `i` in `0 .. max(unfiled_months, ftp_months)-1`:
   - `ftp_rate = (levy_bump_after_month != null && i >= levy_bump_after_month) ? 0.01 : 0.005`
   - `ftp_i = (i < ftp_months) ? ftp_rate * unpaid_by_month[i] : 0`
   - `ftf_raw_i = (i < unfiled_months && i < 5) ? 0.05 * net_amount_due : 0`
   - If both `ftf_raw_i > 0` and `ftp_i > 0`: `ftf_i = max(0, ftf_raw_i - ftp_i)` else `ftf_i = ftf_raw_i`  // § 6651(c)(1)
3. Sum FTF and FTP. Cap FTF at 25% of `net_amount_due`. Cap FTP at 25% of max unpaid (or net if unpaid empty).
4. If `apply_minimum` and FTF sum < `min(min_floor, net_amount_due)`: set FTF = `min(min_floor, net_amount_due)` (lesser-of). Do **not** let (c)(1) push FTF below this floor when the minimum sentence applies (expert cheat V).
5. Return `{ status, ftf, ftp, combined, branch }`.

## Dual impl

`check-irc6651-toys.mjs` ships A (month walk) and B (closed-form per toy shape) — both must match expected dollars on named toys.
