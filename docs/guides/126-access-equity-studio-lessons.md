# Access Equity Studio — what we learned

Guide **126** for product `access-equity-studio`.

## Category
Eval / soft-sim bench for autism digital screening: versioned pathway packs, cohorts, pathways, screens, equity gates, dual scorers, scoreboard.

## Practices shipped
- Dual-impl goldens (`ae-001`…`ae-030`) for `equity_access_task_sharing` vs `accuracy_only_classifier`
- Distinct domain IA (packs / pathways / cohorts / screens / equity) — no `/jobs` `/lifecycle` `/scenario` desk clone
- Platform must-haves: bearer auth, members/org, webhook HMAC, audit, export, search, pagination, rate limits, scoreboard
- ≥5 named flows on `/flows` with actor / job / success / empty paths
- Marketing landing sells buyer outcome (equity-access autism screening pathways)
- Soft-sim honesty: not clinical diagnostic, not live EHR write-back, not FDA clearance, not an autism diagnosis product

## Deferred
- Real EHR / screening instrument ingest
- Live clinical decision support (explicitly out of scope)

## Sources
- Paper: https://doi.org/10.3389/fpubh.2026.1898818
- Authors’ code: none
