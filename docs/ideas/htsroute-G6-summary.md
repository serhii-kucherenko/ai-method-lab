# Research summary — htsroute (G6)

Skeptical senior-eng bar. Standalone memo. Updated 2026-07-21 (15m tick 38) after Challenge D, NY N003244, same-letter dollar pairs, and stacked-tariff fence.

## 1. Problem

Specialty pharma trade-compliance analysts must route SKUs across Chapter 29 (bulk separately defined chemicals), heading 3003 (mixed medicaments not in measured doses/retail packing), and heading 3004 (measured-dose / retail medicaments). Molecule-name spreadsheets fail the form/mixing test and create **reasonable-care / classification-error** risk — even when MFN duty is Free on both legs.

## 2. Why prior lab products don’t cover it

`ndcswap` is Orange Book TE/DAW substitution. `tariffstep` is utility block + demand ratchet. Dual-gate / `loadbay` / killed `lanehold` are capacity ceilings and timers. None encode HTS chapter/heading Notes or the omeprazole intermediate (pellets → 3003).

## 3. Unique claim + invariants

- Route family ∈ {29, 3003, 3004, Note 1(a) exclusion, reject}
- Therapeutic bulk separately-defined → 29
- Therapeutic mixture without measured dose/retail → 3003 (any bulk/other/unknown shape — not pellet-only; powder/drum twins #38/#39)
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
| D — value / shallowness | **Accepted on MFN dollars and fixture vanity.** Domain claim survives; duty-savings pitch dies for PPI Free/Free pairs. Honest base-MFN contrasts exist for acetaminophen, ibuprofen, aspirin, Eluxadoline/Viberzi (NY N302614), Vericiguat/Verquvo (NY N318947) — cite preference caveats. Stacked measures fenced out of v0 (`htsroute-STACKED-TARIFF-FENCE.md`). |

## 5. Falsifiers

1. Published rulings contradict ≥2 golden heading-route fixtures → abandon.
2. After any future smoke, analysts still need a spreadsheet for the happy-path form gate → abandon.
3. Any digest or PRODUCT.md that claims MFN duty savings for pantoprazole/omeprazole showcase pairs → abandon framing as dishonest.
4. Digests that treat fixture pass counts as market proof → abandon vanity framing.

## 6. Depth test outline

- Named suite in `htsroute-G5-cases.md` (includes value pairs and mixture-shape twins)
- **42 fixture files green** (`check-htsroute-fixtures.mjs`)
- **Dual-impl cross-check green** (`check-htsroute-dual.mjs` — 42 files + probes)
- Fixture #26 cites primary **NY N003244** (Protonix tablets → 3004 Free)
- Honest dollar pairs encoded: #32/#33 acetaminophen; #34/#35 ibuprofen; #36/#37 aspirin; #40/#41 Eluxadoline/Viberzi; #42/#43 Vericiguat/Verquvo
- Offline try demo: `demos/htsroute-try/try.html` (PPI honesty + all encoded contrasts clickable)
- Paper kits complete (`check-seed-kits.mjs`); preflip still **calendar-blocked** on framing day 2026-07-21

## 7. Decision

**Do not build yet** (calendar-day hold + Challenge D honesty).

Reasons:

1. Same-day research→build remains blocked (`block_same_day_research_to_build`).
2. Challenge D: green fixtures ≠ valuable product; MFN Free/Free on showcase PPIs.
3. Kill A still stands — experiment framing only.
4. G1 finished-pantoprazole letter residual **closed** (N003244) — that strengthens *rulings*, not *commercial value*.
5. Earliest flip: calendar ≠ 2026-07-21 via `htsroute-TOMORROW-RUN.md` + `check-htsroute-preflip.mjs` — then comprehensive day-1, **not** smoke.

**Queue after htsroute (do not activate same tick as flip):** `depositgap` → `lesserof` → `oshamult` → `ptax4975` (see `ACTIVATION_QUEUE.md`).

**Next:** day-boundary ready_to_build reassess must re-read Challenge D + VALUE-STAKES; if flipped, PRODUCT.md must forbid duty-savings claims for Free/Free pairs and keep Kill A in every digest.
