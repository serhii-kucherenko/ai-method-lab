# htsroute — tomorrow’s day-boundary run sheet

Use on **2026-07-22** (or any new calendar day after framing day **2026-07-21**). Do not flip from memory.

## Before anything else

1. Confirm local/OS date is **not** 2026-07-21.  
2. Re-read, in order:  
   - `htsroute-challenge-D.md`  
   - `htsroute-VALUE-STAKES.md`  
   - `htsroute-G6-summary.md`  
   - `htsroute-GATE-SCORECARD.md`  
   - `htsroute-ACCEPTANCE.md`  
   - `htsroute-COMPREHENSIVE-BLUEPRINT.md` + page specs + phase briefs  
   - `htsroute-SUSTAIN-TEST-MATRIX.md`  
3. Run paper checkers (must stay green):  
   - `node docs/ideas/check-htsroute-fixtures.mjs`  
   - `node docs/ideas/check-htsroute-dual.mjs`  
4. Fill `htsroute-DAY-BOUNDARY.md` checkboxes for real (not dry-run).

## If all pass

1. Flip idea state / controller to `ready_to_build` per `protocols/IDEA_DEPTH.md`.  
2. Open **comprehensive** `projects/htsroute/` (7 pages) — **not** smoke-as-sustain.  
3. Digests: workflow experiment; Kill A stands; no Free/Free duty-savings vanity.  
4. Paste hypothesis from `htsroute-HYPOTHESIS-DRAFT.md`.

## If any fail

Stay in research, park, or kill — write why in `docs/RESEARCH.md`. Do not open `projects/htsroute/`.

## After htsroute clears (build done, parked, or killed)

Activate next per `ACTIVATION_QUEUE.md` — prefer **depositgap**.
