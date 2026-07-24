# Lessons — Quad Skill Studio

**Product:** Quad Skill Studio (`quad-skill-studio`)  
**Paper input:** https://arxiv.org/abs/2607.13579v1  

## What worked

1. **Distinct IA first.** Robots → terrains → skills → datasets → transitions → compare matches the buyer story. Avoiding jobs/lifecycle/scenario shells kept the wild-quadruped claim readable.
2. **Dual score matches the paper tension.** A = multi-skill perceptive plan quality with smooth transitions; B = single-gait baseline that stalls on terrain change. Compare UI sells the outcome without field-robot theater.
3. **Honesty fence early.** No APT-RL branding, no live robot control claim — inspired by multi-skill locomotion, shipped as a method-lab planner.

## What to watch

- Soft-simulation scores can look “too precise.” Keep copy clear that fixtures are lab goldens, not measured meters on a trail.
- Terrains, skills, datasets, and transitions are first-class aggregates — don’t collapse them into a single calculator page.
- Export links that need bearer auth should use the client API helper, not bare `<a href>` in production hardening.

## Sustain checklist used

- ≥20 features via `listFeatures()`
- 9 pages including marketing `/`
- ~30 dual-impl goldens (loco.ts vs locoB.ts)
- `npm test` + live `npm run test:app-up`
