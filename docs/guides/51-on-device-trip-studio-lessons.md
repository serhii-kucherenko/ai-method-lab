# On-Device Trip Studio — lessons

## What we built

A trip planning studio where hard schedule/resource/transfer/offline constraints stay first-class, and desire signals personalize *inside* that envelope via Plan→Learn→Adapt. Dual score compares feasibility-first plans to desire-first baselines that skip constraints.

## What worked

1. **Distinct IA** — trips / constraints / desires / plans / adapt / compare reads as itinerary work, not a renamed jobs desk or Pack Rules noun-swap.
2. **Dual score as the claim** — A holds feasibility then adapts desires; B maximizes desire and leaks schedule/resource. Goldens prove the gap.
3. **Buyer-first landing** — “feasible before desirable” sells an outcome mobile travel teams recognize.
4. **Soft simulation honesty** — fence early: not a live maps/booking API; not branded as PLA; paper is research input.

## Pitfalls

- Do not invent live maps or booking APIs for sustain theater.
- Do not slip `/jobs` `/lifecycle` `/scenario` back into nav.
- Do not reuse Pack Rules routes (`/profiles` `/rules` `/preferences` `/checklists`).
- Dual-impl goldens must stay bitwise-equal across `trip.ts` / `tripB.ts`.

## Sources

- Paper: https://arxiv.org/abs/2607.15552v1
- Authors’ code: none published with the digest
- Product: `projects/on-device-trip-studio/`
