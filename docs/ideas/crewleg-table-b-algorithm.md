# crewleg — Table B FDP algorithm (paper)

Docs-only. Source of truth for future fixtures: **14 CFR Part 117 Appendix Table B** (unaugmented), via e-CFR / Cornell LII.

Primary cite: https://www.law.cornell.edu/cfr/text/14/appendix-Table_B_to_part_117  
Acclimated reduction: https://www.law.cornell.edu/cfr/text/14/117.13 (§117.13(b): not acclimated → Table B − 30 minutes; clock = last acclimated theater local time).

## Inputs

| Field | Meaning |
|-------|---------|
| `report_local` | HHMM local at last acclimated theater (or theater used per §117.13) |
| `segments` | Planned flight segments (deadhead ≠ segment for Table B) |
| `acclimated` | boolean |
| `fdp_hours` | Scheduled FDP length (report → last block-in) |

## Algorithm (unaugmented only — v0 scope)

1. Map `report_local` to Table B row band.
2. Clamp `segments` to column 1..7+ (7+ uses last column).
3. `max_fdp = TABLE_B[row][col]`.
4. If `!acclimated`: `max_fdp -= 0.5`.
5. Legal iff `fdp_hours <= max_fdp` (compare in minutes to avoid float drift).

## Table B (hours) — encode exactly

| Start (acclimated) | 1 | 2 | 3 | 4 | 5 | 6 | 7+ |
|--------------------|---|---|---|---|---|---|-----|
| 0000-0359 | 9 | 9 | 9 | 9 | 9 | 9 | 9 |
| 0400-0459 | 10 | 10 | 10 | 10 | 9 | 9 | 9 |
| 0500-0559 | 12 | 12 | 12 | 12 | 11.5 | 11 | 10.5 |
| 0600-0659 | 13 | 13 | 12 | 12 | 11.5 | 11 | 10.5 |
| 0700-1159 | 14 | 14 | 13 | 13 | 12.5 | 12 | 11.5 |
| 1200-1259 | 13 | 13 | 13 | 13 | 12.5 | 12 | 11.5 |
| 1300-1659 | 12 | 12 | 12 | 12 | 11.5 | 11 | 10.5 |
| 1700-2159 | 12 | 12 | 11 | 11 | 10 | 9 | 9 |
| 2200-2259 | 11 | 11 | 10 | 10 | 9 | 9 | 9 |
| 2300-2359 | 10 | 10 | 10 | 9 | 9 | 9 | 9 |

## Out of v0 scope (explicit)

- Augmented Table C
- Split duty credit
- Cumulative flight time (§117.23)
- Reserve / RAP
- PIC extension consent (+2h)
- Rest requirements (§117.25) — next research tick

## Anti-patterns (would fail depth)

- Treating FDP as “calendar busy hours” without Table B
- Dual-signer “legal desk approve”
- Ignoring unacclimated −30 min
- Counting deadhead as a flight segment for Table B

## Named fixture seeds (A–F draft)

| ID | Case | Expect |
|----|------|--------|
| A | 0800 report, 2 segs, acclimated, FDP 13.5h | legal (max 14) |
| B | same, FDP 14.1h | illegal |
| C | 0800, 7 segs, acclimated, FDP 12h | illegal (max 11.5) |
| D | 0800, 2 segs, **not** acclimated, FDP 13.6h | illegal (max 13.5) |
| E | 0200 report, 1 seg, acclimated, FDP 9h | legal (max 9) |
| F | deadhead + 2 flight segs counted as 3 by cheat | reject; segments=2 for table |

Still research. No product code.
