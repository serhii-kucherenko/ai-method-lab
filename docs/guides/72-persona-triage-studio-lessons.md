# Persona Triage Studio — lessons

## What shipped
A clinical AI eval soft-sim studio with versioned persona packs, conversation cases with gold urgency, communication-style axes, urgency runs, and dual A/B scoring (style-aware triage vs idealized-patient baseline). Commercial surfaces: `/pricing`, `/demo`, `/onboarding`, `/flows` (≥5 named journeys), `/honesty`.

## Category practices
Clinical-eval bench: goldens (≥30), dual compare, disparity scoreboard, versioned packs, audit, export, org/members, webhook HMAC, search, pagination, rate limit, honesty fence, offline `try.html`.

## What worked
- Domain IA (`/personae`, `/conversations`, `/styles`, `/urgency`) avoided desk-clone and Fail Gate noun-swap.
- Dual-impl twin (`scoreA.ts` / `scoreB.ts`) kept goldens honest without weakening tests.
- Money hook stayed seats + private persona/eval packs with soft-sim packaging honesty.
- Landing sold a specific buyer outcome: triage under communication diversity, not a generic lab desk.

## Deferrals
- No live patient chatbot hosting (soft-sim score only).
- No FDA / clinical decision support claims (explicit non-goal).
- No authors’ system rebrand (paper had no published code).

## Anti-patterns avoided
Branding as the paper’s product; isomorphic `/jobs`/`/lifecycle`/`/scenario` shells; claiming clinical advice or FDA clearance.
