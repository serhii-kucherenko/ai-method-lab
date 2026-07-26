# 150 — Tubule Mps Studio lessons

## What we built
A transplant / MPS analytics soft-sim: tubule packs, proximal-tubule segments, voclosporin vs cyclosporine regimens, mitochondrial assays, and dual A/B (`voclosporin_mps` vs `cyclosporine_mps`) with scoreboard, export, webhook, and honesty fence.

## Category practices shipped
- Eval/bench: ≥30 dual-impl goldens (`tm-001`…`tm-030`), scoreboard, dual compare with 2D-masking disagreement cases
- Industrial/design: versioned tubule packs, regimen parameter boards, export
- Platform: org/members, audit, auth, rate limit, HMAC webhook, search/pagination

## Anti-clone notes
Domain nouns are packs / tubules / regimens / assays — not jobs / lifecycle / scenario / editors / insertions. Landing sells a specific buyer outcome (preserve the tubule before locking a regimen pack).

## Honesty
Soft-sim only. Not wet-lab MPS validation, transplant dosing advice, IND/NDA readiness, or live patient care. Paper is research input; product is not authors' brand.

## Paper
https://www.biorxiv.org/content/10.64898/2026.07.07.737071v1
