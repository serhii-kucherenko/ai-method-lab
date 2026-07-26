# Split Endo Studio — what we learned

**Product:** `split-endo-studio`  
**Buyer:** spine / MIS surgical analytics leads  
**Claim:** Compare one-hole split endoscopy pathways against open laminectomy baselines before locking a thoracic OLF case pack.

## Practices that shipped

1. **Domain IA, not desk shells** — packs / cases / approaches / outcomes / compare / scoreboard. No `/jobs`, `/lifecycle`, or `/scenario`.
2. **Dual scorers with goldens** — `one_hole_split_endoscopy` vs `open_laminectomy`, fixtures `se-001` … `se-030`.
3. **Soft-sim honesty** — never claim live OR control, device clearance, or clinical advice; paper is research input only.
4. **≥5 named flows** — create pack, configure OSE approach, outcomes, A/B compare, export + webhook.
5. **Platform must-haves** — bearer auth, org/members, audit, export, webhook (HMAC + idempotency), search, pagination, rate limit, settings.
6. **Commercial surfaces** — marketing `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/honesty`.
7. **Live smoke** — `next build` + `next start` GET `/` asserting display name.

## Category (eval / surgical analytics soft-sim)

Goldens, dual compare, scoreboard, versioned case packs, honesty fence — table stakes for this bench category.

## Deferred

- Live OR telemetry integration (out of scope; soft-sim only)
- Device / regulatory pathway tracking
- Python sidecar (claim is pure TS soft-sim math)

## Lesson

Surgical A/B products sell when the buyer can **lock a pack** only after OSE beats open laminectomy **and** overclaim risk stays visible — not when a calculator returns a single score.
