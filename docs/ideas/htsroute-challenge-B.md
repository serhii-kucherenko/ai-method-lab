# htsroute — challenge B (keyword-gate attack)

**Attack:** The algorithm is still a shallow keyword gate. `dosage_form_signal ∈ {tablet, capsule, …}` is just an enum rename of string matching. A dual-gate clone with a “form” field would pass the same tests.

## Response

### What would make the attack true

If fixtures only assert:

- `tablet` → 3004
- `bulk_drum` → 29

…and never force the **conjunction** (therapeutic ∧ (measured_dose ∨ retail_packing) ∧ form) or the **therapeutic-bulk → still 29** case, then yes — shallow.

### What must be true for the idea to survive

Future fixtures (when allowed) must include at least:

1. **Therapeutic bulk separately-defined API** → `chapter_29_chemical` (NY I89619 shape)
2. **Measured-dose medicament** → `heading_3004_medicament` (NY N325050 shape)
3. **Therapeutic true + bulk form + no measured dose + no retail packing** → not 3004
4. **note_1a_food_or_supplement** → `excluded_note_1a` even if “capsule-shaped”
5. **gri3_combination** → `reject` (refuse to guess)
6. **Missing form facts** → `reject` (no invented defaults)
7. **Expert cheat:** set `dosage_form_signal=tablet` but `measured_dose=false` and `retail_packing=false` → must not route 3004

Item 7 is the kill shot against enum theater: the enum alone is insufficient; measured_dose/retail_packing facts must bind.

### Same-molecule gap (narrowed)

Omeprazole chain on file: bulk → Chapter 29; enteric pellets bulk → heading 3003; dosage-form peers → heading 3004. A finished omeprazole capsule CROSS letter is still preferred before ready_to_build, but the middle 3003 card already kills binary clones.

## Outcome

- Algorithm revised: not binary — includes **heading 3003** for mixed bulk medicaments (omeprazole pellets).
- Keyword/enum attack **answered** by Challenge B binding rules + algorithm invariants.
- Same-molecule gap **narrowed**; golden cards #1–#3 encode the chain.
- Idea advanced to **testable / do not build**. No product folder.
