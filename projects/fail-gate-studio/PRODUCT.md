# Fail Gate Studio — product notes

**Display name:** Fail Gate Studio  
**Slug:** `fail-gate-studio`  
**Paper:** https://arxiv.org/abs/2607.15166v1  
**Authors’ code:** none  

## Dual score

| Lane | Meaning |
|------|---------|
| A | Fail-gate taxonomy diagnosis (severity + gate type + boundary reason) |
| B | Correctness-only / naive accuracy baseline |

## Sustain checklist

- ≥11 pages including `/pricing` `/demo` `/onboarding` `/flows` `/honesty`
- ≥25 features, ≥5 named flows
- ≥30 dual-impl goldens
- `npm run build` + `npm run test:app-up`
- Tutor guide `docs/guides/69-fail-gate-studio-lessons.md`
