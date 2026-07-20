# Screenlane Findings

## What we built
Multi-aggregate hiring product: boards (ACL) + jobs + candidates + applications (applied→screening→decided) + weighted scorecards + HMAC webhooks + pagination + rate limits + static UI. Domain rule: criteria required before screening; scores only while screening.

## What we tested
18/18 green: oracle/smoke, crud, workflow, integrate, scale, sustain, plus pure scoring unit tests.

## What worked
- A03+A10 held for a **comprehensive** product (not a noun-swap clone).
- Pure helpers in `src/scoring.ts` give component coverage without a SPA harness.
- Board ACL + cross-board application rejection + optimistic concurrency all held.

## What failed / was brittle
- Nothing blocking sustain. Clone-tier products remain vanity evidence next to this shape.

## Framework recommendation
Use **Multi-aggregate product shape** + default A03+A10 loop in `docs/FRAMEWORKS.md`. Prefer this over another 3-state rename. Harness repeatability: `protocols/HARNESS_LOOP.md`.

## Method notes for the matrix
- Screenlane is portfolio evidence #66 (first comprehensive multi-aggregate after the clone wave).
'@
