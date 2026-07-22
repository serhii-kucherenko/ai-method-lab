# lesserof — algorithm paper (seed draft)

**State:** active research (`current_idea`). Not `ready_to_build` until hours + preflip clear.  
**Oracle of record for numbers:** `docs/ideas/check-lesserof-fixtures.mjs` (+ dual).  
**Not a product.** Do not open `projects/lesserof/` yet.

## Inputs (per claim line)

| Field (paper) | Fixture field | Meaning |
|---------------|---------------|---------|
| `claim_basis` | `claim_type` | `direct_id` \| `substitution` |
| — | `basket_other_ineligible` | true → reject (basket-other trap) |
| `us_duty_paid` | `duties_paid` | dollars of U.S. duty on the line |
| `substitute_duty_column` | `substitute_basis` | TFTEA lesser-of substitute column (dollars) |
| — | `apply_usmca_lesser_of` | whether USMCA partner cap applies |
| `usmca_export_duty` | `usmca_partner_duty` | partner duty dollars; **0** = duty-free wipe |

## Procedure (v0 — matches fixtures)

1. Reject if basket-other ineligible flag is set.  
2. Reject bad / negative money inputs.  
3. If `direct_id` and force-lesser-of → reject.  
4. If `direct_id` and USMCA lesser-of requested → reject (v0).  
5. If `substitution` and skip-lesser-of → reject.  
6. If USMCA requested but partner duty missing → reject (no silent zero).  
7. Base:  
   - `direct_id` → `base = duties_paid`  
   - `substitution` → `base = min(duties_paid, substitute_basis)`  
8. `refund = 0.99 * base`  
9. If USMCA applies: `refund = min(refund, 0.99 * usmca_partner_duty)`  
   - Partner duty **0** → recoverable **$0** after TFTEA (wipe).  
10. Multi-line: sum independent line refunds; one reject fails the run.

## Anti-patterns

| Anti-pattern | Why |
|--------------|-----|
| Always `0.99 * paid` | Misses TFTEA + USMCA + basket |
| Dual approver on refund | Dual-gate clone |
| Encode only blog “99%” text | Kill A theater |
| USMCA flag with missing partner → silent $0 | Honesty hole (fixture Q) |
| Claiming recoverable = raw min without ×0.99 | Drifts from CFR 99% and fixtures |

## Related

- Try demo audit: `lesserof-TRY-DEMO-AUDIT.md`  
- Preflip: `lesserof-PREFLIP-CHECKLIST.md`  
- Wipe fence: `lesserof-USMCA-WIPE-FENCE.md`
