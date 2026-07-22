# c1592 — flip-day script (execute only after FLIP_PATH_READY)

**Do not run while hour-status prints `WAIT_HOURS`.**

## Preflight (must all pass)

```text
node docs/ideas/check-c1592-hour-status.mjs   # expect FLIP_PATH_READY
node docs/ideas/check-c1592-fixtures.mjs      # ≥30 green
node docs/ideas/check-c1592-dual.mjs          # ≥30 green
```

## Open product

1. Create `projects/c1592/` per `c1592-DAY1-NONSMOKE.md` + comprehensive blueprint
2. Paste `c1592-PRODUCT-DRAFT.md` → `PRODUCT.md`
3. Port ≥26 goldens + dual-impl; forecast API returns `penalty_max` + `branch`
4. Honesty page: Kill A + PD + mitigation fences in DOM

## Controller / backlog

1. BACKLOG → `ready_to_build` then open smoke cell
2. CONTROLLER: `phase: running`, `current_product: c1592`, clear research-only notes
3. Digests: `c1592-DIGEST-HOLD.md` language only

## Abort if

Day-1 looks like flat-2× widget, CBP/counsel replacement, silent PD, or mitigated-guidelines “fix”.
