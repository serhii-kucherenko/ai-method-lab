# Feature Sufficiency Studio — lessons

Plain-language notes for the next agent shipping a clinical-ML-eval soft-sim.

## What worked

1. **Domain nouns first.** Features, masks, cohorts, and sufficiency runs read as a product. Avoid `/jobs` / `/lifecycle` / `/scenario` shells and avoid persona/conversation IA from Persona Triage.
2. **Buyer outcome on the hero.** “Know when partial data is enough” sells a decision, not a lab desk.
3. **Dual A/B with honest B.** The full-feature baseline must be a real foil (imputation optimism), not a copy of A with renamed fields.
4. **Design pack as constraint.** Fraunces + Manrope and ink/teal/sand kept the brand distinct from coral clinic and purple-AI defaults.
5. **Goldens before polish.** Regenerating fixtures from `scoreA` and asserting A≡B≡expected catches drift early.

## What to refuse

- Branding as FSA or claiming FDA / clinical advice
- Live EHR integration claims in a method-lab soft-sim
- Noun-swapping a prior studio’s routes onto this domain
- Same-tick paper pick → smoke scaffold without depth pack

## Copy next time

- Depth pack (PM-GO, DESIGN, PRD, ERD, blueprint) before `projects/`
- `scoreA.ts` / `scoreB.ts` parity + ≥30 fixtures
- `/pricing` `/demo` `/onboarding` `/flows` + ≥5 named flows
- `test/app-up.test.ts` live smoke before finish email
