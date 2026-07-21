# crewleg — rest lookback (§117.25) paper

Docs-only. Complements Table B FDP. Primary cite: https://www.law.cornell.edu/cfr/text/14/117.25

## Confirmed from §117.25 (e-CFR)

| Para | Rule (summary) | v0 status |
|------|----------------|-----------|
| (e) | ≥10 consecutive hours rest immediately before reserve/FDP; must include ≥8 uninterrupted sleep opportunity | **In v0** |
| (b) | ≥30 consecutive hours free from all duty in past 168 hours | **Next tick** (fixture P+) |
| (c) | 36h rest in new theater → acclimated + satisfies (b) | note only |
| (d) | 56h home-base rest after long longitude trip | out of v0 |
| (g) | Deadhead over Table B → rest ≥ deadhead length (min 10h) before next FDP | out of v0 |

## v0 rest rule

Legal rest iff `rest_hours >= 10` immediately before report (§117.25(e)).

Combined legality: **Table B FDP legal AND rest legal**.

## Fixtures G–I, O (encoded)

| ID | Case | Expect |
|----|------|--------|
| G | 11h rest, Table B legal | legal |
| H | 9.5h rest, Table B legal | illegal (rest) |
| I | 11h rest, Table B over | illegal (fdp) |
| O | rest exactly 10.0 | legal |

## Kill note

Sleep-opportunity self-report (f) is human — software cannot fully close it; mark out of scope for method stress.

Still research. No product code.
