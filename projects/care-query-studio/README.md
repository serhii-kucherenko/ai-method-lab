# Care Query Studio

Soft-sim studio for comparing **multilingual point-of-care medical query LLMs** to a **local clinician baseline** before locking a query pack.

## Run

```bash
cd projects/care-query-studio
npm install
npm run dev
```

Open http://localhost:3000 — primary CTA → `/queries`.

## Tests

```bash
npm test
npm run build
npm run test:app-up
```

## Honesty

Soft-sim only — not clinical diagnostic use, not live EHR write-back, not FDA cleared, not NigBench, not the authors’ system.

Paper: https://www.medrxiv.org/content/10.64898/2026.07.05.26356776v1 · authors’ code: none published

Offline demo: `try.html`
