# Employer Shared Responsibility Desk — G5 case map (paper outline)

**Slug:** `employer-shared-responsibility-desk`  
**State:** `adversarial`. Sketched on paper only — **not** a green fixture farm this tick.  
**Unique claim under test:** monthly FTE walk + **(a)/(b) branch** + **offer-of-coverage gate** + **indexed monthly applicable payment** + **(b)(2) cap vs (a)-shaped month** — not flat headcount × annual penalty, not late-file additions, not ERISA excise year-parts, not OSHA gravity, not AD/CVD deposit interest.

Target smoke alone ≥ **25** named cases. Encode goldens in later ticks (anti-conveyor).

## Suite (≥25)

| ID | Name | Expect | Intent (one line) |
|----|------|--------|-------------------|
| A01 | Happy (a) month | ok | Offer gate fails; ≥1 PTC FTE → (a)-shaped month: `(FTEs−30)×(indexed_$2000/12)` |
| A02 | Happy (b) month | ok | Offer gate passes; k PTC FTEs → `k×(indexed_$3000/12)` under (b)(2) cap |
| A03 | Happy year walk | ok | 12 months mixed (a)/(b)/zero → annual total = sum of monthly assessable amounts |
| A04 | Zero liability year | ok | Offer gate passes every month; zero PTC FTEs → assessable payment 0 |
| A05 | Partial year ALE | ok | First ALE month mid-year → months before ALE status contribute 0 |
| B01 | (a) needs PTC trigger | ok | Offer gate fails but **no** FTE with PTC that month → (a) amount 0 |
| B02 | (b) without offer pass | reject | Force (b) dollars while offer gate fails → reject / reclassify as (a) path |
| B03 | Both (a) and (b) same month | reject | Double-count (a)+(b) in one month → reject |
| B04 | (b) only some PTC months | ok | Offer passes; PTC FTEs in months 3,7,11 only → (b) those months only |
| B05 | Branch flip mid-year | ok | Months 1–6 (a)-eligible; 7–12 offer cured → branch flips with gate |
| C01 | Offer gate 95% pass | ok | Offered ≥95% FTEs (+ dependents flag on) → (b) path eligible |
| C02 | Offer gate 94% fail | ok | Offered 94% → (a) path if PTC trigger present |
| C03 | Dependents omitted | ok | Offer to FTEs but not dependents when required → gate fail → (a) shape |
| C04 | Missing offer % | reject | Null / missing monthly offer percentage → reject (no silent 100%) |
| C05 | Offer codes vs headcount mismatch | reject | Claimed 100% offer with FTE count inconsistent with offered count → reject |
| D01 | (b)(2) cap binds | ok | Many PTC FTEs → (b) month capped at same-month (a)-shaped amount |
| D02 | (b)(2) cap slack | ok | Few PTC FTEs → (b) uncapped below (a)-shaped amount |
| D03 | Cap uses wrong year index | reject | Cap computed with prior-year indexed $2000 while (b) uses current → reject |
| D04 | Cap ignores −30 | reject | Cap uses raw FTEs×rate without 30-employee reduction on (a) side → reject / score wrong |
| D05 | Annualize then divide | reject | `(FTEs×annual)/12` without month FTE / gate → reject vs oracle month walk |
| E01 | Index 2024 amounts | ok | Calendar 2024 → $2,970 / $4,460 annual applicable amounts (monthly ÷12) |
| E02 | Index 2025 amounts | ok | Calendar 2025 → $2,900 / $4,350 per Rev. Proc. 2024-14 |
| E03 | Stale index year | reject | 2025 facts with 2024 dollars (or reverse) without explicit override → reject |
| E04 | Non-multiple-of-10 toy | reject | Hand-entered applicable amount not matching published indexed table for year → reject |
| E05 | Mid-year index change | reject | Switching indexed amounts mid-calendar-year inside one assessment year → reject |
| F01 | Two EIN isolation | ok | Mutating member A’s months must not change member B’s totals (concurrency) |
| F02 | Concurrent forecast edits | ok | Two overlapping month edits on same ALE — last-write-wins with audit; no torn month totals |
| F03 | Time: assessment year lock | ok | Changing “as-of” clock after year closed must not rewrite locked monthly rows |
| F04 | Time: future month empty | ok | Months after as-of date contribute 0 until counted |
| G01 | Cheat: skip −30 | reject | Practitioner omits 30-employee reduction on (a) → reject / wrong vs oracle |
| G02 | Cheat: (b) uncapped forever | reject | Drop (b)(2) cap while PTC FTEs huge → reject |
| G03 | Cheat: reporting penalty mash | reject | Add Form 1094-C late-file dollars into assessable-payment total → reject |
| G04 | Cheat: dual-approver board | reject | Status + ceiling dual-signer costume → reject (G2 instant kill) |
| G05 | Cheat: flat per-FTE annual | reject | Single cell `FTEs × $4,350` as year total → reject vs month oracle |
| H01 | Negative FTE / PTC | reject | Negative counts → reject |
| H02 | Non-integer month index | reject | Month 0 or 13 → reject |
| H03 | Cents precision | ok | Large FTE × monthly rate → banker’s rounding rule documented in oracle notes |

**Count:** **38** sketched (A–H) — exceeds ≥25 smoke bar on paper.

## Coverage vs IDEA_DEPTH G5 bar

| Requirement | Coverage |
|-------------|----------|
| Happy path unique claim | A01–A05, B04, C01, D01–D02, E01–E02 |
| ≥5 negative / boundary | B02–B03, C04–C05, D03–D05, E03–E05, G01–G05, H01–H02 |
| (a)/(b) branches | B01–B05 |
| Offer gate | C01–C05 |
| Monthly cap | D01–D05 |
| Indexing | E01–E05 |
| Concurrency / time | F01–F04 |
| Practitioner cheat | G01–G05 |
| Estimated count ≥25 | **38** sketched |

## Explicit non-actions this tick

- Do **not** open `docs/ideas/fixtures/employer-shared-responsibility-desk-*.json` farm  
- Do **not** open `projects/employer-shared-responsibility-desk/`  
- Do **not** flip `ready_to_build`
