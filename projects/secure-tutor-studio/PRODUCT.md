# PRODUCT — Secure Tutor Studio

## Buyer
Secure software education teams who need multi-LLM orchestrated tutoring with safety checks — not a single unchecked model answering vulnerability questions alone.

## Outcome
Courses → tutor roles → lesson sessions (brief / teach / quiz / rubric) → orchestrated vs single compare → auditable export.

## Pages
`/` `/courses` `/tutors` `/lessons` `/compare` `/runs` `/settings` `/honesty`

## Features (≥20)
1. Marketing landing with selling points
2. Course workspace create
3. Course search (kind / notes)
4. Multi-LLM tutor roster
5. Tutor orchestration toggle
6. Lesson session console
7. Orchestrated multi-LLM mode
8. Single-LLM unchecked baseline
9. Guided vs strict tutor profile
10. Brief / teach / quiz / rubric stage advance
11. Security rubric item editor
12. Tutor coverage from active roles
13. Orchestrated vs single compare
14. Compare winner badge + score bars
15. Runs audit list
16. CSV audit export
17. JSON lesson-run export
18. Org settings
19. Member invite
20. Webhook HMAC + idempotent ingest
21. Bearer auth + rate limit
22. Honesty fence + Sources
23. Onboarding checklist on courses
24. Dual-impl goldens sample API
25. Pagination on courses / runs / audits
26. Safety gate + pedagogy fit metrics
27. Soft simulation disclaimer (not SYNAPSE brand)

## Aggregates
Organization · Course · TutorRole · LessonSession · AuditEntry (+ CompareResult)

## Forbidden IA
Do not ship `/jobs` `/lifecycle` `/scenario` `/batch` `/goldens` as primary routes.
