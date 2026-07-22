# lesserof — preflip checklist (hours wait)

Run **only when** `hours since framing_started_at ≥ 4` **and** `research_ticks_on_idea ≥ 3`. Research tick while waiting: keep this list honest.

`framing_started_at` (wall): **2026-07-21T18:07:23-07:00** / `2026-07-22T01:07:23.000Z`.

## Must be green before `ready_to_build`

| # | Check | How |
|---|--------|-----|
| 1 | Hours hold | CONTROLLER `framing_started_at` + `min_hours_research_before_ready: 4` |
| 2 | Tick hold | `research_ticks_on_idea` ≥ 3 |
| 3 | Fixtures | `node docs/ideas/check-lesserof-fixtures.mjs` → **≥25** green (A–Y) |
| 4 | Dual-impl | `node docs/ideas/check-lesserof-dual.mjs` → **≥25** green |
| 5 | Value gate | `lesserof-VALUE-GATE-DRYRUN.md` still says **continue as method product**, not park |
| 5b | Same-condition fence | Digests / demo do not claim every CA/MX export wipes (`lesserof-SAME-CONDITION-FENCE.md`) |
| 6 | G6 honesty | No ACE/broker replacement; no ×0.99-only product |
| 7 | Architect pack | VISION / ROADMAP / PRD / ERD on file |
| 8 | Day-1 contract | `lesserof-DAY1-NONSMOKE.md` pasted into future PRODUCT |
| 9 | Try demo | `demos/lesserof-try/try.html` shows stack + Kill A (research demo only) |
| 10 | One product rule | `current_product` null; depositgap not in flight |

## Flip actions (when all green)

1. Set idea state `ready_to_build` in BACKLOG + G6 decision.  
2. Open comprehensive `projects/lesserof/` per blueprint — **not** smoke-as-sustain.  
3. Digests: stacked refund-cap **workflow experiment**; Kill A mandatory.

## Soft park triggers (abort flip)

- Framing claims filer replacement  
- Product plan collapses to single ×0.99 field  
- Basket-other becomes silent lesser-of pass  
- Hours/ticks faked or framing clock moved forward to skip hold

## This wait tick (hours ~0.2–4)

Do **not** open the product folder. Re-read VALUE-STAKES + USMCA wipe fence. Keep research docs only.
