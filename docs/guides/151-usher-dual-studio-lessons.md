# 151 — Usher Dual Studio lessons

## What we built
A gene-therapy / sensory analytics soft-sim: allele packs, MYO7A panels, vector specs, pathway assays, and dual A/B (`myo7a_gene_supplement` vs `myo7b_activation`) with scoreboard, export, webhook, and honesty fence.

## Category practices shipped
- Eval/bench: ≥30 dual-impl goldens (`ud-001`…`ud-030`), scoreboard, dual compare with allele-gap disagreement cases
- Industrial/design: versioned allele packs, vector parameter boards, export
- Platform: org/members, audit, auth, rate limit, HMAC webhook, search/pagination

## Anti-clone notes
Domain nouns are packs / alleles / vectors / assays — not jobs / lifecycle / scenario / editors / insertions. Landing sells a specific buyer outcome (two pathways, one compare before locking an allele pack).

## Honesty
Soft-sim only. Not wet-lab validation, IND/NDA readiness, patient dosing, or clinical gene-therapy advice. Paper is research input; product is not authors' brand.

## Paper
https://www.biorxiv.org/content/10.64898/2026.07.02.736025v1
