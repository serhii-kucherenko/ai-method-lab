# Findings — Fail Gate Studio

## What worked

Distinct eval IA (`/cases` `/gates` `/boundaries` `/scoreboard`) avoided desk and Consult Bench clones. Dual-impl goldens locked A (fail-gate) vs B (correctness-only).

## Lessons

1. Release-gate buyers need taxonomy diagnosis, not accuracy theater alone.
2. Soft-sim honesty must name “not MedFailBench” and “not CDS” explicitly.
3. Scoreboard + private packs are table-stakes for eval benches.

## Sustain

Build + unit/UI tests + app-up green on climb.
