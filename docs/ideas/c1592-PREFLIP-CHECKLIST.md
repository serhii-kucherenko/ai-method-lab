# c1592 — preflip checklist (hours wait)

Run **only when** hours since `framing_started_at` ≥ 4 **and** `research_ticks_on_idea` ≥ 3.

`framing_started_at`: **2026-07-22T18:55:00.000Z**. Diagnostic: `node docs/ideas/check-c1592-hour-status.mjs`.

## Must be green before `ready_to_build`

| # | Check | How |
|---|--------|-----|
| 1 | Hours hold | CONTROLLER `min_hours_research_before_ready: 4` |
| 2 | Tick hold | `research_ticks_on_idea` ≥ 3 |
| 3 | Fixtures | `node docs/ideas/check-c1592-fixtures.mjs` → **≥30** green |
| 4 | Dual-impl | `node docs/ideas/check-c1592-dual.mjs` → **≥30** green |
| 5 | Value gate | Mid-hold skeptic still says **continue as ceiling forecast**, not park |
| 5b | Mitigation honesty | Digests do not claim mitigated-guideline parity (`c1592-MITIGATION-FENCE.md`) |
| 5c | PD honesty | Digests do not claim automatic prior disclosure (`c1592-PD-FENCE.md`) |
| 6 | G6 honesty | No CBP / counsel replacement; no flat-2× widget |
| 7 | Architect pack | VISION / ROADMAP / PRD / ERD on file |
| 8 | Day-1 contract | `c1592-DAY1-NONSMOKE.md` + `c1592-FLIP-DAY-SCRIPT.md` |
| 9 | One product rule | `current_product` null |

## Flip actions (when all green)

Follow `c1592-FLIP-WHEN-CLEAR.md` / `c1592-FLIP-DAY-SCRIPT.md`. Digests: statutory-max **shape forecast**; Kill A stands.

## Soft park triggers

- Digests claim CBP / counsel / mitigated parity
- Product plan collapses to “flat 2× duties”
- Silent mitigation or PD “fix” without dual suite bump
- Hours/ticks faked or framing clock moved forward to skip hold

## Until hours / ticks clear

Research docs only. No `projects/c1592/`.
