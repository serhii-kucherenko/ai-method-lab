# Pavement Retrofit Studio — what we learned

**Product:** `pavement-retrofit-studio`  
**Buyer:** infrastructure / climate-road analytics leads  
**Claim:** Compare photocatalytic pavement retrofit pathways against conventional pavement-preservation baselines before locking a corridor pack.

## Practices that shipped

1. **Domain IA, not desk shells** — packs / corridors / treatments / assays / compare / scoreboard. No `/jobs`, `/lifecycle`, or `/scenario`.
2. **Dual scorers with goldens** — `photocatalytic_pavement_retrofit` vs `conventional_preservation`, fixtures `pr-001` … `pr-030`.
3. **Soft-sim honesty** — never claim live road construction control, certified emissions audits, or municipal procurement; paper is research input only (not PlusTi brand).
4. **≥5 named flows** — create corridor pack, configure photocatalytic treatment, configure emission assay, A/B compare, export + webhook.
5. **Platform must-haves** — bearer auth, org/members, audit, export, webhook (HMAC + idempotency), search, pagination, rate limit, settings.
6. **Commercial surfaces** — marketing `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.
7. **Live smoke** — `next build` + `next start` GET `/` asserting display name.

## Category (climate-road / infrastructure soft-sim)

Goldens, dual compare, scoreboard, versioned corridor packs, honesty fence — table stakes for this bench category.

## Deferred

- Live road construction / crew dispatch (out of scope; soft-sim only)
- Certified emissions audit workflows
- Python sidecar (claim is pure TS soft-sim math)

## Lesson

Infrastructure A/B products sell when the buyer can **lock a pack** only after photocatalytic retrofit beats conventional preservation **and** overclaim risk stays visible — not when a calculator returns a single score.
