# lesserof — algorithm paper (seed draft)

**State:** seed only. Not framed. Not active while htsroute owns the slot.  
**Not an oracle.** Do not open `projects/lesserof/`.

## Inputs (per claim line)

| Field | Meaning |
|-------|---------|
| `claim_basis` | `direct_id` \| `substitution` |
| `hts8` | 8-digit HTS on substituted / exported article |
| `hts10` | 10-digit statistical (required when basket trap applies) |
| `us_duty_paid` | dollars of U.S. duty attributable to the line |
| `substitute_duty_column` | TFTEA lesser-of substitute column (dollars) |
| `export_destination` | `US` \| `CA` \| `MX` \| `other` |
| `usmca_export_duty` | duty that would be owed in CA/MX on like goods (dollars); 0 if duty-free |

## Procedure (v0)

1. If `claim_basis` = `direct_id` → recoverable = `0.99 * us_duty_paid` (**no** lesser-of).  
2. Else (`substitution`):  
   a. Basket trap: if 8-digit description class is “other” and (`hts10` missing or also “other”) → **ineligible** (reject).  
   b. `tftea_cap` = min(`us_duty_paid`, `substitute_duty_column`).  
   c. If `export_destination` ∈ {CA, MX}: `usmca_cap` = min(`tftea_cap`, `usmca_export_duty`) — may be **0**.  
      Else: `usmca_cap` = `tftea_cap`.  
   d. Recoverable = `usmca_cap` (already the stacked lesser-of path).  
3. Reject if someone requests lesser-of on `direct_id`, or skips lesser-of on `substitution`.

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Always `0.99 * paid` | Misses TFTEA + USMCA + basket |
| Dual approver on refund | Dual-gate clone |
| Encode only blog “99%” text | Kill A theater |

## Next (after htsroute clears)

Continue G5 toward ≥25 (`lesserof-NARROW-CLAIM.md`). Fixtures A–J already paper-green. Still no product.