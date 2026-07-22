# oshamult — preflip checklist (hours wait)

Run **only when** hours since `framing_started_at` ≥ 4 **and** `research_ticks_on_idea` ≥ 3.

`framing_started_at`: **2026-07-22T06:20:00.000Z**.

## Must be green before `ready_to_build`

| # | Check | How |
|---|--------|-----|
| 1 | Hours hold | CONTROLLER `min_hours_research_before_ready: 4` |
| 2 | Tick hold | `research_ticks_on_idea` ≥ 3 |
| 3 | Fixtures | `node docs/ideas/check-oshamult-fixtures.mjs` → **≥26** green |
| 4 | Dual-impl | `node docs/ideas/check-oshamult-dual.mjs` → **≥26** green |
| 5 | Value gate | Continue as method product — Kill A stands; not park for weak claim |
| 5b | OIS honesty | Digests do not claim live OIS / byte-identical FOM HTML order |
| 6 | G6 honesty | No OSHA/OIS replacement; no additive-% widget |
| 7 | Architect pack | VISION / ROADMAP / PRD / ERD on file |
| 8 | Day-1 contract | `oshamult-DAY1-NONSMOKE.md` |
| 9 | One product rule | `current_product` null; lesserof sustained (not in flight) |

## Flip actions (when all green)

Follow `oshamult-FLIP-WHEN-CLEAR.md`. Digests use `oshamult-DIGEST-COPY.md`.

## Soft park triggers

- Digests claim OIS parity while v0 order differs  
- Product plan collapses to “statutory max × discount sum”  
- Hours/ticks faked

## Until hours clear

Research docs only. No `projects/oshamult/`.
