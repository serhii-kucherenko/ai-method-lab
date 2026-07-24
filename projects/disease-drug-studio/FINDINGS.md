# FINDINGS — Disease Drug Studio

## Claim exercised
Disease-aware generation quality (MeSH depth + conditioning + GRPO-style rewards) vs disease-blind target-only baseline.

## Dual-impl
`src/domain/diseaseAware.ts` and `src/domain/diseaseAwareB.ts` agree on 30 goldens.

## Distinct IA
Programs / Generate / Library / Compare / Runs — not jobs/lifecycle/scenario/batch/goldens desk shell.

## Honesty
Soft scores; not authors' weights; not clinical prescribing.
