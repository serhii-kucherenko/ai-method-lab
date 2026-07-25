# Idia Quant Studio

Soft-sim studio for single-cell proteomics / mass-spec analytics leads who compare **informed DIA** quantification against a **naive DIA baseline** before locking a quant pack.

**Paper:** https://www.biorxiv.org/content/10.1101/2025.05.30.656945v3  
**Authors’ code:** none published  
**Honesty:** soft-sim only — not wet-lab validated proteomics, not live instrument write-back, not the authors’ system.

## Run

```bash
cd projects/idia-quant-studio
npm install
npm run dev
```

Open http://localhost:3000 — bearer token for APIs: `idia-quant-dev-token`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Domain IA

`/`, `/pricing`, `/demo`, `/onboarding`, `/flows`, `/quants`, `/spectra`, `/targets`, `/runs`, `/compare`, `/scoreboard`, `/settings`, `/honesty`

Offline demo: open `try.html` in a browser.
