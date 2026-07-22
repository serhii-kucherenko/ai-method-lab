# ptax4975 — flip-day script (execute only after FLIP_PATH_READY)

**Do not run while hour-status prints `WAIT_HOURS`.**

## Preflight (must all pass)

```text
node docs/ideas/check-ptax4975-hour-status.mjs   # expect FLIP_PATH_READY
node docs/ideas/check-ptax4975-fixtures.mjs      # ≥35 green
node docs/ideas/check-ptax4975-dual.mjs          # ≥35 green
node docs/ideas/check-seed-kits.mjs              # ptax4975 kit green
```

## Open product

1. Create `projects/ptax4975/` per `ptax4975-REPO-SCAFFOLD.md` + `ptax4975-DAY1-NONSMOKE.md`
2. Paste `ptax4975-PRODUCT-DRAFT.md` → `PRODUCT.md`
3. Paste hypothesis from `ptax4975-HYPOTHESIS-DRAFT.md` → `HYPOTHESIS.md`
4. Seed FINDINGS from `ptax4975-FINDINGS-DRAFT.md`
5. Port ≥35 goldens + dual-impl; forecast API returns initial + additional + total
6. Honesty page: Kill A + three fences in DOM

## Controller / backlog

1. BACKLOG → `ready_to_build` then open smoke cell
2. CONTROLLER: `phase: running`, `current_product: ptax4975`, clear research-only notes
3. Digests: `ptax4975-DIGEST-HOLD.md` language only

## Abort if

Day-1 looks like flat-once widget, Form 5330 replacement, or silent fence “fix” — see DAY1 instant abort list.
