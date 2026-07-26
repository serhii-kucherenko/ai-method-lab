# 152 — Aminoaryl Studio lessons

## What we built
A medchem / route-planning analytics soft-sim: route packs, aryl cyclopropane routes, catalyst specs, aminoarylation assays, and dual A/B (`photocatalytic_aminoaryl` vs `copper_catalyzed_aminoaryl`) with scoreboard, export, webhook, and honesty fence.

## Category practices shipped
- Eval/bench: ≥30 dual-impl goldens (`aa-001`…`aa-030`), scoreboard, dual compare with cyclopropane-strain disagreement cases
- Industrial/design: versioned route packs, catalyst parameter boards, export
- Platform: org/members, audit, auth, rate limit, HMAC webhook, search/pagination

## Anti-clone notes
Domain nouns are packs / routes / catalysts / assays — not jobs / lifecycle / scenario / alleles / vectors. Landing sells a specific buyer outcome (light or copper — compare the route before locking a pack).

## Honesty
Soft-sim only. Not wet-lab validation, scale-up manufacturing control, or regulatory filing authority. Paper is research input; product is not authors' brand.

## Paper
https://doi.org/10.26434/chemrxiv.15005923/v1
