# FINDINGS — Async Neuro Studio

## Claim exercised
Dual soft-sim scoring: `standardized_async_video_exam` vs `ad_hoc_exam_baseline` over protocol fidelity, site consistency, video completeness, and pack readiness — with overclaim risk for clinical / telehealth / FDA / VANE language.

## What worked
- Distinct IA (packs / sites / protocols / exams / videos) avoided desk-clone shells.
- ≥30 dual-impl goldens (`an-001`…`an-030`) pin both scorers.
- Platform must-haves (bearer, members, HMAC webhook, audit, export, search, pagination, rate limit, scoreboard) ship beside domain flows.

## Limits
Soft-sim only. No live video pipeline, no EHR/telehealth write-back, no diagnostic claim.
