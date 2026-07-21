# depositgap — post-htsroute activation run sheet

Use **only after** `htsroute` has flipped to build, parked, or killed — and **not** on the same calendar day as depositgap framing (when that day arrives). Do not activate from memory.

## Preconditions

1. `matrix/CONTROLLER.json` `current_product` is null **or** htsroute sustain is complete / parked / killed (one product phase).  
2. Calendar day is a **new** day vs depositgap framing day (once framed).  
3. Prefer this seed over lesserof / oshamult / ptax per `ACTIVATION_QUEUE.md`.

## Re-read (in order)

1. `depositgap-challenge-ABC.md` (Kill A honesty)  
2. `depositgap-VALUE-STAKES.md`  
3. `depositgap-PRODUCT-FRAMING.md`  
4. `depositgap-DAY-COUNT.md` (§ 1677g vs delinquency fence)  
5. `depositgap-GATE-SCORECARD.md`  
6. `depositgap-G6-summary.md`  
7. `depositgap-ACCEPTANCE.md`  
8. `depositgap-COMPREHENSIVE-BLUEPRINT.md` + `depositgap-PAGE-SPECS.md` + `depositgap-PHASE-BRIEFS.md`  
9. `depositgap-SUSTAIN-TEST-MATRIX.md`  
10. `depositgap-API-CONTRACT.md`  
11. `depositgap-HYPOTHESIS-DRAFT.md`

## Checkers (must stay green)

```text
node docs/ideas/check-depositgap-fixtures.mjs
node docs/ideas/check-depositgap-dual.mjs
```

Optional farm preflight: `node docs/ideas/check-all-seeds.mjs`

## If all pass

1. Set `current_idea` → depositgap; walk IDEA_DEPTH to `ready_to_build` only if gates still hold.  
2. Open **comprehensive** `projects/depositgap/` (≥8 pages per blueprint) — **not** smoke-as-sustain.  
3. Digests: forecast / FP&A honesty experiment; brokers and CBP still liquidate; never claim ACE bill printout.  
4. Paste hypothesis from `depositgap-HYPOTHESIS-DRAFT.md`.

## If any fail

Stay research, park, or kill — write why in `docs/RESEARCH.md`. Do not open `projects/depositgap/`.

## Explicit non-actions (while htsroute owns 2026-07-21)

Do **not** run this sheet as a flip today. Same-day build remains blocked for htsroute; depositgap stays seed.
