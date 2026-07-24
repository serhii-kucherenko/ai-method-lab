# MSK Care Studio — lessons

## What we built

A care studio where hospital state streams and external medical knowledge stay first-class, and decisions/pathways are scored for evidence grounding across admission → rehab. Dual score compares grounded plans to an ungrounded LLM baseline that skips stream/knowledge linkage.

## What worked

1. **Distinct IA** — episodes / streams / knowledge / decisions / pathways / compare reads as MSK care work, not a renamed jobs desk or trip/constraints noun-swap.
2. **Dual score as the claim** — A holds stream + knowledge grounding into decisions; B maximizes narrative decisions and leaks grounding. Goldens prove the gap.
3. **Buyer-first landing** — “ground every decision in the patient’s state” sells an outcome MSK teams recognize.
4. **Soft simulation honesty** — fence early: not a live EHR, not clinical certification, not OrthoPilot; paper is research input.

## Pitfalls

- Do not invent live EHR integrations for sustain theater.
- Do not slip `/jobs` `/lifecycle` `/scenario` back into nav.
- Do not reuse trip studio routes (`/trips` `/constraints` `/desires` `/plans`).
- Dual-impl goldens must stay bitwise-equal across `care.ts` / `careB.ts`.

## Sources

- Paper: https://arxiv.org/abs/2607.12527v1
- Authors’ code: none published with the digest
- Product: `projects/msk-care-studio/`
