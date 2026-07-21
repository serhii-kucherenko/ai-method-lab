# htsroute — G5 depth cases (paper)

Named cases for the unique claim. Encoding grew across ticks — not a same-tick vanity farm.

## Critical path

| # | Name | Expect | Encoded |
|---|------|--------|---------|
| 1 | Omeprazole bulk API | `chapter_29_chemical` | yes |
| 2 | Omeprazole enteric pellets bulk | `heading_3003_bulk_medicament` | yes |
| 3 | Dosage-form tablets (peer 3004) | `heading_3004_medicament` | yes |
| 4 | Therapeutic bulk API (I89619 shape) | `chapter_29_chemical` | yes |
| 5 | Tablet enum cheat | `reject` | yes |
| 6 | Note 1(a) food/supplement | `excluded_note_1a` | yes |
| 7 | GRI 3 combination | `reject` | yes |
| 8 | Missing chemical_form | `reject` | yes |

## Boundary / negative

| # | Name | Encoded |
|---|------|---------|
| 9 | powder_bulk → 29 | yes |
| 10 | pellets mixture → 3003 | yes |
| 11 | capsule measured → 3004 | yes |
| 12 | retail packing → 3004 | yes |
| 13 | non-therapeutic tablet → reject | yes |
| 14 | mixture + measured → 3004 | yes |
| 15 | bulk drum → 29 not 3004 | yes |
| 16 | unknown form incomplete → reject | covered by #8 |
| 17 | pellets + separately_defined → reject | yes |
| 18 | injectable → 3004 | yes |
| 19 | transdermal → 3004 | yes |
| 20 | Note 1(a) overrides tablet | yes |
| 21 | concurrent independent SKUs | yes (batch) |
| 22 | bulk relabel cheat → 29 | yes |
| 23 | pellets not 3004 → 3003 | yes |
| 24 | zero facts → reject | yes |
| 25 | molecule name ignored | yes |

## Encoding status

- **24 fixture files green** via `node docs/ideas/check-htsroute-fixtures.mjs`
- G5 named suite effectively covered (25 cases; #16 aliased to #8)
- **Value contrast pair:** #32/#33 acetaminophen; #34/#35 ibuprofen (NY I83067 6.5% / NY N006187 Free); #36/#37 aspirin (NY 890808 non-Free / NY K87058 Free)
- G6 still **do not build yet** this calendar day (`block_same_day_research_to_build`)
- Checkers: **36** fixture files green (+ dual-impl)

