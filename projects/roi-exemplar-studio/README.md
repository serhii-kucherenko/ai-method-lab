# Roi Exemplar Studio

Soft-sim studio for medical imaging / VLM product leads: version exemplar packs, configure ROI and in-context prompts, then compare **optimized in-context exemplars** against a **naive exemplar baseline** before locking a pack.

## Run

```bash
cd projects/roi-exemplar-studio
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

Soft-sim only — not clinical diagnostic use, not live PACS write-back, not the authors’ system. Paper: [iScience 10.1016/j.isci.2026.116518](https://doi.org/10.1016/j.isci.2026.116518). Authors’ code: none published.

## Dev token

Bearer: `roi-exemplar-dev-token`
