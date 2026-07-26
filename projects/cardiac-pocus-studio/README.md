# Cardiac Pocus Studio

Soft-sim studio for pulmonary / POCUS analytics leads: compare **cardiac POCUS COPD patterns** against **lung-ultrasound baselines** before locking an exam pack.

## Claim

Version exam packs, configure patterns and assays, run dual compares (`cardiac_pocus_copd` vs `lung_ultrasound_baseline`), lock when deltas and honesty are understood.

## Honesty

Soft-sim only — not live diagnostic clearance, not clinical advice, not PACS write-back. Research input: [Research Square 10.21203/rs.3.rs-9994279/v1](https://doi.org/10.21203/rs.3.rs-9994279/v1). Not an authors’ product brand.

## Run

```bash
cd projects/cardiac-pocus-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `cardiac-pocus-dev-token`.

Offline demo: open `try.html` in a browser (approximate JS soft-sim).

## Tests

```bash
npm test          # goldens + store + UI critical
npm run test:app-up   # next build + live GET /
npm run gen:goldens
```

## IA

`/packs` · `/exams` · `/patterns` · `/assays` · `/compare` · `/scoreboard` (+ `/pricing` `/demo` `/onboarding` `/flows` `/honesty` `/settings`)

## Guide

`docs/guides/145-cardiac-pocus-studio-lessons.md`
