# ptax4975 — preflip checklist (hours wait)

Run **only when** hours since `framing_started_at` ≥ 4 **and** `research_ticks_on_idea` ≥ 3.

`framing_started_at`: **2026-07-22T12:25:00.000Z**. Diagnostic: `node docs/ideas/check-ptax4975-hour-status.mjs`.

## Must be green before `ready_to_build`

| # | Check | How |
|---|--------|-----|
| 1 | Hours hold | CONTROLLER `min_hours_research_before_ready: 4` |
| 2 | Tick hold | `research_ticks_on_idea` ≥ 3 |
| 3 | Fixtures | `node docs/ideas/check-ptax4975-fixtures.mjs` → **≥35** green |
| 4 | Dual-impl | `node docs/ideas/check-ptax4975-dual.mjs` → **≥35** green |
| 5 | Value gate | `ptax4975-VALUE-GATE-DRYRUN.md` still says **continue as forecast method**, not park |
| 5b | FMV honesty | Digests do not claim highest-FMV-during-period parity (`ptax4975-FMV-FENCE.md`) |
| 5c | Taxable-period honesty | Digests do not claim automatic (f)(2) end-date enum (`ptax4975-TAXABLE-PERIOD-FENCE.md`) |
| 5d | Excess-compensation honesty | Digests do not claim automatic excess-comp narrowing (`ptax4975-EXCESS-COMP-FENCE.md`) |
| 6 | G6 honesty | No Form 5330 / IRS / DOL replacement; no flat-once-excise widget |
| 7 | Architect pack | VISION / ROADMAP / PRD / ERD on file |
| 8 | Day-1 contract | `ptax4975-DAY1-NONSMOKE.md` |
| 9 | One product rule | `current_product` null; oshamult sustained (not in flight) |

## Flip actions (when all green)

Follow `ptax4975-FLIP-WHEN-CLEAR.md`. Digests: first-/second-tier excise **shape forecast**; Kill A stands.

## Soft park triggers

- Digests claim Form 5330 / IRS parity  
- Product plan collapses to “flat 15% once”  
- Silent “fix” to highest-during-period FMV without dual suite bump  
- Silent excess-compensation “fix” without dual suite bump  
- Hours/ticks faked or framing clock moved forward to skip hold

## Until hours / ticks clear

Research docs only. No `projects/ptax4975/`. Mid-hold snapshot: `ptax4975-PREFLIP-DRYRUN.md`.
