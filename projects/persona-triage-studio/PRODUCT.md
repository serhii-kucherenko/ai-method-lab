# Persona Triage Studio — product notes

**Display name:** Persona Triage Studio  
**Slug:** `persona-triage-studio`  
**Paper:** https://arxiv.org/abs/2607.08625v1  

## Dual score

| Lane | Meaning |
|------|---------|
| A — style-aware | Rewards style-axis fit, persona coherence, urgency under communication diversity |
| B — idealized patient | Rewards articulation + cooperation; weak on style diversity |

## Sustain checklist

- ≥11 pages including `/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/personae`, `/conversations`, `/styles`, `/urgency`, `/compare`, `/scoreboard`, `/settings`, `/honesty`
- ≥25 features via `featureInventory()`, ≥5 named flows on `/flows`
- ≥30 dual-impl goldens (`scoreA` ≡ `scoreB`)
- `npm run build` + `npm test` + `npm run test:app-up`
- Tutor guide `docs/guides/72-persona-triage-studio-lessons.md`
- Soft-sim honesty fence; not clinical advice; not FDA; not authors’ brand
