# Seed checker snap (paper hygiene)

Last verified on **2026-07-21** during depth tick 53. Re-run before any ready flip / park.

| Suite | Command | Count |
|-------|---------|------:|
| htsroute | `node docs/ideas/check-htsroute-fixtures.mjs` | **42** |
| htsroute dual | `node docs/ideas/check-htsroute-dual.mjs` | (must agree) |
| depositgap | `node docs/ideas/check-depositgap-fixtures.mjs` | 23 |
| lesserof | `node docs/ideas/check-lesserof-fixtures.mjs` | 23 |
| oshamult | `node docs/ideas/check-oshamult-fixtures.mjs` | 26 |
| ptax4975 | `node docs/ideas/check-ptax4975-fixtures.mjs` | 35 |

Also:

- `node docs/ideas/check-seed-kits.mjs` (includes try-demo smoke)
- `node docs/ideas/check-htsroute-preflip.mjs` (calendar still blocks today)
- `node docs/ideas/check-morning-status.mjs` → expect **WAIT_SAME_DAY** tonight; tomorrow BUILD_GATE_CLEAR vs PARK path

Same-day build still blocked. Flip/park sheets: `htsroute-FLIP-MORNING.md`, `htsroute-PARK-RUN.md`. Depositgap § 6621 fence: `depositgap-6621-FENCE.md`.
