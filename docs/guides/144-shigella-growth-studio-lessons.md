# Shigella Growth Studio — what we learned

**Product:** `shigella-growth-studio`  
**Buyer:** child-health / infectious-disease epidemiology analytics leads  
**Claim:** Compare antibiotic-treated Shigella pathways against untreated diarrhea growth baselines before locking a cohort pack.

## Practices that shipped

1. **Domain IA, not desk shells** — packs / cohorts / episodes / growth / compare / scoreboard. No `/jobs`, `/lifecycle`, or `/scenario`.
2. **Dual scorers with goldens** — `antibiotic_treated_shigella` vs `untreated_diarrhea_growth`, fixtures `sg-001` … `sg-030`.
3. **Soft-sim honesty** — never claim live clinical prescribing, diagnostic clearance, or national treatment guideline authority; paper is research input only (not an authors’ IPD brand).
4. **≥5 named flows** — create cohort pack, configure Shigella episode, configure growth assay, A/B compare, export + webhook.
5. **Platform must-haves** — bearer auth, org/members, audit, export, webhook (HMAC + idempotency), search, pagination, rate limit, settings.
6. **Commercial surfaces** — marketing `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.
7. **Live smoke** — `next build` + `next start` GET `/` asserting display name.

## Category (epidemiology growth soft-sim)

Goldens, dual compare, scoreboard, versioned cohort packs, honesty fence — table stakes for this bench category.

## Deferred

- Live clinical prescribing / treatment decisions (out of scope; soft-sim only)
- Diagnostic clearance / lab authority
- National treatment guideline authority
- Python sidecar (claim is pure TS soft-sim math)

## Lesson

Epidemiology A/B products sell when the buyer can **lock a pack** only after antibiotic-treated Shigella beats untreated diarrhea growth **and** overclaim risk stays visible — not when a calculator returns a single score.
