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
4. `lesserof-G6-summary.md`  
5. `lesserof-ACCEPTANCE.md`  
6. `lesserof-COMPREHENSIVE-BLUEPRINT.md` + page specs + phase briefs  
7. `lesserof-SUSTAIN-TEST-MATRIX.md`  
8. `lesserof-API-CONTRACT.md`  
9. `lesserof-HYPOTHESIS-DRAFT.md`  
10. Worked papers: `lesserof-WORKED-EXAMPLE.md`, `lesserof-USMCA-STACK.md`, `lesserof-BASKET-OTHER.md`

## Checkers

```text
node docs/ideas/check-lesserof-fixtures.mjs
node docs/ideas/check-lesserof-dual.mjs
```

## If all pass

1. Set `current_idea` → lesserof; walk IDEA_DEPTH only if gates hold.  
2. Open comprehensive `projects/lesserof/` — not smoke-as-sustain / not 99%-of-paid widget.  
3. Digests: stacked refund-cap **workflow experiment**; brokers/ACE still file; Kill A stands.

## If any fail

Stay research / park / kill — write why in `docs/RESEARCH.md`.

## Explicit non-actions (2026-07-21)

Do not run this as a flip today. htsroute still owns the slot; depositgap is still preferred next.
