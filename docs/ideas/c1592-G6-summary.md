# Research summary — c1592 (G6)

Skeptical senior-eng bar. **`current_idea`**. Research / hours hold — **do not build yet**.

## 1. Problem

Importers budget a flat customs civil penalty. **19 U.S.C. § 1592(c)** sets statutory **maximums** that branch on culpability and on whether duties/taxes/fees were lost — lesser-of domestic value vs N× loss, or % of dutiable value when there is no loss. Fraud is capped at domestic value (sometimes *below* a gross-negligence 4× path).

## 2. Why prior products don’t cover it

- **oshamult** — OSHA serial % cuts, not customs culpability maxima  
- **lesserof** — drawback refund cap, not penalty max  
- **depositgap** — deposit vs assessed + interest, not § 1592(c)  
- **ptax4975** — IRC § 4975 year-parts excise, not CBP civil penalties  
- Dual-gate / days boards — isomorphic anti-pattern  

## 3. Unique claim + invariants

- Fraud → `penalty_max = domestic_value`  
- Duty loss > 0 → `min(domestic, multiple × duty_loss)` with multiple 2 or 4  
- Duty loss = 0 → `pct × dutiable` with pct 0.20 or 0.40  
- Reject: flat_2x_cheat, dual_approver_cheat, ignore_domestic_cap when understating  
- Fences: not mitigated guidelines; not automatic PD  

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A — incumbents | Stands commercially (counsel/CBP). Survive as method experiment. |
| B — niche | Soft survive; high $ per case. |
| C — offline/legal | Survive with PD + mitigation fences; not a negotiation engine. |

## 5. Falsifiers

See `c1592-FALSIFIERS.md` — wrong branch vs counsel; flat 2× still wins critical path; dishonest framing.

## 6. Depth test outline

**30** dual-green fixtures (`check-c1592-fixtures.mjs` / `check-c1592-dual.mjs`). G5 outline: `c1592-DEPTH-TESTS.md`.

## 7. Decision

**Still researching — do not build yet.**

Tick floor met (3/3). Fixture floor met (30≥25). Architect pack VISION/ROADMAP/PRD/ERD on paper. **Hours hold** still open (~0.8h left at last check). Flip only after `check-c1592-hour-status.mjs` → `FLIP_PATH_READY`, then walk `c1592-FLIP-DAY-SCRIPT.md`.

## Explicit non-actions

No `projects/c1592/`. Digests: statutory-max forecast only (`c1592-DIGEST-HOLD.md`).
