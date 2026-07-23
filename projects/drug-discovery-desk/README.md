# Drug Discovery Desk

Method-lab product for disease-conditioned molecule suggestion experiments, sourced from a simple-papers digest.

## Paper

- **Id:** 2607.08404
- **Title:** DrugGen 2: A disease-aware language model for enhancing drug discovery
- **URL:** https://arxiv.org/abs/2607.08404v1
- **Code:** https://github.com/alimotahharynia/DrugGen-2

## What we built

An org desk with discovery jobs, lifecycle, scenario compare (unconditioned vs disease-aware), audit, signed webhooks, dual-impl goldens (≥25), offline try page, and honesty fence. Scoring favors candidates whose indication tags align with disease context.

**Honesty:** Workflow experiment inspired by the paper — not the authors' model, and not a wet-lab or regulatory product. Display name is always **Drug Discovery Desk**.

## Run

```bash
cd projects/drug-discovery-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` or the offline demo at `try.html`.

## Docs

- Product bar: `PRODUCT.md`
- Findings by phase: `FINDINGS.md`
- Tutor guide: `docs/guides/07-drug-discovery-desk-lessons.md`

## Status

Sustain green.
