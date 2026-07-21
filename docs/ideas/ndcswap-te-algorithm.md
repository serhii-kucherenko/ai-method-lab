# ndcswap — TE substitution algorithm (paper)

Docs-only. Working model for method stress — not a full Orange Book dump.

## Inputs

| Field | Meaning |
|-------|---------|
| `prescribed_ndc` | 11-digit NDC (normalized) |
| `candidate_ndc` | proposed dispense NDC |
| `te_code_prescribed` | Orange Book TE for RLD/prescribed product |
| `te_code_candidate` | TE for candidate |
| `same_ingredient_strength_form` | boolean (must match) |
| `daw` | Dispense as written code (0–9 simplified) |
| `brand_medically_necessary` | boolean |

## v0 allow rule

Allow substitution iff ALL:

1. `same_ingredient_strength_form`
2. Both TE codes are substitutable class (start with `A`, e.g. `AB`, `AB1`, `AB2` matching where required)
3. If TE has a numeric suffix (AB1/AB2), suffixes must match
4. `daw` not in `{1, 2}` (physician/patient DAW — simplified; exact NCPDP mapping later)
5. `!brand_medically_necessary`

Reject otherwise with reason codes.

## Anti-patterns

- Dual-signer “pharmacist approve”
- Ignoring TE suffix mismatch (AB1 vs AB2)
- Treating any same-ingredient as OK

Still research. No product code.
