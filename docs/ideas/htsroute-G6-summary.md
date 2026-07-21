# Research summary — htsroute (G6)

Skeptical senior-eng bar. Standalone memo. Updated after Challenge D + NY N003244.

## 1. Problem

Specialty pharma trade-compliance analysts must route SKUs across Chapter 29 (bulk separately defined chemicals), heading 3003 (mixed medicaments not in measured doses/retail packing), and heading 3004 (measured-dose / retail medicaments). Molecule-name spreadsheets fail the form/mixing test and create **reasonable-care / classification-error** risk — even when MFN duty is Free on both legs.

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
| D — value / shallowness | **Accepted on MFN dollars and fixture vanity.** Domain claim survives; duty-savings pitch dies for PPI Free/Free pairs. See `htsroute-challenge-D.md` + `htsroute-VALUE-STAKES.md`. |

## 5. Falsifiers

1. Published rulings contradict ≥2 golden heading-route fixtures → abandon.
2. After any future smoke, analysts still need a spreadsheet for the happy-path form gate → abandon.
3. **New:** Any digest or PRODUCT.md that claims MFN duty savings for pantoprazole/omeprazole showcase pairs → abandon framing as dishonest.

## 6. Depth test outline

- 25 cases named (`htsroute-G5-cases.md`); #16 aliased to #8
- **30 fixture files green** (`check-htsroute-fixtures.mjs`)
- **Dual-impl cross-check green** (`check-htsroute-dual.mjs`)
- Fixture #26 now cites primary **NY N003244** (Protonix tablets → 3004)
- **Value contrast pair #32/#33:** acetaminophen bulk **6.5%** (NY R04092) vs tablets → 3004 Free — honest dollar stakes without rehabilitating PPI Free/Free

## 7. Decision

**Do not build yet** (calendar-day hold + Challenge D honesty).

Reasons:

1. Same-day research→build remains blocked.
2. Challenge D: green fixtures ≠ valuable product; MFN Free/Free on showcase PPIs.
3. Kill A still stands — experiment framing only.
4. G1 finished-pantoprazole letter residual **closed** (N003244) — that strengthens *rulings*, not *commercial value*.

**Parallel seed (research log only):** `lesserof-SEED.md` — substitution drawback lesser-of-two refund math (dollar refunds, not Free/Free chapter theater). Do not activate until htsroute frees the slot.

**Next:** day-boundary ready_to_build reassess must re-read Challenge D; if flipped, PRODUCT.md must forbid duty-savings claims for Free/Free pairs.
