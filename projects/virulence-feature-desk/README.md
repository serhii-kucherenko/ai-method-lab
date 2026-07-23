# Virulence Feature Desk

Method-lab product for structural and evolutionary feature integration experiments (virulence / resistance risk sketches), sourced from a simple-papers digest.

## Paper

- **Id:** 10.1186/s40168-026-02467-w
- **Title:** SEVA: structural and evolutionary feature integration for predicting virulence factors and antibiotic resistance genes
- **URL:** https://doi.org/10.1186/s40168-026-02467-w
- **Code:** https://github.com/kaiqili2/SEVA

## What we built

An org desk with feature jobs, lifecycle, scenario compare (sequence-only vs structural+evolutionary), audit, signed webhooks, dual-impl goldens (≥25), offline try page, and honesty fence. Scoring favors virulence / resistance risk when structural and evolutionary signals align.

**Honesty:** Workflow experiment inspired by the paper — not the authors' tool, and not a clinical diagnostic. Display name is always **Virulence Feature Desk**.

## Run

```bash
cd projects/virulence-feature-desk
npm install
npm test
npm start
```

Open `http://127.0.0.1:3847/` or the offline demo at `try.html`.

## Docs

- Product bar: `PRODUCT.md`
- Findings by phase: `FINDINGS.md`
- Tutor guide: `docs/guides/08-virulence-feature-desk-lessons.md`

## Status

Sustain green.
