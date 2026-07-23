# Product naming (maturity bar)

Human steer (2026-07-23): coded statute IDs, fake compound nouns, and ugly prefixes made the portfolio feel stupid — not like real products.

## Required for every new idea and product

| Field | Rule | Example |
|-------|------|---------|
| **Display name** | 2–4 ordinary English words a stranger understands | Filing Penalty Desk |
| **Folder / slug** | lowercase words joined by hyphens; pronounceable | `filing-penalty-desk` |
| **One-line pitch** | Who + what outcome; no statute chapter as the brand | “Forecast late-file and late-pay tax additions honestly.” |

## Forbidden as the public product name

- Bare statute codes (`c1592`, `irc6651`, `ptax4975`, `§ 6651`)
- Glue-word compounds that only make sense inside this repo (`oshamult`, `lesserof`, `depositgap`, `htsroute`, `lotblast`)
- Dual-gate costume renames (`counselgate`, `slotbay`, `refundgap`)
- Prefix spam (`P-smoke`, `A03__`, cell ids in UI copy or email subjects)

## Allowed internally (docs only)

Short research ids and matrix cell ids may remain for harness wiring — but **VISION, PRD, UI, digests, try pages, and portfolio rows must lead with the display name**. If the display name is ugly, rename before build.

## Portfolio and email

- Portfolio column = display name first; slug in backticks
- Findings emails use display name only (see `protocols/NOTIFY.md` plain-language rules)
