# crewleg — idea dossier

**State:** `differentiated`  
**Framing:** method stress (not GTM vs Jeppesen/AIMS)  
**Opened:** 2026-07-21 after amendwin sustain

## Progress

- Table B algorithm paper: `docs/ideas/crewleg-table-b-algorithm.md`
- Rest paper (simplified 10h): `docs/ideas/crewleg-rest-algorithm.md`
- Challenge A: `docs/ideas/crewleg-challenge-A.md`
- G5 cases + G6 draft: `crewleg-G5-cases.md`, `crewleg-G6-summary.md` — **do not build yet**
- Fixtures A–U + checker green
- Challenges A–C; gate scorecard: **do not build yet**
- Next: concurrency/theater-cheat reject specs; then reassess ready_to_build

## Problem (G1 draft)

Airline/crew ops must refuse illegal pairings before release. FAR 117 (14 CFR Part 117) sets flight duty period (FDP) limits by report time, number of flight segments, and acclimatization; rest requirements look backward. Spreadsheets and legacy crew systems mis-handle edge cases (night FDP, split duty, unknown acclimatization). Pain: illegal pairing reaches the line; FAA / certificate holder risk.

**Named user:** crew scheduler / crew legal desk at a Part 121 carrier (or training lab).  
**Frequency:** every pairing release cycle (daily+).  
**Workaround today:** vendor crew systems + tribal spreadsheets for edge audits.

## Unique claim (G2 candidate)

**If we remove FAR 117 table-driven FDP/rest legality evaluation (report clock × segment count × acclimated flag → max FDP; rest lookback), the remaining product is identical to a generic calendar/booking FSM.**

Non-isomorphic vs:

| Prior product | Why different |
|---------------|---------------|
| meetslot / waitlist | Booking slots ≠ regulatory duty tables |
| amendwin | Protocol visit windows ≠ crew FDP/rest tables |
| lotblast | Genealogy DAG ≠ duty legality |
| dual-gate wave | Not ceiling + dual signer |

## Kill rounds (G3 — open)

1. **Kill A — incumbents:** Jeppesen, AIMS, Sabre crew, etc. exist. **Stands for GTM.** Survives as **method stress** if digests do not claim vendor replacement.
2. **Kill B — too niche:** Part 121 ops are niche but rules are public and falsifiable — soft park, not instant kill for method stress.
3. **Kill C — offline/social:** Pairing politics exist; core legality math is still software-checkable.

## Falsifiers (G4 draft)

1. Experts say FAR 117 tables in fixtures are wrong in ≥2 standard scenarios → abandon.
2. After smoke, critical path still requires a spreadsheet to answer “is this pairing legal?” for the happy path → abandon.

## Depth test outline (G5 draft)

- Happy: acclimated day FDP within table → legal
- Boundary: one minute over max FDP → illegal
- Night FDP reduced table
- Segment count steps max FDP down
- Unacclimated vs acclimated different max
- Rest lookback insufficient → illegal
- Concurrent edit of pairing version conflict
- Expert cheat: re-label report local time zone to fake legality → reject

Target ≥25 named cases before `ready_to_build`.

## Decision

**`framed`** — continue IDEA_DEPTH. Do **not** open `projects/crewleg/` yet.
