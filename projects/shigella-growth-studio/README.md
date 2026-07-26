# Shigella Growth Studio

Soft-sim studio for child-health / infectious-disease epidemiology analytics leads comparing **antibiotic-treated Shigella** pathways against **untreated diarrhea growth** baselines before locking a cohort pack.

## Run

```bash
cd projects/shigella-growth-studio
npm install
npm run dev
```

Open http://localhost:3000

Dev bearer token: `shigella-growth-dev-token`

## Test

```bash
npm run gen:goldens
npm test
npm run build
npm run test:app-up
```

## Honesty

Soft-sim only — not live clinical prescribing, not diagnostic clearance, not national treatment guideline authority. Research input: [medRxiv 10.64898/2026.07.10.26357688](https://www.medrxiv.org/content/10.64898/2026.07.10.26357688v1). Not an authors' product brand.

## Offline demo

Open `try.html` in a browser for an approximate dual-compare slider demo.
