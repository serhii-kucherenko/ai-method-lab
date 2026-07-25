# Async Neuro Studio — what we learned

Guide **124** for product `async-neuro-studio`.

## Category
Eval / soft-sim bench for multi-center neurology study ops: versioned exam packs, sites, protocols, async videos, dual scorers, scoreboard.

## Practices shipped
- Dual-impl goldens (`an-001`…`an-030`) for `standardized_async_video_exam` vs `ad_hoc_exam_baseline`
- Distinct domain IA (packs / sites / protocols / exams / videos) — no `/jobs` `/lifecycle` `/scenario` desk clone
- Platform must-haves: bearer auth, members/org, webhook HMAC, audit, export, search, pagination, rate limits, scoreboard
- ≥5 named flows on `/flows` with actor / job / success / empty paths
- Marketing landing sells buyer outcome (standardized async neuro exams for multi-site AD/ADRD studies)
- Soft-sim honesty: not clinical diagnostic, not live telehealth write-back, not FDA clearance, not VANE

## Deferred
- Real video ingest / OCR of exam checklists
- Live telehealth or EHR write-back (explicitly out of scope)

## Sources
- Paper: https://www.medrxiv.org/content/10.64898/2026.07.15.26357456v1
- Authors’ code: none
