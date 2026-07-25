# Sepsis Therapy Studio

Critical-care soft-sim: compare continuous-time HMM antibiotic therapy effectiveness vs static guideline baselines before locking a therapy pack.

## Quick start

```bash
cd projects/sepsis-therapy-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA is **Open therapies**.

## Verify before sustain

```bash
npm test
npm run build
npm run test:app-up
```

Offline demo: open `try.html` in a browser.

## Domain routes

`/therapies` · `/regimens` · `/onsets` · `/runs` · `/compare` · `/scoreboard`

Also: `/pricing` · `/demo` · `/onboarding` · `/flows` · `/settings` · `/honesty`

## Honesty

Soft-sim only — not clinical diagnostic use, not live EHR write-back, not FDA cleared, not the authors’ system.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.03.26357092v1
