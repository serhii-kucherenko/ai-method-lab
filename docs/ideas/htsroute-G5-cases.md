# htsroute — G5 depth cases (paper)

Named cases for the unique claim. **Encoding policy:** critical path cards may become JSON slowly; do not dump 25 green files in one tick to force a scorecard.

## Critical path (must be golden before ready_to_build)

| # | Name | Expect |
|---|------|--------|
| 1 | Omeprazole bulk API | `chapter_29_chemical` |
| 2 | Omeprazole enteric pellets bulk (mixed) | `heading_3003_bulk_medicament` |
| 3 | Dosage-form tablets (peer 3004) | `heading_3004_medicament` |
| 4 | Therapeutic bulk API, other molecule (I89619 shape) | `chapter_29_chemical` |
| 5 | Tablet enum cheat (`tablet` signal, measured_dose false, retail false) | `reject` or not 3004 |
| 6 | Note 1(a) food/supplement capsule-shaped | `excluded_note_1a` |
| 7 | GRI 3 combination flag | `reject` |
| 8 | Missing chemical_form | `reject` |

## Boundary / negative (named now; JSON later)

9. Therapeutic true + powder_bulk + separately_defined → 29  
10. Therapeutic true + mixture + bulk_pellets + no dose/retail → 3003  
11. measured_dose true + retail false + capsule → 3004  
12. measured_dose false + retail true + other form with therapeutic → 3004  
13. therapeutic false + tablet → reject (not medicament path)  
14. mixture + therapeutic + measured_dose → 3004 (not 3003)  
15. separately_defined + bulk_drum + therapeutic → 29 (not 3004)  
16. unknown chemical_form + incomplete flags → reject  
17. bulk_pellets + separately_defined (inconsistent) → reject  
18. injectable_vial + measured_dose → 3004  
19. transdermal + measured_dose → 3004  
20. note_1a true overrides tablet signals → excluded_note_1a  
21. Concurrent two SKUs independent routes (A=29, B=3004)  
22. Expert cheat: relabel bulk drum as medicament without dose/retail → not 3004  
23. Expert cheat: claim 3004 for pellets without measured dose → 3003 not 3004  
24. Zero facts object → reject  
25. Molecule name field present but ignored (anti-shallow) — route from form facts only  

## Encoding status

- **Encoded:** #1–#3 under `docs/ideas/fixtures/` (omeprazole chain).
- **Deferred:** #4–#25 (including critical rejects #5–#8).
- Ready_to_build still requires fuller suite + G6 memo + gate scorecard — not this tick alone.
