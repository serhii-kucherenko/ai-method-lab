# Disaster Liaison Studio — what we learned

**Product:** `disaster-liaison-studio`  
**Buyer:** public-health / emergency-ops analytics leads  
**Claim:** Compare pediatric-perinatal disaster liaison frameworks against generic disaster HQ baselines before locking a response pack.

## Practices that shipped

1. **Domain IA, not desk shells** — packs / events / liaisons / handoffs / compare / scoreboard. No `/jobs`, `/lifecycle`, or `/scenario`.
2. **Dual scorers with goldens** — `pediatric_perinatal_liaison` vs `generic_disaster_hq`, fixtures `dl-001` … `dl-030`.
3. **Soft-sim honesty** — never claim live emergency dispatch, clinical triage authority, or government command; paper is research input only (not DLPPM brand).
4. **≥5 named flows** — create pack, configure event, configure liaison, A/B compare, export + webhook.
5. **Platform must-haves** — bearer auth, org/members, audit, export, webhook (HMAC + idempotency), search, pagination, rate limit, settings.
6. **Commercial surfaces** — marketing `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.
7. **Live smoke** — `next build` + `next start` GET `/` asserting display name.

## Category (eval / emergency-ops soft-sim)

Goldens, dual compare, scoreboard, versioned response packs, honesty fence — table stakes for this bench category.

## Deferred

- Live CAD / radio / dispatch integration (out of scope; soft-sim only)
- Clinical triage decision support
- Python sidecar (claim is pure TS soft-sim math)

## Lesson

Emergency-ops A/B products sell when the buyer can **lock a pack** only after pediatric-perinatal liaison beats generic HQ **and** overclaim risk stays visible — not when a calculator returns a single score.
