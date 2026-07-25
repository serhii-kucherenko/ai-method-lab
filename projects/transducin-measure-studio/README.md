# Transducin Measure Studio

Soft-sim studio for SNOMED-CT coded OCT measurement recovery vs raw private-tag dump baselines.

## Run

```bash
cd projects/transducin-measure-studio
npm install
npm run dev
```

Open http://localhost:3000. Bearer token (dev): `transducin-measure-dev-token`.

## Test

```bash
npm test
npm run build
npm run test:app-up
```

## Honesty

Soft-sim only. Not clinical deployment. Not live PACS write-back. Not diagnostic use. Not the authors’ system.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.14.26357256v2  
Authors’ code: none published.

Offline demo: [try.html](./try.html)
