# Research summary — oshamult (G6)

Skeptical senior-eng bar. **Active research idea** after lesserof sustained (2026-07-22). Not `ready_to_build` until hours + preflip clear.

## 1. Problem

EHS teams accrue OSHA citation exposure at the **statutory maximum**, while FOM Ch. 6 applies a **gravity-based penalty** then **serial** Size → History → Good Faith → Quick Fix reductions — so accruals systematically mis-state cash.

## 2. Why prior lab products don’t cover it

Customs routing, AD deposit gaps, drawback lesser-of, dual-gate capacity timers, and Orange Book TE codes do not encode GBP × serial remaining-balance reductions with classification-gated ineligibility.

## 3. Unique claim + invariants

- GBP is an input; serial remaining-balance cuts (not additive %)
- Size ineligible on willful/repeat (v0 fixture gate)
- Good faith ineligible on willful/repeat/FTA
- Quick Fix ineligible on willful/repeat/FTA/high-gravity serious
- Statutory-max cheat and additive-cheat reject

## 4. Kill rounds

| Kill | Outcome |
|------|---------|
| A | Stands commercially — consultants/counsel already model. Survive as method/forecast experiment. |
| B | Soft survive — employers with citation exposure only. |
| C | Survive — contests/informal conferences offline. |

See `oshamult-challenge-ABC.md`.

## 5. Falsifiers

1. Live FOM table contradicts ≥2 goldens after re-fetch → re-version or abandon.  
2. After smoke, EHS still accrues at statutory max for happy path → abandon.  
3. Digests claim OIS / OSHA replacement → dishonest framing fail.

## 6. Depth test outline

- **26** fixtures green (`check-oshamult-fixtures.mjs` + dual)
- G5 ≥25 bar met (`oshamult-G5-cases.md`)
- Worked toys: $2,677.50 and $1,071 serial stacks

## 7. Decision

**Do not build yet.** `current_idea` = oshamult; hours hold open from `2026-07-22T06:20:00.000Z`.

Survive only as serial-penalty **forecast / method experiment** (Kill A stands). See `oshamult-POST-LESSEROF-STATUS.md` + `oshamult-PREFLIP-CHECKLIST.md`.

## Explicit non-actions

No `projects/oshamult/` during the hours hold. Digests must not claim OIS replacement.
