# lesserof — page wireframe specs (seed paper)

**Status:** seed only. Expands `lesserof-COMPREHENSIVE-BLUEPRINT.md`.  
**Bar:** `docs/COMPREHENSIVE_PRODUCT.md`  
**Explicit non-action:** no `projects/lesserof/` today.

## Shared UI rules

| Rule | Spec |
|------|------|
| Auth | Bearer; org-scoped |
| RBAC | Analyst mutates/runs; auditor read + audit/goldens; admin settings |
| Forbidden | Dual-approver gates; “replaces ACE drawback” claims; silent 99%-always |
| Kill A footer | Specialists/ACE still file; this is a stacked-cap math experiment |

## Pages

| # | Page | Purpose |
|---|------|---------|
| 1 | Claims catalog | Filter by claim type, destination, basket status, refund |
| 2 | Claim detail | Edit line facts; run stacked lesser-of + USMCA; lock result |
| 3 | Batch | Multi-line upload; independent caps; fail-closed on one reject |
| 4 | Audit | Append-only trail + CSV |
| 5 | Goldens | Fixture browser vs live engine |
| 6 | Org settings | Members, tokens, webhook secret |
| 7 | Money honesty | Direct-ID vs substitution; USMCA zero path; Kill A |

## Critical-path proofs

| Page | Must prove |
|------|------------|
| Detail | Fixture A bind; B direct-ID uncapped; C USMCA zero |
| Detail | H/I/K rejects |
| Batch | L independence; T one-reject fails whole run |
| Honesty | Kill A sentence in DOM |
