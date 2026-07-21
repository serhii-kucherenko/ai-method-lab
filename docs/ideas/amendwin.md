# amendwin — idea dossier

**State:** `ready_to_build` (method stress)  
**Kind:** method stress candidate — not GTM vs Medidata/Veeva  
**Opened:** 2026-07-21 after lotblast sustain

## One-line

Versioned clinical protocol visit windows: score visits against the protocol version in force on the visit date; locked visits never reclassify when amendments publish.

## G2 claim

**If we remove amendment-aware window binding (visit scored against protocol version effective on visit date) and non-retroactive lock, the remaining product is a status FSM + dual QA clear — isomorphic to lottrack / dual-gate wave.**

## Evidence pack

- Algorithm: `amendwin-window-algorithm.md`
- Fixtures A–F + `check-amendwin-fixtures.mjs` (green)
- Challenges: `amendwin-challenge-A.md`, `amendwin-challenge-BC.md`
- G6: `amendwin-G6-summary.md`
- Scorecard: `amendwin-GATE-SCORECARD.md`
- FDA draft: https://www.fda.gov/media/184745/download

## Non-goals

Full EDC replacement; dual-signer as unique claim; commercial displacement of Veeva/Medidata.
