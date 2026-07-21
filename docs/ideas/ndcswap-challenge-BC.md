# ndcswap — Challenge B (NCPDP DAW)

Cite: ResDAC / NCPDP Dispense as Written (Product Selection) codes 0–9  
https://resdac.org/cms-data/variables/dispense-written-daw-product-selection-code

## v0 substitution-allow mapping (method stress)

| DAW | Meaning (summary) | Allow TE-based generic substitute? |
|-----|-------------------|-------------------------------------|
| 0 | No product selection indicated | Yes (if TE ok) |
| 1 | Substitution not allowed by prescriber | **No** |
| 2 | Patient requested brand | **No** (brand path) |
| 3 | Pharmacist selected product | Yes (TE still required) |
| 4 | Generic not in stock | Yes for alternate TE generic if stocked (v0: TE only) |
| 5 | Brand dispensed as generic | Out of scope for “generic substitute” path |
| 6 | Override | Fail-closed → **No** |
| 7 | Brand mandated by law | **No** |
| 8 | Generic not in marketplace | Yes for other TE generics if exist (v0: TE only) |
| 9 | Plan requests brand | **No** for generic substitute path |

## Fixtures

- Existing D/I: DAW 1/2 block
- New: DAW 7 block; DAW 3 allow when TE ok; DAW 6 fail-closed

## Outcome

DAW is claim metadata, not a dual-signer. Held. Advance to scorecard / ready_to_build.
