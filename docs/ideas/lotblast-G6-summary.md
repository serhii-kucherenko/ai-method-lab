# Research summary — lotblast (G6 draft)

Skeptical senior-eng bar. This memo must stand alone.

## 1. Problem

When a suspect ingredient lot is identified, a mid-chain food facility must know within hours which finished lots, shipments, and trading partners are in the blast radius — and produce CTE/KDE records as an electronic sortable spreadsheet within 24 hours under FSMA 204. Spreadsheet archaeology and “give us three days” fail that clock.

## 2. Why prior lab products don’t cover it

`lottrack` is flat lots + quarantine + dual QA clear. Noun-swap FSMs and the dual-gate wave (ceiling/floor/days + dual signer) have no transformation DAG, no recursive forward/backward trace, and no FDA-shaped multi-sheet export. Removing dual-control from those products leaves CRUD; removing genealogy from lotblast leaves lottrack.

## 3. Unique claim + invariants

- Lots + consume edges form a **DAG**; cycles and over-consume reject.
- **Forward blast** and **backward trace** are deterministic graph walks (see `lotblast-blast-algorithm.md`).
- Shared inputs expand blast; diamond paths visit finished TLCs once; in-channel = produced − shipped − consumed-as-input.
- Mock recall locks the scoped subgraph and exports Receiving / Transformation / Shipping sheets per `lotblast-export-contract.md`.

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents (Nulogy, ERP, etc.) | **Stands for GTM.** Survive only as **method stress** (can A03+A10 hold this domain?). Digests must not claim market novelty. |
| B — rare recalls | Conditional survive if product centers mock-recall + continuous genealogy, not incident theater. |
| C — offline/legal hard part | Survive if scope stays computation + record pack, not full recall ops. |
| D — membership ≠ mass balance | **Closed on paper** — Fixture D + algorithm; scrap does not shrink membership |

## 5. Falsifiers

1. Domain experts reject blast results on ≥2 realistic shared-ingredient fixtures.
2. After any future sustain, critical path still needs a spreadsheet to answer who to notify.

## 6. Depth test outline

- 30 named cases in `lotblast.md` (+ XOR / location completeness)
- Golden JSON fixtures A–E under `docs/ideas/fixtures/`
- Reference checker `docs/ideas/check-fixtures.mjs` (paper algorithm executable)
- Anti-pattern table in blast algorithm (parent_id-only, plant-wide blast, status cascade)

## 7. Decision

**Do not build yet.**

Remaining before `ready_to_build`:

1. ~~Resolve Kill D~~ / ~~Fixture A challenge~~ / fixtures A–F + checker
2. Gate scorecard: `lotblast-GATE-SCORECARD.md` — state **testable**, decision still hold
3. Deliberate extra research rotation(s) before code (anti-rush)
4. Promote draft brief → real brief only at build start
5. Keep method-stress honesty in every summary

No `projects/lotblast/` until then.

