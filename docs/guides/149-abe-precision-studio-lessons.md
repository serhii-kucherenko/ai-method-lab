# 149 — Abe Precision Studio lessons

## What we built
A gene-editing analytics soft-sim: editor packs, editors, domain-insertion specs, precision assays, and dual A/B (`domain_insertion_abe` vs `baseline_abe`) with scoreboard, export, webhook, and honesty fence.

## Category practices shipped
- Eval/bench: ≥30 dual-impl goldens (`ap-001`…`ap-030`), scoreboard, dual compare
- Industrial/design: versioned editor packs, insertion parameter boards, export
- Platform: org/members, audit, auth, rate limit, HMAC webhook, search/pagination

## Anti-clone notes
Domain nouns are packs / editors / insertions / assays — not jobs / lifecycle / scenario / waters / sorbents. Landing sells a specific buyer outcome (narrow the window before locking a pack).

## Honesty
Soft-sim only. Not wet-lab validation, IND/NDA readiness, patient dosing, or clinical gene-therapy advice. Paper is research input; product is not authors' brand.

## Paper
https://www.biorxiv.org/content/10.64898/2026.07.03.736350v1
