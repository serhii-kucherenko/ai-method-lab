# Pneumonia Implement Studio — what we learned

**Product:** `pneumonia-implement-studio`  
**Buyer:** public-health / primary-care implementation analytics leads  
**Claim:** Compare CFIR co-designed childhood pneumonia primary-care models against status-quo pathway baselines before locking a district pack.

## Practices that shipped

1. **Domain IA, not desk shells** — packs / districts / pathways / fidelity / compare / scoreboard. No `/jobs`, `/lifecycle`, or `/scenario`.
2. **Dual scorers with goldens** — `cfir_codesign_primary_care` vs `status_quo_pathway`, fixtures `pi-001` … `pi-030`.
3. **Soft-sim honesty** — never claim live clinical triage, EMR write-back, or government program authority; paper is research input only (not an authors’ Palwal brand).
4. **≥5 named flows** — create district pack, configure CFIR pathway, configure fidelity measures, A/B compare, export + webhook.
5. **Platform must-haves** — bearer auth, org/members, audit, export, webhook (HMAC + idempotency), search, pagination, rate limit, settings.
6. **Commercial surfaces** — marketing `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.
7. **Live smoke** — `next build` + `next start` GET `/` asserting display name.

## Category (implementation analytics soft-sim)

Goldens, dual compare, scoreboard, versioned district packs, honesty fence — table stakes for this bench category.

## Deferred

- Live clinical triage / care pathways (out of scope; soft-sim only)
- EMR / HMIS write-back
- Python sidecar (claim is pure TS soft-sim math)

## Lesson

Implementation A/B products sell when the buyer can **lock a pack** only after CFIR co-design beats status-quo pathways **and** overclaim risk stays visible — not when a calculator returns a single score.
