# Enorms Baseline Studio

Soft-sim studio for pediatric EEG / epilepsy analytics leads: version baseline packs, configure channels and detections, then compare **patient-specific E-norms** against a **population-norm baseline** before locking a pack.

## Run

```bash
cd projects/enorms-baseline-studio
npm install
npm run dev
```

## Test

```bash
npm test
npm run build
npm run test:app-up
```

## Offline demo

Open `try.html` in a browser for a simplified A/B soft-sim without the app server.

## Honesty

Soft-sim only — not clinical diagnostic use, not live EEG device control, not FDA cleared, not the authors’ system. Paper: [medRxiv 10.64898/2026.07.13.26357876](https://www.medrxiv.org/content/10.64898/2026.07.13.26357876v1). Authors’ code: none published.

## Dev token

Bearer: `enorms-baseline-dev-token`
