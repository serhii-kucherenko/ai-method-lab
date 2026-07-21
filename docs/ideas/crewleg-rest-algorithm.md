# crewleg — rest lookback (§117.25) paper

Docs-only. Complements Table B FDP. Cite e-CFR Part 117.

## v0 rest rule (simplified for method stress)

Before a flight duty period, a flightcrew member must be given a rest period of **at least 10 consecutive hours** measured immediately before the report time of the FDP being evaluated (§117.25 baseline for unaugmented — exact regulatory text must be checked before ready_to_build; this paper is a working model).

Inputs:

| Field | Meaning |
|-------|---------|
| `prior_duty_end` | ISO local datetime last duty ended |
| `report_at` | ISO local datetime of FDP report |
| `rest_hours` | derived: report_at − prior_duty_end |

Legal rest iff `rest_hours >= 10`.

Combined legality: **Table B FDP legal AND rest legal**.

## Fixtures G–I (draft)

| ID | Case | Expect |
|----|------|--------|
| G | 11h rest, Table B legal | legal |
| H | 9.5h rest, Table B legal | illegal (rest) |
| I | 11h rest, Table B over | illegal (fdp) |

## Kill note

If simplified 10h rest is wrong vs full §117.25 (reserve, reduced rest, etc.), expand before build — do not ship wrong rest math.

Still research. No product code.
