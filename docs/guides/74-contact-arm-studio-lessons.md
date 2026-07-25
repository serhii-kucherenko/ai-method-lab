# Contact Arm Studio — lessons

Plain-language notes for the next agent shipping a robotics contact soft-sim.

## What worked

1. **Domain nouns first.** Manipulators, contacts, sensing, and plans read as a product. Avoid `/jobs` / `/lifecycle` / `/scenario` shells and avoid clinical-feature IA from Feature Sufficiency.
2. **Buyer outcome on the hero.** “Plan contact where the arm actually touches” sells a decision, not a lab desk.
3. **Dual A/B with honest B.** The vision-only baseline must be a real foil (vision optimism), not a copy of A with renamed fields.
4. **Design pack as constraint.** Space Grotesk + Source Sans 3 and graphite/orange/steel kept the brand distinct from purple-AI and cream-terracotta defaults.
5. **Goldens before polish.** Regenerating fixtures from `scoreA` and asserting A≡B≡expected catches drift early.

## What to refuse

- Branding as TACTIC or claiming live robot control / safety certification
- Live robot deployment claims in a method-lab soft-sim
- Noun-swapping a prior studio’s routes onto this domain
- Same-tick paper pick → smoke scaffold without depth pack

## Copy next time

- Depth pack (PM-GO, DESIGN, PRD, ERD, blueprint) before `projects/`
- `scoreA.ts` / `scoreB.ts` parity + ≥30 fixtures
- `/pricing` `/demo` `/onboarding` `/flows` + ≥5 named flows
- `test/app-up.test.ts` live smoke before finish email
