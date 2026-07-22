# lesserof — post-depositgap activation run sheet

Use **only after** depositgap has flipped to build, parked, or killed — and **not** on the same calendar day as lesserof framing. Prefer depositgap first per `ACTIVATION_QUEUE.md`.

## Preconditions

1. One product phase rule: no other `current_product` in flight (or prior product complete/parked/killed).  
2. depositgap is no longer ahead (done, parked, or killed).  
3. New calendar day vs lesserof framing day (once framed).

## Re-read (in order)

1. `lesserof-NARROW-CLAIM.md` + `lesserof-KILL-BC.md`  
2. `lesserof-VALUE-STAKES.md`  
3. `lesserof-PRODUCT-FRAMING.md`  
4. `lesserof-GATE-SCORECARD.md`  
5. `lesserof-G6-summary.md`  
6. `lesserof-ACCEPTANCE.md`  
7. `lesserof-COMPREHENSIVE-BLUEPRINT.md` + page specs + phase briefs  
8. `lesserof-SUSTAIN-TEST-MATRIX.md`  
9. `lesserof-API-CONTRACT.md`  
10. `lesserof-HYPOTHESIS-DRAFT.md`  
11. Worked papers: `lesserof-WORKED-EXAMPLE.md`, `lesserof-USMCA-STACK.md`, `lesserof-BASKET-OTHER.md`

## Checkers

```text
node docs/ideas/check-lesserof-fixtures.mjs
node docs/ideas/check-lesserof-dual.mjs
```

## If all pass

1. Set `current_idea` → lesserof; walk IDEA_DEPTH only if gates hold.  
2. Open comprehensive `projects/lesserof/` — not smoke-as-sustain / not 99%-of-paid widget. Day-1 contract: `lesserof-DAY1-NONSMOKE.md`.  
3. Digests: stacked refund-cap **workflow experiment**; brokers/ACE still file; Kill A stands.

## If any fail

Stay research / park / kill — write why in `docs/RESEARCH.md`.

## Explicit non-actions (superseded 2026-07-22)

Historical: do not flip while htsroute/depositgap owned the slot.  
**Now:** depositgap sustained — use `lesserof-POST-DEPOSITGAP-STATUS.md` for the live checklist. Still no product folder until hours + architect pack + honest G6.
