# Research summary — htsroute (G6)

Skeptical senior-eng bar. Standalone memo.

## 1. Problem

Specialty pharma trade-compliance analysts must route SKUs across Chapter 29 (bulk separately defined chemicals), heading 3003 (mixed medicaments not in measured doses/retail packing), and heading 3004 (measured-dose / retail medicaments). Molecule-name spreadsheets fail the form/mixing test and create duty / reasonable-care risk.

## 2. Why prior lab products don’t cover it

`ndcswap` is Orange Book TE/DAW substitution. `tariffstep` is utility block + demand ratchet. Dual-gate / `loadbay` / killed `lanehold` are capacity ceilings and timers. None encode HTS chapter/heading Notes or the omeprazole intermediate (pellets → 3003).

## 3. Unique claim + invariants

- Route family ∈ {29, 3003, 3004, Note 1(a) exclusion, reject}
- Therapeutic bulk separately-defined → 29
- Therapeutic mixture without measured dose/retail → 3003
- Therapeutic + measured dose/retail + dose form → 3004
- Dose-form enum without measured/retail → reject (anti-keyword)
- GRI 3 combinations → reject in v0
- Molecule name is not an input

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents | **Stands commercially.** Workflow experiment only. |
| B — keyword gate | Answered: 3003 middle + consistency reject; cheat fixture green |
| C — offline/legal | Survive with no-GRI-3 scope fence |

## 5. Falsifiers

1. Published rulings contradict ≥2 golden heading-route fixtures → abandon.
2. After any future smoke, analysts still need a spreadsheet for the happy-path form gate → abandon.

## 6. Depth test outline

- 25 cases named (`htsroute-G5-cases.md`); #16 aliased to #8
- **30 fixture files green** (`check-htsroute-fixtures.mjs`)
- **Dual-impl cross-check green** (`check-htsroute-dual.mjs`) — two independent routers + synthetic probes
- Checker: `docs/ideas/check-htsroute-fixtures.mjs`

## 7. Decision

**Do not build yet** (calendar-day hold).

Reasons:

1. Same-day research→build is an explicit failure mode after the human shallow signal (`block_same_day_research_to_build`).
2. Suite is deep enough to *consider* ready_to_build on a **later calendar day** — not this one.
3. Dedicated finished-PPI CROSS letter still preferred (optional strengthen).
4. No G1 interview / specific public CF-29 pharma docket.

**Work while holding:** dual-impl testing, acceptance paper, parked-seed hygiene — **not** idle. See `LOOP_DISCIPLINE.md` (do not re-arm live loops).

**Next:** day-boundary ready_to_build reassess; then `projects/htsroute/` only if flipped.
