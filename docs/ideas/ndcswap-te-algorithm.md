# ndcswap — TE substitution algorithm (paper)

Cite: FDA Orange Book preface — https://www.fda.gov/drugs/development-approval-process-drugs/orange-book-preface  
(A codes substitutable among pharmaceutically equivalent products; B codes not; AB1/AB2 only match same three-character code.)

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
2. Both TE codes are substitutable (`A…`); B-codes reject
3. AB family: plain `AB` only matches `AB`; `AB1`/`AB2`/… must match exact suffix; non-AB A-codes (`AA`,`AT`,…) must match exactly (no `AA`↔`AB`)
4. `daw` blocks when in `{1, 2, 6, 7, 9}` (see Challenge B / NCPDP map); `{0, 3, 4, 8}` proceed to TE
5. `!brand_medically_necessary`

Reject otherwise with reason codes.

## Anti-patterns

- Dual-signer “pharmacist approve”
- Ignoring TE suffix mismatch (AB1 vs AB2)
- Treating any same-ingredient as OK

Still research. No product code.
