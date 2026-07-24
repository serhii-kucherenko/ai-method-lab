# FINDINGS — Agent Safety Studio

## Claim
Structural graph-delta monitoring plans score higher catch rate and sync-block effectiveness than unchecked / threshold-only baselines on soft-sim IaC sabotage pressure — without branding as IFG.

## Dual-impl
- A: `scoreStructural` — CFG/DFG evidence + monitor coverage + sync/async mode
- B: `scoreThreshold` — raw diff noise + suspicion threshold only
- ≥30 goldens; dual files `safety.ts` / `safetyB.ts` must agree

## Distinct IA
Fleets / monitors / alerts / compare — not a noun-swapped desk.

## Sustain gates
- `npm test` green (goldens + store + UI critical)
- `npm run test:app-up` green (next build + next start GET /)
- Guide `docs/guides/43-agent-safety-studio-lessons.md`
- try.html offline demo
